"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import NavBar from "@/components/NavBar";
import { BookOpen, ArrowLeft, Plus, Globe, Layers, Terminal, Brain, Clock, Tag, PlayCircle, ExternalLink } from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  globe: Globe, layers: Layers, terminal: Terminal, brain: Brain, folder: BookOpen, youtube: PlayCircle,
};

interface Doc { id: string; title: string; description?: string; tags: string; createdAt: string; slug: string; }
interface Category { id: string; name: string; description?: string; icon: string; color: string; docs: Doc[]; }

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [category, setCategory] = useState<Category | null>(null);
  const [user, setUser] = useState<{ role: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/me").then((r) => r.json()).then((d) => { if (!d.user) router.push("/login"); else setUser(d.user); }).catch(() => router.push("/login"));
    fetch(`/api/categories/${slug}`)
      .then((r) => r.json())
      .then(setCategory)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug, router]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#0a0a0f" }}>
      <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!category) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#0a0a0f" }}>
      <div className="text-center">
        <p className="text-slate-400 mb-4">Category not found</p>
        <Link href="/dashboard" className="text-indigo-400 hover:underline">Back to Dashboard</Link>
      </div>
    </div>
  );

  const Icon = iconMap[category.icon] || BookOpen;

  return (
    <div className="min-h-screen" style={{ background: `radial-gradient(ellipse at 30% 20%, ${category.color}15, transparent 50%), #0a0a0f` }}>
      <NavBar />
      <main className="pt-24 pb-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        {/* Header */}
        <div className="flex items-start gap-5 mb-10">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 pulse-glow" style={{ background: `${category.color}22`, border: `2px solid ${category.color}44` }}>
            <Icon className="w-8 h-8" style={{ color: category.color }} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{category.name}</h1>
            <p className="text-slate-400 max-w-2xl">{category.description}</p>
            <div className="flex items-center gap-3 mt-3">
              <span className="text-xs text-slate-500 glass px-3 py-1 rounded-full border border-white/10">
                {category.docs.length} {category.docs.length === 1 ? "guide" : "guides"}
              </span>
              {user?.role === "admin" && (
                <Link href={`/admin?category=${category.id}`} className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 glass px-3 py-1 rounded-full border border-indigo-500/30 transition-colors">
                  <Plus className="w-3 h-3" /> Add Guide
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Docs grid */}
        {category.docs.length === 0 ? (
          <div className="glass rounded-2xl p-16 text-center border border-white/10">
            <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 mb-2">No guides yet in this category</p>
            {user?.role === "admin" && (
              <Link href={`/admin?category=${category.id}`} className="text-indigo-400 hover:underline text-sm">Add the first guide →</Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {category.docs.map((doc, i) => {
              let tags: string[] = [];
              try { tags = JSON.parse(doc.tags); } catch { tags = []; }
              const externalUrl = tags.find((t) => t.startsWith("url:"))?.slice(4) ?? null;
              const visibleTags = tags.filter((t) => !t.startsWith("url:")).slice(0, 2);

              if (externalUrl) {
                return (
                  <div key={doc.id} className="glass rounded-2xl p-6 border flex flex-col" style={{ borderColor: `${category.color}44` }}>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs text-slate-500 glass px-2 py-0.5 rounded-full border border-white/10">#{i + 1}</span>
                      {visibleTags.map((t) => (
                        <span key={t} className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full" style={{ background: `${category.color}22`, color: category.color }}>
                          <Tag className="w-2.5 h-2.5" />{t}
                        </span>
                      ))}
                    </div>
                    <h3 className="font-semibold text-white mb-2">{doc.title}</h3>
                    {doc.description && <p className="text-slate-400 text-sm flex-1 line-clamp-3 mb-4">{doc.description}</p>}
                    <div className="flex items-center gap-2 mt-auto pt-4 border-t border-white/5">
                      <a
                        href={externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white transition-all hover:scale-105"
                        style={{ background: `${category.color}cc`, boxShadow: `0 0 16px ${category.color}66` }}
                      >
                        <PlayCircle className="w-4 h-4" /> Visit Channel
                      </a>
                      <Link href={`/docs/${doc.id}`} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors ml-auto">
                        <ExternalLink className="w-3 h-3" /> Details
                      </Link>
                    </div>
                  </div>
                );
              }

              return (
                <Link key={doc.id} href={`/docs/${doc.id}`} className="group glass rounded-2xl p-6 hover:scale-[1.02] transition-all duration-300 border border-white/5 hover:border-white/20 flex flex-col">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs text-slate-500 glass px-2 py-0.5 rounded-full border border-white/10">#{i + 1}</span>
                    {visibleTags.map((t) => (
                      <span key={t} className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full" style={{ background: `${category.color}22`, color: category.color }}>
                        <Tag className="w-2.5 h-2.5" />{t}
                      </span>
                    ))}
                  </div>
                  <h3 className="font-semibold text-white mb-2 group-hover:text-indigo-300 transition-colors">{doc.title}</h3>
                  {doc.description && <p className="text-slate-400 text-sm flex-1 line-clamp-3">{doc.description}</p>}
                  <div className="flex items-center gap-1 text-xs text-slate-500 mt-4 pt-4 border-t border-white/5">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                    <span className="ml-auto flex items-center gap-1 text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      Read guide <ArrowLeft className="w-3 h-3 rotate-180" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
