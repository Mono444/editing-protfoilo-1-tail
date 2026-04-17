document.addEventListener('DOMContentLoaded', () => {

  // NAVBAR SCROLL EFFECT
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  // HAMBURGER MENU
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const spans = hamburger.querySelectorAll('span');
    spans[0].style.transform = navLinks.classList.contains('open') ? 'rotate(45deg) translate(5px,5px)' : '';
    spans[1].style.opacity = navLinks.classList.contains('open') ? '0' : '1';
    spans[2].style.transform = navLinks.classList.contains('open') ? 'rotate(-45deg) translate(5px,-5px)' : '';
  });

  // CLOSE MENU ON LINK CLICK
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = '1'; });
    });
  });

  // SCROLL REVEAL ANIMATIONS
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // ANIMATED COUNTERS
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.dataset.count);
        const isDecimal = el.dataset.decimal === 'true';
        const duration = 2000;
        const start = performance.now();

        const animate = (now) => {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = eased * target;
          el.textContent = isDecimal ? current.toFixed(1) : Math.floor(current) + '+';
          if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-number[data-count]').forEach(el => counterObserver.observe(el));

  // PORTFOLIO FILTER
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioCards = document.querySelectorAll('.portfolio-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      portfolioCards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.style.display = match ? '' : 'none';
        if (match) {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          requestAnimationFrame(() => {
            card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          });
        }
      });
    });
  });

  // VIDEO MODAL
  const modal = document.getElementById('videoModal');
  const modalIframe = document.getElementById('modalVideo');
  const modalLocalVideo = document.getElementById('modalVideoLocal');
  const modalClose = document.getElementById('modalClose');

  portfolioCards.forEach(card => {
    card.addEventListener('click', () => {
      const videoUrl = card.dataset.video;
      const isLocal = card.dataset.type === 'local';
      if (videoUrl) {
        if (isLocal) {
          // Use HTML5 video player for local files
          modalLocalVideo.src = videoUrl;
          modalLocalVideo.style.display = 'block';
          modalIframe.style.display = 'none';
          modalIframe.src = '';
          modalLocalVideo.play();
        } else {
          // Use iframe for YouTube/external embeds
          modalIframe.src = videoUrl + '?autoplay=1';
          modalIframe.style.display = 'block';
          modalLocalVideo.style.display = 'none';
          modalLocalVideo.src = '';
        }
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  const closeModal = () => {
    modal.classList.remove('active');
    modalIframe.src = '';
    modalLocalVideo.pause();
    modalLocalVideo.src = '';
    modalLocalVideo.style.display = 'none';
    modalIframe.style.display = 'block';
    document.body.style.overflow = '';
  };

  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

  // FAQ ACCORDION
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const answer = item.querySelector('.faq-answer');
      const isActive = item.classList.contains('active');

      document.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('active');
        i.querySelector('.faq-answer').style.maxHeight = '0';
      });

      if (!isActive) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  // TESTIMONIAL CAROUSEL
  const track = document.getElementById('testimonialTrack');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  let carouselPos = 0;

  const getCardWidth = () => {
    const card = track.querySelector('.testimonial-card');
    return card ? card.offsetWidth + 24 : 404;
  };

  const maxScroll = () => {
    return Math.max(0, track.scrollWidth - track.parentElement.offsetWidth);
  };

  nextBtn.addEventListener('click', () => {
    carouselPos = Math.min(carouselPos + getCardWidth(), maxScroll());
    track.style.transform = `translateX(-${carouselPos}px)`;
    track.style.transition = 'transform 0.5s cubic-bezier(0.4,0,0.2,1)';
  });

  prevBtn.addEventListener('click', () => {
    carouselPos = Math.max(carouselPos - getCardWidth(), 0);
    track.style.transform = `translateX(-${carouselPos}px)`;
    track.style.transition = 'transform 0.5s cubic-bezier(0.4,0,0.2,1)';
  });

  // CONTACT FORM
  document.getElementById('contactForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    btn.textContent = 'Message Sent!';
    btn.style.background = 'var(--accent)';
    setTimeout(() => {
      btn.innerHTML = 'Send Message <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-1px;"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12,5 19,12 12,19"/></svg>';
      btn.style.background = '';
      e.target.reset();
    }, 3000);
  });

  // NEWSLETTER FORM
  document.getElementById('newsletterForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20,6 9,17 4,12"/></svg>';
    setTimeout(() => { btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12,5 19,12 12,19"/></svg>'; e.target.reset(); }, 2000);
  });

  // ============ PRICING CALCULATOR ============
  const calcData = {
    prices: {
      "Personal Branding":      { level1: 1600, level2: 2500, level3: 3500 },
      "Regular Business Reel":  { level1: 1200, level2: 1800, level3: 2500 },
      "Real Estate":            { level1: 1400, level2: 2200, level3: 3000 },
      "Motion Graphics":        { level1: 2000, level2: 3000, level3: 4500 },
      "AI Videos":              { level1: 900,  level2: 1500, level3: 2200 }
    },
    tierNames: {
      "Personal Branding":      ["Broil + Simple Text", "Cinematic Edit", "Premium Brand Film"],
      "Regular Business Reel":  ["Basic Cut", "Polished Edit", "Full Production"],
      "Real Estate":            ["Simple Walkthrough", "Styled Tour", "Cinematic Showcase"],
      "Motion Graphics":        ["Basic Motion", "Advanced Animation", "Custom VFX"],
      "AI Videos":              ["AI Draft", "AI + Manual Polish", "Full AI Production"]
    }
  };

  let calcState = {
    category: "Personal Branding",
    tier: "level1",
    videos: 5,
    addons: [],
    annual: false
  };

  const fmt = (n) => n.toLocaleString('en-IN');
  const R = '\u20B9';

  // DOM refs
  const pills = document.querySelectorAll('.calc-pill');
  const tiers = document.querySelectorAll('.calc-tier');
  const slider = document.getElementById('videoSlider');
  const sliderVal = document.getElementById('sliderValue');
  const addonChecks = document.querySelectorAll('#calcAddons input[type="checkbox"]');
  const annualToggle = document.getElementById('annualToggle');
  const breakdownEl = document.getElementById('breakdownLines');
  const totalSubEl = document.getElementById('totalSub');
  const totalAmountEl = document.getElementById('totalAmount');

  function updateTierPrices() {
    const p = calcData.prices[calcState.category];
    const n = calcData.tierNames[calcState.category];
    document.getElementById('tierName1').textContent = 'Level 1 - ' + n[0];
    document.getElementById('tierName2').textContent = 'Level 2 - ' + n[1];
    document.getElementById('tierName3').textContent = 'Level 3 - ' + n[2];
    document.getElementById('tierPrice1').textContent = R + fmt(p.level1);
    document.getElementById('tierPrice2').textContent = R + fmt(p.level2);
    document.getElementById('tierPrice3').textContent = R + fmt(p.level3);
  }

  function updateSliderTrack() {
    const pct = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
    slider.style.background = `linear-gradient(to right, var(--calc-accent) ${pct}%, rgba(255,255,255,0.1) ${pct}%)`;
  }

  function recalculate() {
    const base = calcData.prices[calcState.category][calcState.tier];
    const v = calcState.videos;
    const baseCost = base * v;

    // Add-on costs
    let addonTotal = 0;
    const addonDetails = [];
    addonChecks.forEach(cb => {
      if (cb.checked) {
        const price = parseInt(cb.dataset.price);
        const cost = price * v;
        addonTotal += cost;
        addonDetails.push({ name: cb.value, price, cost });
      }
    });

    let subtotal = baseCost + addonTotal;
    let discount = 0;
    if (calcState.annual) {
      discount = Math.round(subtotal * 0.2);
      subtotal -= discount;
    }

    // Build breakdown HTML
    let html = '';
    html += `<div class="breakdown-line base"><span>${R}${fmt(base)} base x ${v} video${v>1?'s':''}</span><span class="bl-amount">${R}${fmt(baseCost)}</span></div>`;

    if (addonDetails.length) {
      html += '<hr class="breakdown-sep">';
      addonDetails.forEach(a => {
        html += `<div class="breakdown-line"><span>${a.name} (${R}${fmt(a.price)} x ${v})</span><span class="bl-amount">+${R}${fmt(a.cost)}</span></div>`;
      });
    }

    if (discount > 0) {
      html += '<hr class="breakdown-sep">';
      html += `<div class="breakdown-line" style="color:var(--accent)"><span>Annual discount (20%)</span><span class="bl-amount" style="color:var(--accent)">-${R}${fmt(discount)}</span></div>`;
    }

    breakdownEl.innerHTML = html;

    // Total display
    totalSubEl.textContent = `${R}${fmt(base)} x ${v} video${v>1?'s':''}` + (addonDetails.length ? ' + add-ons' : '');
    totalAmountEl.textContent = R + fmt(subtotal);

    // Bump animation
    totalAmountEl.classList.add('bump');
    setTimeout(() => totalAmountEl.classList.remove('bump'), 200);

    // Show discount badge
    const existingBadge = document.querySelector('.total-discount');
    if (existingBadge) existingBadge.remove();
    if (discount > 0) {
      const badge = document.createElement('div');
      badge.className = 'total-discount';
      badge.textContent = `You save ${R}${fmt(discount)}!`;
      totalAmountEl.after(badge);
    }
  }

  // Category pills
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => { p.classList.remove('active'); p.setAttribute('aria-pressed','false'); });
      pill.classList.add('active');
      pill.setAttribute('aria-pressed','true');
      calcState.category = pill.dataset.category;
      updateTierPrices();
      recalculate();
    });
  });

  // Tier radios
  tiers.forEach(tier => {
    tier.addEventListener('click', () => {
      tiers.forEach(t => t.classList.remove('active'));
      tier.classList.add('active');
      const radio = tier.querySelector('input[type="radio"]');
      radio.checked = true;
      calcState.tier = radio.value;
      recalculate();
    });
  });

  // Slider
  slider.addEventListener('input', () => {
    calcState.videos = parseInt(slider.value);
    sliderVal.textContent = slider.value;
    updateSliderTrack();
    recalculate();
  });

  // Add-ons
  addonChecks.forEach(cb => {
    cb.addEventListener('change', () => recalculate());
  });

  // Annual toggle
  annualToggle.addEventListener('change', () => {
    calcState.annual = annualToggle.checked;
    recalculate();
  });

  // Email quote button
  document.getElementById('emailQuoteBtn').addEventListener('click', () => {
    const btn = document.getElementById('emailQuoteBtn');
    btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20,6 9,17 4,12"/></svg> Quote Copied!';
    setTimeout(() => {
      btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="22,4 12,13 2,4"/></svg> Email This Quote';
    }, 2500);
  });

  // Initialize calculator
  updateTierPrices();
  updateSliderTrack();
  recalculate();

});
