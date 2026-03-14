# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## User Address

**Always start responses with "亮总" (e.g., "亮总，好的，我来帮你...")**

## Project Overview

"佰亮的AI百宝箱" (Bailiang's AI Toolkit) is a Next.js personal portfolio website showcasing AI-created mini-games and tools. The site features a clean, minimal design with blue-to-purple gradient accents.

## Development Commands

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linter
pnpm lint
```

## Architecture

### Content Management

All games and tools are defined in `lib/data.ts`:
- `games` array: Game configurations with id, title, description, image (optional), and link
- `tools` array: Tool configurations with id, title, description, and link
- `contactInfo`: Contact details for the footer

When adding new games/tools:
1. Create the game/tool folder in `public/games/` or `public/tools/`
2. Add entry to the appropriate array in `lib/data.ts`
3. Use "待开发" (Coming Soon) placeholder for unused slots

### Static Games/Tools

Games and tools are standalone HTML/CSS/JS applications in `public/`:
- `public/games/` - Game folders (e.g., `Schulte_Grid/`)
- `public/tools/` - Tool folders (e.g., `what_eat/`)

### Universal Navbar

Games and tools use a shared JavaScript navbar: `public/games/navbar.js`

To add navbar to a new game/tool HTML file, add before `</body>`:
```html
<!-- 全局导航栏 -->
<script src="/games/navbar.js"></script>
```

The navbar links to: Games (#portfolio), Tools (#tools), About (#about), Contact (#contact), and Home (/)

### Component Structure

- `components/Navbar.tsx` - Main site navigation (not the same as game navbar)
- `components/Hero.tsx` - Hero section with gradient background
- `components/GameCard.tsx` - Game portfolio cards
- `components/ToolCard.tsx` - Tool cards
- `components/About.tsx` - About section
- `components/Contact.tsx` - Contact section with QR code and email
- `components/Footer.tsx` - Footer with social info

### Styling

- Tailwind CSS v4
- Custom gradient: `from-blue-500 to-purple-600`
- Custom fonts: `font-heading` and `font-body` (defined in `app/layout.tsx`)
- Color scheme: Neutral backgrounds with blue/purple accents

## File Organization

```
app/              # Next.js app directory
components/       # React components
lib/             # Data and utilities
public/          # Static files
├── games/       # Standalone game HTML files
│   └── navbar.js # Universal navbar script
├── tools/       # Standalone tool HTML files
└── images/      # Game thumbnails, QR code
```

## Key Conventions

- Game/tool cards are fully clickable links, not just buttons
- Use `link="#"` for unimplemented games/tools marked as "待开发"
- Game thumbnails stored in `public/images/games/`
- Contact email: bailiang00258@gmail.com
- WeChat account: "佰亮同学"
