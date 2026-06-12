/**
 * HOMELAB MAP DEMO — interactive topology + security scan animation
 * Replaces retro games iframe (cross-origin embed blocked on custom domain)
 */
(function () {
  const NODES = {
    pihole: 'Pi-hole on Raspberry Pi Zero 2 W — network-wide DNS filtering, blocks malicious domains before they resolve.',
    pi4: 'Ubuntu Server on Raspberry Pi 4 — Plex, Jellyfin, Meshtastic Discord bridge, SSH + Tailscale remote admin.',
    wazuh: 'Wazuh SIEM on Mac Mini (Docker/Colima) — threat detection, FIM, vuln scans, OpenSearch dashboard.',
    mesh: '3-node LoRa mesh (T-Beam, Wio Tracker, T-Deck) — Python Discord bridge, 5-channel routing, systemd service.',
    ai: 'Self-hosted AI agent stack — Telegram + Discord bots, local automation, private and under my control.',
  };

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

  const grid = document.getElementById('topology-grid');
  const detail = document.getElementById('topo-detail-text');
  const scanBtn = document.getElementById('run-scan');
  const scanOutput = document.getElementById('scan-output');

  if (!grid || !detail) return;

  const defaultNode = grid.querySelector('[data-node="wazuh"]');
  if (defaultNode) {
    defaultNode.classList.add('active');
    detail.textContent = NODES.wazuh;
    detail.closest('.topo-detail')?.classList.add('active');
  }

  grid.addEventListener('click', (e) => {
    const node = e.target.closest('.topo-node');
    if (!node) return;

    grid.querySelectorAll('.topo-node').forEach((n) => n.classList.remove('active'));
    node.classList.add('active');
    detail.textContent = NODES[node.dataset.node] || 'Unknown node.';
    detail.closest('.topo-detail')?.classList.add('active');
  });

  if (scanBtn && scanOutput) {
    scanBtn.addEventListener('click', runScan);
  }

  function runScan() {
    scanOutput.textContent = '';
    scanBtn.disabled = true;
    scanBtn.textContent = 'scanning...';

    let lineIndex = 0;
    let charIndex = 0;
    let current = '';

    function tick() {
      if (lineIndex >= SCAN_LINES.length) {
        scanBtn.disabled = false;
        scanBtn.textContent = 'run_security_scan()';
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
        setTimeout(tick, line === '' ? 80 : 120);
      }
    }

    tick();
  }
})();
