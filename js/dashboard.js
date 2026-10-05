// ===== Dashboard JS =====

document.addEventListener('DOMContentLoaded', () => {
  renderStats();
  renderChildren();
  renderActivity();

  // Add child form
  const form = document.getElementById('addChildForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      addChild();
    });
  }
});

function renderStats() {
  const children = getStore('children');
  const meals = getStore('meals');
  const today = getToday();

  // Total children
  document.getElementById('statChildren').textContent = children.length;

  // Today's meals
  const todayMeals = meals.filter(m => m.date === today);
  document.getElementById('statMeals').textContent = todayMeals.length;

  // Healthy percentage
  if (children.length > 0) {
    const healthy = children.filter(c => getNutritionStatus(c.weight, c.age).label === 'Normal').length;
    const pct = Math.round((healthy / children.length) * 100);
    document.getElementById('statHealthy').textContent = pct + '%';
  }
}

function renderChildren() {
  const children = getStore('children');
  const container = document.getElementById('childrenList');
  if (!container) return;

  if (children.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="padding: 24px 0;">
        <i class="ri-user-add-line"></i>
        <p>No children registered yet.</p>
      </div>`;
    return;
  }

  const avatarColors = [
    { bg: 'var(--primary-light)', color: 'var(--primary)' },
    { bg: 'var(--accent-light)', color: 'var(--accent)' },
    { bg: 'var(--blue-light)', color: 'var(--blue)' },
    { bg: 'var(--yellow-light)', color: 'var(--yellow)' },
    { bg: 'var(--purple-light)', color: 'var(--purple)' }
  ];

  container.innerHTML = children.map((child, idx) => {
    const status = getNutritionStatus(child.weight, child.age);
    const clr = avatarColors[idx % avatarColors.length];
    const initials = child.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

    return `
      <div class="child-row">
        <div class="child-avatar" style="background: ${clr.bg}; color: ${clr.color};">
          ${initials}
        </div>
        <div class="child-info">
          <h4>${child.name}</h4>
          <small>${child.age} yrs · ${child.weight} kg · ${child.center || 'No center'}</small>
        </div>
        <span class="child-status badge badge-${status.color === 'green' ? 'green' : status.color === 'yellow' ? 'yellow' : 'orange'}">
          ${status.label}
        </span>
      </div>`;
  }).join('');
}

function renderActivity() {
  const meals = getStore('meals');
  const children = getStore('children');
  const container = document.getElementById('activityList');
  if (!container) return;

  // Sort by time, most recent first
  const sorted = [...meals].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 6);

  if (sorted.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="padding: 24px 0;">
        <i class="ri-time-line"></i>
        <p>No activity yet. Start logging meals!</p>
      </div>`;
    return;
  }

  const dotColors = ['green', 'orange', 'blue'];

  container.innerHTML = sorted.map((meal, idx) => {
    const child = children.find(c => c.id === meal.childId);
    const childName = child ? child.name : 'Unknown';
    const timeAgo = getRelativeTime(meal.time);
    const dotColor = dotColors[idx % dotColors.length];

    return `
      <div class="activity-item">
        <div class="activity-dot ${dotColor}"></div>
        <div class="activity-text">
          <strong>${childName}</strong> had <strong>${meal.food}</strong> for ${meal.mealType}
        </div>
        <div class="activity-time">${timeAgo}</div>
      </div>`;
  }).join('');
}

function getRelativeTime(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function addChild() {
  const name = document.getElementById('childName').value.trim();
  const age = parseInt(document.getElementById('childAge').value);
  const gender = document.getElementById('childGender').value;
  const weight = parseFloat(document.getElementById('childWeight').value);
  const height = parseFloat(document.getElementById('childHeight').value) || 0;
  const center = document.getElementById('childCenter').value.trim();

  if (!name || !age || !weight) {
    showToast('Please fill in all required fields', 'error');
    return;
  }

  const children = getStore('children');
  const newChild = {
    id: Date.now(),
    name,
    age,
    gender,
    weight,
    height,
    center
  };

  children.push(newChild);
  setStore('children', children);

  closeModal('addChildModal');
  document.getElementById('addChildForm').reset();
  showToast(`${name} registered successfully!`);

  renderStats();
  renderChildren();
  renderActivity();
}
