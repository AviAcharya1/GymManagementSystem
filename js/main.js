// main.js

document.addEventListener('DOMContentLoaded', function() {
    // Simulating data fetching
    fetchDashboardData();
});

function fetchDashboardData() {
    // In a real application, these would be API calls
    setTimeout(() => {
        document.getElementById('totalMembers').textContent = '250';
        document.getElementById('activeClasses').textContent = '15';
        document.getElementById('staffMembers').textContent = '20';
        document.getElementById('equipmentStatus').textContent = '95% Operational';
    }, 1000);
}