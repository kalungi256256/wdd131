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
        document.getElementById('welcomeMessage').textContent = `Welcome back, ${savedName}!`;
    }
}

// Multiple Functions (Criteria 9)
function calculateInvestment() {
    const amount = parseFloat(document.getElementById('investmentAmount').value);
    const years = parseInt(document.getElementById('investmentYears').value);

    // Conditional Branching (Criteria 11)
    if (!amount || !years || amount <= 0 || years <= 0) {
        showError("Please enter valid numbers");
        return;
    }

    // DOM Manipulation (Criteria 10)
    const resultElement = document.getElementById('investmentResult');
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
    errorElement.textContent = message;
    setTimeout(() => { errorElement.textContent = ''; }, 3000);
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
    const userName = document.getElementById('userName').value;
    if (userName) {
        localStorage.setItem('userName', userName);
        document.getElementById('welcomeMessage').textContent = `Welcome, ${userName}!`;
    }
}

// Event listeners when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadUserData();

    // DOM event listening (Criteria 10)
    document.getElementById('calculateBtn').addEventListener('click', calculateInvestment);
    document.getElementById('saveUserBtn').addEventListener('click', saveUserInfo);

    console.log("Financial calculator loaded successfully");
});