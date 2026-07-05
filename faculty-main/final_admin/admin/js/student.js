/**
 * Student List Logic for RPLMS Administrator
 */

document.addEventListener('DOMContentLoaded', () => {
    initStudentList();
});

let studentData = [];
let currentPage = 1;
const itemsPerPage = 5;
let editingStudentId = null;

function initStudentList() {
    if (!document.getElementById('studentTableBody')) return;

    generateMockStudents();
    setupFilters();
    renderStudentTable();
    setupExport();
    setupEditModal();
    setupPagination();
}

/**
 * Mock Data Generation
 */
function generateMockStudents() {
    const departments = ['AI & DS', 'CSE', 'IT', 'ECE'];
    const batches = ['2022 - 2026', '2021 - 2025', '2020 - 2024'];
    
    // Existing data from localStorage
    const profiles = JSON.parse(localStorage.getItem('profiles') || '[]');
    const existingStudents = profiles.filter(p => p.role.toLowerCase() === 'student');

    studentData = existingStudents.map((s, i) => ({
        id: s.id,
        studentID: `STD2025${(i+1).toString().padStart(3, '0')}`,
        name: s.name,
        rollNumber: s.rollNumber || `22BCS${(i+1).toString().padStart(3, '0')}`,
        department: s.department,
        batch: s.batch ? `${s.batch} - ${parseInt(s.batch)+4}` : '2022 - 2026',
        email: s.email || `${s.name.toLowerCase().replace(' ', '.')}@example.com`,
        phone: s.phone || '',
        teamName: getStudentTeamName(s.id),
        status: s.status || 'Active'
    }));

    // Fill up to 120 entries
    const firstNames = ['Arun', 'Priya', 'Rohan', 'Sneha', 'Vikram', 'Anjali', 'Karan', 'Sonal', 'Rahul', 'Neha'];
    const lastNames = ['Kumar', 'Sharma', 'Mehta', 'P', 'S', 'Reddy', 'Singh', 'Verma', 'Gupta', 'Iyer'];

    for (let i = studentData.length; i < 120; i++) {
        const fname = firstNames[i % firstNames.length];
        const lname = lastNames[i % lastNames.length];
        const dept = departments[i % departments.length];
        const batch = batches[i % batches.length];
        
        studentData.push({
            id: Date.now() + i,
            studentID: `STD2025${(i+1).toString().padStart(3, '0')}`,
            name: `${fname} ${lname}`,
            rollNumber: `22BCS${(i+1).toString().padStart(3, '0')}`,
            department: dept,
            batch: batch,
            email: `${fname.toLowerCase()}.${lname.toLowerCase()}@example.com`,
            phone: `98${(10000000 + i).toString().slice(0, 8)}`,
            teamName: '',
            status: 'Active'
        });
    }
}

/**
 * Filtering Logic
 */
function setupFilters() {
    const search = document.getElementById('studentSearch');
    const dept = document.getElementById('deptFilter');
    const batch = document.getElementById('batchFilter');

    const handleFilter = () => {
        currentPage = 1;
        renderStudentTable();
    };

    search.addEventListener('input', handleFilter);
    dept.addEventListener('change', handleFilter);
    batch.addEventListener('change', handleFilter);
}

function renderStudentTable() {
    const tbody = document.getElementById('studentTableBody');
    const query = document.getElementById('studentSearch').value.toLowerCase();
    const dept = document.getElementById('deptFilter').value;
    const batch = document.getElementById('batchFilter').value;

    const filtered = studentData.filter(h => {
        const matchesSearch = h.name.toLowerCase().includes(query) || 
                             h.studentID.toLowerCase().includes(query) || 
                             h.rollNumber.toLowerCase().includes(query);
        const matchesDept = dept === 'all' || h.department === dept;
        const matchesBatch = batch === 'all' || h.batch === batch;
        return matchesSearch && matchesDept && matchesBatch;
    });

    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginated = filtered.slice(startIndex, startIndex + itemsPerPage);

    tbody.innerHTML = '';
    
    paginated.forEach((s, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${startIndex + index + 1}</td>
            <td style="font-weight: 600;">${s.studentID}</td>
            <td style="font-weight: 500;">${s.name}</td>
            <td>${s.rollNumber}</td>
            <td>${s.department}</td>
            <td>${s.batch}</td>
            <td style="color: #64748b; font-size: 13px;">${s.email}</td>
            <td>
                <button class="action-btn" type="button" data-student-id="${s.id}" aria-label="View student">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                </button>
            </td>
        `;
        const actionBtn = row.querySelector('.action-btn');
        actionBtn.addEventListener('click', () => openEditModal(s.id));
        tbody.appendChild(row);
    });

    updatePagination(filtered.length);
}

function updatePagination(total) {
    const start = total === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(currentPage * itemsPerPage, total);
    
    document.getElementById('startEntry').textContent = start;
    document.getElementById('endEntry').textContent = end;
    document.getElementById('totalEntries').textContent = total;

    document.getElementById('prevPage').disabled = currentPage === 1;
    document.getElementById('nextPage').disabled = end >= total;

    // Numerical buttons logic (Simplified)
    const btnContainer = document.querySelector('.pagination-buttons');
    const existing = btnContainer.querySelectorAll('.page-btn:not(#prevPage):not(#nextPage)');
    const ellipsis = btnContainer.querySelector('.pagination-ellipsis');
    
    existing.forEach(b => b.remove());
    if (ellipsis) ellipsis.remove();

    const maxPages = Math.ceil(total / itemsPerPage);
    const nextBtn = document.getElementById('nextPage');

    for (let i = 1; i <= Math.min(maxPages, 5); i++) {
        const btn = document.createElement('button');
        btn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
        btn.textContent = i;
        btn.addEventListener('click', () => {
            currentPage = i;
            renderStudentTable();
        });
        btnContainer.insertBefore(btn, nextBtn);
    }

    if (maxPages > 5) {
        const dots = document.createElement('span');
        dots.className = 'pagination-ellipsis';
        dots.textContent = '...';
        btnContainer.insertBefore(dots, nextBtn);

        const lastBtn = document.createElement('button');
        lastBtn.className = `page-btn ${maxPages === currentPage ? 'active' : ''}`;
        lastBtn.textContent = maxPages;
        lastBtn.addEventListener('click', () => {
            currentPage = maxPages;
            renderStudentTable();
        });
        btnContainer.insertBefore(lastBtn, nextBtn);
    }
}

/**
 * Export Logic
 */
function setupExport() {
    document.getElementById('exportBtn').addEventListener('click', () => {
        alert('Exporting student list to Excel...');
        // In a real app, this would use a library like SheetJS or generate a CSV
    });
}

// Global Nav
function setupPagination() {
    const prevPage = document.getElementById('prevPage');
    const nextPage = document.getElementById('nextPage');

    if (prevPage) {
        prevPage.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderStudentTable();
            }
        });
    }

    if (nextPage) {
        nextPage.addEventListener('click', () => {
            if (currentPage * itemsPerPage < studentData.length) {
                currentPage++;
                renderStudentTable();
            }
        });
    }
}

/**
 * Team lookup from localStorage
 */
function getStudentTeamName(studentId) {
    const teams = JSON.parse(localStorage.getItem('teams') || '[]');
    for (const team of teams) {
        if (team.leader && team.leader.id == studentId) return team.teamID;
        if (team.members && team.members.some(m => m.id == studentId)) return team.teamID;
    }
    return '';
}

function getAvailableTeams() {
    const teams = JSON.parse(localStorage.getItem('teams') || '[]');
    return teams.map(t => t.teamID).filter(Boolean);
}

/**
 * Edit Student Modal
 */
function setupEditModal() {
    const modal = document.getElementById('editStudentModal');
    if (!modal) return;

    const form = document.getElementById('editStudentForm');
    const closeBtn = document.getElementById('editStudentModalClose');
    const cancelBtn = document.getElementById('editStudentCancel');

    closeBtn.addEventListener('click', closeEditModal);
    cancelBtn.addEventListener('click', closeEditModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeEditModal();
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        saveStudentChanges();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeEditModal();
        }
    });
}

function populateTeamDropdown(selectedTeam) {
    const teamSelect = document.getElementById('editTeamName');
    const teams = getAvailableTeams();

    teamSelect.innerHTML = '<option value="">No Team Assigned</option>';
    teams.forEach(teamId => {
        const option = document.createElement('option');
        option.value = teamId;
        option.textContent = teamId;
        teamSelect.appendChild(option);
    });

    if (selectedTeam && !teams.includes(selectedTeam)) {
        const option = document.createElement('option');
        option.value = selectedTeam;
        option.textContent = selectedTeam;
        teamSelect.appendChild(option);
    }

    teamSelect.value = selectedTeam || '';
}

function openEditModal(studentId) {
    const modal = document.getElementById('editStudentModal');
    if (!modal) return;

    const student = studentData.find(s => s.id === studentId);
    if (!student) return;

    editingStudentId = studentId;

    const form = document.getElementById('editStudentForm');
    if (form) clearFormValidation(form);

    document.getElementById('editStudentId').value = student.studentID;
    document.getElementById('editStudentName').value = student.name;
    document.getElementById('editRollNumber').value = student.rollNumber;
    document.getElementById('editDepartment').value = student.department;
    document.getElementById('editBatch').value = student.batch;
    document.getElementById('editEmail').value = student.email;
    document.getElementById('editPhone').value = student.phone || '';
    document.getElementById('editStatus').value = student.status || 'Active';
    populateTeamDropdown(student.teamName || '');

    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function closeEditModal() {
    const modal = document.getElementById('editStudentModal');
    if (!modal) return;

    const form = document.getElementById('editStudentForm');
    if (form) clearFormValidation(form);

    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    editingStudentId = null;
}

function validateEditForm() {
    const form = document.getElementById('editStudentForm');
    const studentIdEl = document.getElementById('editStudentId');
    const nameEl = document.getElementById('editStudentName');
    const rollEl = document.getElementById('editRollNumber');
    const deptEl = document.getElementById('editDepartment');
    const batchEl = document.getElementById('editBatch');
    const emailEl = document.getElementById('editEmail');
    const phoneEl = document.getElementById('editPhone');
    const statusEl = document.getElementById('editStatus');

    return runValidations([
        () => validateStudentId(studentIdEl.value, studentIdEl),
        () => validateName(nameEl.value, 'Student Name', nameEl),
        () => validateRollNumber(rollEl.value, rollEl),
        () => validateDepartment(deptEl.value, deptEl),
        () => validateBatch(batchEl.value, batchEl),
        () => validateEmail(emailEl.value, emailEl),
        () => validatePhone(phoneEl.value, phoneEl, false),
        () => validateStatus(statusEl.value, statusEl)
    ], form);
}

function saveStudentChanges() {
    if (!validateEditForm() || editingStudentId === null) return;

    const studentIndex = studentData.findIndex(s => s.id === editingStudentId);
    if (studentIndex === -1) return;

    studentData[studentIndex] = {
        ...studentData[studentIndex],
        name: document.getElementById('editStudentName').value.trim(),
        rollNumber: document.getElementById('editRollNumber').value.trim(),
        department: document.getElementById('editDepartment').value,
        batch: document.getElementById('editBatch').value,
        email: document.getElementById('editEmail').value.trim(),
        phone: document.getElementById('editPhone').value.trim(),
        teamName: document.getElementById('editTeamName').value,
        status: document.getElementById('editStatus').value
    };

    closeEditModal();
    renderStudentTable();
    showStudentToast('Student details updated successfully.');
}

function showStudentToast(message) {
    const toast = document.getElementById('studentToast');
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}
