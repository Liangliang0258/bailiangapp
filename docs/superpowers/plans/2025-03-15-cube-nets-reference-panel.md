# 立方体展开图参考面板实施计划

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在立体方块展开图识别游戏中添加一个可折叠的参考面板，展示立方体的所有 11 种展开图形态

**Architecture:** 在游戏 HTML 中添加参考面板 DOM 结构，使用 CSS 实现折叠动画，用 JavaScript 生成并渲染 11 种展开图的网格图

**Tech Stack:** 原生 HTML、CSS、JavaScript（无框架依赖）

---

## 文件结构

```
public/games/zhankai/
├── index.html          # 添加按钮和面板 DOM
├── style.css           # 添加面板样式
└── main.js             # 添加数据和渲染逻辑
```

---

## Chunk 1: 添加按钮和面板 DOM 结构

### Task 1.1: 在 HTML 中添加触发按钮

**Files:**
- Modify: `public/games/zhankai/index.html`

- [ ] **Step 1: 找到 `#cube-section` 中的 `.cube-hint` 元素**

位置：在 `<p class="cube-hint">💡 拖拽立方体查看六面图形，找出网格中能组成正确展开图的 6 个格子</p>` 之后

- [ ] **Step 2: 修改为包裹容器并添加按钮**

将原来的单行：
```html
<p class="cube-hint">💡 拖拽立方体查看六面图形，找出网格中能组成正确展开图的 6 个格子</p>
```

改为：
```html
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
    <!-- 由 JavaScript 生成展开图 -->
  </div>
  <div class="reference-footer">
    <p>💡 这些是立方体所有可能的展开图形态</p>
  </div>
</div>
```

- [ ] **Step 3: 保存文件**

验证：浏览器中能看到按钮显示在立方体下方

---

## Chunk 2: 添加 CSS 样式

### Task 2.1: 添加按钮和面板容器样式

**Files:**
- Modify: `public/games/zhankai/style.css`

- [ ] **Step 1: 在文件末尾添加参考面板样式**

在 `style.css` 文件末尾添加以下 CSS：

```css
/* ========== 参考面板样式 ========== */

/* 提示容器 */
.cube-hint-container {
  text-align: center;
}

.cube-hint {
  font-size: 13px;
  color: #666;
  text-align: center;
  max-width: 350px;
  line-height: 1.6;
  margin-top: 12px;
  padding: 10px 14px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 10px;
}

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
  font-family: inherit;
}

.btn-reference:hover {
  background: var(--accent);
  color: white;
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
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

/* 面板头部 */
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
  font-weight: 600;
}

.reference-close {
  width: 32px;
  height: 32px;
  border: none;
  background: #f0f0f0;
  border-radius: 50%;
  cursor: pointer;
  font-size: 18px;
  font-weight: bold;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
}

.reference-close:hover {
  background: #e0e0e0;
  transform: scale(1.1);
}

/* 面板内容区 */
.reference-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

/* 面板底部 */
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

/* 展开图网格容器 */
.net-grid-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  padding: 10px;
}

/* 单个展开图项 */
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
  display: flex;
  align-items: center;
  justify-content: center;
}

.net-item-name {
  font-size: 13px;
  color: #666;
  font-weight: 500;
}

/* 移动端适配 */
@media (max-width: 720px) {
  .cube-hint-container {
    padding: 0 10px;
  }

  .cube-hint {
    font-size: 11px;
    padding: 8px 10px;
  }

  .btn-reference {
    width: calc(100% - 20px);
    margin-top: 8px;
  }

  .reference-panel {
    width: 95vw;
    max-height: 80vh;
  }

  .reference-header h3 {
    font-size: 16px;
  }

  .net-grid-container {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .net-item-canvas {
    width: 100px;
    height: 100px;
  }

  .net-item-name {
    font-size: 12px;
  }
}
```

- [ ] **Step 2: 保存文件**

验证：浏览器中按钮样式正确

---

## Chunk 3: 添加展开图数据和渲染逻辑

### Task 3.1: 添加展开图数据

**Files:**
- Modify: `public/games/zhankai/main.js`

- [ ] **Step 1: 在文件开头添加展开图数据**

在 `main.js` 文件开头（在常量定义区域）添加：

```javascript
// ========== 立方体展开图数据 ==========
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
  {
    id: 2,
    name: "T 字形",
    grid: [
      [1, 1, 1, 1, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0]
    ]
  },
  {
    id: 3,
    name: "矮 T 字形",
    grid: [
      [1, 0, 0, 0, 0],
      [1, 0, 0, 0, 0],
      [1, 1, 1, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0]
    ]
  },
  {
    id: 4,
    name: "长 Z 字形",
    grid: [
      [1, 0, 0, 0, 0],
      [1, 0, 0, 0, 0],
      [1, 1, 0, 0, 0],
      [0, 1, 1, 0, 0],
      [0, 0, 1, 0, 0]
    ]
  },
  {
    id: 5,
    name: "Z 字形",
    grid: [
      [1, 1, 0, 0, 0],
      [0, 1, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0]
    ]
  },
  {
    id: 6,
    name: "两翼形",
    grid: [
      [1, 1, 0, 0, 0],
      [0, 1, 0, 0, 0],
      [0, 1, 1, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0]
    ]
  },
  {
    id: 7,
    name: "拐杖形",
    grid: [
      [0, 1, 0, 0, 0],
      [1, 1, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0]
    ]
  },
  {
    id: 8,
    name: "楼梯形",
    grid: [
      [1, 1, 0, 0, 0],
      [0, 1, 0, 0, 0],
      [0, 1, 0, 0, 0],
      [0, 1, 1, 0, 0],
      [0, 0, 0, 0, 0]
    ]
  },
  {
    id: 9,
    name: "蛇形",
    grid: [
      [1, 0, 0, 0, 0],
      [1, 0, 0, 0, 0],
      [1, 1, 1, 0, 0],
      [0, 0, 0, 1, 0],
      [0, 0, 0, 1, 0]
    ]
  },
  {
    id: 10,
    name: "弓形",
    grid: [
      [1, 1, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0]
    ]
  },
  {
    id: 11,
    name: "手枪形",
    grid: [
      [0, 0, 1, 0, 0],
      [1, 1, 1, 0, 0],
      [0, 1, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0]
    ]
  }
];
```

- [ ] **Step 2: 保存文件**

---

### Task 3.2: 添加渲染方法

**Files:**
- Modify: `public/games/zhankai/main.js`

- [ ] **Step 1: 在 Game 类的 constructor 中初始化引用面板元素**

找到 `constructor()` 方法，在初始化其他元素后添加：

```javascript
// 在 constructor 末尾添加
this.referencePanel = document.getElementById('referencePanel');
this.toggleReferenceBtn = document.getElementById('toggleReference');
this.closeReferenceBtn = document.getElementById('closeReference');
this.referenceContent = document.getElementById('referenceContent');

// 初始化参考面板
this.initReferencePanel();
```

- [ ] **Step 2: 添加 initReferencePanel 方法**

在 Game 类中添加新方法：

```javascript
initReferencePanel() {
  // 渲染展开图
  this.renderCubeNets();

  // 打开面板
  this.toggleReferenceBtn.addEventListener('click', () => {
    this.referencePanel.classList.remove('hidden');
  });

  // 关闭面板（点击关闭按钮）
  this.closeReferenceBtn.addEventListener('click', () => {
    this.referencePanel.classList.add('hidden');
  });

  // 点击面板外部关闭
  this.referencePanel.addEventListener('click', (e) => {
    if (e.target === this.referencePanel) {
      this.referencePanel.classList.add('hidden');
    }
  });
}
```

- [ ] **Step 3: 添加 renderCubeNets 方法**

```javascript
renderCubeNets() {
  const gridContainer = document.createElement('div');
  gridContainer.className = 'net-grid-container';

  CUBE_NETS.forEach(net => {
    const netItem = document.createElement('div');
    netItem.className = 'net-item';

    const canvas = this.createNetCanvas(net.grid, 120);
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
```

- [ ] **Step 4: 添加 createNetCanvas 方法**

```javascript
createNetCanvas(grid, size) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  const gridSize = grid.length;
  const maxCols = grid[0].length;
  const cellSize = size / 6;
  const padding = 4;

  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < maxCols; x++) {
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
```

- [ ] **Step 5: 保存文件**

---

## Chunk 4: 测试和验证

### Task 4.1: 功能测试

**Files:**
- Test: `public/games/zhankai/` (在浏览器中测试)

- [ ] **Step 1: 在浏览器中打开游戏**

访问：`http://localhost:3000/games/zhankai/`

- [ ] **Step 2: 验证按钮显示**

检查：立方体下方能看到 "📐 查看展开图形态" 按钮

- [ ] **Step 3: 测试打开面板**

操作：点击按钮
预期：面板弹出，显示 11 种展开图

- [ ] **Step 4: 测试关闭面板**

操作：
  - 点击 × 按钮
  - 点击面板外部区域
预期：面板关闭

- [ ] **Step 5: 测试响应式布局**

操作：调整浏览器窗口大小 / 使用移动端
预期：移动端显示 2 列布局，桌面端显示 4 列布局

---

### Task 4.2: 兼容性测试

- [ ] **Step 1: Chrome 浏览器测试**

打开游戏，测试所有功能

- [ ] **Step 2: Safari 浏览器测试**

打开游戏，测试所有功能

- [ ] **Step 3: Firefox 浏览器测试**

打开游戏，测试所有功能

- [ ] **Step 4: 移动端 Safari 测试**

在 iOS 设备上测试

- [ ] **Step 5: 移动端 Chrome 测试**

在 Android 设备上测试

---

## Chunk 5: 代码审查和提交

### Task 5.1: 代码审查

- [ ] **Step 1: 自查代码质量**

检查：
- 代码格式是否一致
- 变量命名是否清晰
- 是否有重复代码

- [ ] **Step 2: 检查是否有语法错误**

打开浏览器控制台，检查是否有 JavaScript 错误

---

### Task 5.2: 提交代码

- [ ] **Step 1: 查看修改的文件**

```bash
git status
```

- [ ] **Step 2: 添加修改的文件**

```bash
git add public/games/zhankai/index.html
git add public/games/zhankai/style.css
git add public/games/zhankai/main.js
```

- [ ] **Step 3: 提交代码**

```bash
git commit -m "feat: 添加立方体展开图参考面板

- 添加📐查看展开图形态按钮
- 展示立方体11种展开图形态
- 支持点击打开/关闭
- 响应式布局（桌面4列，移动2列）
- 无自动交互，纯用户触发"
```

- [ ] **Step 4: 推送到 GitHub**

```bash
git push origin main
```

---

## 验收标准

完成所有任务后，确认以下功能正常：

- [ ] 按钮正确显示在立方体下方
- [ ] 点击按钮能打开参考面板
- [ ] 点击关闭按钮/外部能关闭面板
- [ ] 11 种展开图正确显示
- [ ] 移动端显示 2 列布局
- [ ] 桌面端显示 4 列布局
- [ ] 面板不干扰游戏流程
- [ ] 无 JavaScript 错误
- [ ] 所有浏览器兼容正常
