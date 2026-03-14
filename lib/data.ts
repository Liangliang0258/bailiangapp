export interface Game {
  id: string;
  title: string;
  description: string;
  image?: string;
  link: string;
}

export interface Tool {
  id: string;
  title: string;
  description: string;
  link: string;
}

export const games: Game[] = [
  {
    id: "1",
    title: "舒尔特方格",
    description: "专业的注意力训练和专注力提升工具，支持多种难度级别。",
    image: "/images/games/schulte-grid-thumb.svg",
    link: "/games/Schulte_Grid/index.html",
  },
  {
    id: "2",
    title: "立体方块展开图识别",
    description: "空间思维训练，从网格中找出能组成立方体的正确展开图。",
    image: "/images/games/cube-net-thumb.svg",
    link: "/games/zhankai/index.html",
  },
  {
    id: "3",
    title: "待开发",
    description: "敬请期待更多有趣的游戏...",
    link: "#",
  },
  {
    id: "4",
    title: "待开发",
    description: "敬请期待更多有趣的游戏...",
    link: "#",
  },
];

export const tools: Tool[] = [
  {
    id: "1",
    title: "老婆今天吃什么",
    description: "选择困难症福音，随机决定今天吃什么，支持自定义菜单。",
    link: "/tools/what_eat/what_eat.html",
  },
  {
    id: "2",
    title: "待开发",
    description: "敬请期待更多实用工具...",
    link: "#",
  },
  {
    id: "3",
    title: "待开发",
    description: "敬请期待更多实用工具...",
    link: "#",
  },
  {
    id: "4",
    title: "待开发",
    description: "敬请期待更多实用工具...",
    link: "#",
  },
];

export const contactInfo = {
  email: "bailiang00258@gmail.com",
  wechat: "扫码关注公众号",
  wechatAccount: "佰亮同学",
};
