// scripts/calculator.js - Basic working version

// Array of Objects (Criteria 12)
const services = [
    { id: 1, name: "Investment Planning", description: "Long-term wealth growth strategies", category: "wealth" },
    { id: 2, name: "Retirement Planning", description: "Secure your financial future", category: "retirement" },
    { id: 3, name: "Tax Optimization", description: "Maximize your returns", category: "tax" }
];

// Load from localStorage (Criteria 15)
function loadUserData() {
    const savedName = localStorage.getItem('userName');
    if (savedName) {
        const welcomeEl = document.getElementById('welcomeMessage');
        if (welcomeEl) welcomeEl.textContent = `Welcome back, ${savedName}!`;
    }
}

// Multiple Functions (Criteria 9)
function calculateInvestment() {
    const amountEl = document.getElementById('investmentAmount');
    const yearsEl = document.getElementById('investmentYears');
    const amount = amountEl ? parseFloat(amountEl.value) : NaN;
    const years = yearsEl ? parseInt(yearsEl.value) : NaN;

    // Conditional Branching (Criteria 11)
    if (!amount || !years || amount <= 0 || years <= 0) {
        showError("Please enter valid positive numbers for amount and years.");
        // focus the first invalid field
        if (!amount || amount <= 0) {
            amountEl && amountEl.focus();
        } else if (!years || years <= 0) {
            yearsEl && yearsEl.focus();
        }
        return;
    }

    // DOM Manipulation (Criteria 10)
    const resultElement = document.getElementById('investmentResult');
    if (!resultElement) return;
    const growth = amount * Math.pow(1.07, years); // 7% annual growth

    // Template Literal (Criteria 14)
    resultElement.innerHTML = `
        <h3>Projection</h3>
        <p>Initial: $${amount.toLocaleString()}</p>
        <p>After ${years} years: $${Math.round(growth).toLocaleString()}</p>
        <p>Potential Growth: $${Math.round(growth - amount).toLocaleString()}</p>
    `;

    // Array Method (Criteria 13)
    updateServiceRecommendations(amount);
}

function showError(message) {
    const errorElement = document.getElementById('errorMessage');
    if (!errorElement) return;
    errorElement.textContent = message;
    setTimeout(() => { if (errorElement) errorElement.textContent = ''; }, 4000);
}

function updateServiceRecommendations(amount) {
    const recContainer = document.getElementById('serviceRecommendations');

    // Array method: filter (Criteria 13)
    const recommendedServices = services.filter(service => {
        return amount > 10000 || service.category !== 'wealth';
    });

    recContainer.innerHTML = '<h3>Recommended Services:</h3>';
    recommendedServices.forEach(service => {
        recContainer.innerHTML += `<p>• ${service.name}: ${service.description}</p>`;
    });
}

function saveUserInfo() {
    const userNameEl = document.getElementById('userName');
    if (!userNameEl) return;
    const userName = userNameEl.value.trim();
    if (userName) {
        localStorage.setItem('userName', userName);
        const welcomeEl = document.getElementById('welcomeMessage');
        if (welcomeEl) welcomeEl.textContent = `Welcome, ${userName}!`;
        // small confirm UI
        const old = userNameEl.value;
        userNameEl.blur();
        userNameEl.classList.add('saved');
        setTimeout(() => userNameEl.classList.remove('saved'), 800);
    }
}

// Event listeners when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadUserData();

    // DOM event listening (defensive)
    const calcBtn = document.getElementById('calculateBtn');
    if (calcBtn) calcBtn.addEventListener('click', calculateInvestment);

    const saveBtn = document.getElementById('saveUserBtn');
    if (saveBtn) saveBtn.addEventListener('click', saveUserInfo);

    // If the page doesn't have a calculator, none of the above will run and no errors will be thrown.

    console.log("Financial calculator initialization complete");
});