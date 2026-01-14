// ===== Mobile Menu Toggle =====
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');



if (hamburger) {
    hamburger.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
}

// Close menu when clicking on a link
navLinks.forEach(function(link) {
    link.addEventListener('click', function() {
        navMenu.classList.remove('active');
        if (hamburger) {
            hamburger.classList.remove('active');
        }
    });
});

// ===== Smooth Scrolling =====
document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);
        
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== Active Navigation on Scroll =====
const sections = document.querySelectorAll('section');

window.addEventListener('scroll', function() {
    let current = '';
    
    sections.forEach(function(section) {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(function(link) {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href && href.includes(current)) {
            link.classList.add('active');
        }
    });
    
    // Add shadow to navbar on scroll
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ===== Scroll Reveal Animation =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Elements to animate on scroll
const animateElements = document.querySelectorAll('.skill-card, .portfolio-card, .about-content');

animateElements.forEach(function(element) {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'all 0.6s ease';
    observer.observe(element);
});

// ===== Typing Effect for Hero Title =====
const highlight = document.querySelector('.highlight');
if (highlight) {
    const text = highlight.textContent;
    highlight.textContent = '';
    
    let i = 0;
    function typeWriter() {
        if (i < text.length) {
            highlight.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    }
    
    setTimeout(typeWriter, 500);
}

// ===== Contact Form Handling with Formspree =====
const contactForm = document.getElementById('contactForm');
const successMessage = document.getElementById('successMessage');
const errorMessage = document.getElementById('errorMessage');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Hide previous messages
        successMessage.style.display = 'none';
        errorMessage.style.display = 'none';
        
        // Get submit button
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const btnText = submitBtn.querySelector('.btn-text');
        const originalText = btnText.textContent;
        
        // Show loading state
        btnText.textContent = 'Mengirim...';
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.6';
        submitBtn.style.cursor = 'not-allowed';
        
        // Get form data
        const formData = new FormData(contactForm);
        
        // Send to Formspree
        fetch(contactForm.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                // Show success message
                successMessage.style.display = 'block';
                contactForm.reset();
                
                // Scroll to success message
                successMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                
                // Hide success message after 8 seconds
                setTimeout(function() {
                    successMessage.style.display = 'none';
                }, 8000);
            } else {
                // Show error message
                errorMessage.style.display = 'block';
                errorMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                
                setTimeout(function() {
                    errorMessage.style.display = 'none';
                }, 8000);
            }
        })
        .catch(error => {
            // Show error message
            errorMessage.style.display = 'block';
            errorMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            console.error('Error:', error);
            
            setTimeout(function() {
                errorMessage.style.display = 'none';
            }, 8000);
        })
        .finally(() => {
            // Reset button state
            btnText.textContent = originalText;
            submitBtn.disabled = false;
            submitBtn.style.opacity = '1';
            submitBtn.style.cursor = 'pointer';
        });

        if (certTrack && prevBtn && nextBtn) {
  const scrollAmount = () => {
    const item = certTrack.querySelector(".cert-item");
    return item ? item.clientWidth + 16 : 300; // + gap
  };

  const updateButtons = () => {
    const maxScroll = certTrack.scrollWidth - certTrack.clientWidth;
    prevBtn.disabled = certTrack.scrollLeft <= 0;
    nextBtn.disabled = certTrack.scrollLeft >= maxScroll - 1;
  };

  prevBtn.addEventListener("click", () => {
    certTrack.scrollLeft -= scrollAmount();
    setTimeout(updateButtons, 300);
  });

  nextBtn.addEventListener("click", () => {
    certTrack.scrollLeft += scrollAmount();
    setTimeout(updateButtons, 300);
  });

  certTrack.addEventListener("scroll", updateButtons);
  window.addEventListener("load", updateButtons);
}
    });
}

// ==== Modal preview ====
const modal = document.getElementById('certModal');
const modalImg = modal?.querySelector('.cert-modal-img');
const modalTitle = modal?.querySelector('.cert-modal-title');
const modalClose = modal?.querySelector('.cert-modal-close');
const modalBackdrop = modal?.querySelector('.cert-modal-backdrop');

const openModal = (title, imgSrc) => {
  if (!modal || !modalImg || !modalTitle) return;
  modalTitle.textContent = title;
  modalImg.src = imgSrc;
  modalImg.alt = title;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
};

const closeModal = () => {
  if (!modal) return;
  modal.classList.remove('open');
  document.body.style.overflow = '';
};

document.querySelectorAll('[data-cert-modal]').forEach(btn => {
  btn.addEventListener('click', () => {
    const title = btn.getAttribute('data-cert-title') || 'Certificate';
    const img = btn.getAttribute('data-cert-img') || '';
    openModal(title, img);
  });
});

[modalClose, modalBackdrop].forEach(el => {
  el?.addEventListener('click', closeModal);
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal && modal.classList.contains('open')) {
    closeModal();
  }
});


// ==== Certificates slider (1 card per view) ====
const certTrack = document.querySelector('.cert-track');
const certCards = document.querySelectorAll('.cert-card');
const certPrev  = document.querySelector('.cert-prev');
const certNext  = document.querySelector('.cert-next');

if (certTrack && certCards.length && certPrev && certNext) {
  let certIndex = 0;

  function setActiveCert() {
    certCards.forEach(card => card.classList.remove('active'));
    certCards[certIndex].classList.add('active');
  }

  function moveCertTrack() {
    const cardWidth = certCards[0].offsetWidth + 24; // margin kiri+kanan
    const offset = -certIndex * cardWidth;
    certTrack.style.transform = `translateX(${offset}px)`;
  }

  function goToCert(index) {
    const total = certCards.length;
    certIndex = (index + total) % total;
    setActiveCert();
    moveCertTrack();
  }

  certNext.addEventListener('click', () => {
    goToCert(certIndex + 1);
  });

  certPrev.addEventListener('click', () => {
    goToCert(certIndex - 1);
  });

  window.addEventListener('load', () => {
    setActiveCert();
    moveCertTrack();
  });
}


// ==== Fade-in on scroll (section + cards) ====
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

// tombol next
btnCertNext?.addEventListener('click', () => {
  certIndex = (certIndex + 1) % certCards.length;
  updateCertClasses();
});

// tombol prev
btnCertPrev?.addEventListener('click', () => {
  certIndex = (certIndex - 1 + certCards.length) % certCards.length;
  updateCertClasses();
});

// panggil sekali saat load
if (certCards.length > 0) {
  updateCertClasses();
}

