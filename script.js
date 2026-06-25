(() => {
  /* ── Nav scroll-spy + smooth scroll ─────────────────────────────── */
  const navBtns = document.querySelectorAll('.nav-btn');
  const sections = Array.from(navBtns).map(b => document.getElementById(b.dataset.target));

  function setActive(idx) {
    navBtns.forEach((b, i) => b.classList.toggle('active', i === idx));
  }

  navBtns.forEach((btn, idx) => {
    btn.addEventListener('click', () => {
      const target = sections[idx];
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActive(idx);
    });
  });

  function updateActiveFromScroll() {
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
    setActive(bestIdx);
  }

  window.addEventListener('scroll', updateActiveFromScroll, { passive: true });
  window.addEventListener('resize', updateActiveFromScroll);
  updateActiveFromScroll();

  /* ── Layout primitives demo — state-driven section windows ──────── */

  const ICONS = {
    up:    '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 19h11a3 3 0 0 0 3-3V9"/><path d="M13 9l4-4 4 4"/></svg>',
    done:  '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12.5l5 5L20 6.5"/></svg>',
    down:  '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5h11a3 3 0 0 1 3 3v7"/><path d="M13 15l4 4 4-4"/></svg>',
    purge: '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16"/><path d="M10 7V4h4v3"/><path d="M6 7l1 13h10l1-13"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>',
  };

  const STATUS_META = [
    { key: 'in_progress', label: 'active',   dotClass: 'dot-active'   },
    { key: 'pending',     label: 'pending',  dotClass: 'dot-pending'  },
    { key: 'done',        label: 'done',     dotClass: 'dot-done'     },
    { key: 'archived',    label: 'archived', dotClass: 'dot-archived' },
  ];

  // Small initial demo (~5 tasks). Reset by hard reload.
  const demoTasks = [
    {
      id: 'f0a9qp', status: 'in_progress',
      sessionTitle: 'Forge Rebuild and Task List Setup', sessionId: 'ab0c1c8d',
      desc: 'audit other diff-comparison code for whitespace false-positive bugs',
      project: 'custom', day: 'today', toc: 'AFTERNOON', hms: '4:25 PM',
    },
    {
      id: 'k8sils', status: 'pending',
      sessionTitle: 'Kiso Interview Transcription', sessionId: '12b1199f',
      desc: 'Ask Brent for good and bad mermaid diagram examples',
      project: 'alpha', day: 'yesterday', toc: 'MORNING', hms: '11:21 AM',
    },
    {
      id: '7kbqyz', status: 'pending',
      sessionTitle: 'Kiso Interview Transcription', sessionId: '12b1199f',
      desc: 'Build code-review-at-scale skill — mermaid → click node → see inline diff',
      project: 'beta', day: 'yesterday', toc: 'MORNING', hms: '11:21 AM',
    },
    {
      id: 'vtwnak', status: 'done',
      sessionTitle: 'Scribe Hormozi Batch', sessionId: '8def3d29',
      desc: 'Manually delete the stale graph-rebuild remote branch',
      project: 'gamma', day: '2 days ago', toc: 'NIGHT', hms: '10:51 PM',
    },
    {
      id: 'mmzaet', status: 'archived',
      sessionTitle: 'Vandal Plugin Setup', sessionId: '5e1a72c4',
      desc: 'Move Vandal plugin tests outside ~/.claude/ tree (deferred)',
      project: 'beta', day: '1 week ago', toc: 'EVENING', hms: '7:42 PM',
    },
  ];

  // Bucket-shift semantics — match the live Tasks dashboard.
  function applyAction(task, action) {
    if (action === 'up') {
      if (task.status === 'pending')  task.status = 'in_progress';
      else if (task.status === 'done' || task.status === 'archived') task.status = 'pending';
    } else if (action === 'down') {
      if (task.status === 'in_progress') task.status = 'pending';
      else if (task.status === 'pending' || task.status === 'done') task.status = 'archived';
    } else if (action === 'done') {
      task.status = 'done';
    } else if (action === 'purge') {
      const idx = demoTasks.indexOf(task);
      if (idx >= 0) demoTasks.splice(idx, 1);
    }
  }

  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[c]));

  function renderRow(t) {
    // Per-status disabled flags for the 2x2 cluster.
    const isActive   = t.status === 'in_progress';
    const isPending  = t.status === 'pending';
    const isDone     = t.status === 'done';
    const isArchived = t.status === 'archived';

    const upDisabled    = isActive;
    const doneDisabled  = isDone || isArchived;
    const downDisabled  = isArchived;
    const purgeDisabled = !isArchived;

    const btn = (action, disabled, icon) =>
      `<button class="ac-btn${disabled ? ' disabled' : ''}" data-id="${esc(t.id)}" data-action="${action}"${disabled ? ' disabled' : ''} aria-label="${action}">${icon}</button>`;

    const projCls = t.project === 'custom' ? ' custom' : '';

    return `<div class="row-demo">
      <div class="ac-cluster">
        ${btn('up',    upDisabled,    ICONS.up)}
        ${btn('done',  doneDisabled,  ICONS.done)}
        ${btn('down',  downDisabled,  ICONS.down)}
        ${btn('purge', purgeDisabled, ICONS.purge)}
      </div>
      <div class="r-session">
        <span class="r-s-title">${esc(t.sessionTitle)}</span>
        <span class="r-s-id">${esc(t.sessionId)}</span>
      </div>
      <span class="r-id">${esc(t.id)}</span>
      <span class="r-title">${esc(t.desc)}</span>
      <span class="r-project${projCls}">${esc(t.project)}</span>
      <span class="r-day">${esc(t.day)}</span>
      <span class="r-time"><span class="toc">${esc(t.toc)}</span><span class="hms">${esc(t.hms)}</span></span>
    </div>`;
  }

  function renderTables() {
    const wrap = document.getElementById('demo-tables');
    if (!wrap) return;
    wrap.innerHTML = STATUS_META.map(({ key, label, dotClass }) => {
      const items = demoTasks.filter(t => t.status === key);
      const body = items.length
        ? items.map(renderRow).join('')
        : `<div class="row-empty">— no ${label} tasks —</div>`;
      return `<section class="window-demo" style="margin-bottom:18px">
        <h2 class="window-head">
          <span class="dot ${dotClass}"></span>${label}<span class="ct">${items.length}</span>
        </h2>
        <div class="row-header-demo">
          <span class="h-actions"></span>
          <span class="h-session">Title + Session ID</span>
          <span class="h-id">task ID</span>
          <span class="h-title">Desc</span>
          <span class="h-project">Proj</span>
          <span class="h-day">Day</span>
          <span class="h-time">Time</span>
        </div>
        ${body}
      </section>`;
    }).join('');
  }

  function renderStats() {
    const el = document.getElementById('demo-stats');
    if (!el) return;
    const c = { in_progress: 0, pending: 0, done: 0, archived: 0 };
    demoTasks.forEach(t => { c[t.status] = (c[t.status] || 0) + 1; });
    const open = c.in_progress + c.pending;
    el.innerHTML = `
      <div class="stat-cell"><span class="n">${open}</span><span class="l">open</span></div>
      <div class="stat-cell"><span class="n active">${c.in_progress}</span><span class="l">active</span></div>
      <div class="stat-cell"><span class="n pending">${c.pending}</span><span class="l">pending</span></div>
      <div class="stat-cell"><span class="n done">${c.done}</span><span class="l">done</span></div>
      <div class="stat-cell"><span class="n archived">${c.archived}</span><span class="l">archived</span></div>
    `;
  }

  function rerender() { renderStats(); renderTables(); }

  // Delegated click for the dynamically-rendered action buttons.
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.ac-btn');
    if (!btn || !btn.dataset.id || btn.classList.contains('disabled')) return;
    const task = demoTasks.find(t => t.id === btn.dataset.id);
    if (!task) return;
    applyAction(task, btn.dataset.action);
    rerender();
  });

  /* ── Filter bar (chip toggle + Select all / Select none bookends) ── */
  const filterBar = document.getElementById('demo-filter');
  if (filterBar) {
    const allBtn  = filterBar.querySelector('[data-filter="all"]');
    const noneBtn = filterBar.querySelector('[data-filter="none"]');
    const chips   = Array.from(filterBar.querySelectorAll('.filter-chip'));

    if (allBtn && noneBtn && chips.length) {
      const syncBookends = () => {
        const on = chips.filter(c => c.classList.contains('active')).length;
        allBtn.classList.toggle('active',  on === chips.length);
        noneBtn.classList.toggle('active', on === 0);
      };
      allBtn.addEventListener('click',  () => { chips.forEach(c => c.classList.add('active'));    syncBookends(); });
      noneBtn.addEventListener('click', () => { chips.forEach(c => c.classList.remove('active')); syncBookends(); });
      chips.forEach(c => c.addEventListener('click', () => { c.classList.toggle('active'); syncBookends(); }));
      syncBookends();
    }
  }

  /* ── Component filter chips (in the Components section) keep their
     original toggle-only behaviour. ── */
  document.querySelectorAll('#components .filter-chip').forEach(chip => {
    chip.addEventListener('click', () => chip.classList.toggle('active'));
  });

  rerender();
})();
