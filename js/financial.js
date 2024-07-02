// financial.js

import { requireAuth } from './auth.js';
import { apiRequest } from './api.js';

document.addEventListener('DOMContentLoaded', function() {
    requireAuth('financial');
    fetchFinancialData();
});

async function fetchFinancialData() {
    try {
        const data = await apiRequest('/financial/summary');
        renderFinancialDashboard(data);
    } catch (error) {
        console.error('Failed to fetch financial data:', error);
        alert('Failed to fetch financial data. Please try again.');
    }
}

function renderFinancialDashboard(data) {
    document.getElementById('totalRevenue').textContent = `$${data.totalRevenue.toFixed(2)}`;
    document.getElementById('totalExpenses').textContent = `$${data.totalExpenses.toFixed(2)}`;
    document.getElementById('netProfit').textContent = `$${(data.totalRevenue - data.totalExpenses).toFixed(2)}`;
    
    renderRevenueChart(data.revenueByMonth);
    renderExpenseChart(data.expensesByCategory);
}

function renderRevenueChart(revenueData) {
    const ctx = document.getElementById('revenueChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: revenueData.map(d => d.month),
            datasets: [{
                label: 'Monthly Revenue',
                data: revenueData.map(d => d.amount),
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Monthly Revenue'
                }
            }
        }
    });
}

function renderExpenseChart(expenseData) {
    const ctx = document.getElementById('expenseChart').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: expenseData.map(d => d.category),
            datasets: [{
                data: expenseData.map(d => d.amount),
                backgroundColor: [
                    'rgb(255, 99, 132)',
                    'rgb(54, 162, 235)',
                    'rgb(255, 205, 86)',
                    'rgb(75, 192, 192)',
                    'rgb(153, 102, 255)'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Expenses by Category'
                }
            }
        }
    });
}