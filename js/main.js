/* ============================================================
   STACKLY — MAIN JAVASCRIPT
   Handles: Loader, Cursor, Navbar, Scroll, Counters,
            Particles, FAQ, Theme, Parallax, Filters
   ============================================================ */

(function () {
  'use strict';

  /* ── Loader ── */
  const loader = document.getElementById('loader');
  if (loader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        loader.classList.add('hidden');
        document.body.classList.remove('loading');
      }, 2000);
    });
  }

  /* ── Custom Cursor ── */
  const cursor = document.querySelector('.cursor');
  const follower = document.querySelector('.cursor-follower');
  if (cursor && follower && window.innerWidth > 768) {
    let mouseX = 0, mouseY = 0, follX = 0, follY = 0;
    document.addEventListener('mousemove', e => {
      mouseX = e.clientX; mouseY = e.clientY;
      cursor.style.left = mouseX + 'px';
      cursor.style.top = mouseY + 'px';
    });
    function animFollower() {
      follX += (mouseX - follX) * 0.12;
      follY += (mouseY - follY) * 0.12;
      follower.style.left = follX + 'px';
      follower.style.top = follY + 'px';
      requestAnimationFrame(animFollower);
    }
    animFollower();
    document.querySelectorAll('a, button, .btn, .card, .service-card, .dish-card, .chef-card, .faq-question, .filter-btn, .sig-filter, .sig-card, .sig-order-btn, .sig-quick-btn, .gh-cat-card, .gh-badge, .gh-collage-img, .q-card, .ch-trust-badge, .ch-collage-img, .float-btn, .scroll-btn, .masonry-item').forEach(el => {
      el.addEventListener('mouseenter', () => { cursor.classList.add('hover'); follower.classList.add('hover'); });
      el.addEventListener('mouseleave', () => { cursor.classList.remove('hover'); follower.classList.remove('hover'); });
    });
  }

  /* ── Scroll Progress ── */
  const progress = document.getElementById('scroll-progress');
  if (progress) {
    window.addEventListener('scroll', () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const pct = (window.scrollY / total) * 100;
      progress.style.width = pct + '%';
    }, { passive: true });
  }

  /* ── Navbar ── */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });

    // Active link
    const links = navbar.querySelectorAll('.nav-links a');
    const current = window.location.pathname.split('/').pop() || 'index.html';
    links.forEach(link => {
      const href = link.getAttribute('href');
      if (href) {
        const baseHref = href.split('?')[0].split('#')[0];
        if (baseHref === current || (current === '' && baseHref === 'index.html')) {
          link.classList.add('active');
          // If child of a dropdown, also highlight the parent dropdown-toggle
          const dropdown = link.closest('.dropdown');
          if (dropdown) {
            const toggle = dropdown.querySelector('.dropdown-toggle');
            if (toggle) toggle.classList.add('active');
          }
        }
      }
    });
  }

  /* ── Intercept dropdown clicks: hash-based filter + same-page scroll ── */
  document.querySelectorAll('.dropdown-menu a').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (!href) return;

      const currentPath = window.location.pathname.split('/').pop() || 'index.html';
      const targetBase  = href.split('#')[0].split('?')[0];
      const hash        = href.includes('#') ? href.substring(href.indexOf('#')) : '';

      // ── Case 1: hash-based menu filter (menu.html#filter-starters etc.) ──
      if (hash.startsWith('#filter-')) {
        const filterVal = hash.replace('#filter-', '');
        // Same page — apply filter immediately without reload
        if (targetBase === '' || targetBase === currentPath) {
          e.preventDefault();
          const sigFilters  = document.querySelectorAll('.sig-filter');
          const matchingBtn = Array.from(sigFilters).find(btn => btn.dataset.filter === filterVal);
          if (matchingBtn) {
            matchingBtn.click();
            window.history.pushState(null, '', href);
            // Scroll to the filter pills row so user can see which is active
            const pillsRow = document.querySelector('.sig-filters');
            if (pillsRow) setTimeout(() => pillsRow.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
          }
        }
        // Different page — allow navigation, hash reader fires on load
      }

      // ── Case 2: anchor scroll on same page ──
      else if (hash && (targetBase === '' || targetBase === currentPath)) {
        e.preventDefault();
        try {
          const targetEl = document.querySelector(hash);
          if (targetEl) {
            targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            window.history.pushState(null, '', href);
          }
        } catch (err) {
          console.warn('Invalid scroll target:', hash);
        }
      }
    });
  });

  /* ── Mobile Menu ── */
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ── Dark Mode Toggle ── */
  const toggleBtn = document.querySelector('.theme-toggle');
  const savedTheme = localStorage.getItem('stackly-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateToggleIcon(savedTheme);
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('stackly-theme', next);
      updateToggleIcon(next);
    });
  }
  function updateToggleIcon(theme) {
    if (toggleBtn) toggleBtn.innerHTML = theme === 'dark' ? '☀️' : '🌙';
  }

  /* ── Particles ── */
  const particleContainer = document.querySelector('.hero-particles');
  if (particleContainer) {
    for (let i = 0; i < 25; i++) {
      const p = document.createElement('div');
      p.classList.add('particle');
      const size = Math.random() * 8 + 2;
      p.style.cssText = `
        width: ${size}px; height: ${size}px;
        left: ${Math.random() * 100}%;
        bottom: -20px;
        animation-duration: ${Math.random() * 15 + 10}s;
        animation-delay: ${Math.random() * 10}s;
      `;
      particleContainer.appendChild(p);
    }
    // Light rays
    for (let i = 0; i < 5; i++) {
      const ray = document.createElement('div');
      ray.classList.add('light-ray');
      ray.style.cssText = `
        left: ${15 + i * 18}%;
        top: 0;
        animation-delay: ${i * 0.8}s;
        opacity: ${0.3 + i * 0.05};
        transform: rotate(${-10 + i * 5}deg);
      `;
      particleContainer.appendChild(ray);
    }
  }

  /* ── Scroll Reveal ── */
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  if (revealEls.length) {
    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(el => revealObs.observe(el));
  }

  /* ── Animated Counters ── */
  function animateCounter(el) {
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const target   = parseFloat(el.dataset.target || el.textContent);
    const suffix   = el.dataset.suffix || '';
    const duration = 2000;
    const startTime = performance.now();
    function update(now) {
      const elapsed  = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 4); // ease-out quart
      const current  = eased * target;
      el.textContent = (decimals > 0 ? current.toFixed(decimals) : Math.floor(current)) + suffix;
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = (decimals > 0 ? target.toFixed(decimals) : target) + suffix;
    }
    requestAnimationFrame(update);
  }

  const counters = document.querySelectorAll('.counter');
  if (counters.length) {
    const counterObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.counted) {
          entry.target.dataset.counted = '1';
          animateCounter(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => counterObs.observe(c));
  }

  /* ── FAQ Accordion ── */
  document.querySelectorAll('.faq-item').forEach(item => {
    const btn = item.querySelector('.faq-question');
    if (btn) {
      btn.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item.open').forEach(o => o.classList.remove('open'));
        if (!isOpen) item.classList.add('open');
      });
    }
  });

  /* ── Horizontal Dish Scroll ── */
  const dishScroll = document.querySelector('.dishes-scroll');
  const scrollLeft = document.getElementById('scroll-left');
  const scrollRight = document.getElementById('scroll-right');
  if (dishScroll && scrollLeft && scrollRight) {
    scrollLeft.addEventListener('click', () => { dishScroll.scrollBy({ left: -320, behavior: 'smooth' }); });
    scrollRight.addEventListener('click', () => { dishScroll.scrollBy({ left: 320, behavior: 'smooth' }); });
  }

  /* ── Menu Filter ── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const menuCards = document.querySelectorAll('.menu-card');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.filter;
      menuCards.forEach(card => {
        const match = cat === 'all' || card.dataset.category === cat;
        card.style.display = match ? '' : 'none';
        if (match) {
          card.style.animation = 'scaleIn 0.4s ease';
          setTimeout(() => card.style.animation = '', 400);
        }
      });
    });
  });

  /* ── Signature Dishes Filter ── */
  const sigFilters   = document.querySelectorAll('.sig-filter');
  const sigCards     = document.querySelectorAll('.sig-card');
  const sigNoResults = document.getElementById('sig-no-results');

  if (sigFilters.length && sigCards.length) {

    function filterSigCards(category) {
      let visible = 0;

      sigCards.forEach((card, idx) => {
        const match = category === 'all' || card.dataset.category === category;

        if (match) {
          // Reset first so re-triggering re-animates
          card.style.opacity    = '0';
          card.style.transform  = 'translateY(20px) scale(0.97)';
          card.style.display    = 'flex';

          // Stagger each visible card slightly
          const delay = visible * 60;
          setTimeout(() => {
            card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            card.style.opacity    = '1';
            card.style.transform  = 'translateY(0) scale(1)';
          }, delay);

          visible++;
        } else {
          card.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
          card.style.opacity    = '0';
          card.style.transform  = 'translateY(10px) scale(0.97)';
          setTimeout(() => { card.style.display = 'none'; }, 260);
        }
      });

      // Show / hide no-results message
      if (sigNoResults) {
        sigNoResults.style.display = visible === 0 ? 'block' : 'none';
      }
    }

    sigFilters.forEach(btn => {
      btn.addEventListener('click', () => {
        // Update active state
        sigFilters.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Run filter
        const category = btn.dataset.filter || 'all';
        filterSigCards(category);
      });
    });

    // Make sure all cards are visible on first load
    sigCards.forEach(card => {
      card.style.display    = 'flex';
      card.style.opacity    = '1';
      card.style.transform  = 'none';
    });

    // ── Hash-based filter reader on page load (works with file:// protocol) ──
    // Reads: menu.html#filter-starters, menu.html#filter-main, etc.
    function applyHashFilter() {
      const hashParam = window.location.hash;
      if (hashParam && hashParam.startsWith('#filter-')) {
        const filterVal   = hashParam.replace('#filter-', '');
        const matchingBtn = Array.from(sigFilters).find(btn => btn.dataset.filter === filterVal);
        if (matchingBtn) {
          matchingBtn.click();
          // Scroll to pills row so the active pill is clearly visible
          const pillsRow = document.querySelector('.sig-filters');
          if (pillsRow) {
            setTimeout(() => pillsRow.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
          }
        }
      }
    }
    // Run after loader has faded (300ms buffer)
    setTimeout(applyHashFilter, 300);
    // Also listen for back/forward navigation
    window.addEventListener('hashchange', applyHashFilter);
  }

  /* ── Gallery Lightbox ── */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');
  document.querySelectorAll('.masonry-item').forEach(item => {
    item.addEventListener('click', () => {
      if (lightbox && lightboxImg) {
        lightboxImg.src = item.querySelector('img').src;
        lightbox.classList.add('open');
      }
    });
  });
  if (lightboxClose) lightboxClose.addEventListener('click', () => lightbox.classList.remove('open'));
  if (lightbox) lightbox.addEventListener('click', e => { if (e.target === lightbox) lightbox.classList.remove('open'); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && lightbox) lightbox.classList.remove('open'); });

  /* ── Scroll to Top ── */
  const floatTop = document.querySelector('.float-top');
  if (floatTop) {
    window.addEventListener('scroll', () => {
      floatTop.classList.toggle('show', window.scrollY > 400);
    }, { passive: true });
    floatTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ── Parallax Hero ── */
  const heroSection = document.getElementById('hero');
  if (heroSection) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      const heroLeft = heroSection.querySelector('.hero-left');
      const heroRight = heroSection.querySelector('.hero-right');
      if (heroLeft) heroLeft.style.transform = `translateY(${y * 0.08}px)`;
      if (heroRight) heroRight.style.transform = `translateY(${y * 0.05}px)`;
    }, { passive: true });

    // Mouse parallax
    heroSection.addEventListener('mousemove', e => {
      const rect = heroSection.getBoundingClientRect();
      const cx = rect.width / 2, cy = rect.height / 2;
      const dx = (e.clientX - cx) / cx;
      const dy = (e.clientY - cy) / cy;
      const badges = heroSection.querySelectorAll('.hero-badge');
      badges.forEach((b, i) => {
        const factor = (i + 1) * 8;
        b.style.transform = `translate(${dx * factor}px, ${dy * factor}px)`;
      });
    });
  }

  /* ── Smooth Scroll for anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (href && href !== '#' && href.startsWith('#')) {
        try {
          const target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        } catch (err) {
          console.warn("Invalid smooth scroll target selector:", href);
        }
      }
    });
  });

  /* ── Contact Form Validation ── */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    const submitBtn = contactForm.querySelector('.btn-auth') || contactForm.querySelector('[type="submit"]') || contactForm.querySelector('[type="button"]');
    if (submitBtn) {
      submitBtn.addEventListener('click', e => {
        e.preventDefault();
        const btn = submitBtn;
        const nameInput = contactForm.querySelector('#name');
        const emailInput = contactForm.querySelector('#email');
        const name = nameInput ? nameInput.value.trim() : '';
        const email = emailInput ? emailInput.value.trim() : '';
        const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!name) { showFormMsg('Please enter your name', 'error'); return; }
        if (!emailReg.test(email)) { showFormMsg('Please enter a valid email', 'error'); return; }
        btn.textContent = 'Sending…';
        btn.disabled = true;
        setTimeout(() => {
          btn.textContent = '✓ Message Sent!';
          btn.style.background = '#2ecc71';
          contactForm.reset();
          setTimeout(() => { btn.textContent = 'Send Message'; btn.style.background = ''; btn.disabled = false; }, 3000);
        }, 1500);
      });
    }
  }
  function showFormMsg(msg, type) {
    const el = document.createElement('div');
    el.style.cssText = `position:fixed;top:100px;right:24px;padding:14px 24px;border-radius:8px;font-size:.9rem;z-index:9999;animation:fadeInUp .4s ease;background:${type==='error'?'#e74c3c':'#2ecc71'};color:#fff;box-shadow:0 4px 20px rgba(0,0,0,.2)`;
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3000);
  }

  /* ── Newsletter Form ── */
  document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const input = form.querySelector('input');
      const btn = form.querySelector('button');
      if (!input.value) return;
      btn.textContent = '✓';
      input.value = '';
      setTimeout(() => btn.textContent = 'Join', 2000);
    });
  });

  /* ── Testimonial card tilt ── */
  document.querySelectorAll('.testimonial-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-12px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });

  /* ── About Page Hero Parallax ── */
  const aboutHero = document.querySelector('.about-page-hero');
  if (aboutHero) {
    const collageCards = aboutHero.querySelectorAll('.collage-card');
    
    // Mouse movement parallax for desktop/pointer devices
    if (window.matchMedia('(pointer: fine)').matches) {
      aboutHero.addEventListener('mousemove', e => {
        const rect = aboutHero.getBoundingClientRect();
        // Calculate cursor position relative to the center of the hero section
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) / (rect.width / 2);
        const dy = (e.clientY - cy) / (rect.height / 2);
        
        collageCards.forEach(card => {
          const depth = parseFloat(card.dataset.depth) || 0.2;
          const moveX = dx * depth * 45; // Max translation offset (45px)
          const moveY = dy * depth * 45;
          
          card.style.setProperty('--parallax-x', `${moveX}px`);
          card.style.setProperty('--parallax-y', `${moveY}px`);
        });
      });
      
      aboutHero.addEventListener('mouseleave', () => {
        collageCards.forEach(card => {
          card.style.setProperty('--parallax-x', `0px`);
          card.style.setProperty('--parallax-y', `0px`);
        });
      });
    }
  }

  /* ── Timeline Scroll Progress ── */
  const timeline = document.querySelector('.timeline');
  const progressLine = document.querySelector('.timeline-progress-line');
  if (timeline && progressLine) {
    function updateTimelineProgress() {
      const rect = timeline.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Starts drawing when timeline top reaches 65% of viewport
      const triggerVal = windowHeight * 0.65;
      const relativeTop = rect.top - triggerVal;
      const totalHeight = rect.height;
      
      let progress = 0;
      if (relativeTop < 0) {
        // totalHeight - 100 ensures the line draws past the final dot early enough
        progress = Math.min(Math.abs(relativeTop) / (totalHeight - 100), 1);
      }
      
      progressLine.style.height = `${progress * 100}%`;
    }
    
    window.addEventListener('scroll', updateTimelineProgress, { passive: true });
    window.addEventListener('resize', updateTimelineProgress);
    updateTimelineProgress();
  }

  /* ── Timeline Card Interactions (3D Tilt & Spotlight Hover) ── */
  const timelineCards = document.querySelectorAll('.timeline-content');
  if (timelineCards.length && window.matchMedia('(pointer: fine)').matches) {
    timelineCards.forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
        
        const tiltX = (x / rect.width - 0.5) * 8;
        const tiltY = (y / rect.height - 0.5) * -8;
        
        const item = card.closest('.timeline-item');
        let translateX = 0;
        if (item) {
          const itemsArray = Array.from(item.parentNode.children);
          const index = itemsArray.indexOf(item);
          const isLeftAlign = index % 2 !== 0;
          translateX = isLeftAlign ? -6 : 6;
        }
        
        card.style.transform = `perspective(1000px) rotateX(${tiltY}deg) rotateY(${tiltX}deg) translate3d(${translateX}px, -6px, 0)`;
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  /* ── Menu Hero Collage Parallax ── */
  const menuHero    = document.getElementById('menu-hero');
  const mhCollage   = document.getElementById('mh-collage');
  if (menuHero && mhCollage && window.matchMedia('(pointer: fine)').matches) {
    const mhImgs = mhCollage.querySelectorAll('.mh-collage-img');

    menuHero.addEventListener('mousemove', e => {
      const rect   = menuHero.getBoundingClientRect();
      const cx     = rect.width  / 2;
      const cy     = rect.height / 2;
      const dx     = (e.clientX - rect.left - cx) / cx; // -1 … +1
      const dy     = (e.clientY - rect.top  - cy) / cy;

      mhImgs.forEach(img => {
        const depth  = parseFloat(img.dataset.depth || 1);
        const mx     = dx * depth * 14;
        const my     = dy * depth * 10;
        img.style.transform = `translateX(${mx}px) translateY(${my}px)`;
      });
    });

    menuHero.addEventListener('mouseleave', () => {
      mhImgs.forEach(img => {
        img.style.transform = '';
      });
    });
  }

})();

