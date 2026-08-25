// JavaScript functionality for House of Memoir

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initManuscriptModal();
  initSupportChat();
  initCalendarPicker();
  initDropzone();
});

// Mobile Navigation Menu Toggle
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

// Global Manuscript Submission Modal Controller
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
    modalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      closeModal();
      showToast('Manuscript submitted successfully! Our editors will review your work within 4-6 weeks.');
    });
  }
}

// Multi-step Form Navigation for Appointment/Enquiry page
function nextStep(step) {
  const steps = document.querySelectorAll('.form-step');
  steps.forEach(el => el.classList.remove('active'));

  const targetStep = document.getElementById(`step-${step}`);
  if (targetStep) targetStep.classList.add('active');

  const ind2 = document.getElementById('step-2-indicator');
  const ind3 = document.getElementById('step-3-indicator');

  if (ind2 && step >= 2) ind2.classList.replace('bg-surface-variant', 'bg-secondary');
  if (ind3 && step >= 3) ind3.classList.replace('bg-surface-variant', 'bg-secondary');
}

function prevStep(step) {
  const steps = document.querySelectorAll('.form-step');
  steps.forEach(el => el.classList.remove('active'));

  const targetStep = document.getElementById(`step-${step}`);
  if (targetStep) targetStep.classList.add('active');

  const ind2 = document.getElementById('step-2-indicator');
  const ind3 = document.getElementById('step-3-indicator');

  if (ind3 && step < 3) ind3.classList.replace('bg-secondary', 'bg-surface-variant');
  if (ind2 && step < 2) ind2.classList.replace('bg-secondary', 'bg-surface-variant');
}

// Accordion Toggle
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

// Portfolio Filtering
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

// Calendar Date & Slot Picker Simulation
function initCalendarPicker() {
  const days = document.querySelectorAll('[data-calendar-day]');
  const slots = document.querySelectorAll('[data-time-slot]');
  const confirmBtn = document.getElementById('confirm-booking-btn');

  days.forEach(day => {
    day.addEventListener('click', () => {
      days.forEach(d => d.classList.remove('bg-[#1978e5]', 'text-white', 'font-bold'));
      day.classList.add('bg-[#1978e5]', 'text-white', 'font-bold');
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
    });
  });

  if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
      showToast('Consultation Appointment Booked! We have sent a confirmation email to your inbox.');
    });
  }
}

// Dropzone file upload simulation
function initDropzone() {
  const dropzone = document.getElementById('manuscript-dropzone');
  const fileInput = document.getElementById('manuscript-file-input');
  const fileStatus = document.getElementById('file-upload-status');

  if (!dropzone || !fileInput) return;

  dropzone.addEventListener('click', () => fileInput.click());

  fileInput.addEventListener('change', () => {
    if (fileInput.files.length > 0) {
      const name = fileInput.files[0].name;
      if (fileStatus) {
        fileStatus.innerHTML = `<span class="text-green-600 font-bold">File Selected:</span> ${name}`;
      }
    }
  });

  dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.classList.add('border-[#1978e5]', 'bg-[#1978e5]/5');
  });

  dropzone.addEventListener('dragleave', () => {
    dropzone.classList.remove('border-[#1978e5]', 'bg-[#1978e5]/5');
  });

  dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('border-[#1978e5]', 'bg-[#1978e5]/5');
    if (e.dataTransfer.files.length > 0) {
      fileInput.files = e.dataTransfer.files;
      const name = e.dataTransfer.files[0].name;
      if (fileStatus) {
        fileStatus.innerHTML = `<span class="text-green-600 font-bold">File Attached:</span> ${name}`;
      }
    }
  });
}

// Support Chat Widget Toggle
function initSupportChat() {
  const chatBtn = document.getElementById('support-chat-btn');
  const chatWindow = document.getElementById('support-chat-window');
  const closeChat = document.getElementById('close-support-chat');

  if (!chatBtn || !chatWindow) return;

  chatBtn.addEventListener('click', () => {
    chatWindow.classList.toggle('hidden');
    chatWindow.classList.toggle('flex');
  });

  if (closeChat) {
    closeChat.addEventListener('click', () => {
      chatWindow.classList.add('hidden');
      chatWindow.classList.remove('flex');
    });
  }
}

// Toast Feedback Notification
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
