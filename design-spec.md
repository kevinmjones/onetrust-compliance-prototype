# Governance Kanban Dashboard — Design Spec

A single-page prototype that mirrors OneTrust's "AI-Ready Governance Platform™" posture. It surfaces validation work-in-flight as a Kanban board, with executive KPIs above and an inspector panel on the right. The visual language borrows directly from the *Risk Assessment Problem* diagram: crisp white surfaces, tiny uppercase eyebrows, black/mint emphasis blocks, micro-cell heatmaps, and pill chips.

The goal is to make the abstract scale problem (~87,000 evaluations across 200 projects) feel *operationally manageable* — every cell becomes a card, every card has a next-best action, and the platform's automations are visible at the edges.

---

## 1. Page sections (top → bottom)

```
┌──────────────────────────────────────────────────────────────────────┐
│  A. Top bar (logo • product crumb • search • density • Request Demo) │
├──────────────────────────────────────────────────────────────────────┤
│  B. Title block — H1 + sub + "live" timestamp                        │
├──────────────────────────────────────────────────────────────────────┤
│  C. Executive KPI rail (4 tiles)                                     │
├──────────────────────────────────────────────────────────────────────┤
│  D. Filter bar — search + chips + sort + density toggle              │
├──────────────────────────────────────────────────────────────────────┤
│  E. Two-column layout:                                               │
│     ┌────────────────── board (6 columns) ──────────────┬──────────┐ │
│     │  Intake → AI pre-screen → Evidence → Legal →      │ F.       │ │
│     │  Control validation → Ready for audit             │ Inspector│ │
│     │  (cards within each)                              │ (sticky) │ │
│     └───────────────────────────────────────────────────┴──────────┘ │
├──────────────────────────────────────────────────────────────────────┤
│  G. Automation recommendations strip (acknowledgeable)               │
├──────────────────────────────────────────────────────────────────────┤
│  H. Evidence & audit trail — micro-matrix heatmap + timeline rail    │
├──────────────────────────────────────────────────────────────────────┤
│  I. Footer (© • confidentiality • reference back-link)               │
└──────────────────────────────────────────────────────────────────────┘
```

### A. Top bar
- White background; thick (3px) black bottom rule — matches the reference's `top-bar` divider.
- Left: OneTrust logo lockup (use a text-based fallback `OneTrust` in 700 weight + a 6px mint dot if no SVG present).
- Center: product crumb `Platform / Tech Risk & Compliance / Validation Console`, in the 10px uppercase letter-spaced "context" style.
- Right cluster: search input (icon-left, 240px), density toggle (`Comfortable` / `Compact`), `Request Demo` button (primary mint-on-black, matches `cmp-button-new-primary`).

### B. Title block
- H1: **"Continuous validation, end-to-end."** (32px / 700 / black, max-width 720px — same metrics as the reference)
- Sub: "Move every obligation from intake to audit on a single AI-ready governance plane. PROGRAM mandates auto-resolve; PROCESS mandates flow through this board." (13px / #666 / line-height 1.55)
- Right side of the row: `LAST SYNC · 14:02 ET` in 10px uppercase letter-spaced gray.

### C. Executive KPI rail
Four equal tiles in a `grid-template-columns: repeat(4, 1fr); gap: 16px;`. Each tile is a `source-card`-style block: 12px radius, 22px padding, a 4px top accent stripe in a tier color, eyebrow + headline metric + tiny delta + sparkline.

| # | Eyebrow | Metric | Sub | Accent |
|---|---|---|---|---|
| 1 | `BLOCKED VALIDATIONS` | `47` | `+6 vs last week · 12 high-risk` | red `#E74C3C` |
| 2 | `DUE WITHIN 7 DAYS` | `132` | `19 missing evidence` | amber `#F39C12` |
| 3 | `AUTOMATION SAVINGS` | `38,420 hrs` | `PROGRAM auto-resolve · YTD` | jade `--ot-jade` |
| 4 | `CONTROL CONFIDENCE` | `92%` | `Median AI score across portfolio` | mint `--ot-mint` |

Hover on a tile darkens its top-stripe and reveals a "Filter board by …" caption — clicking applies the matching filter.

### D. Filter bar
A 56px-tall strip, white with bottom 1px `--ot-rule` divider. Left → right:
- **Search**: input, 320px, placeholder `Search projects, obligations, owners…`. Filters cards live (case-insensitive, matches title/owner/obligation IDs).
- **Filter chips** (sortable, removable). Default set: `Domain: All`, `Jurisdiction: All`, `Risk: All`, `Owner: All`. Active chips render filled (black bg / mint text), inactive render outlined.
- **Sort**: dropdown — `SLA ascending` (default), `Risk descending`, `AI confidence ascending`, `Recently updated`.
- **Density**: two-button toggle: `Comfortable` (default, 14px card padding) / `Compact` (8px padding, 1-line title, hides AI confidence bar).
- **Result count** right-aligned: `Showing 24 of 87 validations` (11px gray).

### E. Kanban board

Six columns in a horizontal flexbox; min-width 280px each, gap 16px, page x-overflow scroll for narrow viewports.

Column header pattern:
```
EYEBROW (sky/jade/purple/yellow per stage)
Stage name              count pill (black 10px)
1px stage-color rule
```

| # | Column | Eyebrow color | Purpose | Default sort |
|---|---|---|---|---|
| 1 | **Intake** | `--ot-sky` | Newly registered projects awaiting triage | SLA asc |
| 2 | **AI pre-screen** | `--ot-purple` | LLM has scored; awaiting human ack | AI conf asc |
| 3 | **Evidence needed** | `--ot-yellow` | Missing artifacts blocking validation | Evidence asc |
| 4 | **Legal review** | `--ot-jade` | Counsel/DPO sign-off in flight | SLA asc |
| 5 | **Control validation** | `--ot-mint` | Control owner is testing controls | SLA asc |
| 6 | **Ready for audit** | `--ot-black` | Audit package generated, packet locked | Updated desc |

Empty column state: muted 11px line `No validations in this stage. Auto-routed items will appear here.`

### F. Inspector / Validation pipeline panel
Sticky right rail, 360px wide on ≥1280px, full-width below board on <1024px. Header: card title, risk tier pill, copy-link icon. Body is a 6-step vertical pipeline that **mirrors the reference's matrix → equation → bottom-line rhythm**:

1. **Obligation mapping** — chip cluster of matched obligations (each with source tag tag-reg/tag-pol/tag-rules).
2. **Semantic dedupe** — "12 surface findings → 4 unique" with a tiny merge diagram (two dots → one).
3. **Evidence match** — completeness bar (mint fill) + list of attached artifacts.
4. **LLM assessment** — confidence score (0–1.00), model name, reasoning excerpt (italic blockquote, mint left rule).
5. **Reviewer decision** — owner avatar, status (Pending / Approved / Returned), decision note.
6. **Audit package** — generate-PDF button (mint primary), packet status (Locked / Draft).

Each step is collapsible. When no card is selected, panel shows an empty state with a 9-cell mini matrix and copy *"Select a validation to see its journey from obligation to audit."*

### G. Automation recommendations strip
A black-background section (matches `matrix-section`) below the board. Header H2 mint: "Automation working for you". Five recommendation cards in a single row that wraps; each card has:
- 10px uppercase eyebrow in mint
- One-line headline (white, 700)
- One-line proof point (gray)
- Right-side toggle pill: `Acknowledge` ↔ `Acknowledged ✓` (mint when acknowledged)

Seed copy:
1. **AUTO-RESOLVE · PROGRAM** — "130 company-wide mandates resolved as evidence" — *Saves 26,000 evaluations*
2. **DEDUPE · SEMANTIC** — "Group 41 duplicate findings across 8 projects" — *Collapses to 12 unique items*
3. **PRIORITIZE · RISK** — "Surface 12 high-risk blockers for owner review" — *Median SLA: 3 days*
4. **EVIDENCE · GAPS** — "Request DPIA for Lead Capture & 6 others" — *Missing in evidence-match step*
5. **AUDIT MEMO · DRAFT** — "Generate Q2 audit memo from 84 locked packets" — *One click in audit step*

### H. Evidence & audit trail
Two-column block.

**Left (60%):** A 200 × 28 micro-matrix heatmap labeled `PORTFOLIO CONFORMITY` — same `matrix-grid` pattern as the reference (1px gap, aspect-ratio:1, three cell classes: ok/uncertain/gap). Y-label `← 565 OBLIGATIONS`, X-label `200 PROJECTS →`. Hovering a cell shows tooltip `Project P-073 · GDPR Art 30(1) · Conformant`. Clicking filters the board to that project.

**Right (40%):** A vertical audit-trail timeline (most recent on top, 8 items). Each entry: 9px uppercase actor tag (HUMAN/AI/AUTO), 12px event sentence, 10px timestamp. Mint dot on the rail = AI/automation; black dot = human. Example entries: *"AI scored P-073 / DPIA Article 35 at 0.94 confidence."* / *"K. Jones approved Lead Capture audit packet."* / *"Auto-resolved 14 PROGRAM mandates against the Q2 cohort."*

### I. Footer
Same posture as the validation-pipeline reference: thin top rule, logo left, copyright + "View Validation Pipeline reference →" link right.

---

## 2. Card data model

Each card represents one validation (one project × one or more obligations being assessed together). Stored in `app.js` as a flat array of plain objects.

```js
{
  id: 'V-1042',                          // string, stable
  title: 'Customer Lead Capture & Nurture',
  domain: 'Marketing',                   // Marketing | Product | HR | Engineering | Finance | Security
  jurisdiction: ['EU', 'UK', 'US-CA'],   // ISO-ish tokens
  obligations: [                         // array (1..n)
    { id: 'GDPR-30(1)', source: 'reg', label: 'Records of Processing' },
    { id: 'POL-DPIA-04', source: 'pol', label: 'DPIA Procedure' }
  ],
  obligationCount: 7,                    // total mapped (may exceed display)
  riskTier: 'high',                      // critical | high | medium | low
  owner: { name: 'K. Jones', initials: 'KJ', role: 'Privacy Lead' },
  stage: 'evidence',                     // intake | prescreen | evidence | legal | control | ready
  sla: { dueDate: '2026-05-19', daysRemaining: 7, breached: false },
  evidence: { collected: 4, required: 6, percent: 67 },
  aiConfidence: 0.82,                    // 0..1, null if not yet scored
  nextBestAction: {                      // surfaced on the card and in inspector
    label: 'Request DPIA from Marketing Ops',
    type: 'request_evidence'             // request_evidence | approve | escalate | generate_memo | dedupe | auto_resolve
  },
  pipeline: {                            // populates inspector
    mapping:   { matched: 7, autoResolved: 3 },
    dedupe:    { surface: 12, unique: 4 },
    evidence:  { artifacts: ['DPIA-draft.pdf', 'ROPA-v3.xlsx'] },
    llm:       { model: 'OneTrust-LLM-7B', score: 0.82, rationale: '…' },
    reviewer:  { status: 'pending', note: '' },
    audit:     { status: 'draft', packetId: null }
  },
  updatedAt: '2026-05-12T14:02:00Z',
  flags: ['missing_evidence']            // optional: missing_evidence | sla_breach | new | escalated
}
```

### Card render — comfortable density
```
┌───────────────────────────────────────────────┐
│ EYEBROW: domain · jurisdiction               │  ← 9px uppercase, letter-spacing 0.8
│ Card title (15px / 700, 2-line clamp)        │
│                                              │
│ ◆ HIGH RISK  ·  7 obligations                │  ← pill row (risk tier color)
│                                              │
│ Owner avatar  K. Jones · Privacy Lead        │
│                                              │
│ SLA  ▮▮▮▮▯▯▯  7d                              │  ← bar tinted by urgency
│ Evidence  ▮▮▮▮▮▮▯▯▯  67%                     │  ← mint fill
│ AI conf   0.82                                │  ← small numeric, no bar
│                                              │
│ ▸ Request DPIA from Marketing Ops            │  ← next-best-action button
└───────────────────────────────────────────────┘
```

### Card render — compact density
```
┌───────────────────────────────────────────────┐
│ Card title …                  ◆ HIGH · 7d    │
│ Marketing · EU+UK · KJ · 67% evidence        │
└───────────────────────────────────────────────┘
```

### Risk-tier pill mapping
| Tier | Bg | Text | Use |
|---|---|---|---|
| `critical` | `#E74C3C` | white | gap blocking audit |
| `high` | `#F39C12` | black | breach likely w/in 30 days |
| `medium` | `--ot-sky` | white | within SLA, attention |
| `low` | `--ot-jade` | white | on track |

### Bar colors
- **SLA bar**: green when `daysRemaining >= 14`, amber `7..13`, red `<7`, black-striped when `breached`.
- **Evidence bar**: always mint fill on `#F5F5F5` track.

---

## 3. Interaction behavior

| Interaction | Trigger | Result |
|---|---|---|
| **Select card** | Click anywhere on card body (not action button) | Card gets a 2px black border + mint left rule; inspector populates with that card's `pipeline`; URL hash updates to `#V-1042` (deep-linkable). |
| **Clear selection** | Click empty board space, press `Esc`, or click selected card again | Border resets; inspector returns to empty state. |
| **Next-best action** | Click action button on card | Optimistically marks the action as `taken`; card pulses mint border for 600ms; toast bottom-right (`Requested DPIA · undo`); recommendation strip refreshes counts. No actual write. |
| **Search** | Type in search input | Debounce 120ms, filter cards (title, owner, obligation IDs, domain). Empty state per column reads `No matches in this stage.` |
| **Filter chips** | Click chip → opens popover with options | Selecting an option fills chip black/mint and re-filters board. `×` on chip resets it. Multiple chips combine with AND. |
| **Sort** | Change dropdown | Re-sorts cards within each column instantly. |
| **Density toggle** | Click toggle | Adds `body.compact` class; columns re-flow. Persists in `localStorage` under `ot.density`. |
| **KPI tile** | Click tile | Applies the implied filter (e.g. Blocked tile → `Risk: critical+high` AND `flags: sla_breach`). Tile becomes "active" with mint outline; clicking again clears. |
| **Recommendation toggle** | Click `Acknowledge` | Pill swaps to `Acknowledged ✓` + mint fill; pill state persists in `localStorage`. Acknowledged recs are de-emphasized (opacity 0.55) but stay visible. |
| **Matrix cell** | Click cell in evidence/audit matrix | Filters board to that project (chip `Project: P-073`). Hover shows tooltip. |
| **Keyboard nav** | `←/→` between cards in a column, `↑/↓` across columns, `Enter` to open inspector, `Esc` to clear | Focus ring uses 2px mint outline. |
| **Reduced motion** | `prefers-reduced-motion: reduce` | Disables card pulse, scale-bar transitions, matrix fade-in. |

No drag-and-drop in v1 — column changes happen via the action button only (keeps the prototype honest about lifecycle gating).

---

## 4. OneTrust visual tokens

All tokens live as CSS custom properties on `:root` in `styles.css`, lifted verbatim from the brief and validation-pipeline reference.

```css
:root {
  /* Brand */
  --ot-mint:   #6CEEAD;
  --ot-jade:   #008665;
  --ot-sky:    #0788F7;
  --ot-purple: #976FE6;
  --ot-yellow: #FFEF3C;
  --ot-black:  #000000;
  --ot-white:  #FFFFFF;
  --ot-beige:  #D9D9CC;

  /* Neutrals */
  --ot-body:   #373737;
  --ot-rule:   #DDDDDD;
  --ot-muted:  #888888;
  --ot-track:  #F5F5F5;

  /* Risk */
  --risk-critical: #E74C3C;
  --risk-high:     #F39C12;
  --risk-medium:   var(--ot-sky);
  --risk-low:      var(--ot-jade);

  /* Surfaces */
  --surface-tint-reg:   #F0F4FF;   /* regulations / sky */
  --surface-tint-pol:   #F0FDF4;   /* policies / jade */
  --surface-tint-rules: #FAF5FF;   /* custom rules / purple */
  --surface-bottom-mint:#F7FDF9;   /* "bottom line" callouts */

  /* Typography */
  --ot-font: 'Arial', system-ui, -apple-system, sans-serif;
  --fs-eyebrow: 9px;     /* uppercase, letter-spacing 0.8–1px */
  --fs-meta:    10px;
  --fs-body:    13px;
  --fs-card-title: 15px;
  --fs-h1: 32px;
  --fs-h2: 16px;
  --fs-metric: 40px;

  /* Geometry */
  --radius-card:  12px;
  --radius-pill:  100px;
  --radius-cell:  1.5px;
  --shadow-card:  0 1px 0 var(--ot-rule);
  --shadow-elev:  0 8px 24px rgba(0,0,0,0.06);

  /* Layout */
  --page-max: 1440px;          /* dashboard is denser than the reference's 1200 */
  --page-pad: 32px;
  --col-min:  280px;
  --inspector-w: 360px;
}
```

### Visual patterns to reuse explicitly
- **Eyebrow label**: `font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;`
- **Source-stripe card**: 12px radius, tinted surface, `::before` 4px top stripe in the source color.
- **Black emphasis section**: black bg, mint headline, gray sub. Use for KPI dark mode (optional) and the automation strip.
- **Mint pill accent**: `background: var(--ot-mint); color: var(--ot-black); padding: 4px 12px; border-radius: var(--radius-pill); font-weight: 700; font-size: 11px;`
- **Micro matrix cells**: `aspect-ratio: 1; border-radius: 1.5px; gap: 1–2px;` with three opacity-modulated cell classes.
- **Primary button** (mint-on-black) for `Request Demo` and `Generate audit memo`; **tertiary arrow-right** for inline links (`Explore the platform →`).

---

## 5. Content & copy recommendations

### Voice
Mirror onetrust.com hero rhythm: short imperative headline, lightweight clarifying sub, no hedging. Favor verbs like *govern*, *resolve*, *surface*, *prevent*. Avoid "leverage", "synergy", "robust".

### Page-level copy

| Slot | Copy |
|---|---|
| H1 | **Continuous validation, end-to-end.** |
| Sub | OneTrust converts 435,000 potential evaluations into a continuously maintained, audit-ready compliance register. PROGRAM mandates auto-resolve; PROCESS mandates flow through this board. |
| Top-bar crumb | Platform / Tech Risk & Compliance / **Validation Console** |
| Primary CTA | Request Demo |
| Secondary CTA | Talk to Sales |

### KPI tile sub-copy (under each metric)
- Blocked: *Auto-escalates after 14 days.*
- Due soon: *SLA pressure across owners.*
- Automation savings: *PROGRAM auto-resolve + dedupe.*
- Control confidence: *Median AI score, last 30 days.*

### Column eyebrows (set above stage name)
- Intake → `STAGE 01 · ROUTING`
- AI pre-screen → `STAGE 02 · LLM SCORING`
- Evidence needed → `STAGE 03 · ARTIFACTS`
- Legal review → `STAGE 04 · COUNSEL`
- Control validation → `STAGE 05 · CONTROL OWNER`
- Ready for audit → `STAGE 06 · PACKET LOCKED`

### Inspector step labels (use these exact strings — they match the validation-pipeline reference's grammar)
1. Obligation mapping
2. Semantic dedupe
3. Evidence match
4. LLM assessment
5. Reviewer decision
6. Audit package

### Bottom callouts (reuse the reference's two-block pattern)
- **The Problem** pill + paragraph: *"Across 200 projects you face 87,000 individual conformity decisions — each requiring context, judgment, and documentation. The problem isn't competence — it's combinatorial scale."*
- **The Approach** pill + paragraph: *"PROGRAM mandates resolve deterministically at the company level. PROCESS mandates receive individual AI evaluation per project. Combined with evidence-based auto-resolution, semantic deduplication, and policy matching, the system turns 435,000 evaluations into one continuously maintained register."*

### Microcopy
- Empty board: *Nothing to validate. Auto-routed items will appear here.*
- Empty inspector: *Select a validation to see its journey from obligation to audit.*
- Toast on action: *Requested DPIA from Marketing Ops · Undo*
- Search empty: *No validations match "%query%". Try clearing a filter chip.*
- Acknowledged rec: *Acknowledged · K. Jones, 2:04 PM*

### Avoid
- The word "ticket" — these are *validations*.
- "AI says" — frame as *AI assessment* or *AI confidence*.
- Currency or hour estimates beyond the single Automation Savings KPI.

---

## 6. Accessibility notes

- **Contrast**: All body copy on white at ≥4.5:1; the gray `#888` used for meta is only ever ≥12px and bold or paired with a 13px black label — never used as a sole text carrier. The `#999` used at 10px in the reference fails AA — bump prototype meta text to `#666` if it's the only carrier of meaning.
- **Mint on white** (`#6CEEAD` on `#FFFFFF`) is decorative only — never use it for text. Use mint as background with black text (which the reference already does for the pill accent), or as a border/dot.
- **Risk-tier color**: Never the only signal. Every pill carries a text label (`HIGH`, `CRITICAL`) and an icon glyph (`◆`, `▲`, `●`, `■`) for color-blind users.
- **Matrix cells**: Cells are not individually focusable (would be 11,000+ tab stops). Instead provide a "View cell details" button per row and an aria-live region that reads the hovered cell tooltip.
- **Keyboard**:
  - Tab order: top-bar → KPI tiles → filter bar → column 1 first card → column 1 next … → inspector → recommendations → matrix → audit trail → footer.
  - Each column is a `role="list"`, each card a `role="listitem"` with `tabindex="0"`.
  - `Enter` opens the card in inspector; `Space` toggles next-best action.
  - Focus ring: 2px solid `--ot-mint` + 2px offset, never removed.
- **Screen reader labels**:
  - Cards expose an `aria-label` like `"Validation V-1042, Customer Lead Capture and Nurture, high risk, 7 obligations, evidence 67 percent, 7 days until SLA, owner K Jones"`.
  - KPI tiles use `<button>` with `aria-pressed` reflecting active filter state.
  - The matrix has a `<table>` semantic with row/column headers (visually hidden) so a screen-reader user can navigate the underlying obligation × project grid.
- **Motion**: All transitions on `transform` / `opacity` only. `@media (prefers-reduced-motion: reduce)` disables card pulse, KPI sparkline draw-in, scale-bar fill, and matrix fade-in.
- **Text resizing**: Layout is built with `rem`-relative type only on top-level headings; everything else uses fixed px to preserve the reference's data-dense rhythm. Confirm the page stays usable at 200% browser zoom — columns should wrap below 768px.
- **Form fields**: Search input has a visible label *"Search validations"* (visually hidden but read aloud) and `aria-controls="board"`.
- **Color tokens for status**: provide a `data-status` attribute on every status-bearing element so screen-reader users get a textual fallback and so QA can assert state without relying on computed colors.
- **Reference back-link**: Footer link to validation-pipeline reference uses descriptive text (`View Validation Pipeline reference →`) — not "click here".

---

## 7. Responsive behavior

| Breakpoint | Change |
|---|---|
| `≥1440px` | Full layout, inspector docked right, 6 columns visible. |
| `1200–1439px` | Inspector docked right, board scrolls horizontally if needed. |
| `1024–1199px` | Inspector collapses to a 320px overlay that slides in from right when a card is selected. KPI rail stays 4-up. |
| `768–1023px` | KPI rail wraps to 2×2. Board becomes horizontal scroll. Inspector becomes a full-screen sheet from the bottom. |
| `<768px` | KPI rail stacks. Columns become vertically stacked accordions (one open at a time). Filter chips become a horizontal-scroll row. Matrix scales down but stays visible. |

---

## 8. Open questions (to resolve before build)

1. Should the inspector also expose a *Reject / Return for evidence* destructive action, or is that out of scope for the prototype's read-only feel?
2. Do we need any per-card audit-trail mini-timeline, or is the global audit-trail block at the bottom enough?
3. Confirm whether `Critical` and `High` should share the amber pill or have distinct ones — the reference's red/amber/green cell legend suggests red is reserved for hard gaps, so we propose red = critical, amber = high here.
4. Is "Validations" the right term across the org, or should the board read "Assessments" to match field nomenclature? Default to "Validations" until told otherwise.
