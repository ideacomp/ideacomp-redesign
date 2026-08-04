# Image sources & the visual standard

Every image on the site is self-hosted from `public/`. `next.config.ts` allows no
remote image hosts, so an image must be committed to the repo to render.

There are two sets, and they answer to different rules:

- **`/solutions` — six generated panels** in `public/solutions/`, built from
  `docs/diagrams/`. These are ours; see below.
- **The home `FocusBand` — four real photographs** in `public/gitex-*.jpg`, our
  own from GITEX Global Dubai. These are photographs and stay photographs.

## Why /solutions is drawn rather than photographed

Stock could not say what these disciplines do. The set that used to sit here was
five Unsplash photos and one generated diagram, and four of the five were the same
shot — a close-up of a screen at an angle:

| slot | what it actually was | why it failed |
|---|---|---|
| `cybersecurity` | consumer antivirus panel, "Virus free" | not firewalls, assessments or incident response |
| `web-development` | HTML in browser devtools | reads as "some code" |
| `outsourcing` | a component in an editor | says nothing about helpdesk, networks or servers |
| `mobile-development` | two phones running "byte", a social app | legible third-party branding |
| `cloud-devops` | Plex installing on a Raspberry Pi, `rpikernelhack` in the paths | a hobby project on a page selling managed infrastructure |

Twelve searches over 114 candidates had already failed to find a usable node-editor
shot for `ai-ml`, which is why that one slot was generated. Extending that decision
to all six is what this set is.

Envato Elements was considered and is a dead end from inside the repo: it needs a
paid subscription and a login, so nothing can be fetched here. An AI-generated set
was also tried and rejected — the files carried garbled text ("Sharows sparting"),
placeholder labels named after their own icons ("Globe / CDN & Edge", "Phone Frame")
and stock photos of people inside the mocked-up app screens.

## There is no longer a duotone

Every image used to be flattened to greyscale and re-tinted signal-cyan through
four blend layers in `duotone-image.tsx`, so that mixed stock sources landed in
one colour family regardless of what they looked like. **That was removed on
request.** `src/components/framed-image.tsx` is what is left: the frame, the
hover, and nothing over the image.

Two things follow, and both matter more than the treatment did:

- **Source colour is load-bearing now.** The tint used to absorb it. An image that
  clashes with the palette will clash on the page, and the fix is to grade the
  file, not to add a CSS filter back.
- **The panels supply their own palette.** They are generated in our tokens, which
  is why `/solutions` still reads as one signal-cyan set with nothing tinting it.
  This is also why removing the duotone changed the panels barely at all and
  changed the GITEX photographs completely — those are now in their own colour.

## The rules a panel has to hold

**Rank by luminance, not hue.** This outlived the duotone that motivated it, and
it is still right: a red / amber / green severity scale is unreadable to a
substantial share of viewers and reads as decoration in a monochrome panel.
`panel.css` exposes the ladder as `--ink-hi` / `--ink-mid` / `--ink-lo` and
`.bar-fill.t1/.t2/.t3`, so it is a token rather than a judgement call per panel.

**The delivered width is 552px.** The grid caps at `max-w-6xl` (1152px) with
`gap-12`, so a column never exceeds 552px. Source is 1600px, a 2.9x downscale:

| in source | on the card | use for |
|---|---|---|
| 92px `.stat` | 32px | the anchor the eye lands on first |
| 40-64px `.name` / `.step-name` | 14-22px | load-bearing copy |
| 15-22px `.meta` / `.kind` | 5-8px | texture, never something that must be read |

Nothing below 15px. An earlier version used 11px labels; they resolved to 4px and
vanished.

**Each panel shows its slot's three `features`,** the ones in `solutionsData` that
render as the bullet list beside it. That is the constraint that matters most and
the one the old set got wrong. `docs/diagrams/*.html` each open with a comment
naming which region covers which feature — keep that comment true.

**Mid-to-dark tonality.** `ai-ml`, `web-development` and `mobile-development` sit
on the *light* surface (`isDark = index % 2 === 1` in `src/app/solutions/page.tsx`),
so on those three a dark panel is a dark card on paper. That used to be a real
hazard — a baked-dark image read as a hole punched in the light surface, which is
what the duotone existed to prevent. With the duotone gone the panels are simply
dark, deliberately and consistently, and the border plus the surrounding whitespace
carry them. `public/solutions/ai-ml.png` is the calibration reference; grade
against it, and check those three bands after any change.

**No people, no third-party branding, no lorem bars, and no copy that misreads in
a sales context.** Platform names are written as words for this reason — an Apple
or Android mark in the frame would be third-party branding. Interface content
inside a device frame is drawn as blocks, because real rendered copy would be 5px
on the card and read as noise.

## The six panels

| Slot (`solutionsData[].slug`) | File | Source | Shows |
|---|---|---|---|
| `ai-ml` | `public/solutions/ai-ml.png` | `ai-forecast.html` | forecast curve past a `now` marker with an 80% band, driver ranking, an automated action held for review |
| `cybersecurity` | `public/solutions/cybersecurity.png` | `security-perimeter.html` | internet → firewall → DMZ → internal chain, findings by impact, detect/contain/eradicate/recover runbook |
| `web-development` | `public/solutions/web-development.png` | `web-viewports.html` | one layout at three widths, offline badge on the phone, the API endpoints behind all three |
| `outsourcing` | `public/solutions/outsourcing.png` | `ops-board.html` | three columns named Helpdesk, Network, Servers, each anchored by one big number |
| `mobile-development` | `public/solutions/mobile-development.png` | `mobile-core.html` | one shared core fanning out to iOS and Android running the same screen, work queued offline |
| `cloud-devops` | `public/solutions/cloud-devops.png` | `deploy-pipeline.html` | commit → build → test → stage → prod with a blocking gate, replica health, infrastructure as code |

The filename is the slug, so a panel and its content slot cannot drift apart.

## Regenerating

```
npm i -D playwright                    # once, if node_modules is fresh
node docs/diagrams/render.mjs          # all six
node docs/diagrams/render.mjs ai-ml    # one, while iterating
```

The script renders at 1600×1067 with `deviceScaleFactor: 2`, then downscales
3200×2134 to 1600×1067. That downscale is what keeps the thin strokes and the mono
type clean at 552px. It shells out to `sips`, so this is macOS-only — an authoring
tool run by hand, never part of `npm run build`.

Output is **PNG**, not JPEG. The 2-3px strokes and small mono type pick up visible
ringing under JPEG; PNG keeps the source clean and `next/image` still serves AVIF.

### Two things in `render.mjs` that are load-bearing

**Wires are drawn from the measured centre of each `.port` element**, never from
hand-authored path data. That is what keeps an edge attached when a node's label
gets longer and changes its box size. Horizontal edges leave and arrive along x,
vertical along y — mixing the two is what once swept a wire out past the right edge
and back.

**Each panel declares its own edges, inside its own HTML:**

```html
<svg id="wires"></svg>
<script type="application/json" id="edges">
[["v","core:b1","ios:t"],["v","core:b2","droid:t"]]
</script>
```

`"core:b1"` resolves to the measured centre of `#core`'s `.port.b1`. Any positioned
box can carry ports, not just `.node` — `mobile-core.html` hangs them off device
frames. A panel with no `#edges` block is simply screenshotted.

### Editing a panel

`docs/diagrams/panel.css` is the shared system: page furniture (`.title` / `.rule`
/ `.foot`), `.node` + `.port`, `.panel`, `.stat`, `.bar-*`, `.chip`, `.chain` +
`.step`, `.frame` and the `.ui-*` blocks that stand in for interface content. Each
panel adds only its own layout on top. Change `panel.css` and you change all six —
which is the point, and also the risk.

Panels bottom out at y=844 so the set keeps one rhythm when scrolled through.

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
`FramedImage` share the exported `IMAGE_FRAME`, so the frame has one definition.

**These photos are now in their own colour**, which is the whole visible effect of
removing the duotone: purple stage lighting, daylight on the forecourt. The
treatment used to flatten all of that.

Two measured constraints worth not breaking: the caption is 11px, so it is *small*
text needing 4.5:1, and the scrim behind the control cluster has to stay dense well
above the bottom edge — the cluster is two rows tall, and a shallower scrim measured
3.1:1 over the daylit slides.

The scrim was deepened a second time when the duotone came off, because the slides
underneath got brighter: at `from-black/80 via-black/55` the caption measured
**4.76:1**, passing but with no headroom. At `from-black/92 via-black/68` the worst
slide measures **7.89:1**. Re-measure from rendered pixels if a slide or the scrim
changes; parsing the computed `color` does not work, since these tokens resolve to
`oklab()`.

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

## Checking a change

```
node docs/diagrams/render.mjs
npm run build
npm run dev          # then /solutions and / at 375, 768, 1440, 1920
```

- **Read it at 552px, not at 1600.** Screenshot the card at its delivered width and
  read the header, the load-bearing labels and the big numbers. Anything that was
  meant to be readable and is not gets bigger in the source — the card does not
  get bigger.
- **Check the light bands.** `ai-ml`, `web-development` and `mobile-development` sit
  on the light surface and must read as cards, not as holes.
- **Desaturate it.** Convert the PNG to greyscale and look again. If two things
  that were meant to be distinguishable merge, they were carrying meaning in hue
  and have to be redone in luminance. Nothing greyscales these panels for you any
  more, so this is now a check you have to run deliberately rather than something
  the treatment enforced.
- **Read every word in the frame at full resolution.** This is the rule a COVID-19
  tracker with a "Total Deaths" counter and an editor screenshot of an AI assistant
  asking permission to write code both failed.
- **Both locales.** Alt text lives in `src/lib/sitemap.ts` under `en` and `cs`, and
  describes what is actually in the panel — it is an accessibility requirement from
  PRODUCT.md, not decoration.
- **`ai-ml` is the only one with `priority`** and sits in the LCP path. Keep an eye
  on its AVIF 640w variant.
