// staff.js

import { requireAuth } from './auth.js';
import { apiRequest } from './api.js';

let staff = [];
let currentPage = 1;
const itemsPerPage = 10;

document.addEventListener('DOMContentLoaded', function() {
    requireAuth('staff');
    fetchStaff();
    
    document.getElementById('addStaffBtn').addEventListener('click', () => showStaffModal());
    document.getElementById('saveStaffBtn').addEventListener('click', saveStaff);
});

async function fetchStaff(page = 1) {
    try {
        const response = await apiRequest(`/staff?page=${page}&limit=${itemsPerPage}`);
        staff = response.data;
        renderStaffTable();
        renderPagination(response.totalPages);
    } catch (error) {
        console.error('Failed to fetch staff:', error);
        alert('Failed to fetch staff. Please try again.');
    }
}

function renderStaffTable() {
    const tableBody = document.getElementById('staffTableBody');
    tableBody.innerHTML = '';
    
    staff.forEach(member => {
        const row = `
            <tr>
                <td>${member.id}</td>
                <td>${member.name}</td>
                <td>${member.position}</td>
                <td>${member.email}</td>
                <td>${member.phone}</td>
                <td>${member.hireDate}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="editStaff(${member.id})">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteStaff(${member.id})">Delete</button>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

function renderPagination(totalPages) {
    const paginationElement = document.getElementById('pagination');
    paginationElement.innerHTML = '';
    
    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.classList.add('btn', 'btn-secondary', 'mx-1');
        if (i === currentPage) {
            button.classList.add('active');
        }
        button.addEventListener('click', () => {
            currentPage = i;
            fetchStaff(currentPage);
        });
        paginationElement.appendChild(button);
    }
}

function showStaffModal(staffId = null) {
    const modal = new bootstrap.Modal(document.getElementById('staffModal'));
    if (staffId) {
        // Edit mode: Populate form with staff data
        const member = staff.find(s => s.id === staffId);
        document.getElementById('staffName').value = member.name;
        document.getElementById('staffPosition').value = member.position;
        document.getElementById('staffEmail').value = member.email;
        document.getElementById('staffPhone').value = member.phone;
        document.getElementById('hireDate').value = member.hireDate;
    } else {
        // Add mode: Clear form
        document.getElementById('staffForm').reset();
    }
    modal.show();
}

async function saveStaff() {
    const staffData = {
        name: document.getElementById('staffName').value,
        position: document.getElementById('staffPosition').value,
        email: document.getElementById('staffEmail').value,
        phone: document.getElementById('staffPhone').value,
        hireDate: document.getElementById('hireDate').value
    };

    try {
        if (staffData.id) {
            await apiRequest(`/staff/${staffData.id}`, 'PUT', staffData);
        } else {
            await apiRequest('/staff', 'POST', staffData);
        }
        fetchStaff(currentPage);
        const modal = bootstrap.Modal.getInstance(document.getElementById('staffModal'));
        modal.hide();
    } catch (error) {
        console.error('Failed to save staff:', error);
        alert('Failed to save staff. Please try again.');
    }
}

async function deleteStaff(staffId) {
    if (confirm('Are you sure you want to delete this staff member?')) {
        try {
            await apiRequest(`/staff/${staffId}`, 'DELETE');
            fetchStaff(currentPage);
        } catch (error) {
            console.error('Failed to delete staff:', error);
            alert('Failed to delete staff. Please try again.');
        }
    }
}

// Make these functions available globally for onclick events
window.editStaff = showStaffModal;
window.deleteStaff = deleteStaff;