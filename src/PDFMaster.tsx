import { useState } from "react";
import { PDFDocument, degrees } from "pdf-lib";
import { ArrowLeft, FilePlus2, Files, Scissors, RotateCw, Download, Trash2, ShieldCheck } from "lucide-react";
import "./PDFMaster.css";

type Mode = "merge" | "split" | "rotate";
type InputFile = { file: File; pages: number };
const saveBlob = (bytes: Uint8Array, name: string) => {
  const blob = new Blob([bytes as BlobPart], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = name; a.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
};
export default function PDFMaster({ onBack }: { onBack: () => void }) {
  const [mode,setMode]=useState<Mode>("merge");
  const [files,setFiles]=useState<InputFile[]>([]);
  const [range,setRange]=useState("1");
  const [busy,setBusy]=useState(false);
  const [message,setMessage]=useState("");
  const addFiles=async(list:FileList|null)=>{if(!list)return;const next:InputFile[]=[];for(const file of Array.from(list)){if(file.type!=="application/pdf"&&!file.name.toLowerCase().endsWith(".pdf"))continue;try{const doc=await PDFDocument.load(await file.arrayBuffer());next.push({file,pages:doc.getPageCount()});}catch{setMessage(file.name+" could not be opened. It may be password-protected or damaged.");}}setFiles(v=>[...v,...next]);};
  const run=async()=>{if(!files.length)return;setBusy(true);setMessage("");try{
    if(mode==="merge"){const out=await PDFDocument.create();for(const item of files){const src=await PDFDocument.load(await item.file.arrayBuffer());const pages=await out.copyPages(src,src.getPageIndices());pages.forEach(p=>out.addPage(p));}saveBlob(await out.save(), "tanshu-merged.pdf");setMessage("Merged "+files.length+" PDFs successfully.");}
    if(mode==="split"){const src=await PDFDocument.load(await files[0].file.arrayBuffer());const selected=new Set<number>();for(const part of range.split(",")){const m=part.trim().match(/^(\d+)(?:-(\d+))?$/);if(!m)continue;const start=Number(m[1]),end=Number(m[2]??m[1]);for(let n=Math.max(1,start);n<=Math.min(src.getPageCount(),end);n++)selected.add(n-1);}if(!selected.size)throw new Error("Enter a valid page range, e.g. 1-3,5.");const out=await PDFDocument.create();const pages=await out.copyPages(src,[...selected].sort((x,y)=>x-y));pages.forEach(p=>out.addPage(p));saveBlob(await out.save(),"tanshu-extracted-pages.pdf");setMessage("Exported "+selected.size+" page(s).");}
    if(mode==="rotate"){const src=await PDFDocument.load(await files[0].file.arrayBuffer());src.getPages().forEach(p=>p.setRotation(degrees((p.getRotation().angle+90)%360)));saveBlob(await src.save(),"tanshu-rotated.pdf");setMessage("Rotated all "+src.getPageCount()+" pages by 90°.");}
  }catch(e){setMessage(e instanceof Error?e.message:"PDF operation failed.");}finally{setBusy(false);}};
  return <main className="pdf-workspace"><header className="pdf-head"><button onClick={onBack}><ArrowLeft size={16}/> Workspace</button><div><strong>PDF Master</strong><small>LOCAL PDF WORKSPACE</small></div><span><ShieldCheck size={15}/> Files stay on this device</span></header>
    <section className="pdf-intro"><div className="pdf-kicker">DOCUMENT TOOLS</div><h1>Make PDFs work for you.</h1><p>Merge documents, extract pages or rotate a scanned PDF — right on your PC.</p></section>
    <section className="pdf-main"><nav className="pdf-modes">
      <button className={mode==="merge"?"active":""} onClick={()=>{setMode("merge");setMessage("");}}><Files/>Merge PDFs<small>Combine files into one</small></button>
      <button className={mode==="split"?"active":""} onClick={()=>{setMode("split");setMessage("");}}><Scissors/>Extract pages<small>Save selected pages</small></button>
      <button className={mode==="rotate"?"active":""} onClick={()=>{setMode("rotate");setMessage("");}}><RotateCw/>Rotate pages<small>Turn scanned pages</small></button>
    </nav>
    <div className="pdf-panel"><div className="pdf-panel-title"><div><h2>{mode==="merge"?"Add PDF documents":mode==="split"?"Choose pages to extract":"Choose a PDF to rotate"}</h2><p>{mode==="merge"?"Select two or more files. Their current order will be preserved.":mode==="split"?"Select one PDF and enter page numbers or ranges.":"Select one PDF. Every page will rotate clockwise by 90°."}</p></div><label className="pdf-add"><FilePlus2 size={16}/> Add PDF<input type="file" accept="application/pdf,.pdf" multiple={mode==="merge"} onChange={e=>addFiles(e.target.files)}/></label></div>
    {files.length>0?<div className="pdf-file-list">{files.map((item,i)=><div key={item.file.name+i}><span className="pdf-file-icon">PDF</span><span className="pdf-file-name"><b>{item.file.name}</b><small>{item.pages} pages · {(item.file.size/1024/1024).toFixed(2)} MB</small></span><button onClick={()=>setFiles(v=>v.filter((_,n)=>n!==i))} aria-label="Remove file"><Trash2 size={15}/></button></div>)}</div>:<label className="pdf-drop"><FilePlus2 size={27}/><b>Drop PDF files here</b><span>or click Add PDF to browse your computer</span><input type="file" accept="application/pdf,.pdf" multiple={mode==="merge"} onChange={e=>addFiles(e.target.files)}/></label>}
    {mode==="split"&&files[0]&&<label className="pdf-range">Pages to extract <input value={range} onChange={e=>setRange(e.target.value)} placeholder="Example: 1-3, 5, 8-10"/><small>Available pages: 1–{files[0].pages}</small></label>}
    <div className="pdf-actions"><span>{files.length?files.length+" file(s) selected":"No files selected"}</span><button disabled={!files.length||busy} onClick={run}>{busy?"Working…":mode==="merge"?"Merge & Download":mode==="split"?"Extract & Download":"Rotate & Download"} <Download size={16}/></button></div>
    {message&&<p className="pdf-message" role="status">{message}</p>}</div></section>
    <footer className="pdf-foot">Processing runs locally in TANSHU ONE. Password-protected PDFs are not supported in this first version.</footer>
  </main>;
}