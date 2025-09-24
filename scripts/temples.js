
        // Temple data array
        const temples = [
            {
                templeName: "Aba Nigeria",
                location: "Aba, Nigeria",
                dedicated: "2005, August, 7",
                area: 11500,
                imageUrl: "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/aba-nigeria/400x250/aba-nigeria-temple-lds-273999-wallpaper.jpg"
            },
            {
                templeName: "Manti Utah",
                location: "Manti, Utah, United States",
                dedicated: "1888, May, 21",
                area: 74792,
                imageUrl: "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/manti-utah/400x250/manti-temple-768192-wallpaper.jpg"
            },
            {
                templeName: "Payson Utah",
                location: "Payson, Utah, United States",
                dedicated: "2015, June, 7",
                area: 96630,
                imageUrl: "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/payson-utah/400x225/payson-utah-temple-exterior-1416671-wallpaper.jpg"
            },
            {
                templeName: "Yigo Guam",
                location: "Yigo, Guam",
                dedicated: "2020, May, 2",
                area: 6861,
                imageUrl: "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/yigo-guam/400x250/yigo_guam_temple_2.jpg"
            },
            {
                templeName: "Washington D.C.",
                location: "Kensington, Maryland, United States",
                dedicated: "1974, November, 19",
                area: 156558,
                imageUrl: "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/washington-dc/400x250/washington_dc_temple-exterior-2.jpeg"
            },
            {
                templeName: "Lima Perú",
                location: "Lima, Perú",
                dedicated: "1986, January, 10",
                area: 9600,
                imageUrl: "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/lima-peru/400x250/lima-peru-temple-evening-1075606-wallpaper.jpg"
            },
            {
                templeName: "Mexico City Mexico",
                location: "Mexico City, Mexico",
                dedicated: "1983, December, 2",
                area: 116642,
                imageUrl: "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/mexico-city-mexico/400x250/mexico-city-temple-exterior-1518361-wallpaper.jpg"
            },
            // Additional temples added 
            {
                templeName: "Salt Lake",
                location: "Salt Lake City, Utah, United States",
                dedicated: "1893, April, 6",
                area: 253015,
                imageUrl: "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/salt-lake-city-utah/400x250/salt-lake-temple-37762.jpg"
            },
            {
                templeName: "San Diego California",
                location: "San Diego, California, United States",
                dedicated: "1993, April, 25",
                area: 72000,
                imageUrl: "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/san-diego-california/400x250/san-diego-temple-765109-wallpaper.jpg"
            },
            {
                templeName: "Rome Italy",
                location: "Rome, Italy",
                dedicated: "2019, March, 10",
                area: 40000,
                imageUrl: "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/rome-italy/2019/400x250/1-Rome-Temple-2160936.jpg"
            }
        ];

        // Function to create temple card HTML
        function createTempleCard(temple) {
            return `
                <div class="temple-card fade-in">
                    <img src="${temple.imageUrl}" alt="${temple.templeName} Temple" loading="lazy">
                    <div class="card-content">
                        <h3 class="temple-name">${temple.templeName}</h3>
                        <div class="temple-info">
                            <div class="info-item">
                                <span class="info-label">Location:</span>
                                <span>${temple.location}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Dedicated:</span>
                                <span>${temple.dedicated}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label"> Size:</span>
                                <span>${temple.area.toLocaleString()} sq ft</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

        // Function to render temples
        function renderTemples(templesToShow) {
            const gallery = document.getElementById('temple-gallery');
            gallery.innerHTML = templesToShow.map(temple => createTempleCard(temple)).join('');
        }

        // Function to get dedication year from date string
        function getDedicationYear(dateString) {
            return parseInt(dateString.split(',')[0]);
        }

        // Filter functions
        function filterOld() {
            return temples.filter(temple => getDedicationYear(temple.dedicated) < 1900);
        }

        function filterNew() {
            return temples.filter(temple => getDedicationYear(temple.dedicated) > 2000);
        }

        function filterLarge() {
            return temples.filter(temple => temple.area > 90000);
        }

        function filterSmall() {
            return temples.filter(temple => temple.area < 10000);
        }

        // Event listeners for navigation buttons
        document.addEventListener('DOMContentLoaded', function() {
            const buttons = document.querySelectorAll('nav button');
            const mobileMenuBtn = document.getElementById('mobile-menu-btn');
            const mainNav = document.getElementById('main-nav');
            
            // Mobile menu toggle
            mobileMenuBtn.addEventListener('click', function() {
                mainNav.classList.toggle('show');
                // Change hamburger icon to X when open
                if (mainNav.classList.contains('show')) {
                    this.innerHTML = '✕';
                } else {
                    this.innerHTML = '☰';
                }
            });
            
            // Close mobile menu when a nav button is clicked
            buttons.forEach(button => {
                button.addEventListener('click', function() {
                    // Remove active class from all buttons
                    buttons.forEach(btn => btn.classList.remove('active'));
                    // Add active class to clicked button
                    this.classList.add('active');
                    
                    // Close mobile menu on small screens
                    if (window.innerWidth <= 768) {
                        mainNav.classList.remove('show');
                        mobileMenuBtn.innerHTML = '☰';
                    }
                    
                    // Filter temples based on button clicked
                    let filteredTemples;
                    switch(this.id) {
                        case 'old':
                            filteredTemples = filterOld();
                            break;
                        case 'new':
                            filteredTemples = filterNew();
                            break;
                        case 'large':
                            filteredTemples = filterLarge();
                            break;
                        case 'small':
                            filteredTemples = filterSmall();
                            break;
                        default:
                            filteredTemples = temples;
                    }
                    
                    renderTemples(filteredTemples);
                });
            });
            
            // Close mobile menu when clicking outside
            document.addEventListener('click', function(e) {
                if (window.innerWidth <= 768 && 
                    !mainNav.contains(e.target) && 
                    !mobileMenuBtn.contains(e.target) && 
                    mainNav.classList.contains('show')) {
                    mainNav.classList.remove('show');
                    mobileMenuBtn.innerHTML = '☰';
                }
            });
            
            // Handle window resize
            window.addEventListener('resize', function() {
                if (window.innerWidth > 768) {
                    mainNav.classList.remove('show');
                    mobileMenuBtn.innerHTML = '☰';
                }
            });
            
            // Initial render - show all temples
            renderTemples(temples);
            
            // Set footer content
            document.getElementById('copyright-year').textContent = new Date().getFullYear();
            document.getElementById('last-modified').textContent = document.lastModified;
        });
    