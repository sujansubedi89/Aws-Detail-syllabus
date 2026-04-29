/* ============================================
   CLOUD + DEVOPS BOOTCAMP — script.js
============================================ */

'use strict';

/* ─── CURSOR ─── */
const cursor      = document.getElementById('cursor');
const cursorTrail = document.getElementById('cursorTrail');

let mx = -100, my = -100;
let tx = -100, ty = -100;

document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top  = my + 'px';
});

(function animTrail() {
  tx += (mx - tx) * 0.12;
  ty += (my - ty) * 0.12;
  cursorTrail.style.left = tx + 'px';
  cursorTrail.style.top  = ty + 'px';
  requestAnimationFrame(animTrail);
})();

document.addEventListener('mouseleave', () => {
  cursor.style.opacity = '0';
  cursorTrail.style.opacity = '0';
});
document.addEventListener('mouseenter', () => {
  cursor.style.opacity = '1';
  cursorTrail.style.opacity = '1';
});

/* ─── NAV SCROLL ─── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ─── MOBILE NAV ─── */
const navToggle = document.getElementById('navToggle');
const navMobile = document.getElementById('navMobile');

navToggle.addEventListener('click', () => {
  navMobile.classList.toggle('open');
  const spans = navToggle.querySelectorAll('span');
  if (navMobile.classList.contains('open')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});

navMobile.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navMobile.classList.remove('open');
    navToggle.querySelectorAll('span').forEach(s => {
      s.style.transform = ''; s.style.opacity = '';
    });
  });
});

/* ─── SCROLL REVEAL ─── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ─── COUNTER ANIMATION ─── */
function animateCounter(el, target, duration = 1400) {
  let start = null;
  const step = ts => {
    if (!start) start = ts;
    const progress = Math.min((ts - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(ease * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
}

const statsObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const numbers = entry.target.querySelectorAll('.stat-number');
      numbers.forEach(n => {
        const target = parseInt(n.getAttribute('data-target'), 10);
        animateCounter(n, target);
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });

const statsGrid = document.querySelector('.stats-grid');
if (statsGrid) statsObserver.observe(statsGrid);

/* ─── TERMINAL TYPEWRITER ─── */
const terminalEl = document.getElementById('terminal');
if (terminalEl) {
  const lines = [
    { type: 'prompt', text: '$ ./start-bootcamp.sh --day 1' },
    { type: 'out',    text: '  Initializing Cloud + DevOps environment...' },
    { type: 'out',    text: '  ✓ AWS credentials configured' },
    { type: 'out',    text: '  ✓ IAM roles provisioned' },
    { type: 'out',    text: '  ✓ VPC stack deployed successfully' },
    { type: 'success',text: '  ✓ EC2 instance running at 54.x.x.x:80' },
    { type: 'prompt', text: '$ git push origin main && gh run watch' },
    { type: 'warn',   text: '  ⚡ Pipeline triggered: build → test → deploy' },
    { type: 'success',text: '  ✓ Deployment complete. All checks passed.' },
  ];

  let lineIndex = 0;
  let charIndex = 0;
  let cursorSpan = null;

  function typeNextChar() {
    if (lineIndex >= lines.length) {
      // Done — keep blinking cursor
      return;
    }

    const line = lines[lineIndex];
    const fullText = line.text;

    if (charIndex === 0) {
      // Start new line span
      const span = document.createElement('span');
      span.className = `t-line t-${line.type}`;
      span.id = `t-line-${lineIndex}`;
      terminalEl.appendChild(span);

      if (cursorSpan) cursorSpan.remove();
      cursorSpan = document.createElement('span');
      cursorSpan.className = 't-cursor';
      span.appendChild(cursorSpan);
    }

    const currentSpan = document.getElementById(`t-line-${lineIndex}`);
    if (currentSpan) {
      // Insert text before cursor
      cursorSpan.remove();
      currentSpan.textContent = fullText.slice(0, charIndex + 1);
      currentSpan.appendChild(cursorSpan);
    }

    charIndex++;

    if (charIndex >= fullText.length) {
      // Line done
      const br = document.createElement('br');
      currentSpan.after(br);
      charIndex = 0;
      lineIndex++;

      const delay = line.type === 'prompt' ? 500 : 180;
      setTimeout(typeNextChar, delay);
    } else {
      const isPrompt = line.type === 'prompt';
      const delay = isPrompt
        ? 40 + Math.random() * 40
        : 18 + Math.random() * 12;
      setTimeout(typeNextChar, delay);
    }
  }

  // Start after hero badge animation
  const terminalObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      setTimeout(typeNextChar, 1000);
      terminalObserver.disconnect();
    }
  }, { threshold: 0.3 });
  terminalObserver.observe(terminalEl);
}

/* ─── DAY ACCORDION ─── */
document.querySelectorAll('.day-header').forEach(header => {
  header.addEventListener('click', () => {
    const block = header.closest('.day-block');
    const isOpen = block.classList.contains('open');

    // Close all
    document.querySelectorAll('.day-block.open').forEach(b => b.classList.remove('open'));

    // Toggle clicked
    if (!isOpen) block.classList.add('open');
  });
});

// Open first day by default
const firstDay = document.querySelector('.day-block');
if (firstDay) firstDay.classList.add('open');

/* ─── FAQ ACCORDION ─── */
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');

    document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

/* ─── ENROLL FORM ─── */
const enrollForm = document.getElementById('enrollForm');
const toast      = document.getElementById('toast');

if (enrollForm) {
  enrollForm.addEventListener('submit', e => {
    e.preventDefault();

    const btn = enrollForm.querySelector('button[type="submit"]');
    btn.textContent = 'Enrolling...';
    btn.disabled = true;

    setTimeout(() => {
      // Reset form
      enrollForm.reset();
      btn.innerHTML = `Reserve Your Seat <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`;
      btn.disabled = false;

      // Show toast
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 4000);
    }, 1200);
  });
}

/* ─── SKILLS CHIP HOVER RIPPLE ─── */
document.querySelectorAll('.skill-chip').forEach(chip => {
  chip.addEventListener('mouseenter', () => {
    chip.style.transitionDelay = '0s';
  });
});

/* ─── SMOOTH ACTIVE NAV LINK ─── */
const sections = document.querySelectorAll('section[id], header[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => {
        a.style.color = '';
        if (a.getAttribute('href') === '#' + entry.target.id) {
          a.style.color = 'var(--amber)';
        }
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

/* ─── PARALLAX ORBS (subtle) ─── */
let lastScrollY = 0;
const orb1 = document.querySelector('.orb-1');
const orb2 = document.querySelector('.orb-2');

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (orb1) orb1.style.transform = `translateY(${y * 0.08}px)`;
  if (orb2) orb2.style.transform = `translateY(${-y * 0.05}px)`;
  lastScrollY = y;
}, { passive: true });

/* ─── LIFECYCLE RING HOVER PAUSE ─── */
const ring = document.querySelector('.lifecycle-ring');
if (ring) {
  ring.addEventListener('mouseenter', () => {
    ring.style.setProperty('--pause', 'paused');
  });
  ring.addEventListener('mouseleave', () => {
    ring.style.setProperty('--pause', 'running');
  });
}
