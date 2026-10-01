// Tabs for works
const tabs = document.querySelectorAll('.works-tab');
const panels = document.querySelectorAll('.slider-panel');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    panels.forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('panel-' + tab.dataset.tab).classList.add('active');
  });
});

// Simple slider
const positions = {};
document.querySelectorAll('.slider-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const trackId = btn.dataset.track;
    const dir = parseInt(btn.dataset.dir);
    const track = document.getElementById(trackId);
    if (!positions[trackId]) positions[trackId] = 0;

    const slideWidth = track.querySelector('.slide').offsetWidth + 20;
    const maxScroll = track.scrollWidth - track.parentElement.offsetWidth;

    positions[trackId] = Math.max(0, Math.min(positions[trackId] + dir * slideWidth, maxScroll));
    track.style.transform = `translateX(-${positions[trackId]}px)`;
  });
});

// Optional: drag support for sliders
document.querySelectorAll('.slider-track').forEach(track => {
  let isDown = false;
  let startX;
  let scrollLeft;

  track.addEventListener('mousedown', (e) => {
    isDown = true;
    startX = e.pageX;
    scrollLeft = positions[track.id] || 0;
    track.style.cursor = 'grabbing';
  });

  track.addEventListener('mouseleave', () => {
    isDown = false;
    track.style.cursor = 'grab';
  });

  track.addEventListener('mouseup', () => {
    isDown = false;
    track.style.cursor = 'grab';
  });

  track.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX;
    const walk = (startX - x);
    const maxScroll = track.scrollWidth - track.parentElement.offsetWidth;
    positions[track.id] = Math.max(0, Math.min(scrollLeft + walk, maxScroll));
    track.style.transform = `translateX(-${positions[track.id]}px)`;
  });
});

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.header a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const top = section.offsetTop - 150;
    if (scrollY >= top) current = section.getAttribute('id');
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
});

// Neon cursor trail
const trailCount = 12;
const trails = [];

for (let i = 0; i < trailCount; i++) {
  const dot = document.createElement('div');
  dot.className = 'cursor-trail';
  dot.style.opacity = (1 - i / trailCount) * 0.75;
  dot.style.width = `${12 - i * 0.6}px`;
  dot.style.height = `${12 - i * 0.6}px`;
  document.body.appendChild(dot);
  trails.push({ el: dot, x: 0, y: 0 });
}

let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

// Hover detection
const interactive = 'a, button, summary, .works-tab, .slider-btn, .contact-card, .tool-logo';

document.addEventListener('mouseover', (e) => {
  if (e.target.closest(interactive)) {
    document.body.classList.add('is-hovering');
  }
});

document.addEventListener('mouseout', (e) => {
  if (e.target.closest(interactive)) {
    document.body.classList.remove('is-hovering');
  }
});

// Click state
document.addEventListener('mousedown', () => {
  document.body.classList.add('is-clicking');
});

document.addEventListener('mouseup', () => {
  document.body.classList.remove('is-clicking');
});

function animateTrail() {
  let x = mouseX;
  let y = mouseY;

  trails.forEach((trail) => {
    trail.x += (x - trail.x) * 0.25;
    trail.y += (y - trail.y) * 0.25;
    trail.el.style.left = trail.x + 'px';
    trail.el.style.top = trail.y + 'px';
    x = trail.x;
    y = trail.y;
  });

  requestAnimationFrame(animateTrail);
}

animateTrail();

// Copy email
const copyEmailBtn = document.getElementById('copy-email');
const copyToast = document.getElementById('copy-toast');

if (copyEmailBtn) {
  copyEmailBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const email = copyEmailBtn.dataset.email || 'hello@example.com';

    navigator.clipboard.writeText(email).then(() => {
      copyToast.classList.add('show');
      setTimeout(() => copyToast.classList.remove('show'), 2000);
    }).catch(() => {
      // fallback
      const ta = document.createElement('textarea');
      ta.value = email;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      copyToast.classList.add('show');
      setTimeout(() => copyToast.classList.remove('show'), 2000);
    });
  });
}