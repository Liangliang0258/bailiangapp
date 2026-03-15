// 通用导航栏组件
(function() {
  // 等待 DOM 加载完成
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavbar);
  } else {
    initNavbar();
  }

  function initNavbar() {
    // 创建导航栏 HTML
    const navbarHTML = `
      <nav class="site-navbar">
        <div class="navbar-container">
          <a href="/" class="navbar-logo">
            <div class="logo-icon">B</div>
            <span class="logo-text">佰亮的AI百宝箱</span>
          </a>
          <div class="navbar-links">
            <a href="/#portfolio" class="nav-link">小游戏</a>
            <a href="/#tools" class="nav-link">小工具</a>
            <a href="/#about" class="nav-link">关于我</a>
            <a href="/#contact" class="nav-link">联系我</a>
            <a href="/" class="nav-link home-link">返回首页</a>
          </div>
        </div>
      </nav>
      <style>
        .site-navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid #e4e4e7;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }
        .navbar-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0.75rem 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .navbar-logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          text-decoration: none;
        }
        .logo-icon {
          width: 2rem;
          height: 2rem;
          background: linear-gradient(135deg, #3b82f6, #a855f7);
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 0.875rem;
        }
        .logo-text {
          font-size: 1.125rem;
          font-weight: 600;
          color: #18181b;
        }
        .navbar-links {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }
        .nav-link {
          color: #71717a;
          text-decoration: none;
          font-size: 0.875rem;
          transition: color 0.2s;
        }
        .nav-link:hover {
          color: #3b82f6;
        }
        .home-link {
          background: linear-gradient(135deg, #3b82f6, #a855f7);
          color: white !important;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          font-weight: 500;
        }
        .home-link:hover {
          opacity: 0.9;
        }
        @media (max-width: 640px) {
          .navbar-container {
            padding: 0.75rem 1rem;
          }
          .navbar-links {
            gap: 0.5rem;
          }
          .nav-link {
            font-size: 0.7rem;
            padding: 0.35rem 0.6rem;
          }
          .home-link {
            font-size: 0.7rem;
            padding: 0.35rem 0.6rem;
          }
          .logo-icon {
            width: 1.5rem;
            height: 1.5rem;
            font-size: 0.75rem;
          }
          .logo-text {
            font-size: 0.875rem;
          }
        }
      </style>
    `;

    // 插入导航栏
    document.body.insertAdjacentHTML('afterbegin', navbarHTML);

    // 给页面添加顶部边距，防止内容被导航栏遮挡
    document.body.style.paddingTop = '70px';
  }
})();
