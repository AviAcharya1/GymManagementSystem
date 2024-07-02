// classes.js

import { requireAuth } from './auth.js';
import { apiRequest } from './api.js';

let classes = [];
let currentPage = 1;
const itemsPerPage = 10;

document.addEventListener('DOMContentLoaded', function() {
    requireAuth('classes');
    fetchClasses();
    
    document.getElementById('addClassBtn').addEventListener('click', () => showClassModal());
    document.getElementById('saveClassBtn').addEventListener('click', saveClass);
});

async function fetchClasses(page = 1) {
    try {
        const response = await apiRequest(`/classes?page=${page}&limit=${itemsPerPage}`);
        classes = response.data;
        renderClassesTable();
        renderPagination(response.totalPages);
    } catch (error) {
        console.error('Failed to fetch classes:', error);
        alert('Failed to fetch classes. Please try again.');
    }
}

function renderClassesTable() {
    const tableBody = document.getElementById('classesTableBody');
    tableBody.innerHTML = '';
    
    classes.forEach(cls => {
        const row = `
            <tr>
                <td>${cls.id}</td>
                <td>${cls.name}</td>
                <td>${cls.instructor}</td>
                <td>${cls.schedule}</td>
                <td>${cls.capacity}</td>
                <td>${cls.enrolled}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="editClass(${cls.id})">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteClass(${cls.id})">Delete</button>
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
            fetchClasses(currentPage);
        });
        paginationElement.appendChild(button);
    }
}

function showClassModal(classId = null) {
    const modal = new bootstrap.Modal(document.getElementById('classModal'));
    if (classId) {
        // Edit mode: Populate form with class data
        const cls = classes.find(c => c.id === classId);
        document.getElementById('className').value = cls.name;
        document.getElementById('classInstructor').value = cls.instructor;
        document.getElementById('classSchedule').value = cls.schedule;
        document.getElementById('classCapacity').value = cls.capacity;
    } else {
        // Add mode: Clear form
        document.getElementById('classForm').reset();
    }
    modal.show();
}

async function saveClass() {
    const classData = {
        name: document.getElementById('className').value,
        instructor: document.getElementById('classInstructor').value,
        schedule: document.getElementById('classSchedule').value,
        capacity: document.getElementById('classCapacity').value
    };

    try {
        if (classData.id) {
            await apiRequest(`/classes/${classData.id}`, 'PUT', classData);
        } else {
            await apiRequest('/classes', 'POST', classData);
        }
        fetchClasses(currentPage);
        const modal = bootstrap.Modal.getInstance(document.getElementById('classModal'));
        modal.hide();
    } catch (error) {
        console.error('Failed to save class:', error);
        alert('Failed to save class. Please try again.');
    }
}

async function deleteClass(classId) {
    if (confirm('Are you sure you want to delete this class?')) {
        try {
            await apiRequest(`/classes/${classId}`, 'DELETE');
            fetchClasses(currentPage);
        } catch (error) {
            console.error('Failed to delete class:', error);
            alert('Failed to delete class. Please try again.');
        }
    }
}

// Make these functions available globally for onclick events
window.editClass = showClassModal;
window.deleteClass = deleteClass;
