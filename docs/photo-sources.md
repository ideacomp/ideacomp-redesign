# Photo sources & the photographic standard

Every image on the site is self-hosted from `public/`. `next.config.ts` allows no
remote image hosts, so a photo must be committed to the repo to render.

## The rule that makes the set look like a set

Source colour is irrelevant. `src/components/duotone-image.tsx` greyscales each
photo and re-tints it through four blend layers, so anything dropped into a slot
comes out in the same signal-cyan duotone. Two of those layers paint
`bg-background`, which is redefined per art-directed surface — that is why the
same component renders a graphite-cyan duotone inside a `.dark` band and a
paper-cyan duotone on the light "datasheet" surface, with no per-surface files.

What is **not** interchangeable is subject and tonality. Every photo must:

- **say what its own discipline does.** This is the constraint that matters most
  and the one an earlier pass got wrong: a set of six handsome infrastructure
  photos was stylistically perfect and semantically useless, because all six read
  as "datacenter". A card for *Mobile App Development* has to look like mobile app
  development.
- contain **no people** — no handshakes, no meetings, no hands in frame
  (PRODUCT.md anti-references). The one exception is the home `FocusBand` carousel,
  which is our own photos of our own colleague; the ban is on *stock* people, and a
  real colleague is the opposite of that.
- keep one dominant subject, mid-to-dark tonality, hard geometric lines
- carry no legible third-party branding, and **no content that misreads in a
  sales context.** Screens need reading at full size before use: a monitoring
  dashboard rejected here turned out to be a COVID-19 tracker with a "Total
  Deaths" counter, and an editor screenshot showed an AI assistant asking
  permission to write the code on a page selling senior engineering.

A photo that breaks those will still tint correctly and still be wrong.

## Current slots

Five slots are Unsplash — free licence, commercial use, no attribution required —
processed to 1600×1067 (3:2), JPEG q78, progressive, EXIF stripped. The `ai-ml`
slot is a diagram we generate ourselves; see the next section.

| Slot (`solutionsData[].slug`) | File | Subject | Source |
|---|---|---|---|
| `ai-ml` | `public/ai-solution.png` | Node workflow canvas: validate → forecast, with a human-review branch merging into the decision | **generated** — `docs/diagrams/` |
| `cybersecurity` | `public/cybersecurity-solution.jpg` | Security status panel: networks safe, virus free, apps current | Unsplash `photo-1751448555253-f39c06e29d82` |
| `web-development` | `public/web-solutions.jpg` | Browser devtools: page HTML beside its applied styles | Unsplash `photo-1518773553398-650c184e0bb3` |
| `outsourcing` | `public/outsourcing-solution.jpg` | Code review of a component, changed lines marked in the gutter | Unsplash `photo-1653387137517-fbc54d488ed8` |
| `mobile-development` | `public/mobile-solution.jpg` | Two phones side by side, each running a different app UI | Unsplash `photo-1581287053822-fd7bf4f4bfec` |
| `cloud-devops` | `public/cloud-solution.jpg` | Terminal streaming package install and provisioning steps | Unsplash `photo-1608742213509-815b97c30b36` |
| home `FocusBand` | `public/gitex-*.jpg` (4 files) | Our own GITEX Global Dubai photos, in a carousel | **our own photos** — see below |

If a source is an intrinsically pale outlier, grade **that file** before saving —
do not retune `duotone-image.tsx`, which is calibrated against the whole set.

`FocusBand` deliberately has its own files rather than sharing a Solutions photo,
so changing one never silently changes the other.

## The `FocusBand` is a carousel of our own photos

Four real Ideacomp photos from GITEX Global in Dubai, crossfading in the band:

| Order | File | Shows |
|---|---|---|
| 1 | `public/gitex-dev-slam.jpg` | Our person at the Global Dev Slam backdrop, source code on the panel |
| 2 | `public/gitex-main-stage.jpg` | GITEX Global Dubai 2024 main stage entrance |
| 3 | `public/gitex-entrance.jpg` | Venue approach, lined with event flags |
| 4 | `public/gitex-signage.jpg` | On site beside the GITEX Global Dubai 2024 signage |

They replaced a stock server-rack aisle because a genuine company photo is the
company's *own* proof rather than borrowed context — the distinction PRODUCT.md's
"no borrowed proof" principle turns on. Slides live in
`content[locale].home.focus.slides`, with per-slide `alt` **and** `caption`, both
localised; the caption is what tells a visitor they are looking at GITEX and not
stock.

`src/components/photo-carousel.tsx` renders them. Its docblock covers why it
crossfades instead of sliding, why it only borrows behaviour from the react-bits
Carousel instead of using it, why the controls sit bottom-left, and the full list of
conditions that stop autoplay — read that before changing it. Both it and
`DuotoneImage` composite through the same exported `DuotoneLayers`, so the treatment
has one definition.

Two measured constraints worth not breaking: the caption is 11px, so it is *small*
text needing 4.5:1, and the scrim behind the control cluster has to stay dense well
above the bottom edge — the cluster is two rows tall, and a shallower scrim measured
3.1:1 over the daylit slides. Current worst case is 7.5:1. Re-measure from rendered
pixels if either changes; parsing the computed `color` does not work, since these
tokens resolve to `oklab()`.

### Sourcing them from the old site

The pre-redesign site still serves the originals at `https://ideacomp.cz/bg1..bg5`.
**Prefer `.png` over `.avif`:** the AVIFs are pre-cropped (bg2 is 1536×799) while
the PNG at the same path is the uncropped 3:2 frame (1536×1024). Only bg2 and bg4
have PNGs; bg1 and bg3 exist as AVIF only, but at 4032 px wide, so they were
downscaled to 2048 rather than up.

Do **not** use `bg5`: that stand ("Smart TransScreen / Spark Gitex") belongs to a
different exhibitor, and putting it on our own site would read as claiming someone
else's product.

Higher-resolution originals of bg2/bg4 very likely exist off-site — bg1 and bg3
prove the camera files are 4032 px. Worth collecting if the band ever looks soft.

### Deliberate deviations

These are choices, already flagged and accepted. Do not "fix" them:

- **An identifiable person** appears in slides 1 and 4. The PRODUCT.md ban is on
  *stock* people; a real colleague is the opposite of that.
- **Prominent third-party branding** (GITEX, GLOBAL DEV SLAM) is unavoidable in
  these frames and was accepted as the price of using real photos.
- **The section copy is about durability, not trade shows.** The band's second
  paragraph and its "Meet the team" CTA carry the connection. If this ever grates,
  the fix is the copy or moving the carousel to `/about`, not swapping in stock.

Rebuild any of the Unsplash slots from the CDN with:

```
https://images.unsplash.com/photo-<id>?w=2400&q=90&fm=jpg&fit=max
```

then centre-crop to 3:2 and resize to 1600×1067 at q78.

## The `ai-ml` diagram is generated

Stock had nothing usable here. Twelve searches over 114 candidates turned up no
freely-licensed screenshot of a node/workflow canvas: the closest match had
`BRANDING / BRAND DESIGN / 3D RENDERS` legible on the nodes themselves, and the
next closest went muddy under the duotone once the monitor bezel took over the
frame. So this one is ours.

Source lives in `docs/diagrams/`:

- `ai-pipeline.html` — the diagram. Nodes are plain HTML positioned absolutely;
  the wires are **not** in the file.
- `render.mjs` — Playwright renders the page at 1600×1067 with
  `deviceScaleFactor: 2`, measures the real centre of every `.port` element, draws
  the bezier wires from those measured coordinates, then screenshots.

Measuring the ports rather than hand-authoring path data is what keeps the wires
attached when a node's label length changes its box size. Horizontal edges leave
and arrive along x; vertical edges along y — mixing them is what made an earlier
version sweep a wire out past the right edge and back.

Regenerate with:

```
cd docs/diagrams && node render.mjs        # writes public/ai-solution@2x.png
# then downscale 3200x2134 -> 1600x1067 and save as public/ai-solution.png
```

It is a **PNG**, unlike the photographs. Thin 2px strokes and small mono type pick
up visible ringing under JPEG; PNG keeps the source clean and `next/image` still
serves AVIF (the 640w card variant is ~6 KB, far smaller than any of the photos).

Two things to hold onto if it gets edited: the type is scaled so the node names
stay readable in a **552px** card — that is the real delivered width, and an
earlier version had 11px labels that resolved to 4px and vanished. And the node
labels are load-bearing copy, not decoration: `Human review — override available`
and `Decision — auditable` are what make the card agree with the section's claim
of being "explainable and auditable, not a black box".

## The hero has no photograph and no decorative shapes

The home hero is the Grainient shader, the bottom fade, and the typed headline.
Nothing else. Two additions were built there and both were removed on request:

- a photographic focal object — a radiating burst of lit optical fibres on black,
  `photo-1597733336794-12d05021d510`, composited with `mix-blend-screen` so the
  black vanished against the shader;
- a set of drifting outline triangles and quads on pointer parallax, which is why
  `src/components/parallax-layer.tsx` no longer exists.

Recorded so the work is recoverable, not as a suggestion. Don't add either back
without being asked.

## Swapping in Envato Elements assets

Envato Elements requires a paid subscription and a login, so these files could
not be sourced from it directly. The slots are built so a swap needs no code
change: **download, crop to 3:2, resize to 1600×1067, overwrite the file at the
same path.** Alt text lives in `src/lib/sitemap.ts` and must be updated to
describe the new photo.

Envato's search pages are client-rendered, so item URLs could not be verified
from here and are deliberately not listed — a fabricated item id is worse than
none. These search URLs are correct and land on the right result sets:

| Slot | Search |
|---|---|
| `ai-ml` | *n/a — generated, see above.* Only relevant if the diagram is abandoned: <https://elements.envato.com/photos/node-editor> |
| `cybersecurity` | <https://elements.envato.com/photos/security-dashboard> |
| `web-development` | <https://elements.envato.com/photos/source-code-editor> |
| `outsourcing` | <https://elements.envato.com/photos/code-review> |
| `mobile-development` | <https://elements.envato.com/photos/mobile-app-screen> |
| `cloud-devops` | <https://elements.envato.com/photos/terminal-command-line> |
| home `FocusBand` | *n/a — our own GITEX photo, see above.* |
| hero object | <https://elements.envato.com/photos/fiber-optic> — filter to shots on a black background |

When picking, judge candidates on the bullets at the top of this file, not on how
they look in the Envato grid: everything is desaturated and re-tinted before it
reaches the page, so colour is irrelevant and **subject legibility is
everything**. Open each candidate at full resolution and read every word visible
on any screen in the frame.

## Checking a swap

The failure mode worth looking for is a photo that reads as a hole punched in the
light surface — that is what forced this rework in the first place. Load
`/solutions` and confirm the bands on the light surface still read as cards.

```
npm run dev          # then /solutions and / at 375, 768, 1440, 1920
```
