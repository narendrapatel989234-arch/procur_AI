---
trigger: always_on
---

You are building ProcurAI — an AI-native enterprise procurement 
platform. React + Vite. Follow every rule below strictly.

## CODING RULES
- Use inline styles only. Never use Tailwind utility classes in JSX.
- Never hardcode hex color values. Always use CSS variables from 
  tokens.css which is already imported in the project.
- All icons must come from lucide-react only.
- One file per page component. Keep all styles inline in that file.
- Use useState for all interactive states — hover, focus, 
  dropdowns, active tabs, filters, selected rows.
- Never modify any file inside src/tokens/
- Do not install new packages unless explicitly asked.
- Do not add features that were not asked for.
- Do not remove features that were asked for.
- Follow the prompt word for word. Do not skip any instruction.

## DESIGN RULES
- Always light mode. Never use dark backgrounds in the UI.
- Always use CSS variables for colors, spacing, radius, shadows.
- Every screen must feel like a premium AI enterprise product.
- No placeholder layouts. No generic designs.
- Use realistic procurement data in all mock content.

## ARCHITECTURE RULES
- Sidebar lives in App.jsx and is shared across all pages.
- Each page file exports only its main content area, not the sidebar.
- App.jsx handles all routing via useState currentPage.
- Never duplicate the sidebar inside a page component.

## CONTENT RULES
- Logged in user is always: David Kim, Procurement Analyst, 
  initials DK.
- All mock data must reflect real enterprise procurement context.
- Never use Lorem Ipsum or generic placeholder text.