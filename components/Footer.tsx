export default function Footer() {
  const navLinks = [
    { name: "小游戏", href: "#portfolio" },
    { name: "小工具", href: "#tools" },
    { name: "关于我", href: "#about" },
    { name: "联系我", href: "#contact" },
  ];

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
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-body text-sm text-zinc-400 hover:text-white transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>

          <p className="font-body text-sm text-zinc-500">
            © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
}
