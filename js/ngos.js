// ===== NGO Directory JS =====

const ngoData = [
  {
    name: 'Akshaya Patra Foundation',
    type: 'Food Supply',
    description: 'Runs the world\'s largest school meal programme, providing mid-day meals to 2 million children daily across India.',
    location: 'Bengaluru, Karnataka',
    phone: '+91-80-3014-3400',
    website: 'https://www.akshayapatra.org',
    services: ['Mid-day Meals', 'Kitchen Infrastructure', 'Nutrition Programs']
  },
  {
    name: 'Naandi Foundation',
    type: 'Food Supply',
    description: 'Operates large-scale school feeding programmes and safe drinking water projects in underserved communities.',
    location: 'Hyderabad, Telangana',
    phone: '+91-40-4455-0605',
    website: 'https://www.naandi.org',
    services: ['School Feeding', 'Safe Water', 'Agriculture Training']
  },
  {
    name: 'CARE India',
    type: 'Healthcare',
    description: 'Works on maternal and child health, nutrition interventions, and women\'s empowerment in rural India.',
    location: 'New Delhi',
    phone: '+91-11-4905-8585',
    website: 'https://www.careindia.org',
    services: ['Maternal Health', 'Child Nutrition', 'Women Empowerment']
  },
  {
    name: 'Save the Children India',
    type: 'Child Welfare',
    description: 'Protects children\'s rights and provides health, nutrition, and education support in 15+ states.',
    location: 'New Delhi',
    phone: '+91-11-4229-0222',
    website: 'https://www.savethechildren.in',
    services: ['Child Protection', 'Health & Nutrition', 'Education']
  },
  {
    name: 'Smile Foundation',
    type: 'Healthcare',
    description: 'Operates mobile health vans and nutrition centres for underprivileged children and mothers.',
    location: 'New Delhi',
    phone: '+91-11-4310-7070',
    website: 'https://www.smilefoundationindia.org',
    services: ['Mobile Clinics', 'Nutrition Centres', 'Health Camps']
  },
  {
    name: 'CRY (Child Rights and You)',
    type: 'Child Welfare',
    description: 'Ensures lasting change in the lives of underprivileged children through nutrition and education initiatives.',
    location: 'Mumbai, Maharashtra',
    phone: '+91-22-2388-9790',
    website: 'https://www.cry.org',
    services: ['Child Rights', 'Nutrition Support', 'Education Access']
  },
  {
    name: 'Action Against Hunger',
    type: 'Food Supply',
    description: 'International NGO focusing on undernutrition treatment and prevention in high-burden Indian states.',
    location: 'New Delhi',
    phone: '+91-11-4106-0345',
    website: 'https://www.actionagainsthunger.in',
    services: ['Malnutrition Treatment', 'WASH Programs', 'Food Security']
  },
  {
    name: 'Pratham',
    type: 'Education',
    description: 'India\'s largest education NGO, improving learning outcomes for children in government schools and communities.',
    location: 'Mumbai, Maharashtra',
    phone: '+91-22-2676-9944',
    website: 'https://www.pratham.org',
    services: ['Early Childhood', 'Learning Programs', 'Digital Education']
  },
  {
    name: 'UNICEF India',
    type: 'Child Welfare',
    description: 'Supports Government of India\'s POSHAN Abhiyaan mission to reduce stunting and malnutrition in children.',
    location: 'New Delhi',
    phone: '+91-11-2469-0401',
    website: 'https://www.unicef.org/india',
    services: ['POSHAN Abhiyaan', 'Immunization', 'Child Protection']
  },
  {
    name: 'Seva Mandir',
    type: 'Healthcare',
    description: 'Works in southern Rajasthan providing community health and nutrition programmes for tribal populations.',
    location: 'Udaipur, Rajasthan',
    phone: '+91-294-245-1041',
    website: 'https://www.sevamandir.org',
    services: ['Community Health', 'Women Collectives', 'Natural Resource Mgmt']
  },
  {
    name: 'Jan Swasthya Sahyog',
    type: 'Healthcare',
    description: 'Rural health organization providing free nutritional rehabilitation and healthcare in Chhattisgarh.',
    location: 'Bilaspur, Chhattisgarh',
    phone: '+91-7753-284-143',
    website: 'https://www.jssbilaspur.org',
    services: ['Free Healthcare', 'Nutrition Rehab', 'Community Outreach']
  },
  {
    name: 'Annapurna Trust',
    type: 'Food Supply',
    description: 'Distributes subsidized nutritious meals to urban poor and migrant workers across Maharashtra.',
    location: 'Pune, Maharashtra',
    phone: '+91-20-2544-3271',
    website: '#',
    services: ['Subsidized Meals', 'Urban Nutrition', 'Food Distribution']
  }
];

let currentFilter = 'all';
let currentSearch = '';

document.addEventListener('DOMContentLoaded', () => {
  renderNGOs();
  setupSearch();
  setupFilters();
});

function setupSearch() {
  const searchInput = document.getElementById('ngoSearch');
  searchInput.addEventListener('input', (e) => {
    currentSearch = e.target.value.toLowerCase().trim();
    renderNGOs();
  });
}

function setupFilters() {
  document.querySelectorAll('.filter-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentFilter = pill.dataset.filter;
      renderNGOs();
    });
  });
}

function renderNGOs() {
  const grid = document.getElementById('ngoGrid');
  const emptyState = document.getElementById('ngoEmpty');
  const countEl = document.getElementById('ngoCount');

  let filtered = ngoData;

  // Apply type filter
  if (currentFilter !== 'all') {
    filtered = filtered.filter(n => n.type === currentFilter);
  }

  // Apply search
  if (currentSearch) {
    filtered = filtered.filter(n =>
      n.name.toLowerCase().includes(currentSearch) ||
      n.location.toLowerCase().includes(currentSearch) ||
      n.description.toLowerCase().includes(currentSearch) ||
      n.services.some(s => s.toLowerCase().includes(currentSearch))
    );
  }

  countEl.textContent = `Showing ${filtered.length} organization${filtered.length !== 1 ? 's' : ''}`;

  if (filtered.length === 0) {
    grid.innerHTML = '';
    emptyState.style.display = '';
    return;
  }

  emptyState.style.display = 'none';

  const badgeColors = {
    'Food Supply': 'badge-green',
    'Healthcare': 'badge-blue',
    'Education': 'badge-purple',
    'Child Welfare': 'badge-orange'
  };

  const serviceBadgeColors = ['badge-green', 'badge-blue', 'badge-yellow', 'badge-purple', 'badge-orange'];

  grid.innerHTML = filtered.map(ngo => `
    <div class="ngo-card">
      <div class="ngo-card-header">
        <div>
          <h3>${ngo.name}</h3>
          <span class="badge ${badgeColors[ngo.type] || 'badge-green'}">${ngo.type}</span>
        </div>
      </div>
      <p>${ngo.description}</p>
      <div class="ngo-meta">
        <div class="ngo-meta-item">
          <i class="ri-map-pin-2-line"></i>
          ${ngo.location}
        </div>
        <div class="ngo-meta-item">
          <i class="ri-phone-line"></i>
          <a href="tel:${ngo.phone}" style="color: var(--primary);">${ngo.phone}</a>
        </div>
        ${ngo.website !== '#' ? `
        <div class="ngo-meta-item">
          <i class="ri-global-line"></i>
          <a href="${ngo.website}" target="_blank" rel="noopener" style="color: var(--primary);">Visit Website ↗</a>
        </div>` : ''}
      </div>
      <div class="ngo-services">
        ${ngo.services.map((s, i) => `<span class="badge ${serviceBadgeColors[i % serviceBadgeColors.length]}">${s}</span>`).join('')}
      </div>
    </div>
  `).join('');
}
