const stages = [
  { id: 'intake', title: 'Intake', eyebrow: 'STAGE 01 · ROUTING', color: 'var(--ot-sky)' },
  { id: 'prescreen', title: 'AI pre-screen', eyebrow: 'STAGE 02 · LLM SCORING', color: 'var(--ot-purple)' },
  { id: 'evidence', title: 'Evidence needed', eyebrow: 'STAGE 03 · ARTIFACTS', color: 'var(--ot-yellow)' },
  { id: 'legal', title: 'Legal review', eyebrow: 'STAGE 04 · COUNSEL', color: 'var(--ot-jade)' },
  { id: 'control', title: 'Control validation', eyebrow: 'STAGE 05 · CONTROL OWNER', color: 'var(--ot-mint)' },
  { id: 'ready', title: 'Ready for audit', eyebrow: 'STAGE 06 · PACKET LOCKED', color: 'var(--ot-black)' }
];

const riskWeight = { critical: 4, high: 3, medium: 2, low: 1 };
const filters = { domain: 'All', jurisdiction: 'All', risk: 'All', owner: 'All', project: 'All' };
let selectedId = null;
let activeKpi = null;
let searchTerm = '';
let toastTimer = null;

const validations = [
  validation('V-1042', 'P-073', 'Customer Lead Capture & Nurture', 'Marketing', ['EU', 'UK'], 7, 'high', owner('K. Jones', 'KJ', 'Privacy Lead'), 'evidence', 7, false, 4, 6, 0.82, 'Request DPIA from Marketing Ops', 'request_evidence', ['missing_evidence'], '2026-05-12T14:02:00Z'),
  validation('V-1057', 'P-018', 'Partner Data Clean Room', 'Product', ['US-CA', 'EU'], 11, 'critical', owner('M. Patel', 'MP', 'Product Counsel'), 'legal', 3, false, 7, 11, 0.76, 'Escalate cross-border transfer clause', 'escalate', ['sla_breach', 'escalated'], '2026-05-12T13:21:00Z'),
  validation('V-1008', 'P-144', 'Employee Skills Graph', 'HR', ['EU', 'US-NY'], 5, 'medium', owner('A. Rivera', 'AR', 'HR Compliance'), 'prescreen', 16, false, 3, 5, 0.69, 'Acknowledge AI assessment', 'approve', ['new'], '2026-05-12T12:50:00Z'),
  validation('V-1119', 'P-091', 'Vendor Risk Exchange', 'Security', ['US', 'UK'], 9, 'high', owner('L. Chen', 'LC', 'Security GRC'), 'control', 5, false, 8, 9, 0.91, 'Validate SOC 2 control mapping', 'approve', ['missing_evidence'], '2026-05-12T11:19:00Z'),
  validation('V-0981', 'P-026', 'AI Support Summarizer', 'Engineering', ['EU', 'US-CA'], 13, 'critical', owner('N. Brooks', 'NB', 'AI Governance'), 'intake', 2, true, 2, 9, null, 'Prioritize high-risk triage', 'escalate', ['sla_breach', 'new'], '2026-05-12T10:44:00Z'),
  validation('V-1094', 'P-133', 'Quarterly Finance Forecasting', 'Finance', ['US', 'EU'], 4, 'low', owner('D. Smith', 'DS', 'Control Owner'), 'ready', 22, false, 4, 4, 0.97, 'Generate audit memo', 'generate_memo', [], '2026-05-11T18:10:00Z'),
  validation('V-1128', 'P-204', 'Consent Preference Sync', 'Product', ['EU', 'UK', 'US-CA'], 8, 'high', owner('K. Jones', 'KJ', 'Privacy Lead'), 'evidence', 6, false, 5, 8, 0.88, 'Request CMP export evidence', 'request_evidence', ['missing_evidence'], '2026-05-12T09:38:00Z'),
  validation('V-1166', 'P-215', 'Developer Access Review', 'Security', ['US', 'EU'], 6, 'medium', owner('L. Chen', 'LC', 'Security GRC'), 'control', 12, false, 5, 6, 0.93, 'Approve access control test', 'approve', [], '2026-05-11T20:10:00Z'),
  validation('V-1022', 'P-052', 'Candidate Screening Workflow', 'HR', ['EU', 'UK'], 10, 'critical', owner('A. Rivera', 'AR', 'HR Compliance'), 'legal', 1, true, 6, 10, 0.64, 'Return for bias impact evidence', 'request_evidence', ['sla_breach', 'missing_evidence'], '2026-05-12T08:13:00Z'),
  validation('V-1172', 'P-188', 'Marketing Attribution Warehouse', 'Marketing', ['US-CA'], 3, 'low', owner('J. Wu', 'JW', 'Data Steward'), 'ready', 18, false, 3, 3, 0.95, 'Lock audit package', 'generate_memo', [], '2026-05-11T16:43:00Z'),
  validation('V-1014', 'P-061', 'Internal Knowledge Assistant', 'Engineering', ['US', 'EU'], 12, 'high', owner('N. Brooks', 'NB', 'AI Governance'), 'prescreen', 9, false, 7, 12, 0.71, 'Group duplicate model findings', 'dedupe', ['new'], '2026-05-12T07:30:00Z'),
  validation('V-1201', 'P-233', 'Procurement Renewal Bot', 'Finance', ['US', 'UK'], 6, 'medium', owner('D. Smith', 'DS', 'Control Owner'), 'intake', 15, false, 2, 6, null, 'Auto-resolve PROGRAM mandates', 'auto_resolve', ['new'], '2026-05-11T14:06:00Z')
];

const recommendations = [
  { id: 'program', eyebrow: 'AUTO-RESOLVE · PROGRAM', title: '130 company-wide mandates resolved as evidence', proof: 'Saves 26,000 evaluations' },
  { id: 'dedupe', eyebrow: 'DEDUPE · SEMANTIC', title: 'Group 41 duplicate findings across 8 projects', proof: 'Collapses to 12 unique items' },
  { id: 'risk', eyebrow: 'PRIORITIZE · RISK', title: 'Surface 12 high-risk blockers for owner review', proof: 'Median SLA: 3 days' },
  { id: 'evidence', eyebrow: 'EVIDENCE · GAPS', title: 'Request DPIA for Lead Capture & 6 others', proof: 'Missing in evidence-match step' },
  { id: 'memo', eyebrow: 'AUDIT MEMO · DRAFT', title: 'Generate Q2 audit memo from 84 locked packets', proof: 'One click in audit step' }
];

const auditEvents = [
  ['AI', 'AI scored P-073 / DPIA Article 35 at 0.94 confidence.', '2 minutes ago'],
  ['HUMAN', 'K. Jones approved Lead Capture audit packet.', '14 minutes ago'],
  ['AUTO', 'Auto-resolved 14 PROGRAM mandates against the Q2 cohort.', '21 minutes ago'],
  ['AI', 'Semantic dedupe grouped 9 consent findings into 3 unique obligations.', '38 minutes ago'],
  ['HUMAN', 'M. Patel returned Partner Data Clean Room for transfer evidence.', '52 minutes ago'],
  ['AUTO', 'Missing SOC 2 control evidence surfaced for Security GRC.', '1 hour ago'],
  ['AI', 'LLM assessment drafted reviewer rationale for P-061.', '2 hours ago'],
  ['HUMAN', 'D. Smith locked finance forecasting audit packet.', 'Yesterday']
];

function owner(name, initials, role) {
  return { name, initials, role };
}

function validation(id, project, title, domain, jurisdiction, obligationCount, riskTier, ownerValue, stage, daysRemaining, breached, collected, required, aiConfidence, actionLabel, actionType, flags, updatedAt) {
  const obligations = [
    { id: 'GDPR-30(1)', source: 'reg', label: 'Records of Processing' },
    { id: 'POL-DPIA-04', source: 'pol', label: 'DPIA Procedure' },
    { id: 'RULE-AI-12', source: 'rules', label: 'AI Review Rule' }
  ];
  return {
    id,
    project,
    title,
    domain,
    jurisdiction,
    obligations,
    obligationCount,
    riskTier,
    owner: ownerValue,
    stage,
    sla: { dueDate: '2026-05-19', daysRemaining, breached },
    evidence: { collected, required, percent: Math.round((collected / required) * 100) },
    aiConfidence,
    nextBestAction: { label: actionLabel, type: actionType, taken: false },
    pipeline: {
      mapping: { matched: obligationCount, autoResolved: Math.min(4, Math.max(1, Math.floor(obligationCount / 3))) },
      dedupe: { surface: obligationCount + 5, unique: Math.max(2, Math.ceil(obligationCount / 2)) },
      evidence: { artifacts: ['DPIA-draft.pdf', 'ROPA-v3.xlsx', 'Control-test.csv'].slice(0, Math.max(1, collected > 4 ? 3 : 2)) },
      llm: { model: 'OneTrust-LLM-7B', score: aiConfidence, rationale: 'Assessment aligns mapped obligations to attached evidence, flags unresolved PROCESS controls, and prepares reviewer-ready rationale.' },
      reviewer: { status: stage === 'ready' ? 'approved' : stage === 'legal' ? 'returned' : 'pending', note: stage === 'ready' ? 'Packet reviewed and ready for audit.' : 'Awaiting owner decision.' },
      audit: { status: stage === 'ready' ? 'locked' : 'draft', packetId: stage === 'ready' ? `${project}-Q2` : null }
    },
    updatedAt,
    flags
  };
}

document.addEventListener('DOMContentLoaded', () => {
  const storedDensity = localStorage.getItem('ot.density') || 'comfortable';
  document.body.classList.toggle('compact', storedDensity === 'compact');
  bindInputs(storedDensity);
  renderFilters();
  renderBoard();
  renderInspector();
  renderRecommendations();
  renderMatrix();
  renderTimeline();
  hydrateHash();
});

function bindInputs(storedDensity) {
  const boardSearch = document.getElementById('boardSearch');
  const syncSearch = debounce(value => {
    searchTerm = value.trim().toLowerCase();
    renderBoard();
  }, 120);

  boardSearch.addEventListener('input', event => syncSearch(event.target.value));

  document.getElementById('sortSelect').addEventListener('change', renderBoard);

  document.querySelectorAll('[data-density]').forEach(button => {
    button.classList.toggle('active', button.dataset.density === storedDensity);
    button.addEventListener('click', () => setDensity(button.dataset.density));
  });

  document.querySelectorAll('[data-kpi]').forEach(button => {
    button.addEventListener('click', () => {
      activeKpi = activeKpi === button.dataset.kpi ? null : button.dataset.kpi;
      document.querySelectorAll('[data-kpi]').forEach(kpi => {
        kpi.setAttribute('aria-pressed', String(kpi.dataset.kpi === activeKpi));
      });
      renderBoard();
    });
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') clearSelection();
  });

  document.getElementById('board').addEventListener('click', event => {
    if (event.target.id === 'board') clearSelection();
  });
}

function renderFilters() {
  const definitions = [
    ['domain', 'Domain', ['All', 'Marketing', 'Product', 'HR', 'Engineering', 'Finance', 'Security']],
    ['jurisdiction', 'Jurisdiction', ['All', 'EU', 'UK', 'US', 'US-CA', 'US-NY']],
    ['risk', 'Risk', ['All', 'Critical', 'High', 'Medium', 'Low']],
    ['owner', 'Owner', ['All', 'K. Jones', 'M. Patel', 'A. Rivera', 'L. Chen', 'N. Brooks', 'D. Smith', 'J. Wu']],
    ['project', 'Project', ['All', ...validations.map(card => card.project)]]
  ];
  const chips = document.getElementById('filterChips');
  chips.innerHTML = definitions.map(([key, label, options]) => {
    const value = filters[key];
    const active = value !== 'All';
    const opts = options.map(option => `<option value="${option}" ${option === value ? 'selected' : ''}>${option}</option>`).join('');
    return `
      <label class="chip ${active ? 'active' : ''}">
        ${label}: <select data-filter="${key}" aria-label="${label} filter">${opts}</select>
        ${active ? `<button class="reset" data-reset="${key}" type="button" aria-label="Reset ${label} filter">×</button>` : ''}
      </label>
    `;
  }).join('');

  chips.querySelectorAll('[data-filter]').forEach(select => {
    select.addEventListener('change', event => {
      filters[event.target.dataset.filter] = event.target.value;
      renderFilters();
      renderBoard();
    });
  });
  chips.querySelectorAll('[data-reset]').forEach(button => {
    button.addEventListener('click', event => {
      filters[event.target.dataset.reset] = 'All';
      renderFilters();
      renderBoard();
    });
  });
}

function renderBoard() {
  const board = document.getElementById('board');
  const visible = getVisibleCards();
  const sortMode = document.getElementById('sortSelect').value;
  board.innerHTML = stages.map(stage => {
    const cards = visible.filter(card => card.stage === stage.id).sort(sortCards(sortMode));
    return `
      <section class="column" aria-labelledby="${stage.id}-title">
        <header class="column-header" style="color:${stage.color}">
          <span class="eyebrow">${stage.eyebrow}</span>
          <div class="column-title" id="${stage.id}-title">${stage.title}<span class="count-pill">${cards.length}</span></div>
        </header>
        <div class="cards" role="list">
          ${cards.length ? cards.map(renderCard).join('') : `<p class="empty-column">${searchTerm ? 'No matches in this stage.' : 'No projects in this stage. Auto-routed items will appear here.'}</p>`}
        </div>
      </section>
    `;
  }).join('');

  board.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', event => {
      if (event.target.closest('.action-button')) return;
      selectCard(card.dataset.id);
    });
    card.addEventListener('keydown', event => handleCardKey(event, card.dataset.id));
  });

  board.querySelectorAll('.action-button').forEach(button => {
    button.addEventListener('click', event => {
      event.stopPropagation();
      takeAction(button.dataset.id);
    });
  });

  document.getElementById('resultCount').textContent = `Showing ${visible.length} of ${validations.length} projects`;
}

function renderCard(card) {
  const riskIcon = card.riskTier === 'critical' ? '▲' : card.riskTier === 'high' ? '◆' : card.riskTier === 'medium' ? '●' : '■';
  const ai = card.aiConfidence == null ? 'Queued' : card.aiConfidence.toFixed(2);
  const slaFill = card.sla.breached ? 'repeating-linear-gradient(45deg, #E74C3C 0 6px, #000 6px 9px)' : card.sla.daysRemaining < 7 ? 'var(--risk-critical)' : card.sla.daysRemaining < 14 ? 'var(--risk-high)' : 'var(--ot-jade)';
  const slaPercent = Math.max(8, Math.min(100, ((21 - Math.min(card.sla.daysRemaining, 21)) / 21) * 100));
  return `
    <article class="card ${selectedId === card.id ? 'selected' : ''}" data-id="${card.id}" role="listitem" tabindex="0" aria-label="Project ${card.id}, ${card.title}, ${card.riskTier} risk, ${card.obligationCount} obligations, evidence ${card.evidence.percent} percent, ${card.sla.daysRemaining} days until SLA, owner ${card.owner.name}">
      <div class="card-topline">${card.domain} · ${card.jurisdiction.join('+')} · ${card.project}</div>
      <h3 class="card-title">${card.title}</h3>
      <div class="pill-row">
        <span class="risk-pill risk-${card.riskTier}" data-status="${card.riskTier}">${riskIcon} ${card.riskTier} risk</span>
        <span class="obligation-count">${card.obligationCount} obligations</span>
      </div>
      <div class="meta-row"><span class="avatar">${card.owner.initials}</span><span>${card.owner.name} · ${card.owner.role}</span></div>
      <div class="metric-line"><span>SLA</span><div class="bar"><span style="--value:${slaPercent}%; --fill:${slaFill}"></span></div><strong>${card.sla.breached ? 'Late' : `${card.sla.daysRemaining}d`}</strong></div>
      <div class="metric-line"><span>Evidence</span><div class="bar"><span style="--value:${card.evidence.percent}%"></span></div><strong>${card.evidence.percent}%</strong></div>
      <div class="metric-line ai-line"><span>AI conf</span><div class="bar"><span style="--value:${card.aiConfidence == null ? 8 : card.aiConfidence * 100}%"></span></div><strong>${ai}</strong></div>
      <button class="action-button" data-id="${card.id}" type="button">▸ ${card.nextBestAction.taken ? 'Action taken' : card.nextBestAction.label}</button>
    </article>
  `;
}

function getVisibleCards() {
  return validations.filter(card => {
    const query = !searchTerm || [
      card.title,
      card.owner.name,
      card.domain,
      card.project,
      card.id,
      ...card.obligations.map(item => item.id)
    ].join(' ').toLowerCase().includes(searchTerm);
    const filterMatch =
      (filters.domain === 'All' || card.domain === filters.domain) &&
      (filters.jurisdiction === 'All' || card.jurisdiction.includes(filters.jurisdiction)) &&
      (filters.risk === 'All' || card.riskTier === filters.risk.toLowerCase()) &&
      (filters.owner === 'All' || card.owner.name === filters.owner) &&
      (filters.project === 'All' || card.project === filters.project);
    const kpiMatch =
      !activeKpi ||
      (activeKpi === 'blocked' && (card.flags.includes('sla_breach') || ['critical', 'high'].includes(card.riskTier))) ||
      (activeKpi === 'due' && card.sla.daysRemaining <= 7) ||
      (activeKpi === 'automation' && ['auto_resolve', 'dedupe', 'generate_memo'].includes(card.nextBestAction.type)) ||
      (activeKpi === 'confidence' && (card.aiConfidence == null || card.aiConfidence < 0.8));
    return query && filterMatch && kpiMatch;
  });
}

function sortCards(mode) {
  return (a, b) => {
    if (mode === 'risk') return riskWeight[b.riskTier] - riskWeight[a.riskTier] || a.sla.daysRemaining - b.sla.daysRemaining;
    if (mode === 'confidence') return (a.aiConfidence ?? 0) - (b.aiConfidence ?? 0);
    if (mode === 'updated') return new Date(b.updatedAt) - new Date(a.updatedAt);
    return a.sla.daysRemaining - b.sla.daysRemaining;
  };
}

function selectCard(id) {
  selectedId = selectedId === id ? null : id;
  if (selectedId) {
    history.replaceState(null, '', `#${selectedId}`);
  } else {
    history.replaceState(null, '', location.pathname);
  }
  renderBoard();
  renderInspector();
}

function clearSelection() {
  if (!selectedId) return;
  selectedId = null;
  history.replaceState(null, '', location.pathname);
  renderBoard();
  renderInspector();
}

function renderInspector() {
  const inspector = document.getElementById('inspector');
  const card = validations.find(item => item.id === selectedId);
  if (!card) {
    inspector.innerHTML = `
      <div class="inspector-header">
        <p class="eyebrow">PROJECT PIPELINE</p>
        <h2>Select a project</h2>
        <p>Select a project to see its journey from obligation to audit.</p>
      </div>
      <div class="mini-matrix" aria-hidden="true">${Array.from({ length: 9 }, () => '<span></span>').join('')}</div>
      <p class="hero-copy">Obligation mapping, semantic dedupe, evidence match, LLM assessment, reviewer decision, and audit package status appear here.</p>
    `;
    return;
  }

  const obligationTags = card.obligations.map(item => `<span class="source-tag ${item.source}">${item.id}</span>`).join(' ');
  inspector.innerHTML = `
    <div class="inspector-header">
      <p class="eyebrow">PROJECT PIPELINE · ${card.project}</p>
      <h2>${card.title}</h2>
      <span class="risk-pill risk-${card.riskTier}" data-status="${card.riskTier}">${card.riskTier} risk</span>
    </div>
    ${step('Obligation mapping', `${obligationTags}<p>${card.pipeline.mapping.matched} matched obligations · ${card.pipeline.mapping.autoResolved} PROGRAM mandates auto-resolved.</p>`)}
    ${step('Semantic dedupe', `<p>${card.pipeline.dedupe.surface} surface findings → ${card.pipeline.dedupe.unique} unique findings.</p><p>● ● → ● duplicate clusters merged by policy intent.</p>`)}
    ${step('Evidence match', `<div class="metric-line"><span>Complete</span><div class="bar"><span style="--value:${card.evidence.percent}%"></span></div><strong>${card.evidence.percent}%</strong></div><p>${card.pipeline.evidence.artifacts.join(' · ')}</p>`)}
    ${step('LLM assessment', `<p>${card.pipeline.llm.model} · Score ${card.pipeline.llm.score == null ? 'Queued' : card.pipeline.llm.score.toFixed(2)}</p><blockquote>${card.pipeline.llm.rationale}</blockquote>`)}
    ${step('Reviewer decision', `<p><span class="avatar">${card.owner.initials}</span> ${card.owner.name} · ${card.owner.role}</p><p>Status: <strong>${card.pipeline.reviewer.status}</strong></p><p>${card.pipeline.reviewer.note}</p>`)}
    ${step('Audit package', `<p>Status: <strong>${card.pipeline.audit.status}</strong>${card.pipeline.audit.packetId ? ` · ${card.pipeline.audit.packetId}` : ''}</p><button class="primary-button" type="button">Generate audit memo</button>`)}
  `;
}

function step(title, body) {
  return `<details class="pipeline-step" open><summary>${title}</summary><div class="step-body">${body}</div></details>`;
}

function takeAction(id) {
  const card = validations.find(item => item.id === id);
  if (!card) return;
  card.nextBestAction.taken = true;
  const node = document.querySelector(`.card[data-id="${id}"]`);
  if (node) {
    node.classList.add('pulse', 'action-taken');
    setTimeout(() => node.classList.remove('pulse', 'action-taken'), 700);
  }
  showToast(`${card.nextBestAction.label} · Undo`);
  renderBoard();
  if (selectedId === id) renderInspector();
}

function showToast(message) {
  const toast = document.getElementById('toast');
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add('show');
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}

function renderRecommendations() {
  const acknowledged = JSON.parse(localStorage.getItem('ot.recommendations') || '{}');
  const container = document.getElementById('recommendations');
  container.innerHTML = recommendations.map(rec => {
    const active = Boolean(acknowledged[rec.id]);
    return `
      <article class="rec-card ${active ? 'acknowledged' : ''}">
        <span class="eyebrow">${rec.eyebrow}</span>
        <strong>${rec.title}</strong>
        <p>${rec.proof}</p>
        <button class="ack-button ${active ? 'active' : ''}" data-rec="${rec.id}" type="button">${active ? 'Acknowledged ✓' : 'Acknowledge'}</button>
      </article>
    `;
  }).join('');

  container.querySelectorAll('[data-rec]').forEach(button => {
    button.addEventListener('click', () => {
      acknowledged[button.dataset.rec] = !acknowledged[button.dataset.rec];
      localStorage.setItem('ot.recommendations', JSON.stringify(acknowledged));
      renderRecommendations();
    });
  });
}

function renderMatrix() {
  const matrix = document.getElementById('matrix');
  const tooltip = document.getElementById('matrixTooltip');
  const cells = Array.from({ length: 28 * 8 }, (_, index) => {
    const project = validations[index % validations.length].project;
    const status = index % 17 === 0 ? 'gap' : index % 7 === 0 ? 'uncertain' : 'ok';
    return { project, obligation: `GDPR Art ${30 + (index % 12)}(${(index % 4) + 1})`, status };
  });
  matrix.innerHTML = cells.map((cell, index) => `<button class="cell-${cell.status}" data-project="${cell.project}" data-tip="Project ${cell.project} · ${cell.obligation} · ${labelStatus(cell.status)}" aria-label="Project ${cell.project}, ${cell.obligation}, ${labelStatus(cell.status)}" role="gridcell" type="button"></button>`).join('');
  matrix.querySelectorAll('button').forEach(button => {
    button.addEventListener('mouseenter', () => { tooltip.textContent = button.dataset.tip; });
    button.addEventListener('focus', () => { tooltip.textContent = button.dataset.tip; });
    button.addEventListener('click', () => {
      filters.project = button.dataset.project;
      renderFilters();
      renderBoard();
      showToast(`Filtered board to ${button.dataset.project}`);
    });
  });
}

function labelStatus(status) {
  return status === 'ok' ? 'Conformant' : status === 'gap' ? 'Gap' : 'Needs review';
}

function renderTimeline() {
  document.getElementById('timeline').innerHTML = auditEvents.map(([actor, event, time]) => `
    <li style="--dot:${actor === 'HUMAN' ? 'var(--ot-black)' : 'var(--ot-mint)'}">
      <span class="actor">${actor}</span>
      <p>${event}</p>
      <time>${time}</time>
    </li>
  `).join('');
}

function setDensity(density) {
  localStorage.setItem('ot.density', density);
  document.body.classList.toggle('compact', density === 'compact');
  document.querySelectorAll('[data-density]').forEach(button => {
    button.classList.toggle('active', button.dataset.density === density);
  });
}

function handleCardKey(event, id) {
  if (event.key === 'Enter') {
    event.preventDefault();
    selectCard(id);
  }
  if (event.key === ' ') {
    event.preventDefault();
    takeAction(id);
  }
}

function hydrateHash() {
  const hash = location.hash.replace('#', '');
  if (validations.some(card => card.id === hash)) {
    selectedId = hash;
    renderBoard();
    renderInspector();
  }
}

function debounce(fn, wait) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  };
}
