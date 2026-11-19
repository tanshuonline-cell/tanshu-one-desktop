import { useMemo, useRef, useState } from "react";
import {
  ArrowDown, ArrowLeft, ArrowUp, ChevronDown, ChevronLeft,
  ChevronRight, Crop, Download, Eye, EyeOff, Hand, ImagePlus, Layers3,
  Minus, MousePointer2, Plus, RotateCw, Scan, Settings2,
  SlidersHorizontal, Type, Trash2, Undo2, Redo2, ZoomIn, ZoomOut, Copy
} from "lucide-react";
import "./PhotoStudio.css";

type Layer = {
  id: string; name: string; kind: "image" | "text"; src?: string; text?: string;
  x: number; y: number; width: number; height: number; rotation: number;
  opacity: number; visible: boolean;
};
type StudioPage = { id: number; name: string; size: string; width: number; height: number; layers: Layer[] };

const makePage = (id: number): StudioPage => ({
  id, name: `Page ${id}`, size: "4 × 6 in", width: 600, height: 900, layers: []
});
const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export default function PhotoStudio({ onBack }: { onBack: () => void }) {
  const [pages, setPages] = useState<StudioPage[]>([makePage(1)]);
  const [pageId, setPageId] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [tool, setTool] = useState("select");
  const [zoom, setZoom] = useState(62);
  const [showPages, setShowPages] = useState(true);
  const [showLayers, setShowLayers] = useState(true);
  const [drag, setDrag] = useState<{ id: string; x: number; y: number; ox: number; oy: number } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const page = pages.find(p => p.id === pageId) ?? pages[0];
  const selected = page.layers.find(l => l.id === selectedId) ?? null;

  const patchLayer = (id: string, patch: Partial<Layer>) => {
    setPages(old => old.map(p => p.id === pageId ? { ...p, layers: p.layers.map(l => l.id === id ? { ...l, ...patch } : l) } : p));
  };
  const addImage = (files: FileList | null) => {
    if (!files) return;
    const additions: Layer[] = Array.from(files).filter(f => f.type.startsWith("image/")).map(file => ({
      id: uid(), name: file.name, kind: "image", src: URL.createObjectURL(file),
      x: 75 + Math.random() * 35, y: 90 + Math.random() * 35,
      width: 300, height: 360, rotation: 0, opacity: 100, visible: true
    }));
    if (additions.length) {
      setPages(old => old.map(p => p.id === pageId ? { ...p, layers: [...p.layers, ...additions] } : p));
      setSelectedId(additions[additions.length - 1].id);
    }
    if (fileRef.current) fileRef.current.value = "";
  };
  const addText = () => {
    const layer: Layer = { id: uid(), name: "Text layer", kind: "text", text: "Your text", x: 145, y: 190, width: 250, height: 70, rotation: 0, opacity: 100, visible: true };
    setPages(old => old.map(p => p.id === pageId ? { ...p, layers: [...p.layers, layer] } : p));
    setSelectedId(layer.id);
  };
  const addPage = () => {
    const next = Math.max(...pages.map(p => p.id)) + 1;
    setPages(old => [...old, makePage(next)]);
    setPageId(next); setSelectedId(null);
  };
  const duplicate = () => {
    if (!selected) return;
    const copy = { ...selected, id: uid(), name: `${selected.name} copy`, x: selected.x + 24, y: selected.y + 24 };
    setPages(old => old.map(p => p.id === pageId ? { ...p, layers: [...p.layers, copy] } : p));
    setSelectedId(copy.id);
  };
  const removeSelected = () => {
    if (!selected) return;
    setPages(old => old.map(p => p.id === pageId ? { ...p, layers: p.layers.filter(l => l.id !== selected.id) } : p));
    setSelectedId(null);
  };
  const moveLayer = (direction: -1 | 1) => {
    if (!selected) return;
    setPages(old => old.map(p => {
      if (p.id !== pageId) return p;
      const arr = [...p.layers]; const i = arr.findIndex(l => l.id === selected.id); const j = i + direction;
      if (i < 0 || j < 0 || j >= arr.length) return p;
      [arr[i], arr[j]] = [arr[j], arr[i]];
      return { ...p, layers: arr };
    }));
  };
  const exportPage = async () => {
    const canvas = document.createElement("canvas");
    canvas.width = page.width; canvas.height = page.height;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (const layer of page.layers) {
      if (!layer.visible) continue;
      ctx.save(); ctx.globalAlpha = layer.opacity / 100;
      ctx.translate(layer.x + layer.width / 2, layer.y + layer.height / 2);
      ctx.rotate(layer.rotation * Math.PI / 180);
      if (layer.kind === "image" && layer.src) {
        const img = new Image(); img.src = layer.src;
        await new Promise<void>(resolve => { img.onload = () => resolve(); img.onerror = () => resolve(); });
        if (img.complete && img.naturalWidth) ctx.drawImage(img, -layer.width / 2, -layer.height / 2, layer.width, layer.height);
      } else {
        ctx.fillStyle = "#202b39"; ctx.font = "bold 38px Segoe UI"; ctx.textBaseline = "middle";
        ctx.fillText(layer.text ?? "", -layer.width / 2, 0, layer.width);
      }
      ctx.restore();
    }
    const a = document.createElement("a"); a.download = `tanshu-one-page-${page.id}.png`; a.href = canvas.toDataURL("image/png"); a.click();
  };
  const pageScale = useMemo(() => zoom / 100, [zoom]);

  return <div className="photo-studio">
    <header className="ps-topbar">
      <button className="ps-back" onClick={onBack}><ArrowLeft size={16}/><span>Workspace</span></button>
      <div className="ps-brand"><span className="ps-brand-mark"><Scan size={17}/></span><strong>Photo Studio</strong><span className="ps-edition">TANSHU ONE</span></div>
      <div className="ps-top-actions">
        <span className="ps-save-state"><i/> Local project</span>
        <button className="ps-tool-btn" title="Undo (coming soon)" disabled><Undo2 size={16}/></button>
        <button className="ps-tool-btn" title="Redo (coming soon)" disabled><Redo2 size={16}/></button>
        <button className="ps-export" onClick={exportPage}><Download size={15}/> Export PNG</button>
      </div>
    </header>
    <div className="ps-toolbar">
      <div className="ps-tool-group">
        <button className={tool === "select" ? "ps-tool active" : "ps-tool"} onClick={() => setTool("select")} title="Select and move"><MousePointer2 size={17}/><span>Select</span></button>
        <button className={tool === "hand" ? "ps-tool active" : "ps-tool"} onClick={() => setTool("hand")} title="Hand tool"><Hand size={17}/></button>
        <button className="ps-tool" onClick={() => fileRef.current?.click()} title="Import images"><ImagePlus size={17}/><span>Import</span></button>
        <button className="ps-tool" onClick={addText} title="Add text"><Type size={17}/><span>Text</span></button>
        <button className={tool === "crop" ? "ps-tool active" : "ps-tool"} onClick={() => setTool("crop")} title="Crop tool"><Crop size={17}/><span>Crop</span></button>
        <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={e => addImage(e.target.files)}/>
      </div>
      <div className="ps-toolbar-divider"/>
      <div className="ps-tool-group ps-context-tools">
        <button className="ps-tool" onClick={duplicate} disabled={!selected}><Copy size={16}/><span>Duplicate</span></button>
        <button className="ps-tool" onClick={() => selected && patchLayer(selected.id, { rotation: selected.rotation + 90 })} disabled={!selected}><RotateCw size={16}/><span>Rotate 90°</span></button>
        <button className="ps-tool" onClick={removeSelected} disabled={!selected}><Trash2 size={16}/><span>Delete</span></button>
      </div>
      <div className="ps-zoom"><button onClick={() => setZoom(z => Math.max(25, z - 5))}><Minus size={14}/></button><span>{zoom}%</span><button onClick={() => setZoom(z => Math.min(125, z + 5))}><Plus size={14}/></button></div>
    </div>
    <div className="ps-body">
      {showPages && <aside className="ps-left-panel">
        <div className="ps-panel-heading"><span>Pages</span><button onClick={addPage} title="Add page"><Plus size={16}/></button></div>
        <div className="ps-page-list">{pages.map(p => <button key={p.id} className={p.id === pageId ? "ps-page-thumb active" : "ps-page-thumb"} onClick={() => { setPageId(p.id); setSelectedId(null); }}><span className="ps-page-paper"><small>{p.layers.length ? p.layers.length + " layers" : "Blank page"}</small></span><span className="ps-page-label">{p.name}</span></button>)}</div>
        <button className="ps-add-page" onClick={addPage}><Plus size={14}/> New page</button>
        <div className="ps-side-note">Each page keeps its own layers and layout.</div>
      </aside>}
      <section className="ps-workspace">
        <div className="ps-canvas-ruler ps-ruler-top"><span>0</span><span>100</span><span>200</span><span>300</span><span>400</span><span>500</span><span>600 px</span></div>
        <div className="ps-canvas-scroll">
          <div className="ps-paper-wrap" style={{ width: page.width * pageScale, height: page.height * pageScale }}>
            <div className="ps-paper" style={{ width: page.width, height: page.height, transform: `scale(${pageScale})` }}>
              {page.layers.filter(l => l.visible).map(layer => <div key={layer.id}
                className={`ps-layer ${selectedId === layer.id ? "selected" : ""} ${layer.kind === "text" ? "text-layer" : ""}`}
                style={{ left: layer.x, top: layer.y, width: layer.width, height: layer.height, opacity: layer.opacity / 100, transform: `rotate(${layer.rotation}deg)` }}
                onPointerDown={e => { if (tool !== "select") return; e.stopPropagation(); setSelectedId(layer.id); setDrag({ id: layer.id, x: e.clientX, y: e.clientY, ox: layer.x, oy: layer.y }); (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); }}
                onPointerMove={e => { if (!drag || drag.id !== layer.id) return; patchLayer(layer.id, { x: Math.max(0, Math.min(page.width - layer.width, drag.ox + (e.clientX - drag.x) / pageScale)), y: Math.max(0, Math.min(page.height - layer.height, drag.oy + (e.clientY - drag.y) / pageScale)) }); }}
                onPointerUp={() => setDrag(null)}>
                {layer.kind === "image" ? <img src={layer.src} draggable={false} alt={layer.name}/> : <span>{layer.text}</span>}
                {selectedId === layer.id && <><i className="ps-handle nw"/><i className="ps-handle ne"/><i className="ps-handle sw"/><i className="ps-handle se"/></>}
              </div>)}
              {page.layers.length === 0 && <div className="ps-empty-page"><div className="ps-empty-icon"><ImagePlus size={24}/></div><strong>Your canvas is ready</strong><span>Import a photo or add a text layer to get started.</span><button onClick={() => fileRef.current?.click()}>Import photo</button></div>}
            </div>
          </div>
        </div>
        <div className="ps-workspace-footer"><span>{page.name} · {page.size}</span><span>{page.width} × {page.height} px · 300 DPI target</span><span className="ps-footer-zoom"><button onClick={() => setZoom(z => Math.max(25,z-5))}><ZoomOut size={14}/></button>{zoom}%<button onClick={() => setZoom(z => Math.min(125,z+5))}><ZoomIn size={14}/></button></span></div>
      </section>
      {showLayers && <aside className="ps-right-panel">
        <div className="ps-right-scroll">
          <div className="ps-panel-heading"><span>Properties</span><Settings2 size={15}/></div>
          {selected ? <>
            <div className="ps-property-title"><span className={`ps-property-icon ${selected.kind}`}>{selected.kind === "image" ? <ImagePlus size={15}/> : <Type size={15}/>}</span><div><strong>{selected.name}</strong><small>{selected.kind === "image" ? "Image layer" : "Text layer"}</small></div></div>
            <div className="ps-prop-section"><div className="ps-section-label">LAYER TRANSFORM</div>
              <label className="ps-slider-row"><span>Scale</span><strong>{Math.round(selected.width / 3)}%</strong><input className="ps-slider scale" type="range" min="30" max="600" value={Math.round(selected.width / 3)} onChange={e => patchLayer(selected.id,{width:Number(e.target.value)*3,height:Math.round(Number(e.target.value)*3*1.2)})}/></label>
              <label className="ps-slider-row"><span>Rotation</span><strong>{selected.rotation}°</strong><input className="ps-slider rotation" type="range" min="-180" max="180" value={selected.rotation} onChange={e => patchLayer(selected.id,{rotation:Number(e.target.value)})}/></label>
              <label className="ps-slider-row"><span>Opacity</span><strong>{selected.opacity}%</strong><input className="ps-slider opacity" type="range" min="0" max="100" value={selected.opacity} onChange={e => patchLayer(selected.id,{opacity:Number(e.target.value)})}/></label>
            </div>
            <div className="ps-prop-section"><div className="ps-section-label">POSITION & SIZE</div><div className="ps-number-grid"><label>X<input type="number" value={Math.round(selected.x)} onChange={e=>patchLayer(selected.id,{x:Number(e.target.value)})}/></label><label>Y<input type="number" value={Math.round(selected.y)} onChange={e=>patchLayer(selected.id,{y:Number(e.target.value)})}/></label><label>W<input type="number" value={Math.round(selected.width)} onChange={e=>patchLayer(selected.id,{width:Math.max(10,Number(e.target.value))})}/></label><label>H<input type="number" value={Math.round(selected.height)} onChange={e=>patchLayer(selected.id,{height:Math.max(10,Number(e.target.value))})}/></label></div></div>
            {selected.kind === "text" && <div className="ps-prop-section"><div className="ps-section-label">TEXT CONTENT</div><textarea className="ps-text-edit" value={selected.text} onChange={e=>patchLayer(selected.id,{text:e.target.value})}/></div>}
            <div className="ps-prop-section"><div className="ps-section-label">ARRANGE</div><div className="ps-arrange"><button onClick={()=>moveLayer(1)} title="Bring forward"><ArrowUp size={15}/></button><button onClick={()=>moveLayer(-1)} title="Send backward"><ArrowDown size={15}/></button><button onClick={duplicate} title="Duplicate"><Copy size={15}/></button><button onClick={removeSelected} title="Delete"><Trash2 size={15}/></button></div></div>
          </> : <div className="ps-no-selection"><SlidersHorizontal size={23}/><strong>No layer selected</strong><span>Select an item on the canvas to edit its properties.</span></div>}
          <div className="ps-panel-heading ps-layers-heading"><span>Layers <small>{page.layers.length}</small></span><Layers3 size={15}/></div>
          <div className="ps-layer-list">{[...page.layers].reverse().map(layer=><div key={layer.id} className={`ps-layer-row ${selectedId===layer.id?"active":""}`}><button className="ps-layer-select" onClick={()=>setSelectedId(layer.id)}><span className="ps-layer-mini">{layer.kind==="image"?<ImagePlus size={14}/>:<Type size={14}/>}</span><span>{layer.name}</span></button><button className="ps-visibility" onClick={()=>patchLayer(layer.id,{visible:!layer.visible})}>{layer.visible?<Eye size={14}/>:<EyeOff size={14}/>}</button></div>)}</div>
        </div>
      </aside>}
    </div>
    <footer className="ps-bottom-bar"><span><span className="ps-green-dot"/> All changes are in this session</span><span>Drag layers to position · Ctrl + scroll to zoom (planned)</span><button onClick={()=>setShowPages(v=>!v)}>{showPages?<ChevronLeft size={14}/>:<ChevronRight size={14}/>} Pages</button><button onClick={()=>setShowLayers(v=>!v)}>Layers <ChevronDown size={14}/></button></footer>
  </div>;
}
