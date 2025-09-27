// Eco Tips JavaScript

const EcoTips = {
    // Comprehensive eco tips database
    tipsDatabase: [
        {
            id: 1,
            title: "Switch to LED Bulbs",
            description: "Replace incandescent bulbs with LED lights to reduce energy consumption by up to 75%.",
            category: "energy",
            impact: "High",
            co2Savings: 0.5,
            difficulty: "Easy"
        },
        {
            id: 2,
            title: "Use Public Transportation",
            description: "Take the bus, train, or subway instead of driving to reduce your transportation emissions.",
            category: "transport",
            impact: "High",
            co2Savings: 2.3,
            difficulty: "Medium"
        },
        {
            id: 3,
            title: "Eat More Plant-Based Meals",
            description: "Incorporate more vegetables and reduce meat consumption to lower your dietary carbon footprint.",
            category: "food",
            impact: "Medium",
            co2Savings: 1.2,
            difficulty: "Medium"
        },
        {
            id: 4,
            title: "Start Composting",
            description: "Compost food scraps and yard waste to reduce methane emissions from landfills.",
            category: "waste",
            impact: "Medium",
            co2Savings: 0.8,
            difficulty: "Medium"
        },
        {
            id: 5,
            title: "Unplug Electronics When Not in Use",
            description: "Reduce phantom energy consumption by unplugging devices and chargers when not needed.",
            category: "energy",
            impact: "Low",
            co2Savings: 0.3,
            difficulty: "Easy"
        },
        {
            id: 6,
            title: "Use a Programmable Thermostat",
            description: "Optimize heating and cooling to reduce energy usage without sacrificing comfort.",
            category: "energy",
            impact: "High",
            co2Savings: 1.8,
            difficulty: "Easy"
        },
        {
            id: 7,
            title: "Walk or Bike for Short Trips",
            description: "Choose active transportation for trips under 2 miles to eliminate emissions entirely.",
            category: "transport",
            impact: "Medium",
            co2Savings: 1.0,
            difficulty: "Easy"
        },
        {
            id: 8,
            title: "Buy Local and Seasonal Food",
            description: "Support local farmers and reduce transportation emissions by eating seasonally.",
            category: "food",
            impact: "Medium",
            co2Savings: 0.7,
            difficulty: "Medium"
        },
        {
            id: 9,
            title: "Install Low-Flow Showerheads",
            description: "Reduce hot water usage and energy consumption with water-efficient fixtures.",
            category: "home",
            impact: "Medium",
            co2Savings: 0.9,
            difficulty: "Medium"
        },
        {
            id: 10,
            title: "Recycle Properly",
            description: "Learn your local recycling guidelines and properly sort materials to reduce waste.",
            category: "waste",
            impact: "Low",
            co2Savings: 0.4,
            difficulty: "Easy"
        },
        {
            id: 11,
            title: "Air Dry Your Clothes",
            description: "Skip the dryer and hang clothes to dry, saving significant energy.",
            category: "energy",
            impact: "Medium",
            co2Savings: 1.1,
            difficulty: "Easy"
        },
        {
            id: 12,
            title: "Carpool or Use Ride-Sharing",
            description: "Share rides with others to reduce the number of vehicles on the road.",
            category: "transport",
            impact: "Medium",
            co2Savings: 1.5,
            difficulty: "Easy"
        },
        {
            id: 13,
            title: "Insulate Your Home",
            description: "Proper insulation reduces heating and cooling needs significantly.",
            category: "home",
            impact: "High",
            co2Savings: 2.5,
            difficulty: "Hard"
        },
        {
            id: 14,
            title: "Use Reusable Shopping Bags",
            description: "Eliminate plastic bag waste by bringing your own reusable bags to stores.",
            category: "waste",
            impact: "Low",
            co2Savings: 0.2,
            difficulty: "Easy"
        },
        {
            id: 15,
            title: "Grow Your Own Herbs",
            description: "Start a small herb garden to reduce packaging and transportation emissions.",
            category: "food",
            impact: "Low",
            co2Savings: 0.3,
            difficulty: "Medium"
        },
        {
            id: 16,
            title: "Use Cold Water for Laundry",
            description: "Wash clothes in cold water to reduce energy consumption by up to 90%.",
            category: "energy",
            impact: "Medium",
            co2Savings: 0.6,
            difficulty: "Easy"
        },
        {
            id: 17,
            title: "Work from Home When Possible",
            description: "Remote work eliminates commute emissions and reduces office energy use.",
            category: "transport",
            impact: "High",
            co2Savings: 2.8,
            difficulty: "Easy"
        },
        {
            id: 18,
            title: "Choose Renewable Energy",
            description: "Switch to a renewable energy provider or install solar panels.",
            category: "energy",
            impact: "High",
            co2Savings: 4.2,
            difficulty: "Hard"
        },
        {
            id: 19,
            title: "Reduce Water Heating Temperature",
            description: "Lower your water heater to 120°F to save energy without affecting comfort.",
            category: "home",
            impact: "Medium",
            co2Savings: 0.8,
            difficulty: "Easy"
        },
        {
            id: 20,
            title: "Buy Second-Hand Items",
            description: "Purchase used goods when possible to reduce manufacturing emissions.",
            category: "waste",
            impact: "Medium",
            co2Savings: 1.0,
            difficulty: "Easy"
        }
    ],

    // Application state
    state: {
        currentFilter: 'all',
        searchTerm: '',
        displayedTips: [],
        tipsPerPage: 9,
        currentPage: 1,
        savedTips: [],
        completedTips: [],
        dailyTip: null
    },

    init() {
        this.loadUserProgress();
        this.setupEventListeners();
        this.setDailyTip();
        this.displayTips();
        this.updateProgressStats();
        this.displaySavedTips();
    },

    loadUserProgress() {
        try {
            const savedTips = localStorage.getItem('ecoTracker_savedTips');
            const completedTips = localStorage.getItem('ecoTracker_completedTips');
            const dailyTipData = localStorage.getItem('ecoTracker_dailyTip');

            if (savedTips) {
                this.state.savedTips = JSON.parse(savedTips);
            }
            if (completedTips) {
                this.state.completedTips = JSON.parse(completedTips);
            }
            if (dailyTipData) {
                const dailyData = JSON.parse(dailyTipData);
                const today = new Date().toDateString();
                if (dailyData.date === today) {
                    this.state.dailyTip = dailyData.tip;
                }
            }
        } catch (error) {
            console.warn('Error loading tips progress:', error);
        }
    },

    saveUserProgress() {
        try {
            localStorage.setItem('ecoTracker_savedTips', JSON.stringify(this.state.savedTips));
            localStorage.setItem('ecoTracker_completedTips', JSON.stringify(this.state.completedTips));
            
            if (this.state.dailyTip) {
                const dailyData = {
                    date: new Date().toDateString(),
                    tip: this.state.dailyTip
                };
                localStorage.setItem('ecoTracker_dailyTip', JSON.stringify(dailyData));
            }

            // Update EcoTracker progress
            EcoTracker.data.userProgress.savedTips = this.state.savedTips.length;
            EcoTracker.data.userProgress.completedTips = this.state.completedTips.length;
            EcoTracker.data.userProgress.estimatedSavings = this.calculateTotalSavings();
            EcoTracker.saveToStorage();
        } catch (error) {
            console.warn('Error saving tips progress:', error);
        }
    },

    setupEventListeners() {
        // Filter buttons
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleFilterChange(e.target));
        });

        // Search input
        const searchInput = document.getElementById('tip-search');
        if (searchInput) {
            searchInput.addEventListener('input', 
                EcoTracker.utils.debounce((e) => this.handleSearch(e.target.value), 300)
            );
        }

        // Load more button
        const loadMoreBtn = document.getElementById('load-more-tips');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => this.loadMoreTips());
        }

        // Daily tip actions
        const markCompletedBtn = document.getElementById('mark-completed');
        const saveTipBtn = document.getElementById('save-tip');
        
        if (markCompletedBtn) {
            markCompletedBtn.addEventListener('click', () => this.markDailyTipCompleted());
        }
        if (saveTipBtn) {
            saveTipBtn.addEventListener('click', () => this.saveDailyTip());
        }

        // Saved tips actions
        const clearSavedBtn = document.getElementById('clear-saved-tips');
        const exportTipsBtn = document.getElementById('export-tips');
        
        if (clearSavedBtn) {
            clearSavedBtn.addEventListener('click', () => this.clearSavedTips());
        }
        if (exportTipsBtn) {
            exportTipsBtn.addEventListener('click', () => this.exportTips());
        }
    },

    setDailyTip() {
        if (!this.state.dailyTip) {
            // Select a random tip for today
            const randomIndex = Math.floor(Math.random() * this.tipsDatabase.length);
            this.state.dailyTip = this.tipsDatabase[randomIndex];
        }

        this.displayDailyTip();
    },

    displayDailyTip() {
        const titleEl = document.getElementById('daily-tip-title');
        const textEl = document.getElementById('daily-tip-text');
        const impactEl = document.getElementById('daily-tip-impact');

        if (titleEl && textEl && impactEl && this.state.dailyTip) {
            titleEl.textContent = this.state.dailyTip.title;
            textEl.textContent = this.state.dailyTip.description;
            impactEl.textContent = `${this.state.dailyTip.co2Savings} kg CO₂ savings potential`;
        }
    },

    handleFilterChange(button) {
        // Update active filter button
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        this.state.currentFilter = button.getAttribute('data-category');
        this.state.currentPage = 1;
        this.displayTips();
    },

    handleSearch(searchTerm) {
        this.state.searchTerm = searchTerm.toLowerCase();
        this.state.currentPage = 1;
        this.displayTips();
    },

    getFilteredTips() {
        let filteredTips = this.tipsDatabase;

        // Apply category filter
        if (this.state.currentFilter !== 'all') {
            filteredTips = filteredTips.filter(tip => tip.category === this.state.currentFilter);
        }

        // Apply search filter
        if (this.state.searchTerm) {
            filteredTips = filteredTips.filter(tip => 
                tip.title.toLowerCase().includes(this.state.searchTerm) ||
                tip.description.toLowerCase().includes(this.state.searchTerm) ||
                tip.category.toLowerCase().includes(this.state.searchTerm)
            );
        }

        return filteredTips;
    },

    displayTips() {
        const filteredTips = this.getFilteredTips();
        const startIndex = 0;
        const endIndex = this.state.currentPage * this.state.tipsPerPage;
        const tipsToShow = filteredTips.slice(startIndex, endIndex);

        const container = document.getElementById('tips-grid');
        if (!container) return;

        if (tipsToShow.length === 0) {
            container.innerHTML = '<p class="no-tips">No tips found matching your criteria.</p>';
            return;
        }

        const tipsHtml = tipsToShow.map(tip => this.createTipHTML(tip)).join('');
        container.innerHTML = tipsHtml;

        // Update load more button
        const loadMoreBtn = document.getElementById('load-more-tips');
        if (loadMoreBtn) {
            if (endIndex >= filteredTips.length) {
                loadMoreBtn.style.display = 'none';
            } else {
                loadMoreBtn.style.display = 'block';
                loadMoreBtn.textContent = `Load More Tips (${filteredTips.length - endIndex} remaining)`;
            }
        }

        // Add event listeners to tip actions
        this.attachTipEventListeners();
    },

    createTipHTML(tip) {
        const isCompleted = this.state.completedTips.includes(tip.id);
        const isSaved = this.state.savedTips.some(saved => saved.id === tip.id);

        return `
            <article class="tip-card fade-in ${isCompleted ? 'completed' : ''}" data-tip-id="${tip.id}">
                <div class="tip-header">
                    <h3>${tip.title}</h3>
                    <span class="tip-category">${tip.category}</span>
                </div>
                <p class="tip-description">${tip.description}</p>
                <div class="tip-meta">
                    <span class="tip-impact">Impact: ${tip.impact}</span>
                    <span class="tip-savings">${tip.co2Savings} kg CO₂</span>
                    <span class="tip-difficulty">${tip.difficulty}</span>
                </div>
                <div class="tip-actions">
                    <button class="btn ${isCompleted ? 'btn-outline' : 'btn-primary'} mark-complete-btn" 
                            data-tip-id="${tip.id}">
                        ${isCompleted ? '✓ Completed' : 'Mark Complete'}
                    </button>
                    <button class="btn ${isSaved ? 'btn-outline' : 'btn-secondary'} save-tip-btn" 
                            data-tip-id="${tip.id}">
                        ${isSaved ? '★ Saved' : '☆ Save'}
                    </button>
                </div>
            </article>
        `;
    },

    attachTipEventListeners() {
        // Mark complete buttons
        document.querySelectorAll('.mark-complete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tipId = parseInt(e.target.getAttribute('data-tip-id'));
                this.toggleTipCompleted(tipId);
            });
        });

        // Save tip buttons
        document.querySelectorAll('.save-tip-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tipId = parseInt(e.target.getAttribute('data-tip-id'));
                this.toggleTipSaved(tipId);
            });
        });
    },

    toggleTipCompleted(tipId) {
        const tipIndex = this.state.completedTips.indexOf(tipId);
        const tip = this.tipsDatabase.find(t => t.id === tipId);

        if (tipIndex === -1) {
            this.state.completedTips.push(tipId);
            EcoTracker.addActivity({
                type: 'tip_completed',
                description: `Completed eco tip: ${tip?.title}`,
                impact: tip?.co2Savings || 0,
                category: 'tips'
            });
            EcoTracker.utils.showToast(`Great job completing: ${tip?.title}!`, 'success');
        } else {
            this.state.completedTips.splice(tipIndex, 1);
        }

        this.saveUserProgress();
        this.displayTips();
        this.updateProgressStats();
    },

    toggleTipSaved(tipId) {
        const tip = this.tipsDatabase.find(t => t.id === tipId);
        const existingIndex = this.state.savedTips.findIndex(saved => saved.id === tipId);

        if (existingIndex === -1) {
            this.state.savedTips.push({
                ...tip,
                savedAt: new Date().toISOString()
            });
            EcoTracker.utils.showToast('Tip saved!', 'success');
        } else {
            this.state.savedTips.splice(existingIndex, 1);
            EcoTracker.utils.showToast('Tip removed from saved', 'success');
        }

        this.saveUserProgress();
        this.displayTips();
        this.displaySavedTips();
        this.updateProgressStats();
    },

    markDailyTipCompleted() {
        if (this.state.dailyTip) {
            this.toggleTipCompleted(this.state.dailyTip.id);
            
            // Update daily streak
            const today = new Date().toDateString();
            const lastCompleted = localStorage.getItem('ecoTracker_lastDailyCompleted');
            
            if (lastCompleted !== today) {
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                
                if (lastCompleted === yesterday.toDateString()) {
                    EcoTracker.data.userProgress.currentStreak += 1;
                } else {
                    EcoTracker.data.userProgress.currentStreak = 1;
                }
                
                localStorage.setItem('ecoTracker_lastDailyCompleted', today);
                EcoTracker.saveToStorage();
                this.updateProgressStats();
            }
        }
    },

    saveDailyTip() {
        if (this.state.dailyTip) {
            this.toggleTipSaved(this.state.dailyTip.id);
        }
    },

    loadMoreTips() {
        this.state.currentPage += 1;
        this.displayTips();
    },

    updateProgressStats() {
        const completedEl = document.getElementById('completed-tips');
        const savedEl = document.getElementById('saved-tips');
        const streakEl = document.getElementById('current-streak');
        const savingsEl = document.getElementById('estimated-savings');

        if (completedEl) completedEl.textContent = this.state.completedTips.length;
        if (savedEl) savedEl.textContent = this.state.savedTips.length;
        if (streakEl) streakEl.textContent = EcoTracker.data.userProgress.currentStreak;
        if (savingsEl) savingsEl.textContent = Math.round(this.calculateTotalSavings());
    },

    calculateTotalSavings() {
        return this.state.completedTips.reduce((total, tipId) => {
            const tip = this.tipsDatabase.find(t => t.id === tipId);
            return total + (tip?.co2Savings || 0);
        }, 0);
    },

    displaySavedTips() {
        const container = document.getElementById('saved-tips-grid');
        if (!container) return;

        if (this.state.savedTips.length === 0) {
            container.innerHTML = '<p class="no-saved-tips">You haven\'t saved any tips yet. Save tips you want to remember by clicking the "Save Tip" button.</p>';
            return;
        }

        const savedHtml = this.state.savedTips.map(tip => `
            <div class="saved-tip-item fade-in">
                <h4>${tip.title}</h4>
                <p>${tip.description}</p>
                <div class="saved-tip-meta">
                    <span>Saved: ${new Date(tip.savedAt).toLocaleDateString()}</span>
                    <button class="btn btn-outline btn-sm remove-saved-btn" data-tip-id="${tip.id}">Remove</button>
                </div>
            </div>
        `).join('');

        container.innerHTML = savedHtml;

        // Add remove event listeners
        container.querySelectorAll('.remove-saved-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tipId = parseInt(e.target.getAttribute('data-tip-id'));
                this.toggleTipSaved(tipId);
            });
        });
    },

    clearSavedTips() {
        if (confirm('Are you sure you want to clear all saved tips? This action cannot be undone.')) {
            this.state.savedTips = [];
            this.saveUserProgress();
            this.displaySavedTips();
            this.updateProgressStats();
            EcoTracker.utils.showToast('All saved tips cleared', 'success');
        }
    },

    exportTips() {
        if (this.state.savedTips.length === 0) {
            EcoTracker.utils.showToast('No saved tips to export', 'warning');
            return;
        }

        const exportData = this.state.savedTips.map(tip => ({
            title: tip.title,
            description: tip.description,
            category: tip.category,
            impact: tip.impact,
            co2Savings: tip.co2Savings,
            difficulty: tip.difficulty
        }));

        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `eco-tips-${new Date().toISOString().split('T')[0]}.json`;
        link.click();

        EcoTracker.utils.showToast('Tips exported successfully!', 'success');
    }
};

// Initialize tips when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('tips-grid')) {
        EcoTips.init();
    }
});