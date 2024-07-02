// admin.js

document.addEventListener("DOMContentLoaded", function() {
    const memberChartCtx = document.getElementById("memberChart").getContext("2d");
    const classChartCtx = document.getElementById("classChart").getContext("2d");

    const memberChart = new Chart(memberChartCtx, {
        type: 'bar',
        data: {
            labels: ['January', 'February', 'March', 'April', 'May'],
            datasets: [{
                label: 'New Members',
                data: [10, 20, 30, 40, 50],
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    const classChart = new Chart(classChartCtx, {
        type: 'line',
        data: {
            labels: ['January', 'February', 'March', 'April', 'May'],
            datasets: [{
                label: 'Classes Held',
                data: [15, 25, 35, 45, 55],
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
});
