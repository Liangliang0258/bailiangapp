export interface Game {
  id: string;
  title: string;
  description: string;
  image?: string;
  icon?: string;
  link: string;
}

export interface Tool {
  id: string;
  title: string;
  description: string;
  icon?: string;
  link: string;
}

export const games: Game[] = [
  {
    id: "1",
    title: "贪吃蛇大作战",
    description: "经典贪吃蛇游戏的AI重构版，支持多种难度和皮肤。",
    link: "#",
  },
  {
    id: "2",
    title: "2048 益智游戏",
    description: "经典数字合并游戏，挑战你的逻辑思维。",
    link: "#",
  },
  {
    id: "3",
    title: "打砖块",
    description: "怀旧街机风格打砖块游戏，体验经典乐趣。",
    link: "#",
  },
  {
    id: "4",
    title: "五子棋对战",
    description: "与AI对战的五子棋游戏，智能棋局匹配。",
    link: "#",
  },
];

export const tools: Tool[] = [
  {
    id: "1",
    title: "JSON 格式化工具",
    description: "在线JSON格式化、验证和美化工具，支持高亮显示。",
    link: "#",
  },
  {
    id: "2",
    title: "Markdown 编辑器",
    description: "实时预览的Markdown编辑器，支持导出HTML。",
    link: "#",
  },
  {
    id: "3",
    title: "Base64 编解码",
    description: "快速进行Base64编码和解码，支持大文件处理。",
    link: "#",
  },
  {
    id: "4",
    title: "正则表达式测试",
    description: "在线正则表达式测试工具，实时匹配结果。",
    link: "#",
  },
];

export const skills = [
  "AI辅助开发",
  "创意编程",
  "Web开发",
  "游戏设计",
];

export const contactInfo = {
  email: "hello@bailiang.com",
  wechat: "扫码关注公众号",
  wechatAccount: "佰亮的AI百宝箱",
};
