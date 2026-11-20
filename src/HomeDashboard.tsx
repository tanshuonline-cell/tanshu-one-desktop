import { useMemo, useState } from "react";
import type { ComponentType } from "react";
import { ArrowUpRight, Aperture, Search, Sparkles, ShieldCheck, Command, ChevronRight } from "lucide-react";

type Tool = {
  title: string;
  description: string;
  icon: ComponentType<{ size?: number }>;
  group: string;
  tone: string;
  status?: string;
};

type Props = {
  modules: Tool[];
  activeNav: string;
  onOpenModule: (title: string) => void;
};

export default function HomeDashboard({ modules, activeNav, onOpenModule }: Props) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(
    () => modules.filter((item) => `${item.title} ${item.description} ${item.group}`.toLowerCase().includes(query.toLowerCase())),
    [modules, query],
  );

  return (
    <div className="premium-home">
      <section className="ph-hero">
        <div className="ph-hero-copy">
          <div className="ph-eyebrow"><span /> THE TANSHU WORKSPACE</div>
          <h1>Make every task<br /><em>feel effortless.</em></h1>
          <p>Your creative studio and everyday work tools, thoughtfully brought together in one place.</p>
          <div className="ph-hero-actions">
            <button className="ph-primary" onClick={() => onOpenModule("Auto Passport Photo Maker")}>Launch photo studio <ArrowUpRight size={16}/></button>
            <div className="ph-local-note"><ShieldCheck size={14}/> Private by design · Works locally</div>
          </div>
        </div>
        <div className="ph-hero-art" aria-hidden="true">
          <div className="ph-halo ph-halo-one"/><div className="ph-halo ph-halo-two"/>
          <div className="ph-art-panel ph-panel-back"><span>STUDIO</span><div className="ph-mini-grid"><i/><i/><i/><i/></div></div>
          <div className="ph-art-panel ph-panel-front"><div className="ph-art-mark"><Aperture size={34}/></div><b>TANSHU</b><small>CREATE · PREPARE · PRINT</small></div>
          <span className="ph-art-star">✦</span><span className="ph-art-dot"/>
        </div>
        <div className="ph-hero-index">01 <span>/</span> YOUR DIGITAL WORKSPACE</div>
      </section>

      <section className="ph-featured">
        <div className="ph-featured-label"><span className="ph-featured-icon"><Aperture size={20}/></span><div><small>FEATURED WORKSPACE</small><strong>Auto Passport Photo Maker</strong><p>Prepare studio-quality passport photos and print-ready sheets.</p></div></div>
        <button onClick={() => onOpenModule("Auto Passport Photo Maker")}>Open studio <ArrowUpRight size={16}/></button>
        <div className="ph-featured-glow"/>
      </section>

      <section className="ph-tools">
        <div className="ph-section-head">
          <div><div className="ph-eyebrow">THE TOOL COLLECTION</div><h2>{activeNav === "All tools" ? "All tools, one workspace." : "A better way to get things done."}</h2><p>Choose a workspace and pick up where your work begins.</p></div>
          <label className="ph-search"><Search size={16}/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search all tools..." /></label>
        </div>
        <div className="ph-tool-grid">
          {filtered.map(({title,description,icon:Icon,group,tone,status},index) => (
            <button className="ph-tool-card" key={title} onClick={() => onOpenModule(title)}>
              <div className="ph-card-top"><span className={`ph-tool-icon ph-tone-${tone}`}><Icon size={20}/></span><span className="ph-card-number">{String(index+1).padStart(2,"0")}</span></div>
              <strong>{title}</strong><p>{description}</p>
              <div className="ph-card-foot"><span>{group}</span><span className="ph-card-open">{status ?? "Explore"} <ArrowUpRight size={13}/></span></div>
            </button>
          ))}
        </div>
        {filtered.length === 0 && <div className="ph-empty">No matching tools. Try another search.</div>}
      </section>
      <div className="ph-bottom-line"><span>DESIGNED FOR FOCUS</span><span><Command size={13}/> YOUR WORK. YOUR SPACE.</span><span>EST. 2026</span></div>
    </div>
  );
}
