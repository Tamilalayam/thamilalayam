
    // Initialize Mobile Hamburger Menu
    function initMobileMenu() {
      const toggleBtn = document.querySelector('.mobile-menu-toggle');
      const navLinks = document.querySelector('.nav-links');
      if (toggleBtn && navLinks) {
        toggleBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          toggleBtn.classList.toggle('active');
          navLinks.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        const links = navLinks.querySelectorAll('.nav-link');
        links.forEach(link => {
          link.addEventListener('click', () => {
            toggleBtn.classList.remove('active');
            navLinks.classList.remove('active');
          });
        });
        
        // Close menu when clicking anywhere else
        document.addEventListener('click', (e) => {
          if (!navLinks.contains(e.target) && !toggleBtn.contains(e.target)) {
            toggleBtn.classList.remove('active');
            navLinks.classList.remove('active');
          }
        });
      }
    }

    function toggleMusic() {
      const audio = document.getElementById('bg-music');
      const btn = document.getElementById('music-toggle-btn');
      if (audio.paused) {
        audio.play().then(() => {
          btn.classList.add('playing');
          btn.querySelector('.music-icon').textContent = '⏸️';
        }).catch(e => {
          console.error("Audio playback blocked:", e);
          alert("இசையை இயக்க பிரவுசரின் ஏதேனும் ஒரு பகுதியில் கிளிக் செய்த பின் முயலவும்!");
        });
      } else {
        audio.pause();
        btn.classList.remove('playing');
        btn.querySelector('.music-icon').textContent = '🎵';
      }
    }
  

    function escapeHtml(string) {
      return String(string)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }

    document.addEventListener("DOMContentLoaded", () => {
      initMobileMenu();
      // Dynamic background music trigger
      const audioEl = document.getElementById('bg-music');
      const btnEl = document.getElementById('music-toggle-btn');
      if (audioEl && btnEl) {
        const startPlay = () => {
          audioEl.play().then(() => {
            btnEl.classList.add('playing');
            btnEl.querySelector('.music-icon').textContent = '⏸️';
            cleanupListeners();
          }).catch(e => {});
        };
        const cleanupListeners = () => {
          document.removeEventListener('click', startPlay);
          document.removeEventListener('scroll', startPlay);
          document.removeEventListener('touchstart', startPlay);
        };
        // Try playing immediately (some environments allow it)
        audioEl.play().then(() => {
          btnEl.classList.add('playing');
          btnEl.querySelector('.music-icon').textContent = '⏸️';
        }).catch(() => {
          // If blocked, play on first user interaction (looks like autoplay)
          document.addEventListener('click', startPlay);
          document.addEventListener('scroll', startPlay);
          document.addEventListener('touchstart', startPlay);
        });
      }
      let activeConfig = null;
      const localData = localStorage.getItem('siteContent');
      const isDraftPreview = sessionStorage.getItem('isAdminLoggedIn') === 'true' || window.location.search.includes('preview');
      if (localData && isDraftPreview) {
        try {
          const parsed = JSON.parse(localData);
          if (typeof activeConfig !== 'undefined') activeConfig = parsed;
          if (typeof content !== 'undefined') content = parsed;
          console.log("Loaded local preview draft");
        } catch (e) {
          console.error("Error reading localStorage content", e);
        }
      } else if (window.siteContent) {
        const fresh = JSON.parse(JSON.stringify(window.siteContent));
        if (typeof activeConfig !== 'undefined') activeConfig = fresh;
        if (typeof content !== 'undefined') content = fresh;
      }
      activeConfig = safeMergeConfig(window.siteContent || {}, activeConfig);

      // Dynamic Cloud Fetch (Load live config updates from Google Sheets)
      let scriptURL = (typeof activeConfig !== 'undefined' && activeConfig && activeConfig.formConfig?.scriptURL) ||
                        (typeof content !== 'undefined' && content && content.formConfig?.scriptURL) ||
                        "";
      if (!scriptURL || scriptURL.includes("AKfycbzd_5lljmz6NbUp")) {
        scriptURL = "https://script.google.com/macros/s/AKfycbwvobVHfdBXSAQz1hFrUnc1M6eDj4gTcpWc8SaeJBls4OaXiaXX9z7LP6kecaP1tKsf/exec";
      }
      function safeMergeConfig(local, cloud) {
        if (!cloud) return local || {};
        if (!local) return cloud;
        const merged = Object.assign({}, local, cloud);
        if (cloud.examsConfig && Array.isArray(cloud.examsConfig.sections) && cloud.examsConfig.sections.length > 0) {
          merged.examsConfig = cloud.examsConfig;
        } else if (local.examsConfig) {
          merged.examsConfig = local.examsConfig;
        }
        return merged;
      }

      if (scriptURL && !isDraftPreview) {
        fetch(scriptURL + '?action=getConfig&_t=' + Date.now(), { cache: 'no-store' })
        .then(res => res.json())
        .then(data => {
          if (data) {
            console.log("Loaded fresh config dynamically from Google Cloud API");
            const merged = safeMergeConfig(window.siteContent || {}, data);
            activeConfig = merged;
            updateCommonElements(merged);
            if (typeof window.renderExams === 'function') window.renderExams(merged);
          }
        })
        .catch(err => console.warn("Google Apps Script config fetch skipped:", err));
      }

      function updateCommonElements(data) {
        const logoUrl = data.logo || data.formConfig?.logoUrl || "IMG_3529.jpg";
        const logoEl = document.getElementById("header-logo") || document.getElementById("siteLogo");
        const navLogoEl = document.getElementById("nav-logo");
        if (logoEl) logoEl.src = logoUrl;
        if (navLogoEl) navLogoEl.src = logoUrl;

        const titleTaEl = document.getElementById("header-title-ta");
        const titleEnEl = document.getElementById("header-title-en");
        const navBrandTitleEl = document.getElementById("nav-brand-title");

        const mainTitle = data.titleTa || data.formConfig?.title || "தமிழாலயம் பாட்சுவல்பாக்";
        if (titleTaEl) {
          titleTaEl.textContent = mainTitle;
        }
        if (titleEnEl) titleEnEl.textContent = data.titleEn || data.formConfig?.subtitle || "Thamilalayam Bad Schwalbach";
        if (navBrandTitleEl) navBrandTitleEl.textContent = mainTitle.split(" ")[0] || "தமிழாலயம்";

        // Apply colors dynamically
        const root = document.documentElement;
        const colors = data.colors || data.formConfig?.colors || {};
        if (colors.bodyBgStart) root.style.setProperty('--body-bg-start', colors.bodyBgStart);
        if (colors.bodyBgEnd) root.style.setProperty('--body-bg-end', colors.bodyBgEnd);
        if (colors.headerBgStart) root.style.setProperty('--header-bg-start', colors.headerBgStart);
        if (colors.headerBgEnd) root.style.setProperty('--header-bg-end', colors.headerBgEnd);
        if (colors.accentColor) root.style.setProperty('--accent-color', colors.accentColor);
        if (colors.containerBg) root.style.setProperty('--container-bg', colors.containerBg);

        // Apply dynamic motto text
        const mottoText = data.formConfig?.marqueeText || "கல்வியும் கலையும் நம்மிரு கண்கள், நல் தமிழ் மொழி எங்கள் உயிராகும்!";
        const marqueeSpans = document.querySelectorAll('.marquee-text');
        if (marqueeSpans.length > 0) {
          const formatted = escapeHtml(mottoText)
            .replace(/\\n/g, ' &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ✦ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ')
            .replace(/,\s*/g, ' &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ✦ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ')
            .replace(/&amp;nbsp;/g, '&nbsp;');
          marqueeSpans.forEach(span => {
            span.innerHTML = formatted;
          });
        }
      }

      if (activeConfig) {
        const mainTitle = activeConfig.formConfig?.title || activeConfig.titleTa || "தமிழாலயம் பாட்சுவல்பாக்";
        const titleTaEl = document.getElementById('header-title-ta');
        const titleEnEl = document.getElementById('header-title-en');
        const logoEl = document.getElementById('header-logo');

        if (titleTaEl) {
          titleTaEl.textContent = mainTitle;
        }
        if (titleEnEl) titleEnEl.textContent = activeConfig.formConfig?.subtitle || activeConfig.titleEn || "Thamilalayam Bad Schwalbach";
        
        const logoUrl = activeConfig.formConfig?.logoUrl || activeConfig.logo || "IMG_3529.jpg";
        if (logoEl) logoEl.src = logoUrl;

        // Apply dynamic motto text
        const mottoText = (typeof activeConfig !== 'undefined' && activeConfig && activeConfig.formConfig?.marqueeText) || 
                          (typeof content !== 'undefined' && content && content.formConfig?.marqueeText) || 
                          "கல்வியும் கலையும் நம்மிரு கண்கள், நல் தமிழ் மொழி எங்கள் உயிராகும்!";
        const marqueeSpans = document.querySelectorAll('.marquee-text');
        if (marqueeSpans.length > 0) {
          const formatted = escapeHtml(mottoText)
            .replace(/\\n/g, ' &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ✦ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ')
            .replace(/,\s*/g, ' &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ✦ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ')
            .replace(/&amp;nbsp;/g, '&nbsp;');
          marqueeSpans.forEach(span => {
            span.innerHTML = formatted;
          });
        }

        // Apply contact coordinates dynamically in header
        const globalContact = activeConfig.contactConfig || (typeof content !== 'undefined' ? content.contactConfig : null);
        if (globalContact) {
          const headerWaLink = document.getElementById('header-whatsapp-link');
          const headerEmailLink = document.getElementById('header-email-link');
          const headerFbLink = document.getElementById('header-facebook-link');
          
          if (globalContact.whatsapp && headerWaLink) {
            const rawWa = globalContact.whatsapp.replace(/\+/g, '').replace(/\s+/g, '');
            headerWaLink.href = 'https://wa.me/' + rawWa;
          }
          if (globalContact.email && headerEmailLink) {
            headerEmailLink.href = 'mailto:' + globalContact.email;
          }
          if (globalContact.facebook && headerFbLink) {
            let fb = globalContact.facebook.trim();
            if (!fb.startsWith('http')) {
              fb = 'https://www.facebook.com/' + fb;
            }
            headerFbLink.href = fb;
          }
        }
        
        // Dynamically update footer name
        const footerTextP = document.querySelector('footer p');
        if (footerTextP) {
          const dynamicTitle = (activeConfig && (activeConfig.titleTa || activeConfig.formConfig?.title)) || 
                               (typeof content !== 'undefined' && (content.titleTa || content.formConfig?.title)) || 
                               'தமிழாலயம் பாட்சுவல்பாக்';
          footerTextP.innerHTML = footerTextP.innerHTML.replace('தமிழாலயம் பாட்சுவல்பாக்', dynamicTitle);
        }

        // Apply theme colors
        const colors = activeConfig.formConfig?.colors;
        if (colors) {
          const root = document.documentElement;
          if (colors.bodyBgStart) root.style.setProperty('--bg-start', colors.bodyBgStart);
          if (colors.bodyBgEnd) root.style.setProperty('--bg-end', colors.bodyBgEnd);
          if (colors.accentColor) {
            root.style.setProperty('--primary', colors.accentColor);
            root.style.setProperty('--primary-hover', colors.accentColor + 'dd');
          }
          if (colors.containerBg) root.style.setProperty('--card-bg', colors.containerBg);
        }

        // Render dynamic exams content
        if (typeof window.renderExams === 'function') {
          window.renderExams(activeConfig);
        }
      }
    });

    // Global window.renderExams definition
    window.renderExams = function(configData) {
      const cfg = configData || activeConfig || window.siteContent || {};
      const examsContainer = document.getElementById('exams-container');
      if (!examsContainer) return;

      const examsData = cfg.examsConfig || (window.siteContent && window.siteContent.examsConfig) || { title: 'தமிழாலயத் தேர்வுகள்', sections: [] };
      let html = `<h2 class="title-h1" id="exams-page-title">${escapeHtml(examsData.title || 'தமிழாலயத் தேர்வுகள்')}</h2>`;
      
      if (examsData.sections && examsData.sections.length > 0) {
        examsData.sections.forEach(section => {
          html += `
            <div class="exam-section">
              <h3>${escapeHtml(section.title)}</h3>
              <p style="white-space: pre-line;">${escapeHtml(section.content)}</p>
            </div>
          `;
        });
      } else {
        html += `
          <div class="exam-section">
            <h3>தேர்வுப் பெறுபேறுகள் மற்றும் அறிவிப்புகள்</h3>
            <p>தமிழாலயத்தின் வருடாந்தப் பொதுத்தேர்வுகள் மற்றும் பருவத் தேர்வுகள் பற்றிய செய்திகள் மற்றும் அறிவிப்புகள் இங்கு உடனுக்குடன் தோன்றும்.</p>
          </div>
        `;
      }
      
      examsContainer.innerHTML = html;
    };
  
    // Admin hidden navigation shortcut helper
    function initAdminShortcut() {
      const isAdmin = sessionStorage.getItem('isAdminLoggedIn') === 'true' || window.location.search.includes('admin');
      
      // Show navigation links if logged in or URL has ?admin
      const navAdmin = document.getElementById('nav-admin');
      if (navAdmin && isAdmin) {
        navAdmin.style.display = 'inline-block';
      }
      const topAdmin = document.getElementById('top-admin');
      if (topAdmin && isAdmin) {
        topAdmin.style.display = 'inline-block';
      }
      const portalAdmin = document.getElementById('portal-admin-card');
      if (portalAdmin && isAdmin) {
        portalAdmin.style.display = 'flex';
      }

      // Add double click on logo to open admin panel
      const logoEl = document.getElementById('header-logo') || document.getElementById('nav-logo');
      if (logoEl) {
        logoEl.style.cursor = 'pointer';
        logoEl.addEventListener('dblclick', () => {
          location.href = 'admin.html';
        });
      }
      
      // Hidden copyright link in footer
      const footerText = document.querySelector('footer p');
      if (footerText) {
        footerText.innerHTML = footerText.innerHTML.replace('©', '<span style="cursor:default;" onclick="location.href=\'admin.html\'">©</span>');
      }
    }
    
    // Run shortcut initializer
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initAdminShortcut);
    } else {
      initAdminShortcut();
    }

  
    // Initialize Mobile Hamburger Menu
    function initMobileMenu() {
      const toggleBtn = document.querySelector('.mobile-menu-toggle');
      const navLinks = document.querySelector('.nav-links');
      if (toggleBtn && navLinks) {
        toggleBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          toggleBtn.classList.toggle('active');
          navLinks.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        const links = navLinks.querySelectorAll('.nav-link');
        links.forEach(link => {
          link.addEventListener('click', () => {
            toggleBtn.classList.remove('active');
            navLinks.classList.remove('active');
          });
        });
        
        // Close menu when clicking anywhere else
        document.addEventListener('click', (e) => {
          if (!navLinks.contains(e.target) && !toggleBtn.contains(e.target)) {
            toggleBtn.classList.remove('active');
            navLinks.classList.remove('active');
          }
        });
      }
    }

    function toggleMusic() {
      const audio = document.getElementById('bg-music');
      const btn = document.getElementById('music-toggle-btn');
      if (audio.paused) {
        audio.play().then(() => {
          btn.classList.add('playing');
          btn.querySelector('.music-icon').textContent = '⏸️';
        }).catch(e => {
          console.error("Audio playback blocked:", e);
          alert("இசையை இயக்க பிரவுசரின் ஏதேனும் ஒரு பகுதியில் கிளிக் செய்த பின் முயலவும்!");
        });
      } else {
        audio.pause();
        btn.classList.remove('playing');
        btn.querySelector('.music-icon').textContent = '🎵';
      }
    }
  