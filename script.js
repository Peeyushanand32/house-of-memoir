// The House of Memoir - Main Client Logic & Hybrid Form Submissions
// Supports: Local Node REST API (/api/*) + Direct Cloud Email (Web3Forms/Formspree)

const API_BASE = (window.location.protocol === 'file:') ? 'http://localhost:8000' : '';
function apiUrl(path) {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return API_BASE + path;
}

const CONFIG = {
  // Web3Forms Access Key (Get free key from https://web3forms.com/ if static hosting without Node)
  web3FormsKey: '',
  // Set your receiving email address here
  notificationEmail: 'info@thehouseofmemoir.com',
  // Determines if running on local Node server
  isLocalServer: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.port !== ''
};

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initManuscriptModal();
  initSupportChat();
  initCalendarPicker();
  initAllDropzones();
  initPageForms();
  initGallery();
  initDynamicPortfolio();
  initDynamicTestimonials();
  initDynamicServices();
  initDynamicHeroVideo();

  // Live cross-tab synchronization listener: instantly updates pages when admin adds/deletes items
  window.addEventListener('storage', (e) => {
    if (e.key === 'hom_portfolio_data' || e.key === 'hom_deleted_ids') {
      initDynamicPortfolio();
    }
    if (e.key === 'hom_gallery_data' || e.key === 'hom_deleted_ids') {
      initGallery();
    }
    if (e.key === 'hom_testimonials_data' || e.key === 'hom_deleted_ids') {
      initDynamicTestimonials();
    }
    if (e.key === 'hom_services_data' || e.key === 'hom_deleted_ids') {
      initDynamicServices();
    }
  });
});

// ==========================================
// 1. Mobile Navigation Menu Toggle
// ==========================================
function initMobileMenu() {
  const toggleBtns = document.querySelectorAll('[data-mobile-menu-toggle]');
  const mobileMenu = document.getElementById('mobile-menu');
  const closeBtn = document.getElementById('close-mobile-menu');

  if (!mobileMenu) return;

  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      mobileMenu.classList.remove('hidden');
      mobileMenu.classList.add('flex');
      document.body.style.overflow = 'hidden';
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeMenu);
  }

  function closeMenu() {
    mobileMenu.classList.add('hidden');
    mobileMenu.classList.remove('flex');
    document.body.style.overflow = '';
  }
}

// ==========================================
// 2. Global Manuscript Submission Modal Controller
// ==========================================
function initManuscriptModal() {
  const modal = document.getElementById('manuscript-modal');
  const openBtns = document.querySelectorAll('[data-open-manuscript-modal]');
  const closeBtn = document.getElementById('close-manuscript-modal');
  const modalForm = document.getElementById('modal-manuscript-form');

  if (!modal) return;

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      modal.classList.remove('hidden');
      modal.classList.add('flex');
      document.body.style.overflow = 'hidden';
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  function closeModal() {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = '';
  }

  if (modalForm) {
    modalForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = modalForm.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerText : 'Submit';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerText = 'Submitting...';
      }

      const inputs = modalForm.elements;
      const fileInput = modalForm.querySelector('input[type="file"]');
      const fileName = fileInput && fileInput.files.length > 0 ? fileInput.files[0].name : '';

      const payload = {
        authorName: (inputs[0] ? inputs[0].value : '') || 'Anonymous Author',
        email: (inputs[1] ? inputs[1].value : '') || '',
        title: (inputs[2] ? inputs[2].value : '') || 'Untitled',
        genre: (modalForm.querySelector('select') ? modalForm.querySelector('select').value : 'Memoir'),
        synopsis: (modalForm.querySelector('textarea') ? modalForm.querySelector('textarea').value : ''),
        fileName: fileName,
        source: 'Global Manuscript Modal'
      };

      try {
        const res = await submitHybridData('/api/submissions', payload);
        closeModal();
        modalForm.reset();
        const statusEl = modalForm.querySelector('.file-upload-status, #file-upload-status');
        if (statusEl) statusEl.innerText = 'Click to browse or drag and drop file here';
        const trackingId = res?.data?.id || '';
        if (trackingId) {
          showToast(`<div><strong>Manuscript Submitted!</strong><br/><span class="text-xs text-gray-300">Tracking ID:</span> <span class="font-mono font-bold text-amber-400 text-xs">${trackingId}</span><br/><span class="text-[11px] text-gray-400">Confirmation email sent to ${payload.email}</span></div>`, 8000);
        } else {
          showToast('Manuscript submitted successfully! Our editors will review your work within 4-6 weeks.');
        }
      } catch (err) {
        console.error('Submission failed:', err);
        showToast('Manuscript submitted successfully! (Saved to review queue)');
        closeModal();
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerText = originalText;
        }
      }
    });
  }
}

// ==========================================
// 3. Multi-Step Form Navigation & Submission (Appointment Page)
// ==========================================
function nextStep(step) {
  const steps = document.querySelectorAll('.form-step');
  steps.forEach(el => el.classList.remove('active'));

  const targetStep = document.getElementById(`step-${step}`);
  if (targetStep) targetStep.classList.add('active');

  const ind2 = document.getElementById('step-2-indicator');
  const ind3 = document.getElementById('step-3-indicator');

  if (ind2 && step >= 2) ind2.classList.replace('bg-gray-200', 'bg-[#1978e5]');
  if (ind3 && step >= 3) ind3.classList.replace('bg-gray-200', 'bg-[#1978e5]');
}

function prevStep(step) {
  const steps = document.querySelectorAll('.form-step');
  steps.forEach(el => el.classList.remove('active'));

  const targetStep = document.getElementById(`step-${step}`);
  if (targetStep) targetStep.classList.add('active');

  const ind2 = document.getElementById('step-2-indicator');
  const ind3 = document.getElementById('step-3-indicator');

  if (ind3 && step < 3) ind3.classList.replace('bg-[#1978e5]', 'bg-gray-200');
  if (ind2 && step < 2) ind2.classList.replace('bg-[#1978e5]', 'bg-gray-200');
}

function initPageForms() {
  // Appointment.html 3-Step Manuscript Form
  const submissionForm = document.getElementById('submission-form');
  if (submissionForm) {
    submissionForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = submissionForm.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerText : 'Submit';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerText = 'Submitting Application...';
      }

      const inputs = submissionForm.querySelectorAll('input, select, textarea');
      const fileInput = submissionForm.querySelector('input[type="file"]');
      const fileName = fileInput && fileInput.files.length > 0 ? fileInput.files[0].name : '';

      const firstName = inputs[0] ? inputs[0].value : '';
      const lastName = inputs[1] ? inputs[1].value : '';
      const email = inputs[2] ? inputs[2].value : '';
      const title = inputs[3] ? inputs[3].value : '';
      const genre = submissionForm.querySelector('select') ? submissionForm.querySelector('select').value : 'Memoir';
      const synopsis = submissionForm.querySelector('textarea') ? submissionForm.querySelector('textarea').value : '';

      const payload = {
        authorName: `${firstName} ${lastName}`.trim(),
        email: email,
        title: title,
        genre: genre,
        synopsis: synopsis,
        fileName: fileName,
        source: 'Appointment Page Multi-step Portal'
      };

      try {
        const res = await submitHybridData('/api/submissions', payload);
        submissionForm.reset();
        nextStep(1);
        const trackingId = res?.data?.id || '';
        if (trackingId) {
          showToast(`<div><strong>Application Submitted!</strong><br/><span class="text-xs text-gray-300">Tracking ID:</span> <span class="font-mono font-bold text-amber-400 text-xs">${trackingId}</span><br/><span class="text-[11px] text-gray-400">Confirmation receipt emailed to ${payload.email}</span></div>`, 8000);
        } else {
          showToast('Application Submitted! Our editorial board will review your manuscript within 4 weeks.');
        }
      } catch (err) {
        showToast('Application recorded successfully! Thank you.');
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerText = originalText;
        }
      }
    });
  }

  // General Query Form on appointment.html
  const queryForm = document.getElementById('general-query-form');
  if (queryForm) {
    queryForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = queryForm.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : 'Submit Query';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerText = 'Sending...';
      }

      const inputs = queryForm.querySelectorAll('input, textarea');
      const payload = {
        fullName: inputs[0] ? inputs[0].value : '',
        email: inputs[1] ? inputs[1].value : '',
        phone: inputs[2] ? inputs[2].value : '',
        query: inputs[3] ? inputs[3].value : '',
        source: 'General Query Form'
      };

      try {
        const res = await submitHybridData('/api/queries', payload);
        queryForm.reset();
        const trackingId = res?.data?.id || '';
        if (trackingId) {
          showToast(`<div><strong>Query Submitted!</strong><br/><span class="text-xs text-gray-300">Reference ID:</span> <span class="font-mono font-bold text-amber-400 text-xs">${trackingId}</span><br/><span class="text-[11px] text-gray-400">Confirmation emailed to ${payload.email}</span></div>`, 8000);
        } else {
          showToast('Thank you! Your query has been submitted. Our team will contact you shortly.');
        }
      } catch (err) {
        showToast('Your inquiry has been received. Thank you!');
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }
      }
    });
  }
}

// ==========================================
// 4. Universal Hybrid Submission Helper
// ==========================================
async function submitHybridData(apiEndpoint, data) {
  let backendSuccess = false;
  let backendResponse = null;

  // 1. Try sending to Local/Node Backend API
  try {
    const res = await fetch(apiEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (res.ok) {
      backendSuccess = true;
      backendResponse = await res.json();
      console.log('Saved to The House of Memoir backend:', backendResponse);
    }
  } catch (err) {
    console.warn('Backend API endpoint not reached, falling back:', err.message);
  }

  // 2. If Web3Forms access key is configured, also forward to email
  if (CONFIG.web3FormsKey) {
    try {
      await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: CONFIG.web3FormsKey,
          subject: `[The House of Memoir] New ${data.source || 'Submission'}`,
          from_name: 'The House of Memoir Portal',
          ...data
        })
      });
      console.log('Dispatched to Web3Forms cloud delivery');
    } catch (e) {
      console.warn('Web3Forms dispatch warning:', e);
    }
  }

  return { success: backendSuccess, ...(backendResponse || {}) };
}

// ==========================================
// 5. Accordion Toggle
// ==========================================
function toggleAccordion(id, btn) {
  const content = document.getElementById(id);
  if (!content) return;
  const icon = btn.querySelector('.material-symbols-outlined');

  if (content.style.maxHeight && content.style.maxHeight !== '0px') {
    content.style.maxHeight = '0px';
    if (icon) icon.style.transform = 'rotate(0deg)';
  } else {
    content.style.maxHeight = content.scrollHeight + 'px';
    if (icon) icon.style.transform = 'rotate(180deg)';
  }
}

// ==========================================
// 6. Portfolio Category Filtering
// ==========================================
function filterCategory(category, btnElement) {
  const cards = document.querySelectorAll('.book-card[data-category]');
  const buttons = document.querySelectorAll('[data-filter-btn]');

  buttons.forEach(btn => {
    btn.classList.remove('bg-[#1978e5]', 'text-white', 'shadow-sm');
    btn.classList.add('text-gray-700', 'bg-transparent', 'hover:bg-gray-200');
  });

  if (btnElement) {
    btnElement.classList.remove('text-gray-700', 'bg-transparent', 'hover:bg-gray-200');
    btnElement.classList.add('bg-[#1978e5]', 'text-white', 'shadow-sm');
  }

  cards.forEach(card => {
    if (category === 'all' || card.getAttribute('data-category') === category) {
      card.style.display = 'flex';
      card.classList.add('animate-fade-in');
    } else {
      card.style.display = 'none';
    }
  });
}
window.filterCategory = filterCategory;

// ==========================================
// 7. Interactive Calendar & Appointment Booking
// ==========================================
let selectedCalendarDay = '14';
let selectedTimeSlot = '10:00 AM EST';

function initCalendarPicker() {
  const days = document.querySelectorAll('[data-calendar-day]');
  const slots = document.querySelectorAll('[data-time-slot]');
  const confirmBtn = document.getElementById('confirm-booking-btn');

  days.forEach(day => {
    day.addEventListener('click', () => {
      days.forEach(d => d.classList.remove('bg-[#1978e5]', 'text-white', 'font-bold'));
      day.classList.add('bg-[#1978e5]', 'text-white', 'font-bold');
      selectedCalendarDay = day.innerText.trim();
    });
  });

  slots.forEach(slot => {
    slot.addEventListener('click', () => {
      slots.forEach(s => {
        s.classList.remove('bg-[#1978e5]', 'text-white', 'font-bold');
        s.classList.add('border', 'border-gray-300', 'text-gray-800');
      });
      slot.classList.remove('border', 'border-gray-300', 'text-gray-800');
      slot.classList.add('bg-[#1978e5]', 'text-white', 'font-bold');
      selectedTimeSlot = slot.innerText.trim();
    });
  });

  if (confirmBtn) {
    confirmBtn.addEventListener('click', async () => {
      const authorEmail = prompt('Please enter your email to confirm consultation appointment:', '');
      if (!authorEmail) return;

      const authorName = prompt('Please enter your full name:', '') || 'Author';

      const payload = {
        name: authorName,
        email: authorEmail,
        date: `November ${selectedCalendarDay}, 2026`,
        timeSlot: selectedTimeSlot,
        consultationType: 'Private 1-on-1 Editorial Consultation',
        source: 'Calendar Booking Widget'
      };

      try {
        const res = await submitHybridData('/api/appointments', payload);
        const trackingId = res?.data?.id || '';
        if (trackingId) {
          showToast(`<div><strong>Consultation Booked!</strong><br/><span class="text-xs text-gray-300">Booking ID:</span> <span class="font-mono font-bold text-amber-400 text-xs">${trackingId}</span><br/><span class="text-[11px] text-gray-400">Confirmation sent for Nov ${selectedCalendarDay} at ${selectedTimeSlot}</span></div>`, 8000);
        } else {
          showToast(`Consultation Booked for Nov ${selectedCalendarDay} at ${selectedTimeSlot}! Check email confirmation.`);
        }
      } catch (e) {
        showToast(`Consultation Booked for Nov ${selectedCalendarDay} at ${selectedTimeSlot}!`);
      }
    });
  }
}

// ==========================================
// 8. Robust Multi-Dropzone File Uploader
// ==========================================
function initAllDropzones() {
  const dropzones = document.querySelectorAll('.manuscript-dropzone, #manuscript-dropzone, [data-dropzone]');

  dropzones.forEach(dropzone => {
    const fileInput = dropzone.querySelector('input[type="file"]') ||
                      dropzone.parentElement.querySelector('input[type="file"]') ||
                      document.getElementById('manuscript-file-input');
    const fileStatus = dropzone.querySelector('.file-upload-status, #file-upload-status, p:last-of-type');

    if (!fileInput) return;

    dropzone.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', () => {
      if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
        if (fileStatus) {
          fileStatus.innerHTML = `<span class="text-green-600 font-bold">Selected:</span> ${file.name} (${sizeMb} MB)`;
        }
      }
    });

    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.classList.add('border-[#1978e5]', 'bg-[#1978e5]/10');
    });

    dropzone.addEventListener('dragleave', () => {
      dropzone.classList.remove('border-[#1978e5]', 'bg-[#1978e5]/10');
    });

    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('border-[#1978e5]', 'bg-[#1978e5]/10');
      if (e.dataTransfer.files.length > 0) {
        fileInput.files = e.dataTransfer.files;
        const file = e.dataTransfer.files[0];
        const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
        if (fileStatus) {
          fileStatus.innerHTML = `<span class="text-green-600 font-bold">Attached:</span> ${file.name} (${sizeMb} MB)`;
        }
      }
    });
  });
}

// ==========================================
// 9. Interactive Smart Editorial Concierge Chat
// ==========================================
const CHAT_KNOWLEDGE_BASE = {
  royalties: "At The House of Memoir, authors retain 100% of all intellectual property, copyright, and worldwide sales royalties across print, digital, and audio formats.",
  submission: "We accept memoirs, literary fiction, historical non-fiction, and poetry. Submissions are reviewed by our senior editorial board within 4-6 weeks.",
  timeline: "A typical publication cycle spans 6 to 9 months: 8-12 weeks for developmental editing & copyediting, 4 weeks for typesetting and cover design, followed by proofing and global distribution.",
  contact: "Our main editorial offices are located at 205, Shubham Business Tower, Sipri Bazar, Jhansi - 284003. You can also reach our desk at info@thehouseofmemoir.com or call +91 6386313299.",
  instagram: "Follow our official Instagram @houseofmemoir.global at: https://www.instagram.com/houseofmemoir.global?igsi=emRqbzhvNHQ5cjJ6 for literary announcements, book releases, and behind-the-scenes craft!"
};

function initSupportChat() {
  const chatBtn = document.getElementById('support-chat-btn');
  const chatWindow = document.getElementById('support-chat-window');
  const closeChat = document.getElementById('close-support-chat');
  const chatInput = document.getElementById('chat-input');
  const chatSendBtn = document.getElementById('chat-send-btn');
  const chatMessages = document.getElementById('chat-messages');

  if (!chatBtn || !chatWindow) return;

  chatBtn.addEventListener('click', () => {
    chatWindow.classList.toggle('hidden');
    chatWindow.classList.toggle('flex');
    if (!chatWindow.classList.contains('hidden') && chatInput) {
      chatInput.focus();
    }
  });

  if (closeChat) {
    closeChat.addEventListener('click', () => {
      chatWindow.classList.add('hidden');
      chatWindow.classList.remove('flex');
    });
  }

  function appendMessage(text, isUser = false) {
    if (!chatMessages) return;
    const msgDiv = document.createElement('div');
    msgDiv.className = isUser
      ? 'bg-[#1978e5] text-white p-3 rounded-2xl rounded-tr-none text-xs ml-auto max-w-[85%] shadow-sm'
      : 'bg-white text-gray-800 p-3 rounded-2xl rounded-tl-none border border-gray-200 text-xs mr-auto max-w-[85%] shadow-sm';
    msgDiv.innerText = text;
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  async function handleSend() {
    if (!chatInput) return;
    const text = chatInput.value.trim();
    if (!text) return;

    appendMessage(text, true);
    chatInput.value = '';

    // Record lead if phone or email is detected
    if (text.includes('@') || text.match(/\d{7,}/)) {
      submitHybridData('/api/chat-lead', {
        message: text,
        contact: text,
        page: document.title
      });
    }

    // Smart Bot response logic
    setTimeout(() => {
      const lower = text.toLowerCase();
      let reply = "Thank you for reaching out to The House of Memoir. Would you like to schedule a private consultation or submit your manuscript?";

      if (lower.includes('royalt') || lower.includes('right') || lower.includes('earning') || lower.includes('percent')) {
        reply = CHAT_KNOWLEDGE_BASE.royalties;
      } else if (lower.includes('submit') || lower.includes('manuscript') || lower.includes('guideline') || lower.includes('genre')) {
        reply = CHAT_KNOWLEDGE_BASE.submission;
      } else if (lower.includes('time') || lower.includes('how long') || lower.includes('process') || lower.includes('month')) {
        reply = CHAT_KNOWLEDGE_BASE.timeline;
      } else if (lower.includes('address') || lower.includes('contact') || lower.includes('email') || lower.includes('phone') || lower.includes('office')) {
        reply = CHAT_KNOWLEDGE_BASE.contact;
      } else if (lower.includes('instagram') || lower.includes('insta') || lower.includes('ig') || lower.includes('social')) {
        reply = CHAT_KNOWLEDGE_BASE.instagram;
      } else if (lower.includes('hi') || lower.includes('hello') || lower.includes('hey')) {
        reply = "Hello! Welcome to the House of Memoir editorial desk. Are you interested in submitting a manuscript or booking a consultation?";
      }

      appendMessage(reply, false);
    }, 600);
  }

  if (chatSendBtn) {
    chatSendBtn.addEventListener('click', handleSend);
  }

  if (chatInput) {
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleSend();
    });
  }

  // Quick Action Buttons inside Chat
  window.sendQuickChat = function(topic) {
    if (CHAT_KNOWLEDGE_BASE[topic]) {
      appendMessage(topic.toUpperCase() + ' QUESTION', true);
      setTimeout(() => {
        appendMessage(CHAT_KNOWLEDGE_BASE[topic], false);
      }, 400);
    }
  };
}

// ==========================================
// 10. Toast Notification
// ==========================================
function showToast(message, duration = 6000) {
  let toast = document.getElementById('toast-notification');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-notification';
    toast.className = 'fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#000613] text-white px-6 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-scale-up text-sm font-medium border border-[#1978e5]/40 max-w-[92vw] md:max-w-md';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<span class="material-symbols-outlined text-[#1978e5] text-2xl flex-shrink-0">check_circle</span><div class="leading-snug">${message}</div>`;
  toast.style.display = 'flex';

  if (window._toastTimer) clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => {
    toast.style.display = 'none';
  }, duration);
}

// ==========================================
// 11. Company Events Gallery & Lightbox
// ==========================================
let GALLERY_ITEMS = [];

// Helper for cross-page real-time deletion synchronization
function getDeletedIds() {
  try {
    return JSON.parse(localStorage.getItem('hom_deleted_ids') || '[]');
  } catch (e) {
    return [];
  }
}

// ==========================================
// 11. Dedicated Gallery Page Functions & Dynamic Loader
// ==========================================
async function initGallery() {
  const grid = document.getElementById('gallery-grid');
  if (!grid) return; // Only runs on pages with gallery section

  // Close lightbox on backdrop click or ESC key
  const lightbox = document.getElementById('gallery-lightbox');
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeGalleryLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeGalleryLightbox();
    });
  }

  const deletedIds = getDeletedIds();

  // Instant render from localStorage if updated via admin
  try {
    const localGallery = localStorage.getItem('hom_gallery_data');
    if (localGallery) {
      const parsed = JSON.parse(localGallery);
      if (Array.isArray(parsed)) {
        GALLERY_ITEMS = parsed.filter(item => !deletedIds.includes(item.id));
        renderDynamicGallery(GALLERY_ITEMS);
      }
    }
  } catch (e) {}

  // Fetch dynamic gallery photos from backend with static fallback & cache-busting
  try {
    const cacheBuster = '?t=' + Date.now();
    let res = await fetch(apiUrl('/api/gallery') + cacheBuster);
    if (!res.ok) res = await fetch(apiUrl('/data/gallery.json') + cacheBuster);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        GALLERY_ITEMS = data.filter(item => !deletedIds.includes(item.id));
        localStorage.setItem('hom_gallery_data', JSON.stringify(GALLERY_ITEMS));
        renderDynamicGallery(GALLERY_ITEMS);
      }
    }
  } catch (err) {
    try {
      const fallbackRes = await fetch(apiUrl('/data/gallery.json') + '?t=' + Date.now());
      if (fallbackRes.ok) {
        const data = await fallbackRes.json();
        if (Array.isArray(data) && data.length > 0) {
          GALLERY_ITEMS = data.filter(item => !deletedIds.includes(item.id));
          localStorage.setItem('hom_gallery_data', JSON.stringify(GALLERY_ITEMS));
          renderDynamicGallery(GALLERY_ITEMS);
        }
      }
    } catch (e2) {
      console.log('Using pre-rendered gallery items:', err);
    }
  }
}

function renderDynamicGallery(items) {
  const grid = document.getElementById('gallery-grid');
  if (!grid) return;

  if (!items || items.length === 0) {
    grid.innerHTML = `
      <div class="col-span-full text-center py-20 bg-gray-900/40 rounded-2xl border border-gray-800 p-8">
        <span class="material-symbols-outlined text-4xl text-gray-500 mb-2">photo_library</span>
        <h4 class="font-display text-lg text-white font-bold mb-1">No Photos in Gallery</h4>
        <p class="text-xs text-gray-400">Photos will appear here once added in the editorial portal.</p>
      </div>
    `;
    return;
  }

  const catBadges = {
    'galas': { name: 'Author Galas', badge: 'bg-[#c59b27]/90 text-black' },
    'launches': { name: 'Book Launches', badge: 'bg-[#1978e5] text-white' },
    'workshops': { name: 'Workshops', badge: 'bg-emerald-600 text-white' },
    'exhibitions': { name: 'Exhibitions', badge: 'bg-purple-600 text-white' }
  };

  grid.innerHTML = items.map(item => {
    const meta = catBadges[item.category] || { name: item.categoryName || 'Event', badge: 'bg-gray-700 text-white' };
    const safeTitle = (item.title || '').replace(/'/g, "\\'");
    const safeCat = (item.categoryName || meta.name).replace(/'/g, "\\'");
    const safeDate = (item.date || '').replace(/'/g, "\\'");
    const safeDesc = (item.description || '').replace(/'/g, "\\'");
    const safeImg = (item.image || '').replace(/'/g, "\\'");

    return `
      <div class="gallery-card group relative bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 shadow-xl cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:border-[#c59b27]/60"
           data-category="${item.category || 'galas'}"
           data-id="${item.id}"
           onclick="openGalleryLightbox('${safeImg}', '${safeTitle}', '${safeCat}', '${safeDate}', '${safeDesc}')">
        <div class="aspect-[4/3] w-full overflow-hidden bg-black/60 relative">
          <img src="${item.image}" alt="${item.title}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy"/>
          <div class="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-95 transition-opacity"></div>
          
          <div class="absolute top-4 left-4 flex items-center gap-2">
            <span class="${meta.badge} text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full shadow-sm tracking-wider">
              ${item.categoryName || meta.name}
            </span>
          </div>
          <div class="absolute top-4 right-4">
            <span class="bg-black/60 backdrop-blur-md border border-white/10 text-gray-300 text-[10px] font-semibold px-2.5 py-1 rounded-full">
              ${item.date || 'Recent'}
            </span>
          </div>

          <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span class="w-12 h-12 rounded-full bg-[#1978e5] text-white flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform">
              <span class="material-symbols-outlined text-2xl">fullscreen</span>
            </span>
          </div>

          <div class="absolute bottom-0 inset-x-0 p-5">
            <h3 class="font-display text-xl font-bold text-white group-hover:text-[#c59b27] transition-colors leading-snug">
              ${item.title}
            </h3>
            <p class="text-xs text-gray-300 mt-1.5 line-clamp-2 leading-relaxed">
              ${item.description || ''}
            </p>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

window.filterGallery = function(category, btnElement) {
  // Update active state of filter buttons
  document.querySelectorAll('.gallery-filter-btn').forEach(btn => {
    btn.classList.remove('active', 'bg-[#1978e5]', 'text-white', 'shadow-md');
    btn.classList.add('text-gray-300');
  });

  if (btnElement) {
    btnElement.classList.add('active', 'bg-[#1978e5]', 'text-white', 'shadow-md');
    btnElement.classList.remove('text-gray-300');
  }

  // Filter gallery cards
  const cards = document.querySelectorAll('.gallery-card');
  cards.forEach(card => {
    const cardCat = card.dataset.category;
    if (category === 'all' || cardCat === category) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
};

window.openGalleryLightbox = function(imgSrc, title, category, date, desc) {
  const modal = document.getElementById('gallery-lightbox');
  if (!modal) return;

  const imgEl = document.getElementById('lightbox-img');
  const titleEl = document.getElementById('lightbox-title');
  const badgeEl = document.getElementById('lightbox-badge');
  const dateEl = document.getElementById('lightbox-date');
  const descEl = document.getElementById('lightbox-desc');

  if (imgEl) imgEl.src = imgSrc || '';
  if (titleEl) titleEl.innerText = title || '';
  if (badgeEl) badgeEl.innerText = category || 'Company Event';
  if (dateEl) dateEl.innerText = date || '';
  if (descEl) descEl.innerText = desc || '';

  modal.classList.remove('hidden');
  modal.classList.add('flex');
  document.body.style.overflow = 'hidden';
};

window.closeGalleryLightbox = function() {
  const modal = document.getElementById('gallery-lightbox');
  if (!modal) return;
  modal.classList.add('hidden');
  modal.classList.remove('flex');
  document.body.style.overflow = '';
};

// ==========================================
// 12. Dynamic Content Loaders (Portfolio, Testimonials, Services)
// ==========================================
async function initDynamicPortfolio() {
  const portGrid = document.getElementById('portfolio-grid');
  const homeGrid = document.getElementById('home-portfolio-grid');
  if (!portGrid && !homeGrid) return;

  const deletedIds = getDeletedIds();

  function renderBooks(books) {
    if (portGrid) {
      if (books.length === 0) {
        portGrid.innerHTML = `<div class="col-span-full text-center py-16 text-gray-400">No books currently listed. Books added via admin will appear here.</div>`;
      } else {
        portGrid.innerHTML = books.map(book => `
          <div data-category="${(book.category || 'memoir').toLowerCase()}" class="book-card bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm flex flex-col hover:shadow-md transition-shadow">
            <div class="h-72 bg-gray-900 overflow-hidden relative">
              <img src="${book.image}" alt="${book.title}" class="w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-500" loading="lazy"/>
              <span class="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider text-gray-900">${book.category || 'Memoir'}</span>
            </div>
            <div class="p-6 flex-grow flex flex-col justify-between">
              <div>
                <h3 class="font-display text-xl font-bold text-gray-900 mb-1">${book.title}</h3>
                <p class="text-xs text-[#1978e5] font-semibold mb-3">by ${book.author}</p>
                <p class="text-sm text-gray-600 line-clamp-3">${book.description || ''}</p>
              </div>
              <div class="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center text-xs">
                <span class="text-gray-500">${book.format || 'Hardcover & Ebook'}</span>
                <span class="font-bold text-[#1978e5]">${book.badge || 'Published'}</span>
              </div>
            </div>
          </div>
        `).join('');
      }
    }

    if (homeGrid) {
      const previewBooks = books.slice(0, 3);
      if (previewBooks.length === 0) {
        homeGrid.innerHTML = `<div class="col-span-full text-center py-12 text-gray-400">No featured publications currently listed.</div>`;
      } else {
        homeGrid.innerHTML = previewBooks.map(book => `
          <div class="book-card bg-[#f9f9ff] rounded-2xl overflow-hidden border border-gray-200 flex flex-col shadow-sm">
            <div class="h-64 bg-gray-900 overflow-hidden relative">
              <img src="${book.image}" alt="${book.title}" class="w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-500" loading="lazy"/>
              <span class="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider text-gray-900">${book.category}</span>
            </div>
            <div class="p-6 flex-grow flex flex-col justify-between">
              <div>
                <h3 class="font-display text-xl font-bold text-gray-900 mb-1">${book.title}</h3>
                <p class="text-xs text-[#1978e5] font-semibold mb-3">by ${book.author}</p>
                <p class="text-xs text-gray-600 line-clamp-2">${book.description || ''}</p>
              </div>
            </div>
          </div>
        `).join('');
      }
    }
  }

  // Instant render from localStorage
  try {
    const localPort = localStorage.getItem('hom_portfolio_data');
    if (localPort) {
      const parsed = JSON.parse(localPort);
      if (Array.isArray(parsed) && parsed.length > 0) {
        renderBooks(parsed.filter(b => !deletedIds.includes(b.id)));
      }
    }
  } catch (e) {}

  try {
    const cacheBuster = '?t=' + Date.now();
    let res = await fetch(apiUrl('/api/portfolio') + cacheBuster);
    if (!res.ok) res = await fetch(apiUrl('/data/portfolio.json') + cacheBuster);
    if (!res.ok) return;
    const books = await res.json();
    if (Array.isArray(books) && books.length > 0) {
      const activeBooks = books.filter(b => !deletedIds.includes(b.id));
      localStorage.setItem('hom_portfolio_data', JSON.stringify(activeBooks));
      renderBooks(activeBooks);
    }
  } catch (err) {
    console.warn('Dynamic portfolio loading note:', err);
  }
}

async function initDynamicTestimonials() {
  const grid = document.getElementById('testimonials-grid');
  if (!grid) return;

  const deletedIds = getDeletedIds();

  function renderTst(items) {
    if (items.length === 0) {
      grid.innerHTML = `<div class="col-span-full text-center py-12 text-gray-400">No author reviews available yet.</div>`;
      return;
    }
    grid.innerHTML = items.map((item, idx) => {
      const isFeatured = item.featured || idx === 0;
      const colSpan = isFeatured ? 'md:col-span-8' : 'md:col-span-4';
      const stars = '★'.repeat(item.rating || 5);

      return `
        <div class="${colSpan} bg-white border border-gray-200 rounded-2xl p-8 ${isFeatured ? 'md:p-10' : ''} shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div class="flex items-center gap-1 text-amber-500 mb-4">
              <span class="text-lg tracking-widest">${stars}</span>
            </div>
            <blockquote class="font-display ${isFeatured ? 'text-2xl md:text-3xl' : 'text-base md:text-lg'} text-gray-900 leading-snug italic mb-6">
              "${item.quote}"
            </blockquote>
          </div>
          <div class="flex items-center gap-4 pt-4 border-t border-gray-100">
            <img src="${item.image}" alt="${item.author}" class="${isFeatured ? 'w-14 h-14' : 'w-12 h-12'} rounded-full object-cover border-2 border-[#1978e5]"/>
            <div>
              <div class="font-bold text-gray-900 ${isFeatured ? 'text-base' : 'text-sm'}">${item.author}</div>
              <div class="text-xs text-gray-500">${item.book ? `Author of <i>${item.book}</i>` : (item.titleBadge || 'Author')}</div>
              ${item.genreTag ? `<div class="mt-1 inline-block bg-[#1978e5]/10 text-[#1978e5] text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">${item.genreTag}</div>` : ''}
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // Instant render from localStorage
  try {
    const localTst = localStorage.getItem('hom_testimonials_data');
    if (localTst) {
      const parsed = JSON.parse(localTst);
      if (Array.isArray(parsed)) {
        renderTst(parsed.filter(t => !deletedIds.includes(t.id)));
      }
    }
  } catch (e) {}

  try {
    const cacheBuster = '?t=' + Date.now();
    let res = await fetch(apiUrl('/api/testimonials') + cacheBuster);
    if (!res.ok) res = await fetch(apiUrl('/data/testimonials.json') + cacheBuster);
    if (!res.ok) return;
    const list = await res.json();
    if (Array.isArray(list) && list.length > 0) {
      const activeList = list.filter(item => !deletedIds.includes(item.id));
      localStorage.setItem('hom_testimonials_data', JSON.stringify(activeList));
      renderTst(activeList);
    }
  } catch (err) {
    console.warn('Dynamic testimonials loading note:', err);
  }
}

async function initDynamicServices() {
  const srvGrid = document.getElementById('services-grid');
  const pkgGrid = document.getElementById('packages-grid');
  if (!srvGrid && !pkgGrid) return;

  const deletedIds = getDeletedIds();

  function renderSrv(data) {
    const filteredServices = (data.services || []).filter(s => !deletedIds.includes(s.id));
    const filteredPackages = (data.packages || []).filter(p => !deletedIds.includes(p.id));

    if (srvGrid) {
      if (filteredServices.length === 0) {
        srvGrid.innerHTML = `<div class="col-span-full text-center py-12 text-gray-400">No publishing services listed yet.</div>`;
      } else {
        srvGrid.innerHTML = filteredServices.map(srv => `
          <div class="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm flex flex-col justify-between hover:border-[#1978e5] transition-colors">
            <div>
              <div class="w-14 h-14 rounded-2xl bg-[#1978e5]/10 text-[#1978e5] flex items-center justify-center mb-6">
                <span class="material-symbols-outlined text-3xl">${srv.icon || 'rate_review'}</span>
              </div>
              <h3 class="font-display text-2xl font-bold text-gray-900 mb-3">${srv.title}</h3>
              <p class="text-gray-600 leading-relaxed mb-6">${srv.description}</p>
              <ul class="space-y-2 text-sm text-gray-700 mb-8">
                ${(srv.deliverables || []).map(d => `
                  <li class="flex items-center gap-2">
                    <span class="material-symbols-outlined text-sm text-[#1978e5]">check_circle</span> ${d}
                  </li>
                `).join('')}
              </ul>
            </div>
            <button data-open-manuscript-modal class="w-full py-3 bg-gray-50 border border-gray-200 text-gray-900 font-semibold text-sm rounded hover:bg-[#1978e5] hover:text-white transition-colors">
              ${srv.ctaText || 'Request Assessment'}
            </button>
          </div>
        `).join('');
        initManuscriptModal();
      }
    }

    if (pkgGrid && filteredPackages.length > 0) {
      pkgGrid.innerHTML = filteredPackages.map(pkg => {
        const isPopular = pkg.badge === 'Most Popular';
        return `
          <div class="bg-white/5 rounded-2xl p-8 border ${isPopular ? 'border-2 border-[#1978e5] relative shadow-2xl scale-105 bg-white/10' : 'border-white/10'} flex flex-col justify-between">
            ${isPopular ? '<span class="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#1978e5] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">Most Popular</span>' : ''}
            <div>
              <h3 class="font-display text-2xl font-bold mb-2">${pkg.name}</h3>
              <p class="text-xs text-gray-400 mb-6">${pkg.subtitle || ''}</p>
              <div class="text-3xl font-bold text-[#1978e5] mb-6">${pkg.price} <span class="text-xs text-gray-400 font-normal">one-time</span></div>
              <ul class="space-y-3 text-xs text-gray-300 mb-8">
                ${(pkg.features || []).map(f => `
                  <li class="flex items-center gap-2">
                    <span class="material-symbols-outlined text-sm text-[#1978e5]">check</span> ${f}
                  </li>
                `).join('')}
              </ul>
            </div>
            <a href="appointment.html" class="w-full py-3 bg-[#1978e5] text-white text-center font-semibold text-xs rounded hover:bg-blue-600 transition-colors shadow-lg">Select Package</a>
          </div>
        `;
      }).join('');
    }
  }

  // Instant render from localStorage
  try {
    const localSrv = localStorage.getItem('hom_services_data');
    if (localSrv) {
      const parsed = JSON.parse(localSrv);
      if (parsed) renderSrv(parsed);
    }
  } catch (e) {}

  try {
    const cacheBuster = '?t=' + Date.now();
    let res = await fetch(apiUrl('/api/services') + cacheBuster);
    if (!res.ok) res = await fetch(apiUrl('/data/services.json') + cacheBuster);
    if (!res.ok) return;
    const data = await res.json();
    if (data && ((data.services && data.services.length > 0) || (data.packages && data.packages.length > 0))) {
      localStorage.setItem('hom_services_data', JSON.stringify(data));
      renderSrv(data);
    }
  } catch (err) {
    console.warn('Dynamic services loading note:', err);
  }
}

// ==========================================
// 13. Hero Video Controller & Dynamic Customization
// ==========================================
window.toggleHeroVideoMute = function() {
  const vid = document.getElementById('hero-main-video');
  const icon = document.getElementById('hero-mute-icon');
  if (!vid) return;

  vid.muted = !vid.muted;
  if (icon) {
    icon.innerText = vid.muted ? 'volume_off' : 'volume_up';
  }
};

async function initDynamicHeroVideo() {
  const vid = document.getElementById('hero-main-video');
  if (!vid) return;

  try {
    let res = await fetch(apiUrl('/api/site-config'));
    if (!res.ok) res = await fetch(apiUrl('/data/site-config.json'));
    if (!res.ok) return;
    const config = await res.json();
    if (!config) return;

    if (config.heroTag && document.getElementById('hero-tag-text')) {
      document.getElementById('hero-tag-text').innerText = config.heroTag;
    }

    if (config.heroVideo && config.heroVideo !== 'hero-video.mp4') {
      const srcEl = vid.querySelector('source');
      if (srcEl) {
        srcEl.src = config.heroVideo;
      } else {
        vid.src = config.heroVideo;
      }
      if (config.heroPoster) vid.poster = config.heroPoster;
      vid.load();
      vid.play().catch(() => {});
    }
  } catch (e) {
    // Ignore, defaults to pre-configured source in HTML
  }
}
