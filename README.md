# @evocea/design-tokens

Single source of truth for eVocea design tokens, shared by `dashboard` (Tailwind v4) and
`app` (NativeWind v4). Source: `tokens/tokens.json`, extracted from the Figma homepage file.

## Workflow

1. Edit `tokens/tokens.json` (every semantic color needs `light`, `dark` and an `origin`).
2. `npm run build` regenerates `dist/`.
3. `npm test` checks token validity, that `dist/` is up to date, and text contrast.
4. Commit `dist/` together with the source, because consumers install this package from git.

## Outputs

| file | consumer |
| --- | --- |
| `dist/theme.css` | dashboard: `@import "@evocea/design-tokens/theme.css";` after `@import "tailwindcss";` |
| `dist/tailwind-preset.cjs` | app: `presets: [require("@evocea/design-tokens/tailwind-preset")]` in `tailwind.config` |
| `dist/native.css` | app: imported in `global.css`, defines the `--ds-*` color variables for light and dark |
| `dist/tokens.js`, `dist/tokens.d.ts` | typed raw values for things Tailwind does not reach (shadows, native font names) |

Dark mode follows `prefers-color-scheme`, and can be forced with `data-theme="dark"` or
`data-theme="light"` on the root element (web).

## Origins

`figma` values were read from Figma. `sampled` values were measured from the rendered
design. `proposed` values are not in Figma and need design confirmation.

See `components.md` for the component contract.
