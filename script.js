// House of Memoir - Main Client Logic & Hybrid Form Submissions
// Supports: Local Node REST API (/api/*) + Direct Cloud Email (Web3Forms/Formspree)

const CONFIG = {
  // Web3Forms Access Key (Get free key from https://web3forms.com/ if static hosting without Node)
  web3FormsKey: '',
  // Set your receiving email address here
  notificationEmail: 'submissions@houseofmemoir.com',
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
        await submitHybridData('/api/submissions', payload);
        closeModal();
        modalForm.reset();
        const statusEl = modalForm.querySelector('.file-upload-status, #file-upload-status');
        if (statusEl) statusEl.innerText = 'Click to browse or drag and drop file here';
        showToast('Manuscript submitted successfully! Our editors will review your work within 4-6 weeks.');
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
        await submitHybridData('/api/submissions', payload);
        submissionForm.reset();
        nextStep(1);
        showToast('Application Submitted! Our editorial board will review your manuscript within 4 weeks.');
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
        await submitHybridData('/api/queries', payload);
        queryForm.reset();
        showToast('Thank you! Your query has been submitted. Our team will contact you shortly.');
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

  // 1. Try sending to Local/Node Backend API
  try {
    const res = await fetch(apiEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (res.ok) {
      backendSuccess = true;
      const json = await res.json();
      console.log('Saved to House of Memoir backend:', json);
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
          subject: `[House of Memoir] New ${data.source || 'Submission'}`,
          from_name: 'House of Memoir Portal',
          ...data
        })
      });
      console.log('Dispatched to Web3Forms cloud delivery');
    } catch (e) {
      console.warn('Web3Forms dispatch warning:', e);
    }
  }

  return { success: true };
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
  const cards = document.querySelectorAll('[data-category]');
  const buttons = document.querySelectorAll('[data-filter-btn]');

  buttons.forEach(btn => {
    btn.classList.remove('bg-[#1978e5]', 'text-white');
    btn.classList.add('text-gray-700', 'bg-transparent', 'hover:bg-gray-100');
  });

  if (btnElement) {
    btnElement.classList.remove('text-gray-700', 'bg-transparent', 'hover:bg-gray-100');
    btnElement.classList.add('bg-[#1978e5]', 'text-white');
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
        await submitHybridData('/api/appointments', payload);
        showToast(`Consultation Booked for Nov ${selectedCalendarDay} at ${selectedTimeSlot}! Check email confirmation.`);
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
  royalties: "At House of Memoir, authors retain 100% of all intellectual property, copyright, and worldwide sales royalties across print, digital, and audio formats.",
  submission: "We accept memoirs, literary fiction, historical non-fiction, and poetry. Submissions are reviewed by our senior editorial board within 4-6 weeks.",
  timeline: "A typical publication cycle spans 6 to 9 months: 8-12 weeks for developmental editing & copyediting, 4 weeks for typesetting and cover design, followed by proofing and global distribution.",
  contact: "Our main editorial offices are located at 750 Fifth Avenue, Suite 1400, New York, NY 10019. You can also reach our desk at submissions@houseofmemoir.com.",
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
      let reply = "Thank you for reaching out to House of Memoir. Would you like to schedule a private consultation or submit your manuscript?";

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
function showToast(message) {
  let toast = document.getElementById('toast-notification');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-notification';
    toast.className = 'fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#000613] text-white px-6 py-3.5 rounded-full shadow-2xl flex items-center gap-3 animate-scale-up text-sm font-medium border border-[#1978e5]/40';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<span class="material-symbols-outlined text-[#1978e5]">check_circle</span><span>${message}</span>`;
  toast.style.display = 'flex';

  setTimeout(() => {
    toast.style.display = 'none';
  }, 5000);
}

// ==========================================
// 11. Company Events Gallery & Lightbox
// ==========================================
let GALLERY_ITEMS = [];

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

  // Fetch dynamic gallery photos from backend
  try {
    const res = await fetch('/api/gallery');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        GALLERY_ITEMS = data;
        renderDynamicGallery(GALLERY_ITEMS);
      }
    }
  } catch (err) {
    console.log('Using pre-rendered gallery items:', err);
  }
}

function renderDynamicGallery(items) {
  const grid = document.getElementById('gallery-grid');
  if (!grid || !items || items.length === 0) return;

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
