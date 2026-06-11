(function () {
  const form = document.getElementById('contact-form');
  const statusEl = document.getElementById('form-status');
  if (!form) return;

  const honeypot = form.querySelector('[name="_gotcha"]');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (honeypot && honeypot.value) return;

    const btn = form.querySelector('button[type="submit"]');
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !message) {
      showStatus('Fill in all fields.', 'error');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showStatus('Invalid email address.', 'error');
      return;
    }

    const formspreeId = typeof SITE_CONFIG !== 'undefined' && SITE_CONFIG.formspreeId;

    if (!formspreeId) {
      showStatus('Form not configured yet — email me directly.', 'error');
      window.location.href = `mailto:${SITE_CONFIG?.contactEmail || 'ronparada@protonmail.com'}?subject=${encodeURIComponent('Portfolio contact from ' + name)}&body=${encodeURIComponent(message + '\n\nFrom: ' + email)}`;
      return;
    }

    btn.disabled = true;
    btn.textContent = 'transmitting...';
    showStatus('', '');

    try {
      const res = await fetch(`https://formspree.io/f/${formspreeId}`, {
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
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        form.reset();
        showStatus('Message sent. I\'ll get back to you.', 'success');
        btn.textContent = 'sent ✓';
      } else {
        const errMsg = data.error || Object.values(data.errors || {}).flat().join(' ') || 'Send failed';
        showStatus(errMsg + ' — try email directly.', 'error');
        btn.textContent = 'transmit()';
      }
    } catch {
      showStatus('Send failed — try email directly.', 'error');
      btn.textContent = 'transmit()';
    } finally {
      btn.disabled = false;
      if (btn.textContent === 'transmitting...') btn.textContent = 'transmit()';
    }
  });

  function showStatus(msg, type) {
    if (!statusEl) return;
    statusEl.textContent = msg;
    statusEl.className = 'form-status' + (type ? ` ${type}` : '');
  }
})();
