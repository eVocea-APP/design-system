# Component contract

Shared spec for `dashboard` (React + Tailwind v4) and `app` (React Native + NativeWind v4).
Both repos implement the same components with the same props and variants. Code is not
shared, only tokens and this contract. Values come from the Figma file
`MkLC7s2cPKp0qJMrTopuA1`; node ids are given so each value can be re-checked.

All colors below are semantic tokens (`bg-primary`, `text-on-primary`), never raw hex.
Gibson is the only typeface. Weights: regular 400, medium 500, semibold 600.

## Button

Pill shape (`rounded-pill`), content centered, one text label.

| variant | background | text | border | Figma node |
| --- | --- | --- | --- | --- |
| `primary` | `primary` | `on-primary` | none | 24:37, 23:56 |
| `secondary` | `control` | `on-control` | 1px `control-border` | 28:492 |
| `neutral` | `action-neutral` | `on-action-neutral` | none | 27:160 |

| size | padding (x / y) | text | used by |
| --- | --- | --- | --- |
| `lg` | 60 / 23 | `title` (24) semibold, max width 600 | `primary` main button (24:37) |
| `md` | 30 / 12 | `small` (14) semibold | `primary` in nav (23:56) |
| `sm` | 23 / 14 | `base` (16) medium | `secondary` "Alege" (28:492) |
| `field` | 12 / 12 | `base` (16) medium, tracking -0.18 | `neutral` submit (27:160) |

Props: `variant`, `size`, `disabled`, `loading`, `onPress` / `onClick`, `children` (label).
States (hover, pressed, disabled, loading) are not in Figma and are still to be designed.

## Chip

Same visual as Figma `Button_exemplu` (24:60): `control` background, 1px `control-border`,
`rounded-pill`, padding 50 / 15, `small` (14) regular, text `on-control`.
Props: `label`, `selected`, `onPress` / `onClick`. The selected state is not in Figma.

## Badge

Figma `mark_cel mai popular` (28:484): transparent, 1px border `on-primary`, `rounded-pill`,
padding 10 / 4, `caption` (11) semibold, text `control`. Props: `label`.

## Card

Figma `Plan card` (29:530): 345 x 396, `rounded-card` (20), padding 31 / 27.

| variant | background | text |
| --- | --- | --- |
| `neutral` | `control` | `content` on light card, black |
| `primary` | `primary` | `on-primary` |
| `accent` | `accent` | `on-accent` |

Inner layout: eyebrow `base` (16) regular with `tracking-eyebrow`, title `display` (36)
semibold, separator 1px, feature list rows (gap 20, 13px check icon, `small` text), price
`headline` (32) semibold with a 15px suffix, secondary `sm` button at the bottom right.
The 15px suffix has no named size yet and should map to `small` (14) or a new token.

## Input

Figma `Email field` (27:115): background `field`, 1px `field-border`, `rounded-pill`,
padding 12, text `base` (16) medium with tracking -0.18, placeholder `field-placeholder`,
shadow `x-small`. Props: `value`, `onChange`, `placeholder`, `error`, `disabled`.
Error and focus states are not in Figma; error uses the proposed `error` token.
