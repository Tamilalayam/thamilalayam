
    // State storage
    const CORRECT_PASSWORD_HASH = "9824b4108998fb8da50d48e0da98b49acbe2c5de36db1e73837ad7f6b5717f7f";
    /*CONFIG_START*/
    const DEFAULT_CONFIG = {
      logo: "IMG_3529.jpg",
      titleTa: "தமிழாலயம் பாட்சுவல்பாக்",
      titleEn: "Thamilalayam Bad Schwalbach",
      formConfig: {
        title: "தமிழாலயம் பாட்சுவல்பாக்",
        subtitle: "Thamilalayam Bad Schwalbach",
        formTitle: "விளையாட்டுப் போட்டி விண்ணப்பம் 2026",
        logoUrl: "IMG_3529.jpg",
        scriptURL: "",
        adminPasscode: "Bales1947",
        colors: {
          bodyBgStart: "#0f172a",
          bodyBgEnd: "#1e293b",
          headerBgStart: "#0f172a",
          headerBgEnd: "#1e3a8a",
          accentColor: "#2563eb",
          containerBg: "#ffffff"
        }
      },
      vaultConfig: {
        userPasswordPlaceholder: "உள்நுழையவும்",
        users: [],
        pdfs: []
      },
      items: [],
      ageCategories: []
    };
    /*CONFIG_END*/

    let currentContent = JSON.parse(JSON.stringify(DEFAULT_CONFIG));

    // SHA-256 function
    async function sha256(message) {
      const msgBuffer = new TextEncoder().encode(message);
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    // Authentication Checks
    async function verifyPassword() {
      const input = document.getElementById('password-input').value;
      const hash = await sha256(input);
      
      // Allow Bales1947 hash OR custom set plain passcode
      const customPasscode = currentContent.formConfig?.adminPasscode || "Bales1947";
      
      if (hash === CORRECT_PASSWORD_HASH || input === customPasscode) {
        document.getElementById('auth-screen').style.opacity = 0;
        setTimeout(() => {
          document.getElementById('auth-screen').style.display = 'none';
        }, 300);
        sessionStorage.setItem('isAdminLoggedIn', 'true');
        loadData();
      } else {
        const err = document.getElementById('auth-error');
        err.style.display = 'block';
        setTimeout(() => { err.style.display = 'none'; }, 3000);
      }
    }

    function checkAuth() {
      if (window.siteContent) {
        currentContent = JSON.parse(JSON.stringify(window.siteContent));
      }
      
      const localData = localStorage.getItem('siteContent');
      if (localData) {
        try {
          currentContent = JSON.parse(localData);
        } catch(e) {}
      }

      // Safeguard against missing array properties and pre-populate empty lists to default values
      if (!currentContent.items) currentContent.items = [];
      
      if (!currentContent.ageCategories || currentContent.ageCategories.length === 0) {
        currentContent.ageCategories = [
          { "id": "cat_1", "name": "பாலர் (01.07.2021 - 30.07.2024)", "start": "2021-07-01", "end": "2024-07-30", "games": ["25 மீ"] },
          { "id": "cat_2", "name": "பிரிவு 1 (01.07.2019 - 30.06.2021)", "start": "2019-07-01", "end": "2021-06-30", "games": ["50 மீ", "75 மீ", "எம்பிப் பாய்தல்", "பந்து எறிதல்"] },
          { "id": "cat_3", "name": "பிரிவு 2 (01.07.2017 - 30.06.2019)", "start": "2017-07-01", "end": "2019-06-30", "games": ["50 மீ", "75 மீ", "எம்பிப் பாய்தல்", "பந்து எறிதல்"] },
          { "id": "cat_4", "name": "பிரிவு 3 (01.07.2015 - 30.06.2017)", "start": "2015-07-01", "end": "2017-06-30", "games": ["75 மீ", "100 மீ", "நீளம் பாய்தல்", "பந்து எறிதல்"] },
          { "id": "cat_5", "name": "பிரிவு 4 (01.07.2013 - 30.06.2015)", "start": "2013-07-01", "end": "2015-06-30", "games": ["100 மீ", "200 மீ", "நீளம் பாய்தல்", "குண்டு எறிதல்"] },
          { "id": "cat_6", "name": "பிரிவு 5 (01.07.2011 - 30.06.2013)", "start": "2011-07-01", "end": "2013-06-30", "games": ["100 மீ", "200 மீ", "நீளம் பாய்தல்", "குண்டு எறிதல்"] },
          { "id": "cat_7", "name": "பிரிவு 6 (01.07.2009 - 30.06.2011)", "start": "2009-07-01", "end": "2011-06-30", "games": ["100 மீ", "200 மீ", "நீளம் பாய்தல்", "குண்டு எறிதல்"] },
          { "id": "cat_8", "name": "பிரிவு 7 (01.07.2007 - 30.06.2009)", "start": "2007-07-01", "end": "2009-06-30", "games": ["100 மீ", "200 மீ", "நீளம் பாய்தல்", "குண்டு எறிதல்"] },
          { "id": "cat_9", "name": "பிரிவு 8 (01.07.2005 - 30.06.2007)", "start": "2005-07-01", "end": "2007-06-30", "games": ["100 மீ", "200 மீ", "நீளம் பாய்தல்", "குண்டு எறிதல்"] },
          { "id": "cat_10", "name": "பிரிவு 9 (01.07.1981 - 30.06.2005)", "start": "1981-07-01", "end": "2005-06-30", "games": ["100 மீ", "200 மீ", "நீளம் பாய்தல்", "குண்டு எறிதல்"] }
        ];
      }
      
      if (!currentContent.vaultConfig) {
        currentContent.vaultConfig = { userPasswordPlaceholder: "உள்நுழையவும்", users: [], pdfs: [] };
      }
      
      if (!currentContent.vaultConfig.users || currentContent.vaultConfig.users.length === 0) {
        currentContent.vaultConfig.users = [
          { "username": "மாணவர் 1", "password": "student2026" },
          { "username": "பெற்றோர் 1", "password": "parent2026" },
          { "username": "நண்பர் 1", "password": "friend2026" }
        ];
      }
      
      if (!currentContent.vaultConfig.pdfs || currentContent.vaultConfig.pdfs.length === 0) {
        currentContent.vaultConfig.pdfs = [];
      }

      if (!currentContent.examsConfig) {
        currentContent.examsConfig = { title: "தமிழாலயத் தேர்வுகள் (Exams Portal)", sections: [] };
      }
      if (!currentContent.examsConfig.sections) {
        currentContent.examsConfig.sections = [];
      }

      if (!currentContent.eventsConfig) {
        currentContent.eventsConfig = { title: "தமிழாலய நிகழ்வுகள் (Events Calendar)", timeline: [] };
      }
      if (!currentContent.eventsConfig.timeline) {
        currentContent.eventsConfig.timeline = [];
      }

      if (!currentContent.contactConfig) {
        currentContent.contactConfig = {
          whatsapp: "thamilalayam",
          instagram: "thamilalayam",
          facebook: "thamilalayam",
          email: "thamilalayam@gmail.com"
        };
      }

      if (!currentContent.formConfig) currentContent.formConfig = {};
      if (!currentContent.formConfig.marqueeText) {
        currentContent.formConfig.marqueeText = "கல்வியும் கலையும் நம்மிரு கண்கள், நல் தமிழ் மொழி எங்கள் உயிராகும்!";
      }

      if (!currentContent.galleryConfig) {
        currentContent.galleryConfig = { title: "தமிழாலயப் புகைப்படங்கள் (Photo Gallery)", photos: [] };
      }
      if (!currentContent.portalGridConfig) {
        currentContent.portalGridConfig = [
          { icon: "📋", title: "விண்ணப்பம்", desc: "விளையாட்டுப் போட்டியில் பங்குபற்ற விண்ணப்பிக்கவும்.", href: "application.html" },
          { icon: "📝", title: "தேர்வுகள்", desc: "தேர்வுப் பெறுபேறுகள் மற்றும் அறிவிப்புகள்.", href: "exams.html" },
          { icon: "📅", title: "நிகழ்வுகள்", desc: "தமிழாலய நிகழ்வுகள் மற்றும் காலண்டர் விபரங்கள்.", href: "events.html" },
          { icon: "🖼️", title: "படங்கள்", desc: "தமிழாலய நிகழ்வுகளின் புகைப்படக் தொகுப்புகள்.", href: "gallery.html" },
          { icon: "🔐", title: "மாணவர் உள்நுழைவு", desc: "தேர்வுப் பெறுபேறுகள் மற்றும் தனிப்பட்ட விபரங்களைக் காண்க.", href: "login.html" },
          { icon: "📞", title: "தொடர்பு கொள்ள", desc: "தமிழாலய முகவரி, தொலைபேசி எண்கள் மற்றும் விபரங்கள்.", href: "contact.html" }
        ];
      }
      if (!currentContent.galleryConfig.photos) {
        currentContent.galleryConfig.photos = [];
      }

      if (!currentContent.pages) {
        currentContent.pages = [];
      }

      if (sessionStorage.getItem('isAdminLoggedIn') === 'true') {
        document.getElementById('auth-screen').style.display = 'none';
        loadData();
      }
    }

    function logout() {
      sessionStorage.removeItem('isAdminLoggedIn');
      location.reload();
    }

    function switchTab(btn, panelId) {
      document.querySelectorAll('.sidebar-tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      document.querySelectorAll('.panel-card').forEach(p => p.classList.remove('active'));
      document.getElementById(panelId).classList.add('active');

      if (panelId === 'panel-export') {
        generateExportCode();
      }
    }

    // Data Binding
    function loadData() {
      // Bind values to fields
      document.getElementById('logo-title-ta').value = currentContent.titleTa || currentContent.formConfig?.title || '';
      document.getElementById('logo-title-en').value = currentContent.titleEn || currentContent.formConfig?.subtitle || '';
      document.getElementById('logo-filename').value = currentContent.logo || currentContent.formConfig?.logoUrl || '';
      document.getElementById('form-subtitle').value = currentContent.formConfig?.subtitle || '';
      document.getElementById('form-marquee-text').value = currentContent.formConfig?.marqueeText || 'கல்வியும் கலையும் நம்மிரு கண்கள், நல் தமிழ் மொழி எங்கள் உயிராகும்!';
      document.getElementById('google-script-url').value = currentContent.formConfig?.scriptURL || '';
      document.getElementById('admin-passcode-field').value = currentContent.formConfig?.adminPasscode || 'Bales1947';

      // Colors setup
      const col = currentContent.formConfig?.colors || {};
      const setColor = (pickerId, textId, val) => {
        if (val) {
          document.getElementById(pickerId).value = val;
          document.getElementById(textId).value = val;
        }
      };
      setColor('colBodyBgStart', 'txtBodyBgStart', col.bodyBgStart || '#0f172a');
      setColor('colBodyBgEnd', 'txtBodyBgEnd', col.bodyBgEnd || '#1e293b');
      setColor('colHeaderBgStart', 'txtHeaderBgStart', col.headerBgStart || '#0f172a');
      setColor('colHeaderBgEnd', 'txtHeaderBgEnd', col.headerBgEnd || '#1e3a8a');
      setColor('colAccent', 'txtAccent', col.accentColor || '#2563eb');
      setColor('colContainerBg', 'txtContainerBg', col.containerBg || '#ffffff');

      // Exams and Events Page Inputs setup
      document.getElementById('exams-page-title-input').value = currentContent.examsConfig?.title || '';
      document.getElementById('events-page-title-input').value = currentContent.eventsConfig?.title || '';

      // Contact Page Inputs setup
      document.getElementById('contact-whatsapp-input').value = currentContent.contactConfig?.whatsapp || 'thamilalayam';
      document.getElementById('contact-instagram-input').value = currentContent.contactConfig?.instagram || 'thamilalayam';
      document.getElementById('contact-facebook-input').value = currentContent.contactConfig?.facebook || 'thamilalayam';
      document.getElementById('contact-email-input').value = currentContent.contactConfig?.email || 'thamilalayam@gmail.com';

      renderItems();
      renderCategories();
      renderExamsSections();
      renderEventsTimeline();
      renderGalleryAlbums();
      renderPortalGridEditor();
      renderPdfs();
      renderUsers();
      renderPages();

      if (window.location.hash === '#baukasten') {
        const tabBtn = document.getElementById('tab-baukasten');
        if (tabBtn) switchTab(tabBtn, 'panel-baukasten');
      }
    }

    function syncColorInput(picker, textId) {
      document.getElementById(textId).value = picker.value;
    }
    function syncColorPicker(textEl, pickerId) {
      const val = textEl.value;
      if (/^#[0-9A-F]{6}$/i.test(val)) {
        document.getElementById(pickerId).value = val;
      }
    }

    let activePageIndex = -1;
    let itemModalContext = 'homepage';

    // Homepage items actions
    function renderItems() {
      const container = document.getElementById('items-container');
      container.innerHTML = '';

      if (!currentContent.items || currentContent.items.length === 0) {
        container.innerHTML = '<div style="color: var(--text-muted); text-align: center; padding: 20px;">பொருட்கள் எதுவும் இல்லை.</div>';
        return;
      }

      currentContent.items.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'item-card';

        let badge = 'உரை';
        let badgeClass = 'badge-text';
        let preview = item.text || '';
        let sub = '';

        if (item.type === 'text') {
          badge = item.style === 'h1' ? 'தலைப்பு 1' : (item.style === 'h2' ? 'தலைப்பு 2' : 'உரைநடை');
          badgeClass = 'badge-text';
        } else if (item.type === 'image') {
          badge = 'படம்';
          badgeClass = 'badge-image';
          preview = item.src;
          sub = item.alt || 'விளக்கம் இல்லை';
        } else if (item.type === 'link') {
          badge = item.style === 'text-link' ? 'இணைப்பு' : 'பொத்தான்';
          badgeClass = 'badge-link';
          sub = item.href;
        } else if (item.type === 'article') {
          badge = 'செய்தி/கட்டுரை';
          badgeClass = 'badge-image';
          preview = item.title;
          sub = `படம்: ${item.image || 'இல்லை'} | விளக்கம்: ${item.content ? item.content.substring(0, 50) + '...' : ''}`;
        }

        card.innerHTML = `
          <div class="item-info">
            <span class="item-type-badge ${badgeClass}">${badge}</span>
            <div class="item-preview">${escapeHtml(preview)}</div>
            <div class="item-subtext">${escapeHtml(sub)}</div>
          </div>
          <div class="item-controls">
            <button class="icon-btn" onclick="moveItem(${index}, -1)" ${index === 0 ? 'disabled style="opacity:0.3"' : ''}>▲</button>
            <button class="icon-btn" onclick="moveItem(${index}, 1)" ${index === currentContent.items.length - 1 ? 'disabled style="opacity:0.3"' : ''}>▼</button>
            <button class="icon-btn" onclick="openEditModal(${index})">✏️</button>
            <button class="icon-btn" onclick="deleteItem(${index})">🗑️</button>
          </div>
        `;
        container.appendChild(card);
      });
    }

    function moveItem(index, direction) {
      const newIndex = index + direction;
      if (newIndex < 0 || newIndex >= currentContent.items.length) return;
      const temp = currentContent.items[index];
      currentContent.items[index] = currentContent.items[newIndex];
      currentContent.items[newIndex] = temp;
      renderItems();
    }

    function deleteItem(index) {
      if (confirm('முகப்புப் பக்கத்திலிருந்து இந்த உறுப்பை நீக்கலாமா?')) {
        currentContent.items.splice(index, 1);
        renderItems();
      }
    }

    // Modal Add/Edit Homepage Item
    function openAddModal() {
      itemModalContext = 'homepage';
      document.getElementById('modal-title').textContent = 'முகப்பு உறுப்பைச் சேர்';
      document.getElementById('edit-item-id').value = '';
      
      document.getElementById('item-type').value = 'text';
      document.getElementById('text-style').value = 'p';
      document.getElementById('text-content').value = '';
      document.getElementById('image-src').value = '';
      document.getElementById('image-alt').value = '';
      document.getElementById('link-text').value = '';
      document.getElementById('link-href').value = '';
      document.getElementById('link-style').value = 'button-primary';
      document.getElementById('link-target').value = '_self';
      
      // Clear Article fields
      document.getElementById('article-title').value = '';
      document.getElementById('article-image').value = '';
      document.getElementById('article-content').value = '';
      document.getElementById('article-btn-text').value = '';
      document.getElementById('article-btn-href').value = '';
      
      toggleModalFields();
      document.getElementById('item-modal').style.display = 'flex';
    }

    function openEditModal(index) {
      itemModalContext = 'homepage';
      const item = currentContent.items[index];
      document.getElementById('modal-title').textContent = 'முகப்பு உறுப்பைத் திருத்துக';
      document.getElementById('edit-item-id').value = index;

      document.getElementById('item-type').value = item.type;
      if (item.type === 'text') {
        document.getElementById('text-style').value = item.style || 'p';
        document.getElementById('text-content').value = item.text || '';
      } else if (item.type === 'image') {
        document.getElementById('image-src').value = item.src || '';
        document.getElementById('image-alt').value = item.alt || '';
      } else if (item.type === 'link') {
        document.getElementById('link-text').value = item.text || '';
        document.getElementById('link-href').value = item.href || '';
        document.getElementById('link-style').value = item.style || 'button-primary';
        document.getElementById('link-target').value = item.target || '_self';
      } else if (item.type === 'article') {
        document.getElementById('article-title').value = item.title || '';
        document.getElementById('article-image').value = item.image || '';
        document.getElementById('article-content').value = item.content || '';
        document.getElementById('article-btn-text').value = item.btnText || '';
        document.getElementById('article-btn-href').value = item.btnHref || '';
      }

      toggleModalFields();
      document.getElementById('item-modal').style.display = 'flex';
    }

    function toggleModalFields() {
      const type = document.getElementById('item-type').value;
      document.querySelectorAll('.modal-fields').forEach(el => el.style.display = 'none');
      document.getElementById('fields-' + type).style.display = 'block';
    }

    function closeModal() {
      document.getElementById('item-modal').style.display = 'none';
    }

    function saveItem() {
      const type = document.getElementById('item-type').value;
      const editIndex = document.getElementById('edit-item-id').value;

      let item = { type };
      if (type === 'text') {
        item.style = document.getElementById('text-style').value;
        item.text = document.getElementById('text-content').value.trim();
        if (!item.text) { alert('தயவுசெய்து உரையை உள்ளிடவும்.'); return; }
      } else if (type === 'image') {
        item.src = document.getElementById('image-src').value.trim();
        item.alt = document.getElementById('image-alt').value.trim();
        if (!item.src) { alert('படத்தின் கோப்பு பெயரை உள்ளிடவும்.'); return; }
      } else if (type === 'link') {
        item.text = document.getElementById('link-text').value.trim();
        item.href = document.getElementById('link-href').value.trim();
        item.style = document.getElementById('link-style').value;
        item.target = document.getElementById('link-target').value;
        if (!item.text || !item.href) { alert('பொத்தான் உரை மற்றும் முகவரியை உள்ளிடவும்.'); return; }
      } else if (type === 'article') {
        item.title = document.getElementById('article-title').value.trim();
        item.image = document.getElementById('article-image').value.trim();
        item.content = document.getElementById('article-content').value.trim();
        item.btnText = document.getElementById('article-btn-text').value.trim();
        item.btnHref = document.getElementById('article-btn-href').value.trim();
        if (!item.title || !item.content) { alert('செய்தித் தலைப்பு மற்றும் விளக்கத்தை உள்ளிடவும்.'); return; }
      } else if (type === 'divider') {
        item = { type: 'divider' };
      }

      const targetItems = (itemModalContext === 'page' && activePageIndex >= 0)
        ? currentContent.pages[activePageIndex].items
        : currentContent.items;

      if (!targetItems) {
        alert('பிழை: உறுப்புகள் பட்டியல் கிடைக்கவில்லை.');
        return;
      }

      if (editIndex !== '') {
        item.id = targetItems[editIndex].id || ('item_' + Date.now());
        targetItems[editIndex] = item;
      } else {
        item.id = 'item_' + Date.now();
        targetItems.push(item);
      }

      closeModal();
      if (itemModalContext === 'page') {
        renderPageBlocks();
      } else {
        renderItems();
      }
    }

    // ── Baukasten Pages Management ──
    function renderPages() {
      const container = document.getElementById('pages-list-container');
      if (!container) return;
      container.innerHTML = '';

      if (!currentContent.pages) currentContent.pages = [];

      if (currentContent.pages.length === 0) {
        container.innerHTML = '<div style="color: var(--text-muted); text-align: center; padding: 20px;">Baukasten பக்கங்கள் எதுவும் இல்லை. ➕ புதிய பக்கம் சேர்க்கவும்.</div>';
        document.getElementById('page-blocks-editor').style.display = 'none';
        return;
      }

      currentContent.pages.forEach((page, index) => {
        const card = document.createElement('div');
        card.className = 'item-card';
        const navBadge = page.showInNav !== false
          ? '<span class="item-type-badge badge-link" style="margin-left:5px;">📌 மெனுவில்</span>'
          : '<span class="item-type-badge badge-text" style="margin-left:5px;">🔒 மறை</span>';
        const blockCount = (page.items || []).length;
        card.innerHTML = `
          <div class="item-info">
            <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
              <span class="item-type-badge badge-image">Baukasten பக்கம்</span>
              ${navBadge}
            </div>
            <div class="item-preview">${escapeHtml(page.title || page.slug)}</div>
            <div class="item-subtext">URL: page.html?p=${escapeHtml(page.slug)} | ${blockCount} உறுப்புகள்</div>
          </div>
          <div class="item-controls">
            <button class="icon-btn" onclick="editPageBlocks(${index})" title="உறுப்புகளைத் திருத்து">🧱</button>
            <button class="icon-btn" onclick="openEditPageModal(${index})" title="பக்க விபரம்">✏️</button>
            <button class="icon-btn" onclick="previewPageByIndex(${index})" title="முன்னோட்டம்">👁️</button>
            <button class="icon-btn" onclick="deletePage(${index})" title="நீக்கு">🗑️</button>
          </div>
        `;
        container.appendChild(card);
      });
    }

    function previewPage(slug) {
      window.open('page.html?p=' + encodeURIComponent(slug) + '&preview=1', '_blank');
    }

    function previewPageByIndex(index) {
      const page = currentContent.pages[index];
      if (page) previewPage(page.slug);
    }

    function openAddPageModal() {
      document.getElementById('page-modal-title').textContent = 'புதிய Baukasten பக்கம்';
      document.getElementById('edit-page-id').value = '';
      document.getElementById('page-title-input').value = '';
      document.getElementById('page-slug-input').value = '';
      document.getElementById('page-show-nav').value = 'true';
      document.getElementById('page-nav-order').value = currentContent.pages.length;
      updateSlugPreview();
      document.getElementById('page-modal').style.display = 'flex';
    }

    function openEditPageModal(index) {
      const page = currentContent.pages[index];
      document.getElementById('page-modal-title').textContent = 'Baukasten பக்கத்தைத் திருத்து';
      document.getElementById('edit-page-id').value = index;
      document.getElementById('page-title-input').value = page.title || '';
      document.getElementById('page-slug-input').value = page.slug || '';
      document.getElementById('page-show-nav').value = page.showInNav !== false ? 'true' : 'false';
      document.getElementById('page-nav-order').value = page.navOrder || 0;
      updateSlugPreview();
      document.getElementById('page-modal').style.display = 'flex';
    }

    function closePageModal() {
      document.getElementById('page-modal').style.display = 'none';
    }

    function updateSlugPreview() {
      const slug = document.getElementById('page-slug-input').value.trim() || 'slug';
      const preview = document.getElementById('slug-preview');
      if (preview) preview.textContent = slug;
    }

    document.addEventListener('DOMContentLoaded', function () {
      const slugInput = document.getElementById('page-slug-input');
      if (slugInput) {
        slugInput.addEventListener('input', function () {
          this.value = this.value.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');
          updateSlugPreview();
        });
      }
    });

    function savePage() {
      const title = document.getElementById('page-title-input').value.trim();
      const slug = document.getElementById('page-slug-input').value.trim();
      const showInNav = document.getElementById('page-show-nav').value === 'true';
      const navOrder = parseInt(document.getElementById('page-nav-order').value) || 0;
      const editIndex = document.getElementById('edit-page-id').value;

      if (!title || !slug) {
        alert('தலைப்பு மற்றும் slug இரண்டையும் உள்ளிடவும்.');
        return;
      }

      const duplicate = currentContent.pages.findIndex(function (p, i) {
        return p.slug === slug && String(i) !== String(editIndex);
      });
      if (duplicate >= 0) {
        alert('இந்த slug ஏற்கனவே பயன்பாட்டில் உள்ளது. வேறு slug தேர்ந்தெடுக்கவும்.');
        return;
      }

      const pageData = {
        id: editIndex !== '' ? currentContent.pages[editIndex].id : ('page_' + Date.now()),
        slug: slug,
        title: title,
        showInNav: showInNav,
        navOrder: navOrder,
        items: editIndex !== '' ? (currentContent.pages[editIndex].items || []) : []
      };

      if (editIndex !== '') {
        currentContent.pages[editIndex] = pageData;
      } else {
        currentContent.pages.push(pageData);
        activePageIndex = currentContent.pages.length - 1;
      }

      closePageModal();
      renderPages();
      if (activePageIndex >= 0) editPageBlocks(activePageIndex);
    }

    function deletePage(index) {
      const page = currentContent.pages[index];
      if (confirm('"' + (page.title || page.slug) + '" பக்கத்தை நீக்க விரும்புகிறீர்களா?')) {
        currentContent.pages.splice(index, 1);
        if (activePageIndex === index) {
          activePageIndex = -1;
          document.getElementById('page-blocks-editor').style.display = 'none';
        }
        renderPages();
      }
    }

    function editPageBlocks(index) {
      activePageIndex = index;
      const page = currentContent.pages[index];
      if (!page.items) page.items = [];

      document.getElementById('page-blocks-editor').style.display = 'block';
      document.getElementById('page-blocks-title').textContent =
        '🧱 "' + (page.title || page.slug) + '" – உறுப்புகள்';
      renderPageBlocks();

      document.getElementById('page-blocks-editor').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function renderPageBlocks() {
      const container = document.getElementById('page-blocks-container');
      if (!container || activePageIndex < 0) return;
      container.innerHTML = '';

      const items = currentContent.pages[activePageIndex].items || [];
      if (items.length === 0) {
        container.innerHTML = '<div style="color: var(--text-muted); text-align: center; padding: 20px;">இந்தப் பக்கத்தில் உறுப்புகள் இல்லை. ➕ உறுப்பைச் சேர்க்கவும்.</div>';
        return;
      }

      items.forEach(function (item, index) {
        const card = document.createElement('div');
        card.className = 'item-card';
        let badge = 'உரை', badgeClass = 'badge-text', preview = item.text || '', sub = '';

        if (item.type === 'text') {
          badge = item.style === 'h1' ? 'தலைப்பு 1' : (item.style === 'h2' ? 'தலைப்பு 2' : 'உரைநடை');
        } else if (item.type === 'image') {
          badge = 'படம்'; badgeClass = 'badge-image'; preview = item.src; sub = item.alt || '';
        } else if (item.type === 'link') {
          badge = 'பொத்தான்'; badgeClass = 'badge-link'; preview = item.text; sub = item.href;
        } else if (item.type === 'article') {
          badge = 'கட்டுரை'; badgeClass = 'badge-image'; preview = item.title;
        } else if (item.type === 'divider') {
          badge = 'பிரிப்பு'; preview = '— — —';
        }

        card.innerHTML = `
          <div class="item-info">
            <span class="item-type-badge ${badgeClass}">${badge}</span>
            <div class="item-preview">${escapeHtml(preview)}</div>
            <div class="item-subtext">${escapeHtml(sub)}</div>
          </div>
          <div class="item-controls">
            <button class="icon-btn" onclick="movePageBlock(${index}, -1)" ${index === 0 ? 'disabled style="opacity:0.3"' : ''}>▲</button>
            <button class="icon-btn" onclick="movePageBlock(${index}, 1)" ${index === items.length - 1 ? 'disabled style="opacity:0.3"' : ''}>▼</button>
            <button class="icon-btn" onclick="openEditPageBlockModal(${index})">✏️</button>
            <button class="icon-btn" onclick="deletePageBlock(${index})">🗑️</button>
          </div>
        `;
        container.appendChild(card);
      });
    }

    function openAddPageBlockModal() {
      if (activePageIndex < 0) { alert('முதலில் ஒரு பக்கத்தைத் தேர்ந்தெடுக்கவும்.'); return; }
      itemModalContext = 'page';
      document.getElementById('modal-title').textContent = 'பக்க உறுப்பைச் சேர்';
      document.getElementById('edit-item-id').value = '';
      document.getElementById('item-type').value = 'text';
      document.getElementById('text-style').value = 'p';
      document.getElementById('text-content').value = '';
      document.getElementById('image-src').value = '';
      document.getElementById('image-alt').value = '';
      document.getElementById('link-text').value = '';
      document.getElementById('link-href').value = '';
      document.getElementById('link-style').value = 'button-primary';
      document.getElementById('link-target').value = '_self';
      document.getElementById('article-title').value = '';
      document.getElementById('article-image').value = '';
      document.getElementById('article-content').value = '';
      document.getElementById('article-btn-text').value = '';
      document.getElementById('article-btn-href').value = '';
      toggleModalFields();
      document.getElementById('item-modal').style.display = 'flex';
    }

    function openEditPageBlockModal(index) {
      if (activePageIndex < 0) return;
      itemModalContext = 'page';
      const item = currentContent.pages[activePageIndex].items[index];
      document.getElementById('modal-title').textContent = 'பக்க உறுப்பைத் திருத்து';
      document.getElementById('edit-item-id').value = index;
      document.getElementById('item-type').value = item.type;
      if (item.type === 'text') {
        document.getElementById('text-style').value = item.style || 'p';
        document.getElementById('text-content').value = item.text || '';
      } else if (item.type === 'image') {
        document.getElementById('image-src').value = item.src || '';
        document.getElementById('image-alt').value = item.alt || '';
      } else if (item.type === 'link') {
        document.getElementById('link-text').value = item.text || '';
        document.getElementById('link-href').value = item.href || '';
        document.getElementById('link-style').value = item.style || 'button-primary';
        document.getElementById('link-target').value = item.target || '_self';
      } else if (item.type === 'article') {
        document.getElementById('article-title').value = item.title || '';
        document.getElementById('article-image').value = item.image || '';
        document.getElementById('article-content').value = item.content || '';
        document.getElementById('article-btn-text').value = item.btnText || '';
        document.getElementById('article-btn-href').value = item.btnHref || '';
      }
      toggleModalFields();
      document.getElementById('item-modal').style.display = 'flex';
    }

    function movePageBlock(index, direction) {
      if (activePageIndex < 0) return;
      const items = currentContent.pages[activePageIndex].items;
      const newIndex = index + direction;
      if (newIndex < 0 || newIndex >= items.length) return;
      const temp = items[index];
      items[index] = items[newIndex];
      items[newIndex] = temp;
      renderPageBlocks();
    }

    function deletePageBlock(index) {
      if (activePageIndex < 0) return;
      if (confirm('இந்த உறுப்பை நீக்கலாமா?')) {
        currentContent.pages[activePageIndex].items.splice(index, 1);
        renderPageBlocks();
      }
    }

    // Categories Logic
    function renderCategories() {
      const container = document.getElementById('categories-container');
      container.innerHTML = '';

      if (!currentContent.ageCategories || currentContent.ageCategories.length === 0) {
        container.innerHTML = '<div style="color: var(--text-muted); text-align: center; padding: 20px;">பிரிவுகள் எதுவும் இல்லை.</div>';
        return;
      }

      currentContent.ageCategories.forEach((cat, index) => {
        const card = document.createElement('div');
        card.className = 'item-card';

        const gamesStr = cat.games ? cat.games.join(', ') : 'போட்டிகள் இல்லை';

        card.innerHTML = `
          <div class="item-info">
            <span class="item-type-badge badge-category">பிரிவு (வயது வரம்பு)</span>
            <div class="item-preview">${escapeHtml(cat.name)}</div>
            <div class="item-subtext">விளையாட்டுகள்: ${escapeHtml(gamesStr)}</div>
          </div>
          <div class="item-controls">
            <button class="icon-btn" onclick="moveCategory(${index}, -1)" ${index === 0 ? 'disabled style="opacity:0.3"' : ''}>▲</button>
            <button class="icon-btn" onclick="moveCategory(${index}, 1)" ${index === currentContent.ageCategories.length - 1 ? 'disabled style="opacity:0.3"' : ''}>▼</button>
            <button class="icon-btn" onclick="openEditCategoryModal(${index})">✏️</button>
            <button class="icon-btn" onclick="deleteCategory(${index})">🗑️</button>
          </div>
        `;
        container.appendChild(card);
      });
    }

    function moveCategory(index, direction) {
      const newIndex = index + direction;
      if (newIndex < 0 || newIndex >= currentContent.ageCategories.length) return;
      const temp = currentContent.ageCategories[index];
      currentContent.ageCategories[index] = currentContent.ageCategories[newIndex];
      currentContent.ageCategories[newIndex] = temp;
      renderCategories();
    }

    function deleteCategory(index) {
      if (confirm('இந்த வயதுப்பிரிவை நீக்க விரும்புகிறீர்களா? படிவத்தில் இந்த வயதினர் விண்ணப்பிக்க முடியாது.')) {
        currentContent.ageCategories.splice(index, 1);
        renderCategories();
      }
    }

    function openCategoryModal() {
      document.getElementById('cat-modal-title').textContent = 'வயதுப்பிரிவைச் சேர்';
      document.getElementById('edit-cat-id').value = '';
      document.getElementById('cat-name').value = '';
      document.getElementById('cat-start').value = '';
      document.getElementById('cat-end').value = '';
      document.getElementById('cat-games').value = '';
      document.getElementById('category-modal').style.display = 'flex';
    }

    function openEditCategoryModal(index) {
      const cat = currentContent.ageCategories[index];
      document.getElementById('cat-modal-title').textContent = 'வயதுப்பிரிவைத் திருத்துக';
      document.getElementById('edit-cat-id').value = index;

      document.getElementById('cat-name').value = cat.name || '';
      document.getElementById('cat-start').value = cat.start || '';
      document.getElementById('cat-end').value = cat.end || '';
      document.getElementById('cat-games').value = cat.games ? cat.games.join(', ') : '';

      document.getElementById('category-modal').style.display = 'flex';
    }

    function closeCategoryModal() {
      document.getElementById('category-modal').style.display = 'none';
    }

    function saveCategory() {
      const name = document.getElementById('cat-name').value.trim();
      let start = document.getElementById('cat-start').value;
      let end = document.getElementById('cat-end').value;
      const gamesRaw = document.getElementById('cat-games').value.trim();
      const editIndex = document.getElementById('edit-cat-id').value;

      start = formatToISODate(start);
      end = formatToISODate(end);
      document.getElementById('cat-start').value = start;
      document.getElementById('cat-end').value = end;

      if (!name || !start || !end) {
        alert('விபரங்களை சரியாக உள்ளிடவும் (பெயர், தொடக்கம் மற்றும் முடிவுத் திகதிகள் அவசியம்).');
        return;
      }

      const games = gamesRaw ? gamesRaw.split(',').map(g => g.trim()).filter(g => g !== '') : [];

      const category = { name, start, end, games };

      if (editIndex !== '') {
        category.id = currentContent.ageCategories[editIndex].id || ('cat_' + Date.now());
        currentContent.ageCategories[editIndex] = category;
      } else {
        category.id = 'cat_' + Date.now();
        currentContent.ageCategories.push(category);
      }

      closeCategoryModal();
      renderCategories();
    }

    // Exams Portal Sections Management
    function renderExamsSections() {
      const container = document.getElementById('exams-sections-container');
      container.innerHTML = '';
      
      if (!currentContent.examsConfig) {
        currentContent.examsConfig = { title: "தேர்வுகள் (Exams Portal)", sections: [] };
      }
      if (!currentContent.examsConfig.sections) {
        currentContent.examsConfig.sections = [];
      }
      
      currentContent.examsConfig.sections.forEach((section, index) => {
        const item = document.createElement('div');
        item.className = 'item-row';
        item.innerHTML = `
          <div class="item-info">
            <strong>${escapeHtml(section.title)}</strong>
            <div style="font-size:12px; color:#64748b; margin-top:4px;">
              ${escapeHtml(section.content.substring(0, 100))}${section.content.length > 100 ? '...' : ''}
            </div>
          </div>
          <div class="item-actions">
            <button class="action-btn" onclick="moveExamSection(${index}, -1)" ${index === 0 ? 'disabled' : ''}>▲</button>
            <button class="action-btn" onclick="moveExamSection(${index}, 1)" ${index === currentContent.examsConfig.sections.length - 1 ? 'disabled' : ''}>▼</button>
            <button class="action-btn edit-btn" onclick="openEditExamSectionModal(${index})">திருத்து</button>
            <button class="action-btn delete-btn" onclick="deleteExamSection(${index})">நீக்கு</button>
          </div>
        `;
        container.appendChild(item);
      });
    }

    function openExamSectionModal() {
      document.getElementById('exam-section-modal-title').textContent = 'தேர்வுப் பகுதியைச் சேர்';
      document.getElementById('edit-exam-section-id').value = '';
      document.getElementById('exam-section-title').value = '';
      document.getElementById('exam-section-content').value = '';
      document.getElementById('exam-section-modal').style.display = 'flex';
    }

    function openEditExamSectionModal(index) {
      const section = currentContent.examsConfig.sections[index];
      document.getElementById('exam-section-modal-title').textContent = 'தேர்வுப் பகுதியைத் திருத்துக';
      document.getElementById('edit-exam-section-id').value = index;
      document.getElementById('exam-section-title').value = section.title || '';
      document.getElementById('exam-section-content').value = section.content || '';
      document.getElementById('exam-section-modal').style.display = 'flex';
    }

    function closeExamSectionModal() {
      document.getElementById('exam-section-modal').style.display = 'none';
    }

    function saveExamSection() {
      const title = document.getElementById('exam-section-title').value.trim();
      const content = document.getElementById('exam-section-content').value.trim();
      const editIndex = document.getElementById('edit-exam-section-id').value;

      if (!title || !content) {
        alert('பகுதியின் தலைப்பு மற்றும் விளக்கம் ஆகிய இரண்டும் கட்டாயம் உள்ளிடப்பட வேண்டும்.');
        return;
      }

      const section = { title, content };

      if (editIndex !== '') {
        currentContent.examsConfig.sections[editIndex] = section;
      } else {
        currentContent.examsConfig.sections.push(section);
      }

      closeExamSectionModal();
      renderExamsSections();
    }

    function deleteExamSection(index) {
      if (confirm('இந்தத் தேர்வுப் பகுதியை நீக்க விரும்புகிறீர்களா?')) {
        currentContent.examsConfig.sections.splice(index, 1);
        renderExamsSections();
      }
    }

    function moveExamSection(index, direction) {
      const newIndex = index + direction;
      if (newIndex < 0 || newIndex >= currentContent.examsConfig.sections.length) return;
      const temp = currentContent.examsConfig.sections[index];
      currentContent.examsConfig.sections[index] = currentContent.examsConfig.sections[newIndex];
      currentContent.examsConfig.sections[newIndex] = temp;
      renderExamsSections();
    }

    // Events Calendar Timeline Management
    function renderEventsTimeline() {
      const container = document.getElementById('events-timeline-container');
      container.innerHTML = '';
      
      if (!currentContent.eventsConfig) {
        currentContent.eventsConfig = { title: "நிகழ்வுகள் (Events Calendar)", timeline: [] };
      }
      if (!currentContent.eventsConfig.timeline) {
        currentContent.eventsConfig.timeline = [];
      }
      
      currentContent.eventsConfig.timeline.forEach((event, index) => {
        const item = document.createElement('div');
        item.className = 'item-row';
        item.innerHTML = `
          <div class="item-info">
            <strong>${escapeHtml(event.title)} (${escapeHtml(event.date)})</strong>
            <div style="font-size:12px; color:#64748b; margin-top:4px;">
              ${escapeHtml(event.description)}
            </div>
          </div>
          <div class="item-actions">
            <button class="action-btn" onclick="moveEventTimeline(${index}, -1)" ${index === 0 ? 'disabled' : ''}>▲</button>
            <button class="action-btn" onclick="moveEventTimeline(${index}, 1)" ${index === currentContent.eventsConfig.timeline.length - 1 ? 'disabled' : ''}>▼</button>
            <button class="action-btn edit-btn" onclick="openEditEventTimelineModal(${index})">திருத்து</button>
            <button class="action-btn delete-btn" onclick="deleteEventTimeline(${index})">நீக்கு</button>
          </div>
        `;
        container.appendChild(item);
      });
    }

    function openEventTimelineModal() {
      document.getElementById('event-timeline-modal-title').textContent = 'புதிய நிகழ்வைச் சேர்';
      document.getElementById('edit-event-timeline-id').value = '';
      document.getElementById('event-timeline-date').value = '';
      document.getElementById('event-timeline-title').value = '';
      document.getElementById('event-timeline-desc').value = '';
      document.getElementById('event-timeline-modal').style.display = 'flex';
    }

    function openEditEventTimelineModal(index) {
      const event = currentContent.eventsConfig.timeline[index];
      document.getElementById('event-timeline-modal-title').textContent = 'நிகழ்வைத் திருத்துக';
      document.getElementById('edit-event-timeline-id').value = index;
      document.getElementById('event-timeline-date').value = event.date || '';
      document.getElementById('event-timeline-title').value = event.title || '';
      document.getElementById('event-timeline-desc').value = event.description || '';
      document.getElementById('event-timeline-modal').style.display = 'flex';
    }

    function closeEventTimelineModal() {
      document.getElementById('event-timeline-modal').style.display = 'none';
    }

    function saveEventTimeline() {
      const date = document.getElementById('event-timeline-date').value.trim();
      const title = document.getElementById('event-timeline-title').value.trim();
      const description = document.getElementById('event-timeline-desc').value.trim();
      const editIndex = document.getElementById('edit-event-timeline-id').value;

      if (!date || !title || !description) {
        alert('நிகழ்வின் திகதி, தலைப்பு மற்றும் விளக்கம் ஆகிய அனைத்தும் கட்டாயம் உள்ளிடப்பட வேண்டும்.');
        return;
      }

      const event = { date, title, description };

      if (editIndex !== '') {
        currentContent.eventsConfig.timeline[editIndex] = event;
      } else {
        currentContent.eventsConfig.timeline.push(event);
      }

      closeEventTimelineModal();
      renderEventsTimeline();
      renderGalleryAlbums();
      renderPortalGridEditor();
    }

    function deleteEventTimeline(index) {
      if (confirm('இந்த நிகழ்வை காலண்டரில் இருந்து நீக்க விரும்புகிறீர்களா?')) {
        currentContent.eventsConfig.timeline.splice(index, 1);
        renderEventsTimeline();
      renderGalleryAlbums();
      renderPortalGridEditor();
      }
    }

    function moveEventTimeline(index, direction) {
      const newIndex = index + direction;
      if (newIndex < 0 || newIndex >= currentContent.eventsConfig.timeline.length) return;
      const temp = currentContent.eventsConfig.timeline[index];
      currentContent.eventsConfig.timeline[index] = currentContent.eventsConfig.timeline[newIndex];
      currentContent.eventsConfig.timeline[newIndex] = temp;
      renderEventsTimeline();
      renderGalleryAlbums();
      renderPortalGridEditor();
    }

            // Photo Gallery Album-based Management
    let albumPhotosTemp = []; // Holds photos for current edited album

    function renderGalleryAlbums() {
      const container = document.getElementById('gallery-albums-container');
      if (!container) return;
      container.innerHTML = '';

      if (!currentContent.galleryConfig) {
        currentContent.galleryConfig = { title: "படங்கள் (Gallery)", albums: [] };
      }
      
      // Dynamic migration fallback of old photos configuration array into albums
      if (!currentContent.galleryConfig.albums) {
        const oldPhotos = currentContent.galleryConfig.photos || [];
        if (oldPhotos.length > 0) {
          currentContent.galleryConfig.albums = [{
            id: "album_default",
            title: currentContent.galleryConfig.title || "படங்கள்",
            description: "புகைப்படத் தொகுப்பு",
            photos: oldPhotos
          }];
        } else {
          currentContent.galleryConfig.albums = [];
        }
        delete currentContent.galleryConfig.photos; // Clean up old array references
      }

      const albums = currentContent.galleryConfig.albums;

      if (albums.length === 0) {
        container.innerHTML = '<div style="color: var(--text-muted); text-align: center; padding: 20px;">கேலரியில் ஆல்பங்கள் எதுவும் இல்லை.</div>';
        return;
      }

      albums.forEach((album, index) => {
        const coverPhoto = (album.photos && album.photos.length > 0) ? album.photos[0].filename : 'IMG_3529.jpg';
        const card = document.createElement('div');
        card.className = 'item-card';

        card.innerHTML = `
          <div class="item-info" style="display:flex; align-items:center; gap: 12px; width: 100%;">
            <div style="width: 50px; height: 50px; border-radius: 6px; overflow:hidden; border: 1px solid var(--border); flex-shrink:0;">
              <img src="${escapeHtml(coverPhoto)}" style="width:100%; height:100%; object-fit:cover;" onerror="this.src='IMG_3529.jpg'">
            </div>
            <div style="flex-grow:1; text-align:left;">
              <span class="item-type-badge badge-image" style="background: rgba(128, 0, 32, 0.1); color: var(--primary);">${album.photos.length} படங்கள்</span>
              <div class="item-preview" style="font-weight:bold;">${escapeHtml(album.title)}</div>
              <div class="item-subtext">${escapeHtml(album.description || 'விளக்கம் இல்லை')}</div>
            </div>
          </div>
          <div class="item-controls" style="flex-shrink:0;">
            <button class="icon-btn" onclick="moveAlbum(${index}, -1)" ${index === 0 ? 'disabled style="opacity:0.3"' : ''}>▲</button>
            <button class="icon-btn" onclick="moveAlbum(${index}, 1)" ${index === albums.length - 1 ? 'disabled style="opacity:0.3"' : ''}>▼</button>
            <button class="icon-btn" onclick="openAlbumModal(${index})">✏️</button>
            <button class="icon-btn" onclick="deleteAlbum(${index})">🗑️</button>
          </div>
        `;
        container.appendChild(card);
      });
    }

    function handleAlbumPhotosUpload(input) {
      if (input.files && input.files.length > 0) {
        const loadingDiv = document.getElementById('album-upload-loading');
        if (loadingDiv) loadingDiv.style.display = 'block';
        
        let filesProcessed = 0;
        const totalFiles = input.files.length;
        
        for (let i = 0; i < totalFiles; i++) {
          const file = input.files[i];
          const reader = new FileReader();
          
          reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
              const canvas = document.createElement('canvas');
              const max_size = 1200; // Limit image dimensions to 1200px
              let width = img.width;
              let height = img.height;
              
              if (width > max_size || height > max_size) {
                if (width > height) {
                  height = Math.round((height * max_size) / width);
                  width = max_size;
                } else {
                  width = Math.round((width * max_size) / height);
                  height = max_size;
                }
              }
              
              canvas.width = width;
              canvas.height = height;
              const ctx = canvas.getContext('2d');
              ctx.drawImage(img, 0, 0, width, height);
              
              // Compress to JPEG at 0.75 quality
              const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.75);
              
              albumPhotosTemp.push({
                caption: '',
                filename: compressedDataUrl
              });
              
              filesProcessed++;
              if (filesProcessed === totalFiles) {
                if (loadingDiv) loadingDiv.style.display = 'none';
                renderAlbumPhotosList();
                input.value = ''; // Reset input
              }
            };
            img.src = e.target.result;
          };
          reader.readAsDataURL(file);
        }
      }
    }

    function renderAlbumPhotosList() {
      const container = document.getElementById('album-photos-list');
      if (!container) return;
      container.innerHTML = '';
      
      const countSpan = document.getElementById('album-photo-count');
      if (countSpan) countSpan.textContent = albumPhotosTemp.length + ' படங்கள்';
      
      if (albumPhotosTemp.length === 0) {
        container.innerHTML = '<div style="color: var(--text-muted); font-size:12px; font-style:italic; text-align:center; padding:15px;">ஆல்பத்தில் படங்கள் எதுவும் இல்லை. கோப்புகளைத் தேர்ந்தெடுத்துச் சேர்க்கவும்.</div>';
        return;
      }
      
      albumPhotosTemp.forEach((photo, idx) => {
        const item = document.createElement('div');
        item.style.display = 'flex';
        item.style.alignItems = 'center';
        item.style.gap = '10px';
        item.style.background = 'rgba(255,255,255,0.02)';
        item.style.padding = '8px';
        item.style.borderRadius = '6px';
        item.style.border = '1px solid var(--border)';
        item.style.marginTop = '4px';
        
        item.innerHTML = `
          <div style="width: 40px; height: 40px; border-radius: 4px; overflow:hidden; border: 1px solid var(--border); flex-shrink:0;">
            <img src="${photo.filename}" style="width:100%; height:100%; object-fit:cover;">
          </div>
          <div style="flex-grow:1; display:flex; gap:8px;">
            <input type="text" value="${escapeHtml(photo.caption || '')}" placeholder="படம் பற்றிய குறிப்பு (Caption)" onchange="updateAlbumPhotoCaption(${idx}, this.value)" style="background: rgba(255,255,255,0.05); padding: 5px 8px; border-radius: 6px; border: 1px solid var(--border); font-size:12px; width: 100%;">
          </div>
          <div style="flex-shrink:0; display:flex; gap: 4px;">
            <button class="icon-btn" onclick="moveAlbumPhoto(${idx}, -1)" ${idx === 0 ? 'disabled style="opacity:0.3"' : ''}>▲</button>
            <button class="icon-btn" onclick="moveAlbumPhoto(${idx}, 1)" ${idx === albumPhotosTemp.length - 1 ? 'disabled style="opacity:0.3"' : ''}>▼</button>
            <button class="icon-btn" onclick="deleteAlbumPhoto(${idx})">🗑️</button>
          </div>
        `;
        container.appendChild(item);
      });
    }

    function updateAlbumPhotoCaption(idx, val) {
      if (albumPhotosTemp[idx]) {
        albumPhotosTemp[idx].caption = val.trim();
      }
    }

    function moveAlbumPhoto(idx, dir) {
      const newIdx = idx + dir;
      if (newIdx < 0 || newIdx >= albumPhotosTemp.length) return;
      const temp = albumPhotosTemp[idx];
      albumPhotosTemp[idx] = albumPhotosTemp[newIdx];
      albumPhotosTemp[newIdx] = temp;
      renderAlbumPhotosList();
    }

    // Fixed spelling typo for alert
    function deleteAlbumPhoto(idx) {
      if (confirm('இந்தப் படத்தை ஆல்பத்திலிருந்து நீக்கலாமா?')) {
        albumPhotosTemp.splice(idx, 1);
        renderAlbumPhotosList();
      }
    }

    function openAlbumModal(index = null) {
      const modal = document.getElementById('album-modal');
      const titleSpan = document.getElementById('album-modal-title');
      const editIdInput = document.getElementById('edit-album-id');
      const titleInput = document.getElementById('album-title');
      const descInput = document.getElementById('album-description');
      const fileSelector = document.getElementById('album-photo-selector');
      
      if (fileSelector) fileSelector.value = '';
      
      if (index !== null) {
        const album = currentContent.galleryConfig.albums[index];
        titleSpan.textContent = 'ஆல்பத்தைத் திருத்துக';
        editIdInput.value = index;
        titleInput.value = album.title || '';
        descInput.value = album.description || '';
        albumPhotosTemp = JSON.parse(JSON.stringify(album.photos || [])); // Deep clone
      } else {
        titleSpan.textContent = 'புதிய ஆல்பம் உருவாக்கு';
        editIdInput.value = '';
        titleInput.value = '';
        descInput.value = '';
        albumPhotosTemp = [];
      }
      
      renderAlbumPhotosList();
      modal.style.display = 'flex';
    }

    function closeAlbumModal() {
      document.getElementById('album-modal').style.display = 'none';
    }

    function saveAlbum() {
      const titleInput = document.getElementById('album-title');
      const descInput = document.getElementById('album-description');
      const editIndex = document.getElementById('edit-album-id').value;
      
      const title = titleInput.value.trim();
      const description = descInput.value.trim();
      
      if (!title) {
        alert('ஆல்பத்தின் தலைப்பை உள்ளிடவும்.');
        return;
      }
      
      const albums = currentContent.galleryConfig.albums;
      const albumObj = {
        id: editIndex !== '' ? albums[editIndex].id : ('album_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)),
        title: title,
        description: description,
        photos: albumPhotosTemp
      };
      
      if (editIndex !== '') {
        albums[editIndex] = albumObj;
      } else {
        albums.push(albumObj);
      }
      
      closeAlbumModal();
      renderGalleryAlbums();
    }

    function deleteAlbum(index) {
      if (confirm('இந்த ஆல்பத்தையும், அதற்குள் இருக்கும் அனைத்துப் படங்களையும் நிரந்தரமாக நீக்கலாமா?')) {
        currentContent.galleryConfig.albums.splice(index, 1);
        renderGalleryAlbums();
      }
    }

    function moveAlbum(index, direction) {
      const newIndex = index + direction;
      const albums = currentContent.galleryConfig.albums;
      if (newIndex < 0 || newIndex >= albums.length) return;
      const temp = albums[index];
      albums[index] = albums[newIndex];
      albums[newIndex] = temp;
      renderGalleryAlbums();
    }

    function deletePhoto(index) {
      if (confirm('இந்த புகைப்படத்தை கேலரியில் இருந்து நீக்கலாமா?')) {
        currentContent.galleryConfig.photos.splice(index, 1);
        renderGalleryAlbums();
      renderPortalGridEditor();
      }
    }

    function movePhoto(index, direction) {
      const newIndex = index + direction;
      if (newIndex < 0 || newIndex >= currentContent.galleryConfig.photos.length) return;
      const temp = currentContent.galleryConfig.photos[index];
      currentContent.galleryConfig.photos[index] = currentContent.galleryConfig.photos[newIndex];
      currentContent.galleryConfig.photos[newIndex] = temp;
      renderGalleryAlbums();
      renderPortalGridEditor();
    }


        // Homepage Portal Grid Cards Management
    function renderPortalGridEditor() {
      const container = document.getElementById('portal-grid-container');
      container.innerHTML = '';

      if (!currentContent.portalGridConfig) {
        currentContent.portalGridConfig = [];
      }

      currentContent.portalGridConfig.forEach((card, index) => {
        const itemCard = document.createElement('div');
        itemCard.className = 'item-card';
        itemCard.innerHTML = `
          <div class="item-info" style="display: flex; align-items: center; gap: 15px;">
            <div style="font-size: 24px; width: 40px; height: 40px; background: rgba(255,255,255,0.05); border: 1px solid var(--border); border-radius: 8px; display:flex; align-items:center; justify-content:center;">
              ${escapeHtml(card.icon)}
            </div>
            <div>
              <div class="item-preview">${escapeHtml(card.title)} (பக்கம்: ${escapeHtml(card.href)})</div>
              <div class="item-subtext">${escapeHtml(card.desc)}</div>
            </div>
          </div>
          <div class="item-controls">
            <button class="icon-btn" onclick="moveGridCard(${index}, -1)" ${index === 0 ? 'disabled style="opacity:0.3"' : ''}>▲</button>
            <button class="icon-btn" onclick="moveGridCard(${index}, 1)" ${index === currentContent.portalGridConfig.length - 1 ? 'disabled style="opacity:0.3"' : ''}>▼</button>
            <button class="icon-btn" onclick="openGridCardModal(${index})">✏️</button>
            <button class="icon-btn" onclick="deleteGridCard(${index})">🗑️</button>
          </div>
        `;
        container.appendChild(itemCard);
      });
    }

    function openGridCardModal(index = null) {
      if (index !== null) {
        document.getElementById('grid-card-modal-title').textContent = 'இணைப்பைத் திருத்துக';
        document.getElementById('edit-grid-card-id').value = index;
        const card = currentContent.portalGridConfig[index];
        document.getElementById('grid-card-icon').value = card.icon || '';
        document.getElementById('grid-card-title').value = card.title || '';
        document.getElementById('grid-card-desc').value = card.desc || '';
        document.getElementById('grid-card-href').value = card.href || '';
      } else {
        document.getElementById('grid-card-modal-title').textContent = 'புதிய இணைப்பு சேர்';
        document.getElementById('edit-grid-card-id').value = '';
        document.getElementById('grid-card-icon').value = '';
        document.getElementById('grid-card-title').value = '';
        document.getElementById('grid-card-desc').value = '';
        document.getElementById('grid-card-href').value = '';
      }
      document.getElementById('grid-card-modal').style.display = 'flex';
    }

    function closeGridCardModal() {
      document.getElementById('grid-card-modal').style.display = 'none';
    }

    function saveGridCard() {
      const icon = document.getElementById('grid-card-icon').value.trim();
      const title = document.getElementById('grid-card-title').value.trim();
      const desc = document.getElementById('grid-card-desc').value.trim();
      const href = document.getElementById('grid-card-href').value.trim();
      const editIndex = document.getElementById('edit-grid-card-id').value;

      if (!icon || !title || !desc || !href) {
        alert('அனைத்துப் பெட்டிகளையும் பூர்த்தி செய்யவும்.');
        return;
      }

      const cardObj = { icon, title, desc, href };

      if (editIndex !== '') {
        currentContent.portalGridConfig[editIndex] = cardObj;
      } else {
        currentContent.portalGridConfig.push(cardObj);
      }

      closeGridCardModal();
      renderPortalGridEditor();
    }

    function deleteGridCard(index) {
      if (confirm('இந்த இணைப்பை முகப்பில் இருந்து நீக்க விரும்புகிறீர்களா?')) {
        currentContent.portalGridConfig.splice(index, 1);
        renderPortalGridEditor();
      }
    }

    function moveGridCard(index, direction) {
      const newIndex = index + direction;
      if (newIndex < 0 || newIndex >= currentContent.portalGridConfig.length) return;
      const temp = currentContent.portalGridConfig[index];
      currentContent.portalGridConfig[index] = currentContent.portalGridConfig[newIndex];
      currentContent.portalGridConfig[newIndex] = temp;
      renderPortalGridEditor();
    }


    // PDF Vault File Management
    let pdfGroupFilesTemp = []; // Holds files for current edited PDF group

    function renderPdfs() {
      const container = document.getElementById('vault-container');
      if (!container) return;
      container.innerHTML = '';

      if (!currentContent.vaultConfig) {
        currentContent.vaultConfig = { userPasswordPlaceholder: "உள்நுழையவும்", users: [], pdfs: [] };
      }
      if (!currentContent.vaultConfig.pdfs) {
        currentContent.vaultConfig.pdfs = [];
      }

      const pdfGroups = currentContent.vaultConfig.pdfs;

      // Migrate flat PDF list to group structure in memory if needed
      pdfGroups.forEach(group => {
        if (!group.files) {
          group.files = [{
            name: group.title || "ஆவணம்",
            filename: group.filename
          }];
        }
      });

      if (pdfGroups.length === 0) {
        container.innerHTML = '<div style="color: var(--text-muted); text-align: center; padding: 20px;">காப்பகத்தில் கோப்புகள் எதுவும் இல்லை.</div>';
        return;
      }

      pdfGroups.forEach((group, index) => {
        const card = document.createElement('div');
        card.className = 'item-card';

        card.innerHTML = `
          <div class="item-info" style="text-align:left;">
            <span class="item-type-badge badge-image" style="background: rgba(16, 185, 129, 0.1); color: #10b981;">${group.files.length} கோப்புகள் (PDFs)</span>
            <div class="item-preview" style="font-weight:bold;">${escapeHtml(group.title)}</div>
            <div class="item-subtext">விளக்கம்: ${escapeHtml(group.description || 'விளக்கம் இல்லை')}</div>
          </div>
          <div class="item-controls">
            <button class="icon-btn" onclick="movePdfGroup(${index}, -1)" ${index === 0 ? 'disabled style="opacity:0.3"' : ''}>▲</button>
            <button class="icon-btn" onclick="movePdfGroup(${index}, 1)" ${index === pdfGroups.length - 1 ? 'disabled style="opacity:0.3"' : ''}>▼</button>
            <button class="icon-btn" onclick="openPdfModal(${index})">✏️</button>
            <button class="icon-btn" onclick="deletePdfGroup(${index})">🗑️</button>
          </div>
        `;
        container.appendChild(card);
      });
    }

    function handlePdfGroupUpload(input) {
      if (input.files && input.files.length > 0) {
        let filesProcessed = 0;
        const totalFiles = input.files.length;
        
        for (let i = 0; i < totalFiles; i++) {
          const file = input.files[i];
          const reader = new FileReader();
          
          reader.onload = (e) => {
            pdfGroupFilesTemp.push({
              name: file.name.replace(/\.[^/.]+$/, ""), // Default title is filename without extension
              filename: e.target.result // Base64 content
            });
            
            filesProcessed++;
            if (filesProcessed === totalFiles) {
              renderPdfGroupFilesList();
              input.value = ''; // Reset input
            }
          };
          reader.readAsDataURL(file);
        }
      }
    }

    function renderPdfGroupFilesList() {
      const container = document.getElementById('pdf-group-files-list');
      if (!container) return;
      container.innerHTML = '';
      
      if (pdfGroupFilesTemp.length === 0) {
        container.innerHTML = '<div style="color: var(--text-muted); font-size:12px; font-style:italic; text-align:center; padding:15px;">குழுவில் கோப்புகள் எதுவும் இல்லை. கோப்புகளைத் தேர்ந்தெடுத்துச் சேர்க்கவும்.</div>';
        return;
      }
      
      pdfGroupFilesTemp.forEach((file, idx) => {
        const item = document.createElement('div');
        item.style.display = 'flex';
        item.style.alignItems = 'center';
        item.style.gap = '10px';
        item.style.background = 'rgba(255,255,255,0.02)';
        item.style.padding = '8px';
        item.style.borderRadius = '6px';
        item.style.border = '1px solid var(--border)';
        item.style.marginTop = '4px';
        
        item.innerHTML = `
          <div style="font-size: 20px; flex-shrink:0;">📄</div>
          <div style="flex-grow:1; text-align:left;">
            <input type="text" value="${escapeHtml(file.name)}" placeholder="கோப்பின் பெயர் (Name)" onchange="updatePdfGroupFileName(${idx}, this.value)" style="background: rgba(255,255,255,0.05); padding: 5px 8px; border-radius: 6px; border: 1px solid var(--border); font-size:12px; width: 100%;">
          </div>
          <div style="flex-shrink:0; display:flex; gap: 4px;">
            <button class="icon-btn" onclick="movePdfGroupFile(${idx}, -1)" ${idx === 0 ? 'disabled style="opacity:0.3"' : ''}>▲</button>
            <button class="icon-btn" onclick="movePdfGroupFile(${idx}, 1)" ${idx === pdfGroupFilesTemp.length - 1 ? 'disabled style="opacity:0.3"' : ''}>▼</button>
            <button class="icon-btn" onclick="deletePdfGroupFile(${idx})">🗑️</button>
          </div>
        `;
        container.appendChild(item);
      });
    }

    function updatePdfGroupFileName(idx, val) {
      if (pdfGroupFilesTemp[idx]) {
        pdfGroupFilesTemp[idx].name = val.trim();
      }
    }

    function movePdfGroupFile(idx, dir) {
      const newIdx = idx + dir;
      if (newIdx < 0 || newIdx >= pdfGroupFilesTemp.length) return;
      const temp = pdfGroupFilesTemp[idx];
      pdfGroupFilesTemp[idx] = pdfGroupFilesTemp[newIdx];
      pdfGroupFilesTemp[newIdx] = temp;
      renderPdfGroupFilesList();
    }

    function deletePdfGroupFile(idx) {
      if (confirm('இந்தக் கோப்பை ஆவணக் குழுவிலிருந்து நீக்கலாமா?')) {
        pdfGroupFilesTemp.splice(idx, 1);
        renderPdfGroupFilesList();
      }
    }

    function openPdfModal(index = null) {
      const modal = document.getElementById('pdf-modal');
      const titleSpan = document.getElementById('pdf-modal-title-span');
      const editIdInput = document.getElementById('edit-pdf-id');
      const titleInput = document.getElementById('pdf-title');
      const descInput = document.getElementById('pdf-description');
      const fileSelector = document.getElementById('pdf-group-file-selector');
      
      if (fileSelector) fileSelector.value = '';
      
      if (index !== null) {
        const group = currentContent.vaultConfig.pdfs[index];
        titleSpan.textContent = 'ஆவணக் குழுவைத் திருத்துக';
        editIdInput.value = index;
        titleInput.value = group.title || '';
        descInput.value = group.description || '';
        pdfGroupFilesTemp = JSON.parse(JSON.stringify(group.files || [])); // Deep clone
      } else {
        titleSpan.textContent = 'புதிய ஆவணக் குழு சேர்';
        editIdInput.value = '';
        titleInput.value = '';
        descInput.value = '';
        pdfGroupFilesTemp = [];
      }
      
      renderPdfGroupFilesList();
      modal.style.display = 'flex';
    }

    function closePdfModal() {
      document.getElementById('pdf-modal').style.display = 'none';
    }

    function savePdf() {
      const titleInput = document.getElementById('pdf-title');
      const descInput = document.getElementById('pdf-description');
      const editIndex = document.getElementById('edit-pdf-id').value;
      
      const title = titleInput.value.trim();
      const description = descInput.value.trim();
      
      if (!title) {
        alert('குழுவின் தலைப்பை உள்ளிடவும்.');
        return;
      }
      
      const pdfGroups = currentContent.vaultConfig.pdfs;
      const groupObj = {
        id: editIndex !== '' ? pdfGroups[editIndex].id : ('group_' + Date.now()),
        title: title,
        description: description,
        files: pdfGroupFilesTemp
      };
      
      if (editIndex !== '') {
        pdfGroups[editIndex] = groupObj;
      } else {
        pdfGroups.push(groupObj);
      }
      
      closePdfModal();
      renderPdfs();
    }

    function deletePdfGroup(index) {
      if (confirm('இந்த ஆவணக் குழுவையும், அதிலுள்ள அனைத்து PDF கோப்புகளையும் நீக்க வேண்டுமா?')) {
        currentContent.vaultConfig.pdfs.splice(index, 1);
        renderPdfs();
      }
    }

    function movePdfGroup(index, direction) {
      const newIndex = index + direction;
      const pdfGroups = currentContent.vaultConfig.pdfs;
      if (newIndex < 0 || newIndex >= pdfGroups.length) return;
      const temp = pdfGroups[index];
      pdfGroups[index] = pdfGroups[newIndex];
      pdfGroups[newIndex] = temp;
      renderPdfs();
    }

    // User Accounts Management
    function renderUsers() {
      const container = document.getElementById('users-container');
      container.innerHTML = '';

      if (!currentContent.vaultConfig.users) {
        currentContent.vaultConfig.users = [];
      }

      const users = currentContent.vaultConfig.users;

      if (users.length === 0) {
        container.innerHTML = '<div style="color: var(--text-muted); text-align: center; padding: 20px;">பயனர்கள் எவரும் இல்லை.</div>';
        return;
      }

      users.forEach((user, index) => {
        const card = document.createElement('div');
        card.className = 'item-card';

        let badgeHtml = '';
        if (user.examResults || user.accounting || user.notes) {
          badgeHtml = '<span class="item-type-badge badge-text" style="margin-left: 5px; background: rgba(16, 185, 129, 0.2); color: #10b981; text-transform: none;">📋 விபரங்கள் உள்ளன</span>';
        }

        let detailsText = '';
        if (user.fullName || user.fullNameEn || user.studentClass) {
          detailsText = `<div class="item-preview" style="font-size: 13.5px; color: #475569; margin-top:5px;">முழுப் பெயர்: <strong>${escapeHtml(user.fullName || '')}</strong>${user.fullNameEn ? ' (' + escapeHtml(user.fullNameEn) + ')' : ''} | வகுப்பு: <strong>${escapeHtml(user.studentClass || '')}</strong></div>`;
        }
        card.innerHTML = `
          <div class="item-info">
            <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
              <span class="item-type-badge badge-link">பயனர் கணக்கு</span>
              ${badgeHtml}
            </div>
            <div class="item-preview">பயனர் பெயர்: <strong>${escapeHtml(user.username)}</strong></div>
            ${detailsText}
            <div class="item-subtext">கடவுச்சொல்: <code>${escapeHtml(user.password)}</code></div>
          </div>
          <div class="item-controls">
            <button class="icon-btn" onclick="openEditUserModal(${index})" title="திருத்து">✏️</button>
            <button class="icon-btn" onclick="deleteUser(${index})" title="நீக்கு">🗑️</button>
          </div>
        `;
        container.appendChild(card);
      });
    }

    function deleteUser(index) {
      if (confirm('இந்தப் பயனர் கணக்கை நீக்க விரும்புகிறீர்களா? இவர்கள் ஆவணக் காப்பகத்திற்குள் செல்ல முடியாது.')) {
        currentContent.vaultConfig.users.splice(index, 1);
        renderUsers();
      }
    }

    // Student Results PDF Handling
    let userExamPdfBase64 = "";
    let userTamilPdfBase64 = "";

    function handleUserExamPdf(input) {
      if (input.files && input.files[0]) {
        const file = input.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
          userExamPdfBase64 = e.target.result;
          document.getElementById('user-exam-pdf-status').innerHTML = `✅ ${escapeHtml(file.name)} <button type="button" class="btn btn-danger" style="padding: 2px 6px; font-size:10px; margin-left:5px; background:#ef4444; color:white; border:none; border-radius:4px;" onclick="clearUserExamPdf(event)">✕</button>`;
          
          // Clear structured fields to avoid conflict
          document.getElementById('user-exam-year').value = '';
          document.getElementById('user-exam-speaking').value = '';
          document.getElementById('user-exam-listening').value = '';
          document.getElementById('user-exam-reading').value = '';
          document.getElementById('user-exam-writing').value = '';
          document.getElementById('user-exam-skill').value = '';
        };
        reader.readAsDataURL(file);
      }
    }

    function clearUserExamPdf(e) {
      if (e) e.preventDefault();
      userExamPdfBase64 = "";
      document.getElementById('user-exam-pdf-input').value = '';
      document.getElementById('user-exam-pdf-status').innerHTML = '';
      document.getElementById('user-exam-year').value = '2026';
    }

    function handleUserTamilPdf(input) {
      if (input.files && input.files[0]) {
        const file = input.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
          userTamilPdfBase64 = e.target.result;
          document.getElementById('user-tamil-pdf-status').innerHTML = `✅ ${escapeHtml(file.name)} <button type="button" class="btn btn-danger" style="padding: 2px 6px; font-size:10px; margin-left:5px; background:#ef4444; color:white; border:none; border-radius:4px;" onclick="clearUserTamilPdf(event)">✕</button>`;
          
          // Clear structured fields
          for (let i = 1; i <= 4; i++) {
            document.getElementById(`user-tamil-n${i}`).value = '';
            document.getElementById(`user-tamil-r${i}`).value = '';
          }
        };
        reader.readAsDataURL(file);
      }
    }

    function clearUserTamilPdf(e) {
      if (e) e.preventDefault();
      userTamilPdfBase64 = "";
      document.getElementById('user-tamil-pdf-input').value = '';
      document.getElementById('user-tamil-pdf-status').innerHTML = '';
    }

    function openUserModal() {
      document.getElementById('user-modal-title-span').textContent = 'புதிய பயனர் கணக்கை உருவாக்கு';
      document.getElementById('edit-user-id').value = '';
      
      document.getElementById('user-username').value = '';
      document.getElementById('user-fullName').value = '';
      document.getElementById('user-fullNameEn').value = '';
      document.getElementById('user-studentClass').value = '';
      document.getElementById('user-password').value = '';
      
      userExamPdfBase64 = "";
      userTamilPdfBase64 = "";
      document.getElementById('user-exam-pdf-input').value = '';
      document.getElementById('user-exam-pdf-status').innerHTML = '';
      document.getElementById('user-tamil-pdf-input').value = '';
      document.getElementById('user-tamil-pdf-status').innerHTML = '';
      
      document.getElementById('user-exam-year').value = '2026';
      document.getElementById('user-exam-speaking').value = '';
      document.getElementById('user-exam-listening').value = '';
      document.getElementById('user-exam-reading').value = '';
      document.getElementById('user-exam-writing').value = '';
      document.getElementById('user-exam-skill').value = '';
      document.getElementById('user-examResults').value = '';
      
      for (let i = 1; i <= 4; i++) {
        document.getElementById(`user-tamil-n${i}`).value = '';
        document.getElementById(`user-tamil-r${i}`).value = '';
      }
      document.getElementById('user-tamilResults').value = '';
      document.getElementById('user-otherDetails').value = '';
      
      document.getElementById('user-modal').style.display = 'flex';
    }

    function openEditUserModal(index) {
      const user = currentContent.vaultConfig.users[index];
      document.getElementById('user-modal-title-span').textContent = 'பயனர் கணக்கைத் திருத்துக';
      document.getElementById('edit-user-id').value = index;

      document.getElementById('user-username').value = user.username || '';
      document.getElementById('user-fullName').value = user.fullName || '';
      document.getElementById('user-fullNameEn').value = user.fullNameEn || '';
      document.getElementById('user-studentClass').value = user.studentClass || '';
      document.getElementById('user-password').value = user.password || '';
      document.getElementById('user-otherDetails').value = user.otherDetails || user.notes || '';

      // Check if user.examResults is a base64 PDF
      if (user.examResults && user.examResults.startsWith('data:application/pdf;base64,')) {
        userExamPdfBase64 = user.examResults;
        document.getElementById('user-exam-pdf-status').innerHTML = `✅ PDF கோப்பு இணைக்கப்பட்டுள்ளது <button type="button" class="btn btn-danger" style="padding: 2px 6px; font-size:10px; margin-left:5px; background:#ef4444; color:white; border:none; border-radius:4px;" onclick="clearUserExamPdf(event)">✕</button>`;
        
        document.getElementById('user-exam-year').value = '';
        document.getElementById('user-exam-speaking').value = '';
        document.getElementById('user-exam-listening').value = '';
        document.getElementById('user-exam-reading').value = '';
        document.getElementById('user-exam-writing').value = '';
        document.getElementById('user-exam-skill').value = '';
        document.getElementById('user-examResults').value = '';
      } else {
        userExamPdfBase64 = "";
        document.getElementById('user-exam-pdf-status').innerHTML = '';
      }

      // Parse structured exam results
      let examData = null;
      try {
        if (user.examResults && user.examResults.trim().startsWith('{')) {
          examData = JSON.parse(user.examResults);
        }
      } catch(e) {}

      if (!userExamPdfBase64 && examData && examData.isStructured) {
        document.getElementById('user-exam-year').value = examData.year || '2026';
        document.getElementById('user-exam-speaking').value = examData.speaking || '';
        document.getElementById('user-exam-listening').value = examData.listening || '';
        document.getElementById('user-exam-reading').value = examData.reading || '';
        document.getElementById('user-exam-writing').value = examData.writing || '';
        document.getElementById('user-exam-skill').value = examData.skill || '';
        document.getElementById('user-examResults').value = '';
      } else if (!userExamPdfBase64) {
        document.getElementById('user-exam-year').value = '2026';
        document.getElementById('user-exam-speaking').value = '';
        document.getElementById('user-exam-listening').value = '';
        document.getElementById('user-exam-reading').value = '';
        document.getElementById('user-exam-writing').value = '';
        document.getElementById('user-exam-skill').value = '';
        document.getElementById('user-examResults').value = user.examResults || '';
      }

      // Check if user.tamilResults is a base64 PDF
      if (user.tamilResults && user.tamilResults.startsWith('data:application/pdf;base64,')) {
        userTamilPdfBase64 = user.tamilResults;
        document.getElementById('user-tamil-pdf-status').innerHTML = `✅ PDF கோப்பு இணைக்கப்பட்டுள்ளது <button type="button" class="btn btn-danger" style="padding: 2px 6px; font-size:10px; margin-left:5px; background:#ef4444; color:white; border:none; border-radius:4px;" onclick="clearUserTamilPdf(event)">✕</button>`;
        
        for (let i = 1; i <= 4; i++) {
          document.getElementById(`user-tamil-n${i}`).value = '';
          document.getElementById(`user-tamil-r${i}`).value = '';
        }
        document.getElementById('user-tamilResults').value = '';
      } else {
        userTamilPdfBase64 = "";
        document.getElementById('user-tamil-pdf-status').innerHTML = '';
      }

      // Parse structured tamil competition
      let tamilData = null;
      try {
        if (user.tamilResults && user.tamilResults.trim().startsWith('{')) {
          tamilData = JSON.parse(user.tamilResults);
        }
      } catch(e) {}

      if (!userTamilPdfBase64 && tamilData && tamilData.isStructured) {
        const items = tamilData.items || [];
        for (let i = 1; i <= 4; i++) {
          const item = items[i-1] || {};
          document.getElementById(`user-tamil-n${i}`).value = item.name || '';
          document.getElementById(`user-tamil-r${i}`).value = item.result || '';
        }
        document.getElementById('user-tamilResults').value = '';
      } else if (!userTamilPdfBase64) {
        for (let i = 1; i <= 4; i++) {
          document.getElementById(`user-tamil-n${i}`).value = '';
          document.getElementById(`user-tamil-r${i}`).value = '';
        }
        document.getElementById('user-tamilResults').value = user.tamilResults || user.accounting || '';
      }

      document.getElementById('user-modal').style.display = 'flex';
    }

    function closeUserModal() {
      document.getElementById('user-modal').style.display = 'none';
    }

    
    
    function saveUser() {
      const username = document.getElementById('user-username').value.trim();
      const password = document.getElementById('user-password').value.trim();
      const fullName = document.getElementById('user-fullName').value.trim();
      const fullNameEn = document.getElementById('user-fullNameEn').value.trim();
      const studentClass = document.getElementById('user-studentClass').value.trim();
      const otherDetails = document.getElementById('user-otherDetails').value.trim();
      const editIndex = document.getElementById('edit-user-id').value;

      if (!username || !password) {
        alert('பயனர் பெயர் மற்றும் கடவுச்சொல்லை உள்ளிடவும்.');
        return;
      }

      // Read and package exam results
      const examYear = document.getElementById('user-exam-year').value.trim();
      const examSpeaking = document.getElementById('user-exam-speaking').value.trim();
      const examListening = document.getElementById('user-exam-listening').value.trim();
      const examReading = document.getElementById('user-exam-reading').value.trim();
      const examWriting = document.getElementById('user-exam-writing').value.trim();
      const examSkill = document.getElementById('user-exam-skill').value.trim();
      const examRaw = document.getElementById('user-examResults').value.trim();

      let examResults = "";
      if (examYear || examSpeaking || examListening || examReading || examWriting || examSkill) {
        examResults = JSON.stringify({
          isStructured: true,
          year: examYear || "2026",
          speaking: examSpeaking,
          listening: examListening,
          reading: examReading,
          writing: examWriting,
          skill: examSkill
        });
      } else {
        examResults = examRaw;
      }

      // Read and package tamil competition results
      const tN1 = document.getElementById('user-tamil-n1').value.trim();
      const tR1 = document.getElementById('user-tamil-r1').value.trim();
      const tN2 = document.getElementById('user-tamil-n2').value.trim();
      const tR2 = document.getElementById('user-tamil-r2').value.trim();
      const tN3 = document.getElementById('user-tamil-n3').value.trim();
      const tR3 = document.getElementById('user-tamil-r3').value.trim();
      const tN4 = document.getElementById('user-tamil-n4').value.trim();
      const tR4 = document.getElementById('user-tamil-r4').value.trim();
      const tamilRaw = document.getElementById('user-tamilResults').value.trim();

      let tamilResults = "";
      if (tN1 || tR1 || tN2 || tR2 || tN3 || tR3 || tN4 || tR4) {
        tamilResults = JSON.stringify({
          isStructured: true,
          items: [
            { name: tN1, result: tR1 },
            { name: tN2, result: tR2 },
            { name: tN3, result: tR3 },
            { name: tN4, result: tR4 }
          ]
        });
      } else {
        tamilResults = tamilRaw;
      }

      const user = { username, password, fullName, fullNameEn, studentClass, examResults, tamilResults, otherDetails };
      const users = currentContent.vaultConfig.users;

      if (editIndex !== '') {
        users[editIndex] = user;
      } else {
        users.push(user);
      }

      closeUserModal();
      renderUsers();
    }

    function adminUnlockLockout() {
      let count = 0;
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('perm_locked_') || key.startsWith('lockedStudent_'))) {
          localStorage.removeItem(key);
          count++;
        }
      }
      localStorage.removeItem('permanentlyLockedStudentsList');
      alert(`🔓 வெற்றிகரமாக அனைத்து மாணவர் லாக்அவுட் முடக்கங்களும் நீக்கப்பட்டன! (${count > 0 ? count + ' கணக்குகள் திறக்கப்பட்டன' : 'முடக்கப்பட்ட கணக்குகள் எதுவும் இல்லை'})`);
    }

    // Save and export settings
    // Safe crash-proof input value reader
    function getInputValue(id, fallback = "") {
      const el = document.getElementById(id);
      return (el && typeof el.value !== 'undefined') ? el.value.trim() : fallback;
    }

        async function saveToLocalStorage(silent = false) {
      try {
        // Read values from form fields using safe getInputValue helper
        currentContent.titleTa = getInputValue('logo-title-ta');
        currentContent.titleEn = getInputValue('logo-title-en');
        currentContent.logo = getInputValue('logo-filename');

        if (!currentContent.formConfig) currentContent.formConfig = {};
        currentContent.formConfig.title = currentContent.titleTa;
        currentContent.formConfig.subtitle = getInputValue('form-subtitle');
        currentContent.formConfig.marqueeText = getInputValue('form-marquee-text');
        currentContent.formConfig.logoUrl = currentContent.logo;
        currentContent.formConfig.scriptURL = getInputValue('google-script-url');
        currentContent.formConfig.adminPasscode = getInputValue('admin-passcode-field');

        // Handle Color changes safely
        currentContent.formConfig.colors = {
          bodyBgStart: getInputValue('txtBodyBgStart', '#fdf8f8'),
          bodyBgEnd: getInputValue('txtBodyBgEnd', '#f3e8e8'),
          headerBgStart: getInputValue('txtHeaderBgStart', '#5c0617'),
          headerBgEnd: getInputValue('txtHeaderBgEnd', '#800020'),
          accentColor: getInputValue('txtAccent', '#800020'),
          containerBg: getInputValue('txtContainerBg', '#ffffff')
        };

        if (!currentContent.examsConfig) currentContent.examsConfig = { sections: [] };
        currentContent.examsConfig.title = getInputValue('exams-page-title-input');

        if (!currentContent.eventsConfig) currentContent.eventsConfig = { timeline: [] };
        currentContent.eventsConfig.title = getInputValue('events-page-title-input');

        if (!currentContent.galleryConfig) currentContent.galleryConfig = { photos: [] };
        currentContent.galleryConfig.title = getInputValue('gallery-page-title-input');

        if (!currentContent.contactConfig) currentContent.contactConfig = {};
        currentContent.contactConfig.whatsapp = getInputValue('contact-whatsapp-input');
        currentContent.contactConfig.instagram = getInputValue('contact-instagram-input');
        currentContent.contactConfig.facebook = getInputValue('contact-facebook-input');
        currentContent.contactConfig.email = getInputValue('contact-email-input');

        localStorage.setItem('siteContent', JSON.stringify(currentContent));
        
        // Toast notice
        const toast = document.getElementById('toast');
        toast.className = 'show';
        setTimeout(() => { toast.className = ''; }, 3000);

        generateExportCode();
      } catch (err) {
        console.error("Error in saveToLocalStorage:", err);
        alert("பிழை (Save Local): " + err.message + "\n\nStack Trace:\n" + err.stack);
        throw err;
      }
    }

    function generateExportCode() {
      const code = `// Thamilalayam Bad Schwalbach - Dynamic Content Data

window.siteContent = ${JSON.stringify(currentContent, null, 2)};
`;
      document.getElementById('cfgCodeArea').value = code;
    }

    function copyConfigCode() {
      const area = document.getElementById('cfgCodeArea');
      area.select();
      document.execCommand('copy');
    }

    function downloadContentJS() {
      const code = `// Thamilalayam Bad Schwalbach - Dynamic Content Data

window.siteContent = ${JSON.stringify(currentContent, null, 2)};
`;
      const blob = new Blob([code], { type: 'application/javascript;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

    async function downloadUnifiedPage(templateFilename, targetDownloadName) {
      try {
        const response = await fetch(templateFilename);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        let htmlContent = await response.text();
        
        // Clean up open modal states if editing admin or application
        htmlContent = htmlContent.replace('class="admin-modal open"', 'class="admin-modal"');
        
        const serializedConfig = JSON.stringify(currentContent, null, 2);
        const replacement = `/*CONFIG_START*/\nconst DEFAULT_CONFIG = ${serializedConfig};\n/*CONFIG_END*/`;
        
        // Replace the config block in the HTML template code
        htmlContent = htmlContent.replace(/\/\*CONFIG_START\*\/[\s\S]*?\/\*CONFIG_END\*\//, replacement);
        
        const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = targetDownloadName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Error generating unified page:', error);
      }
    }

    // Direct Cloud configuration saving
    function saveConfigToCloud(event) {
      try {
        // 🚨 100% Safety Guarantee Lock: Check if student vault data is missing locally
        const users = currentContent.vaultConfig?.users || [];
        if (!users || users.length === 0) {
          alert(
            "🛑 ஆபத்தான எச்சரிக்கை! (100% Safety Lock Enabled)\n\n" +
            "உங்களின் கணினியில் மாணவர் தரவுகள் (Student Vault Records) எதுவும் இல்லை!\n\n" +
            "இப்படியே கிளவுடில் சேமித்தால் கூகிளில் உள்ள தரவு அழிந்துவிடும், எனவே முதலில் '☁️ கூகுள் கிளவுடிலிருந்து பெற (Fetch Data from Google Cloud)' பொத்தானை அழுத்துங்கள்!"
          );
          return;
        }

        let scriptURL = currentContent.formConfig?.scriptURL || currentContent.scriptURL;
        if (!scriptURL || scriptURL.includes("AKfycbzd_5lljmz6NbUp")) {
          scriptURL = "https://script.google.com/macros/s/AKfycbwvobVHfdBXSAQz1hFrUnc1M6eDj4gTcpWc8SaeJBls4OaXiaXX9z7LP6kecaP1tKsf/exec";
        }
        if (!scriptURL) {
          alert("கூகுள் ஸ்கிரிப்ட் முகவரி (Google Script URL) பொது அமைப்புகளில் இன்னும் இணைக்கப்படவில்லை!");
          return;
        }
        
        if (!confirm("இந்த மாற்றங்களை நேரடியாகக் கூகுள் கிளவுடில் சேமிக்க விரும்புகிறீர்களா? (இணையதளம் கோப்பு அப்லோடு செய்யாமல் உடனே அப்டேட் ஆகும்!)")) {
          return;
        }
      
      const saveBtn = event ? event.target : null;
      let oldText = "";
      if (saveBtn) {
        oldText = saveBtn.textContent;
        saveBtn.disabled = true;
        saveBtn.textContent = 'கிளவுடில் சேமிக்கப்படுகிறது...';
      }
      
      // Save state to localStorage silently first
      saveToLocalStorage(true);
      
      const passcode = currentContent.formConfig?.adminPasscode || currentContent.adminPasscode || 'admin123';
      
      const formData = new FormData();
      formData.append('configData', JSON.stringify(currentContent));
      
      fetch(scriptURL + '?action=saveConfig&passcode=' + encodeURIComponent(passcode), {
        method: 'POST',
        body: formData
      })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          alert("🎉 வெற்றிகரமாக உங்களது மாற்றங்கள் கூகுள் கிளவுடில் சேமிக்கப்பட்டுவிட்டது! கோப்புகளை அப்லோடு செய்யாமலேயே இணையதளம் அப்டேட் ஆகிவிட்டது.");
        } else {
          alert("பிழை: " + data.message);
        }
      })
      .catch(err => {
        console.error(err);
        alert("கூகுள் கிளவுடில் சேமிக்க முடியவில்லை. இணைய இணைப்பு மற்றும் கூகுள் ஸ்கிரிப்ட் அமைப்புகளைச் சரிபார்க்கவும்.");
      })
      .finally(() => {
        if (saveBtn) {
          saveBtn.disabled = false;
          saveBtn.textContent = oldText;
        }
      });
      } catch (err) {
        console.error("Error in saveConfigToCloud:", err);
        alert("பிழை (Save Cloud UI): " + err.message + "\n\nStack Trace:\n" + err.stack);
      }
    }


    function resetToDefaults() {
      if (confirm('அமைப்புகள் அனைத்தையும் அழித்துவிட்டு ஆரம்ப நிலைக்குத் திரும்ப விரும்புகிறீர்களா? உங்களது LocalStorage சேமிப்புகள் நீக்கப்படும்.')) {
        localStorage.removeItem('siteContent');
        alert('பிரவுசரின் தற்காலிகச் சேமிப்பு வெற்றிகரமாக நீக்கப்பட்டது. பக்கங்கள் ஆரம்ப நிலைக்கு மீட்டமைக்கப்பட்டுவிட்டன!');
        location.reload();
      }
    }

    function adminUnlockLockout() {
      localStorage.removeItem('vaultLockout');
      localStorage.removeItem('loginAttempts');
      localStorage.removeItem('userLockouts');
      localStorage.removeItem('userAttempts');
      alert("🎉 நிர்வாகி அனுமதி பெறப்பட்டது! அனைத்து மாணவர் லாக்அவுட் முடக்கங்களும் வெற்றிகரமாக நீக்கப்பட்டன!");
    }

    function escapeHtml(string) {
      return String(string)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }

    // Trigger auth overlay or checks
    checkAuth();
  
    async function fetchDataFromCloud() {
      const urlInput = document.getElementById('cloud-script-url');
      let scriptUrl = urlInput ? urlInput.value.trim() : '';
      if (!scriptUrl && typeof currentContent !== 'undefined' && currentContent.cloudScriptUrl) {
        scriptUrl = currentContent.cloudScriptUrl;
      }
      if (!scriptUrl) {
        scriptUrl = prompt("உங்கள் Google Apps Script Web App URL ஐ உள்ளிடவும்:\n(எ.கா: https://script.google.com/macros/s/.../exec)");
      }
      if (!scriptUrl) return;
      
      const statusBtn = event ? event.target : null;
      if (statusBtn) statusBtn.textContent = "⏳ கூகிளிலிருந்து பெறப்படுகிறது...";

      try {
        const fetchUrl = scriptUrl + (scriptUrl.includes('?') ? '&' : '?') + 'action=getConfig';
        const response = await fetch(fetchUrl);
        const data = await response.json();
        
        if (data && data.status !== "empty") {
          currentContent = Object.assign({}, currentContent, data);
          localStorage.setItem('siteContent', JSON.stringify(currentContent));
          loadData();
          alert("🎉 வெற்றி! கூகுள் கிளவுடில் உள்ள அனைத்துப் புதிய தரவுகளும் வெற்றிகரமாகப் பெறப்பட்டுவிட்டது!");
        } else {
          alert("⚠️ கூகுள் கிளவுடில் தரவுகள் எதுவும் கிடைக்கவில்லை அல்லது காலியாக உள்ளது.");
        }
      } catch (err) {
        console.error("Cloud fetch error:", err);
        alert("⚠️ கிளவுட் இணைப்பில் பிழை: " + err.message + "\n\nGoogle Apps Script 'Anyone' அணுகலில் உள்ளதா என்பதைச் சரிபார்க்கவும்.");
      } finally {
        if (statusBtn) statusBtn.textContent = "☁️ கூகுள் கிளவுடிலிருந்து பெற (Fetch Data from Google Cloud)";
      }
    }


    function exportSportsConfigFile() {
      try {
        const jsonStr = JSON.stringify(currentContent, null, 2);
        const code = `// Thamilalayam Bad Schwalbach - Dynamic Content Data\nwindow.siteContent = ${jsonStr};`;
        const blob = new Blob([code], { type: 'application/javascript;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'sports-config.js';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        alert("🎉 sports-config.js கோப்பு வெற்றிகரமாகப் பதிவிறக்கம் (Download) செய்யப்பட்டுவிட்டது!");
      } catch (err) {
        console.error("Export error:", err);
        alert("⚠️ பதிவிறக்கம் செய்வதில் பிழை: " + err.message);
      }
    }


    // Safety Protection Guard against accidental cloud data wipe (100% Safety Lock)
    function checkCloudSaveSafety() {
      const users = currentContent.vaultConfig?.users || [];
      if (!users || users.length === 0) {
        alert(
          "🛑 ஆபத்தான எச்சரிக்கை! (100% Safety Lock Enabled)\n\n" +
          "உங்களின் கணினியில் மாணவர் தரவுகள் (Student Vault Records) எதுவும் இல்லை!\n\n" +
          "இப்படியே கிளவுடில் சேமித்தால் கூகிளில் உள்ள தரவு அழிந்துவிடும், எனவே முதலில் '☁️ கூகுள் கிளவுடிலிருந்து பெற (Fetch Data from Google Cloud)' பொத்தானை அழுத்துங்கள்!"
        );
        return false;
      }
      return true;
    }

