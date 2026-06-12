/**
 * SITE CONFIG — edit here for quick changes
 * After editing: bump ?v= number in index.html, then git push
 */

// Force HTTPS (do not remove)
if (
  location.protocol === 'http:' &&
  (location.hostname.endsWith('github.io') ||
    location.hostname === 'ronparada.com' ||
    location.hostname === 'www.ronparada.com')
) {
  location.replace('https:' + location.href.substring(location.protocol.length));
}

// Contact form (Formspree): https://formspree.io
// To change form: update formspreeId, push to GitHub
// Form must be tested on https://ronparada.com (not localhost)
const SITE_CONFIG = {
  formspreeId: 'xaqzpokl',
  contactEmail: 'ronparada@protonmail.com',
};
