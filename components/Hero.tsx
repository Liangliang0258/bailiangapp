"use client";

import { useIntersectionObserver } from "@/lib/animations";

export default function Hero() {
  const { ref, isVisible } = useIntersectionObserver({ threshold: 0.1 });

  return (
    <section
      ref={ref}
      className={`fade-up ${isVisible ? "visible" : ""} relative min-h-[70vh] flex items-center justify-center overflow-hidden`}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 animated-gradient opacity-10" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white" />

      {/* Floating Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 float" />
      <div className="absolute top-40 right-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 float" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 float" style={{ animationDelay: '4s' }} />

      {/* Content */}
      <div className="relative max-w-4xl mx-auto px-6 py-20 text-center">
        {/* Badge */}
        <div className={`scale-in ${isVisible ? "visible" : ""} inline-flex items-center gap-2 bg-white/80 backdrop-blur px-4 py-2 rounded-full shadow-sm border border-zinc-200 mb-8`}>
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="font-body text-sm font-medium text-zinc-600">用AI创造无限可能</span>
        </div>

        {/* Title */}
        <h1 className="font-heading font-extrabold text-5xl md:text-6xl lg:text-8xl text-zinc-900 mb-6 tracking-tight">
          佰亮的
          <span className="gradient-text">AI百宝箱</span>
        </h1>

        {/* Subtitle */}
        <p className="font-body text-xl md:text-2xl text-zinc-600 mt-6 max-w-2xl mx-auto leading-relaxed">
          探索我用AI创造的有趣小工具和小游戏
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
          <a
            href="#portfolio"
            className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-heading font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              浏览作品
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
            <div className="absolute inset-0 shimmer" />
          </a>
          <a
            href="#contact"
            className="px-8 py-4 bg-white text-zinc-700 font-heading font-semibold rounded-xl border-2 border-zinc-200 hover:border-zinc-300 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
          >
            联系我
          </a>
        </div>

        {/* Stats */}
        <div className={`fade-in ${isVisible ? "visible" : ""} flex flex-wrap justify-center gap-8 mt-16 pt-16 border-t border-zinc-200`}>
          <div className="text-center">
            <div className="font-heading font-bold text-3xl text-zinc-900">8+</div>
            <div className="font-body text-sm text-zinc-500 mt-1">创意作品</div>
          </div>
          <div className="text-center">
            <div className="font-heading font-bold text-3xl text-zinc-900">AI</div>
            <div className="font-body text-sm text-zinc-500 mt-1">辅助开发</div>
          </div>
          <div className="text-center">
            <div className="font-heading font-bold text-3xl text-zinc-900">∞</div>
            <div className="font-body text-sm text-zinc-500 mt-1">创意可能</div>
          </div>
        </div>
      </div>
    </section>
  );
}
