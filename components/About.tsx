"use client";

import { useIntersectionObserver } from "@/lib/animations";
import { skills } from "@/lib/data";

export default function About() {
  const { ref, isVisible } = useIntersectionObserver({ threshold: 0.1 });

  return (
    <section
      id="about"
      ref={ref}
      className={`fade-up ${isVisible ? "visible" : ""} py-24 px-6 bg-gradient-to-b from-white to-zinc-50`}
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-zinc-900">
            我是<span className="gradient-text">佰亮</span>
          </h2>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-zinc-200/50 p-8 md:p-12">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-36 h-36 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-1">
                <div className="w-full h-full rounded-xl bg-white flex items-center justify-center">
                  <svg
                    className="w-20 h-20 text-zinc-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Bio Content */}
            <div className="flex-grow">
              <p className="font-body text-lg text-zinc-600 leading-relaxed">
                一名热爱<span className="text-blue-600 font-semibold">AI</span>的开发者，用Claude等AI工具创作各种有趣的小工具和小游戏。
              </p>
              <p className="font-body text-lg text-zinc-600 leading-relaxed mt-4">
                相信AI能让创意无限延伸，每个作品都是与AI协作的结晶。
              </p>

              {/* Skills */}
              <div className="flex flex-wrap gap-2 mt-6">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 font-body font-medium rounded-full text-sm border border-blue-100"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* QR Code */}
          <div className="mt-10 pt-10 border-t border-zinc-200">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
              <div className="text-center">
                <div className="w-40 h-40 mx-auto bg-white rounded-xl border-2 border-dashed border-zinc-300 flex items-center justify-center hover:border-blue-400 transition-colors">
                  <div className="text-center">
                    <svg
                      className="w-10 h-10 mx-auto text-zinc-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                      />
                    </svg>
                    <p className="font-body text-xs text-zinc-500 mt-2">扫码关注公众号</p>
                  </div>
                </div>
                <p className="font-body text-sm font-medium text-zinc-900 mt-3">佰亮的AI百宝箱</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
