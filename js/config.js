if (location.protocol === 'http:' && location.hostname.endsWith('github.io')) {
  location.replace('https:' + location.href.substring(location.protocol.length));
}

// Contact form — free at https://formspree.io
// 1. Sign up → New Form → set email to ronparada@protonmail.com
// 2. Copy the form ID from the endpoint (formspree.io/f/YOUR_ID)
// 3. Paste it below and push to GitHub
const SITE_CONFIG = {
  formspreeId: 'xaqzpokl',
  contactEmail: 'ronparada@protonmail.com',
};
