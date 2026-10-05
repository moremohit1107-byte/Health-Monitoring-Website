// ===== PoshanTrack — Main JS =====

// Mobile nav toggle
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
      const icon = toggle.querySelector('i');
      icon.className = links.classList.contains('open') ? 'ri-close-line' : 'ri-menu-line';
    });
  }

  // Set active nav link
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
});

// ===== LocalStorage Helpers =====
function getStore(key, fallback = []) {
  try {
    const data = localStorage.getItem('poshantrack_' + key);
    return data ? JSON.parse(data) : fallback;
  } catch { return fallback; }
}

function setStore(key, value) {
  localStorage.setItem('poshantrack_' + key, JSON.stringify(value));
}

// ===== Toast Notifications =====
function showToast(message, type = 'success') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<i class="ri-${type === 'success' ? 'check' : 'error-warning'}-line"></i> ${message}`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// ===== Modal Helpers =====
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Close modal on backdrop click
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('active');
    document.body.style.overflow = '';
  }
});

// ===== Format Date =====
function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatTime(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

function getToday() {
  return new Date().toISOString().split('T')[0];
}

// ===== Sample Children Data (initialize if empty) =====
function initSampleData() {
  if (getStore('children').length === 0) {
    const sampleChildren = [
      { id: 1, name: 'Aarav Sharma', age: 4, gender: 'Male', weight: 14.5, height: 98, center: 'Anganwadi #12, Jaipur' },
      { id: 2, name: 'Priya Devi', age: 3, gender: 'Female', weight: 11.2, height: 88, center: 'Anganwadi #12, Jaipur' },
      { id: 3, name: 'Rohan Kumar', age: 5, gender: 'Male', weight: 16.0, height: 105, center: 'Anganwadi #7, Udaipur' },
      { id: 4, name: 'Ananya Singh', age: 2, gender: 'Female', weight: 9.8, height: 78, center: 'Anganwadi #7, Udaipur' },
      { id: 5, name: 'Vikram Meena', age: 4, gender: 'Male', weight: 12.0, height: 92, center: 'Anganwadi #3, Jodhpur' },
      { id: 6, name: 'Sita Kumari', age: 3, gender: 'Female', weight: 10.5, height: 85, center: 'Anganwadi #3, Jodhpur' }
    ];
    setStore('children', sampleChildren);
  }

  if (getStore('meals').length === 0) {
    const today = getToday();
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const sampleMeals = [
      { id: 1, childId: 1, date: today, mealType: 'Breakfast', food: 'Daliya (Porridge)', calories: 150, protein: 5, carbs: 28, iron: 1.8, time: new Date().toISOString() },
      { id: 2, childId: 1, date: today, mealType: 'Lunch', food: 'Khichdi (Dal Rice)', calories: 200, protein: 8, carbs: 30, iron: 2.5, time: new Date().toISOString() },
      { id: 3, childId: 2, date: today, mealType: 'Breakfast', food: 'Milk (Full Cream)', calories: 150, protein: 8, carbs: 12, iron: 0.1, time: new Date().toISOString() },
      { id: 4, childId: 3, date: yesterday, mealType: 'Lunch', food: 'Roti with Sabzi', calories: 220, protein: 6, carbs: 35, iron: 2.0, time: new Date(Date.now() - 86400000).toISOString() },
      { id: 5, childId: 2, date: today, mealType: 'Snack', food: 'Banana', calories: 89, protein: 1, carbs: 23, iron: 0.3, time: new Date().toISOString() },
    ];
    setStore('meals', sampleMeals);
  }
}

initSampleData();

// ===== Get nutrition status color =====
function getNutritionStatus(weight, age) {
  // Simplified WHO weight-for-age reference
  const normalWeightByAge = { 1: 9.6, 2: 12.2, 3: 14.3, 4: 16.3, 5: 18.3, 6: 20.5 };
  const expected = normalWeightByAge[age] || 14;
  const ratio = weight / expected;
  if (ratio >= 0.9) return { label: 'Normal', color: 'green' };
  if (ratio >= 0.75) return { label: 'Moderate', color: 'yellow' };
  return { label: 'Underweight', color: 'orange' };
}
