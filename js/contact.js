/**
 * CONTACT FORM — sends via Formspree AJAX (see config.js for formspreeId)
 * Uses type="button" (not submit) to avoid browser opening Outlook/mailto
 * Only works on https://ronparada.github.io — localhost shows a preview message
 */
(function () {
  const form = document.getElementById('contact-form');
  const statusEl = document.getElementById('form-status');
  const submitBtn = document.getElementById('contact-submit');
  if (!form || !submitBtn) return;

  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const messageInput = document.getElementById('contact-message');
  const honeypot = form.querySelector('[name="_gotcha"]');
  const formspreeId = (typeof SITE_CONFIG !== 'undefined' && SITE_CONFIG.formspreeId) || 'xaqzpokl';
  const endpoint = `https://formspree.io/f/${formspreeId}`;

  if (location.protocol !== 'https:' && !location.hostname.includes('localhost') && !location.hostname.includes('127.0.0.1')) {
    showStatus('Open https://ronparada.github.io to use the contact form securely.', 'error');
  }

  form.addEventListener('submit', (e) => e.preventDefault());

  submitBtn.addEventListener('click', sendMessage);

  async function sendMessage() {
    if (honeypot && honeypot.value) return;

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();

    if (!name || !email || !message) {
      showStatus('Fill in all fields.', 'error');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showStatus('Invalid email address.', 'error');
      return;
    }

    if (location.protocol !== 'https:' && location.hostname.includes('localhost')) {
      showStatus('Local preview — use https://ronparada.github.io to send for real.', 'error');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'transmitting...';
    showStatus('', '');

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          message,
          _subject: `Portfolio contact from ${name}`,
          _replyto: email,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        form.reset();
        showStatus('Message sent. I\'ll get back to you.', 'success');
        submitBtn.textContent = 'sent ✓';
      } else {
        const errMsg = data.error || Object.values(data.errors || {}).flat().join(' ') || `Error ${res.status}`;
        showStatus(`${errMsg}`, 'error');
        submitBtn.textContent = 'transmit()';
      }
    } catch (err) {
      showStatus(`Could not send — email ronparada@protonmail.com directly. (${err.message})`, 'error');
      submitBtn.textContent = 'transmit()';
    } finally {
      submitBtn.disabled = false;
      if (submitBtn.textContent === 'transmitting...') submitBtn.textContent = 'transmit()';
    }
  }

  function showStatus(msg, type) {
    if (!statusEl) return;
    statusEl.textContent = msg;
    statusEl.className = 'form-status' + (type ? ` ${type}` : '');
  }
})();
