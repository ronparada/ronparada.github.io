/**
 * HOMELAB MAP DEMO — interactive topology + security scan animation
 */
(function () {
  const NODES = {
    pihole: 'Pi-hole on Raspberry Pi Zero 2 W — network-wide DNS filtering, blocks malicious domains before they resolve.',
    pi4: 'Ubuntu Server on Raspberry Pi 4 — homelab hub: Plex, Jellyfin, Meshtastic bridge, SSH + Tailscale. Sends Wake-on-LAN magic packets to boot the Proxmox EliteDesk when the AD lab is needed.',
    proxmox: 'Proxmox VE on HP EliteDesk Mini (i5-8500T, 16GB RAM, 756GB NVMe) — Type-1 hypervisor running an Active Directory attack lab. VMs: Windows Server 2025 DC, Windows 11 client, Kali Linux, Metasploitable 2, Ubuntu LXC. Wakes via Pi 4 WoL; remote access via Tailscale.',
    wazuh: 'Wazuh SIEM on Mac Mini (Docker/Colima) — threat detection, FIM, vuln scans, OpenSearch dashboard. Pi 4 agent active; Proxmox VM agent integration planned.',
    mesh: '3-node LoRa mesh (T-Beam, Wio Tracker, T-Deck) — Python Discord bridge on Pi 4, 5-channel routing, systemd service.',
    ai: 'Self-hosted AI agent stack — Telegram + Discord bots, local automation, private and under my control.',
  };

  const LINKS = [
    { from: 'pihole', to: 'pi4' },
    { from: 'wazuh', to: 'pi4' },
    { from: 'mesh', to: 'pi4' },
    { from: 'ai', to: 'pi4' },
    { from: 'pi4', to: 'proxmox', directed: true },
    { from: 'proxmox', to: 'wazuh', planned: true },
  ];

  const SCAN_LINES = [
    '[*] Initializing portfolio security scan...',
    '[*] Target: homelab (abstract view — no live endpoints exposed)',
    '',
    '[+] DNS filtering ............... Pi-hole ACTIVE',
    '[+] VPN tunnel ................ Tailscale SECURED',
    '[+] WoL relay ................... Pi 4 → Proxmox READY',
    '[+] SIEM monitoring ........... Wazuh ONLINE',
    '[~] Proxmox agent ............. Wazuh PLANNED',
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

  let activeNode = 'pi4';
  let scanning = false;

  function anchorPoint(rect, stageRect, role) {
    const cx = rect.left + rect.width / 2 - stageRect.left;
    const cy = rect.top + rect.height / 2 - stageRect.top;
    if (role === 'from-bottom') return { x: cx, y: rect.bottom - stageRect.top };
    if (role === 'from-top') return { x: cx, y: rect.top - stageRect.top };
    if (role === 'to-top') return { x: cx, y: rect.top - stageRect.top };
    if (role === 'to-bottom') return { x: cx, y: rect.bottom - stageRect.top };
    return { x: cx, y: cy };
  }

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
      <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M0,0 L10,5 L0,10 Z" fill="var(--green)"/>
      </marker>
    `;
    svg.appendChild(defs);

    LINKS.forEach((link) => {
      const a = grid.querySelector(`[data-node="${link.from}"]`);
      const b = grid.querySelector(`[data-node="${link.to}"]`);
      if (!a || !b) return;

      const ar = a.getBoundingClientRect();
      const br = b.getBoundingClientRect();
      const vertical = Math.abs(ar.top - br.top) > Math.abs(ar.left - br.left);

      let p1;
      let p2;
      if (link.from === 'pi4' && link.to === 'proxmox') {
        p1 = anchorPoint(ar, stageRect, 'from-bottom');
        p2 = anchorPoint(br, stageRect, 'to-top');
      } else if (vertical && br.top > ar.top) {
        p1 = anchorPoint(ar, stageRect, 'from-bottom');
        p2 = anchorPoint(br, stageRect, 'to-top');
      } else if (vertical) {
        p1 = anchorPoint(ar, stageRect, 'from-top');
        p2 = anchorPoint(br, stageRect, 'to-bottom');
      } else {
        p1 = anchorPoint(ar, stageRect, 'from-bottom');
        p2 = anchorPoint(br, stageRect, 'to-top');
      }

      const lit = activeNode === link.from || activeNode === link.to || scanning;
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', p1.x);
      line.setAttribute('y1', p1.y);
      line.setAttribute('x2', p2.x);
      line.setAttribute('y2', p2.y);

      let cls = 'topo-line';
      if (link.planned) cls += ' planned';
      if (lit) cls += ' lit';
      if (scanning) cls += ' scan-pulse';
      line.setAttribute('class', cls);

      if (lit && !link.planned) line.setAttribute('filter', 'url(#line-glow)');
      if (link.directed && !link.planned) line.setAttribute('marker-end', 'url(#arrow)');
      svg.appendChild(line);
    });
  }

  selectNode('pi4');

  grid.addEventListener('click', (e) => {
    const node = e.target.closest('.topo-node');
    if (!node) return;
    selectNode(node.dataset.node);
  });

  window.addEventListener('resize', () => drawLines());
  window.addEventListener('load', () => requestAnimationFrame(drawLines));

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
