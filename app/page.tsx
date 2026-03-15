"use client";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import GameCard from "@/components/GameCard";
import ToolCard from "@/components/ToolCard";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { games, tools } from "@/lib/data";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <Hero />

      {/* Games Section */}
      <section id="portfolio" className="py-10 md:py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-zinc-900">
              小游戏
            </h2>
            <p className="font-body text-lg text-zinc-600 mt-4 max-w-2xl mx-auto">
              好玩的小游戏，摸鱼时候来一把
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {games.map((game, index) => (
              <GameCard key={game.id} game={game} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section id="tools" className="py-10 md:py-16 px-6 bg-gradient-to-b from-zinc-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-zinc-900">
              小工具
            </h2>
            <p className="font-body text-lg text-zinc-600 mt-4 max-w-2xl mx-auto">
              实用工具，提升效率
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {tools.map((tool, index) => (
              <ToolCard key={tool.id} tool={tool} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <About />

      {/* Contact Section */}
      <Contact />

      {/* Footer */}
      <Footer />
    </main>
  );
}
