// ===== Sidebar Logic =====
const sidebar = document.getElementById('sidebar');
const mobileOverlay = document.getElementById('mobile-overlay');

// Global toggle function
window.toggleSidebar = function () {
  if (sidebar && mobileOverlay) {
    const isClosed = sidebar.classList.contains('-translate-x-full');

    if (isClosed) {
      // Open
      sidebar.classList.remove('-translate-x-full');
      mobileOverlay.classList.remove('hidden');
      setTimeout(() => {
        mobileOverlay.classList.remove('opacity-0');
      }, 10);
    } else {
      // Close
      sidebar.classList.add('-translate-x-full');
      mobileOverlay.classList.add('opacity-0');
      setTimeout(() => {
        mobileOverlay.classList.add('hidden');
      }, 300);
    }
  }
};

// Close sidebar when clicking a link on mobile
const navLinks = document.querySelectorAll('.nav-item');
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    if (window.innerWidth < 1024) { // Close on mobile and tablet
      // Manual close call to ensure correct state
      sidebar.classList.add('-translate-x-full');
      mobileOverlay.classList.add('opacity-0');
      setTimeout(() => {
        mobileOverlay.classList.add('hidden');
      }, 300);
    }
  });
});

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
  const offset = 100; // Adjustment for scroll offset

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    // const sectionHeight = section.clientHeight; // Unused
    if (window.scrollY >= (sectionTop - offset)) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    // Basic state reset
    link.classList.remove('active-nav', 'bg-[#1a1f2e]', 'text-[#00ff88]');
    link.classList.add('text-[#94a3b8]');

    // Icon scale reset
    const icon = link.querySelector('i');
    if (icon) icon.classList.remove('scale-110');

    // Indicator reset
    const indicator = link.querySelector('div.absolute'); // The green bar
    if (indicator) indicator.classList.remove('opacity-100');

    const href = link.getAttribute('href');
    if (current && href === `#${current}`) {
      // Active state
      link.classList.add('active-nav', 'bg-[#1a1f2e]', 'text-[#00ff88]');
      link.classList.remove('text-[#94a3b8]');
      if (icon) icon.classList.add('scale-110');
      if (indicator) indicator.classList.add('opacity-100');
    }
  });
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
        successMessage.style.display = 'flex';
        contactForm.reset();
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        setTimeout(() => { successMessage.style.display = 'none'; }, 8000);
      } else {
        errorMessage.style.display = 'flex';
        errorMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        setTimeout(() => { errorMessage.style.display = 'none'; }, 8000);
      }
    } catch (err) {
      errorMessage.style.display = 'flex';
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

// ===== Modern Certificates Slider =====
const certSlider = document.getElementById('cert-slider');
const certNextMobile = document.getElementById('cert-next-mobile');
const certNextDesktop = document.getElementById('cert-next-desktop');
const certPrevDesktop = document.getElementById('cert-prev-desktop');

if (certSlider) {
  const scrollAmount = 320; // Scroll increment

  const scrollSlider = (direction) => {
    certSlider.scrollBy({
      left: direction * scrollAmount,
      behavior: 'smooth'
    });
  };

  certNextMobile?.addEventListener('click', () => scrollSlider(1));
  certNextDesktop?.addEventListener('click', () => scrollSlider(1));
  certPrevDesktop?.addEventListener('click', () => scrollSlider(-1));

  // Optional: Auto-hide mobile next button when reaching end
  certSlider.addEventListener('scroll', () => {
    if (certSlider.scrollLeft + certSlider.clientWidth >= certSlider.scrollWidth - 10) {
      certNextMobile?.classList.add('opacity-0', 'pointer-events-none');
    } else {
      certNextMobile?.classList.remove('opacity-0', 'pointer-events-none');
    }
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


// ===== Live Clock =====
// ===== Live Clock =====
function updateClock() {
  const clockEl = document.getElementById('digital-clock');
  const dateEl = document.getElementById('date-display');

  if (!clockEl || !dateEl) return;

  const now = new Date();

  // Time: 00:00:00
  const timeOpt = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
  clockEl.textContent = now.toLocaleTimeString('en-US', timeOpt);

  // Date: MON, JAN 01
  const dateOpt = { weekday: 'short', month: 'short', day: '2-digit' };
  dateEl.textContent = now.toLocaleDateString('en-US', dateOpt).toUpperCase();
}
updateClock();
setInterval(updateClock, 1000);

// ===== Projects Filter (New Tailwind Design) =====
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

if (filterBtns.length > 0) {
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      // Update active state
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.style.backgroundColor = '#1a1f2e';
        b.style.color = '#94a3b8';
        b.setAttribute('aria-pressed', 'false');
      });

      btn.classList.add('active');
      btn.style.backgroundColor = '#00ff88';
      btn.style.color = '#0b0f14';
      btn.setAttribute('aria-pressed', 'true');

      // Filter projects
      projectCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

// ===== Project Modal =====
const projectData = {
  'fraud-detection': {
    title: 'Fraud Detection Mobile Banking (XGBoost)',
    description: 'A comprehensive machine learning solution to detect fraudulent transactions in mobile banking systems using XGBoost algorithm with advanced preprocessing pipeline.',
    features: [
      'Real-time fraud detection with 95% accuracy',
      'Automated preprocessing pipeline for data cleaning',
      'Performance metrics dashboard for model evaluation'
    ],
    tech: ['Python', 'XGBoost', 'Pandas', 'Scikit-learn', 'Matplotlib'],
    github: 'https://github.com/wanhangerrrr',
    demo: null
  },
  'ai-notebook': {
    title: 'Aplikasi Mobile Notebook Berbasis AI',
    description: 'An intelligent note-taking mobile application powered by AI to help users summarize ideas, organize notes, and boost productivity.',
    features: [
      'AI-powered text summarization',
      'Smart note organization and categorization',
      'Cross-platform synchronization'
    ],
    tech: ['JavaScript', 'React Native', 'OpenAI API', 'Firebase'],
    github: 'https://github.com/wanhangerrrr',
    demo: null
  },
  'tomato-leaf': {
    title: 'Tomato Leaf Classification (Transfer Learning)',
    description: 'Mobile application for detecting tomato plant diseases using transfer learning with MobileNetV2, optimized for mobile deployment.',
    features: [
      'Real-time disease detection via camera',
      'Transfer learning with MobileNetV2 for accuracy',
      'Offline-capable model for field use'
    ],
    tech: ['TensorFlow', 'MobileNetV2', 'Keras', 'Flutter'],
    github: 'https://github.com/wanhangerrrr',
    demo: null
  },
  'umkm-app': {
    title: 'UMKM Management App',
    description: 'Mobile application designed to help small business owners manage their operations, inventory, and customer data efficiently.',
    features: [
      'Inventory management system',
      'Customer relationship tracking',
      'Sales analytics dashboard'
    ],
    tech: ['Flutter', 'Dart', 'Firebase', 'SQLite'],
    github: 'https://github.com/wanhangerrrr',
    demo: null
  },
  'tomato-web': {
    title: 'Tomato Leaf Classification Web',
    description: 'Web-based application for tomato disease classification with an intuitive upload → prediction → results workflow.',
    features: [
      'Drag-and-drop image upload',
      'Instant prediction results',
      'Disease information and treatment recommendations'
    ],
    tech: ['HTML', 'Tailwind CSS', 'JavaScript', 'TensorFlow.js'],
    github: 'https://github.com/wanhangerrrr',
    demo: null
  },
  'crud-flutter': {
    title: 'Student CRUD App (Flutter)',
    description: 'A clean and simple Flutter application for managing student data with full CRUD (Create, Read, Update, Delete) operations.',
    features: [
      'Complete CRUD operations',
      'Search and filter functionality',
      'Data export to CSV'
    ],
    tech: ['Flutter', 'Dart', 'Firebase', 'Provider'],
    github: 'https://github.com/wanhangerrrr',
    demo: null
  }
};

function openProjectModal(projectId) {
  const modal = document.getElementById('projectModal');
  const modalContent = document.getElementById('modalContent');
  const project = projectData[projectId];

  if (!project) return;

  // Build modal content
  let html = `
    <h3 class="text-2xl sm:text-3xl font-bold mb-4" style="color: #f8fafc;">${project.title}</h3>
    <p class="text-base mb-6" style="color: #94a3b8;">${project.description}</p>
    
    <div class="mb-6">
      <h4 class="text-lg font-semibold mb-3" style="color: #f8fafc;">Key Features</h4>
      <ul class="space-y-2">
        ${project.features.map(feature => `
          <li class="flex items-start gap-2">
            <svg class="w-5 h-5 mt-0.5 flex-shrink-0" style="color: #00ff88;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span style="color: #94a3b8;">${feature}</span>
          </li>
        `).join('')}
      </ul>
    </div>
    
    <div class="mb-6">
      <h4 class="text-lg font-semibold mb-3" style="color: #f8fafc;">Tech Stack</h4>
      <div class="flex flex-wrap gap-2">
        ${project.tech.map(tech => `
          <span class="px-3 py-1 rounded-full text-sm font-medium" style="background-color: #0b0f14; color: #94a3b8; border: 1px solid #334155;">
            ${tech}
          </span>
        `).join('')}
      </div>
    </div>
    
    <div class="flex gap-3">
      <a 
        href="${project.github}" 
        target="_blank"
        class="flex-1 px-6 py-3 rounded-lg text-center font-medium transition-colors duration-200 focus:outline-none focus:ring-2"
        style="background-color: #00ff88; color: #0b0f14;">
        <i class="fab fa-github mr-2"></i>View on GitHub
      </a>
      ${project.demo ? `
        <a 
          href="${project.demo}" 
          target="_blank"
          class="flex-1 px-6 py-3 rounded-lg text-center font-medium transition-colors duration-200 focus:outline-none focus:ring-2"
          style="background-color: #0b0f14; color: #94a3b8; border: 1px solid #334155;">
          <i class="fas fa-external-link-alt mr-2"></i>Live Demo
        </a>
      ` : ''}
    </div>
  `;

  modalContent.innerHTML = html;
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
  const modal = document.getElementById('projectModal');
  modal.classList.add('hidden');
  modal.classList.remove('flex');
  document.body.style.overflow = '';
}

// Close modal on ESC key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeProjectModal();
  }
});

// Close modal on backdrop click
const projectModal = document.getElementById('projectModal');
if (projectModal) {
  projectModal.addEventListener('click', (e) => {
    if (e.target.id === 'projectModal') {
      closeProjectModal();
    }
  });
}
