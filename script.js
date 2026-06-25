(() => {
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

  document.querySelectorAll('.filter-chip').forEach(chip => {
    chip.addEventListener('click', () => chip.classList.toggle('active'));
  });
})();
