// equipment.js

import { requireAuth } from './auth.js';
import { apiRequest } from './api.js';

let equipment = [];
let currentPage = 1;
const itemsPerPage = 10;

document.addEventListener('DOMContentLoaded', function() {
    requireAuth('equipment');
    fetchEquipment();
    
    document.getElementById('addEquipmentBtn').addEventListener('click', () => showEquipmentModal());
    document.getElementById('saveEquipmentBtn').addEventListener('click', saveEquipment);
});

async function fetchEquipment(page = 1) {
    try {
        const response = await apiRequest(`/equipment?page=${page}&limit=${itemsPerPage}`);
        equipment = response.data;
        renderEquipmentTable();
        renderPagination(response.totalPages);
    } catch (error) {
        console.error('Failed to fetch equipment:', error);
        alert('Failed to fetch equipment. Please try again.');
    }
}

function renderEquipmentTable() {
    const tableBody = document.getElementById('equipmentTableBody');
    tableBody.innerHTML = '';
    
    equipment.forEach(item => {
        const row = `
            <tr>
                <td>${item.id}</td>
                <td>${item.name}</td>
                <td>${item.type}</td>
                <td>${item.purchaseDate}</td>
                <td>${item.lastMaintenance}</td>
                <td>${item.status}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="editEquipment(${item.id})">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteEquipment(${item.id})">Delete</button>
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
            fetchEquipment(currentPage);
        });
        paginationElement.appendChild(button);
    }
}

function showEquipmentModal(equipmentId = null) {
    const modal = new bootstrap.Modal(document.getElementById('equipmentModal'));
    if (equipmentId) {
        // Edit mode: Populate form with equipment data
        const item = equipment.find(e => e.id === equipmentId);
        document.getElementById('equipmentName').value = item.name;
        document.getElementById('equipmentType').value = item.type;
        document.getElementById('purchaseDate').value = item.purchaseDate;
        document.getElementById('lastMaintenance').value = item.lastMaintenance;
        document.getElementById('equipmentStatus').value = item.status;
    } else {
        // Add mode: Clear form
        document.getElementById('equipmentForm').reset();
    }
    modal.show();
}

async function saveEquipment() {
    const equipmentData = {
        name: document.getElementById('equipmentName').value,
        type: document.getElementById('equipmentType').value,
        purchaseDate: document.getElementById('purchaseDate').value,
        lastMaintenance: document.getElementById('lastMaintenance').value,
        status: document.getElementById('equipmentStatus').value
    };

    try {
        if (equipmentData.id) {
            await apiRequest(`/equipment/${equipmentData.id}`, 'PUT', equipmentData);
        } else {
            await apiRequest('/equipment', 'POST', equipmentData);
        }
        fetchEquipment(currentPage);
        const modal = bootstrap.Modal.getInstance(document.getElementById('equipmentModal'));
        modal.hide();
    } catch (error) {
        console.error('Failed to save equipment:', error);
        alert('Failed to save equipment. Please try again.');
    }
}

async function deleteEquipment(equipmentId) {
    if (confirm('Are you sure you want to delete this equipment?')) {
        try {
            await apiRequest(`/equipment/${equipmentId}`, 'DELETE');
            fetchEquipment(currentPage);
        } catch (error) {
            console.error('Failed to delete equipment:', error);
            alert('Failed to delete equipment. Please try again.');
        }
    }
}

// Make these functions available globally for onclick events
window.editEquipment = showEquipmentModal;
window.deleteEquipment = deleteEquipment;