/**
 * Baukasten (Building Blocks) – Shared content engine
 * Renders modular page blocks and injects custom nav links.
 */
(function (global) {
  'use strict';

  function escapeHtml(string) {
    const matchHtmlRegExp = /["'&<>]/;
    const str = '' + string;
    const match = matchHtmlRegExp.exec(str);
    if (!match) return str;
    let escape, html = '', index = 0, lastIndex = 0;
    for (index = match.index; index < str.length; index++) {
      switch (str.charCodeAt(index)) {
        case 34: escape = '&quot;'; break;
        case 38: escape = '&amp;'; break;
        case 39: escape = '&#39;'; break;
        case 60: escape = '&lt;'; break;
        case 62: escape = '&gt;'; break;
        default: continue;
      }
      if (lastIndex !== index) html += str.substring(lastIndex, index);
      lastIndex = index + 1;
      html += escape;
    }
    return lastIndex !== index ? html + str.substring(lastIndex, index) : html;
  }

  function loadSiteContent() {
    let content = {};
    const isDraftPreview =
      sessionStorage.getItem('isAdminLoggedIn') === 'true' ||
      (global.location && global.location.search.includes('preview'));

    const localData = global.localStorage && global.localStorage.getItem('siteContent');
    if (localData && isDraftPreview) {
      try {
        content = JSON.parse(localData);
      } catch (e) {
        console.error('Baukasten: localStorage parse error', e);
      }
    }

    if (!content || !content.titleTa) {
      if (global.siteContent) {
        content = JSON.parse(JSON.stringify(global.siteContent));
      } else {
        content = {};
      }
    }

    if (!content.pages) content.pages = [];
    return content;
  }

  function getPageBySlug(content, slug) {
    if (!slug || !content.pages) return null;
    return content.pages.find(function (p) { return p.slug === slug; }) || null;
  }

  function renderBlocks(container, items) {
    if (!container) return;
    container.innerHTML = '';

    if (!items || items.length === 0) {
      container.innerHTML =
        '<div class="bk-empty">தகவல்கள் ஏதும் இல்லை. அட்மின் பanel-ல் உள்ளடக்கத்தைச் சேர்க்கவும்.</div>';
      return;
    }

    items.forEach(function (item) {
      if (item.type === 'text') {
        if (item.style === 'h1') {
          const el = document.createElement('h2');
          el.className = 'heading-h1';
          el.textContent = item.text || '';
          container.appendChild(el);
        } else if (item.style === 'h2') {
          const el = document.createElement('h3');
          el.className = 'heading-h2';
          el.textContent = item.text || '';
          container.appendChild(el);
        } else {
          (item.text || '').split(/\n+/).forEach(function (pText) {
            if (pText.trim()) {
              const el = document.createElement('p');
              el.className = 'paragraph';
              el.textContent = pText.trim();
              container.appendChild(el);
            }
          });
        }
      } else if (item.type === 'image') {
        const el = document.createElement('img');
        el.className = 'content-image';
        el.src = item.src;
        el.alt = item.alt || 'படம்';
        el.onerror = function () { el.style.display = 'none'; };
        container.appendChild(el);
      } else if (item.type === 'link') {
        const el = document.createElement('a');
        el.href = item.href;
        el.textContent = item.text;
        el.target = item.target || '_self';
        if (item.style === 'button-primary') el.className = 'button-primary';
        else if (item.style === 'button-secondary') el.className = 'button-secondary';
        else el.className = 'text-link';
        container.appendChild(el);
      } else if (item.type === 'article') {
        const card = document.createElement('div');
        card.className = 'article-card';
        let imgHtml = '';
        if (item.image) {
          imgHtml =
            '<div class="article-image-container">' +
            '<img src="' + escapeHtml(item.image) + '" alt="' + escapeHtml(item.title || '') +
            '" onerror="this.parentElement.style.display=\'none\'">' +
            '</div>';
        }
        let btnHtml = '';
        if (item.btnText && item.btnHref) {
          btnHtml =
            '<div style="margin-top:15px;">' +
            '<a href="' + escapeHtml(item.btnHref) + '" class="button-primary bk-inline-btn">' +
            escapeHtml(item.btnText) + '</a></div>';
        }
        let paragraphsHtml = '';
        (item.content || '').split(/\n\s*\n/).forEach(function (p) {
          if (p.trim()) paragraphsHtml += '<p>' + escapeHtml(p.trim()) + '</p>';
        });
        card.innerHTML =
          imgHtml +
          '<div class="article-info">' +
          '<h3 class="article-title">' + escapeHtml(item.title || '') + '</h3>' +
          '<div class="article-text">' + paragraphsHtml + '</div>' +
          btnHtml +
          '</div>';
        container.appendChild(card);
      } else if (item.type === 'divider') {
        const el = document.createElement('hr');
        el.className = 'bk-divider';
        container.appendChild(el);
      }
    });
  }

  function injectCustomNavLinks(content, activeSlug) {
    const navLinks = document.querySelector('.nav-links');
    if (!navLinks || !content.pages) return;

    navLinks.querySelectorAll('.nav-link-bk').forEach(function (el) { el.remove(); });

    const pages = content.pages
      .filter(function (p) { return p.showInNav !== false; })
      .sort(function (a, b) { return (a.navOrder || 0) - (b.navOrder || 0); });

    const loginLink = navLinks.querySelector('#nav-login, a[href*="login.html"]');
    pages.forEach(function (page) {
      const a = document.createElement('a');
      a.href = 'page.html?p=' + encodeURIComponent(page.slug);
      a.className = 'nav-link nav-link-bk';
      a.textContent = page.title || page.slug;
      if (activeSlug && page.slug === activeSlug) a.classList.add('active');
      if (loginLink) navLinks.insertBefore(a, loginLink);
      else navLinks.appendChild(a);
    });
  }

  function applySiteBranding(content) {
    const data = content || {};
    const titleTa = data.titleTa || data.formConfig?.title || 'தமிழாலயம் பாட்சுவல்பாக்';
    const titleEn = data.titleEn || data.formConfig?.subtitle || 'Thamilalayam Bad Schwalbach';
    const logo = data.logo || data.formConfig?.logoUrl || 'IMG_3529.jpg';
    const marquee = data.formConfig?.marqueeText || '';

    const logoEl = document.getElementById('header-logo') || document.getElementById('nav-logo');
    if (logoEl) logoEl.src = logo;

    const titleTaEl = document.getElementById('header-title-ta');
    if (titleTaEl) titleTaEl.textContent = titleTa;

    const titleEnEl = document.getElementById('header-title-en');
    if (titleEnEl) titleEnEl.textContent = titleEn;

    document.querySelectorAll('.marquee-text').forEach(function (el) {
      if (marquee) el.textContent = marquee;
    });

    const mobileTitle = document.querySelector('.mobile-nav-title');
    if (mobileTitle) mobileTitle.textContent = titleTa;

    const contact = data.contactConfig || {};
    const waLink = document.getElementById('header-whatsapp-link');
    const waVal = document.getElementById('header-whatsapp-val');
    if (contact.whatsapp && waLink) {
      const wa = contact.whatsapp.trim();
      waLink.href = wa.startsWith('http') ? wa : 'https://wa.me/' + wa.replace(/\D/g, '');
      if (waVal) waVal.textContent = wa;
    }
    const emailLink = document.getElementById('header-email-link');
    const emailText = document.getElementById('header-email-text');
    if (contact.email && emailLink) {
      emailLink.href = 'mailto:' + contact.email;
      if (emailText) emailText.textContent = contact.email;
    }
    const fbLink = document.getElementById('header-facebook-link');
    if (contact.facebook && fbLink) {
      let fb = contact.facebook.trim();
      if (!fb.startsWith('http')) fb = 'https://www.facebook.com/' + fb;
      fbLink.href = fb;
    }

    const footerP = document.querySelector('footer p');
    if (footerP) {
      footerP.innerHTML = '© 2026 ' + escapeHtml(titleTa) + '. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.';
    }
  }

  function initMobileMenu() {
    const toggleBtn = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (!toggleBtn || !navLinks) return;
    toggleBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      toggleBtn.classList.toggle('active');
      navLinks.classList.toggle('active');
    });
    navLinks.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        toggleBtn.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });
    document.addEventListener('click', function (e) {
      if (!navLinks.contains(e.target) && !toggleBtn.contains(e.target)) {
        toggleBtn.classList.remove('active');
        navLinks.classList.remove('active');
      }
    });
  }

  function initAdminShortcut() {
    const isAdmin =
      sessionStorage.getItem('isAdminLoggedIn') === 'true' ||
      (global.location && global.location.search.includes('admin'));
    const navAdmin = document.getElementById('nav-admin');
    if (navAdmin && isAdmin) navAdmin.style.display = 'inline-block';
    const logoEl = document.getElementById('header-logo');
    if (logoEl && isAdmin) {
      logoEl.addEventListener('dblclick', function () {
        global.location.href = 'admin.html';
      });
    }
  }

  global.Baukasten = {
    escapeHtml: escapeHtml,
    loadSiteContent: loadSiteContent,
    getPageBySlug: getPageBySlug,
    renderBlocks: renderBlocks,
    injectCustomNavLinks: injectCustomNavLinks,
    applySiteBranding: applySiteBranding,
    initMobileMenu: initMobileMenu,
    initAdminShortcut: initAdminShortcut
  };
})(window);
