/**
 * 立体方块展开图识别小游戏
 * 从零重新实现，包含性能优化、交互增强和音效系统
 */

const THREE = window.THREE;

// ============================================================
// 常量定义
// ============================================================
const CONFIG = {
  GRID_SIZE: 6,
  CELL_SIZE: 96,
  TEXTURE_SIZE: 256,
  CUBE_SIZE: 1.3,
  MAX_ATTEMPTS: 500,
  TIMER_UPDATE_INTERVAL: 100,
};

const SHAPE_POOL = [
  "circle",      // 圆形 - 完全对称
  "square",      // 正方形 - 90° 对称
  "diamond",     // 菱形 - 90° 对称
  "cross",       // 十字 - 90° 对称
  "hexagon",     // 六边形 - 60° 对称
  "octagon",     // 八边形 - 45° 对称
  "hexagram",    // 六芒星 - 60° 对称（两个三角形叠加）
];

const COLOR_MAP = {
  circle: "#2A9D8F",
  square: "#264653",
  diamond: "#3A86FF",
  cross: "#2B59C3",
  hexagon: "#E76F51",
  octagon: "#6C757D",
  hexagram: "#F9C74F",
};

// 立方体6个面的法向量
const NORMALS = [
  [0, 0, 1],   // Front (+Z)
  [0, 0, -1],  // Back (-Z)
  [0, 1, 0],   // Up (+Y)
  [0, -1, 0],  // Down (-Y)
  [-1, 0, 0],  // Left (-X)
  [1, 0, 0],   // Right (+X)
];

// 四个方向
const DIRECTIONS = [
  { dx: 1, dy: 0, name: "right" },
  { dx: -1, dy: 0, name: "left" },
  { dx: 0, dy: -1, name: "up" },
  { dx: 0, dy: 1, name: "down" },
];

// 辅助函数
const NORMAL_KEY = (v) => `${v[0]},${v[1]},${v[2]}`;
const CELL_KEY = (x, y) => `${x},${y}`;

// ============================================================
// 音效系统
// ============================================================
class SoundSystem {
  constructor() {
    this.enabled = true;
    this.context = null;
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    try {
      this.context = new (window.AudioContext || window.webkitAudioContext)();
      this.initialized = true;
    } catch (e) {
      console.warn("Web Audio API not supported");
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  play(type) {
    if (!this.enabled || !this.initialized) return;

    const now = this.context.currentTime;
    const oscillator = this.context.createOscillator();
    const gainNode = this.context.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.context.destination);

    const sounds = {
      select: { freq: 600, duration: 0.05, type: "sine" },
      deselect: { freq: 400, duration: 0.05, type: "sine" },
      submit: { freq: 800, duration: 0.1, type: "sine" },
      correct: { freq: 523, duration: 0.3, type: "sine" },
      wrong: { freq: 200, duration: 0.2, type: "square" },
      click: { freq: 1000, duration: 0.03, type: "sine" },
    };

    const sound = sounds[type] || sounds.click;
    oscillator.type = sound.type;
    oscillator.frequency.setValueAtTime(sound.freq, now);

    gainNode.gain.setValueAtTime(0.15, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + sound.duration);

    oscillator.start(now);
    oscillator.stop(now + sound.duration);
  }

  playVictory() {
    if (!this.enabled || !this.initialized) return;

    const notes = [523, 659, 784, 1047];
    const now = this.context.currentTime;

    notes.forEach((freq, i) => {
      const osc = this.context.createOscillator();
      const gain = this.context.createGain();
      osc.connect(gain);
      gain.connect(this.context.destination);

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + i * 0.1);

      gain.gain.setValueAtTime(0.2, now + i * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.25);

      osc.start(now + i * 0.1);
      osc.stop(now + i * 0.1 + 0.25);
    });
  }
}

// ============================================================
// 图形绘制系统
// ============================================================
class ShapeRenderer {
  static createCanvas(shape, size) {
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    this.drawShape(ctx, shape, size);
    return canvas;
  }

  static drawShape(ctx, shape, size) {
    const padding = size * 0.15;
    const center = size / 2;
    const radius = (size - padding * 2) / 2;

    ctx.clearRect(0, 0, size, size);
    ctx.fillStyle = "#fcfaf5";
    ctx.fillRect(0, 0, size, size);
    ctx.strokeStyle = "#2b2b2b";
    ctx.lineWidth = Math.max(2, size * 0.025);
    ctx.fillStyle = COLOR_MAP[shape] || "#444";

    const draw = {
      circle: () => {
        ctx.beginPath();
        ctx.arc(center, center, radius * 0.82, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      },

      triangle: () => {
        const h = radius * 1.2;
        ctx.beginPath();
        ctx.moveTo(center, center - h * 0.75);
        ctx.lineTo(center - h * 0.7, center + h * 0.6);
        ctx.lineTo(center + h * 0.7, center + h * 0.6);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      },

      pentagram: () => {
        const spikes = 5;
        const outer = radius * 0.95;
        const inner = radius * 0.4;
        ctx.beginPath();
        for (let i = 0; i < spikes * 2; i++) {
          const r = i % 2 === 0 ? outer : inner;
          const angle = (Math.PI / spikes) * i - Math.PI / 2;
          ctx.lineTo(center + Math.cos(angle) * r, center + Math.sin(angle) * r);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      },

      square: () => {
        const side = radius * 1.3;
        ctx.beginPath();
        ctx.rect(center - side / 2, center - side / 2, side, side);
        ctx.fill();
        ctx.stroke();
      },

      diamond: () => {
        const r = radius * 0.95;
        ctx.beginPath();
        ctx.moveTo(center, center - r);
        ctx.lineTo(center + r, center);
        ctx.lineTo(center, center + r);
        ctx.lineTo(center - r, center);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      },

      pentagon: () => {
        const sides = 5;
        const r = radius * 0.95;
        ctx.beginPath();
        for (let i = 0; i < sides; i++) {
          const angle = (Math.PI * 2 * i) / sides - Math.PI / 2;
          const x = center + Math.cos(angle) * r;
          const y = center + Math.sin(angle) * r;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      },

      hexagon: () => {
        const sides = 6;
        const r = radius * 0.95;
        ctx.beginPath();
        for (let i = 0; i < sides; i++) {
          const angle = (Math.PI * 2 * i) / sides - Math.PI / 2;
          const x = center + Math.cos(angle) * r;
          const y = center + Math.sin(angle) * r;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      },

      octagon: () => {
        const sides = 8;
        const r = radius * 0.95;
        ctx.beginPath();
        for (let i = 0; i < sides; i++) {
          const angle = (Math.PI * 2 * i) / sides - Math.PI / 2;
          const x = center + Math.cos(angle) * r;
          const y = center + Math.sin(angle) * r;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      },

      cross: () => {
        const arm = radius * 0.35;
        const long = radius * 0.95;
        ctx.beginPath();
        ctx.moveTo(center - arm, center - long);
        ctx.lineTo(center + arm, center - long);
        ctx.lineTo(center + arm, center - arm);
        ctx.lineTo(center + long, center - arm);
        ctx.lineTo(center + long, center + arm);
        ctx.lineTo(center + arm, center + arm);
        ctx.lineTo(center + arm, center + long);
        ctx.lineTo(center - arm, center + long);
        ctx.lineTo(center - arm, center + arm);
        ctx.lineTo(center - long, center + arm);
        ctx.lineTo(center - long, center - arm);
        ctx.lineTo(center - arm, center - arm);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      },

      hexagram: () => {
        const r = radius * 0.95;
        const angle = Math.PI / 2;
        const tri1 = [
          [center + Math.cos(angle) * r, center - Math.sin(angle) * r],
          [center + Math.cos(angle + (2 * Math.PI) / 3) * r, center - Math.sin(angle + (2 * Math.PI) / 3) * r],
          [center + Math.cos(angle + (4 * Math.PI) / 3) * r, center - Math.sin(angle + (4 * Math.PI) / 3) * r],
        ];
        const tri2 = [
          [center + Math.cos(-angle) * r, center - Math.sin(-angle) * r],
          [center + Math.cos(-angle + (2 * Math.PI) / 3) * r, center - Math.sin(-angle + (2 * Math.PI) / 3) * r],
          [center + Math.cos(-angle + (4 * Math.PI) / 3) * r, center - Math.sin(-angle + (4 * Math.PI) / 3) * r],
        ];
        ctx.beginPath();
        ctx.moveTo(tri1[0][0], tri1[0][1]);
        ctx.lineTo(tri1[1][0], tri1[1][1]);
        ctx.lineTo(tri1[2][0], tri1[2][1]);
        ctx.closePath();
        ctx.moveTo(tri2[0][0], tri2[0][1]);
        ctx.lineTo(tri2[1][0], tri2[1][1]);
        ctx.lineTo(tri2[2][0], tri2[2][1]);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      },
    };

    (draw[shape] || draw.circle)();
  }
}

// ============================================================
// 展开图算法系统
// ============================================================
class NetShapeGenerator {
  static generateFixedPolyominoes(size) {
    let shapes = [[[0, 0]]];

    for (let n = 2; n <= size; n++) {
      const nextMap = new Map();

      for (const shape of shapes) {
        const set = new Set(shape.map(([x, y]) => CELL_KEY(x, y)));
        for (const [x, y] of shape) {
          for (const dir of DIRECTIONS) {
            const nx = x + dir.dx;
            const ny = y + dir.dy;
            const key = CELL_KEY(nx, ny);
            if (set.has(key)) continue;
            const newShape = [...shape, [nx, ny]];
            const canonical = this.canonicalize(newShape);
            if (!nextMap.has(canonical.key)) {
              nextMap.set(canonical.key, canonical.cells);
            }
          }
        }
      }

      shapes = Array.from(nextMap.values());
    }

    return shapes;
  }

  static canonicalize(cells) {
    const xs = cells.map((c) => c[0]);
    const ys = cells.map((c) => c[1]);
    const minX = Math.min(...xs);
    const minY = Math.min(...ys);
    const normalized = cells
      .map(([x, y]) => [x - minX, y - minY])
      .sort((a, b) => a[1] - b[1] || a[0] - b[0]);
    const key = normalized.map(([x, y]) => `${x}:${y}`).join("|");
    return { key, cells: normalized };
  }

  static getBounds(cells) {
    const xs = cells.map((c) => c[0]);
    const ys = cells.map((c) => c[1]);
    return {
      minX: Math.min(...xs),
      maxX: Math.max(...xs),
      minY: Math.min(...ys),
      maxY: Math.max(...ys),
      width: Math.max(...xs) - Math.min(...xs) + 1,
      height: Math.max(...ys) - Math.min(...ys) + 1,
    };
  }

  static countEdges(cells) {
    const set = new Set(cells.map(([x, y]) => CELL_KEY(x, y)));
    let edges = 0;
    for (const [x, y] of cells) {
      if (set.has(CELL_KEY(x + 1, y))) edges += 1;
      if (set.has(CELL_KEY(x, y + 1))) edges += 1;
    }
    return edges;
  }

  static rotateBasis(basis, direction) {
    if (direction === "right") {
      return { R: basis.N, U: basis.U, N: [-basis.R[0], -basis.R[1], -basis.R[2]] };
    }
    if (direction === "left") {
      return { R: [-basis.N[0], -basis.N[1], -basis.N[2]], U: basis.U, N: basis.R };
    }
    if (direction === "up") {
      return { R: basis.R, U: basis.N, N: [-basis.U[0], -basis.U[1], -basis.U[2]] };
    }
    return { R: basis.R, U: [-basis.N[0], -basis.N[1], -basis.N[2]], N: basis.U };
  }

  static vecEqual(a, b) {
    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
  }

  static computeNormals(cells) {
    const set = new Set(cells.map(([x, y]) => CELL_KEY(x, y)));
    const root = cells[0];
    const basisMap = new Map();
    const queue = [];

    basisMap.set(CELL_KEY(root[0], root[1]), {
      R: [1, 0, 0],
      U: [0, 1, 0],
      N: [0, 0, 1],
    });
    queue.push(root);

    while (queue.length) {
      const [x, y] = queue.shift();
      const basis = basisMap.get(CELL_KEY(x, y));
      for (const dir of DIRECTIONS) {
        const nx = x + dir.dx;
        const ny = y + dir.dy;
        const key = CELL_KEY(nx, ny);
        if (!set.has(key)) continue;
        const nextBasis = this.rotateBasis(basis, dir.name);
        if (!basisMap.has(key)) {
          basisMap.set(key, nextBasis);
          queue.push([nx, ny]);
        } else {
          const existing = basisMap.get(key);
          if (!this.vecEqual(existing.N, nextBasis.N)) {
            return null;
          }
        }
      }
    }

    if (basisMap.size !== cells.length) return null;

    const normals = {};
    const normalSet = new Set();
    for (const [x, y] of cells) {
      const basis = basisMap.get(CELL_KEY(x, y));
      const key = CELL_KEY(x, y);
      normals[key] = basis.N;
      normalSet.add(NORMAL_KEY(basis.N));
    }

    if (normalSet.size !== 6) return null;
    return normals;
  }

  static buildValidNetShapes() {
    const shapes = this.generateFixedPolyominoes(6);
    const valid = [];

    for (const cells of shapes) {
      if (this.countEdges(cells) !== 5) continue;
      const normals = this.computeNormals(cells);
      if (!normals) continue;
      const bounds = this.getBounds(cells);
      valid.push({ cells, normals, bounds });
    }

    return valid;
  }

  static buildCubeRotations() {
    const dirs = [
      [1, 0, 0], [-1, 0, 0],
      [0, 1, 0], [0, -1, 0],
      [0, 0, 1], [0, 0, -1],
    ];
    const rotations = [];
    for (const z of dirs) {
      for (const y of dirs) {
        if (z[0] * y[0] + z[1] * y[1] + z[2] * y[2] !== 0) continue;
        const x = [
          y[1] * z[2] - y[2] * z[1],
          y[2] * z[0] - y[0] * z[2],
          y[0] * z[1] - y[1] * z[0],
        ];
        rotations.push({ x, y, z });
      }
    }
    return rotations;
  }

  static rotateVec(v, rot) {
    return [
      v[0] * rot.x[0] + v[1] * rot.y[0] + v[2] * rot.z[0],
      v[0] * rot.x[1] + v[1] * rot.y[1] + v[2] * rot.z[1],
      v[0] * rot.x[2] + v[1] * rot.y[2] + v[2] * rot.z[2],
    ];
  }
}

// ============================================================
// 谜题生成器
// ============================================================
class PuzzleGenerator {
  constructor(validShapes, rotations, gridSize) {
    this.validShapes = validShapes;
    this.rotations = rotations;
    this.gridSize = gridSize;
  }

  setGridSize(gridSize) {
    this.gridSize = gridSize;
  }

  sampleUnique(pool, count) {
    const copy = [...pool];
    const result = [];
    while (result.length < count) {
      const idx = Math.floor(Math.random() * copy.length);
      result.push(copy[idx]);
      copy.splice(idx, 1);
    }
    return result;
  }

  randomChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  randomPlacement(bounds) {
    const maxX = this.gridSize - bounds.width;
    const maxY = this.gridSize - bounds.height;
    if (maxX < 0 || maxY < 0) return null;
    const ox = Math.floor(Math.random() * (maxX + 1));
    const oy = Math.floor(Math.random() * (maxY + 1));
    return { ox, oy };
  }

  buildFaceMap(faceSymbols) {
    const map = {};
    for (let i = 0; i < NORMALS.length; i++) {
      map[NORMAL_KEY(NORMALS[i])] = faceSymbols[i];
    }
    return map;
  }

  countSolutions(grid, faceMap) {
    let count = 0;
    for (const shape of this.validShapes) {
      const { width, height } = shape.bounds;
      for (let oy = 0; oy <= this.gridSize - height; oy++) {
        for (let ox = 0; ox <= this.gridSize - width; ox++) {
          for (const rot of this.rotations) {
            let ok = true;
            for (const [x, y] of shape.cells) {
              const gx = x + ox;
              const gy = y + oy;
              const idx = gy * this.gridSize + gx;
              const normal = shape.normals[CELL_KEY(x, y)];
              const rotated = NetShapeGenerator.rotateVec(normal, rot);
              const expected = faceMap[NORMAL_KEY(rotated)];
              if (grid[idx] !== expected) {
                ok = false;
                break;
              }
            }
            if (ok) {
              count += 1;
              if (count > 1) return count;
            }
          }
        }
      }
    }
    return count;
  }

  generate() {
    let attempts = 0;
    while (attempts < CONFIG.MAX_ATTEMPTS) {
      attempts += 1;
      const faceSymbols = this.sampleUnique(SHAPE_POOL, 6);
      const faceMap = this.buildFaceMap(faceSymbols);
      const netShape = this.randomChoice(this.validShapes);
      const placement = this.randomPlacement(netShape.bounds);
      if (!placement) continue;

      const grid = new Array(this.gridSize * this.gridSize)
        .fill(null)
        .map(() => this.randomChoice(SHAPE_POOL));
      const correct = new Set();

      for (const [x, y] of netShape.cells) {
        const gx = x + placement.ox;
        const gy = y + placement.oy;
        const key = CELL_KEY(x, y);
        const normal = netShape.normals[key];
        const symbol = faceMap[NORMAL_KEY(normal)];
        const idx = gy * this.gridSize + gx;
        grid[idx] = symbol;
        correct.add(idx);
      }

      const solutions = this.countSolutions(grid, faceMap);
      if (solutions === 1) {
        return { grid, correct, faceMap, attempts };
      }
    }

    throw new Error("生成谜题失败，请重试");
  }
}

// ============================================================
// Three.js 3D 渲染系统
// ============================================================
class CubeRenderer {
  constructor(container) {
    this.container = container;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.cube = null;
    this.materials = [];
    this.canvas = null;
    this.edgeLines = null;
    this.outlineLines = null;  // 添加轮廓线属性
    this.isDragging = false;
    this.activePointerId = null;
    this.lastX = 0;
    this.lastY = 0;
    this.rotationVelocity = { x: 0, y: 0 };
    this.targetRotation = { x: 0, y: 0 };
    this.dragConfig = {
      sensitivity: 0.015,        // 灵敏度
      velocitySmoothing: 0.2,    // 速度平滑
      inertia: 0.92,             // 惯性系数
      follow: 0.35,              // 跟随速度
      followDragging: 0.8,       // 拖拽时跟随速度
      maxVelocity: 0.25,         // 最大旋转速度
      minMove: 1,                // 最小移动阈值
      directionX: 1,             // X轴方向
      directionY: 1,             // Y轴方向
    };
  }

  // 清理拖动状态（用于游戏重置时）
  resetDragState() {
    this.isDragging = false;
    this.activePointerId = null;
    this.rotationVelocity = { x: 0, y: 0 };
  }

  init() {
    const { clientWidth, clientHeight } = this.container;

    this.scene = new THREE.Scene();
    this.scene.background = null;

    this.camera = new THREE.PerspectiveCamera(
      45,
      clientWidth / clientHeight,
      0.1,
      100
    );
    this.camera.position.set(2.6, 2.4, 2.8);
    this.camera.lookAt(0, 0, 0);

    // 优化渲染器设置，提高清晰度
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    this.renderer.setSize(clientWidth, clientHeight);
    // 使用设备像素比，但限制最大值为 3，避免过度消耗性能
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 3));
    this.container.appendChild(this.renderer.domElement);
    this.canvas = this.renderer.domElement;

    // 光照
    const ambient = new THREE.AmbientLight(0xffffff, 0.85);
    this.scene.add(ambient);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
    dirLight.position.set(5, 5, 4);
    this.scene.add(dirLight);

    // 立方体
    const geometry = new THREE.BoxGeometry(
      CONFIG.CUBE_SIZE,
      CONFIG.CUBE_SIZE,
      CONFIG.CUBE_SIZE
    );
    this.materials = new Array(6)
      .fill(null)
      .map(() => new THREE.MeshBasicMaterial());
    this.cube = new THREE.Mesh(geometry, this.materials);

    // 优化边缘线 - 更清晰、更明显
    const edges = new THREE.EdgesGeometry(geometry, 20);
    const edgeMaterial = new THREE.LineBasicMaterial({
      color: 0x1a1a1a,      // 更深的黑色
      transparent: false,   // 关闭透明度，更清晰
      linewidth: 2,         // 线宽（注意：WebGL 限制可能无效）
    });
    this.edgeLines = new THREE.LineSegments(edges, edgeMaterial);
    this.cube.add(this.edgeLines);

    // 添加额外的轮廓线，增强边界清晰度
    const outlineGeometry = new THREE.EdgesGeometry(geometry);
    const outlineMaterial = new THREE.LineBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.6,
    });
    this.outlineLines = new THREE.LineSegments(outlineGeometry, outlineMaterial);
    // 稍微放大一点，形成轮廓效果
    this.outlineLines.scale.set(1.01, 1.01, 1.01);
    this.cube.add(this.outlineLines);

    this.scene.add(this.cube);

    this.setupEventListeners();
    this.animate();

    // 响应式
    window.addEventListener("resize", () => this.onResize());
  }

  setupEventListeners() {
    const canvas = this.canvas;

    canvas.addEventListener("pointerdown", (e) => this.onPointerDown(e));
    canvas.addEventListener("pointermove", (e) => this.onPointerMove(e));
    canvas.addEventListener("pointerup", (e) => this.onPointerUp(e));
    canvas.addEventListener("pointercancel", (e) => this.onPointerUp(e));
    canvas.addEventListener("pointerleave", (e) => this.onPointerUp(e));
  }

  onPointerDown(e) {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    e.preventDefault();

    // 清理之前可能残留的状态
    if (this.activePointerId !== null) {
      try {
        this.canvas.releasePointerCapture(this.activePointerId);
      } catch (error) {
        // Ignore capture errors.
      }
    }

    this.isDragging = true;
    this.activePointerId = e.pointerId;
    this.canvas.setPointerCapture(e.pointerId);
    this.lastX = e.clientX;
    this.lastY = e.clientY;
    // 重置速度，确保拖拽响应灵敏
    this.rotationVelocity = { x: 0, y: 0 };
  }

  onPointerMove(e) {
    if (!this.isDragging) return;

    // 检查 pointerId 是否匹配
    if (this.activePointerId !== null && e.pointerId !== this.activePointerId) {
      return;
    }

    e.preventDefault();

    const dx = e.clientX - this.lastX;
    const dy = e.clientY - this.lastY;
    this.lastX = e.clientX;
    this.lastY = e.clientY;

    // 移动阈值检查
    if (Math.abs(dx) + Math.abs(dy) < this.dragConfig.minMove) return;

    // 计算旋转速度（鼠标水平移动控制 Y 轴旋转，垂直移动控制 X 轴旋转）
    let vx = dy * this.dragConfig.sensitivity * this.dragConfig.directionY;
    let vy = dx * this.dragConfig.sensitivity * this.dragConfig.directionX;

    // 限制速度并保持方向
    vx = Math.sign(vx) * Math.min(Math.abs(vx), this.dragConfig.maxVelocity);
    vy = Math.sign(vy) * Math.min(Math.abs(vy), this.dragConfig.maxVelocity);

    // 应用速度平滑
    this.rotationVelocity.x = this.rotationVelocity.x * this.dragConfig.velocitySmoothing + vx * (1 - this.dragConfig.velocitySmoothing);
    this.rotationVelocity.y = this.rotationVelocity.y * this.dragConfig.velocitySmoothing + vy * (1 - this.dragConfig.velocitySmoothing);

    // 更新目标旋转
    this.targetRotation.x += this.rotationVelocity.x;
    this.targetRotation.y += this.rotationVelocity.y;
  }

  onPointerUp(e) {
    if (e && this.activePointerId !== null) {
      try {
        this.canvas.releasePointerCapture(this.activePointerId);
      } catch (error) {
        // Ignore capture errors.
      }
    }
    this.isDragging = false;
    this.activePointerId = null;
    // 释放时轻微衰减速度，让惯性更自然
    this.rotationVelocity.x *= 0.5;
    this.rotationVelocity.y *= 0.5;
  }

  onResize() {
    const { clientWidth, clientHeight } = this.container;
    this.camera.aspect = clientWidth / clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(clientWidth, clientHeight);
    // 清理拖动状态，避免窗口调整后拖动异常
    this.resetDragState();
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    // 惯性效果（只在非拖拽时应用）
    if (!this.isDragging) {
      this.rotationVelocity.x *= this.dragConfig.inertia;
      this.rotationVelocity.y *= this.dragConfig.inertia;
      this.targetRotation.x += this.rotationVelocity.x;
      this.targetRotation.y += this.rotationVelocity.y;
    }

    // 平滑插值更新实际旋转
    const follow = this.isDragging
      ? this.dragConfig.followDragging
      : this.dragConfig.follow;

    this.cube.rotation.x +=
      (this.targetRotation.x - this.cube.rotation.x) * follow;
    this.cube.rotation.y +=
      (this.targetRotation.y - this.cube.rotation.y) * follow;

    this.renderer.render(this.scene, this.camera);
  }

  updateTextures(faceMap) {
    // Three.js BoxGeometry 材质索引顺序
    // 0: right(+X), 1: left(-X), 2: top(+Y), 3: bottom(-Y), 4: front(+Z), 5: back(-Z)
    const normalToMaterialIndex = {
      "1,0,0": 0,   // Right (+X) -> 材质 0
      "-1,0,0": 1,  // Left (-X) -> 材质 1
      "0,1,0": 2,   // Top (+Y) -> 材质 2
      "0,-1,0": 3,  // Bottom (-Y) -> 材质 3
      "0,0,1": 4,   // Front (+Z) -> 材质 4
      "0,0,-1": 5,  // Back (-Z) -> 材质 5
    };

    for (const normal of NORMALS) {
      const key = NORMAL_KEY(normal);
      const shape = faceMap[key];
      const canvas = ShapeRenderer.createCanvas(shape, CONFIG.TEXTURE_SIZE);
      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      const matIndex = normalToMaterialIndex[key];

      // 释放旧纹理，避免内存泄漏
      if (this.materials[matIndex].map) {
        this.materials[matIndex].map.dispose();
      }

      this.materials[matIndex].map = texture;
      this.materials[matIndex].needsUpdate = true;
    }
  }
}

// ============================================================
// 游戏主逻辑
// ============================================================
class Game {
  constructor() {
    this.sound = new SoundSystem();
    this.cubeRenderer = null;
    this.gridEl = document.querySelector("#grid");
    this.timerEl = document.querySelector("#timer");
    this.messageEl = document.querySelector("#message");
    this.particlesEl = document.querySelector("#particles");
    this.toggleSoundBtn = document.querySelector("#toggle-sound");
    this.difficultySelect = document.querySelector("#difficulty");
    this.difficultyButtons = document.querySelectorAll(".difficulty-btn");
    this.modalEl = document.querySelector("#modal");
    this.modalTitleEl = document.querySelector("#modal-title");
    this.modalDescEl = document.querySelector("#modal-desc");
    this.modalOkBtn = document.querySelector("#modal-ok");
    this.referencePanel = document.querySelector('#referencePanel');
    this.toggleReferenceBtn = document.querySelector('#toggleReference');
    this.closeReferenceBtn = document.querySelector('#closeReference');

    this.gridCells = [];
    this.gridSymbols = [];
    this.correctSet = new Set();
    this.selectedSet = new Set();
    this.solved = false;
    this.startTime = 0;
    this.timerRunning = false;
    this.timerHandle = null;
    this.keyboardFocus = { x: 0, y: 0 };
    this.gridSize = CONFIG.GRID_SIZE;
    this.cellSize = CONFIG.CELL_SIZE;

    // 预先生成有效的展开图形状（性能优化）
    this.validShapes = NetShapeGenerator.buildValidNetShapes();
    this.rotations = NetShapeGenerator.buildCubeRotations();
    this.generator = new PuzzleGenerator(this.validShapes, this.rotations, this.gridSize);
  }

  init() {
    this.cubeRenderer = new CubeRenderer(document.querySelector("#cube-canvas"));
    this.cubeRenderer.init();

    this.setupEventListeners();
    this.initReferencePanel();
    if (this.difficultySelect) {
      this.difficultySelect.value = String(this.gridSize);
    }
    this.newGame();
  }

  setupEventListeners() {
    // 按钮事件
    document.querySelector("#submit").addEventListener("click", () => this.submit());
    document.querySelector("#clear").addEventListener("click", () => this.clear());
    document.querySelector("#hint").addEventListener("click", () => this.showAnswer());
    document.querySelector("#restart").addEventListener("click", () => this.newGame());
    document.querySelector("#reset-view").addEventListener("click", () => this.resetView());
    this.toggleSoundBtn.addEventListener("click", () => this.toggleSound());
    if (this.difficultySelect) {
      this.difficultySelect.addEventListener("change", (e) => {
        const value = Number(e.target.value);
        this.setDifficulty(value);
      });
    }
    // 难度按钮组
    this.difficultyButtons.forEach(btn => {
      btn.addEventListener("click", (e) => {
        const value = Number(e.target.dataset.value);
        this.setDifficulty(value);
        // 更新按钮状态
        this.difficultyButtons.forEach(b => b.classList.remove("active"));
        e.target.classList.add("active");
      });
    });
    if (this.modalOkBtn) {
      this.modalOkBtn.addEventListener("click", () => this.closeModal());
    }
    if (this.modalEl) {
      this.modalEl.addEventListener("click", (e) => {
        if (e.target && e.target.getAttribute("data-modal-close") === "true") {
          this.closeModal();
        }
      });
    }

    // 键盘事件
    document.addEventListener("keydown", (e) => this.onKeyDown(e));

    // 初始化音频上下文（需要用户交互）
    document.addEventListener(
      "click",
      () => this.sound.init(),
      { once: true }
    );
  }

  onKeyDown(e) {
    if (this.isModalOpen()) {
      if (e.key === "Escape" || e.key === "Enter") {
        e.preventDefault();
        this.closeModal();
      }
      return;
    }
    // 全局快捷键
    if (e.key === "r" || e.key === "R") {
      e.preventDefault();
      this.newGame();
      return;
    }

    if (e.key === "m" || e.key === "M") {
      e.preventDefault();
      this.toggleSound();
      return;
    }

    if (e.key === "h" || e.key === "H") {
      e.preventDefault();
      this.showAnswer();
      return;
    }

    if (e.key === "Escape") {
      e.preventDefault();
      this.clear();
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      this.submit();
      return;
    }

    // 方向键导航
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
      e.preventDefault();
      this.moveFocus(e.key);
      return;
    }

    // 空格键选择
    if (e.key === " " || e.key === "Spacebar") {
      e.preventDefault();
      const idx = this.keyboardFocus.y * this.gridSize + this.keyboardFocus.x;
      this.toggleCell(idx);
      this.updateFocusIndicator();
      return;
    }
  }

  moveFocus(key) {
    switch (key) {
      case "ArrowUp":
        this.keyboardFocus.y = Math.max(0, this.keyboardFocus.y - 1);
        break;
      case "ArrowDown":
        this.keyboardFocus.y = Math.min(
          this.gridSize - 1,
          this.keyboardFocus.y + 1
        );
        break;
      case "ArrowLeft":
        this.keyboardFocus.x = Math.max(0, this.keyboardFocus.x - 1);
        break;
      case "ArrowRight":
        this.keyboardFocus.x = Math.min(
          this.gridSize - 1,
          this.keyboardFocus.x + 1
        );
        break;
    }
    this.updateFocusIndicator();
  }

  updateFocusIndicator() {
    this.gridCells.forEach((cell, i) => {
      const x = i % this.gridSize;
      const y = Math.floor(i / this.gridSize);
      if (x === this.keyboardFocus.x && y === this.keyboardFocus.y) {
        cell.tabIndex = 0;
        cell.focus();
      } else {
        cell.tabIndex = -1;
      }
    });
  }

  toggleSound() {
    const enabled = this.sound.toggle();
    this.toggleSoundBtn.textContent = enabled ? "🔊" : "🔇";
    this.toggleSoundBtn.classList.toggle("muted", !enabled);
    this.sound.play("click");
  }

  renderGrid() {
    this.gridEl.innerHTML = "";
    this.gridCells = [];
    const gapSize = this.gridSize >= 8 ? 5 : 8;
    this.gridEl.style.setProperty("--grid-size", this.gridSize);
    this.gridEl.style.setProperty("--grid-gap", `${gapSize}px`);

    // 使用查找表设置单元格尺寸
    const cellSizeConfig = {
      4: { min: "38px", dynamic: 32 },
      6: { min: "38px", dynamic: 32 },
      8: { min: "32px", dynamic: 28 },
      11: { min: "24px", dynamic: 22 }
    };
    const config = cellSizeConfig[this.gridSize] || { min: "28px", dynamic: 28 };

    this.gridEl.style.setProperty("--cell-min", config.min);
    this.gridEl.setAttribute(
      "aria-label",
      `${this.gridSize}x${this.gridSize} 方格，使用方向键移动，空格键选择`
    );
    const gridWidth = this.gridEl.clientWidth || Math.min(window.innerWidth * 0.85, 480);
    const cellSize = Math.floor((gridWidth - gapSize * (this.gridSize - 1)) / this.gridSize);
    this.cellSize = Math.max(config.dynamic, Math.min(140, cellSize));

    for (let i = 0; i < this.gridSize * this.gridSize; i++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.tabIndex = -1;
      cell.setAttribute("data-index", i);

      const canvas = ShapeRenderer.createCanvas(
        this.gridSymbols[i],
        this.cellSize
      );
      cell.appendChild(canvas);

      cell.addEventListener("click", () => this.toggleCell(i));
      this.gridEl.appendChild(cell);
      this.gridCells.push(cell);
    }

    this.updateFocusIndicator();
  }

  toggleCell(index) {
    if (this.solved) return;

    const cell = this.gridCells[index];
    const isSelected = this.selectedSet.has(index);

    if (isSelected) {
      this.selectedSet.delete(index);
      cell.classList.remove("selected");
      this.sound.play("deselect");
    } else {
      this.selectedSet.add(index);
      cell.classList.add("selected");
      this.sound.play("select");
    }

    // 更新焦点位置
    this.keyboardFocus.x = index % this.gridSize;
    this.keyboardFocus.y = Math.floor(index / this.gridSize);
  }

  clear() {
    if (this.solved) return;
    this.selectedSet.clear();
    this.gridCells.forEach((cell) => cell.classList.remove("selected"));
    this.messageEl.textContent = "";
    this.messageEl.className = "";
    this.sound.play("click");
  }

  showAnswer() {
    if (this.solved) return;

    // 显示答案
    this.gridCells.forEach((cell, i) => {
      if (this.correctSet.has(i)) {
        cell.classList.add("correct");
      }
    });

    // 自动选择正确答案
    this.selectedSet.clear();
    this.correctSet.forEach((idx) => {
      this.selectedSet.add(idx);
      this.gridCells[idx].classList.add("selected");
    });

    this.stopTimer();
    this.solved = true;

    const elapsed = ((performance.now() - this.startTime) / 1000).toFixed(1);
    this.showMessage(`答案已显示，用时 ${elapsed} 秒`, "success");
    this.sound.play("click");
  }

  submit() {
    if (this.solved) return;
    this.sound.play("submit");

    if (this.selectedSet.size !== 6) {
      this.showModal("请选择 6 个格子后再提交。");
      this.showMessage("", "");
      return;
    }

    const allCorrect = [...this.selectedSet].every((idx) =>
      this.correctSet.has(idx)
    );

    if (allCorrect) {
      this.handleSuccess();
    } else {
      this.handleFailure();
    }
  }

  showMessage(text, type = "") {
    this.messageEl.textContent = text;
    this.messageEl.className = type;
  }

  setDifficulty(size) {
    if (!Number.isFinite(size)) return;
    if (size === this.gridSize) return;
    this.closeModal();
    this.gridSize = size;
    this.generator.setGridSize(this.gridSize);
    this.keyboardFocus = { x: 0, y: 0 };
    // 更新按钮组状态
    this.difficultyButtons.forEach(btn => {
      const btnValue = Number(btn.dataset.value);
      if (btnValue === size) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });
    // newGame() 会清理拖动状态，不需要在这里重复调用
    this.newGame();
  }

  isModalOpen() {
    return this.modalEl && !this.modalEl.classList.contains("hidden");
  }

  showModal(message, title = "提示") {
    if (!this.modalEl) return;
    if (this.modalTitleEl) this.modalTitleEl.textContent = title;
    if (this.modalDescEl) this.modalDescEl.textContent = message;
    this.modalEl.classList.remove("hidden");
    this.modalEl.setAttribute("aria-hidden", "false");
    if (this.modalOkBtn) this.modalOkBtn.focus();
  }

  closeModal() {
    if (!this.modalEl) return;
    this.modalEl.classList.add("hidden");
    this.modalEl.setAttribute("aria-hidden", "true");
  }

  handleSuccess() {
    this.stopTimer();
    this.solved = true;

    const elapsed = ((performance.now() - this.startTime) / 1000).toFixed(1);
    this.showModal(`🎉 恭喜你答对了！\n\n用时：${elapsed} 秒`, "成功");

    // 高亮正确答案
    this.gridCells.forEach((cell, i) => {
      if (this.correctSet.has(i)) {
        cell.classList.add("correct");
      } else if (this.selectedSet.has(i)) {
        cell.classList.add("wrong");
      }
    });

    this.sound.playVictory();
    this.spawnParticles();
  }

  handleFailure() {
    this.showModal("不对，再试试。");
    this.showMessage("", "");
  }

  spawnParticles() {
    const colors = Object.values(COLOR_MAP);
    for (let i = 0; i < 50; i++) {
      const particle = document.createElement("div");
      particle.className = "particle";
      particle.style.left = Math.random() * 100 + "vw";
      particle.style.top = "-20px";
      particle.style.width = Math.random() * 10 + 5 + "px";
      particle.style.height = particle.style.width;
      particle.style.backgroundColor =
        colors[Math.floor(Math.random() * colors.length)];
      particle.style.borderRadius = "50%";
      particle.style.animationDelay = Math.random() * 0.5 + "s";
      this.particlesEl.appendChild(particle);

      setTimeout(() => particle.remove(), 2000);
    }
  }

  // ========== 参考面板方法 ==========
  initReferencePanel() {
    // 打开面板
    if (this.toggleReferenceBtn) {
      this.toggleReferenceBtn.addEventListener('click', () => {
        this.referencePanel.classList.remove('hidden');
      });
    }

    // 关闭面板（点击关闭按钮）
    if (this.closeReferenceBtn) {
      this.closeReferenceBtn.addEventListener('click', () => {
        this.referencePanel.classList.add('hidden');
      });
    }

    // 点击面板外部关闭
    if (this.referencePanel) {
      this.referencePanel.addEventListener('click', (e) => {
        if (e.target === this.referencePanel) {
          this.referencePanel.classList.add('hidden');
        }
      });
    }
  }

  startTimer() {
    this.startTime = performance.now();
    this.timerRunning = true;
    this.solved = false;

    const tick = () => {
      if (!this.timerRunning) return;
      const elapsed = (performance.now() - this.startTime) / 1000;
      this.timerEl.textContent = `用时：${elapsed.toFixed(1)} 秒`;
      this.timerHandle = requestAnimationFrame(tick);
    };

    this.timerHandle = requestAnimationFrame(tick);
  }

  stopTimer() {
    this.timerRunning = false;
    if (this.timerHandle) {
      cancelAnimationFrame(this.timerHandle);
    }
  }

  newGame() {
    try {
      // 清理立方体拖动状态
      if (this.cubeRenderer) {
        this.cubeRenderer.resetDragState();
      }

      const puzzle = this.generator.generate();
      this.gridSymbols = puzzle.grid;
      this.correctSet = puzzle.correct;

      this.renderGrid();
      this.cubeRenderer.updateTextures(puzzle.faceMap);

      this.selectedSet.clear();
      this.gridCells.forEach((cell) => cell.classList.remove("selected", "correct", "wrong"));
      this.messageEl.textContent = "";
      this.messageEl.className = "";
      this.particlesEl.innerHTML = "";

      this.keyboardFocus = { x: 0, y: 0 };
      this.startTimer();

      console.log(`谜题生成成功，尝试次数: ${puzzle.attempts}`);
    } catch (error) {
      this.showMessage(error.message, "error");
      console.error(error);
    }
  }

  // 重置视角
  resetView() {
    if (this.cubeRenderer && this.cubeRenderer.cube) {
      // 重置立方体旋转到初始角度
      this.cubeRenderer.cube.rotation.x = 0;
      this.cubeRenderer.cube.rotation.y = 0;
      this.cubeRenderer.cube.rotation.z = 0;

      // 重置目标旋转
      this.cubeRenderer.targetRotation = { x: 0, y: 0 };

      // 重置旋转速度
      this.cubeRenderer.rotationVelocity = { x: 0, y: 0 };

      // 清理拖动状态
      this.cubeRenderer.resetDragState();

      this.sound.play("click");
    }
  }
}

// ============================================================
// 游戏启动
// ============================================================

let game = null;

function showFatal(error) {
  const message = error instanceof Error ? error.message : String(error);
  const timerEl = document.querySelector("#timer");
  const gridEl = document.querySelector("#grid");
  if (timerEl) timerEl.textContent = "加载失败";
  if (gridEl) {
    gridEl.innerHTML = `<div style="padding:20px;text-align:center;font-size:14px;">
      <div style="color:#d94e4e;margin-bottom:8px;">${message}</div>
      <div style="color:#666;">请检查网络或使用本地服务启动。</div>
    </div>`;
  }
}

function boot() {
  try {
    if (!THREE) {
      throw new Error("Three.js 未加载，请确认网络可访问 unpkg.com");
    }
    game = new Game();
    game.init();
  } catch (error) {
    showFatal(error);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
