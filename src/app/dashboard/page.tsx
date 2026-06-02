"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import NavBar from "@/components/NavBar";
import { BookOpen, ArrowRight, Globe, Layers, Terminal, Brain, Search, Plus, RefreshCw } from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  globe: Globe, layers: Layers, terminal: Terminal, brain: Brain, folder: BookOpen,
};

interface Category {
  id: string; name: string; slug: string; description?: string;
  icon: string; color: string; _count?: { docs: number };
}
interface Doc { id: string; title: string; description?: string; categoryId: string; }

export default function DashboardPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [recentDocs, setRecentDocs] = useState<Doc[]>([]);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<Doc[]>([]);
  const [user, setUser] = useState<{ name?: string; email: string; role: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => { if (!d.user) { router.push("/login"); } else setUser(d.user); })
      .catch(() => router.push("/login"));
    fetch("/api/categories").then((r) => r.json()).then(setCategories).catch(() => {});
    fetch("/api/docs").then((r) => r.json()).then((docs: Doc[]) => setRecentDocs(docs.slice(0, 6))).catch(() => {});
  }, [router]);

  useEffect(() => {
    if (!search.trim()) { setSearchResults([]); return; }
    const timeout = setTimeout(() => {
      fetch(`/api/docs?q=${encodeURIComponent(search)}`)
        .then((r) => r.json()).then(setSearchResults).catch(() => {});
    }, 300);
    return () => clearTimeout(timeout);
  }, [search]);

  if (!user) return null;

  return (
    <div className="min-h-screen" style={{ background: "radial-gradient(ellipse at 20% 10%, #6366f115, transparent 50%), #0a0a0f" }}>
      <NavBar />
      <main className="pt-24 pb-16 px-4 sm:px-6 max-w-7xl mx-auto">
        {/* Welcome */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white mb-1">
            Welcome back, <span className="gradient-text">{user.name || user.email.split("@")[0]}</span> 👋
          </h1>
          <p className="text-slate-400">Your documentation hub — browse, search, or add new guides.</p>
        </div>

        {/* Search */}
        <div className="relative mb-10 max-w-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search documentation..."
            className="w-full glass border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors text-sm"
          />
          {searchResults.length > 0 && (
            <div className="absolute top-full mt-2 w-full glass rounded-xl border border-white/10 overflow-hidden z-20 shadow-2xl">
              {searchResults.map((doc) => (
                <Link key={doc.id} href={`/docs/${doc.id}`} className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0">
                  <BookOpen className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                  <span className="text-sm text-white">{doc.title}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Category grid */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-semibold text-white">Categories</h2>
            {user.role === "admin" && (
              <Link href="/admin" className="flex items-center gap-1.5 text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
                <Plus className="w-4 h-4" /> Add Category
              </Link>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((cat) => {
              const Icon = iconMap[cat.icon] || BookOpen;
              return (
                <Link key={cat.id} href={`/category/${cat.slug}`} className="group glass rounded-2xl p-6 hover:scale-[1.02] transition-all duration-300 border border-white/5 hover:border-white/20">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform" style={{ background: `${cat.color}22`, border: `1px solid ${cat.color}44` }}>
                    <Icon className="w-6 h-6" style={{ color: cat.color }} />
                  </div>
                  <h3 className="font-semibold text-white mb-1 group-hover:text-indigo-300 transition-colors">{cat.name}</h3>
                  <p className="text-slate-400 text-sm mb-3 line-clamp-2">{cat.description}</p>
                  <div className="flex items-center text-xs text-slate-500">
                    <span>{cat._count?.docs ?? 0} guides</span>
                    <ArrowRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: cat.color }} />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent docs */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-semibold text-white">Recent Docs</h2>
            <button onClick={() => fetch("/api/docs").then((r) => r.json()).then((d: Doc[]) => setRecentDocs(d.slice(0, 6)))} className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors">
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentDocs.map((doc) => (
              <Link key={doc.id} href={`/docs/${doc.id}`} className="group glass rounded-xl p-5 hover:bg-white/[0.08] transition-all border border-white/5 hover:border-white/15">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <BookOpen className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white text-sm group-hover:text-indigo-300 transition-colors mb-1">{doc.title}</h3>
                    {doc.description && <p className="text-slate-400 text-xs line-clamp-2">{doc.description}</p>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
