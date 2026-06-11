(function () {
  const { projects, labProjects, skills, certifications, education, bootSequence } = PORTFOLIO_DATA;

  function esc(str) {
    return typeof escapeHtml === 'function' ? escapeHtml(str) : str;
  }

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
    const name = 'Ronald Parada';
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
        <article class="project-card ${p.featured ? 'featured' : ''}" data-project-id="${esc(p.id)}">
          <div class="project-meta">
            <span class="project-category">${esc(p.category)}</span>
            ${p.live ? '<span class="project-live">LIVE</span>' : ''}
          </div>
          <h3>${esc(p.title)}</h3>
          <p>${esc(p.description)}</p>
          <div class="project-tech">
            ${p.tech.map((t) => `<span class="tech-tag">${esc(t)}</span>`).join('')}
          </div>
          ${
            p.url
              ? `<a href="${esc(p.url)}" target="_blank" rel="noopener noreferrer" class="project-link">visit_site() →</a>`
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
        <article class="lab-card ${p.sideProject ? 'side-project' : ''}" data-lab-id="${esc(p.id)}">
          <div class="lab-icon">${p.icon}</div>
          <h3>${esc(p.title)}${p.sideProject ? ' <span class="side-badge">side project</span>' : ''}</h3>
          <p>${esc(p.description)}</p>
          <div class="lab-tags">
            ${p.tags.map((t) => `<span class="lab-tag">${esc(t)}</span>`).join('')}
          </div>
        </article>`
      )
      .join('');
  }

  // ── Render skills ──
  function renderSkills() {
    document.getElementById('skill-tags').innerHTML = skills
      .map((s) => `<span class="skill-tag">${esc(s)}</span>`)
      .join('');

    const certHtml = (list) =>
      list
        .map(
          (c) => `
        <li>
          <strong>${esc(c.name)}</strong>
          <span>${esc(c.detail)}</span>
        </li>`
        )
        .join('');

    document.getElementById('cert-professional').innerHTML = certHtml(certifications.professional);
    document.getElementById('cert-labs').innerHTML = certHtml(certifications.labs);

    document.getElementById('edu-list').innerHTML = education
      .map(
        (e) => `
        <div class="edu-item">
          <strong>${esc(e.degree)}</strong>
          <span>${esc(e.school)} · ${esc(e.period)}</span>
          <span>${esc(e.note)}</span>
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
  });
})();
