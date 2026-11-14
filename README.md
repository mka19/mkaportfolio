# MKA portfolio — Phase 1 foundation (V11)

This is a local integration prototype, not a completed or production-ready portfolio. The original Figma Design is untouched. The user-approved source priority applies; the recovered `MK_Orbit_V11_Interactive.html` is the About source of truth and supersedes V7–V9. Its integration copy is byte-identical (SHA-256 `15a66e238f71bf57fcb792a925dd6a738b33c1eb7de4e205974494265051569b`).

## Run locally

Extract this archive, open a terminal in `mka-portfolio`, and start a static server. For example, with Python installed:

```sh
python -m http.server 8000
```

Open `http://localhost:8000/` in Chrome. No API keys or package installation are required for this foundation. Do not open just the HTML from inside the ZIP: the project requires its relative assets and module folders. Do not publish this preview as a production website.

## What is included

- One reusable HTML/CSS console at the source Home reference dimensions 1920 × 974. Its stage is at (307.996, 12), sized 1602 × 710, with 12 px radius. All source-derived layout coordinates are in `index.html`.
- Separate artwork extracted from the original SVG groups, preserving their path geometry, embedded images, and referenced definitions. No full-frame screenshot or flattened whole-screen SVG is used as the application.
- Native navigation controls and hash-based routing. Home, About, projects, license, entity, CV, Playground, Tech Stack, Mixtape and Movies share the console. Stages are lazy-mounted and then retained to preserve their in-memory state.
- About mounts the original V11 HTML inside a single isolated iframe. This is an intentional temporary integration boundary: its independent viewport, global styles, scroll driver, embedded Lenis and complex existing interactions remain intact. Its original Hobbies Shadow DOM is preserved. The Home Skills shortcut calls V11's existing chapter selection API. No new About animation has been applied.
- Original independent modules for the gallery, keyboard, CV, Mixtape and Movies mount in their own isolated documents in this baseline. The original metallic buttons have only a layout wrapper adjustment (2 × 2 with the reference shell dimensions). The original contact component has only a container-width adjustment. These are integration copies, not modifications to the original archives.
- Original clock face and clock styles, with native local-time updates. Original identity artwork, keychain reference artwork, badge artwork, vinyl, ticket and color-control artwork.
- Best 4 artwork from the actual project preview groups; native project collection and detail-preview navigation; main Creative License original artwork with three appearance states; original entity-card artwork.

## Verification and unfinished work

This first build is intentionally not claimed as pixel-perfect. It uses a native static shell (rather than adding framework dependencies before baseline verification), with isolated original modules where their standalone runtime would otherwise conflict. A later production port may wrap these in React/TypeScript components where useful. No new page transitions or new cat animations were added.

Static validation: app.js parses in Node; artwork SVGs parse as XML with referenced definition IDs present; V11 source hash matches. Browser navigation to localhost and file URLs was blocked by the test environment (`ERR_BLOCKED_BY_ADMINISTRATOR`). Runtime, visual comparison, input tests, and accessibility checks remain unverified. Fonts referenced externally may fall back if unavailable; font files are not bundled.

Remaining work:
- Retrieve and integrate actual original interactive 3D keychain source/GLBs (static original keychain artwork is a clearly interim visual). Final Home toggle wording/animation and inline rotating badge behavior, animated identity strip, and sidebar preview remain pending. The alternate Home toggle is deliberately disabled rather than inventing wording.
- Confirm all four metallic shortcut mappings and dot behavior. The original buttons still have their original press/hover behavior, but navigation has not been assigned. The six global swatches are visual only in this baseline; no guessed global behavior. The top music dial has original artwork and source files retained, but is disabled until the one-controller audio integration is implemented. The Mixtape is separate and the vinyl opens it; audio rights, playback synchronization and music source authorization require verification before hosting.
- Contact animation source is included; external contact destinations still need verified configuration. The cat files are included but the interaction has not been wired, because additional motion is gated by the baseline review.
- Case Study includes the four confirmed featured projects, not a full All Projects dataset or approved case study narratives. The detail view is only an original design preview. App/Dashboard show no verified records rather than invented ones. Metadata and image crops require visual QA. Entity cards show the source's original artwork, including reference placeholder copy; do not publish it. Entity theme variations, side project previews and sticker interaction positions still need verification. Creative License privacy review is required before publishing.
- CV animation source is included. Actual PDF download is deliberately disabled until the approved CV file is attached to the website. Original contact URLs, CV content, and all other public content need final confirmation.
- Current responsive strategy fits the desktop reference canvas uniformly; a fully accessible mobile layout is not complete. New transitions/hover/reveal animations are deferred until visual baseline approval. The custom V11 peel implementation is preserved (not the proprietary Framer component); any further Framer-specific replacement requires compatible source and permission.
- V11 retains its original copy, imagery, orbit, film strip, custom peel and original embedded interactions. Other original source modules are retained for future integration, including separate Hobbies, growth, dots, dial and React Why Me/clock projects. They are not all mounted in this first build. Avoid serving unused/private source files, licensed media or private identity information in a public production deployment.
