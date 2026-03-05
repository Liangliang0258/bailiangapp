"use client";

import { Game } from "@/lib/data";

interface GameCardProps {
  game: Game;
  index: number;
}

const gradients = [
  "from-blue-400 to-cyan-400",
  "from-purple-400 to-pink-400",
  "from-orange-400 to-red-400",
  "from-green-400 to-emerald-400",
];

export default function GameCard({ game, index }: GameCardProps) {
  const gradient = gradients[index % gradients.length];

  return (
    <div className="group bg-white rounded-2xl border border-zinc-200/50 shadow-sm hover:shadow-xl hover:border-zinc-300 hover:-translate-y-2 transition-all duration-500 cursor-pointer overflow-hidden">
      {/* Preview Image */}
      <div className={`h-48 w-full bg-gradient-to-br ${gradient} flex items-center justify-center relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black/10" />
        <svg
          className="w-20 h-20 text-white/90 relative z-10 group-hover:scale-110 transition-transform duration-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-full">
            <span className="font-body text-sm font-semibold text-zinc-900">点击试玩</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="font-heading font-semibold text-xl text-zinc-900 group-hover:text-blue-600 transition-colors">
          {game.title}
        </h3>
        <p className="font-body text-sm text-zinc-600 mt-2 line-clamp-2">
          {game.description}
        </p>

        {/* Action Link */}
        <a
          href={game.link}
          className="mt-4 inline-flex items-center gap-2 text-blue-600 font-body font-medium text-sm group-hover:gap-3 transition-all"
        >
          立即试玩
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </a>
      </div>
    </div>
  );
}
