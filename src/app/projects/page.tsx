"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NavBar from "@/components/NavBar";
import { FolderOpen, File, ChevronRight, ChevronDown, RefreshCw, Plus, Clock } from "lucide-react";

interface FsItem { name: string; type: "dir" | "file"; children?: FsItem[] | null; }
interface Project {
  id: string; name: string; path: string; description?: string;
  structure: string; updatedAt: string;
  user: { name?: string; email: string };
}

function FileTree({ items, depth = 0 }: { items: FsItem[]; depth?: number }) {
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  return (
    <div className="space-y-0.5">
      {items.map((item, i) => {
        const key = `${depth}-${i}-${item.name}`;
        const isCollapsed = collapsed.has(key);
        return (
          <div key={key}>
            <div
              className="flex items-center gap-1.5 py-0.5 text-xs rounded hover:bg-white/5 cursor-pointer transition-colors"
              style={{ paddingLeft: `${depth * 16 + 4}px` }}
              onClick={() => item.type === "dir" && setCollapsed((s) => { const n = new Set(s); n.has(key) ? n.delete(key) : n.add(key); return n; })}
            >
              {item.type === "dir" ? (
                <>
                  {isCollapsed ? <ChevronRight className="w-3 h-3 text-slate-500 flex-shrink-0" /> : <ChevronDown className="w-3 h-3 text-slate-500 flex-shrink-0" />}
                  <FolderOpen className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0" />
                </>
              ) : (
                <>
                  <span className="w-3 h-3 flex-shrink-0" />
                  <File className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                </>
              )}
              <span className={item.type === "dir" ? "text-slate-300" : "text-slate-400"}>{item.name}</span>
            </div>
            {item.type === "dir" && !isCollapsed && item.children && (
              <FileTree items={item.children as FsItem[]} depth={depth + 1} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selected, setSelected] = useState<Project | null>(null);
  const [newPath, setNewPath] = useState("");
  const [adding, setAdding] = useState(false);
  const [user, setUser] = useState<{ role: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/me").then((r) => r.json()).then((d) => { if (!d.user) router.push("/login"); else setUser(d.user); });
    fetch("/api/projects").then((r) => r.json()).then((data) => { setProjects(Array.isArray(data) ? data : []); });
  }, [router]);

  const addProject = async () => {
    if (!newPath) return;
    setAdding(true);
    const res = await fetch("/api/watcher", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "add", folderPath: newPath }),
    });
    if (res.ok) {
      const p = await res.json();
      setProjects((prev) => [p, ...prev.filter((x) => x.id !== p.id)]);
      setNewPath("");
    }
    setAdding(false);
  };

  const refresh = () => {
    fetch("/api/projects").then((r) => r.json()).then((data) => { setProjects(Array.isArray(data) ? data : []); });
  };

  return (
    <div className="min-h-screen" style={{ background: "radial-gradient(ellipse at 50% 0%, #06b6d415, transparent 50%), #0a0a0f" }}>
      <NavBar />
      <main className="pt-24 pb-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Projects</h1>
            <p className="text-slate-400 text-sm">Filesystem-synced project explorer</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={refresh} className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white glass px-3 py-2 rounded-xl border border-white/10 transition-colors">
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </button>
          </div>
        </div>

        {/* Add project */}
        <div className="glass rounded-2xl p-5 border border-white/10 mb-6 flex items-center gap-3">
          <FolderOpen className="w-5 h-5 text-cyan-400 flex-shrink-0" />
          <input
            value={newPath}
            onChange={(e) => setNewPath(e.target.value)}
            placeholder="/Users/you/projects/my-project"
            className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none font-mono"
          />
          <button onClick={addProject} disabled={adding || !newPath} className="flex items-center gap-1.5 text-sm bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 px-4 py-2 rounded-xl disabled:opacity-50 transition-colors">
            <Plus className="w-3.5 h-3.5" /> {adding ? "Adding..." : "Add Project"}
          </button>
        </div>

        {projects.length === 0 ? (
          <div className="glass rounded-2xl p-16 text-center border border-white/10">
            <FolderOpen className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 mb-2">No projects synced yet</p>
            <p className="text-slate-500 text-sm">Add a folder path above or use the Admin → File Watcher to sync a directory.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Project list */}
            <div className="lg:col-span-1 space-y-3">
              {projects.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelected(selected?.id === p.id ? null : p)}
                  className={`w-full text-left glass rounded-xl p-4 border transition-all ${selected?.id === p.id ? "border-cyan-500/50 bg-cyan-500/10" : "border-white/5 hover:border-white/20"}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <FolderOpen className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                    <span className="text-white text-sm font-medium truncate">{p.name}</span>
                  </div>
                  {p.description && <p className="text-slate-400 text-xs mb-2 line-clamp-1">{p.description}</p>}
                  <p className="text-slate-500 text-xs font-mono truncate">{p.path}</p>
                  <div className="flex items-center gap-1 text-xs text-slate-600 mt-2">
                    <Clock className="w-3 h-3" />
                    {new Date(p.updatedAt).toLocaleDateString()}
                    {user?.role === "admin" && <span className="ml-1 text-slate-500">· {p.user.name || p.user.email}</span>}
                  </div>
                </button>
              ))}
            </div>

            {/* File structure */}
            <div className="lg:col-span-2">
              {selected ? (
                <div className="glass rounded-2xl p-6 border border-white/10 h-full">
                  <div className="flex items-center gap-2 mb-5 pb-4 border-b border-white/5">
                    <FolderOpen className="w-5 h-5 text-cyan-400" />
                    <div>
                      <h3 className="text-white font-semibold">{selected.name}</h3>
                      <p className="text-slate-500 text-xs font-mono">{selected.path}</p>
                    </div>
                  </div>
                  <div className="bg-black/30 rounded-xl p-4 font-mono">
                    {(() => {
                      try {
                        const items = JSON.parse(selected.structure);
                        return Array.isArray(items) ? <FileTree items={items} /> : <p className="text-slate-500 text-xs">No structure data</p>;
                      } catch {
                        return <p className="text-slate-500 text-xs">Unable to parse structure</p>;
                      }
                    })()}
                  </div>
                </div>
              ) : (
                <div className="glass rounded-2xl p-16 text-center border border-white/10 border-dashed h-full flex flex-col items-center justify-center">
                  <FolderOpen className="w-10 h-10 text-slate-700 mb-3" />
                  <p className="text-slate-500 text-sm">Select a project to view its structure</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
