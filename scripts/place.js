
function calculateWindChill(temp, windSpeed) {
    return Math.round(13.12 + 0.6215 * temp - 11.37 * Math.pow(windSpeed, 0.16) + 0.3965 * temp * Math.pow(windSpeed, 0.16));
}

const DEFAULT_TEMPERATURE = 28;
const DEFAULT_WIND = 8;

document.addEventListener('DOMContentLoaded', function() {
    const windchillElement = document.getElementById('windchill');
    const tempEl = document.getElementById('temperature');
    const windEl = document.getElementById('windspeed');

    const temp = tempEl ? parseFloat(tempEl.textContent) || DEFAULT_TEMPERATURE : DEFAULT_TEMPERATURE;
    const wind = windEl ? parseFloat(windEl.textContent) || DEFAULT_WIND : DEFAULT_WIND;

    if (windchillElement) {
        if (temp <= 10 && wind > 4.8) {
            windchillElement.textContent = `${calculateWindChill(temp, wind)}°C`;
        } else {
            windchillElement.textContent = 'N/A';
        }
    }

    const yearEl = document.getElementById('currentyear');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    const lmEl = document.getElementById('lastmodified');
    if (lmEl) {
        const docLast = document.lastModified;
        if (docLast && docLast.trim() !== '') {
            const parsed = new Date(docLast);
            lmEl.textContent = isNaN(parsed.getTime()) ? docLast : parsed.toLocaleString();
        } else {
            lmEl.textContent = new Date().toLocaleString();
        }
    }
});