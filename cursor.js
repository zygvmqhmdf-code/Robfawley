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
    // Over a film shown full screen (on black) the ink dot would vanish, so it turns white, drawn plainly rather than multiplied.
    '.rf-cursor-dot.on-dark { background: #fff; mix-blend-mode: normal; }',
    // and the magenta circle stays see-through, as it is on the white page, so the film shows through it
    '.rf-cursor-dot.on-dark.over { background: rgba(255, 31, 160, 0.55); }',
  ].join('\n');
  document.head.append(style);

  const dot = document.createElement('div');
  dot.className = 'rf-cursor-dot';
  dot.setAttribute('aria-hidden', 'true');
  document.body.append(dot);
  document.documentElement.classList.add('rf-cursor');

  const CLICKABLE = 'a, button, [role="button"], [data-target], label, input, select, textarea, summary, video';
  let x = -1, y = -1;
  // Whenever the dot steps aside, the real pointer comes back, so there is never a moment with no cursor at all.
  const root = document.documentElement;
  const hide = () => { dot.classList.remove('shown', 'over', 'down'); root.classList.remove('rf-cursor'); };
  // An embedded player (YouTube) is a separate page: inside it this page hears no movement, so the dot would freeze
  // at its edge. Over an iframe the dot steps aside and the player's own pointer takes over.
  const inFrame = el => !!el && el.tagName === 'IFRAME';
  // a film full screen, or filling the window, sits on black
  const fsEl = () => document.fullscreenElement || document.webkitFullscreenElement;
  const onDark = () => !!fsEl() || root.classList.contains('film-theatre');
  const update = el => {
    dot.classList.toggle('on-dark', onDark());
    if (inFrame(el)) { hide(); return; }
    root.classList.add('rf-cursor');
    dot.classList.add('shown');
    dot.classList.toggle('over', !!el?.closest?.(CLICKABLE));
  };
  // Belt and braces: if the pointer goes quiet right at a player's edge, assume it went in, even if the browser said nothing.
  let idle;
  const nearFrame = () => [...document.querySelectorAll('iframe')].some(f => {
    const r = f.getBoundingClientRect();
    return r.width && x > r.left - 6 && x < r.right + 6 && y > r.top - 6 && y < r.bottom + 6;
  });
  addEventListener('pointermove', e => {
    x = e.clientX; y = e.clientY;
    dot.style.translate = `${x}px ${y}px`;
    update(e.target);
    clearTimeout(idle);
    idle = setTimeout(() => { if (nearFrame()) hide(); }, 140);
  }, { passive: true });
  addEventListener('pointerover', e => { if (inFrame(e.target)) hide(); }, { passive: true });
  // Into a player: hide. (Not on every pointerout with no target, which also fires when the page swaps content under a
  // still pointer and would flash the system cursor.)
  addEventListener('pointerout', e => { if (inFrame(e.relatedTarget)) hide(); }, { passive: true });
  addEventListener('pointerdown', () => dot.classList.add('down'));
  addEventListener('pointerup', () => dot.classList.remove('down'));
  // The page can move under a still pointer (scrolling, or a project opening at the top), so re-read what's beneath it.
  const recheck = () => { if (x < 0 || !dot.classList.contains('shown')) return; update(document.elementFromPoint(x, y)); };
  addEventListener('scroll', () => requestAnimationFrame(recheck), { passive: true });
  addEventListener('click', () => setTimeout(recheck, 50));
  addEventListener('hashchange', () => setTimeout(recheck, 50));
  // Off the page (the pointer left the window, or focus went into a player or another app), the dot goes too.
  document.documentElement.addEventListener('mouseleave', e => { if (!e.relatedTarget) hide(); });
  addEventListener('blur', hide);
  // In true full screen the browser shows only the full-screen element, so the dot moves inside it, and back after.
  const reparent = () => { (fsEl() || document.body).append(dot); dot.classList.toggle('on-dark', onDark()); };
  document.addEventListener('fullscreenchange', reparent);
  document.addEventListener('webkitfullscreenchange', reparent);
})();
