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
    demo: null,
    isSimulator: true
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
    demo: null,
    isLiveDemo: true
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
    demo: null,
    isCrudSimulator: true
  },
  'dashboard-traffic': {
    title: 'Personal Portfolio Analytics Dashboard',
    description: 'Real-time analytics dashboard to track portfolio engagement and project activity with dynamic data visualization.',
    features: [
      'Real-time visitor tracking',
      'Interactive charts & data visualization',
      'Project engagement metrics'
    ],
    tech: ['JavaScript', 'Tailwind CSS', 'Node.js'],
    github: 'https://github.com/wanhangerrrr',
    demo: 'https://dashboard-portofolio-ten.vercel.app/dashboard'
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
      ${project.isLiveDemo ? `
        <button 
          onclick="openLiveDemo('${projectId}')" 
          class="flex-1 px-6 py-3 rounded-lg text-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 hover:bg-[#00ff88] hover:text-[#0b0f14] group"
          style="background-color: transparent; color: #00ff88; border: 1px solid #00ff88;">
          <i class="fas fa-play mr-2 group-hover:animate-pulse"></i>Live Demo
        </button>
      ` : project.isSimulator ? `
        <button 
          onclick="openSimulator()" 
          class="flex-1 px-6 py-3 rounded-lg text-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 hover:bg-[#00ff88] hover:text-[#0b0f14] group"
          style="background-color: transparent; color: #00ff88; border: 1px solid #00ff88;">
          <i class="fas fa-bolt mr-2 group-hover:animate-pulse"></i>Live Demo
        </button>
      ` : project.isCrudSimulator ? `
        <button 
          onclick="openCrudSimulator()" 
          class="flex-1 px-6 py-3 rounded-lg text-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 hover:bg-[#38bdf8] hover:text-[#0b0f14] group"
          style="background-color: transparent; color: #38bdf8; border: 1px solid #38bdf8;">
          <i class="fas fa-users-cog mr-2 group-hover:animate-pulse"></i>Live Demo
        </button>
      ` : project.demo ? `
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

// ===== Language Switcher Logic =====
const translations = {
  en: {
    role: "Data Engineer Enthusiast",
    nav: {
      home: "Home",
      about: "About",
      education: "Education",
      projects: "Projects",
      certificates: "Certificates",
      contact: "Contact",
      dashboard: "Dashboard",
      hiring: "Technical Summary"
    },
    hero: {
      greeting: "Hello Everyone",
      intro: "I am",
      subtitle: "Data Science & Data Engineering Student | Informatics Student",
      connect: "Let's connect"
    },
    heading: {
      skills: "Tech and Stack",
      about: "About",
      education: "Education",
      projects: "Projects",
      certificates: "Certificates",
      contact: "Contact Me"
    },
    text: {
      skills: "Tools I use for data, engineering, and ML projects.",
      about1: "I am an Informatics student specializing in Data Science and Data Engineering. My main interest is building efficient, structured data processing systems that provide measurable insights.",
      about2: "I have worked on various projects involving machine learning, data classification, and web/mobile application development. I am accustomed to working with Python, SQL, and data analysis tools to turn raw data into implementable solutions.",
      about3: "My current focus is deepening my skills in data engineering, model optimization, and building scalable, production-ready systems.",
      projects: "Selected projects in ML, AI, and Data Engineering"
    },
    btn: {
      downloadCv: "Download CV",
      viewDashboard: "View Dashboard Traffic",
      details: "Details",
      send: "Send Message"
    },
    contact: {
      introTitle: "Let's Build Something Meaningful",
      introText: "I am enthusiastic about building scalable data solutions and continuously improving my skills in Data Engineering and Machine Learning. If you have a project, job opportunity, or internship offer, feel free to contact me. I'd love to connect and discuss further.",
      gmail: {
        title: "Stay in Touch",
        desc: "Reach out via email for any inquiries or collaborations.",
        btn: "Go to Gmail"
      },
      instagram: {
        title: "Follow My Journey",
        desc: "Stay updated with my latest posts and stories.",
        btn: "Go to Instagram"
      },
      linkedin: {
        title: "Let's Connect",
        desc: "Connect for collaboration or explore my professional experience.",
        btn: "Go to LinkedIn"
      },
      whatsapp: {
        title: "Quick Chat",
        desc: "Chat directly with me on WhatsApp for fast responses.",
        btn: "Chat on WhatsApp"
      },
      github: {
        title: "Explore the Code",
        desc: "Explore the source code for all my projects on GitHub.",
        btn: "Go to GitHub"
      }
    },
    project: {
      fraud: {
        title: "Fraud Detection Mobile Banking (XGBoost)",
        desc: "Machine learning model to detect fraudulent transactions with preprocessing pipeline and performance metrics evaluation."
      },
      aiNotebook: {
        title: "Aplikasi Mobile Notebook Berbasis AI",
        desc: "Note-taking app with AI features to summarize ideas, organize notes, and boost productivity."
      },
      tomatoMobile: {
        title: "Tomato Leaf Classification (Transfer Learning)",
        desc: "Mobile app for tomato disease classification using transfer learning, optimized for mobile deployment."
      },
      umkm: {
        title: "UMKM Management App",
        desc: "Mobile application to help small business owners manage basic data and operational workflows efficiently."
      },
      tomatoWeb: {
        title: "Tomato Leaf Classification Web",
        desc: "Web application for tomato leaf classification with upload → prediction → results flow."
      },
      crud: {
        title: "Student CRUD App (Flutter)",
        desc: "Flutter application for managing student data with clean interface and end-to-end CRUD operations."
      },
      dashboard: {
        title: "Personal Portfolio Analytics Dashboard",
        desc: "Real-time analytics dashboard to track portfolio engagement and project activity with dynamic data visualization."
      }
    },
    hiring: {
      title: "Technical Summary",
      subtitle: "A concise summary of my qualifications, focus, and value proposition.",
      summaryTitle: "Professional Summary",
      summaryText: "Data Science & Engineering undergraduate with a strong foundation in building scalable data pipelines, ETL processes, and machine learning models. Proficient in Python, SQL, and cloud technologies, with hands-on experience in real-world projects ranging from fraud detection to agricultural AI solutions. Passionate about transforming raw data into actionable insights and optimizing infrastructure for performance and reliability.",
      competenciesTitle: "Core Competencies",
      quickFacts: "Quick Facts",
      ctaTitle: "Ready to hire?",
      ctaText: "Download my CV or schedule a chat.",
      topProjects: "Top Relevant Projects"
    },
    cert: {
      tag: {
        onlineCourse: "ONLINE COURSE",
        webinar: "ACADEMIC WEBINAR",
        industry: "INDUSTRY EVENT",
        workshop: "WORKSHOP",
        practicum: "ACADEMIC PRACTICUM"
      }
    },
    ph: {
      name: "Your Name",
      email: "Your Email",
      message: "Your Message"
    }
  },
  id: {
    role: "Data Engineer Enthusiast",
    nav: {
      home: "Beranda",
      about: "Tentang",
      education: "Pendidikan",
      projects: "Proyek",
      certificates: "Sertifikat",
      contact: "Kontak",
      dashboard: "Dasbor",
      hiring: "Ringkasan Teknis"
    },
    hero: {
      greeting: "Halo Semuanya",
      intro: "Saya",
      subtitle: "Mahasiswa Data Science & Data Engineering | Mahasiswa Informatika",
      connect: "Mari terhubung"
    },
    heading: {
      skills: "Teknologi & Stack",
      about: "Tentang",
      education: "Pendidikan",
      projects: "Proyek",
      certificates: "Sertifikat",
      contact: "Hubungi Saya"
    },
    text: {
      skills: "Alat yang saya gunakan untuk proyek data, engineering, dan ML.",
      about1: "Saya merupakan mahasiswa Informatika dengan spesialisasi pada Data Science dan Data Engineering. Minat utama saya adalah membangun sistem pengolahan data yang efisien, terstruktur, dan dapat memberikan insight yang terukur.",
      about2: "Saya telah mengerjakan berbagai proyek yang melibatkan machine learning, klasifikasi data, serta pengembangan aplikasi berbasis web dan mobile. Saya terbiasa bekerja dengan Python, SQL, serta tools analisis data untuk mengubah raw data menjadi solusi yang dapat diimplementasikan.",
      about3: "Fokus saya saat ini adalah memperdalam kemampuan dalam data engineering, optimasi model, serta membangun sistem yang scalable dan production-ready.",
      projects: "Proyek pilihan dalam ML, AI, dan Data Engineering"
    },
    btn: {
      downloadCv: "Unduh CV",
      viewDashboard: "Lihat Trafik Dasbor",
      details: "Detail",
      send: "Kirim Pesan"
    },
    contact: {
      introTitle: "Mari Membangun Sesuatu yang Bermakna",
      introText: "Saya sangat antusias dalam membangun solusi data yang dapat diskala dan terus meningkatkan keterampilan saya dalam Rekayasa Data dan Pembelajaran Mesin. Jika Anda memiliki proyek, peluang kerja, atau tawaran magang, jangan ragu untuk menghubungi saya. Saya senang dapat terhubung dan berdiskusi lebih lanjut.",
      gmail: {
        title: "Tetap Terhubung",
        desc: "Hubungi via email untuk pertanyaan atau kolaborasi.",
        btn: "Buka Gmail"
      },
      instagram: {
        title: "Ikuti Perjalanan Saya",
        desc: "Dapatkan update terbaru tentang postingan dan cerita saya.",
        btn: "Buka Instagram"
      },
      linkedin: {
        title: "Mari Terhubung",
        desc: "Terhubung untuk kolaborasi atau melihat pengalaman profesional saya.",
        btn: "Buka LinkedIn"
      },
      whatsapp: {
        title: "Obrolan Cepat",
        desc: "Chat langsung dengan saya di WhatsApp untuk respons cepat.",
        btn: "Chat di WhatsApp"
      },
      github: {
        title: "Jelajahi Kode",
        desc: "Jelajahi kode sumber untuk semua proyek saya di GitHub.",
        btn: "Buka GitHub"
      }
    },
    project: {
      fraud: {
        title: "Deteksi Penipuan Mobile Banking (XGBoost)",
        desc: "Model machine learning untuk mendeteksi transaksi curang dengan pipeline pra-pemrosesan dan evaluasi metrik performa."
      },
      aiNotebook: {
        title: "Aplikasi Mobile Notebook Berbasis AI",
        desc: "Aplikasi pencatat dengan fitur AI untuk merangkum ide, mengatur catatan, dan meningkatkan produktivitas."
      },
      tomatoMobile: {
        title: "Klasifikasi Daun Tomat (Transfer Learning)",
        desc: "Aplikasi mobile untuk klasifikasi penyakit tomat menggunakan transfer learning, dioptimalkan untuk deployment mobile."
      },
      umkm: {
        title: "Aplikasi Manajemen UMKM",
        desc: "Aplikasi mobile untuk membantu pemilik usaha kecil mengelola data dasar dan alur kerja operasional secara efisien."
      },
      tomatoWeb: {
        title: "Web Klasifikasi Daun Tomat",
        desc: "Aplikasi web untuk klasifikasi daun tomat dengan alur unggah → prediksi → hasil."
      },
      crud: {
        title: "Aplikasi CRUD Siswa (Flutter)",
        desc: "Aplikasi Flutter untuk mengelola data siswa dengan antarmuka bersih dan operasi CRUD menyeluruh."
      },
      dashboard: {
        title: "Dasbor Analitik Portofolio Pribadi",
        desc: "Dasbor analitik real-time untuk melacak keterlibatan portofolio dan aktivitas proyek dengan visualisasi data dinamis."
      }
    },
    hiring: {
      title: "Ringkasan Teknis",
      subtitle: "Ringkasan kualifikasi, fokus, dan nilai tambah saya secara singkat.",
      summaryTitle: "Ringkasan Profesional",
      summaryText: "Mahasiswa Data Science & Engineering dengan fondasi kuat dalam membangun pipeline data yang scalable, proses ETL, dan model machine learning. Mahir dalam Python, SQL, dan teknologi cloud, dengan pengalaman langsung dalam proyek nyata mulai dari deteksi penipuan hingga solusi AI pertanian. Bersemangat mengubah data mentah menjadi wawasan yang dapat ditindaklanjuti dan mengoptimalkan infrastruktur untuk performa dan keandalan.",
      competenciesTitle: "Kompetensi Inti",
      quickFacts: "Fakta Singkat",
      ctaTitle: "Siap merekrut?",
      ctaText: "Unduh CV saya atau jadwalkan obrolan.",
      topProjects: "Proyek Relevan Teratas"
    },
    cert: {
      tag: {
        onlineCourse: "KURSUS ONLINE",
        webinar: "WEBINAR AKADEMIK",
        industry: "ACARA INDUSTRI",
        workshop: "LOKAKARYA",
        practicum: "PRAKTIKUM AKADEMIK"
      }
    },
    ph: {
      name: "Nama Anda",
      email: "Email Anda",
      message: "Pesan Anda"
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const langToggle = document.getElementById('langToggle');
  const langMenu = document.getElementById('langMenu');
  const langOptions = document.querySelectorAll('.lang-option');


  if (!langToggle) return;

  // Store original text content for "Default" mode
  const defaultTextMap = new Map();

  // Initialize default map
  document.querySelectorAll('[data-i18n]').forEach(el => {
    defaultTextMap.set(el, el.textContent.trim());
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    defaultTextMap.set(el, el.getAttribute('placeholder'));
  });

  // Load saved language
  // Load saved language
  const savedLang = localStorage.getItem('siteLang') || 'default';
  updateDropdownUI(savedLang);
  applyLanguage(savedLang);

  // Toggle Menu
  langToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    langMenu.classList.toggle('scale-0');
    langMenu.classList.toggle('opacity-0');
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (!langToggle.contains(e.target) && !langMenu.contains(e.target)) {
      langMenu.classList.add('scale-0');
      langMenu.classList.add('opacity-0');
    }
  });

  // Handle Selection
  langOptions.forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.getAttribute('data-value');
      localStorage.setItem('siteLang', lang);
      updateDropdownUI(lang);
      applyLanguage(lang);

      // Close menu
      langMenu.classList.add('scale-0');
      langMenu.classList.add('opacity-0');
    });
  });

  function updateDropdownUI(lang) {


    // Update active state in dropdown
    langOptions.forEach(btn => {
      const value = btn.getAttribute('data-value');
      const icon = btn.querySelector('.fa-circle');
      const img = btn.querySelector('img');

      if (value === lang) {
        btn.classList.add('text-[#00ff88]', 'bg-[#0b0f14]');
        btn.classList.remove('text-[#94a3b8]');
        if (icon) icon.classList.remove('opacity-0');
        if (img) img.classList.remove('opacity-80');
      } else {
        btn.classList.remove('text-[#00ff88]', 'bg-[#0b0f14]');
        btn.classList.add('text-[#94a3b8]');
        if (icon) icon.classList.add('opacity-0');
        if (img) img.classList.add('opacity-80');
      }
    });
  }

  function applyLanguage(lang) {
    if (lang === 'default') {
      // Restore defaults
      document.querySelectorAll('[data-i18n]').forEach(el => {
        if (defaultTextMap.has(el)) {
          el.textContent = defaultTextMap.get(el);
        }
      });
      document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        if (defaultTextMap.has(el)) {
          el.setAttribute('placeholder', defaultTextMap.get(el));
        }
      });
      return;
    }

    const t = translations[lang];
    if (!t) return;

    // Update text
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const val = key.split('.').reduce((obj, k) => obj && obj[k], t);
      if (val) el.textContent = val;
    });

    // Update placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      const val = key.split('.').reduce((obj, k) => obj && obj[k], t);
      if (val) el.setAttribute('placeholder', val);
    });
  }

  // ===== Theme Switcher Logic =====
  const themeToggle = document.getElementById('themeToggle');
  const themeMenu = document.getElementById('themeMenu');
  const themeOptions = document.querySelectorAll('.theme-option');

  if (themeToggle && themeMenu) {
    // 1. Initialize Theme
    const savedTheme = localStorage.getItem('themePreference') || 'default';
    applyTheme(savedTheme);
    updateThemeUI(savedTheme);

    // 2. Toggle Menu
    themeToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      themeMenu.classList.toggle('scale-0');
      themeMenu.classList.toggle('opacity-0');
      // Close lang menu if open
      if (langMenu && !langMenu.classList.contains('scale-0')) {
        langMenu.classList.add('scale-0');
        langMenu.classList.add('opacity-0');
      }
    });

    // 3. Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!themeToggle.contains(e.target) && !themeMenu.contains(e.target)) {
        themeMenu.classList.add('scale-0');
        themeMenu.classList.add('opacity-0');
      }
    });

    // 4. Handle Selection
    themeOptions.forEach(btn => {
      btn.addEventListener('click', () => {
        const theme = btn.getAttribute('data-theme');
        localStorage.setItem('themePreference', theme);
        applyTheme(theme);
        updateThemeUI(theme);

        // Close menu
        themeMenu.classList.add('scale-0');
        themeMenu.classList.add('opacity-0');
      });
    });

    function applyTheme(theme) {
      if (theme === 'default') {
        document.documentElement.removeAttribute('data-theme');
      } else {
        document.documentElement.setAttribute('data-theme', theme);
      }
    }

    function updateThemeUI(theme) {
      themeOptions.forEach(btn => {
        const value = btn.getAttribute('data-theme');
        const icon = btn.querySelector('i'); // The icon inside the button

        if (value === theme) {
          btn.classList.add('text-[#00ff88]', 'bg-[#0b0f14]');
          btn.classList.remove('text-[#94a3b8]');
          // Optional: Add active indicator/glow if needed, but color change is good
        } else {
          btn.classList.remove('text-[#00ff88]', 'bg-[#0b0f14]');
          btn.classList.add('text-[#94a3b8]');
        }
      });
    }
  }
});

// ===== Fraud Simulator Logic =====
function openSimulator() {
  const modal = document.getElementById('fraudSimModal');
  const content = document.getElementById('fraudSimContent');
  if (modal && content) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    // Animate in
    setTimeout(() => {
      content.classList.remove('scale-95', 'opacity-0');
      content.classList.add('scale-100', 'opacity-100');
    }, 10);
  }
}

function closeSimulator() {
  const modal = document.getElementById('fraudSimModal');
  const content = document.getElementById('fraudSimContent');
  if (modal && content) {
    content.classList.remove('scale-100', 'opacity-100');
    content.classList.add('scale-95', 'opacity-0');
    setTimeout(() => {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
      resetSimulator(); // Reset state on close
    }, 300);
  }
}

function predictFraud() {
  const amount = parseFloat(document.getElementById('fraudAmount').value);
  const type = document.getElementById('fraudTransType').value;
  const time = document.getElementById('fraudTime').value;

  // UI Elements
  const btn = document.getElementById('btnPredict');
  const defaultView = document.getElementById('fraudResultDefault');
  const loadingView = document.getElementById('fraudLoading');
  const resultView = document.getElementById('fraudResultContent');

  if (isNaN(amount)) {
    alert("Please enter a valid transaction amount");
    return;
  }

  // Loading State
  btn.disabled = true;
  btn.style.opacity = '0.7';
  btn.style.cursor = 'not-allowed';

  defaultView.classList.add('hidden');
  resultView.classList.add('hidden');
  loadingView.classList.remove('hidden');
  loadingView.classList.add('flex');

  // Simulate API Delay
  setTimeout(() => {
    loadingView.classList.add('hidden');
    loadingView.classList.remove('flex');
    resultView.classList.remove('hidden');

    // Logic: Rule-based Simulation
    let isFraud = false;
    let confidence = 0;
    let desc = "";

    // Rule: Amount > 5000 AND Transfer AND Night = Fraud
    if (amount > 5000 && type === 'Transfer' && time === 'Night') {
      isFraud = true;
      // Random confidence between 75-95%
      confidence = Math.floor(Math.random() * (95 - 75 + 1)) + 75;
      desc = "Transaction pattern matches known fraud rules (High Amount + Night Time + Transfer Type).";
    } else {
      isFraud = false;
      // Random confidence between 60-85% (Safe score)
      confidence = Math.floor(Math.random() * (85 - 60 + 1)) + 60;
      desc = "Transaction appears normal based on historical patterns and user behavior.";
    }

    // Update UI
    const badge = document.getElementById('fraudBadge');
    const circle = document.getElementById('confidenceCircle');
    const confVal = document.getElementById('confidenceVal');
    const title = document.getElementById('resultTitle');
    const descEl = document.getElementById('resultDesc');

    if (isFraud) {
      badge.className = "inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold tracking-wider mb-6 bg-red-500/20 text-red-500 border border-red-500/30";
      badge.innerHTML = '<i class="fas fa-exclamation-triangle"></i> HIGH RISK DETECTED';

      // Update circle color (red)
      circle.style.stroke = '#ef4444';
      circle.classList.remove('text-green-500');
      circle.classList.add('text-red-500');

      title.textContent = "Potential Fraud Detected";
      title.className = "text-white font-semibold mb-2";
    } else {
      badge.className = "inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold tracking-wider mb-6 bg-green-500/20 text-green-500 border border-green-500/30";
      badge.innerHTML = '<i class="fas fa-shield-alt"></i> TRANSACTION SAFE';

      // Update circle color (green)
      circle.style.stroke = '#00ff88';
      circle.classList.remove('text-red-500');
      circle.classList.add('text-green-500');

      title.textContent = "Transaction Safe";
      title.className = "text-white font-semibold mb-2";
    }

    descEl.textContent = desc;
    confVal.textContent = confidence + "%";

    // Animate Circle
    // Circumference = 2 * PI * 70 ≈ 440
    // Dashoffset = 440 - (440 * percentage / 100)
    // We want to fill the circle proportional to confidence
    const offset = 440 - (440 * confidence / 100);

    // Reset first
    circle.style.strokeDashoffset = 440;

    // Small delay to trigger animation
    setTimeout(() => {
      circle.style.strokeDashoffset = offset;
    }, 50);

    // Reset Button
    btn.disabled = false;
    btn.style.opacity = '1';
    btn.style.cursor = 'pointer';

  }, 1000);
}

function resetSimulator() {
  document.getElementById('fraudAmount').value = '';
  document.getElementById('fraudTransType').value = 'Payment';

  const defaultView = document.getElementById('fraudResultDefault');
  const resultView = document.getElementById('fraudResultContent');
  const loadingView = document.getElementById('fraudLoading');

  if (defaultView) defaultView.classList.remove('hidden');
  if (resultView) resultView.classList.add('hidden');
  if (loadingView) {
    loadingView.classList.add('hidden');
    loadingView.classList.remove('flex');
  }

  // Reset circle animation
  const circle = document.getElementById('confidenceCircle');
  if (circle) circle.style.strokeDashoffset = 440;
}

// ===== Student CRUD Simulator Logic =====
let students = [
  { id: 1, name: "Kevin Chandra Manafe", nim: "202310715315", major: "Teknik Industri" },
  { id: 2, name: "Muhammad Hafiz", nim: "202310715190", major: "Informatika" },
  { id: 3, name: "Hera Abila", nim: "202310717171", major: "Informatika" },
  { id: 4, name: "Budi Santoso", nim: "202310715123", major: "Sistem Informasi" },
  { id: 5, name: "Siti Aminah", nim: "202310715456", major: "Akuntansi" }
];

function openCrudSimulator() {
  const modal = document.getElementById('crudModal');
  const content = document.getElementById('crudContent');
  if (modal && content) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    renderStudents();
    // Animate in
    setTimeout(() => {
      content.classList.remove('scale-95', 'opacity-0');
      content.classList.add('scale-100', 'opacity-100');
    }, 10);
  }
}

function closeCrudSimulator() {
  const modal = document.getElementById('crudModal');
  const content = document.getElementById('crudContent');
  if (modal && content) {
    content.classList.remove('scale-100', 'opacity-100');
    content.classList.add('scale-95', 'opacity-0');
    setTimeout(() => {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }, 300);
  }
}

function renderStudents(filterText = "") {
  const list = document.getElementById('studentList');
  const countSpan = document.getElementById('studentCount');
  if (!list) return;

  list.innerHTML = "";

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(filterText.toLowerCase()) ||
    s.nim.includes(filterText)
  );

  countSpan.textContent = `Total Data: ${filtered.length}`;

  if (filtered.length === 0) {
    list.innerHTML = `
      <div class="text-center py-10 text-[#94a3b8]">
        <i class="fas fa-search text-3xl mb-3 opacity-50"></i>
        <p>Data mahasiswa tidak ditemukan.</p>
      </div>
    `;
    return;
  }

  filtered.forEach(s => {
    const initial = s.name.charAt(0).toUpperCase();
    const item = document.createElement('div');
    item.className = "bg-[#0b0f14] p-4 rounded-xl border border-[#334155] flex items-center justify-between hover:border-[#38bdf8] transition-colors group";
    item.innerHTML = `
      <div class="flex items-center gap-4">
        <div class="w-10 h-10 rounded-full bg-[#38bdf8]/20 text-[#38bdf8] flex items-center justify-center font-bold text-lg border border-[#38bdf8]/30">
          ${initial}
        </div>
        <div>
          <h4 class="text-white font-medium group-hover:text-[#38bdf8] transition-colors">${s.name}</h4>
          <div class="flex flex-col sm:flex-row sm:gap-4 text-xs text-[#94a3b8] mt-0.5">
            <span class="flex items-center gap-1"><i class="fas fa-id-card"></i> ${s.nim}</span>
            <span class="flex items-center gap-1"><i class="fas fa-graduation-cap"></i> ${s.major}</span>
          </div>
        </div>
      </div>
      <div class="relative">
        <button onclick="toggleMenu(${s.id})" class="text-[#94a3b8] hover:text-white p-2 rounded-lg hover:bg-[#334155]/50 transition-colors">
          <i class="fas fa-ellipsis-v"></i>
        </button>
        <div id="menu-${s.id}" class="hidden absolute right-0 top-full mt-2 w-32 bg-[#1e293b] border border-[#334155] rounded-lg shadow-xl z-10 overflow-hidden">
          <button onclick="editStudent(${s.id})" class="w-full text-left px-4 py-2 text-sm text-[#94a3b8] hover:bg-[#334155]/50 hover:text-[#38bdf8] transition-colors border-b border-[#334155]">
            <i class="fas fa-edit mr-2"></i> Edit
          </button>
          <button onclick="deleteStudent(${s.id})" class="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors">
            <i class="fas fa-trash-alt mr-2"></i> Hapus
          </button>
        </div>
      </div>
    `;
    list.appendChild(item);
  });
}

function filterStudents() {
  const query = document.getElementById('crudSearch').value;
  renderStudents(query);
}

function toggleMenu(id) {
  // Close all other menus
  document.querySelectorAll('[id^="menu-"]').forEach(el => {
    if (el.id !== `menu-${id}`) el.classList.add('hidden');
  });
  const menu = document.getElementById(`menu-${id}`);
  menu.classList.toggle('hidden');
}

// Close menus when clicking outside
document.addEventListener('click', function (e) {
  if (!e.target.closest('[id^="menu-"]') && !e.target.closest('button[onclick^="toggleMenu"]')) {
    document.querySelectorAll('[id^="menu-"]').forEach(el => el.classList.add('hidden'));
  }
});

// --- Form Handling ---

function openStudentForm(id = null) {
  const modal = document.getElementById('studentFormModal');
  const content = document.getElementById('studentFormContent');
  const title = document.getElementById('formTitle');
  const form = document.getElementById('studentForm');

  modal.classList.remove('hidden');
  modal.classList.add('flex');
  setTimeout(() => {
    content.classList.remove('scale-95', 'opacity-0');
    content.classList.add('scale-100', 'opacity-100');
  }, 10);

  if (id) {
    const student = students.find(s => s.id === id);
    if (student) {
      title.textContent = "Edit Mahasiswa";
      document.getElementById('studentId').value = student.id;
      document.getElementById('studentName').value = student.name;
      document.getElementById('studentNim').value = student.nim;
      document.getElementById('studentMajor').value = student.major;
    }
  } else {
    title.textContent = "Tambah Mahasiswa";
    form.reset();
    document.getElementById('studentId').value = "";
  }
}

function closeStudentForm() {
  const modal = document.getElementById('studentFormModal');
  const content = document.getElementById('studentFormContent');

  content.classList.remove('scale-100', 'opacity-100');
  content.classList.add('scale-95', 'opacity-0');
  setTimeout(() => {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }, 300);
}

function saveStudent(e) {
  e.preventDefault();
  const idStr = document.getElementById('studentId').value;
  const name = document.getElementById('studentName').value;
  const nim = document.getElementById('studentNim').value;
  const major = document.getElementById('studentMajor').value;

  if (idStr) {
    // Edit
    const id = parseInt(idStr);
    const index = students.findIndex(s => s.id === id);
    if (index !== -1) {
      students[index] = { id, name, nim, major };
    }
  } else {
    // Add
    const newId = students.length > 0 ? Math.max(...students.map(s => s.id)) + 1 : 1;
    students.push({ id: newId, name, nim, major });
  }

  closeStudentForm();
  renderStudents(document.getElementById('crudSearch').value);
}

function editStudent(id) {
  openStudentForm(id);
  // hide menu
  document.getElementById(`menu-${id}`).classList.add('hidden');
}

function deleteStudent(id) {
  if (confirm("Apakah Anda yakin ingin menghapus data mahasiswa ini?")) {
    students = students.filter(s => s.id !== id);
    renderStudents(document.getElementById('crudSearch').value);
  }
}

// ===== Live Demo Feature =====
const demoData = [
  { id: 1, name: "Ayam Geprek Komplit", price: "20.000", img: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=150" },
  { id: 2, name: "Es Teh Manis Jumbo", price: "8.000", img: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=150" },
  { id: 3, name: "Nasi Goreng Spesial", price: "25.000", img: "https://images.unsplash.com/photo-1603133872878-684f5c9322f5?w=150" },
  { id: 4, name: "Dimsum Mentai", price: "18.000", img: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=150" },
  { id: 5, name: "Kopi Susu Gula Aren", price: "15.000", img: "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=150" },
  { id: 6, name: "Roti Bakar Coklat", price: "12.000", img: "https://images.unsplash.com/photo-1588619461332-445105e19199?w=150" }
];

let currentDemoRef = [...demoData]; // Local state for demo manipulation

function openLiveDemo(projectId) {
  const modal = document.getElementById('liveDemoModal');
  const projectTitle = document.getElementById('demoProjectTitle');

  if (projectId === 'umkm-app') {
    projectTitle.textContent = "UMKM Management App Demo";
    renderDemoGrid(demoData);
    renderDemoList(currentDemoRef);
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeLiveDemo() {
  const modal = document.getElementById('liveDemoModal');
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

// Close on backdrop click
document.getElementById('liveDemoModal')?.addEventListener('click', (e) => {
  if (e.target.classList.contains('live-demo-modal')) closeLiveDemo();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && document.getElementById('liveDemoModal')?.classList.contains('open')) {
    closeLiveDemo();
  }
});

// Render Functions
function renderDemoGrid(items) {
  const container = document.getElementById('demoGridContent');
  if (!container) return;

  container.innerHTML = items.map(item => `
    <div class="app-card">
      <img src="${item.img}" class="app-card-img" alt="${item.name}">
      <div class="app-card-title">${item.name}</div>
      <div class="app-card-price">Rp ${item.price}</div>
    </div>
  `).join('');
}

function renderDemoList(items) {
  const container = document.getElementById('demoListContent');
  if (!container) return;

  if (items.length === 0) {
    container.innerHTML = '<div class="text-center text-gray-400 py-10">Belum ada item</div>';
    return;
  }

  container.innerHTML = items.map(item => `
    <div class="app-list-item">
      <img src="${item.img}" class="app-list-img" alt="${item.name}">
      <div class="app-list-info">
        <div class="font-bold text-sm text-gray-800">${item.name}</div>
        <div class="text-xs text-gray-500">Rp ${item.price}</div>
      </div>
      <div class="app-list-actions">
        <button class="action-btn btn-edit"><i class="fas fa-pen"></i></button>
        <button class="action-btn btn-delete" onclick="deleteDemoItem(${item.id})"><i class="fas fa-trash"></i></button>
      </div>
    </div>
  `).join('');
}

// Logic Interactions
function filterDemoItems(query) {
  const filtered = demoData.filter(item => item.name.toLowerCase().includes(query.toLowerCase()));
  renderDemoGrid(filtered);
}

function addDemoItem() {
  const newItem = {
    id: Date.now(),
    name: "Menu Baru " + (currentDemoRef.length + 1),
    price: "10.000",
    img: "https://via.placeholder.com/150/e2e8f0/94a3b8?text=New"
  };
  currentDemoRef.push(newItem);
  renderDemoList(currentDemoRef);

  // Scroll to bottom
  const container = document.getElementById('demoListContent');
  setTimeout(() => container.scrollTop = container.scrollHeight, 10);
}

function deleteDemoItem(id) {
  if (confirm('Hapus item ini dari demo?')) {
    currentDemoRef = currentDemoRef.filter(item => item.id !== id);
    renderDemoList(currentDemoRef);
  }
}

// Mobile Tab Switching
function switchDemoScreen(index) {
  const phones = [document.getElementById('phoneGrid'), document.getElementById('phoneList')];
  const tabs = document.querySelectorAll('.control-tab');

  phones.forEach((p, i) => {
    if (i === index) p.classList.add('active');
    else p.classList.remove('active');
  });

  tabs.forEach((t, i) => {
    if (i === index) t.classList.add('active');
    else t.classList.remove('active');
  });
}
