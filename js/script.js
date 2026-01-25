// ===== Mobile Menu Toggle =====
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

if (hamburger && navMenu) {
  hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
  });

  // Close menu when clicking a link (mobile)
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      hamburger.classList.remove('active');
    });
  });
}

// ===== Smooth Scrolling =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const targetId = anchor.getAttribute('href');
    const target = document.querySelector(targetId);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
  });
});

// ===== Active Navigation on Scroll =====
const sections = document.querySelectorAll('section');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    if (window.scrollY >= (sectionTop - 120)) current = section.getAttribute('id') || '';
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href') || '';
    if (current && href.includes(current)) link.classList.add('active');
  });

  const navbar = document.querySelector('.navbar');
  if (navbar) {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }
});

// ===== Scroll Reveal Animation =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.style.opacity = '1';
    entry.target.style.transform = 'translateY(0)';
  });
}, { threshold: 0.1, rootMargin: '0px 0px -100px 0px' });

document.querySelectorAll('.skill-card, .portfolio-card, .about-content, .edu-card')
  .forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
  });

// ===== Typing Effect for Hero Title =====
const highlight = document.querySelector('.highlight');
if (highlight) {
  const text = highlight.textContent;
  highlight.textContent = '';
  let i = 0;

  function typeWriter() {
    if (i >= text.length) return;
    highlight.textContent += text.charAt(i);
    i += 1;
    setTimeout(typeWriter, 100);
  }

  setTimeout(typeWriter, 500);
}

// ===== Contact Form (Formspree) =====
const contactForm = document.getElementById('contactForm');
const successMessage = document.getElementById('successMessage');
const errorMessage = document.getElementById('errorMessage');

if (contactForm && successMessage && errorMessage) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    successMessage.style.display = 'none';
    errorMessage.style.display = 'none';

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const btnText = submitBtn?.querySelector('.btn-text');
    const originalText = btnText ? btnText.textContent : '';

    if (btnText) btnText.textContent = 'Mengirim...';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.6';
      submitBtn.style.cursor = 'not-allowed';
    }

    try {
      const formData = new FormData(contactForm);
      const res = await fetch(contactForm.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        successMessage.style.display = 'block';
        contactForm.reset();
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        setTimeout(() => { successMessage.style.display = 'none'; }, 8000);
      } else {
        errorMessage.style.display = 'block';
        errorMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        setTimeout(() => { errorMessage.style.display = 'none'; }, 8000);
      }
    } catch (err) {
      errorMessage.style.display = 'block';
      errorMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      console.error('Error:', err);
      setTimeout(() => { errorMessage.style.display = 'none'; }, 8000);
    } finally {
      if (btnText) btnText.textContent = originalText;
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
        submitBtn.style.cursor = 'pointer';
      }
    }
  });
}

// ===== Modal Preview Certificates =====
const certModal = document.getElementById('certModal');
if (certModal) {
  const modalImg = certModal.querySelector('.cert-modal-img');
  const modalTitle = certModal.querySelector('.cert-modal-title');
  const modalClose = certModal.querySelector('.cert-modal-close');
  const modalBackdrop = certModal.querySelector('.cert-modal-backdrop');

  const openModal = (title, imgSrc) => {
    if (!modalImg || !modalTitle) return;
    modalTitle.textContent = title;
    modalImg.src = imgSrc;
    modalImg.alt = title;
    certModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    certModal.classList.remove('open');
    document.body.style.overflow = '';
  };

  document.querySelectorAll('[data-cert-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      const title = btn.getAttribute('data-cert-title') || 'Certificate';
      const img = btn.getAttribute('data-cert-img') || '';
      openModal(title, img);
    });
  });

  [modalClose, modalBackdrop].forEach(el => el?.addEventListener('click', closeModal));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && certModal.classList.contains('open')) closeModal();
  });
}

// ===== Certificates Slider + Dots =====
const certTrack = document.querySelector('.cert-track');
const certCards = document.querySelectorAll('.cert-card');
const certPrev = document.querySelector('.cert-prev');
const certNext = document.querySelector('.cert-next');
const dotsWrap = document.querySelector('.cert-dots');

if (certTrack && certCards.length && certPrev && certNext) {
  let certIndex = 0;

  function setActiveCert() {
    certCards.forEach(c => c.classList.remove('active'));
    certCards[certIndex].classList.add('active');
  }

  function moveCertTrack() {
    const cardWidth = certCards[0].offsetWidth + 24;
    certTrack.style.transform = `translateX(${-certIndex * cardWidth}px)`;
  }

  function renderDots() {
    if (!dotsWrap) return;
    dotsWrap.innerHTML = '';
    certCards.forEach((_, i) => {
      const d = document.createElement('button');
      d.type = 'button';
      d.className = 'cert-dot' + (i === certIndex ? ' active' : '');
      d.setAttribute('aria-label', `Sertifikat ${i + 1}`);
      d.addEventListener('click', () => goToCert(i));
      dotsWrap.appendChild(d);
    });
  }

  function goToCert(index) {
    const total = certCards.length;
    certIndex = (index + total) % total;
    setActiveCert();
    moveCertTrack();
    renderDots();
  }

  certNext.addEventListener('click', () => goToCert(certIndex + 1));
  certPrev.addEventListener('click', () => goToCert(certIndex - 1));

  window.addEventListener('load', () => {
    setActiveCert();
    moveCertTrack();
    renderDots();
  });
}

// ===== Fade-in Certificates =====
const fadeSection = document.querySelector('.cert-section.fade-section');
const fadeItems = document.querySelectorAll('.cert-card.fade-item');

if (fadeSection) {
  const sectionObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.25 });

  sectionObserver.observe(fadeSection);
}

if (fadeItems.length) {
  const itemObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.2 });

  fadeItems.forEach(item => itemObserver.observe(item));
}

// ===== Auto-loop Tools & Skills =====
document.addEventListener('DOMContentLoaded', () => {
  const track = document.querySelector('.skills-track');
  if (!track) return;

  if (track.dataset.cloned === '1') return;
  track.dataset.cloned = '1';

  const cards = Array.from(track.children);
  cards.forEach(card => track.appendChild(card.cloneNode(true)));
});

// ===== Live Clock =====
function updateClock() {
  const el = document.getElementById('live-clock');
  if (!el) return;
  const now = new Date();
  const opt = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
  el.textContent = now.toLocaleTimeString('id-ID', opt) + ' WIB';
}
updateClock();
setInterval(updateClock, 1000);

// ===== Project Detail Redirect =====
document.querySelectorAll('.project-more').forEach(btn => {
  btn.addEventListener('click', () => {
    const slug = btn.dataset.project;
    window.location.href = `project-detail-${slug}.html`;
  });
});
