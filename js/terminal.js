(function () {
  const historyEl = document.getElementById('terminal-history');
  const form = document.getElementById('terminal-form');
  const input = document.getElementById('terminal-input');
  const toggle = document.getElementById('terminal-toggle');

  const COMMANDS = {
    help: {
      desc: 'List available commands',
      run: () => [
        '<span class="info">Available commands:</span>',
        '  <span class="cmd-hint">help</span>        — this message',
        '  <span class="cmd-hint">about</span>       — scroll to about section',
        '  <span class="cmd-hint">projects</span>    — scroll to projects',
        '  <span class="cmd-hint">lab</span>         — scroll to cyber lab',
        '  <span class="cmd-hint">skills</span>      — scroll to skills & certs',
        '  <span class="cmd-hint">community</span>   — scroll to leadership & involvement',
        '  <span class="cmd-hint">contact</span>     — scroll to contact',
        '  <span class="cmd-hint">demo</span>        — scroll to retro games demo',
        '  <span class="cmd-hint">play</span>        — open retro games in new tab',
        '  <span class="cmd-hint">open &lt;name&gt;</span> — open a project (e.g. open karate)',
        '  <span class="cmd-hint">whoami</span>      — who is Ron?',
        '  <span class="cmd-hint">certs</span>       — list certifications',
        '  <span class="cmd-hint">clear</span>       — clear terminal output',
      ],
    },
    about: { desc: 'Go to about', run: () => scrollTo('about') },
    projects: { desc: 'Go to projects', run: () => scrollTo('projects') },
    lab: { desc: 'Go to cyber lab', run: () => scrollTo('lab') },
    skills: { desc: 'Go to skills', run: () => scrollTo('skills') },
    community: { desc: 'Go to community', run: () => scrollTo('community') },
    contact: { desc: 'Go to contact', run: () => scrollTo('contact') },
    demo: { desc: 'Go to live demo', run: () => scrollTo('demo') },
    play: {
      desc: 'Open retro games',
      run: () => {
        window.open('https://ronparada.github.io/retro-games/', '_blank');
        return ['<span class="success">Launching retro games...</span>'];
      },
    },
    whoami: {
      desc: 'About Ron',
      run: () => [
        'Ronald Parada',
        'MS Cybersecurity @ CSUSB — graduated May 16, 2026 (GPA 4.00)',
        'Graduate Assistant · church · Coyote Karate Academy VP',
        'Security+ · ISC² CC · homelab builder · web dev',
        'San Bernardino, CA — <span class="info">ronparada@protonmail.com</span>',
      ],
    },
    certs: {
      desc: 'List certifications',
      run: () => {
        const { professional, labs } = PORTFOLIO_DATA.certifications;
        return [
          '<span class="info">Professional:</span>',
          ...professional.map((c) => `  <span class="success">✓</span> ${escapeHtml(c.name)} <span class="info">(${escapeHtml(c.detail)})</span>`),
          '<span class="info">Hands-on labs:</span>',
          ...labs.map((c) => `  <span class="success">✓</span> ${escapeHtml(c.name)} <span class="info">(${escapeHtml(c.detail)})</span>`),
        ];
      },
    },
    clear: {
      desc: 'Clear terminal',
      run: () => {
        historyEl.innerHTML = '';
        return [];
      },
    },
  };

  const PROJECT_ALIASES = {
    retro: 'retro-games',
    games: 'retro-games',
    karate: 'coyote-karate',
    coyote: 'coyote-karate',
    church: 'fresca-uncion',
    fresca: 'fresca-uncion',
    capstone: 'capstone',
    wireshark: 'wireshark-dog',
    dog: 'wireshark-dog',
  };

  function scrollTo(id) {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      return [`<span class="success">Navigating to /${id}</span>`];
    }
    return [`<span class="error">Section not found: ${id}</span>`];
  }

  function printLines(lines, className = 'output') {
    lines.forEach((line) => {
      const div = document.createElement('div');
      div.className = `terminal-line ${className}`;
      div.innerHTML = line;
      historyEl.appendChild(div);
    });
    historyEl.scrollTop = historyEl.scrollHeight;
  }

  function printInput(cmd) {
    const div = document.createElement('div');
    div.className = 'terminal-line input-line';
    div.innerHTML = `<span class="prompt">visitor@portfolio:~$</span> <span class="cmd">${escapeHtml(cmd)}</span>`;
    historyEl.appendChild(div);
  }

  function handleOpen(args) {
    if (!args.length) {
      return [
        '<span class="error">Usage: open &lt;project&gt;</span>',
        '  Try: retro, karate, church, capstone, wireshark',
      ];
    }
    const alias = args[0].toLowerCase();
    const id = PROJECT_ALIASES[alias] || alias;
    const project = PORTFOLIO_DATA.projects.find((p) => p.id === id);
    if (!project) {
      return [`<span class="error">Unknown project: ${escapeHtml(args[0])}</span>`];
    }
    if (project.url) {
      window.open(project.url, '_blank');
      return [`<span class="success">Opening ${project.title}...</span>`];
    }
    const card = document.querySelector(`[data-project-id="${project.id}"]`);
    if (card) {
      card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      card.style.borderColor = 'var(--green)';
      setTimeout(() => { card.style.borderColor = ''; }, 2000);
    }
    return [
      `<span class="info">${project.title}</span>`,
      project.description,
      project.url ? '' : '<span class="info">(academic project — no live URL)</span>',
    ].filter(Boolean);
  }

  function execute(raw) {
    const trimmed = raw.trim();
    if (!trimmed) return;

    printInput(trimmed);

    const parts = trimmed.split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    if (cmd === 'open') {
      printLines(handleOpen(args));
      return;
    }

    const handler = COMMANDS[cmd];
    if (!handler) {
      printLines([
        `<span class="error">Command not found: ${escapeHtml(cmd)}</span>`,
        'Type <span class="cmd-hint">help</span> for available commands.',
      ]);
      return;
    }

    const result = handler.run(args);
    if (result && result.length) printLines(result);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    execute(input.value);
    input.value = '';
  });

  toggle.addEventListener('click', () => {
    document.body.classList.toggle('terminal-collapsed');
    toggle.textContent = document.body.classList.contains('terminal-collapsed') ? '□' : '_';
  });

  window.terminalExecute = execute;
})();
