// ============================================================
// NIGHT ON THE TOWN – script.js
// ============================================================

// --- VARIABLES ---
// Stores how many colors the user has currently selected
let selectedColorCount = 0;

// Total number of colors available in the palette
const totalColors = 60;

// Whether the user is logged in (false = not yet)
let isLoggedIn = false;

// A math operation: minimum colors needed before seeing outfit ideas
let minimumColorsNeeded = 1;
let recommendedColors = minimumColorsNeeded * 3; // recommended = 3 colors minimum

console.log("NOTT app loaded. Recommended color picks: " + recommendedColors);

// ============================================================
// showPage(pageId)
// Hides all pages and shows only the page with the given id.
// ============================================================
function showPage(pageId) {
  const allPages = document.querySelectorAll('.page');
  allPages.forEach(function(page) {
    page.classList.remove('active');
  });

  const targetPage = document.getElementById(pageId);
  if (targetPage) {
    targetPage.classList.add('active');
    window.scrollTo(0, 0);
  }

  // If the color page is opened, build the color swatches
  if (pageId === 'color-page') {
    buildColorGrid('all');
  }
}

// ============================================================
// switchTab(tabName)
// Toggles between the Log In and Sign Up forms on the login page.
// ============================================================
function switchTab(tabName) {
  const loginTab = document.getElementById('tab-login');
  const signupTab = document.getElementById('tab-signup');
  const loginForm = document.getElementById('form-login');
  const signupForm = document.getElementById('form-signup');

  if (tabName === 'login') {
    loginTab.classList.add('active-tab');
    signupTab.classList.remove('active-tab');
    loginForm.classList.remove('hidden');
    signupForm.classList.add('hidden');
  } else {
    signupTab.classList.add('active-tab');
    loginTab.classList.remove('active-tab');
    signupForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
  }
}

// ============================================================
// handleLogin()
// Checks if the email and password fields have been filled in.
// Shows a success message and moves to the color page.
// ============================================================
function handleLogin() {
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const messageArea = document.getElementById('login-message');

  // Get the values the user typed in
  const emailValue = emailInput ? emailInput.value : '';
  const passwordValue = passwordInput ? passwordInput.value : '';

  // If/else: check if both fields are filled in
  if (emailValue !== '' && passwordValue !== '') {
    isLoggedIn = true;
    messageArea.textContent = '✅ Logged in! Taking you to colors...';
    console.log('User logged in with email: ' + emailValue);

    // Wait 1 second, then go to the color selection page
    setTimeout(function() {
      showPage('color-page');
    }, 1000);

  } else {
    // At least one field is empty
    isLoggedIn = false;
    messageArea.textContent = '⚠️ Please fill in both fields.';
    console.log('Login failed – missing fields.');
  }
}

// ============================================================
// COLOR DATA
// Each color has a hex code and a category label for filtering.
// ============================================================
const colorPalette = [
  // Neutrals
  { hex: '#FAF7F0', category: 'neutral' },
  { hex: '#F5EFE4', category: 'neutral' },
  { hex: '#E8D5B7', category: 'neutral' },
  { hex: '#D4B896', category: 'neutral' },
  { hex: '#C4A882', category: 'neutral' },
  { hex: '#A07850', category: 'neutral' },
  { hex: '#7A5C3C', category: 'neutral' },
  { hex: '#4A3728', category: 'neutral' },
  { hex: '#222222', category: 'neutral' },
  { hex: '#6B6B6B', category: 'neutral' },
  { hex: '#C0BDB8', category: 'neutral' },
  { hex: '#9A9590', category: 'neutral' },

  // Reds & Pinks
  { hex: '#C0152B', category: 'red' },
  { hex: '#D94040', category: 'red' },
  { hex: '#E05C5C', category: 'red' },
  { hex: '#E87878', category: 'red' },
  { hex: '#E8607A', category: 'red' },
  { hex: '#F28FA0', category: 'red' },
  { hex: '#F7B8C4', category: 'red' },
  { hex: '#FAD4DC', category: 'red' },

  // Oranges & Yellows
  { hex: '#E07030', category: 'orange' },
  { hex: '#E89048', category: 'orange' },
  { hex: '#F0A840', category: 'orange' },
  { hex: '#F5C060', category: 'orange' },
  { hex: '#F5D830', category: 'orange' },
  { hex: '#FAE44A', category: 'orange' },
  { hex: '#FDEF80', category: 'orange' },
  { hex: '#FDF7C0', category: 'orange' },

  // Greens
  { hex: '#1A7A3C', category: 'green' },
  { hex: '#2EA050', category: 'green' },
  { hex: '#48C070', category: 'green' },
  { hex: '#78D490', category: 'green' },
  { hex: '#A0E0A0', category: 'green' },
  { hex: '#4AAA78', category: 'green' },
  { hex: '#2A7060', category: 'green' },
  { hex: '#1A504A', category: 'green' },
  { hex: '#0D3830', category: 'green' },
  { hex: '#5AB888', category: 'green' },

  // Blues
  { hex: '#1460A8', category: 'blue' },
  { hex: '#2880D0', category: 'blue' },
  { hex: '#50A0E8', category: 'blue' },
  { hex: '#78B8F0', category: 'blue' },
  { hex: '#A0D0F8', category: 'blue' },
  { hex: '#0A3870', category: 'blue' },
  { hex: '#1848A0', category: 'blue' },
  { hex: '#2060C8', category: 'blue' },
  { hex: '#3070E0', category: 'blue' },
  { hex: '#4888F4', category: 'blue' },

  // Purples
  { hex: '#6030B0', category: 'purple' },
  { hex: '#8048C8', category: 'purple' },
  { hex: '#9868D8', category: 'purple' },
  { hex: '#B090E8', category: 'purple' },
  { hex: '#C8B0F0', category: 'purple' },
  { hex: '#D8C8F8', category: 'purple' },
  { hex: '#7040B8', category: 'purple' },
  { hex: '#5020A0', category: 'purple' },
];

// Keeps track of which colors the user selected (stores hex values)
let selectedColors = [];

// ============================================================
// buildColorGrid(filter)
// Creates the color swatch circles on the color selection page.
// If filter is 'all', it shows every color.
// Otherwise it shows only colors that match the filter category.
// ============================================================
function buildColorGrid(filter) {
  const grid = document.getElementById('color-grid');
  if (!grid) return;

  grid.innerHTML = ''; // Clear the grid before rebuilding

  // Loop through every color and show it if it matches the filter
  colorPalette.forEach(function(colorObj) {
    const matchesFilter = (filter === 'all') || (colorObj.category === filter);

    if (matchesFilter) {
      // Create a circle div for this color
      const swatch = document.createElement('div');
      swatch.classList.add('color-swatch');
      swatch.style.backgroundColor = colorObj.hex;
      swatch.title = colorObj.hex;

      // If this color was already selected, mark it as selected
      if (selectedColors.includes(colorObj.hex)) {
        swatch.classList.add('selected');
      }

      // When a swatch is clicked, toggle its selection
      swatch.addEventListener('click', function() {
        toggleColor(colorObj.hex, swatch);
      });

      grid.appendChild(swatch);
    }
  });

  console.log('Color grid built for filter: ' + filter);
}

// ============================================================
// toggleColor(hexCode, swatchElement)
// Adds or removes a color from the selected list.
// Updates the count shown at the bottom of the page.
// ============================================================
function toggleColor(hexCode, swatchElement) {
  const alreadySelected = selectedColors.includes(hexCode);

  if (alreadySelected) {
    // Remove from selected list
    selectedColors = selectedColors.filter(function(c) { return c !== hexCode; });
    swatchElement.classList.remove('selected');
    selectedColorCount = selectedColorCount - 1;
  } else {
    // Add to selected list
    selectedColors.push(hexCode);
    swatchElement.classList.add('selected');
    selectedColorCount = selectedColorCount + 1;
  }

  // Update the count text displayed to the user
  updateCountDisplay();
  console.log('Selected colors: ', selectedColors);
}

// ============================================================
// updateCountDisplay()
// Shows how many colors the user has selected at the bottom.
// Uses an if/else with a logical operator to decide the label.
// ============================================================
function updateCountDisplay() {
  const countLabel = document.getElementById('selected-count');
  const outfitBtn = document.getElementById('outfit-btn');

  if (!countLabel || !outfitBtn) return;

  // If/else with logical operator: singular vs plural label
  if (selectedColorCount === 0 || selectedColorCount < minimumColorsNeeded) {
    countLabel.textContent = selectedColorCount + ' colors selected';
    outfitBtn.style.opacity = '0.5';
  } else {
    countLabel.textContent = selectedColorCount + ' color(s) selected ✓';
    outfitBtn.style.opacity = '1';
  }

  // DOM output: show result directly on the page
  countLabel.setAttribute('data-count', selectedColorCount);
}

// ============================================================
// filterColors(category)
// Highlights the active filter tab and rebuilds the grid.
// ============================================================
function filterColors(category) {
  const tabs = document.querySelectorAll('#filter-tabs li');
  tabs.forEach(function(tab) {
    tab.classList.remove('filter-active');
  });

  // Find and highlight the clicked tab
  const allTabLabels = ['all', 'neutral', 'red', 'orange', 'green', 'blue', 'purple'];
  const tabIndex = allTabLabels.indexOf(category);
  if (tabs[tabIndex]) {
    tabs[tabIndex].classList.add('filter-active');
  }

  buildColorGrid(category);
}

// ============================================================
// seeOutfits()
// Runs when the user clicks "See Outfit Ideas".
// Checks that at least 1 color is selected before proceeding.
// ============================================================
function seeOutfits() {
  const messageEl = document.getElementById('selected-count');

  if (selectedColorCount >= minimumColorsNeeded && selectedColors.length > 0) {
    // Success – they've selected at least one color
    messageEl.textContent = '🎉 Great picks! Outfit ideas coming soon...';
    console.log('Generating outfits for colors: ', selectedColors);
  } else {
    // They haven't picked any colors yet
    messageEl.textContent = '👆 Please select at least one color first!';
    console.log('No colors selected – outfit generation blocked.');
  }
}

// ============================================================
// APP START
// Show the welcome page when the app first loads.
// ============================================================
showPage('welcome-page');
console.log('Total colors in palette: ' + totalColors);
console.log('Recommended color selections: ' + recommendedColors);