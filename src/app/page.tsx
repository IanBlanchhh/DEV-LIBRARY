"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, ArrowRight, Globe, Layers, Terminal, Brain, GitBranch, Lock } from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  globe: Globe, layers: Layers, terminal: Terminal, brain: Brain, folder: BookOpen,
};

const features = [
  { icon: BookOpen, label: "Rich Documentation", desc: "Step-by-step guides with beautiful formatting" },
  { icon: GitBranch, label: "Graph Explorer", desc: "Obsidian-style interactive knowledge graph" },
  { icon: Lock, label: "Secure Access", desc: "Auth-protected with role-based permissions" },
];

interface Category {
  id: string; name: string; slug: string; description?: string;
  icon: string; color: string; _count?: { docs: number };
}
interface Settings {
  siteName: string; siteTagline: string; backgroundType: string;
  backgroundImage: string; primaryColor: string; accentColor: string;
}

export default function LandingPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<Settings>({
    siteName: "DevLibrary", siteTagline: "Your knowledge base for web & AI",
    backgroundType: "gradient", backgroundImage: "", primaryColor: "#6366f1", accentColor: "#8b5cf6",
  });
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    fetch("/api/init").catch(() => {});
    fetch("/api/auth/me").then((r) => r.json()).then((d) => { if (d.user) setAuthed(true); }).catch(() => {});
    fetch("/api/categories").then((r) => r.json()).then(setCategories).catch(() => {});
    fetch("/api/settings").then((r) => r.json()).then((d) => { if (d.siteName) setSettings((s) => ({ ...s, ...d })); }).catch(() => {});
  }, []);

  const bgStyle = settings.backgroundType === "image" && settings.backgroundImage
    ? { backgroundImage: `linear-gradient(to bottom, rgba(10,10,15,0.7), rgba(10,10,15,0.95)), url(${settings.backgroundImage})`, backgroundSize: "cover", backgroundPosition: "center" }
    : { background: `radial-gradient(ellipse at 20% 50%, ${settings.primaryColor}22 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, ${settings.accentColor}22 0%, transparent 50%), #0a0a0f` };

  return (
    <div className="min-h-screen" style={bgStyle}>
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(99,102,241,1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,1) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl float-animation" style={{ background: settings.primaryColor }} />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-10 blur-3xl float-animation" style={{ background: settings.accentColor, animationDelay: "3s" }} />
      </div>

      <header className="relative z-10 flex items-center justify-between px-6 py-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 font-bold text-xl">
          <BookOpen className="w-7 h-7 text-indigo-400" />
          <span className="gradient-text">{settings.siteName}</span>
        </div>
        <div className="flex items-center gap-3">
          {authed ? (
            <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-medium transition-all hover:shadow-lg hover:shadow-indigo-500/25">
              Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <>
              <Link href="/login" className="text-slate-400 hover:text-white text-sm transition-colors px-3 py-2">Sign In</Link>
              <Link href="/register" className="px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-medium transition-all hover:shadow-lg hover:shadow-indigo-500/25">Get Access</Link>
            </>
          )}
        </div>
      </header>

      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs text-indigo-300 mb-8 border border-indigo-500/30">
          <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse" />
          Documentation hub for developers
        </div>
        <h1 className="text-5xl sm:text-7xl font-bold mb-6 leading-tight tracking-tight">
          <span className="gradient-text">{settings.siteName}</span>
          <br />
          <span className="text-slate-300 text-3xl sm:text-5xl font-normal">{settings.siteTagline}</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-10">
          A beautiful, collaborative documentation library for web development and AI systems. Explore, document, and share knowledge with your team.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link href={authed ? "/dashboard" : "/register"} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-medium transition-all hover:shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-0.5">
            {authed ? "Go to Dashboard" : "Start for Free"} <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href={authed ? "/graph" : "/login"} className="flex items-center gap-2 px-6 py-3 rounded-xl glass hover:bg-white/10 text-slate-300 hover:text-white font-medium transition-all border border-white/10">
            <GitBranch className="w-4 h-4" />
            {authed ? "Explore Graph" : "Sign In"}
          </Link>
        </div>
      </section>

      <section className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {features.map(({ icon: Icon, label, desc }) => (
            <div key={label} className="glass rounded-2xl p-6 hover:bg-white/[0.08] transition-all group">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Icon className="w-5 h-5 text-indigo-400" />
              </div>
              <h3 className="font-semibold text-white mb-1">{label}</h3>
              <p className="text-slate-400 text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {categories.length > 0 && (
        <section className="relative z-10 max-w-7xl mx-auto px-6 py-12">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Browse <span className="gradient-text">Categories</span></h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((cat) => {
              const Icon = iconMap[cat.icon] || BookOpen;
              return (
                <Link key={cat.id} href={authed ? `/category/${cat.slug}` : "/login"} className="group glass rounded-2xl p-6 hover:scale-[1.02] transition-all duration-300 border border-white/5 hover:border-white/20">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all group-hover:scale-110" style={{ background: `${cat.color}22`, border: `1px solid ${cat.color}44` }}>
                    <Icon className="w-6 h-6" style={{ color: cat.color }} />
                  </div>
                  <h3 className="font-semibold text-white mb-1 group-hover:text-indigo-300 transition-colors">{cat.name}</h3>
                  <p className="text-slate-400 text-sm mb-3 line-clamp-2">{cat.description}</p>
                  <div className="flex items-center gap-1 text-xs text-slate-500">
                    <span>{cat._count?.docs ?? 0} guides</span>
                    <ArrowRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: cat.color }} />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <footer className="relative z-10 max-w-7xl mx-auto px-6 py-10 mt-10 border-t border-white/5 text-center text-slate-500 text-sm">
        <p>{settings.siteName} — Built for developers, by developers.</p>
      </footer>
    </div>
  );
}
