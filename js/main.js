// Nav scroll behaviour
window.addEventListener('scroll', function() {
  const nav = document.getElementById('nav');
  if (window.scrollY > 60) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
});

// Contact form — Formspree submission
(function() {
  var form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    var btn      = document.getElementById('submit-btn');
    var success  = document.getElementById('form-success');
    var errorMsg = document.getElementById('form-error');
    var nameVal  = document.getElementById('cf-name').value.trim();
    var emailVal = document.getElementById('cf-email').value.trim();

    // Sync reply-to hidden field with email input
    document.getElementById('hidden-replyto').value = emailVal;

    // Prepend sender details to the message body
    var msgArea = document.getElementById('cf-message');
    var original = msgArea.value;
    msgArea.value = 'From: ' + nameVal + ' <' + emailVal + '>\n\n' + original;

    btn.disabled = true;
    btn.textContent = 'Sending…';
    success.style.display  = 'none';
    errorMsg.style.display = 'none';

    var data = new FormData(form);

    fetch(form.action, {
      method: 'POST',
      body: data,
      headers: { 'Accept': 'application/json' }
    })
    .then(function(res) {
      if (res.ok) {
        success.style.display = 'block';
        form.reset();
        msgArea.value = ''; // reset modified field
      } else {
        return res.json().then(function(d) { throw d; });
      }
    })
    .catch(function() {
      // restore message on error so user doesn't lose it
      msgArea.value = original;
      errorMsg.style.display = 'block';
    })
    .finally(function() {
      btn.disabled = false;
      btn.textContent = 'Send Message →';
    });
  });
})();

// Hamburger menu toggle
(function() {
  var btn = document.getElementById('hamburger-btn');
  var links = document.getElementById('nav-links');
  if (!btn || !links) return;

  function closeMenu() {
    btn.classList.remove('open');
    links.classList.remove('mobile-open');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', 'Open navigation menu');
  }

  btn.addEventListener('click', function() {
    var isOpen = links.classList.contains('mobile-open');
    if (isOpen) {
      closeMenu();
    } else {
      btn.classList.add('open');
      links.classList.add('mobile-open');
      btn.setAttribute('aria-expanded', 'true');
      btn.setAttribute('aria-label', 'Close navigation menu');
    }
  });

  // Close button inside drawer
  var closeBtn = document.getElementById('nav-close-btn');
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);

  // Close when a nav link is tapped
  links.querySelectorAll('a').forEach(function(a) {
    a.addEventListener('click', closeMenu);
  });

  // Close on resize to desktop
  window.addEventListener('resize', function() {
    if (window.innerWidth > 1024) closeMenu();
  });
})();
