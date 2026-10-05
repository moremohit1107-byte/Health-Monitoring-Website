// ===== Food Tracker JS =====

// Indian Anganwadi food database
const foodDatabase = [
  { name: 'Khichdi (Dal Rice)', calories: 200, protein: 8, carbs: 30, iron: 2.5, serving: '1 bowl' },
  { name: 'Daliya (Porridge)', calories: 150, protein: 5, carbs: 28, iron: 1.8, serving: '1 bowl' },
  { name: 'Suji Halwa', calories: 180, protein: 3, carbs: 25, iron: 1.0, serving: '1 serving' },
  { name: 'Upma', calories: 160, protein: 4, carbs: 22, iron: 1.2, serving: '1 bowl' },
  { name: 'Poha', calories: 170, protein: 4, carbs: 26, iron: 3.5, serving: '1 bowl' },
  { name: 'Boiled Egg', calories: 78, protein: 6, carbs: 0.5, iron: 1.0, serving: '1 egg' },
  { name: 'Banana', calories: 89, protein: 1, carbs: 23, iron: 0.3, serving: '1 piece' },
  { name: 'Apple', calories: 52, protein: 0.3, carbs: 14, iron: 0.1, serving: '1 piece' },
  { name: 'Milk (Full Cream)', calories: 150, protein: 8, carbs: 12, iron: 0.1, serving: '1 glass' },
  { name: 'Roti with Sabzi', calories: 220, protein: 6, carbs: 35, iron: 2.0, serving: '2 roti' },
  { name: 'Dal (Lentil Soup)', calories: 120, protein: 9, carbs: 18, iron: 3.0, serving: '1 bowl' },
  { name: 'Rice', calories: 130, protein: 3, carbs: 28, iron: 0.8, serving: '1 bowl' },
  { name: 'Seasonal Fruit', calories: 60, protein: 1, carbs: 15, iron: 0.4, serving: '1 serving' },
  { name: 'Chana (Chickpea)', calories: 160, protein: 9, carbs: 27, iron: 2.9, serving: '1 bowl' },
  { name: 'Sattu Drink', calories: 100, protein: 7, carbs: 15, iron: 2.0, serving: '1 glass' },
  { name: 'Panjiri (Energy Mix)', calories: 200, protein: 5, carbs: 22, iron: 2.5, serving: '1 serving' },
  { name: 'Sprouted Moong', calories: 90, protein: 7, carbs: 12, iron: 1.8, serving: '1 bowl' },
  { name: 'Rajma (Kidney Beans)', calories: 140, protein: 8, carbs: 25, iron: 2.5, serving: '1 bowl' },
  { name: 'Paneer (Cottage Cheese)', calories: 120, protein: 10, carbs: 3, iron: 0.5, serving: '50g' },
  { name: 'Curd / Dahi', calories: 60, protein: 4, carbs: 5, iron: 0.1, serving: '1 bowl' },
  { name: 'Sweet Potato', calories: 90, protein: 2, carbs: 20, iron: 0.7, serving: '1 piece' },
  { name: 'Moong Dal Cheela', calories: 110, protein: 7, carbs: 15, iron: 1.5, serving: '2 pieces' },
  { name: 'Vegetable Soup', calories: 70, protein: 2, carbs: 12, iron: 0.8, serving: '1 bowl' },
  { name: 'Jaggery (Gur)', calories: 50, protein: 0.1, carbs: 12, iron: 1.0, serving: '1 piece' }
];

// Recommended daily nutrition for children (age 2-6)
const dailyTargets = {
  calories: 1200,
  protein: 20,
  carbs: 150,
  iron: 10
};

let selectedMealType = 'Breakfast';
let selectedFood = null;

document.addEventListener('DOMContentLoaded', () => {
  populateChildren();
  setupDateInput();
  setupMealTabs();
  setupFoodSearch();
  setupMealForm();

  // Listen for child/date changes
  document.getElementById('childSelect').addEventListener('change', updateView);
  document.getElementById('dateSelect').addEventListener('change', updateView);
});

function populateChildren() {
  const children = getStore('children');
  const select = document.getElementById('childSelect');

  children.forEach(child => {
    const opt = document.createElement('option');
    opt.value = child.id;
    opt.textContent = `${child.name} (${child.age} yrs)`;
    select.appendChild(opt);
  });
}

function setupDateInput() {
  const dateInput = document.getElementById('dateSelect');
  dateInput.value = getToday();
}

function setupMealTabs() {
  document.querySelectorAll('.meal-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.meal-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      selectedMealType = tab.dataset.meal;
    });
  });
}

function setupFoodSearch() {
  const input = document.getElementById('foodInput');
  const suggestions = document.getElementById('foodSuggestions');

  input.addEventListener('input', () => {
    const query = input.value.toLowerCase().trim();
    if (query.length < 1) {
      suggestions.classList.remove('active');
      return;
    }

    const matches = foodDatabase.filter(f =>
      f.name.toLowerCase().includes(query)
    ).slice(0, 8);

    if (matches.length === 0) {
      suggestions.classList.remove('active');
      return;
    }

    suggestions.innerHTML = matches.map(f => `
      <div class="food-suggestion-item" data-food="${f.name}">
        ${f.name}
        <span>${f.calories} kcal · ${f.serving}</span>
      </div>
    `).join('');
    suggestions.classList.add('active');

    // Click handler for suggestions
    suggestions.querySelectorAll('.food-suggestion-item').forEach(item => {
      item.addEventListener('click', () => {
        const food = foodDatabase.find(f => f.name === item.dataset.food);
        if (food) selectFood(food);
        suggestions.classList.remove('active');
      });
    });
  });

  // Close suggestions on click outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.form-group')) {
      suggestions.classList.remove('active');
    }
  });
}

function selectFood(food) {
  selectedFood = food;
  document.getElementById('foodInput').value = food.name;
  document.getElementById('mealCalories').value = food.calories;
  document.getElementById('mealProtein').value = food.protein;
  document.getElementById('mealCarbs').value = food.carbs;
  document.getElementById('mealIron').value = food.iron;
}

function setupMealForm() {
  const form = document.getElementById('addMealForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    logMeal();
  });
}

function logMeal() {
  const childId = parseInt(document.getElementById('childSelect').value);
  const date = document.getElementById('dateSelect').value;

  if (!childId) {
    showToast('Please select a child first', 'error');
    return;
  }

  if (!selectedFood) {
    showToast('Please select a food item', 'error');
    return;
  }

  const meals = getStore('meals');
  const newMeal = {
    id: Date.now(),
    childId,
    date,
    mealType: selectedMealType,
    food: selectedFood.name,
    calories: selectedFood.calories,
    protein: selectedFood.protein,
    carbs: selectedFood.carbs,
    iron: selectedFood.iron,
    time: new Date().toISOString()
  };

  meals.push(newMeal);
  setStore('meals', meals);

  // Reset form
  closeModal('addMealModal');
  document.getElementById('foodInput').value = '';
  document.getElementById('mealCalories').value = '';
  document.getElementById('mealProtein').value = '';
  document.getElementById('mealCarbs').value = '';
  document.getElementById('mealIron').value = '';
  selectedFood = null;

  showToast(`${newMeal.food} logged for ${selectedMealType}!`);
  updateView();
}

function updateView() {
  const childId = parseInt(document.getElementById('childSelect').value);
  const date = document.getElementById('dateSelect').value;

  const noChildState = document.getElementById('noChildState');
  const nutritionSection = document.getElementById('nutritionSection');
  const mealLogSection = document.getElementById('mealLogSection');

  if (!childId) {
    noChildState.style.display = '';
    nutritionSection.style.display = 'none';
    mealLogSection.style.display = 'none';
    return;
  }

  noChildState.style.display = 'none';
  nutritionSection.style.display = '';
  mealLogSection.style.display = '';

  const meals = getStore('meals');
  const dayMeals = meals.filter(m => m.childId === childId && m.date === date);

  renderNutrition(dayMeals);
  renderMealLog(dayMeals);
}

function renderNutrition(meals) {
  const totals = meals.reduce((acc, m) => ({
    calories: acc.calories + m.calories,
    protein: acc.protein + m.protein,
    carbs: acc.carbs + m.carbs,
    iron: acc.iron + m.iron
  }), { calories: 0, protein: 0, carbs: 0, iron: 0 });

  document.getElementById('totalCalories').textContent = totals.calories;
  document.getElementById('totalProtein').textContent = totals.protein.toFixed(1) + 'g';
  document.getElementById('totalCarbs').textContent = totals.carbs.toFixed(1) + 'g';
  document.getElementById('totalIron').textContent = totals.iron.toFixed(1) + 'mg';

  // Nutrition bars
  const barsContainer = document.getElementById('nutritionBars');
  const bars = [
    { label: 'Calories', value: totals.calories, target: dailyTargets.calories, unit: 'kcal', color: 'green' },
    { label: 'Protein', value: totals.protein, target: dailyTargets.protein, unit: 'g', color: 'orange' },
    { label: 'Carbohydrates', value: totals.carbs, target: dailyTargets.carbs, unit: 'g', color: 'yellow' },
    { label: 'Iron', value: totals.iron, target: dailyTargets.iron, unit: 'mg', color: 'purple' }
  ];

  barsContainer.innerHTML = bars.map(bar => {
    const pct = Math.min((bar.value / bar.target) * 100, 100);
    return `
      <div class="nutrition-bar-group">
        <label>
          ${bar.label}
          <span>${bar.value.toFixed(1)} / ${bar.target} ${bar.unit}</span>
        </label>
        <div class="nutrition-bar-track">
          <div class="nutrition-bar-fill ${bar.color}" style="width: ${pct}%"></div>
        </div>
      </div>`;
  }).join('');
}

function renderMealLog(meals) {
  const tbody = document.getElementById('mealLogBody');
  const emptyState = document.getElementById('emptyMeals');

  if (meals.length === 0) {
    tbody.innerHTML = '';
    emptyState.style.display = '';
    document.querySelector('.table-wrap').style.display = 'none';
    return;
  }

  emptyState.style.display = 'none';
  document.querySelector('.table-wrap').style.display = '';

  const mealIcons = { Breakfast: '🌅', Lunch: '☀️', Snack: '🍎', Dinner: '🌙' };

  tbody.innerHTML = meals.map(m => `
    <tr>
      <td><span class="badge badge-green">${mealIcons[m.mealType] || ''} ${m.mealType}</span></td>
      <td>${m.food}</td>
      <td>${m.calories} kcal</td>
      <td>${m.protein}g</td>
      <td>${m.carbs}g</td>
      <td>${m.iron}mg</td>
      <td>${formatTime(m.time)}</td>
      <td>
        <button class="btn-icon" onclick="deleteMeal(${m.id})" title="Remove">
          <i class="ri-delete-bin-line"></i>
        </button>
      </td>
    </tr>
  `).join('');
}

function deleteMeal(id) {
  let meals = getStore('meals');
  meals = meals.filter(m => m.id !== id);
  setStore('meals', meals);
  showToast('Meal removed');
  updateView();
}
