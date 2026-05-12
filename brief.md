Build a basic standalone HTML/CSS/JS prototype in this folder for a recommended Kanban-style governance dashboard.

Brand/artifact references:
- https://reginsights.web.app/validation-pipeline-diagram.html: use OneTrust-like variables --ot-mint #6CEEAD, black/white, jade #008665, sky #0788F7, purple #976FE6, yellow #FFEF3C, body #373737, rule #DDDDDD; Arial/system sans; crisp cards, tiny uppercase labels, black/mint emphasis, data-matrix microcells, compact regulatory-intelligence visual language.
- https://www.onetrust.com/: use OneTrust header/navigation posture, “AI-Ready Governance Platform” copy tone, responsible AI/privacy/risk/compliance framing, strong black/white with mint/yellow/purple accents.

Assumed recommendations to include (based on current dashboard/product review context):
1. Executive KPI rail at top: blocked validations, due soon, automation savings, control confidence.
2. Work organized by lifecycle columns: Intake, AI pre-screen, Evidence needed, Legal review, Control validation, Ready for audit.
3. Each card should expose risk tier, obligation count, owner, SLA, evidence completeness, AI confidence, and next-best action.
4. Include right-side “Validation pipeline” detail panel showing selected card journey: obligation mapping, semantic dedupe, evidence match, LLM assessment, reviewer decision, audit package.
5. Add filters/search for domain, jurisdiction, risk, owner; sortable chips; density toggle.
6. Show automation recommendations: auto-resolve PROGRAM mandates, group duplicates, prioritize high-risk blockers, surface missing evidence, generate audit memo.
7. Include an evidence/audit trail section and micro matrix heatmap to mirror the reference site.
8. Use plain HTML, CSS, JS only; separate files index.html, styles.css, app.js; no build step.

Quality bar:
- Polished enough to open directly in browser.
- Interactive: selecting cards updates the side panel; filter chips/search/density toggle work; recommendations can be toggled acknowledged.
- Responsive for laptop/tablet.
