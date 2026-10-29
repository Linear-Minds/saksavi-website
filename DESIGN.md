---
name: SAKSAVI Agro Exports
description: The shipment's own paperwork. A bill of lading laid over a dusk palm grove, filled in as the coconuts travel from palm to port.
colors:
  green-950: "#0b2213"
  green-900: "#0f2c19"
  green-800: "#173d24"
  green-700: "#1f4f2f"
  green-600: "#2f7d3f"
  green-500: "#4e9a55"
  paper: "#dce7d3"
  paper-hi: "#f2f5ee"
  husk: "#6b3f1f"
  husk-dark: "#4a2b14"
  husk-light: "#9a6a3e"
  stamp: "#5a3f8f"
  correction: "#a3341f"
typography:
  display:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(48px, min(5.9vw, 10vh), 92px)"
    fontWeight: 900
    lineHeight: 0.88
    letterSpacing: "-0.01em"
    fontVariation: "'wdth' 125"
  headline:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(30px, 4.8vw, 80px)"
    fontWeight: 900
    lineHeight: 0.9
    letterSpacing: "-0.01em"
    fontVariation: "'wdth' 125"
  title:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(26px, 2.9vw, 44px)"
    fontWeight: 900
    lineHeight: 0.95
    letterSpacing: "-0.01em"
    fontVariation: "'wdth' 125"
  body:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.5
  typed:
    fontFamily: "Courier Prime, Courier New, monospace"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1.5
  action:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 800
    letterSpacing: "0.1em"
    fontVariation: "'wdth' 112"
  label:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "11px"
    fontWeight: 600
    letterSpacing: "0.14em"
    fontVariation: "'wdth' 75"
  box-no:
    fontFamily: "Courier Prime, Courier New, monospace"
    fontSize: "13px"
    fontWeight: 400
rounded:
  none: "0px"
spacing:
  frame: "clamp(10px, 1.7vw, 24px)"
  bar: "64px"
  strip: "84px"
  field-gap: "18px"
  box-pad: "34px 40px"
  section: "clamp(80px, 11vw, 160px)"
components:
  button-primary:
    backgroundColor: "{colors.green-800}"
    textColor: "{colors.paper-hi}"
    typography: "{typography.action}"
    rounded: "{rounded.none}"
    padding: "18px 22px"
  button-primary-hover:
    backgroundColor: "{colors.green-900}"
    textColor: "{colors.paper-hi}"
  button-paper:
    backgroundColor: "{colors.paper-hi}"
    textColor: "{colors.green-800}"
    typography: "{typography.action}"
    rounded: "{rounded.none}"
    padding: "18px 24px"
  button-paper-hover:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.green-800}"
  field:
    backgroundColor: "transparent"
    textColor: "{colors.green-900}"
    typography: "{typography.typed}"
    rounded: "{rounded.none}"
    padding: "6px 0 7px"
  document-panel:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.green-800}"
    rounded: "{rounded.none}"
    padding: "{spacing.box-pad}"
  header-strip:
    backgroundColor: "{colors.green-950}"
    textColor: "{colors.paper-hi}"
    rounded: "{rounded.none}"
    height: "{spacing.bar}"
  route-strip:
    backgroundColor: "{colors.green-950}"
    textColor: "{colors.paper-hi}"
    rounded: "{rounded.none}"
    height: "{spacing.strip}"
  shipping-mark:
    backgroundColor: "transparent"
    textColor: "{colors.green-800}"
    rounded: "{rounded.none}"
    padding: "4px 8px"
---

# Design System: SAKSAVI Agro Exports

## Overview

**Creative North Star: "The Shipment's Own Paperwork"**

The page is a bill of lading laid over a grove at dusk. A deep palm green ground carries an illustrated world (procedural palms, husk-brown trunks and nuts, a truck, a port crane, a ship, a globe of routes). On top of it sits the document: pale security-print panels with guilloche linework, numbered boxes, hairline rules, and fields that fill in as the story runs. The enquiry is the consignment form. The visitor is not reading a brochure; they are watching their consignment get written up.

Density is low, and hierarchy comes from scale. Labels are tiny condensed capitals and values are huge wide-black capitals, with very little in between. Typed fill-ins in Courier Prime carry every value a clerk would write by hand: subcopy, form entries, stage records, registration numbers. Paper sits flat on the green. Depth comes from parallax illustration layers and from the document's ruled frame, not from lifted cards.

Motion is one continuous scroll-scrubbed shipment. A pinned GSAP timeline, smoothed by Lenis, moves the camera from palm to port. Each stage types its record line, the route strip ghosts the previous stage while the new one arrives bright, and one marker for "now" travels along a single unbroken line. The violet stamp lands only when the shipment is done.

**Key Characteristics:**
- Drenched palm-green ground with pale paper panels ruled into a document grid.
- Wide-black Archivo display, condensed Archivo labels, Courier Prime typed values.
- Numbered boxes and stage numbers ("(1) Shipper", "Stage 03") as native document furniture.
- Square corners everywhere in the UI; the paper sits flat, with no elevation.
- Violet rubber-stamp ink reserved for the end of the transaction.
- Scroll-scrubbed illustration story with typewriter fills and one "now" marker.

## Colors

A drenched, near-monochrome green world with pale document paper, husk brown confined to the illustration, and one rare violet ink.

### Primary
- **Palm Green** (green-800): The ground of the page (body background, closing section) and the ink colour on paper: form text, dark buttons on paper, document rules (`1.5px` ink rule).
- **Night Grove** (green-950): The deepest layer, used for the pinned stage, the header strip and route strip backing (at 0.92 to 0.94 alpha), and the scrollbar track.
- **Grove Shade** (green-900): The statement box backing (at 0.86 alpha), typed values on paper, and the primary button hover.
- **Clerk Green** (green-700): Field labels on paper and column headers in the manifest.
- **Frond Green** (green-600) and **Young Frond** (green-500): Illustration greens (fronds, truck cab, containers) and the scrollbar thumb. On phones Frond Green also colours the second line of the finale on paper.

### Secondary
- **Security Paper** (paper): Document panels (consignment form, record slip, goods manifest, phone finale), the `2px` frame rule on green, the pale second line of display headlines, and secondary text on green.
- **Clean Sheet** (paper-hi): Primary text on green, the paper-coloured action buttons in the header and finale, the route progress line and the "now" marker.

### Tertiary
- **Coconut Husk** (husk), **Husk Shadow** (husk-dark), **Husk Highlight** (husk-light): Trunks, rings, ripe nuts (as a radial gradient husk-light to husk to husk-dark), the truck bed and the milestone caps. Illustration only; never a UI colour.
- **Stamp Violet** (stamp): The rubber-stamp impression ("Shipped on board"), printed with multiply blending.
- **Correction Red** (correction): Form validation only: the errored field's bottom rule and its message.

### Named Rules
**The Stamp Ink Rule.** Violet is stamp ink. It appears as the rubber-stamp impression when a stage of the transaction is confirmed, and nowhere else: not on links, buttons, accents or decoration.

**The Husk Stays in the Grove Rule.** Brown belongs to trunks, nuts, crates and milestones inside the illustration. UI chrome is green and paper only.

## Typography

**Display Font:** Archivo, variable width 62 to 125 and weight 400 to 900 (with system-ui, sans-serif)
**Body Font:** Archivo at normal width (with system-ui, sans-serif)
**Label/Mono Font:** Archivo condensed (width 75%) for labels; Courier Prime (with Courier New, monospace) for typed values

**Character:** One family, stretched to three voices: wide black capitals for stencilled cargo marks, condensed capitals for printed form labels, and Courier Prime for whatever the clerk typed into the boxes.

### Hierarchy
- **Display** (900, width 125%, uppercase, `clamp(48px, min(5.9vw, 10vh), 92px)`, line-height 0.88): The hero statement only. Lines reveal through overflow masks. The second half of a statement switches to Security Paper ("Global reach.").
- **Headline** (900, width 125%, uppercase, `clamp(30px, 4.8vw, 80px)` for goods, up to `clamp(44px, 6vw, 92px)` for the closing sheet, line-height 0.9): Section statements.
- **Title** (900, width 125%, uppercase, 26px to 44px, line-height 0.95): Panel titles ("Request a quote", "Palm to port"), goods names, stage names in the route strip (18px to 28px), and the finale line.
- **Body** (Archivo 400, 17px, line-height 1.5): Running text on the page ground; registration row names at 15.5px.
- **Typed** (Courier Prime 400, 15px to 19px, line-height 1.35 to 1.55, max 36 to 40ch): Hero subcopy, goods intro and attributes, form inputs (18px), stage records (17px), registration values, form status (14px).
- **Action** (Archivo 800, width 112%, 14px to 16px, letter-spacing 0.1em, uppercase): Every button and CTA.
- **Label** (Archivo 600, width 75%, 11px, letter-spacing 0.14em, uppercase): Field labels, box numbers in the nav, stage labels, column headers.

### Named Rules
**The Tiny Label, Huge Value Rule.** Hierarchy is scale-only. A field pairs an 11px condensed label with a value that is either typed (Courier) or stencilled (wide black). Don't add a middle tier.

**The Typed Value Rule.** Anything filled in (form entries, records, registration numbers, subcopy that describes the goods) is set in Courier Prime. Printed form text (labels, titles, buttons) is Archivo.

## Layout

The viewport is a ruled document. A `2px` Security Paper frame is inset by the frame spacing (`clamp(10px, 1.7vw, 24px)`) on all sides. The fixed header strip (64px; 58px under 900px) runs along its top edge, and the route strip (84px; 66px under 900px) runs along its bottom edge. Panels attach to the frame and to each other with shared rules, not gaps: the statement box and record slip hang from the header at top-left, bordered only on their open sides; the quote form sits flush bottom-right on the route strip (440px wide, 380px under 1100px).

The pinned journey runs for seven viewport heights. Its scene is a 1600×900 SVG viewBox in `slice` mode, with the world running to 5600 units, and a camera that translates the world. The centre is kept clear for the subject.

Below the story, sections use `max-width: 1600px` with `clamp(80px, 11vw, 160px)` vertical and `clamp(20px, 5vw, 80px)` horizontal padding. The goods manifest is a four-column ruled table (`90px` mark, then 1.25fr / 1.1fr / 0.9fr, 32px gutters). The closing sheet is a two-column ruled grid (fluid lead and a form up to 620px), followed by a ruled footer of four fields.

Responsive: at 900px the frame rule drops, the statement docks above the route strip, the record slip collapses to a single "now" record (112px tall), the quote form becomes a bottom sheet opened by a button in the statement, and the nav collapses behind a Menu cell. At 1000px the closing sheet stacks. At 520px the form's two-up row stacks.

**The One Beat Per Screen Rule.** On phones only one transformation is visible per viewport. The record steps aside before the finale takes its place.

## Elevation & Depth

The system is flat. Paper panels sit on the green with no shadow; separation comes from tone (paper against green), `2px` paper rules, and translucent green backings (0.86 to 0.94 alpha) that let the grove show through. Depth belongs to the illustration: a sky gradient, far, mid and foreground parallax layers (the foreground fronds cross the frame edge), and radial gradients that give the coconuts volume. Paper is textured with guilloche (repeating radial gradients of green-800 at 3 to 5% alpha) so it reads as security print, not as a raised card.

### Shadow Vocabulary
- **Now halo** (`box-shadow: 0 0 0 4px rgb(242 245 238 / 0.18)`): A spread-only ring around the 14px "now" marker on the route line. It marks position; it is not elevation.

### Named Rules
**The Flat Paper Rule.** Documents never lift. No drop shadows on panels, buttons or the header; use a rule or a tonal change instead.

## Shapes

All UI corners are square (`0px`), including inputs, which reset native radius. Form comes from rules: a `2px` paper rule frames the page and divides major boxes, a `1px` paper rule at 45% alpha divides cells inside a strip, and a `1.5px` green ink rule underlines fields and separates records and manifest lines on paper. Shipping marks in the manifest are stencil text inside a `1.5px` `currentColor` box. The only circles in the UI are the "now" marker and the route destination dots. Organic shape lives in the illustration: fronds, nuts and hills.

## Components

### Buttons
The voice of a stencilled cargo label: wide, heavy, spaced capitals with an arrow that pushes forward.
- **Shape:** Square (`0px`), no border.
- **Primary (on paper):** Palm Green fill, Clean Sheet text, `18px 22px`, full-width in the form with the label and arrow pushed apart.
- **Paper (on green):** Clean Sheet fill, Palm Green text, `18px 24px` (the header CTA fills its own cell at bar height). On phones, inside the paper finale, this inverts to the primary style.
- **Hover / Focus:** Background deepens one step (to green-900 on primary, to paper on the paper style) over 0.25s on the ease-out curve; the 24 to 26px line arrow slides 5 to 6px right over 0.35s. Press nudges down 1px. Focus is a `2px` outline in the opposite ink (paper-hi on green, green-800 on paper), offset 3px (inset -5px in the header cell).

### Inputs / Fields
- **Style:** A clerk's box. There is no background and no side borders, only a `1.5px` green ink bottom rule. An 11px condensed label sits above the value, which is typed in 18px Courier Prime in green-900. Placeholders use green-800 at 58% alpha. Selects carry a 12px drawn chevron.
- **Focus:** The bottom rule thickens to `2.5px`, with no outline or glow.
- **Error:** The bottom rule turns Correction Red and a 13px, 600-weight message appears in the same red.

### Navigation
The header is the top strip of the bill of lading. It is a fixed, ruled grid of cells on Night Grove at 0.94 alpha: a shipper cell ("(1) Shipper" label over the wordmark at 20px wide black), three numbered section cells (label over a Courier value, underlined 1px with a 4px offset), and a paper CTA cell. Cells divide with `1px` soft paper rules. Hover tints a cell with paper at 8% alpha. Under 900px it becomes wordmark, Menu cell, and "Quote", and the section cells drop down as a stacked ruled list on Night Grove.

### Document Panel
The paper surface for the form, the record slip, the goods manifest and the phone finale. It uses Security Paper, guilloche rings in two opposite corners, Palm Green ink, and square corners. Padding is `22px 26px` compact and `34px 40px` full.

### Record Slip (signature)
A paper panel titled "Palm to port" that lists four numbered records. Each record starts at 32% opacity and, when its stage arrives, comes to full opacity while its Courier line types in. Under 900px it collapses to a single live record.

### Route Strip (signature)
A four-cell strip pinned along the bottom frame. Each cell has a "Stage 0n" label over a wide-black stage name. One `2px` progress line runs across the top edge and scales from 0 to 1 over the whole story, carrying the single "now" marker. The current stage is at full opacity and the others are ghosted to 0.38.

### Ink Stamp (signature)
A double-ruled rectangle with wide-black caps (Archivo 900, width 118%), roughened by SVG turbulence and displacement filters so its edges break and its ink pressure is uneven. It is printed in Stamp Violet with multiply blending and rotated -5 to -9 degrees. It lands from scale 2.6 and -16 degrees to 1 and -9 degrees with a `power4.in` slam, and the panel jolts 3px.

### Goods Manifest
A ruled table on paper. Each line item has a `1.5px` ink rule above it, a stencilled shipping mark in a ruled box, the goods name in title type, and form and use in Courier. Hover tints the row with green-800 at 4.5% alpha.

### Registrations
A ruled list (`dl`) on green. Names are in Archivo and values are typed in Courier. An unconfirmed value is set as an open field (paper, 75% opacity, italic) and never as an invented number.

## Do's and Don'ts

### Do:
- **Do** frame every surface as a ruled document: paper `2px` rules on green, `1.5px` green ink rules on paper, `1px` soft rules between cells.
- **Do** pair an 11px condensed uppercase label with a large value, either typed in Courier Prime or stencilled in Archivo 900 at width 125%.
- **Do** number boxes and stages the way a bill of lading does ("(1) Shipper", "Stage 03"); they are the world's own furniture.
- **Do** texture paper with guilloche rings (repeating radial gradients of green-800 at 3 to 5% alpha), never with noise or photos.
- **Do** scrub story motion to scroll with `ease: none` defaults, `scrub: 0.9`, and Lenis (`lerp: 0.09`) on the GSAP ticker; use `cubic-bezier(0.16, 1, 0.3, 1)` for state transitions.
- **Do** reveal display lines through overflow masks (`yPercent: 110`, `expo.out`, 1.4s, 0.08s stagger).
- **Do** fall back to a still hero frame with its working form under `prefers-reduced-motion`, with no pin.
- **Do** leave unconfirmed facts as visibly open fields.

### Don't:
- **Don't** use Stamp Violet for anything other than the stamp impression at a confirmed state.
- **Don't** round UI corners or lift panels with drop shadows; the paper sits flat.
- **Don't** bring husk brown into UI chrome; it lives in the grove.
- **Don't** set filled-in values in Archivo or printed labels in Courier.
- **Don't** add a second progress line or a second "now" marker; the route is one unbroken line.
- **Don't** show more than one transformation per phone viewport.
- **Don't** use photography or stock imagery; the world is drawn.
