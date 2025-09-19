// Temple data array with original 7 temples plus 3 additional ones
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
            // Additional temples (3 more as required)
            {
                templeName: "Salt Lake Temple",
                location: "Salt Lake City, Utah, United States",
                dedicated: "1893, April, 6",
                area: 253015,
                imageUrl: "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/salt-lake-city-utah/2018/400x250/slctemple7.jpg"
            },
            {
                templeName: "Tokyo Japan",
                location: "Tokyo, Japan",
                dedicated: "1980, October, 27",
                area: 53997,
                imageUrl: "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/tokyo-japan/400x250/tokyo_japan_temple-exterior-13.jpeg"
            },
            {
                templeName: "Provo City Center",
                location: "Provo, Utah, United States",
                dedicated: "2016, March, 20",
                area: 85084,
                imageUrl: "https://content.churchofjesuschrist.org/templesldsorg/bc/Temples/photo-galleries/provo-city-center/400x250/provo-city-center-temple-1572517-wallpaper.jpg"
            }
        ];

        // Function to create temple card HTML
        function createTempleCard(temple) {
            return `
                <div class="temple-card">
                    <img src="${temple.imageUrl}" alt="${temple.templeName}" loading="lazy">
                    <div class="temple-info">
                        <h3>${temple.templeName}</h3>
                        <p><strong>Location:</strong> ${temple.location}</p>
                        <p><strong>Dedicated:</strong> ${temple.dedicated}</p>
                        <p><strong>Area:</strong> ${temple.area.toLocaleString()} sq ft</p>
                    </div>
                </div>
            `;
        }

        // Function to display temples
        function displayTemples(templeList) {
            const grid = document.getElementById('temple-grid');
            grid.innerHTML = templeList.map(createTempleCard).join('');
        }

        // Function to get dedication year
        function getDedicationYear(dedicatedString) {
            return parseInt(dedicatedString.split(',')[0]);
        }

        // Filter functions
        const filters = {
            home: () => temples,
            old: () => temples.filter(temple => getDedicationYear(temple.dedicated) < 1900),
            new: () => temples.filter(temple => getDedicationYear(temple.dedicated) > 2000),
            large: () => temples.filter(temple => temple.area > 90000),
            small: () => temples.filter(temple => temple.area < 10000)
        };

        // Event listeners for filter buttons
        document.querySelectorAll('.filter-btn').forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                this.classList.add('active');
                
                // Display filtered temples
                const filteredTemples = filters[this.id]();
                displayTemples(filteredTemples);
            });
        });

        // Footer date functions
        function updateFooter() {
            const currentYear = new Date().getFullYear();
            const lastModified = document.lastModified;
            
            document.getElementById('currentyear').textContent = currentYear;
            document.getElementById('lastmodified').textContent = lastModified;
        }

        // Initialize the page
        function init() {
            displayTemples(temples); // Show all temples initially
            updateFooter();
        }

        // Run when DOM is loaded
        document.addEventListener('DOMContentLoaded', init);