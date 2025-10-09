// scripts/calculator.js


const financialGoals = [
    { id: 1, name: "Emergency Fund", target: 10000, current: 0, priority: "high" },
    { id: 2, name: "Retirement Savings", target: 500000, current: 0, priority: "high" },
    { id: 3, name: "Vacation Fund", target: 5000, current: 0, priority: "low" },
    { id: 4, name: "New Car", target: 25000, current: 0, priority: "medium" }
];

// ===== LOCALSTORAGE FUNCTIONS (Criteria 15) =====
function saveToLocalStorage() {
    localStorage.setItem('financialGoals', JSON.stringify(financialGoals));
    localStorage.setItem('lastUpdated', new Date().toISOString());
}

function loadFromLocalStorage() {
    const savedGoals = localStorage.getItem('financialGoals');
    const lastUpdated = localStorage.getItem('lastUpdated');

    if (savedGoals) {
        const parsedGoals = JSON.parse(savedGoals);
        financialGoals.length = 0;
        financialGoals.push(...parsedGoals);

        console.log('Goals loaded from localStorage. Last updated: ' + (lastUpdated ? new Date(lastUpdated).toLocaleString() : 'Unknown'));
    }
}

// ===== ARRAY METHODS (Criteria 13) =====
function updateGoalProgress() {
    financialGoals.forEach(goal => {
        const progress = (goal.current / goal.target) * 100;
        goal.progress = Math.min(progress, 100);
    });

    const highPriorityGoals = financialGoals.filter(goal => goal.priority === "high");
    const highPriorityNames = highPriorityGoals.map(goal => goal.name);

    console.log("High priority goals:", highPriorityNames);
}

// ===== DOM MANIPULATION FUNCTIONS (Criteria 10) =====
function displayGoals() {
    const goalsContainer = document.getElementById('goalsContainer');
    if (!goalsContainer) return;

    goalsContainer.innerHTML = '';

    financialGoals.forEach(goal => {
        const goalElement = document.createElement('div');
        goalElement.className = 'goal-item';
        goalElement.innerHTML = '<h4>' + goal.name + '</h4>' +
            '<p>Target: $' + goal.target.toLocaleString() + '</p>' +
            '<p>Current: $' + goal.current.toLocaleString() + '</p>' +
            '<div class="progress-bar">' +
            '<div class="progress-fill" style="width: ' + (goal.progress || 0) + '%"></div>' +
            '</div>' +
            '<p>Progress: ' + (goal.progress || 0).toFixed(1) + '%</p>';
        goalsContainer.appendChild(goalElement);
    });
}

// ===== CONDITIONAL BRANCHING & CALCULATION FUNCTION (Criteria 9, 11) =====
function calculateSavings() {
    const initialInput = document.getElementById('initial');
    const monthlyInput = document.getElementById('monthly');
    const yearsInput = document.getElementById('years');
    const resultElement = document.getElementById('result');
    const errorElement = document.getElementById('error');

    if (!initialInput || !monthlyInput || !yearsInput || !resultElement || !errorElement) {
        console.error("Required DOM elements not found");
        return;
    }

    errorElement.textContent = '';
    resultElement.textContent = '';

    const initialAmount = parseFloat(initialInput.value) || 0;
    const monthlyContribution = parseFloat(monthlyInput.value) || 0;
    const years = parseInt(yearsInput.value) || 0;

    // CONDITIONAL BRANCHING (Criteria 11)
    if (years <= 0) {
        errorElement.textContent = "Please enter a valid number of years (greater than 0).";
        return;
    }

    if (initialAmount < 0 || monthlyContribution < 0) {
        errorElement.textContent = "Amounts cannot be negative.";
        return;
    }

    if (years > 50) {
        errorElement.textContent = "Please enter a timeframe of 50 years or less.";
        return;
    }

    const totalSavings = calculateFutureValue(initialAmount, monthlyContribution, years);
    updateGoalsWithSavings(totalSavings);
    updateGoalProgress();
    displayGoals();
    saveToLocalStorage();

    // TEMPLATE LITERAL for output (Criteria 14)
    resultElement.innerHTML = '<h3>Savings Projection</h3>' +
        '<p>After <strong>' + years + '</strong> years:</p>' +
        '<p>Initial: <strong>$' + initialAmount.toLocaleString() + '</strong></p>' +
        '<p>Monthly: <strong>$' + monthlyContribution.toLocaleString() + '</strong></p>' +
        '<p class="total-amount">Total: <strong>$' + totalSavings.toLocaleString() + '</strong></p>';
}

// ===== SECOND FUNCTION FOR CALCULATIONS (Criteria 9) =====
function calculateFutureValue(initial, monthly, years) {
    const annualRate = 0.05;
    const months = years * 12;
    let futureValue = initial;

    for (let i = 0; i < months; i++) {
        futureValue = futureValue * (1 + annualRate / 12) + monthly;
    }

    return Math.round(futureValue * 100) / 100;
}

// ===== FUNCTION TO UPDATE GOALS (Criteria 9) =====
function updateGoalsWithSavings(totalSavings) {
    let remainingSavings = totalSavings;

    financialGoals.forEach(goal => {
        if (remainingSavings > 0 && goal.current < goal.target) {
            const needed = goal.target - goal.current;
            const allocation = Math.min(needed, remainingSavings * 0.25);
            goal.current += allocation;
            remainingSavings -= allocation;
        }
    });
}

// ===== EVENT LISTENERS (Criteria 10) =====
function setupEventListeners() {
    const calculateBtn = document.getElementById('calculateBtn');
    const clearBtn = document.getElementById('clearBtn');

    if (calculateBtn) {
        calculateBtn.addEventListener('click', calculateSavings);
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', clearCalculator);
    }
}

// ===== CLEAR FUNCTION (Criteria 9) =====
function clearCalculator() {
    const initialInput = document.getElementById('initial');
    const monthlyInput = document.getElementById('monthly');
    const yearsInput = document.getElementById('years');
    const resultElement = document.getElementById('result');
    const errorElement = document.getElementById('error');

    if (initialInput) initialInput.value = '';
    if (monthlyInput) monthlyInput.value = '';
    if (yearsInput) yearsInput.value = '';
    if (resultElement) resultElement.textContent = '';
    if (errorElement) errorElement.textContent = '';
}

// ===== INITIALIZATION FUNCTION =====
function initCalculator() {
    loadFromLocalStorage();
    updateGoalProgress();
    displayGoals();
    setupEventListeners();

    console.log("Financial Calculator initialized");
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initCalculator);