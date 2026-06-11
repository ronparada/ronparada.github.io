(function () {
  const form = document.getElementById('contact-form');
  const statusEl = document.getElementById('form-status');
  if (!form) return;

  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const messageInput = document.getElementById('contact-message');
  const honeypot = form.querySelector('[name="_gotcha"]');
  const formspreeId = (typeof SITE_CONFIG !== 'undefined' && SITE_CONFIG.formspreeId) || 'xaqzpokl';
  const endpoint = `https://formspree.io/f/${formspreeId}`;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (honeypot && honeypot.value) return;

    const btn = form.querySelector('button[type="submit"]');
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

    btn.disabled = true;
    btn.textContent = 'transmitting...';
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
        btn.textContent = 'sent ✓';
      } else {
        const errMsg = data.error || Object.values(data.errors || {}).flat().join(' ') || `Error ${res.status}`;
        showStatus(`${errMsg} — try email directly.`, 'error');
        btn.textContent = 'transmit()';
      }
    } catch (err) {
      showStatus(`Network error — try email directly. (${err.message})`, 'error');
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
