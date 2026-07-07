/**
 * HOMELAB MAP DEMO — interactive topology + security scan animation
 */
(function () {
  const NODES = {
    pihole: 'Pi-hole on Raspberry Pi Zero 2 W — network-wide DNS filtering, blocks malicious domains before they resolve.',
    pi4: 'Ubuntu Server on Raspberry Pi 4 — central hub: Plex, Jellyfin, Meshtastic Discord bridge, SSH + Tailscale remote admin.',
    wazuh: 'Wazuh SIEM on Mac Mini (Docker/Colima) — threat detection, FIM, vuln scans, OpenSearch dashboard. Agents report through the Pi 4 hub.',
    mesh: '3-node LoRa mesh (T-Beam, Wio Tracker, T-Deck) — Python Discord bridge on Pi 4, 5-channel routing, systemd service.',
    ai: 'Self-hosted AI agent stack — Telegram + Discord bots, local automation, private and under my control.',
  };

  const EDGES = [
    ['pihole', 'pi4'],
    ['wazuh', 'pi4'],
    ['mesh', 'pi4'],
    ['ai', 'pi4'],
  ];

  const SCAN_LINES = [
    '[*] Initializing portfolio security scan...',
    '[*] Target: homelab (abstract view — no live endpoints exposed)',
    '',
    '[+] DNS filtering ............... Pi-hole ACTIVE',
    '[+] VPN tunnel ................ Tailscale SECURED',
    '[+] SIEM monitoring ........... Wazuh ONLINE',
    '[+] HTTPS certificate ......... VALID (ronparada.com)',
    '[+] Contact form .............. Formspree ENCRYPTED',
    '[+] CSP headers ............... ENABLED',
    '[+] XSS protection ............ escapeHtml() ACTIVE',
    '',
    '[*] Scan complete — 0 public vulnerabilities found.',
    '[*] Private infrastructure not exposed. All clear.',
  ];

  const stage = document.getElementById('topology-stage');
  const svg = document.getElementById('topology-lines');
  const grid = document.getElementById('topology-grid');
  const detail = document.getElementById('topo-detail-text');
  const scanBtn = document.getElementById('run-scan');
  const scanOutput = document.getElementById('scan-output');

  if (!stage || !svg || !grid || !detail) return;

  let activeNode = 'wazuh';
  let scanning = false;

  function selectNode(nodeId) {
    activeNode = nodeId;
    grid.querySelectorAll('.topo-node').forEach((n) => {
      n.classList.toggle('active', n.dataset.node === nodeId);
    });
    detail.textContent = NODES[nodeId] || 'Unknown node.';
    detail.closest('.topo-detail')?.classList.add('active');
    drawLines();
  }

  function drawLines() {
    const stageRect = stage.getBoundingClientRect();
    svg.setAttribute('viewBox', `0 0 ${stageRect.width} ${stageRect.height}`);
    svg.innerHTML = '';

    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    defs.innerHTML = `
      <filter id="line-glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="2" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    `;
    svg.appendChild(defs);

    EDGES.forEach(([from, to]) => {
      const a = grid.querySelector(`[data-node="${from}"]`);
      const b = grid.querySelector(`[data-node="${to}"]`);
      if (!a || !b) return;

      const ar = a.getBoundingClientRect();
      const br = b.getBoundingClientRect();
      const x1 = ar.left + ar.width / 2 - stageRect.left;
      const y1 = ar.top + ar.height / 2 - stageRect.top;
      const x2 = br.left + br.width / 2 - stageRect.left;
      const y2 = br.top + br.height / 2 - stageRect.top;

      const lit = activeNode === from || activeNode === to || scanning;
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', x1);
      line.setAttribute('y1', y1);
      line.setAttribute('x2', x2);
      line.setAttribute('y2', y2);
      line.setAttribute('class', `topo-line${lit ? ' lit' : ''}${scanning ? ' scan-pulse' : ''}`);
      if (lit) line.setAttribute('filter', 'url(#line-glow)');
      svg.appendChild(line);
    });
  }

  selectNode('wazuh');

  grid.addEventListener('click', (e) => {
    const node = e.target.closest('.topo-node');
    if (!node) return;
    selectNode(node.dataset.node);
  });

  window.addEventListener('resize', () => drawLines());

  if (scanBtn && scanOutput) {
    scanBtn.addEventListener('click', runScan);
  }

  function runScan() {
    scanOutput.textContent = '';
    scanBtn.disabled = true;
    scanBtn.textContent = 'scanning...';
    scanning = true;
    stage.classList.add('scanning');
    drawLines();

    let lineIndex = 0;
    let charIndex = 0;
    let current = '';

    function tick() {
      if (lineIndex >= SCAN_LINES.length) {
        scanBtn.disabled = false;
        scanBtn.textContent = 'run_security_scan()';
        scanning = false;
        stage.classList.remove('scanning');
        drawLines();
        return;
      }

      const line = SCAN_LINES[lineIndex];
      if (charIndex < line.length) {
        current += line[charIndex];
        charIndex++;
        scanOutput.textContent = current;
        setTimeout(tick, 12 + Math.random() * 18);
      } else {
        current += '\n';
        lineIndex++;
        charIndex = 0;
        scanOutput.textContent = current;
        if (lineIndex % 2 === 0) drawLines();
        setTimeout(tick, line === '' ? 80 : 120);
      }
    }

    tick();
  }
})();
