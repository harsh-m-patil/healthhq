# AGENTS
1. Install deps: `pnpm install` (use PNPM). Dev: `pnpm dev`; build: `pnpm build`; start: `pnpm start`.
2. Lint all: `pnpm lint` (Biome). Auto-fix/format: `pnpm format`. No Prettier.
3. No test framework configured yet; if adding Vitest/Jest keep single-test cmd documented (e.g. `pnpm test file.test.ts -t "name"`). Do NOT invent tests now.
4. TypeScript: `strict` true. Prefer explicit return types for exported funcs; allow inference for locals.
5. Path alias: import internal code via `@/...` not relative `../../`.
6. Import order: std/lib -> external -> internal (`@/`), then relative; Biome organizeImports on save.
7. Use named exports; avoid default unless React Server Component page/layout conventions demand it.
8. Components/functions: PascalCase for React components, camelCase for helpers, UPPER_SNAKE_CASE for constants.
9. Avoid one-letter vars (except trivial loops). Prefer descriptive names over comments.
10. Styling: Tailwind utility classes; consolidate classes with `cn()` from `src/lib/utils.ts` when conditional.
11. Validation: use `zod`; never trust raw `FormData`. Return structured objects (see `getFeedAction`).
12. Errors: catch narrow scopes; log with contextual message; never swallow—return user-safe `message` plus internal `console.error`.
13. Async: prefer `Promise.all` with per-item try/catch (pattern in `actions.ts`). Never block on cache writes (`void`).
14. Caching: Upstash Redis keys: `<resource-identifier>:<purpose>`; set sensible TTL; do not await non-critical sets.
15. Security: Sanitize/parse external HTML with Readability + DOMPurify before rendering; never inject unsanitized HTML.
16. Formatting: 2-space indent, no semicolons not enforced—follow existing (semicolons present). Keep lines concise (<100 cols ideally).
17. JSX: self-close empty elements, wrap multi-line props; minimal inline logic—extract helpers.
18. Imports: type-only imports with `import { type X }` form to preserve tree-shaking.
19. Do not add global state libs without discussion; prefer simple module funcs + server actions.
20. When adding tests later, colocate under `src/` with `.test.ts` and update this file accordingly.
