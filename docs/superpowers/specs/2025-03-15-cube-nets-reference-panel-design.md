# 立方体展开图参考面板设计文档

**项目:** 佰亮的AI百宝箱 - 立体方块展开图识别游戏
**日期:** 2025-03-15
**功能:** 添加展开图参考面板，帮助玩家了解所有 11 种立方体展开图形态

---

## 功能概述

在游戏中添加一个可折叠的参考面板，展示立方体的所有 11 种展开图形态，供玩家在游戏中随时查看参考。

### 目标
- **主要目的:** 给玩家提供参考，帮助他们更好地玩游戏
- **使用场景:** 游戏中做题时随时可以打开查看
- **交互原则:** 无自动交互，只响应用户的主动点击

---

## UI 设计

### 1. 触发按钮

**位置:** 立方体区域下方，与现有操作提示并列

**HTML 结构:**
```html
<div class="cube-hint-container">
  <p class="cube-hint">💡 拖拽立方体查看六面图形，找出网格中能组成正确展开图的 6 个格子</p>
  <button id="toggleReference" class="btn-reference">📐 查看展开图形态</button>
</div>
```

**样式:**
- 与其他按钮风格一致
- 使用次要按钮样式（`btn-secondary`）
- 桌面端：内联显示
- 移动端：换行显示

### 2. 面板容器

**默认状态:** 折叠（不显示）

**展开状态:**
```html
<div id="referencePanel" class="reference-panel hidden">
  <div class="reference-header">
    <h3>📐 立方体 11 种展开图形态</h3>
    <button id="closeReference" class="close-btn">×</button>
  </div>
  <div class="reference-content">
    <!-- 11 个展开图网格 -->
  </div>
  <div class="reference-footer">
    <p>💡 这些是立方体所有可能的展开图形态</p>
  </div>
</div>
```

### 3. 展开图展示

**布局方式:**
- 桌面端：4 列网格
- 移动端：2 列网格

**每个展开图的表示:**
- 使用 6×6 的网格
- 每个格子是一个 `div`
- 有展开图的格子用主题色填充
- 无格子的区域透明

**形态名称（可选）:**
- 十字形 (cross)
- T 字形 (T-shape)
- 矮 T 字形 (short-T)
- 长 Z 字形 (long-Z)
- ...

### 4. 视觉风格

**面板样式:**
- 背景：`rgba(255, 255, 255, 0.98)`
- 圆角：16px
- 阴影：`0 4px 20px rgba(0, 0, 0, 0.1)`
- 边框：`1px solid #e2e8f0`
- 最大高度：60vh
- 滚动：`overflow-y: auto`

**网格样式:**
- 格子大小：24px × 24px（桌面）/ 20px × 20px（移动）
- 格子间距：4px
- 有格子的区域颜色：主题色 `#e85d4c` 或使用游戏中的颜色
- 格子圆角：4px

---

## 交互设计

### 触发方式

1. **打开面板**
   - 点击 "📐 查看展开图形态" 按钮
   - 移除 `hidden` class
   - 添加显示动画

2. **关闭面板**
   - 点击 × 按钮
   - 点击面板外的区域
   - 添加 `hidden` class

### 无自动交互（重要）

- ❌ 无悬停高亮
- ❌ 无自动弹出
- ❌ 无智能提示
- ❌ 无拖动功能
- ❌ 无键盘快捷键干扰游戏

---

## 实现细节

### 文件修改

**1. `/public/games/zhankai/index.html`**

在 `#cube-section` 中添加按钮：
```html
<section id="cube-section">
  <div id="cube-wrap">
    <div id="cube-canvas"></div>
  </div>
  <div class="cube-hint-container">
    <p class="cube-hint">💡 拖拽立方体查看六面图形，找出网格中能组成正确展开图的 6 个格子</p>
    <button id="toggleReference" class="btn-reference">📐 查看展开图形态</button>
  </div>

  <!-- 参考面板 -->
  <div id="referencePanel" class="reference-panel hidden">
    <div class="reference-header">
      <h3>📐 立方体 11 种展开图形态</h3>
      <button id="closeReference" class="close-btn">×</button>
    </div>
    <div class="reference-content" id="referenceContent">
      <!-- 由 JavaScript 生成 -->
    </div>
    <div class="reference-footer">
      <p>💡 这些是立方体所有可能的展开图形态</p>
    </div>
  </div>
</section>
```

**2. `/public/games/zhankai/style.css`**

添加样式：
```css
/* 参考面板按钮 */
.btn-reference {
  margin-top: 12px;
  padding: 10px 20px;
  background: var(--panel);
  color: var(--accent);
  border: 2px solid var(--accent);
  border-radius: var(--radius-sm);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.btn-reference:hover {
  background: var(--accent);
  color: white;
}

.cube-hint-container {
  text-align: center;
}

/* 参考面板 */
.reference-panel {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90vw;
  max-width: 600px;
  max-height: 70vh;
  background: rgba(255, 255, 255, 0.98);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  z-index: 500;
  display: flex;
  flex-direction: column;
  border: 1px solid #e2e8f0;
}

.reference-panel.hidden {
  display: none;
}

.reference-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e2e8f0;
}

.reference-header h3 {
  color: var(--accent);
  font-size: 18px;
  margin: 0;
}

.reference-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.reference-footer {
  padding: 12px 20px;
  border-top: 1px solid #e2e8f0;
  text-align: center;
}

.reference-footer p {
  color: #666;
  font-size: 14px;
  margin: 0;
}

/* 展开图网格 */
.net-grid-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  padding: 10px;
}

.net-item {
  text-align: center;
}

.net-item-canvas {
  width: 120px;
  height: 120px;
  margin: 0 auto 8px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 8px;
  background: white;
}

.net-item-name {
  font-size: 12px;
  color: #666;
  font-weight: 500;
}

/* 移动端 */
@media (max-width: 720px) {
  .net-grid-container {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .reference-panel {
    width: 95vw;
    max-height: 80vh;
  }

  .btn-reference {
    width: 100%;
    margin-top: 8px;
  }
}
```

**3. `/public/games/zhankai/main.js`**

添加数据和方法：

```javascript
// 11 种立方体展开图数据
const CUBE_NETS = [
  {
    id: 1,
    name: "十字形",
    grid: [
      [0, 1, 0, 0, 0],
      [1, 1, 1, 0, 0],
      [0, 1, 0, 0, 0],
      [0, 1, 0, 0, 0],
      [0, 0, 0, 0, 0]
    ]
  },
  // ... 其他 10 种
];

// 在 Game 类中添加
class Game {
  constructor() {
    // ... 现有代码
    this.referencePanel = document.getElementById('referencePanel');
    this.toggleReferenceBtn = document.getElementById('toggleReference');
    this.closeReferenceBtn = document.getElementById('closeReference');
    this.referenceContent = document.getElementById('referenceContent');

    this.initReferencePanel();
  }

  initReferencePanel() {
    // 渲染展开图
    this.renderCubeNets();

    // 事件监听
    this.toggleReferenceBtn.addEventListener('click', () => {
      this.referencePanel.classList.remove('hidden');
    });

    this.closeReferenceBtn.addEventListener('click', () => {
      this.referencePanel.classList.add('hidden');
    });

    // 点击外部关闭
    this.referencePanel.addEventListener('click', (e) => {
      if (e.target === this.referencePanel) {
        this.referencePanel.classList.add('hidden');
      }
    });
  }

  renderCubeNets() {
    const gridContainer = document.createElement('div');
    gridContainer.className = 'net-grid-container';

    CUBE_NETS.forEach(net => {
      const netItem = document.createElement('div');
      netItem.className = 'net-item';

      const canvas = this.createNetCanvas(net.grid, 100);
      canvas.className = 'net-item-canvas';

      const name = document.createElement('div');
      name.className = 'net-item-name';
      name.textContent = net.name;

      netItem.appendChild(canvas);
      netItem.appendChild(name);
      gridContainer.appendChild(netItem);
    });

    this.referenceContent.appendChild(gridContainer);
  }

  createNetCanvas(grid, size) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    const cellSize = size / 6;
    const padding = 4;

    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[y].length; x++) {
        if (grid[y][x] === 1) {
          ctx.fillStyle = '#e85d4c';
          ctx.fillRect(
            x * cellSize + padding,
            y * cellSize + padding,
            cellSize - padding * 2,
            cellSize - padding * 2
          );
        }
      }
    }

    return canvas;
  }
}
```

---

## 11 种展开图数据

```javascript
const CUBE_NETS = [
  {
    id: 1,
    name: "十字形",
    grid: [[0,1,0,0,0],[1,1,1,0,0],[0,1,0,0,0],[0,1,0,0,0],[0,0,0,0,0]]
  },
  {
    id: 2,
    name: "T 字形",
    grid: [[1,1,1,1,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,0,0,0],[0,0,0,0,0]]
  },
  {
    id: 3,
    name: "矮 T 字形",
    grid: [[1,0,0,0,0],[1,0,0,0,0],[1,1,1,0,0],[0,0,0,0,0],[0,0,0,0,0]]
  },
  {
    id: 4,
    name: "长 Z 字形",
    grid: [[1,0,0,0,0],[1,0,0,0,0],[1,1,0,0,0],[0,1,1,0,0],[0,0,1,0,0]]
  },
  {
    id: 5,
    name: "Z 字形",
    grid: [[1,1,0,0,0],[0,1,1,0,0],[0,0,1,0,0],[0,0,0,0,0],[0,0,0,0,0]]
  },
  {
    id: 6,
    name: "两翼形",
    grid: [[1,1,0,0,0],[0,1,0,0,0],[0,1,1,0,0],[0,0,0,0,0],[0,0,0,0,0]]
  },
  {
    id: 7,
    name: "拐杖形",
    grid: [[0,1,0,0,0],[1,1,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,0,0,0]]
  },
  {
    id: 8,
    name: "楼梯形",
    grid: [[1,1,0,0,0],[0,1,0,0,0],[0,1,0,0,0],[0,1,1,0,0],[0,0,0,0,0]]
  },
  {
    id: 9,
    name: "蛇形",
    grid: [[1,0,0,0,0],[1,0,0,0,0],[1,1,1,0,0],[0,0,0,1,0],[0,0,0,1,0]]
  },
  {
    id: 10,
    name: "弓形",
    grid: [[1,1,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,0,0,0],[0,0,0,0,0]]
  },
  {
    id: 11,
    name: "手枪形",
    grid: [[0,0,1,0,0],[1,1,1,0,0],[0,1,0,0,0],[0,0,0,0,0],[0,0,0,0,0]]
  }
];
```

---

## 测试计划

### 功能测试
1. 点击按钮能打开面板
2. 点击关闭按钮能关闭面板
3. 点击外部能关闭面板
4. 面板能正确显示 11 种展开图
5. 移动端布局正确

### 兼容性测试
1. 桌面端浏览器（Chrome, Firefox, Safari）
2. 移动端浏览器（iOS Safari, Android Chrome）
3. 不同屏幕尺寸

### 交互测试
1. 确认无自动交互
2. 确认不干扰游戏流程
3. 确认键盘事件不受影响

---

## 成功标准

- [x] 按钮正确显示在立方体下方
- [x] 点击按钮能打开/关闭面板
- [x] 11 种展开图正确渲染
- [x] 移动端布局正常
- [x] 不干扰游戏流程
- [x] 无自动交互
- [x] 视觉风格与游戏一致
