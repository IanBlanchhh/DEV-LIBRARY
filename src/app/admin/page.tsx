"use client";

import { Suspense } from "react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import NavBar from "@/components/NavBar";
import { Settings, Image, Type, Plus, Save, Folder, Globe, Layers, Terminal, Brain, BookOpen, Trash2, RefreshCw, ChevronDown, Sparkles } from "lucide-react";

const ICONS = ["globe", "layers", "terminal", "brain", "folder"];
const iconMap: Record<string, React.ElementType> = {
  globe: Globe, layers: Layers, terminal: Terminal, brain: Brain, folder: BookOpen,
};

interface Category { id: string; name: string; slug: string; description?: string; icon: string; color: string; }
interface SiteSettings {
  siteName: string; siteTagline: string; backgroundType: string;
  backgroundImage: string; primaryColor: string; accentColor: string;
  textColor: string; customCss: string; watchedDirectory: string;
}

type Tab = "appearance" | "categories" | "content" | "watcher";

function AdminContent() {
  const [tab, setTab] = useState<Tab>("appearance");
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: "DevLibrary", siteTagline: "Your knowledge base for web & AI",
    backgroundType: "gradient", backgroundImage: "", primaryColor: "#6366f1",
    accentColor: "#8b5cf6", textColor: "#ffffff", customCss: "", watchedDirectory: "",
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCat, setNewCat] = useState({ name: "", description: "", icon: "folder", color: "#6366f1" });
  const [newDoc, setNewDoc] = useState({ title: "", content: "", description: "", categoryId: "", tags: "" });
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState("");
  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [aiError, setAiError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    fetch("/api/auth/me").then((r) => r.json()).then((d) => {
      if (!d.user || d.user.role !== "admin") router.push("/dashboard");
    });
    fetch("/api/settings").then((r) => r.json()).then((d) => { if (d.siteName) setSettings((s) => ({ ...s, ...d })); });
    fetch("/api/categories").then((r) => r.json()).then(setCategories);

    const cat = searchParams.get("category");
    if (cat) { setTab("content"); setNewDoc((d) => ({ ...d, categoryId: cat })); }
  }, [router, searchParams]);

  const saveSettings = async () => {
    await fetch("/api/settings", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(settings) });
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2000);
  };

  const uploadBg = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const { url } = await res.json();
    setSettings((s) => ({ ...s, backgroundImage: url, backgroundType: "image" }));
    setUploading(false);
  };

  const addCategory = async () => {
    if (!newCat.name) return;
    const res = await fetch("/api/categories", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newCat) });
    const cat = await res.json();
    setCategories((c) => [...c, cat]);
    setNewCat({ name: "", description: "", icon: "folder", color: "#6366f1" });
  };

  const deleteCategory = async (id: string) => {
    if (!confirm("Delete this category and all its guides?")) return;
    await fetch(`/api/categories/${id}`, { method: "DELETE" });
    setCategories((c) => c.filter((cat) => cat.id !== id));
  };

  const addDoc = async () => {
    if (!newDoc.title || !newDoc.categoryId) return;
    const tags = newDoc.tags ? JSON.stringify(newDoc.tags.split(",").map((t) => t.trim())) : "[]";
    await fetch("/api/docs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newDoc, tags }),
    });
    setNewDoc({ title: "", content: "", description: "", categoryId: newDoc.categoryId, tags: "" });
    alert("Guide added!");
  };

  const generateWithAI = async () => {
    if (!newDoc.title) { setAiError("Enter a title first so the AI knows what to write about."); return; }
    setGenerating(true);
    setAiError("");
    const catName = categories.find((c) => c.id === newDoc.categoryId)?.name;
    const res = await fetch("/api/ai/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic: newDoc.title, category: catName, existing: newDoc.content || undefined }),
    });
    const d = await res.json();
    if (res.ok && d.content) {
      setNewDoc((doc) => ({ ...doc, content: d.content }));
    } else {
      setAiError(d.error || "Generation failed.");
    }
    setGenerating(false);
  };

  const syncWatcher = async () => {
    setSyncing(true);
    const res = await fetch("/api/watcher", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "sync" }) });
    const d = await res.json();
    setSyncResult(d.error || `Synced ${d.synced} folder(s)`);
    setSyncing(false);
  };

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "appearance", label: "Appearance", icon: Image },
    { id: "categories", label: "Categories", icon: Folder },
    { id: "content", label: "Add Content", icon: Plus },
    { id: "watcher", label: "File Watcher", icon: RefreshCw },
  ];

  return (
    <div className="min-h-screen" style={{ background: "radial-gradient(ellipse at 80% 20%, #6366f115, transparent 50%), #0a0a0f" }}>
      <NavBar />
      <main className="pt-24 pb-16 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
            <Settings className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
            <p className="text-slate-400 text-sm">Manage your documentation library</p>
          </div>
        </div>

        <div className="flex gap-1 glass rounded-xl p-1 border border-white/10 mb-8 w-fit flex-wrap">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setTab(id)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === id ? "bg-indigo-500 text-white" : "text-slate-400 hover:text-white"}`}>
              <Icon className="w-4 h-4" />{label}
            </button>
          ))}
        </div>

        {tab === "appearance" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-5">
              <div className="glass rounded-2xl p-6 border border-white/10">
                <h3 className="font-semibold text-white mb-4 flex items-center gap-2"><Type className="w-4 h-4 text-indigo-400" /> Site Identity</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">Site Name</label>
                    <input value={settings.siteName} onChange={(e) => setSettings((s) => ({ ...s, siteName: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">Tagline</label>
                    <input value={settings.siteTagline} onChange={(e) => setSettings((s) => ({ ...s, siteTagline: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500" />
                  </div>
                </div>
              </div>
              <div className="glass rounded-2xl p-6 border border-white/10">
                <h3 className="font-semibold text-white mb-4 flex items-center gap-2"><Image className="w-4 h-4 text-indigo-400" /> Colors</h3>
                <div className="grid grid-cols-2 gap-4">
                  {([["Primary Color", "primaryColor"], ["Accent Color", "accentColor"]] as [string, keyof SiteSettings][]).map(([label, key]) => (
                    <div key={key}>
                      <label className="text-xs text-slate-400 mb-1 block">{label}</label>
                      <div className="flex items-center gap-2">
                        <input type="color" value={settings[key] as string} onChange={(e) => setSettings((s) => ({ ...s, [key]: e.target.value }))} className="w-10 h-10 rounded-lg border border-white/10 bg-transparent cursor-pointer" />
                        <input value={settings[key] as string} onChange={(e) => setSettings((s) => ({ ...s, [key]: e.target.value }))} className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm font-mono focus:outline-none" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-5">
              <div className="glass rounded-2xl p-6 border border-white/10">
                <h3 className="font-semibold text-white mb-4 flex items-center gap-2"><Image className="w-4 h-4 text-indigo-400" /> Background</h3>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    {["gradient", "image"].map((t) => (
                      <button key={t} onClick={() => setSettings((s) => ({ ...s, backgroundType: t }))} className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${settings.backgroundType === t ? "bg-indigo-500 text-white" : "glass border border-white/10 text-slate-400 hover:text-white"}`}>
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                      </button>
                    ))}
                  </div>
                  {settings.backgroundType === "image" && (
                    <div>
                      <label className="text-xs text-slate-400 mb-2 block">Upload Background Image</label>
                      <label className="flex items-center gap-2 cursor-pointer glass border border-dashed border-white/20 rounded-xl p-4 hover:border-indigo-500/50 transition-colors">
                        <input type="file" accept="image/*" onChange={uploadBg} className="hidden" />
                        <Image className="w-5 h-5 text-slate-500" />
                        <span className="text-sm text-slate-400">{uploading ? "Uploading..." : "Click to upload image"}</span>
                      </label>
                      {settings.backgroundImage && (
                        <div className="mt-3 rounded-xl overflow-hidden h-32">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={settings.backgroundImage} alt="bg preview" className="w-full h-full object-cover opacity-70" />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="glass rounded-2xl p-6 border border-white/10">
                <h3 className="font-semibold text-white mb-4">Custom CSS</h3>
                <textarea value={settings.customCss} onChange={(e) => setSettings((s) => ({ ...s, customCss: e.target.value }))} placeholder="/* Add custom styles here */" rows={5} className="w-full font-mono text-xs bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-slate-300 focus:outline-none focus:border-indigo-500 resize-none" />
              </div>
              <button onClick={saveSettings} className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all ${settingsSaved ? "bg-green-500 text-white" : "bg-indigo-500 hover:bg-indigo-400 text-white hover:shadow-lg hover:shadow-indigo-500/25"}`}>
                <Save className="w-4 h-4" /> {settingsSaved ? "Saved!" : "Save Settings"}
              </button>
            </div>
          </div>
        )}

        {tab === "categories" && (
          <div className="space-y-6">
            <div className="glass rounded-2xl p-6 border border-white/10">
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2"><Plus className="w-4 h-4 text-indigo-400" /> New Category</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Name *</label>
                  <input value={newCat.name} onChange={(e) => setNewCat((c) => ({ ...c, name: e.target.value }))} placeholder="Category name" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500" />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Description</label>
                  <input value={newCat.description} onChange={(e) => setNewCat((c) => ({ ...c, description: e.target.value }))} placeholder="Brief description" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500" />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Icon</label>
                  <div className="relative">
                    <select value={newCat.icon} onChange={(e) => setNewCat((c) => ({ ...c, icon: e.target.value }))} className="w-full appearance-none bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none">
                      {ICONS.map((i) => <option key={i} value={i}>{i}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Color</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={newCat.color} onChange={(e) => setNewCat((c) => ({ ...c, color: e.target.value }))} className="w-10 h-10 rounded-lg border border-white/10 bg-transparent cursor-pointer" />
                    <input value={newCat.color} onChange={(e) => setNewCat((c) => ({ ...c, color: e.target.value }))} className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm font-mono focus:outline-none" />
                  </div>
                </div>
              </div>
              <button onClick={addCategory} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-medium transition-all">
                <Plus className="w-4 h-4" /> Add Category
              </button>
            </div>
            <div className="glass rounded-2xl p-6 border border-white/10">
              <h3 className="font-semibold text-white mb-4">Existing Categories</h3>
              <div className="space-y-3">
                {categories.map((cat) => {
                  const Icon = iconMap[cat.icon] || BookOpen;
                  return (
                    <div key={cat.id} className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/5">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${cat.color}22` }}>
                        <Icon className="w-4 h-4" style={{ color: cat.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium">{cat.name}</p>
                        <p className="text-slate-400 text-xs truncate">{cat.description}</p>
                      </div>
                      <button onClick={() => deleteCategory(cat.id)} className="text-red-400 hover:text-red-300 p-1.5 rounded-lg hover:bg-red-500/10 transition-colors flex-shrink-0">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {tab === "content" && (
          <div className="glass rounded-2xl p-6 border border-white/10 space-y-5">
            <h3 className="font-semibold text-white flex items-center gap-2"><Plus className="w-4 h-4 text-indigo-400" /> Add Documentation Guide</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Title *</label>
                <input value={newDoc.title} onChange={(e) => setNewDoc((d) => ({ ...d, title: e.target.value }))} placeholder="Guide title" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Category *</label>
                <div className="relative">
                  <select value={newDoc.categoryId} onChange={(e) => setNewDoc((d) => ({ ...d, categoryId: e.target.value }))} className="w-full appearance-none bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none">
                    <option value="">Select category...</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs text-slate-400 mb-1 block">Description</label>
                <input value={newDoc.description} onChange={(e) => setNewDoc((d) => ({ ...d, description: e.target.value }))} placeholder="Short description" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs text-slate-400 mb-1 block">Tags (comma-separated)</label>
                <input value={newDoc.tags} onChange={(e) => setNewDoc((d) => ({ ...d, tags: e.target.value }))} placeholder="e.g. intro, guide, beginner" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500" />
              </div>
              <div className="sm:col-span-2">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs text-slate-400 block">Content (Markdown)</label>
                  <button
                    type="button"
                    onClick={generateWithAI}
                    disabled={generating}
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-gradient-to-r from-violet-500/30 to-fuchsia-500/30 border border-violet-400/40 text-violet-200 hover:from-violet-500/50 hover:to-fuchsia-500/50 disabled:opacity-50 transition-all"
                  >
                    <Sparkles className={`w-3.5 h-3.5 ${generating ? "animate-pulse" : ""}`} />
                    {generating ? "Generating..." : newDoc.content ? "Expand with AI" : "Generate with AI"}
                  </button>
                </div>
                <textarea value={newDoc.content} onChange={(e) => setNewDoc((d) => ({ ...d, content: e.target.value }))} placeholder="# Guide Title&#10;&#10;Write your documentation in Markdown — or click 'Generate with AI' above to draft it for you." rows={16} className="w-full font-mono text-sm bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-slate-300 focus:outline-none focus:border-indigo-500 resize-none" />
                {aiError && (
                  <p className="mt-2 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2">{aiError}</p>
                )}
              </div>
            </div>
            <button onClick={addDoc} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-medium transition-all">
              <Plus className="w-4 h-4" /> Add Guide
            </button>
          </div>
        )}

        {tab === "watcher" && (
          <div className="space-y-6">
            <div className="glass rounded-2xl p-6 border border-white/10">
              <h3 className="font-semibold text-white mb-2 flex items-center gap-2"><Folder className="w-4 h-4 text-indigo-400" /> Mac Filesystem Watcher</h3>
              <p className="text-slate-400 text-sm mb-5">Set a directory on your Mac to watch. When you sync, all top-level folders become project entries with their structure captured.</p>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Watched Directory Path</label>
                  <input value={settings.watchedDirectory} onChange={(e) => setSettings((s) => ({ ...s, watchedDirectory: e.target.value }))} placeholder="/Users/you/projects" className="w-full font-mono bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500" />
                </div>
                <div className="flex gap-3">
                  <button onClick={saveSettings} className="flex items-center gap-2 px-4 py-2 rounded-xl glass border border-white/10 text-slate-300 hover:text-white text-sm transition-colors">
                    <Save className="w-4 h-4" /> Save Path
                  </button>
                  <button onClick={syncWatcher} disabled={syncing} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-medium disabled:opacity-50 transition-all">
                    <RefreshCw className={`w-4 h-4 ${syncing ? "animate-spin" : ""}`} />
                    {syncing ? "Syncing..." : "Sync Now"}
                  </button>
                </div>
                {syncResult && <div className="text-sm text-green-400 bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3">{syncResult}</div>}
              </div>
            </div>
            <div className="glass rounded-2xl p-6 border border-white/10">
              <h3 className="font-semibold text-white mb-2">How it works</h3>
              <ol className="space-y-2 text-sm text-slate-400 list-decimal list-inside">
                <li>Set a directory path above (e.g. <code className="text-indigo-400 text-xs">/Users/you/projects</code>)</li>
                <li>Save the path, then click <strong className="text-white">Sync Now</strong></li>
                <li>Each top-level folder becomes a Project entry in DevLibrary</li>
                <li>The folder&apos;s file structure is captured and displayed in Projects</li>
                <li>Re-sync anytime to pick up new folders or changes</li>
              </ol>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center" style={{ background: "#0a0a0f" }}><div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" /></div>}>
      <AdminContent />
    </Suspense>
  );
}
