"use client";

import Image from "next/image";
import { useIntersectionObserver } from "@/lib/animations";

export default function About() {
  const { ref, isVisible } = useIntersectionObserver({ threshold: 0.1 });

  return (
    <section
      id="about"
      ref={ref}
      className={`fade-up ${isVisible ? "visible" : ""} py-16 px-6 bg-gradient-to-b from-white to-zinc-50`}
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-zinc-900">
            我是<span className="gradient-text">佰亮</span>
          </h2>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-zinc-200/50 p-8 md:p-12">
          {/* Bio Content */}
          <div className="text-left">
            <p className="font-body text-base text-zinc-600 leading-relaxed">
              哈喽你好，感谢你浏览我的网站。
            </p>
            <p className="font-body text-base text-zinc-600 leading-relaxed mt-3">
              这个网站除了这段话，都是<span className="text-blue-600 font-semibold">AI</span>写的。
            </p>
            <p className="font-body text-base text-zinc-600 leading-relaxed mt-3">
              网站会放一些我用AI做的小工具和小游戏，都是我平时会用的，主打一个简洁干净无广告，因为我受够了那些乱七八糟的广告。
            </p>
            <p className="font-body text-base text-zinc-600 leading-relaxed mt-3">
              欢迎你对产品多提意见，也欢迎提供需求，你可以通过下方联系方式联系到我。
            </p>
            <p className="font-body text-base text-zinc-600 leading-relaxed mt-3">
              感谢～～
            </p>
          </div>

          {/* QR Code */}
          <div className="mt-10 pt-10 border-t border-zinc-200">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
              <div className="text-center">
                <div className="w-40 h-40 mx-auto rounded-xl overflow-hidden border-2 border-zinc-200 hover:border-blue-400 transition-colors">
                  <Image
                    src="/images/qrcode_for_gh_79ec995bb244_258.jpg"
                    alt="公众号二维码"
                    width={160}
                    height={160}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="font-body text-sm font-medium text-zinc-900 mt-3">扫码关注我的公众号：佰亮同学</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
