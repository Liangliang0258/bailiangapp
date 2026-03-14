"use client";

import { useIntersectionObserver } from "@/lib/animations";
import { contactInfo } from "@/lib/data";

export default function Contact() {
  const { ref, isVisible } = useIntersectionObserver({ threshold: 0.1 });

  const contactItems = [
    {
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      ),
      label: "邮箱",
      value: contactInfo.email,
      href: `mailto:${contactInfo.email}`,
    },
    {
      icon: (
        <>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </>
      ),
      label: "微信公众号",
      value: "佰亮同学",
      href: null,
    },
    {
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      ),
      label: "抖音/小红书等自媒体平台",
      value: contactInfo.wechatAccount,
      href: null,
    },
  ];

  return (
    <section
      id="contact"
      ref={ref}
      className={`fade-up ${isVisible ? "visible" : ""} py-16 px-6 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 relative overflow-hidden`}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-white">
            联系我
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {contactItems.map((item, index) => (
            <div
              key={index}
              className="group bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {item.icon}
                </svg>
              </div>
              <p className="font-body text-sm text-zinc-400 mb-2">{item.label}</p>
              {item.href ? (
                <a
                  href={item.href}
                  className="font-body text-lg text-white hover:text-blue-400 transition-colors"
                >
                  {item.value}
                </a>
              ) : (
                <p className="font-body text-lg text-white">{item.value}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
