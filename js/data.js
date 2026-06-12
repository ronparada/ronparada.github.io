/**
 * PORTFOLIO DATA — main content lives here
 *
 * projects[]     → Live sites & academic work (Projects section)
 * labProjects[]  → Homelab cards (Cyber Lab section)
 * skills[]       → Skill tags
 * certifications → professional + labs (Skills section)
 * education[]    → Degree history
 * bootSequence[] → Hero terminal boot text
 *
 * To add a project: copy an existing entry and change id, title, description, tags/url
 */
const PORTFOLIO_DATA = {
  projects: [
    {
      id: 'retro-games',
      title: 'Retro Games Arcade',
      category: 'web',
      description: 'Browser-based retro game collection built and hosted on GitHub Pages. A fun side project — playable demos with a nostalgic feel.',
      tech: ['HTML', 'CSS', 'JavaScript', 'GitHub Pages'],
      url: 'https://ronparada.github.io/retro-games/',
      live: true,
      featured: true,
    },
    {
      id: 'coyote-karate',
      title: 'Coyote Karate Academy',
      category: 'web',
      description: 'Website for CSUSB\'s Coyote Karate Academy — schedules, info, and the dojo\'s online presence. Built as CKA VP.',
      tech: ['Web Dev', 'HTML', 'CSS'],
      url: 'https://coyotekarateacademy.com/',
      live: true,
      featured: true,
    },
    {
      id: 'fresca-uncion',
      title: 'Iglesia Fresca Unción',
      category: 'web',
      description: 'Church website I built and maintain — sound and web when something needs fixing at Fresca Unción.',
      tech: ['Web Dev', 'HTML', 'CSS'],
      url: 'http://igleciafrescauncion.com/',
      live: true,
      featured: true,
    },
    {
      id: 'capstone',
      title: 'Enterprise Network Capstone',
      category: 'academic',
      description: 'Built an enterprise network from scratch: Active Directory, SQL, email, and web servers, firewall hardening, CSET analysis, and penetration test prep.',
      tech: ['Windows Server', 'Linux', 'Kali', 'AD', 'SQL', 'Snort', 'Python'],
      url: null,
      live: false,
      featured: true,
    },
    {
      id: 'wireshark-dog',
      title: 'Robotic Dog Traffic Analysis',
      category: 'academic',
      description: 'Dissected packet captures from a robotic dog in Wireshark — mapped devices, IP/MAC addresses, and traffic patterns, extracted HTTP streams, and documented security concerns in its communications.',
      tech: ['Wireshark', 'PCAP', 'Network Analysis'],
      url: null,
      live: false,
      featured: true,
    },
    {
      id: 'student-web',
      title: 'Product Website (Team Project)',
      category: 'academic',
      description: 'Collaborative product website built from raw code at San Bernardino Valley College.',
      tech: ['HTML', 'Visual Studio', 'GitHub'],
      url: null,
      live: false,
      featured: false,
    },
  ],

  labProjects: [
    {
      id: 'home-security-lab',
      title: 'Home Security Lab',
      icon: '🏠',
      description: 'Multi-device defensive lab: Pi-hole DNS filtering on a Raspberry Pi Zero 2 W blocking malicious domains network-wide, plus Ubuntu Server on a Raspberry Pi 4 with SSH, Tailscale VPN, and KVM Connect for secure remote administration and self-hosted services.',
      tags: ['Raspberry Pi', 'Pi-hole', 'Tailscale', 'Ubuntu Server', 'SSH', 'KVM Connect'],
    },
    {
      id: 'wazuh-siem',
      title: 'Wazuh SIEM — Mac Mini Home Lab',
      icon: '🛡️',
      description: 'Self-hosted Wazuh 4.11 stack running in Docker (Colima) on an Apple Silicon Mac Mini, acting as a centralized SIEM for the home lab. Collects and correlates alerts from agents on the Raspberry Pi 4, monitors file integrity, runs vulnerability scans, and surfaces security events through the OpenSearch-backed dashboard — all on local hardware, no cloud dependency.',
      tags: ['Wazuh', 'SIEM', 'Docker', 'OpenSearch', 'Threat Detection', 'File Integrity Monitoring', 'Vulnerability Scanning', 'Apple Silicon'],
    },
    {
      id: 'media-server',
      title: 'Self-Hosted Media Server',
      icon: '🎬',
      description: 'Plex and Jellyfin running 24/7 on a Raspberry Pi 4 with external HDD storage. Accessible locally and remotely via Tailscale.',
      tags: ['Plex', 'Jellyfin', 'Raspberry Pi', 'Self-Hosted', 'Tailscale'],
    },
    {
      id: 'meshtastic',
      title: 'Meshtastic Network + Discord Bridge',
      github: 'https://github.com/ronparada/meshtastic-discord-bridge',
      icon: '📡',
      description: 'Built a Python Discord bot that bridges a 3-node off-grid LoRa mesh (T-Beam ROUTER_CLIENT, Wio Tracker, T-Deck) to Discord in real time. Connects via TCP to the T-Beam\'s WiFi API, routes packets to 5 dedicated Discord channels by mesh channel index, distinguishes DMs from broadcast traffic, and auto-reconnects on link loss — running as a systemd service on the Pi 4.',
      tags: ['Meshtastic', 'LoRa', 'Python', 'Discord.py', 'T-Beam', 'Wio Tracker', 'T-Deck', 'TCP/IP', 'systemd'],
    },
    {
      id: 'ai-automation',
      title: 'Self-Hosted AI Automation Server',
      icon: '🤖',
      description: 'An always-on AI agent stack running on local hardware, with Telegram and Discord bot integrations that automate notifications and task execution across both platforms — private, local, and under my control.',
      tags: ['AI Agents', 'Telegram', 'Discord', 'Self-Hosted'],
    },
    {
      id: 'bad-beatles',
      title: '"Bad Beatles" — BadUSB Implants',
      icon: '💾',
      description: 'Custom-programmed ATMEGA32U4 USB keystroke-injection devices for authorized red-team demonstrations. Two dedicated implants: one performs silent host reconnaissance (dumps system info, network config, and saved WiFi credentials to a file), the other establishes a reverse shell back to a Kali listener over Tailscale — working across any network without port forwarding. Demonstrates how a physical-access attack compromises a machine in seconds and why USB security policies matter.',
      tags: ['BadUSB', 'Red Team Demo', 'ATMEGA32U4', 'Reverse Shell', 'Tailscale', 'Kali Linux', 'Physical Security'],
    },
    {
      id: 'rf-research',
      title: 'RF & Wireless Security Research',
      icon: '📻',
      description: 'Tested Wi-Fi, Bluetooth, and sub-GHz radio attack surfaces with dedicated wireless security hardware in a controlled lab. Deployed Rayhunter on a mobile hotspot to detect IMSI-catcher (fake cell tower) activity.',
      tags: ['Wi-Fi', 'Bluetooth', 'Sub-GHz', 'Rayhunter', 'RF Security'],
    },
    {
      id: 'live-usb-toolkit',
      title: 'Live USB Security Toolkit',
      icon: '🔧',
      description: 'Portable Kali Linux, Medicat, and diagnostic utilities for system recovery, troubleshooting, and field response scenarios.',
      tags: ['Kali Linux', 'Medicat', 'Incident Response'],
    },
    {
      id: 'defcon-badge',
      title: 'DEF CON 32 Badge — Embedded Systems & Firmware',
      icon: '🎮',
      description: 'Diagnosed and resolved SD card filesystem compatibility issues (FAT32 cluster size) on a Raspberry Pi RP2350-powered DEF CON 32 badge. Flashed custom firmware via the badge bootloader, upgrading from stock to v1.6 — fixing SD read failures and unlocking IR features. Loaded 16 homebrew Game Boy ROMs onto a 32GB card; badge runs bare-metal Game Boy Color emulation (uGB by DmitryGR) on one of the first public RP2350 releases, distributed at DEF CON 32 before Raspberry Pi sold it commercially.',
      tags: ['RP2350', 'Embedded Firmware', 'FAT32', 'Bootloader', 'Game Boy Emulation', 'Hardware Hacking'],
    },
  ],

  skills: [
    'Ethical Hacking', 'Network Security', 'Wireshark', 'Penetration Testing',
    'Active Directory', 'Firewall Hardening', 'Incident Response', 'Threat Analysis',
    'Digital Forensics', 'Autopsy', 'NIST 800-53', 'FISMA',
    'Zero Trust Architecture', 'RBAC', 'Python', 'HTML/CSS/JS', 'Web Development',
    'Linux', 'Windows Server', 'Kali Linux', 'SQL', 'Snort', 'CSET',
    'Network Monitoring', 'DNS Filtering', 'VPN/Tailscale', 'SSH', 'Troubleshooting',
    'Wazuh', 'SIEM', 'Docker', 'OpenSearch', 'Proxmox', 'Ollama',
    'BadUSB', 'systemd', 'Discord.py', 'Embedded Firmware', 'Plex', 'Jellyfin', 'Meshtastic',
    'Spanish (Fluent)',
  ],

  certifications: {
    professional: [
      { name: 'CompTIA Security+ ce', detail: 'Expires Jul 2028' },
      { name: 'Certified in Cybersecurity (CC)', detail: 'ISC² · Expires Jan 2027' },
    ],
    labs: [
      { name: 'TestOut Linux Pro', detail: 'TestOut · Aug 2025' },
      { name: 'TestOut Routing and Switching Pro', detail: 'TestOut · Aug 2025' },
    ],
  },

  education: [
    {
      degree: 'MS, Information Systems & Technology — Cybersecurity',
      school: 'California State University, San Bernardino',
      period: '05/2024 – 05/2026',
      note: 'GPA 4.00 · Graduated May 16, 2026',
    },
    {
      degree: 'BS, Information Systems & Technology — Cybersecurity',
      school: 'California State University, San Bernardino',
      period: '01/2022 – 05/2024',
      note: 'GPA 3.95 · Summa Cum Laude · Dean\'s List',
    },
    {
      degree: 'AS, Computer Science',
      school: 'San Bernardino Valley College',
      period: '01/2020 – 05/2022',
      note: 'GPA 3.88 · Dean\'s List',
    },
  ],

  bootSequence: [
    '[ OK ] Initializing portfolio kernel...',
    '[ OK ] Loading cybersecurity modules...',
    '[ OK ] Mounting /projects',
    '[ OK ] Homelab services: online (private)',
    '[ OK ] Graduate status: confirmed',
    '[ OK ] Terminal interface ready',
    '',
    'Welcome, visitor. Type `help` in the terminal below.',
  ],
};
