"use client";

import { Tool } from "@/lib/data";

interface ToolCardProps {
  tool: Tool;
  index: number;
}

const iconColors = [
  { bg: "bg-blue-100", text: "text-blue-600" },
  { bg: "bg-purple-100", text: "text-purple-600" },
  { bg: "bg-orange-100", text: "text-orange-600" },
  { bg: "bg-green-100", text: "text-green-600" },
];

const icons = [
  // Code/JSON
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />,
  // Edit/Markdown
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />,
  // Convert/Base64
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />,
  // Search/Regex
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />,
];

export default function ToolCard({ tool, index }: ToolCardProps) {
  const colors = iconColors[index % iconColors.length];
  const iconSvg = icons[index % icons.length];

  return (
    <div className="group bg-white rounded-2xl border border-zinc-200/50 shadow-sm hover:shadow-xl hover:border-zinc-300 hover:-translate-y-2 transition-all duration-500 cursor-pointer overflow-hidden">
      <div className="p-6">
        {/* Icon */}
        <div className={`w-14 h-14 ${colors.bg} rounded-xl p-3 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
          <svg className={`w-8 h-8 ${colors.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {iconSvg}
          </svg>
        </div>

        {/* Content */}
        <h3 className="font-heading font-semibold text-xl text-zinc-900 mt-4 group-hover:text-blue-600 transition-colors">
          {tool.title}
        </h3>
        <p className="font-body text-sm text-zinc-600 mt-2 line-clamp-2">
          {tool.description}
        </p>

        {/* Action Link */}
        <a
          href={tool.link}
          className="mt-4 inline-flex items-center gap-2 text-blue-600 font-body font-medium text-sm group-hover:gap-3 transition-all"
        >
          立即使用
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </a>
      </div>
    </div>
  );
}
