// Cursor, after the FOMA site's (itself after klutch.studio's): the pointer becomes a small ink dot that swells into
// a big magenta circle over anything you can click. The circle is drawn "multiply", so it tints whatever is under it
// while dark text stays dark and readable, as if the circle sat behind the words.
//
// Usage: <script src="cursor.js" defer></script> on any page. Only for mice and trackpads: on touch screens there is
// no pointer to replace, so nothing changes there.
(() => {
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const style = document.createElement('style');
  style.textContent = [
    // The real pointer is hidden everywhere while the dot stands in for it.
    'html.rf-cursor, html.rf-cursor * { cursor: none !important; }',
    // The dot is a 76px circle shown at a fifth of its size, so growing it is a smooth scale, not a re-draw.
    '.rf-cursor-dot { position: fixed; left: 0; top: 0; width: 76px; height: 76px; margin: -38px 0 0 -38px; border-radius: 50%;',
    '  background: #16150F; mix-blend-mode: multiply; pointer-events: none; z-index: 2147483647; scale: 0.19; opacity: 0;',
    '  transition: scale 0.3s cubic-bezier(0.2, 0.7, 0.2, 1), background-color 0.3s, opacity 0.2s; will-change: translate; }',
    '.rf-cursor-dot.shown { opacity: 1; }',
    '.rf-cursor-dot.over { scale: 1; background: #FF1FA0; }',
    '.rf-cursor-dot.down { scale: 0.14; }',
    '.rf-cursor-dot.over.down { scale: 0.85; }',
  ].join('\n');
  document.head.append(style);

  const dot = document.createElement('div');
  dot.className = 'rf-cursor-dot';
  dot.setAttribute('aria-hidden', 'true');
  document.body.append(dot);
  document.documentElement.classList.add('rf-cursor');

  const CLICKABLE = 'a, button, [role="button"], [data-target], label, input, select, textarea, summary, video';
  addEventListener('pointermove', e => {
    dot.style.translate = `${e.clientX}px ${e.clientY}px`;
    dot.classList.add('shown');
    dot.classList.toggle('over', !!e.target.closest?.(CLICKABLE));
  }, { passive: true });
  addEventListener('pointerdown', () => dot.classList.add('down'));
  addEventListener('pointerup', () => dot.classList.remove('down'));
  // Off the page (the pointer left the window), the dot goes too, instead of sticking at the edge.
  document.addEventListener('pointerleave', () => dot.classList.remove('shown'));
  document.documentElement.addEventListener('mouseleave', () => dot.classList.remove('shown'));
})();
