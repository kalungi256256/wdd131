// Carbon Calculator JavaScript

const CarbonCalculator = {
    // Emission factors (kg CO2 per unit)
    emissionFactors: {
        car: 0.411, // kg CO2 per mile
        publicTransport: 0.089, // kg CO2 per hour
        flight: 90, // kg CO2 per flight (average domestic)
        electricity: 0.707, // kg CO2 per kWh (US average)
        gas: 11.7, // kg CO2 per therm
        diet: {
            'meat-heavy': 3.3,
            'average': 2.5,
            'low-meat': 1.9,
            'vegetarian': 1.7,
            'vegan': 1.5
        }, // kg CO2 per day
        shopping: 0.5, // kg CO2 per dollar spent
        recycling: {
            'none': 1.0,
            'occasional': 0.8,
            'regular': 0.6,
            'always': 0.4
        } // multiplier for waste emissions
    },

    // Average annual emissions for comparison
    averageEmissions: {
        us: 16.0, // tons CO2 per year
        world: 4.8 // tons CO2 per year
    },

    init() {
        this.setupEventListeners();
        this.loadSavedCalculations();
        this.updateRangeValues();
    },

    setupEventListeners() {
        const form = document.getElementById('carbon-calculator');
        if (form) {
            form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }

        // Range input updates
        const rangeInputs = document.querySelectorAll('input[type="range"]');
        rangeInputs.forEach(input => {
            input.addEventListener('input', (e) => this.updateRangeValue(e.target));
        });

        // Save and share buttons
        const saveBtn = document.getElementById('save-calculation');
        const shareBtn = document.getElementById('share-results');
        
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveCalculation());
        }
        if (shareBtn) {
            shareBtn.addEventListener('click', () => this.shareResults());
        }
    },

    updateRangeValues() {
        const rangeInputs = document.querySelectorAll('input[type="range"]');
        rangeInputs.forEach(input => this.updateRangeValue(input));
    },

    updateRangeValue(input) {
        const valueSpan = document.getElementById(`${input.id}-value`);
        if (valueSpan) {
            valueSpan.textContent = `${input.value}%`;
        }
    },

    handleFormSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        
        if (this.validateForm(data)) {
            const results = this.calculateEmissions(data);
            this.displayResults(results);
            this.addToActivityHistory(results);
        }
    },

    validateForm(data) {
        const requiredFields = ['diet', 'recycling'];
        const errors = [];

        requiredFields.forEach(field => {
            if (!data[field]) {
                errors.push(`Please select a ${field} option`);
            }
        });

        // Validate numeric ranges
        const numericValidations = {
            carMiles: { min: 0, max: 500 },
            publicTransport: { min: 0, max: 24 },
            flights: { min: 0, max: 100 },
            electricity: { min: 0, max: 5000 },
            gas: { min: 0, max: 500 },
            shopping: { min: 0, max: 10000 }
        };

        Object.entries(numericValidations).forEach(([field, limits]) => {
            const value = parseFloat(data[field] || 0);
            if (value < limits.min || value > limits.max) {
                errors.push(`${field} must be between ${limits.min} and ${limits.max}`);
            }
        });

        if (errors.length > 0) {
            EcoTracker.utils.showToast(`Form validation failed: ${errors[0]}`, 'error');
            return false;
        }

        return true;
    },

    calculateEmissions(data) {
        const factors = this.emissionFactors;
        
        // Convert to numbers with defaults
        const carMiles = parseFloat(data.carMiles || 0);
        const publicTransport = parseFloat(data.publicTransport || 0);
        const flights = parseFloat(data.flights || 0);
        const electricity = parseFloat(data.electricity || 800); // Default 800 kWh
        const gas = parseFloat(data.gas || 50); // Default 50 therms
        const renewable = parseFloat(data.renewable || 20); // Default 20%
        const shopping = parseFloat(data.shopping || 200); // Default $200
        
        // Calculate emissions by category (annual)
        const transportEmissions = (
            (carMiles * factors.car * 365) + // Daily car miles
            (publicTransport * factors.publicTransport * 365) + // Daily public transport
            (flights * factors.flight) // Annual flights
        ) / 1000; // Convert to tons

        const energyEmissions = (
            (electricity * 12 * factors.electricity * (1 - renewable / 100)) + // Monthly electricity adjusted for renewable
            (gas * 12 * factors.gas) // Monthly gas
        ) / 1000; // Convert to tons

        const lifestyleEmissions = (
            (factors.diet[data.diet] * 365) + // Daily diet impact
            (shopping * 12 * factors.shopping * factors.recycling[data.recycling]) // Monthly shopping with recycling adjustment
        ) / 1000; // Convert to tons

        const totalEmissions = transportEmissions + energyEmissions + lifestyleEmissions;

        // Generate recommendations
        const recommendations = this.generateRecommendations(data, {
            transport: transportEmissions,
            energy: energyEmissions,
            lifestyle: lifestyleEmissions,
            total: totalEmissions
        });

        return {
            transport: transportEmissions,
            energy: energyEmissions,
            lifestyle: lifestyleEmissions,
            total: totalEmissions,
            recommendations: recommendations,
            formData: data,
            timestamp: new Date().toISOString()
        };
    },

    generateRecommendations(data, emissions) {
        const recommendations = [];
        
        // Transport recommendations
        if (parseFloat(data.carMiles || 0) > 20) {
            recommendations.push({
                category: 'transport',
                title: 'Reduce Car Usage',
                description: 'Consider carpooling, public transit, or remote work to reduce daily driving.',
                impact: 'Could save 2-5 tons CO₂ annually',
                priority: 'high'
            });
        }
        
        if (parseFloat(data.flights || 0) > 4) {
            recommendations.push({
                category: 'transport',
                title: 'Consider Flight Alternatives',
                description: 'Choose train travel for shorter distances or video conferencing for business meetings.',
                impact: 'Could save 1-3 tons CO₂ annually',
                priority: 'medium'
            });
        }

        // Energy recommendations
        if (parseFloat(data.electricity || 800) > 1000) {
            recommendations.push({
                category: 'energy',
                title: 'Improve Home Energy Efficiency',
                description: 'Upgrade to LED bulbs, improve insulation, and use programmable thermostats.',
                impact: 'Could save 1-2 tons CO₂ annually',
                priority: 'high'
            });
        }

        if (parseFloat(data.renewable || 20) < 50) {
            recommendations.push({
                category: 'energy',
                title: 'Switch to Renewable Energy',
                description: 'Consider solar panels or choose a renewable energy plan from your utility.',
                impact: 'Could save 3-6 tons CO₂ annually',
                priority: 'high'
            });
        }

        // Lifestyle recommendations
        if (data.diet === 'meat-heavy') {
            recommendations.push({
                category: 'lifestyle',
                title: 'Reduce Meat Consumption',
                description: 'Try "Meatless Monday" or plant-based alternatives to reduce dietary emissions.',
                impact: 'Could save 0.5-1 tons CO₂ annually',
                priority: 'medium'
            });
        }

        if (data.recycling === 'none' || data.recycling === 'occasional') {
            recommendations.push({
                category: 'lifestyle',
                title: 'Improve Recycling Habits',
                description: 'Set up a home recycling system and learn what materials can be recycled locally.',
                impact: 'Could save 0.2-0.5 tons CO₂ annually',
                priority: 'low'
            });
        }

        if (parseFloat(data.shopping || 200) > 500) {
            recommendations.push({
                category: 'lifestyle',
                title: 'Practice Mindful Consumption',
                description: 'Buy only what you need, choose quality over quantity, and consider second-hand options.',
                impact: 'Could save 0.5-1 tons CO₂ annually',
                priority: 'medium'
            });
        }

        return recommendations.slice(0, 5); // Return top 5 recommendations
    },

    displayResults(results) {
        // Show results panel
        const resultsPanel = document.getElementById('calculation-results');
        const placeholder = document.getElementById('calculation-placeholder');
        
        if (resultsPanel && placeholder) {
            resultsPanel.classList.remove('results-hidden');
            placeholder.style.display = 'none';
        }

        // Update total emissions
        const totalEl = document.getElementById('total-emissions');
        if (totalEl) {
            totalEl.textContent = results.total.toFixed(1);
        }

        // Update comparison text
        this.updateComparisonText(results.total);

        // Update breakdown chart
        this.updateBreakdownChart(results);

        // Display recommendations
        this.displayRecommendations(results.recommendations);

        // Scroll to results
        resultsPanel?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    },

    updateComparisonText(totalEmissions) {
        const comparisonEl = document.getElementById('comparison-text');
        if (!comparisonEl) return;

        let comparisonText = '';
        
        if (totalEmissions < this.averageEmissions.world) {
            comparisonText = `🌟 Excellent! You're below the global average of ${this.averageEmissions.world} tons CO₂/year.`;
        } else if (totalEmissions < this.averageEmissions.us) {
            comparisonText = `👍 Good! You're below the US average of ${this.averageEmissions.us} tons CO₂/year, but above the global average.`;
        } else {
            comparisonText = `⚠️ Your footprint is above average. Small changes can make a big difference!`;
        }

        comparisonEl.textContent = comparisonText;
    },

    updateBreakdownChart(results) {
        const categories = ['transportation', 'energy', 'lifestyle'];
        const maxEmission = Math.max(results.transport, results.energy, results.lifestyle);

        categories.forEach(category => {
            const bar = document.querySelector(`.bar[data-category="${category}"]`);
            const valueEl = document.getElementById(`${category === 'transportation' ? 'transport' : category}-emissions`);
            
            if (bar && valueEl) {
                const emission = results[category === 'transportation' ? 'transport' : category];
                const percentage = maxEmission > 0 ? (emission / maxEmission) * 100 : 0;
                
                // Animate bar width
                setTimeout(() => {
                    bar.style.width = `${percentage}%`;
                }, 100);
                
                valueEl.textContent = `${emission.toFixed(1)} tons`;
            }
        });
    },

    displayRecommendations(recommendations) {
        const container = document.getElementById('recommendations-list');
        if (!container) return;

        if (recommendations.length === 0) {
            container.innerHTML = '<p>Great job! Your carbon footprint is already quite low.</p>';
            return;
        }

        const recHtml = recommendations.map(rec => `
            <div class="recommendation-item slide-up" data-priority="${rec.priority}">
                <div class="rec-header">
                    <h5>${rec.title}</h5>
                    <span class="rec-impact">${rec.impact}</span>
                </div>
                <p>${rec.description}</p>
            </div>
        `).join('');

        container.innerHTML = recHtml;
    },

    saveCalculation() {
        const results = this.getLastCalculation();
        if (!results) {
            EcoTracker.utils.showToast('No calculation to save', 'warning');
            return;
        }

        const savedCalc = {
            id: Date.now(),
            ...results,
            name: `Calculation ${new Date().toLocaleDateString()}`
        };

        EcoTracker.data.savedCalculations.push(savedCalc);
        EcoTracker.saveToStorage();
        
        this.displaySavedCalculations();
        EcoTracker.utils.showToast('Calculation saved successfully!', 'success');
    },

    getLastCalculation() {
        // This would store the last calculation results
        return this.lastCalculationResults || null;
    },

    shareResults() {
        const results = this.getLastCalculation();
        if (!results) {
            EcoTracker.utils.showToast('No calculation to share', 'warning');
            return;
        }

        const shareText = `My carbon footprint: ${results.total.toFixed(1)} tons CO₂/year. Calculate yours at EcoTracker!`;
        
        if (navigator.share) {
            navigator.share({
                title: 'My Carbon Footprint',
                text: shareText,
                url: window.location.href
            });
        } else {
            // Fallback - copy to clipboard
            navigator.clipboard.writeText(shareText).then(() => {
                EcoTracker.utils.showToast('Results copied to clipboard!', 'success');
            }).catch(() => {
                EcoTracker.utils.showToast('Unable to copy to clipboard', 'error');
            });
        }
    },

    addToActivityHistory(results) {
        this.lastCalculationResults = results;
        
        EcoTracker.addActivity({
            type: 'calculation',
            description: `Carbon footprint calculated: ${results.total.toFixed(1)} tons CO₂/year`,
            impact: 0,
            category: 'calculator'
        });
    },

    loadSavedCalculations() {
        this.displaySavedCalculations();
    },

    displaySavedCalculations() {
        const container = document.getElementById('saved-calculations-list');
        if (!container) return;

        if (EcoTracker.data.savedCalculations.length === 0) {
            container.innerHTML = '<p class="no-calculations">No saved calculations yet. Complete a calculation and save it to see your history here.</p>';
            return;
        }

        const calcsHtml = EcoTracker.data.savedCalculations.slice(-6).reverse().map(calc => `
            <div class="calculation-card fade-in">
                <div class="calc-header">
                    <h4>${calc.name}</h4>
                    <span class="calc-date">${new Date(calc.timestamp).toLocaleDateString()}</span>
                </div>
                <div class="calc-summary">
                    <div class="calc-total">${calc.total.toFixed(1)} tons CO₂</div>
                    <div class="calc-breakdown">
                        <small>Transport: ${calc.transport.toFixed(1)} | Energy: ${calc.energy.toFixed(1)} | Lifestyle: ${calc.lifestyle.toFixed(1)}</small>
                    </div>
                </div>
            </div>
        `).join('');

        container.innerHTML = calcsHtml;
    }
};

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('carbon-calculator')) {
        CarbonCalculator.init();
    }
});