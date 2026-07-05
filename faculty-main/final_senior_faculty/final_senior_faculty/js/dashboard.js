/**
 * Dashboard Logic for RPLMS Senior Faculty
 */

document.addEventListener('DOMContentLoaded', () => {
    initDashboard();
});

function initDashboard() {
    console.log('Dashboard initialized');
    // We could load data from LocalStorage here in a real scenario
    setupChartTooltips();
}

/**
 * Setup simple hover effects or tooltips for the donut chart
 */
function setupChartTooltips() {
    const segments = document.querySelectorAll('.donut-chart circle');
    segments.forEach(segment => {
        segment.addEventListener('mouseenter', () => {
            segment.style.opacity = '0.8';
            segment.style.strokeWidth = '14';
        });
        segment.addEventListener('mouseleave', () => {
            segment.style.opacity = '1';
            segment.style.strokeWidth = '12';
        });
    });
}

/**
 * Example function to update a stat card value
 */
function updateStat(id, value) {
    const el = document.querySelector(`.stat-card#${id} .stat-value`);
    if (el) {
        el.textContent = value;
    }
}
