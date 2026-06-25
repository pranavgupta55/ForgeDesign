(() => {
  const toolDetails = {
    'feature-toggle': {
      title: 'Feature Toggle',
      badge: 'Feature Control',
      sub: 'State Management',
      body: 'Feature toggles expose or hide functionality without redeploying the application. Useful for staged rollouts, experiments, and role-based gating.',
      files: ['index.html', 'styles.css', 'script.js'],
    },
    'inspector': {
      title: 'Inspector',
      badge: 'Layout Systems',
      sub: 'Interactive State',
      body: 'The inspector pane slides up from the bottom to give extra context without making you lose your place. It is designed for technical documentation and component deep dives.',
      files: ['index.html', 'styles.css'],
    },
  };

  // ── View toggle ──
  const toggle = document.getElementById('view-toggle');
  toggle.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = btn.dataset.idx;
      toggle.classList.remove('idx-0', 'idx-1', 'idx-2');
      toggle.classList.add(`idx-${idx}`);
      toggle.querySelectorAll('button').forEach(b => b.classList.toggle('active', b === btn));
    });
  });

  // ── Section nav scroll-spy ──
  const navLinks = document.querySelectorAll('#section-nav a');
  const sections = Array.from(navLinks).map(a => document.getElementById(a.dataset.target));
  function updateActive() {
    const anchor = window.innerHeight * 0.35;
    let bestIdx = 0;
    let bestDist = Infinity;
    sections.forEach((s, i) => {
      if (!s) return;
      const r = s.getBoundingClientRect();
      const inside = r.top <= anchor && r.bottom >= anchor;
      const dist = inside ? 0 : Math.min(Math.abs(r.top - anchor), Math.abs(r.bottom - anchor));
      if (dist < bestDist) { bestDist = dist; bestIdx = i; }
    });
    navLinks.forEach((a, i) => a.classList.toggle('active', i === bestIdx));
  }
  window.addEventListener('scroll', updateActive, { passive: true });
  window.addEventListener('resize', updateActive);
  updateActive();

  // ── Bottom sheet ──
  const sheet = document.getElementById('sheet');
  const overlay = document.getElementById('sheet-overlay');
  const sheetTitle = document.getElementById('sheet-title');
  const sheetBadge = document.getElementById('sheet-badge');
  const sheetSub = document.getElementById('sheet-sub');
  const sheetBody = document.getElementById('sheet-body-text');
  const sheetFiles = document.getElementById('sheet-files');

  function openSheet(toolId, card) {
    const d = toolDetails[toolId];
    if (!d) return;
    sheetTitle.textContent = d.title;
    sheetBadge.textContent = d.badge;
    sheetSub.textContent = d.sub;
    sheetBody.textContent = d.body;
    sheetFiles.innerHTML = d.files
      .map(f => `<a class="codelink" href="#" onclick="return false"><span class="arrow">↗</span>${f}</a>`)
      .join('');
    sheet.classList.add('open');
    overlay.classList.add('open');
    document.querySelectorAll('.data-card').forEach(c => c.classList.toggle('active', c === card));
  }
  function closeSheet() {
    sheet.classList.remove('open');
    overlay.classList.remove('open');
    document.querySelectorAll('.data-card').forEach(c => c.classList.remove('active'));
  }

  document.querySelectorAll('.data-card[data-tool]').forEach(card => {
    card.addEventListener('click', () => openSheet(card.dataset.tool, card));
  });
  overlay.addEventListener('click', closeSheet);
  sheet.querySelector('.close').addEventListener('click', closeSheet);
  window.addEventListener('keydown', e => { if (e.key === 'Escape') closeSheet(); });

  // ── Smooth scroll for nav links (assist scroll-behavior:smooth) ──
  navLinks.forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const target = document.getElementById(a.dataset.target);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();
