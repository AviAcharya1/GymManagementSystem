// reports.js

import { requireAuth } from './auth.js';
import { apiRequest } from './api.js';

document.addEventListener('DOMContentLoaded', function() {
    requireAuth('reports');
    setupReportGenerators();
});

function setupReportGenerators() {
    document.getElementById('generateMembershipReport').addEventListener('click', generateMembershipReport);
    document.getElementById('generateFinancialReport').addEventListener('click', generateFinancialReport);
}

async function generateMembershipReport() {
    try {
        const data = await apiRequest('/reports/membership');
        renderMembershipReport(data);
    } catch (error) {
        console.error('Failed to generate membership report:', error);
        alert('Failed to generate membership report. Please try again.');
    }
}

async function generateFinancialReport() {
    try {
        const data = await apiRequest('/reports/financial');
        renderFinancialReport(data);
    } catch (error) {
        console.error('Failed to generate financial report:', error);
        alert('Failed to generate financial report. Please try again.');
    }
}

function renderMembershipReport(data) {
    const reportContent = document.getElementById('reportContent');
    reportContent.innerHTML = `
        <h2>Membership Report</h2>
        <p>Total Members: ${data.totalMembers}</p>
        <p>Active Members: ${data.activeMembers}</p>
        <p>Expired Memberships: ${data.expiredMemberships}</p>
        <p>New Members This Month: ${data.newMembersThisMonth}</p>
    `;
}

function renderFinancialReport(data) {
    const reportContent = document.getElementById('reportContent');
    reportContent.innerHTML = `
        <h2>Financial Report</h2>
        <p>Total Revenue: $${data.totalRevenue}</p>
        <p>Total Expenses: $${data.totalExpenses}</p>
        <p>Net Profit: $${data.netProfit}</p>
        <p>Revenue Growth: ${data.revenueGrowth}%</p>
    `;
}