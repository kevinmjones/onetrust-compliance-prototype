document.querySelectorAll('.ai-insights-toggle').forEach(toggle => {
  const targetId = toggle.getAttribute('aria-controls');
  const panel = targetId && document.getElementById(targetId);
  if (!panel) return;
  toggle.addEventListener('click', () => {
    const isOpen = panel.dataset.state === 'open';
    panel.dataset.state = isOpen ? 'closed' : 'open';
    toggle.setAttribute('aria-expanded', String(!isOpen));
  });
});
