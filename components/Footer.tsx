export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 px-6 bg-zinc-950 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">B</span>
            </div>
            <span className="font-heading font-semibold text-zinc-300">佰亮的AI百宝箱</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="#portfolio" className="font-body text-sm text-zinc-400 hover:text-white transition-colors">
              作品
            </a>
            <a href="#about" className="font-body text-sm text-zinc-400 hover:text-white transition-colors">
              关于
            </a>
            <a href="#contact" className="font-body text-sm text-zinc-400 hover:text-white transition-colors">
              联系
            </a>
          </div>

          <p className="font-body text-sm text-zinc-500">
            © {currentYear}
          </p>
        </div>

        <div className="mt-6 pt-6 border-t border-zinc-900 text-center">
          <p className="font-body text-sm text-zinc-600">
            用 <span className="text-red-500">❤️</span> 和 <span className="gradient-text">AI</span> 构建
          </p>
        </div>
      </div>
    </footer>
  );
}
