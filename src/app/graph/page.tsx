"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import NavBar from "@/components/NavBar";
import {
  ReactFlow, Background, Controls, MiniMap, useNodesState, useEdgesState,
  addEdge, Node, Edge, Connection, Handle, Position, NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { BookOpen, Globe, Layers, Terminal, Brain, FolderOpen, Plus, X, PlayCircle } from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  globe: Globe, layers: Layers, terminal: Terminal, brain: Brain, folder: BookOpen, root: BookOpen, youtube: PlayCircle,
};

function RootNode({ data }: NodeProps) {
  const d = data as { label: string };
  return (
    <div
      className="flex flex-col items-center gap-2 px-5 py-4 rounded-2xl border-2 border-indigo-400 bg-indigo-500/20 backdrop-blur-sm cursor-pointer hover:scale-110 transition-all duration-300"
      style={{ boxShadow: "0 0 30px rgba(99,102,241,0.7), 0 0 60px rgba(99,102,241,0.4), inset 0 0 18px rgba(99,102,241,0.3)" }}
    >
      <BookOpen className="w-6 h-6 text-indigo-200" style={{ filter: "drop-shadow(0 0 8px rgba(129,140,248,0.9))" }} />
      <span className="text-white font-bold text-sm whitespace-nowrap" style={{ textShadow: "0 0 10px rgba(129,140,248,0.8)" }}>{d.label}</span>
      <Handle type="source" position={Position.Bottom} className="opacity-0" />
    </div>
  );
}

function CategoryNode({ data }: NodeProps) {
  const d = data as { label: string; color: string; icon: string };
  const Icon = iconMap[d.icon] || BookOpen;
  return (
    <div
      className="flex flex-col items-center gap-2 px-4 py-3 rounded-xl border backdrop-blur-sm cursor-pointer hover:scale-110 transition-all duration-300"
      style={{
        borderColor: `${d.color}99`,
        background: `${d.color}22`,
        boxShadow: `0 0 20px ${d.color}66, 0 0 40px ${d.color}33, inset 0 0 12px ${d.color}22`,
      }}
    >
      <Icon className="w-5 h-5" style={{ color: d.color, filter: `drop-shadow(0 0 6px ${d.color})` }} />
      <span className="text-white text-xs font-semibold whitespace-nowrap max-w-[120px] text-center leading-tight" style={{ textShadow: `0 0 8px ${d.color}88` }}>{d.label}</span>
      <Handle type="target" position={Position.Top} className="opacity-0" />
      <Handle type="source" position={Position.Bottom} className="opacity-0" />
    </div>
  );
}

function DocNode({ data }: NodeProps) {
  const d = data as { label: string; categoryColor: string };
  return (
    <div
      className="flex items-center gap-2 px-3 py-2 rounded-lg border backdrop-blur-sm cursor-pointer hover:scale-110 transition-all duration-300"
      style={{
        borderColor: `${d.categoryColor}66`,
        background: "rgba(255,255,255,0.05)",
        boxShadow: `0 0 12px ${d.categoryColor}44, inset 0 0 8px ${d.categoryColor}1a`,
      }}
    >
      <BookOpen className="w-3 h-3 flex-shrink-0" style={{ color: d.categoryColor, filter: `drop-shadow(0 0 4px ${d.categoryColor})` }} />
      <span className="text-slate-200 text-[11px] whitespace-nowrap max-w-[100px] overflow-hidden text-ellipsis">{d.label}</span>
      <Handle type="target" position={Position.Top} className="opacity-0" />
    </div>
  );
}

function ProjectNode({ data }: NodeProps) {
  const d = data as { label: string };
  return (
    <div
      className="flex items-center gap-2 px-3 py-2 rounded-lg border border-cyan-400/60 bg-cyan-500/10 backdrop-blur-sm cursor-pointer hover:scale-110 transition-all duration-300"
      style={{ boxShadow: "0 0 14px rgba(6,182,212,0.5), inset 0 0 8px rgba(6,182,212,0.15)" }}
    >
      <FolderOpen className="w-3.5 h-3.5 text-cyan-300 flex-shrink-0" style={{ filter: "drop-shadow(0 0 5px rgba(6,182,212,0.9))" }} />
      <span className="text-cyan-100 text-[11px] whitespace-nowrap max-w-[110px] overflow-hidden text-ellipsis">{d.label}</span>
      <Handle type="target" position={Position.Top} className="opacity-0" />
    </div>
  );
}

const nodeTypes = { root: RootNode, category: CategoryNode, doc: DocNode, project: ProjectNode };

interface Category { id: string; name: string; }

type ModalType = "category" | "doc" | null;

export default function GraphPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [modal, setModal] = useState<ModalType>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [catForm, setCatForm] = useState({ name: "", description: "", color: "#6366f1", icon: "folder" });
  const [docForm, setDocForm] = useState({ title: "", description: "", categoryId: "", content: "" });
  const router = useRouter();

  const loadGraph = useCallback(() => {
    return fetch("/api/graph")
      .then((r) => r.json())
      .then(({ nodes: n, edges: e }) => {
        const typed = n.map((node: Node) => ({
          ...node,
          type: (node.data as { type: string }).type || "doc",
        }));
        setNodes(typed);
        setEdges(e.map((edge: Edge) => ({
          ...edge,
          style: { stroke: "rgba(129,140,248,0.6)", strokeWidth: 2, filter: "drop-shadow(0 0 4px rgba(99,102,241,0.7))" },
          animated: true,
        })));
      })
      .catch(() => {});
  }, [setNodes, setEdges]);

  useEffect(() => {
    fetch("/api/auth/me").then((r) => r.json()).then((d) => {
      if (!d.user) router.push("/login");
      else setIsAdmin(d.user.role === "admin");
    });
    fetch("/api/categories").then((r) => r.json()).then(setCategories).catch(() => {});
    loadGraph().finally(() => setLoading(false));
  }, [router, loadGraph]);

  const onConnect = useCallback((c: Connection) => setEdges((eds) => addEdge(c, eds)), [setEdges]);

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    const d = node.data as { type: string; slug?: string; docId?: string; catId?: string };
    if (d.type === "category" && d.slug) router.push(`/category/${d.slug}`);
    else if (d.type === "doc" && d.docId) router.push(`/docs/${d.docId}`);
    else if (d.type === "project") router.push("/projects");
  }, [router]);

  const submitCategory = async () => {
    setSubmitting(true);
    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(catForm),
    });
    if (res.ok) {
      const newCat = await res.json();
      setCategories((prev) => [...prev, newCat]);
      setCatForm({ name: "", description: "", color: "#6366f1", icon: "folder" });
      setModal(null);
      await loadGraph();
    }
    setSubmitting(false);
  };

  const submitDoc = async () => {
    setSubmitting(true);
    const res = await fetch("/api/docs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...docForm, content: docForm.content || `# ${docForm.title}\n\nAdd content here.` }),
    });
    if (res.ok) {
      setDocForm({ title: "", description: "", categoryId: "", content: "" });
      setModal(null);
      await loadGraph();
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen" style={{ background: "#0a0a0f" }}>
      <NavBar />
      <main className="pt-16 h-screen">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-slate-400 text-sm">Building knowledge graph...</p>
            </div>
          </div>
        ) : (
          <div className="h-full relative">
            {/* Info hint */}
            <div className="absolute top-4 left-4 z-10 glass rounded-xl px-4 py-2 border border-white/10 text-xs text-slate-400">
              <span className="font-medium text-white">Knowledge Graph</span> — click a node to open, scroll to zoom
            </div>

            {/* Admin controls */}
            {isAdmin && (
              <div className="absolute top-4 right-4 z-10 flex gap-2">
                <button
                  onClick={() => setModal("category")}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-white glass border border-indigo-500/40 hover:border-indigo-400 hover:bg-indigo-500/10 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Category
                </button>
                <button
                  onClick={() => setModal("doc")}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-white glass border border-purple-500/40 hover:border-purple-400 hover:bg-purple-500/10 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Doc
                </button>
              </div>
            )}

            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={onNodeClick}
              nodeTypes={nodeTypes}
              fitView
              fitViewOptions={{ padding: 0.2 }}
              minZoom={0.1}
              maxZoom={2}
              style={{ background: "transparent" }}
            >
              <Background color="rgba(99,102,241,0.15)" gap={30} size={1} />
              <Controls className="glass border border-white/10 rounded-xl overflow-hidden" />
              <MiniMap
                style={{ background: "rgba(10,10,15,0.8)", border: "1px solid rgba(255,255,255,0.1)" }}
                nodeColor={(n) => {
                  const t = (n.data as { type: string }).type;
                  if (t === "root") return "#6366f1";
                  if (t === "category") return (n.data as { color: string }).color || "#6366f1";
                  if (t === "project") return "#06b6d4";
                  return "rgba(255,255,255,0.3)";
                }}
                maskColor="rgba(0,0,0,0.5)"
              />
            </ReactFlow>

            {/* Add Category Modal */}
            {modal === "category" && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                <div className="glass border border-white/10 rounded-2xl p-6 w-full max-w-md mx-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-white font-semibold text-lg">Add Category Node</h2>
                    <button onClick={() => setModal(null)} className="text-slate-400 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
                  </div>
                  <input
                    placeholder="Name"
                    value={catForm.name}
                    onChange={(e) => setCatForm({ ...catForm, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                  <input
                    placeholder="Description (optional)"
                    value={catForm.description}
                    onChange={(e) => setCatForm({ ...catForm, description: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <label className="text-xs text-slate-400 mb-1 block">Icon</label>
                      <select
                        value={catForm.icon}
                        onChange={(e) => setCatForm({ ...catForm, icon: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500"
                      >
                        <option value="folder">Folder</option>
                        <option value="globe">Globe</option>
                        <option value="layers">Layers</option>
                        <option value="terminal">Terminal</option>
                        <option value="brain">Brain</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 mb-1 block">Color</label>
                      <input
                        type="color"
                        value={catForm.color}
                        onChange={(e) => setCatForm({ ...catForm, color: e.target.value })}
                        className="h-[42px] w-16 rounded-xl border border-white/10 bg-white/5 cursor-pointer px-1 py-1"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 pt-1">
                    <button onClick={() => setModal(null)} className="flex-1 py-2.5 rounded-xl glass border border-white/10 text-slate-300 text-sm hover:text-white transition-colors">Cancel</button>
                    <button
                      onClick={submitCategory}
                      disabled={!catForm.name || submitting}
                      className="flex-1 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-medium disabled:opacity-40 transition-colors"
                    >
                      {submitting ? "Creating..." : "Create"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Add Doc Modal */}
            {modal === "doc" && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                <div className="glass border border-white/10 rounded-2xl p-6 w-full max-w-md mx-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-white font-semibold text-lg">Add Doc Node</h2>
                    <button onClick={() => setModal(null)} className="text-slate-400 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
                  </div>
                  <input
                    placeholder="Title"
                    value={docForm.title}
                    onChange={(e) => setDocForm({ ...docForm, title: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                  <input
                    placeholder="Description (optional)"
                    value={docForm.description}
                    onChange={(e) => setDocForm({ ...docForm, description: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                  <select
                    value={docForm.categoryId}
                    onChange={(e) => setDocForm({ ...docForm, categoryId: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-purple-500"
                  >
                    <option value="">Select category…</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                  <textarea
                    placeholder="Initial content (optional — markdown supported)"
                    value={docForm.content}
                    onChange={(e) => setDocForm({ ...docForm, content: e.target.value })}
                    rows={4}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-purple-500 resize-none font-mono"
                  />
                  <div className="flex gap-3 pt-1">
                    <button onClick={() => setModal(null)} className="flex-1 py-2.5 rounded-xl glass border border-white/10 text-slate-300 text-sm hover:text-white transition-colors">Cancel</button>
                    <button
                      onClick={submitDoc}
                      disabled={!docForm.title || !docForm.categoryId || submitting}
                      className="flex-1 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-white text-sm font-medium disabled:opacity-40 transition-colors"
                    >
                      {submitting ? "Creating..." : "Create"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
