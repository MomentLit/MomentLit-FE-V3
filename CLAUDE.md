# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project state

This is `fe-v3` (MomentLit-FE-V3), a Next.js App Router project currently at the `create-next-app` boilerplate stage — `app/page.tsx`, `app/layout.tsx`, and `app/globals.css` are still the generated defaults. There is no test framework configured yet.

## Commands

```bash
npm run dev     # start dev server (http://localhost:3000)
npm run build   # production build
npm run start   # serve the production build
npm run lint    # eslint
```

There is no test script; do not assume one exists.

## Architecture notes

- **Next.js 16.3.0, App Router, React 19.** Per [AGENTS.md](AGENTS.md), this Next.js version has breaking changes relative to older training data — read the relevant guide under `node_modules/next/dist/docs/` before implementing anything non-trivial (routing, data fetching, layouts, metadata, etc.), since APIs may differ from what you expect.
- **Typed route props.** Route components use generated prop types like `LayoutProps<"/">` and `PageProps<"/...">` instead of hand-written `{ children }: { children: React.ReactNode }` props — see `app/layout.tsx`. These types come from `.next/types/`, generated automatically by `next dev`/`next build`.
- **Styling** is Tailwind CSS v4 via `@tailwindcss/postcss` (no `tailwind.config.js` — config lives in `app/globals.css` using `@theme inline`). Fonts are `next/font/google` (Geist Sans/Mono), exposed as CSS variables (`--font-geist-sans`, `--font-geist-mono`).
- **Path alias** `@/*` maps to the repo root (`tsconfig.json`).
- The `node_modules/next/dist/server/lib/generate-agent-files.js` script is what (re)writes the AGENTS.md guidance block on every `next dev` run — if you see it as an uncommitted diff, that's expected; commit it along with your other changes rather than reverting it.
