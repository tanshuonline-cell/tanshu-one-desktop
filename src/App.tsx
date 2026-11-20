import PhotoStudio from "./PhotoStudio";
import brandAvatar from "./assets/tanshu-online-dp.jpg";
import PDFMaster from "./PDFMaster";
import ToolWorkspaces from "./ToolWorkspaces";
import HomeDashboard from "./HomeDashboard";
import { useMemo, useState } from "react";
import {
  Aperture, ArrowUpRight, BadgeIndianRupee, BriefcaseBusiness,
  Calculator, ChevronDown, ChevronRight, CircleHelp, Command,
  CreditCard, FileImage, FileText, FolderOpen, GraduationCap, Grid2X2,
  HardDrive, Languages, LayoutDashboard, LifeBuoy, Menu, MessageCircle,
  PanelLeftClose, Search, Settings2, ShieldCheck, Sparkles,
  WalletCards, X
} from "lucide-react";

type ModuleItem = {
  title: string;
  description: string;
  icon: typeof Aperture;
  group: string;
  tone: string;
  status?: string;
};

const modules: ModuleItem[] = [
  { title: "Auto Passport Photo Maker", description: "Automatic passport photo layouts, print sheets and photo preparation", icon: Aperture, group: "Creative Studio", tone: "cyan", status: "Start creating" },
  { title: "Manual Passport Photo Maker", description: "A separate hands-on photo editing workspace", icon: Aperture, group: "Creative Studio", tone: "violet", status: "Separate workspace" },
  { title: "PVC & ID Studio", description: "Design cards, front and back layouts", icon: CreditCard, group: "Creative Studio", tone: "violet" },
  { title: "Photo Studio", description: "A separate workspace for detailed photo editing", icon: FileImage, group: "Creative Studio", tone: "blue", status: "Planned workspace" },
  { title: "PDF Master", description: "Merge PDFs, extract pages and rotate documents", icon: FileText, group: "Documents", tone: "coral" },
  { title: "Document Studio", description: "Prepare clean documents for print", icon: FileImage, group: "Documents", tone: "blue" },
  { title: "Image & File Tools", description: "Resize and convert images locally", icon: FolderOpen, group: "Documents", tone: "green" },
  { title: "Resume & Career", description: "Create resumes, CVs and biodata", icon: BriefcaseBusiness, group: "Business & Career", tone: "amber" },
  { title: "Invoice & Business", description: "Invoices, receipts and quotations", icon: BadgeIndianRupee, group: "Business & Career", tone: "green" },
  { title: "Education & Exam Desk", description: "Useful study and exam utilities", icon: GraduationCap, group: "Everyday Tools", tone: "blue" },
  { title: "Banking & Finance", description: "Everyday financial calculators", icon: WalletCards, group: "Everyday Tools", tone: "violet" },
  { title: "Typing & Language", description: "Typing practice and language tools", icon: Languages, group: "Everyday Tools", tone: "coral" },
  { title: "Cyber Cafe Manager", description: "Job slips, work log and customer queue", icon: Calculator, group: "Business & Career", tone: "cyan" },
  { title: "Utility Center", description: "Handy tools for everyday work", icon: Grid2X2, group: "Everyday Tools", tone: "amber" },
];

const navItems = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "All tools", icon: Grid2X2 },
  { label: "My projects", icon: FolderOpen },
];

function App() {
  const [activeNav, setActiveNav] = useState("Overview");
  const [query, setQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedModule, setSelectedModule] = useState<string | null>(() => { try { const key = "tanshu-online-auto-passport-first-open"; if (!window.localStorage.getItem(key)) { window.localStorage.setItem(key, "1"); return "Auto Passport Photo Maker"; } } catch { return "Auto Passport Photo Maker"; } return null; });
  const [showHelp, setShowHelp] = useState(false);

  const filteredModules = useMemo(
    () => modules.filter((item) => `${item.title} ${item.description} ${item.group}`.toLowerCase().includes(query.toLowerCase())),
    [query],
  );

  const openModule = (title: string) => setSelectedModule(title);
  const selected = modules.find((item) => item.title === selectedModule);

  if (selectedModule === "Auto Passport Photo Maker") return <PhotoStudio onBack={() => setSelectedModule(null)} />;
  if (selectedModule === "PDF Master") return <PDFMaster onBack={() => setSelectedModule(null)} />;
  if (selectedModule && selectedModule !== "Settings") return <ToolWorkspaces moduleName={selectedModule} onBack={() => setSelectedModule(null)} />;

  return (
    <div className="app-shell">
      <aside className={`sidebar ${sidebarOpen ? "" : "sidebar-collapsed"}`}>
        <div className="brand-lockup">
          <img className="brand-avatar" src={brandAvatar} alt="TANSHU ONLINE" />
          {sidebarOpen && <div className="brand-copy"><strong>TANSHU<span> ONLINE</span></strong><small>DESKTOP WORKSPACE</small></div>}
          <button className="icon-button sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Toggle sidebar">
            {sidebarOpen ? <PanelLeftClose size={17} /> : <Menu size={18} />}
          </button>
        </div>

        {sidebarOpen && <div className="workspace-switch"><img className="workspace-avatar workspace-avatar-photo" src={brandAvatar} alt="" /><div><strong>My Workspace</strong><small>Local device</small></div><ChevronDown size={15} /></div>}

        <div className="nav-caption">{sidebarOpen ? "WORKSPACE" : ""}</div>
        <nav className="primary-nav">
          {navItems.map(({ label, icon: Icon }) => (
            <button key={label} className={`nav-link ${activeNav === label ? "active" : ""}`} onClick={() => { setActiveNav(label); setSelectedModule(null); }}>
              <Icon size={18} /><span>{sidebarOpen ? label : ""}</span>{sidebarOpen && label === "My projects" && <span className="nav-count">0</span>}
            </button>
          ))}
        </nav>

        {sidebarOpen && <div className="nav-caption tools-caption">YOUR TOOLS</div>}
        <nav className="tool-nav">
          {modules.slice(0, 5).map(({ title, icon: Icon }) => (
            <button key={title} className={`nav-link compact ${selectedModule === title ? "active" : ""}`} onClick={() => openModule(title)}>
              <Icon size={17} /><span>{sidebarOpen ? title : ""}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <button className="nav-link" onClick={() => setShowHelp(true)}><LifeBuoy size={18}/><span>{sidebarOpen ? "Help & support" : ""}</span></button>
          <button className="nav-link" onClick={() => setActiveNav("Settings")}><Settings2 size={18}/><span>{sidebarOpen ? "Settings" : ""}</span></button>
          {sidebarOpen && <div className="offline-card"><div className="offline-indicator"><span/> Offline-ready</div><p>Your workspace is designed to work on this device.</p><div className="offline-foot"><ShieldCheck size={14}/> Your files stay local</div></div>}
          {sidebarOpen && <div className="sidebar-version">TANSHU ONLINE <span>v0.1.0 · Preview</span></div>}
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="breadcrumb"><span>Workspace</span><ChevronRight size={14}/><strong>{selectedModule ?? activeNav}</strong></div>
          <div className="topbar-actions">
            <div className="system-status"><span className="status-dot"/> Local workspace</div>
            <button className="icon-button help-button" onClick={() => setShowHelp(true)} aria-label="Help"><CircleHelp size={18}/></button>
            <div className="profile-chip"><img className="profile-avatar profile-avatar-photo" src={brandAvatar} alt="TANSHU ONLINE profile" /><ChevronDown size={14}/></div>
          </div>
        </header>

        <div className="page-content">
          {selectedModule === "Auto Passport Photo Maker" ? <PhotoStudio onBack={() => setSelectedModule(null)} /> : selectedModule ? (
            <section className="module-placeholder">
              <button className="back-link" onClick={() => setSelectedModule(null)}>← Back to workspace</button>
              <div className={`module-hero-icon tone-${selected?.tone ?? "cyan"}`}>{selected && <selected.icon size={30}/>}</div>
              <div className="eyebrow">TANSHU ONLINE TOOL</div>
              <h1>{selectedModule}</h1>
              <p className="module-lead">{selected?.description}. This workspace is planned and will be built as part of TANSHU ONLINE.</p>
              <div className="coming-soon-panel"><Sparkles size={19}/><div><strong>Workspace foundation</strong><p>The desktop shell is ready. The full tool workflow will be added in the next development phase.</p></div></div>
              <button className="button-primary" onClick={() => setSelectedModule(null)}>Return to dashboard <ArrowUpRight size={16}/></button>
            </section>
          ) : activeNav === "Settings" ? (
            <section className="module-placeholder"><div className="eyebrow">PREFERENCES</div><h1>Settings</h1><p className="module-lead">Application preferences, local storage and privacy controls will live here.</p><div className="coming-soon-panel"><ShieldCheck size={19}/><div><strong>Privacy by design</strong><p>TANSHU ONLINE is being designed as an independent, local-first desktop application.</p></div></div></section>
          ) : activeNav === "My projects" ? (
            <section className="module-placeholder"><div className="eyebrow">YOUR WORK</div><h1>My projects</h1><p className="module-lead">Your saved TANSHU ONLINE projects will appear here.</p><div className="empty-projects"><FolderOpen size={30}/><strong>No projects yet</strong><span>Start with a tool to create your first project.</span><button className="button-primary" onClick={() => setActiveNav("All tools")}>Explore tools <ArrowUpRight size={16}/></button></div></section>
          ) : (
            <>
              <HomeDashboard modules={modules} activeNav={activeNav} onOpenModule={openModule} />

              <footer className="page-footer"><span>© 2026 TANSHU ONLINE</span><span><ShieldCheck size={13}/> Independent · Offline-first · Local by design</span></footer>
            </>
          )}
        </div>
      </main>
      {showHelp && <div className="modal-backdrop" onClick={() => setShowHelp(false)}><section className="help-modal" onClick={(event) => event.stopPropagation()}><button className="icon-button modal-close" onClick={() => setShowHelp(false)} aria-label="Close"><X size={18}/></button><div className="help-icon"><MessageCircle size={23}/></div><div className="eyebrow">TANSHU ONLINE</div><h2>How can we help?</h2><p>This is the first desktop workspace preview. More help content will be added as tools are implemented.</p><div className="help-note"><HardDrive size={17}/> Core tools are being designed to work locally on your PC.</div><button className="button-primary" onClick={() => setShowHelp(false)}>Got it</button></section></div>}
    </div>
  );
}

export default App;