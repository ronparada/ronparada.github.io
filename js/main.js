(function () {
  const { projects, labProjects, skills, certifications, education, bootSequence } = PORTFOLIO_DATA;

  // ── Boot sequence typing ──
  function runBootSequence() {
    const output = document.getElementById('boot-output');
    let lineIndex = 0;
    let charIndex = 0;
    let currentText = '';

    function typeNext() {
      if (lineIndex >= bootSequence.length) return;

      const line = bootSequence[lineIndex];
      if (charIndex < line.length) {
        currentText += line[charIndex];
        charIndex++;
        output.textContent = currentText + (lineIndex < bootSequence.length - 1 ? '\n' : '');
        setTimeout(typeNext, 18 + Math.random() * 30);
      } else {
        currentText += '\n';
        lineIndex++;
        charIndex = 0;
        output.textContent = currentText;
        setTimeout(typeNext, line === '' ? 100 : 200);
      }
    }

    setTimeout(typeNext, 400);
  }

  // ── Hero typing effects ──
  function typeText(el, text, speed = 50, callback) {
    let i = 0;
    function tick() {
      if (i < text.length) {
        el.textContent += text[i];
        i++;
        setTimeout(tick, speed);
      } else if (callback) {
        callback();
      }
    }
    tick();
  }

  function initHeroTyping() {
    const nameEl = document.getElementById('typed-name');
    const subEl = document.getElementById('typed-subtitle');
    const name = 'Ronald A. Parada';
    const subtitle = '// cybersecurity grad · graduate assistant · web dev · homelab builder';

    setTimeout(() => {
      typeText(nameEl, name, 60, () => {
        setTimeout(() => typeText(subEl, subtitle, 28), 300);
      });
    }, 2800);
  }

  // ── Render projects ──
  function renderProjects() {
    const grid = document.getElementById('project-grid');
    grid.innerHTML = projects
      .map(
        (p) => `
        <article class="project-card ${p.featured ? 'featured' : ''}" data-project-id="${p.id}">
          <div class="project-meta">
            <span class="project-category">${p.category}</span>
            ${p.live ? '<span class="project-live">LIVE</span>' : ''}
          </div>
          <h3>${p.title}</h3>
          <p>${p.description}</p>
          <div class="project-tech">
            ${p.tech.map((t) => `<span class="tech-tag">${t}</span>`).join('')}
          </div>
          ${
            p.url
              ? `<a href="${p.url}" target="_blank" rel="noopener" class="project-link">visit_site() →</a>`
              : `<span class="project-link" style="color: var(--text-dim)">academic_project — no live URL</span>`
          }
        </article>`
      )
      .join('');
  }

  // ── Render lab ──
  function renderLab() {
    const grid = document.getElementById('lab-grid');
    grid.innerHTML = labProjects
      .map(
        (p) => `
        <article class="lab-card ${p.sideProject ? 'side-project' : ''}" data-lab-id="${p.id}">
          <div class="lab-icon">${p.icon}</div>
          <h3>${p.title}${p.sideProject ? ' <span class="side-badge">side project</span>' : ''}</h3>
          <p>${p.description}</p>
          <div class="lab-tags">
            ${p.tags.map((t) => `<span class="lab-tag">${t}</span>`).join('')}
          </div>
        </article>`
      )
      .join('');
  }

  // ── Render skills ──
  function renderSkills() {
    document.getElementById('skill-tags').innerHTML = skills
      .map((s) => `<span class="skill-tag">${s}</span>`)
      .join('');

    document.getElementById('cert-list').innerHTML = certifications
      .map(
        (c) => `
        <li>
          <strong>${c.name}</strong>
          <span>Expires ${c.expires}</span>
        </li>`
      )
      .join('');

    document.getElementById('edu-list').innerHTML = education
      .map(
        (e) => `
        <div class="edu-item">
          <strong>${e.degree}</strong>
          <span>${e.school} · ${e.period}</span>
          <span>${e.note}</span>
        </div>`
      )
      .join('');
  }

  // ── Scroll reveal animations ──
  function initScrollReveal() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    document.querySelectorAll('.project-card, .lab-card').forEach((el, i) => {
      el.style.opacity = '0';
      el.style.animationDelay = `${i * 0.08}s`;
      observer.observe(el);
    });
  }

  // ── Nav scroll + active state ──
  function initNavigation() {
    const navButtons = document.querySelectorAll('[data-section]');
    const sections = [...navButtons]
      .map((btn) => document.getElementById(btn.dataset.section))
      .filter(Boolean);

    navButtons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const id = btn.dataset.section;
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        if (window.terminalExecute) {
          window.terminalExecute(id);
        }
      });
    });

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            navButtons.forEach((btn) => {
              btn.classList.toggle('active', btn.dataset.section === entry.target.id);
            });
          }
        });
      },
      { threshold: 0.3 }
    );

    sections.forEach((s) => sectionObserver.observe(s));
  }

  // ── Copy contact for Discord ──
  function initDiscordHint() {
    const btn = document.getElementById('copy-discord-hint');
    if (!btn) return;
    btn.addEventListener('click', async () => {
      const text = 'ronparada@protonmail.com — interested in joining the Meshtastic mesh!';
      try {
        await navigator.clipboard.writeText(text);
        btn.textContent = 'copied!';
        setTimeout(() => { btn.textContent = 'copy_contact_for_discord'; }, 2000);
      } catch {
        btn.textContent = 'copy failed — use email instead';
      }
    });
  }

  // ── Contact form feedback ──
  function initContactForm() {
    const form = document.getElementById('contact-form');
    form.addEventListener('submit', () => {
      const btn = form.querySelector('button');
      btn.textContent = 'transmitting...';
    });
  }

  // ── Init ──
  document.addEventListener('DOMContentLoaded', () => {
    runBootSequence();
    initHeroTyping();
    renderProjects();
    renderLab();
    renderSkills();
    initScrollReveal();
    initNavigation();
    initDiscordHint();
    initContactForm();
  });
})();
