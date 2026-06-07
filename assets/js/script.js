'use strict';

/* ================= SIDEBAR TOGGLE ================= */
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

sidebarBtn.addEventListener("click", () => {
  sidebar.classList.toggle("active");
});

/* ================= PAGE NAVIGATION ================= */
const navLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("article[data-page]");

navLinks.forEach(link => {
  link.addEventListener("click", () => {
    const targetPage = link.dataset.page;

    pages.forEach(page => {
      page.classList.remove("active");
      if (page.dataset.page === targetPage) {
        page.classList.add("active");
        setTimeout(() => triggerReveal(), 100);
      }
    });

    navLinks.forEach(btn => btn.classList.remove("active"));
    link.classList.add("active");

    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});

/* ================= PROJECT FILTER ================= */
const filterBtns = document.querySelectorAll("[data-filter-btn]");
const projectItems = document.querySelectorAll("[data-filter-item]");

filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    filterBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const filterValue = btn.dataset.filterBtn;

    projectItems.forEach(item => {
      const category = item.dataset.category;
      if (filterValue === "all" || category === filterValue) {
        item.style.animation = "none";
        item.offsetHeight;
        item.style.animation = "";
        item.classList.add("active");
        item.style.display = "block";
      } else {
        item.classList.remove("active");
        item.style.display = "none";
      }
    });
  });
});

/* ================= TYPING EFFECT ================= */
function initTypingEffect() {
  const titleEl = document.querySelector(".title");
  if (!titleEl) return;

  const titles = [
    "DevOps / AWS Cloud Engineer",
    "CI/CD Pipeline Builder",
    "Infrastructure as Code",
    "Cloud Automation Expert"
  ];

  let currentIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function type() {
    const current = titles[currentIndex];

    if (!isDeleting) {
      titleEl.textContent = current.substring(0, charIndex + 1);
      charIndex++;
      if (charIndex === current.length) {
        isDeleting = true;
        setTimeout(type, 1800);
        return;
      }
    } else {
      titleEl.textContent = current.substring(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        isDeleting = false;
        currentIndex = (currentIndex + 1) % titles.length;
      }
    }

    setTimeout(type, isDeleting ? 60 : 90);
  }

  type();
}

/* ================= SCROLL REVEAL ================= */
function triggerReveal() {
  const reveals = document.querySelectorAll(".reveal:not(.visible)");
  reveals.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 60) {
      el.classList.add("visible");
    }
  });
}

function addRevealClasses() {
  const targets = document.querySelectorAll(
    ".service-item, .certification-item, .blog-post-item, .project-item, .about-text p, .contact-item"
  );
  targets.forEach((el, i) => {
    el.classList.add("reveal");
    el.style.transitionDelay = `${(i % 6) * 0.08}s`;
  });
}

/* ================= ANIMATED SKILL BARS ================= */
function injectSkillBars() {
  const aboutPage = document.querySelector('[data-page="about"]');
  if (!aboutPage || document.querySelector(".skills-section")) return;

  const skills = [
    { name: "AWS Cloud Services", level: 82 },
    { name: "Docker & Containers", level: 78 },
    { name: "Terraform / IaC", level: 75 },
    { name: "Jenkins / CI-CD", level: 80 },
    { name: "Linux & Bash", level: 85 },
    { name: "Git & GitHub", level: 88 },
  ];

  const skillsHTML = `
    <section class="skills-section reveal">
      <h3 class="h3 service-title">Technical Skills</h3>
      <ul class="skills-list">
        ${skills.map(s => `
          <li class="skill-item">
            <div class="skill-header">
              <span class="skill-name">${s.name}</span>
              <span class="skill-percent">${s.level}%</span>
            </div>
            <div class="skill-bar">
              <div class="skill-fill" data-level="${s.level}"></div>
            </div>
          </li>
        `).join("")}
      </ul>
    </section>
  `;

  const certSection = aboutPage.querySelector(".certifications");
  if (certSection) {
    certSection.insertAdjacentHTML("beforebegin", skillsHTML);
  }
}

function animateSkillBars() {
  const fills = document.querySelectorAll(".skill-fill:not(.animated)");
  fills.forEach(fill => {
    const rect = fill.getBoundingClientRect();
    if (rect.top < window.innerHeight - 40) {
      fill.classList.add("animated");
      fill.style.width = fill.dataset.level + "%";
    }
  });
}

/* ================= PARTICLE CANVAS BACKGROUND ================= */
function initParticles() {
  const canvas = document.createElement("canvas");
  canvas.id = "particle-canvas";
  canvas.style.cssText = `
    position: fixed;
    top: 0; left: 0;
    width: 100%; height: 100%;
    pointer-events: none;
    z-index: 0;
    opacity: 0.35;
  `;
  document.body.prepend(canvas);

  const ctx = canvas.getContext("2d");
  let W, H, particles;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.r = Math.random() * 1.5 + 0.4;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.alpha = Math.random() * 0.6 + 0.2;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(45, 100%, 72%, ${this.alpha})`;
      ctx.fill();
    }
  }

  function initParticleList() {
    const count = Math.min(Math.floor((W * H) / 12000), 90);
    particles = Array.from({ length: count }, () => new Particle());
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `hsla(45, 100%, 72%, ${0.12 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    drawConnections();
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }

  resize();
  initParticleList();
  loop();

  window.addEventListener("resize", () => {
    resize();
    initParticleList();
  });
}

/* ================= CURSOR GLOW ================= */
function initCursorGlow() {
  if (window.matchMedia("(hover: none)").matches) return;

  const glow = document.createElement("div");
  glow.className = "cursor-glow";
  document.body.appendChild(glow);

  let mx = 0, my = 0, cx = 0, cy = 0;

  document.addEventListener("mousemove", e => {
    mx = e.clientX;
    my = e.clientY;
  });

  function animate() {
    cx += (mx - cx) * 0.1;
    cy += (my - cy) * 0.1;
    glow.style.transform = `translate(${cx - 150}px, ${cy - 150}px)`;
    requestAnimationFrame(animate);
  }
  animate();
}

/* ================= COUNTER ANIMATION ================= */
function initCounters() {
  const aboutPage = document.querySelector('[data-page="about"]');
  if (!aboutPage || document.querySelector(".stats-bar")) return;

  const stats = [
    { label: "Projects", value: 8, suffix: "+" },
    { label: "Certifications", value: 2, suffix: "" },
    { label: "Cloud Services", value: 15, suffix: "+" },
    { label: "Tools Mastered", value: 12, suffix: "+" }
  ];

  const statsHTML = `
    <div class="stats-bar reveal">
      ${stats.map(s => `
        <div class="stat-item">
          <span class="stat-number" data-target="${s.value}" data-suffix="${s.suffix}">0${s.suffix}</span>
          <span class="stat-label">${s.label}</span>
        </div>
      `).join("")}
    </div>
  `;

  const aboutText = aboutPage.querySelector(".about-text");
  if (aboutText) aboutText.insertAdjacentHTML("afterend", statsHTML);
}

function animateCounters() {
  const counters = document.querySelectorAll(".stat-number:not(.counted)");
  counters.forEach(counter => {
    const rect = counter.getBoundingClientRect();
    if (rect.top < window.innerHeight - 40) {
      counter.classList.add("counted");
      const target = parseInt(counter.dataset.target);
      const suffix = counter.dataset.suffix;
      let current = 0;
      const step = Math.ceil(target / 30);
      const interval = setInterval(() => {
        current = Math.min(current + step, target);
        counter.textContent = current + suffix;
        if (current >= target) clearInterval(interval);
      }, 40);
    }
  });
}

/* ================= NAV GLOW ================= */
function addNavGlowEffect() {
  navLinks.forEach(link => {
    link.addEventListener("mouseenter", function () {
      this.style.textShadow = "0 0 12px hsla(45,100%,72%,0.6)";
    });
    link.addEventListener("mouseleave", function () {
      this.style.textShadow = "";
    });
  });
}

/* ================= PROJECT CARD TILT ================= */
function initCardTilt() {
  document.addEventListener("mousemove", e => {
    document.querySelectorAll(".project-item.active").forEach(card => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / rect.width;
      const dy = (e.clientY - cy) / rect.height;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 0.8) {
        card.style.transform = `perspective(600px) rotateY(${dx * 6}deg) rotateX(${-dy * 6}deg) translateY(-4px)`;
      } else {
        card.style.transform = "";
      }
    });
  });
}

/* ================= TOAST NOTIFICATION ================= */
function showToast(msg) {
  const existing = document.querySelector(".toast-notification");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.className = "toast-notification";
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add("show"), 10);
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}

/* ================= NAVBAR SCROLL EFFECT ================= */
function initNavbarScrollEffect() {
  const navbar = document.querySelector(".navbar");
  if (!navbar) return;
  window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 30);
  }, { passive: true });
}

/* ================= PROJECT MODAL ================= */
function initProjectModal() {
  const overlay = document.getElementById("projectModalOverlay");
  const closeBtn = document.getElementById("modalCloseBtn");
  const modalImg = document.getElementById("modalImg");
  const modalTitle = document.getElementById("modalTitle");
  const modalDesc = document.getElementById("modalDesc");
  const modalTags = document.getElementById("modalTags");
  const modalGithubBtn = document.getElementById("modalGithubBtn");
  const modalWipBadge = document.getElementById("modalWipBadge");

  if (!overlay) return;

  // Open modal on project card click
  document.querySelectorAll(".project-item").forEach(card => {
    card.addEventListener("click", () => {
      const title = card.dataset.title;
      const desc = card.dataset.desc;
      const tags = card.dataset.tags;
      const github = card.dataset.github;
      const demo = card.dataset.demo;
      const img = card.querySelector("img");
      const isWip = card.querySelector(".wip-badge");

      // Populate modal
      modalTitle.textContent = title;
      modalDesc.textContent = desc;
      modalImg.src = img ? img.src : "";
      modalImg.alt = title;

      // Tags
      modalTags.innerHTML = tags
        .split(",")
        .map(t => `<span class="modal-tag">${t.trim()}</span>`)
        .join("");

      // GitHub button
      if (github) {
        modalGithubBtn.href = github;
        modalGithubBtn.style.display = "inline-flex";
      } else {
        modalGithubBtn.style.display = "none";
      }

      

      // WIP badge
      modalWipBadge.style.display = isWip ? "block" : "none";

      // Open
      overlay.classList.add("active");
      document.body.style.overflow = "hidden";
    });
  });

  // Close on button
  closeBtn.addEventListener("click", closeModal);

  // Close on overlay click
  overlay.addEventListener("click", e => {
    if (e.target === overlay) closeModal();
  });

  // Close on Escape key
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeModal();
  });

  function closeModal() {
    overlay.classList.remove("active");
    document.body.style.overflow = "";
  }
}

/* ================= LOADING SCREEN ================= */
function initLoadingScreen() {
  const loader = document.getElementById("loaderScreen");
  const bar = document.getElementById("loaderBar");
  if (!loader) return;

  // Fast progress bar
  setTimeout(() => { bar.style.width = "80%"; }, 50);
  setTimeout(() => { bar.style.width = "100%"; }, 350);

  // Hide loader after 0.6s
  setTimeout(() => {
    loader.classList.add("hidden");
  }, 600);
}

//* ================= INIT ================= */
window.addEventListener("DOMContentLoaded", () => {
  initLoadingScreen();
  initParticles();
  initCursorGlow();
  initTypingEffect();
  addRevealClasses();
  triggerReveal();
  injectSkillBars();
  initCounters();
  addNavGlowEffect();
  initCardTilt();
  initNavbarScrollEffect();
  initBackToTop();
  initSmoothPageTransitions();
  initProjectModal();

  window.addEventListener("scroll", () => {
    triggerReveal();
    animateSkillBars();
    animateCounters();
  }, { passive: true });

  setTimeout(() => {
    triggerReveal();
    animateSkillBars();
    animateCounters();
  }, 300);

  document.querySelectorAll('.contact-link[href^="mailto"]').forEach(link => {
    link.addEventListener("click", () => showToast("📧 Opening your email client!"));
  });



  // ===== CONTACT FORM =====
  const contactForm = document.querySelector(".contact-form");
  const formSuccess = document.getElementById("formSuccess");

  if (contactForm) {
    contactForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      const data = new FormData(contactForm);

      const response = await fetch(contactForm.action, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" }
      });

      if (response.ok) {
        contactForm.reset();
        formSuccess.style.display = "block";
        setTimeout(() => formSuccess.style.display = "none", 5000);
      } else {
        alert("Something went wrong. Please try again.");
      }
    });
  }

});
/* ================= BACK TO TOP ================= */
function initBackToTop() {
  const btn = document.getElementById("backToTop");
  if (!btn) return;

  window.addEventListener("scroll", () => {
    btn.classList.toggle("visible", window.scrollY > 300);
  }, { passive: true });

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* ================= SMOOTH PAGE TRANSITIONS ================= */
function initSmoothPageTransitions() {
  const navLinks = document.querySelectorAll("[data-nav-link]");
  const pages = document.querySelectorAll("article[data-page]");

  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      const targetPage = link.dataset.page;
      const currentPage = document.querySelector("article.active");

      if (currentPage && currentPage.dataset.page !== targetPage) {
        // Exit animation on current page
        currentPage.classList.add("page-exit");

        setTimeout(() => {
          currentPage.classList.remove("active", "page-exit");

          // Enter animation on new page
          pages.forEach(page => {
            if (page.dataset.page === targetPage) {
              page.classList.add("active");
            }
          });

          setTimeout(() => triggerReveal(), 100);
        }, 180); // matches pageExit duration

      }
    });
  });
}