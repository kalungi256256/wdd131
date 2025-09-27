
        // Global variables for weather data
        const temperature = 24; // °C
        const windSpeed = 8; // km/h

        // Function to calculate wind chill (metric formula)
        function calculateWindChill(temp, wind) {
            return 13.12 + 0.6215 * temp - 11.37 * Math.pow(wind, 0.16) + 0.3965 * temp * Math.pow(wind, 0.16);
        }

        // Function to display wind chill
        function displayWindChill() {
            const windChillElement = document.getElementById('windchill');
            
            // Check conditions for viable wind chill calculation (metric)
            if (temperature <= 10 && windSpeed > 4.8) {
                const windChill = calculateWindChill(temperature, windSpeed);
                windChillElement.textContent = `${Math.round(windChill)}°C`;
            } else {
                windChillElement.textContent = 'N/A';
            }
        }

        // Function to update footer with current year and last modified date
        function updateFooter() {
            const currentYearElement = document.getElementById('currentYear');
            const lastModifiedElement = document.getElementById('lastModified');
            
            currentYearElement.textContent = new Date().getFullYear();
            lastModifiedElement.textContent = document.lastModified;
        }

        // Initialize page when DOM is loaded
        document.addEventListener('DOMContentLoaded', function() {
            displayWindChill();
            updateFooter();
        });