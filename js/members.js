import { getMembers, createMember, updateMember, deleteMember } from './api.js';
import { requireAuth } from './auth.js';

let members = [];
let currentPage = 1;
const itemsPerPage = 20;
let totalPages = 1;

document.addEventListener('DOMContentLoaded', function() {
    requireAuth('members');
    fetchMembers();
    
    document.getElementById('addMemberBtn').addEventListener('click', () => showMemberModal());
    document.getElementById('saveMemberBtn').addEventListener('click', saveMember);
});

async function fetchMembers(page = 1) {
    try {
        const response = await getMembers(page, itemsPerPage);
        members = response.data;
        totalPages = response.totalPages;
        renderMembersTable();
        renderPagination();
    } catch (error) {
        console.error('Failed to fetch members:', error);
        alert('Failed to fetch members. Please try again.');
    }
}

function renderMembersTable() {
    const tableBody = document.getElementById('membersTableBody');
    tableBody.innerHTML = '';
    
    members.forEach(member => {
        const row = `
            <tr>
                <td>${member.id}</td>
                <td>${member.name}</td>
                <td>${member.membershipType}</td>
                <td>${member.expiryDate}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="editMember(${member.id})">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteMember(${member.id})">Delete</button>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

function renderPagination() {
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
            fetchMembers(currentPage);
        });
        paginationElement.appendChild(button);
    }
}

function showMemberModal(memberId = null) {
    const modal = new bootstrap.Modal(document.getElementById('memberModal'));
    if (memberId) {
        // Edit mode: Populate form with member data
        const member = members.find(m => m.id === memberId);
        document.getElementById('memberName').value = member.name;
        document.getElementById('membershipType').value = member.membershipType;
        document.getElementById('expiryDate').value = member.expiryDate;
    } else {
        // Add mode: Clear form
        document.getElementById('memberForm').reset();
    }
    modal.show();
}

function validateMemberForm() {
    const name = document.getElementById('memberName').value.trim();
    const membershipType = document.getElementById('membershipType').value;
    const expiryDate = document.getElementById('expiryDate').value;

    if (name.length < 2) {
        throw new Error('Name must be at least 2 characters long');
    }
    if (!membershipType) {
        throw new Error('Please select a membership type');
    }
    if (!expiryDate) {
        throw new Error('Please select an expiry date');
    }

    return { name, membershipType, expiryDate };
}

async function saveMember() {
    try {
        const memberData = validateMemberForm();
        const newMember = await createMember(memberData);
        members.push(newMember);
        renderMembersTable();
        
        const modal = bootstrap.Modal.getInstance(document.getElementById('memberModal'));
        modal.hide();
    } catch (error) {
        console.error('Failed to save member:', error);
        alert(error.message);
    }
}

async function editMember(memberId) {
    showMemberModal(memberId);
    // Implement the edit functionality using updateMember API call
}

async function deleteMember(memberId) {
    if (confirm('Are you sure you want to delete this member?')) {
        try {
            await deleteMember(memberId);
            members = members.filter(m => m.id !== memberId);
            renderMembersTable();
        } catch (error) {
            console.error('Failed to delete member:', error);
            alert('Failed to delete member. Please try again.');
        }
    }
}

// Make these functions available globally for onclick events
window.editMember = editMember;
window.deleteMember = deleteMember;