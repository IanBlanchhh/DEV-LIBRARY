"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import NavBar from "@/components/NavBar";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { ArrowLeft, Clock, Tag, Edit, Trash2, Globe, Layers, Terminal, Brain, BookOpen, PlayCircle } from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  globe: Globe, layers: Layers, terminal: Terminal, brain: Brain, folder: BookOpen,
};

interface Doc {
  id: string; title: string; content: string; description?: string;
  tags: string; createdAt: string; updatedAt: string;
  category: { id: string; name: string; slug: string; color: string; icon: string; };
}

export default function DocPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [doc, setDoc] = useState<Doc | null>(null);
  const [user, setUser] = useState<{ role: string } | null>(null);
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/me").then((r) => r.json()).then((d) => { if (!d.user) router.push("/login"); else setUser(d.user); });
    fetch(`/api/docs/${id}`).then((r) => r.json()).then((d) => { setDoc(d); setEditContent(d.content); setEditTitle(d.title); }).finally(() => setLoading(false));
  }, [id, router]);

  const save = async () => {
    setSaving(true);
    const res = await fetch(`/api/docs/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: editTitle, content: editContent }),
    });
    if (res.ok) { const d = await res.json(); setDoc(d); setEditing(false); }
    setSaving(false);
  };

  const remove = async () => {
    if (!confirm("Delete this guide?")) return;
    await fetch(`/api/docs/${id}`, { method: "DELETE" });
    router.push(doc ? `/category/${doc.category.slug}` : "/dashboard");
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#0a0a0f" }}>
      <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!doc) return null;

  let tags: string[] = [];
  try { tags = JSON.parse(doc.tags); } catch { tags = []; }
  const externalUrl = tags.find((t) => t.startsWith("url:"))?.slice(4) ?? null;
  const visibleTags = tags.filter((t) => !t.startsWith("url:"));

  const CatIcon = iconMap[doc.category.icon] || BookOpen;

  return (
    <div className="min-h-screen" style={{ background: `radial-gradient(ellipse at 70% 10%, ${doc.category.color}12, transparent 50%), #0a0a0f` }}>
      <NavBar />
      <main className="pt-24 pb-16 px-4 sm:px-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link href={`/category/${doc.category.slug}`} className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <CatIcon className="w-3.5 h-3.5" />
            {doc.category.name}
          </Link>
          {(user?.role === "admin") && (
            <div className="flex items-center gap-2">
              <button onClick={() => setEditing(!editing)} className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white glass px-3 py-1.5 rounded-lg border border-white/10 transition-colors">
                <Edit className="w-3.5 h-3.5" /> {editing ? "Cancel" : "Edit"}
              </button>
              <button onClick={remove} className="flex items-center gap-1.5 text-sm text-red-400 hover:text-red-300 glass px-3 py-1.5 rounded-lg border border-red-500/20 transition-colors">
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </div>
          )}
        </div>

        {externalUrl && (
          <a
            href={externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 mb-6 px-6 py-4 rounded-2xl border border-red-500/40 bg-red-500/10 hover:bg-red-500/20 hover:scale-[1.01] transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center flex-shrink-0">
              <PlayCircle className="w-5 h-5 text-red-400" />
            </div>
            <div className="flex-1">
              <div className="text-white font-semibold text-sm group-hover:text-red-300 transition-colors">Visit Channel on YouTube</div>
              <div className="text-slate-400 text-xs mt-0.5 truncate">{externalUrl}</div>
            </div>
            <div className="text-xs text-red-400 font-medium px-3 py-1.5 rounded-lg bg-red-500/20 group-hover:bg-red-500/30 transition-colors">
              Open →
            </div>
          </a>
        )}

        <article className="glass rounded-2xl p-8 sm:p-10 border border-white/10">
          {editing ? (
            <div className="space-y-4">
              <input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="w-full text-2xl font-bold bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500" />
              <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} rows={30} className="w-full font-mono text-sm bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-slate-300 focus:outline-none focus:border-indigo-500 resize-none" />
              <div className="flex gap-3">
                <button onClick={save} disabled={saving} className="px-5 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-medium disabled:opacity-50 transition-colors">
                  {saving ? "Saving..." : "Save Changes"}
                </button>
                <button onClick={() => setEditing(false)} className="px-5 py-2 rounded-xl glass border border-white/10 text-slate-300 text-sm hover:text-white transition-colors">Cancel</button>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  {visibleTags.map((t) => (
                    <span key={t} className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full" style={{ background: `${doc.category.color}22`, color: doc.category.color }}>
                      <Tag className="w-3 h-3" />{t}
                    </span>
                  ))}
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">{doc.title}</h1>
                {doc.description && <p className="text-slate-400 text-lg">{doc.description}</p>}
                <div className="flex items-center gap-4 text-xs text-slate-500 mt-4 pt-4 border-t border-white/5">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Created {new Date(doc.createdAt).toLocaleDateString()}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Updated {new Date(doc.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
              <MarkdownRenderer content={doc.content} />
            </>
          )}
        </article>
      </main>
    </div>
  );
}
