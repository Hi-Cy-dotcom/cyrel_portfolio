/* ─────────────────────────────────────────────────────────── */
/* script.js — Portfolio interactivity                         */
/* ─────────────────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {

  /* ── BOOKMARK BUTTON ──────────────────────────────────────── */
  const bookmarkBtn = document.getElementById('bookmarkBtn');
  if (bookmarkBtn) {
    let saved = false;
    bookmarkBtn.addEventListener('click', () => {
      saved = !saved;
      bookmarkBtn.style.borderColor = saved ? 'var(--accent)' : '';
      bookmarkBtn.style.color = saved ? 'var(--accent)' : '';
      bookmarkBtn.title = saved ? 'Saved!' : 'Bookmark';
    });
  }

  /* ── DARK / LIGHT MODE TOGGLE ─────────────────────────────── */
  const themeToggle = document.getElementById('themeToggle');
  const html = document.documentElement;

  // Apply saved preference on load
  const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
  html.setAttribute('data-theme', savedTheme);
  if (themeToggle) themeToggle.setAttribute('aria-checked', savedTheme === 'light' ? 'true' : 'false');

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = html.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      localStorage.setItem('portfolio-theme', next);
      themeToggle.setAttribute('aria-checked', next === 'light' ? 'true' : 'false');
    });
  }



  /* ── RECOMMENDATION SLIDER ────────────────────────────────── */
  const slides = document.querySelectorAll('.rec-slide');
  const dots = document.querySelectorAll('.rec-dot');
  let current = 0;
  let autoPlay;

  function showSlide(index) {
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    slides[index].classList.add('active');
    dots[index].classList.add('active');
    current = index;
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      clearInterval(autoPlay);
      showSlide(parseInt(dot.dataset.index));
      startAutoPlay();
    });
  });

  function startAutoPlay() {
    autoPlay = setInterval(() => {
      showSlide((current + 1) % slides.length);
    }, 5000);
  }

  if (slides.length) startAutoPlay();

  /* ── GALLERY SLIDER ───────────────────────────────────────── */
  const track = document.getElementById('galleryTrack');
  const prevBtn = document.getElementById('galleryPrev');
  const nextBtn = document.getElementById('galleryNext');

  if (track && prevBtn && nextBtn) {
    let galleryOffset = 0;
    const itemWidth = () => {
      const first = track.querySelector('.gallery-item');
      if (!first) return 0;
      return first.offsetWidth + 12; // gap
    };

    const maxOffset = () => {
      const items = track.querySelectorAll('.gallery-item');
      const visible = Math.floor(track.offsetWidth / itemWidth()) || 1;
      return Math.max(0, (items.length - visible) * itemWidth());
    };

    function applyOffset() {
      track.style.transform = `translateX(-${galleryOffset}px)`;
      track.style.transition = 'transform 0.4s cubic-bezier(0.4,0,0.2,1)';
    }

    nextBtn.addEventListener('click', () => {
      galleryOffset = Math.min(galleryOffset + itemWidth(), maxOffset());
      applyOffset();
    });

    prevBtn.addEventListener('click', () => {
      galleryOffset = Math.max(galleryOffset - itemWidth(), 0);
      applyOffset();
    });
  }

  /* ── HEADER SHRINK ON SCROLL ──────────────────────────────── */
  const headerWrap = document.querySelector('.site-header-wrap');
  window.addEventListener('scroll', () => {
    headerWrap?.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  /* ── CHAT FAB ─────────────────────────────────────────────── */
  const chatFab = document.getElementById('chatFab');
  if (chatFab) {
    chatFab.addEventListener('click', () => {
      // Scroll to contact section
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    });
    chatFab.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') chatFab.click();
    });
  }

  /* ── SCROLL-REVEAL CARDS ──────────────────────────────────── */
  const cards = document.querySelectorAll('.card, .timeline-item, .project-card');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.07 });

  cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(18px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(card);
  });

  /* ── TECH TAG HOVER RIPPLE ────────────────────────────────── */
  document.querySelectorAll('.tech-tag').forEach(tag => {
    tag.addEventListener('mouseenter', () => {
      tag.style.letterSpacing = '0.5px';
    });
    tag.addEventListener('mouseleave', () => {
      tag.style.letterSpacing = '0px';
    });
  });

  /* ── TYPING ANIMATION ON PROFILE TITLE ───────────────────── */
  const titleEl = document.querySelector('.profile-title');
  if (titleEl) {
    const text = titleEl.textContent;
    titleEl.textContent = '';
    let i = 0;
    const type = () => {
      if (i < text.length) {
        titleEl.textContent += text[i++];
        setTimeout(type, 38);
      }
    };
    setTimeout(type, 600);
  }

  /* ── CERTIFICATE MODAL ────────────────────────────────────── */
  const certModal            = document.getElementById('certModal');
  const certModalImg         = document.getElementById('certModalImg');
  const certModalTitle       = document.getElementById('certModalTitle');
  const certModalClose       = document.getElementById('certModalClose');
  const certModalPlaceholder = document.getElementById('certModalPlaceholder');

  function openCertModal(imgSrc, title) {
    certModalTitle.textContent = title;
    certModalImg.classList.remove('loaded');
    certModalPlaceholder.style.display = 'none';

    certModalImg.onload = () => {
      certModalImg.classList.add('loaded');
      certModalPlaceholder.style.display = 'none';
    };
    certModalImg.onerror = () => {
      certModalImg.classList.remove('loaded');
      certModalPlaceholder.style.display = 'flex';
    };

    certModalImg.src = imgSrc;
    certModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeCertModal() {
    certModal.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => { certModalImg.src = ''; }, 300);
  }

  document.querySelectorAll('.cert-clickable').forEach(item => {
    item.addEventListener('click', () => {
      const img   = item.dataset.certImg;
      const title = item.dataset.certTitle || item.querySelector('.cert-name')?.textContent || 'Certificate';
      openCertModal(img, title);
    });
  });

  if (certModalClose) certModalClose.addEventListener('click', closeCertModal);

  certModal?.addEventListener('click', e => {
    if (e.target === certModal) closeCertModal();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && certModal?.classList.contains('open')) closeCertModal();
  });

});