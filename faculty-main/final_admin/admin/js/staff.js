/**
 * Staff Availability Logic for RPLMS Administrator
 */

document.addEventListener('DOMContentLoaded', () => {
    initStaffList();
});

let staffData = [];
let currentPage = 1;
const itemsPerPage = 5;
let editingStaffId = null;

function initStaffList() {
    if (!document.getElementById('staffTableBody')) return;

    generateMockStaff();
    setupFilters();
    renderStaffTable();
    setupEditModal();
    setupPagination();
}

/**
 * Mock Data Generation
 */
function generateMockStaff() {
    const dummyStaff = [
        { id: 1001, staffID: 'STF001', name: 'Dr. Arvind Kumar', department: 'AI & DS', designation: 'Associate Professor', status: 'Available', assignment: '-', email: 'arvind.kumar@university.edu', phone: '9876543210' },
        { id: 1002, staffID: 'STF002', name: 'Dr. Meena R', department: 'CSE', designation: 'Assistant Professor', status: 'Assigned', assignment: 'PRJ-2025-01 (Team Alpha)', email: 'meena.r@university.edu', phone: '9876543211' },
        { id: 1003, staffID: 'STF003', name: 'Dr. Karthik S', department: 'IT', designation: 'Lab Technician', status: 'Available', assignment: '-', email: 'karthik.s@university.edu', phone: '9876543212' },
        { id: 1004, staffID: 'STF004', name: 'Dr. Lakshmi N', department: 'ECE', designation: 'Associate Professor', status: 'Assigned', assignment: 'PRJ-2025-02 (Team Beta)', email: 'lakshmi.n@university.edu', phone: '9876543213' },
        { id: 1005, staffID: 'STF005', name: 'Dr. Naveen P', department: 'AI & DS', designation: 'Assistant Professor', status: 'Available', assignment: '-', email: 'naveen.p@university.edu', phone: '9876543214' },
        { id: 1006, staffID: 'STF006', name: 'Dr. Suresh M', department: 'CSE', designation: 'Lab Technician', status: 'Assigned', assignment: 'PRJ-2025-03 (Team Gamma)', email: 'suresh.m@university.edu', phone: '9876543215' },
        { id: 1007, staffID: 'STF007', name: 'Dr. Deepa V', department: 'IT', designation: 'Associate Professor', status: 'Available', assignment: '-', email: 'deepa.v@university.edu', phone: '9876543216' },
        { id: 1008, staffID: 'STF008', name: 'Dr. Vijay K', department: 'ECE', designation: 'Assistant Professor', status: 'Assigned', assignment: 'PRJ-2025-04 (Team Delta)', email: 'vijay.k@university.edu', phone: '9876543217' },
        { id: 1009, staffID: 'STF009', name: 'Dr. Anitha S', department: 'AI & DS', designation: 'Lab Technician', status: 'Available', assignment: '-', email: 'anitha.s@university.edu', phone: '9876543218' },
        { id: 1010, staffID: 'STF010', name: 'Dr. Ramesh T', department: 'CSE', designation: 'Associate Professor', status: 'Assigned', assignment: 'PRJ-2025-05 (Team Epsilon)', email: 'ramesh.t@university.edu', phone: '9876543219' }
    ];

    staffData = dummyStaff;
    updateStaffStats();
}

function updateStaffStats() {
    const availableStat = document.querySelector('.stat-card .stat-icon.green')?.closest('.stat-card')?.querySelector('.stat-value');
    const assignedStat = document.querySelector('.stat-card .stat-icon.orange')?.closest('.stat-card')?.querySelector('.stat-value');

    if (availableStat) {
        availableStat.textContent = staffData.filter(s => s.status === 'Available').length;
    }
    if (assignedStat) {
        assignedStat.textContent = staffData.filter(s => s.status === 'Assigned').length;
    }
}

/**
 * Filter and Render Logic
 */
function setupFilters() {
    const searchInput = document.getElementById('staffSearch');
    const statusFilter = document.getElementById('statusFilter');
    const deptFilter = document.getElementById('deptFilter');
    const clearBtn = document.getElementById('clearFilters');

    const handleFilter = () => {
        currentPage = 1;
        renderStaffTable();
    };

    searchInput.addEventListener('input', handleFilter);
    statusFilter.addEventListener('change', handleFilter);
    deptFilter.addEventListener('change', handleFilter);

    clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        statusFilter.value = 'all';
        deptFilter.value = 'all';
        handleFilter();
    });
}

function renderStaffTable() {
    const tbody = document.getElementById('staffTableBody');
    const query = document.getElementById('staffSearch').value.toLowerCase();
    const status = document.getElementById('statusFilter').value;
    const dept = document.getElementById('deptFilter').value;

    const filtered = staffData.filter(s => {
        const matchesSearch = s.name.toLowerCase().includes(query) || s.staffID.toLowerCase().includes(query);
        const matchesStatus = status === 'all' || s.status.toLowerCase() === status;
        const matchesDept = dept === 'all' || s.department === dept;
        return matchesSearch && matchesStatus && matchesDept;
    });

    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginated = filtered.slice(startIndex, startIndex + itemsPerPage);

    tbody.innerHTML = '';

    paginated.forEach((s, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${startIndex + index + 1}</td>
            <td style="font-weight: 600;">${s.staffID}</td>
            <td style="font-weight: 500;">${s.name}</td>
            <td>${s.department}</td>
            <td>${s.designation}</td>
            <td><span class="badge badge-${s.status.toLowerCase()}">${s.status}</span></td>
            <td style="color: #64748b; font-size: 13px;">${s.assignment}</td>
            <td>
                <button class="action-btn" type="button" data-staff-id="${s.id}" aria-label="View staff">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                </button>
            </td>
        `;
        row.querySelector('.action-btn').addEventListener('click', () => openEditStaffModal(s.id));
        tbody.appendChild(row);
    });

    updatePaginationInfo(filtered.length);
}

function updatePaginationInfo(totalCount) {
    const start = totalCount === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(currentPage * itemsPerPage, totalCount);

    document.getElementById('startEntry').textContent = start;
    document.getElementById('endEntry').textContent = end;
    document.getElementById('totalEntries').textContent = totalCount;

    document.getElementById('prevPage').disabled = currentPage === 1;
    document.getElementById('nextPage').disabled = end >= totalCount;

    const btnContainer = document.querySelector('.pagination-buttons');
    const existingNumBtns = btnContainer.querySelectorAll('.page-btn:not(#prevPage):not(#nextPage)');
    existingNumBtns.forEach(b => b.remove());

    const pageCount = Math.ceil(totalCount / itemsPerPage);
    const nextBtn = document.getElementById('nextPage');

    for (let i = 1; i <= Math.min(pageCount, 5); i++) {
        const btn = document.createElement('button');
        btn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
        btn.textContent = i;
        btn.addEventListener('click', () => {
            currentPage = i;
            renderStaffTable();
        });
        btnContainer.insertBefore(btn, nextBtn);
    }
}

function setupPagination() {
    const prevPage = document.getElementById('prevPage');
    const nextPage = document.getElementById('nextPage');

    if (prevPage) {
        prevPage.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderStaffTable();
            }
        });
    }

    if (nextPage) {
        nextPage.addEventListener('click', () => {
            const query = document.getElementById('staffSearch').value.toLowerCase();
            const status = document.getElementById('statusFilter').value;
            const dept = document.getElementById('deptFilter').value;
            const filtered = staffData.filter(s => {
                const matchesSearch = s.name.toLowerCase().includes(query) || s.staffID.toLowerCase().includes(query);
                const matchesStatus = status === 'all' || s.status.toLowerCase() === status;
                const matchesDept = dept === 'all' || s.department === dept;
                return matchesSearch && matchesStatus && matchesDept;
            });

            if (currentPage * itemsPerPage < filtered.length) {
                currentPage++;
                renderStaffTable();
            }
        });
    }
}

/**
 * Edit Staff Modal
 */
function setupEditModal() {
    const modal = document.getElementById('editStaffModal');
    if (!modal) return;

    const form = document.getElementById('editStaffForm');
    const closeBtn = document.getElementById('editStaffModalClose');
    const cancelBtn = document.getElementById('editStaffCancel');
    const statusEl = document.getElementById('editStaffStatus');
    const assignmentEl = document.getElementById('editStaffAssignment');

    closeBtn.addEventListener('click', closeEditStaffModal);
    cancelBtn.addEventListener('click', closeEditStaffModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeEditStaffModal();
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        saveStaffChanges();
    });

    statusEl.addEventListener('change', () => {
        if (statusEl.value === 'Available') {
            assignmentEl.value = '-';
            assignmentEl.readOnly = true;
        } else {
            if (assignmentEl.value === '-') assignmentEl.value = '';
            assignmentEl.readOnly = false;
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeEditStaffModal();
        }
    });
}

function openEditStaffModal(staffId) {
    const modal = document.getElementById('editStaffModal');
    if (!modal) return;

    const staff = staffData.find(s => s.id === staffId);
    if (!staff) return;

    editingStaffId = staffId;

    const form = document.getElementById('editStaffForm');
    if (form) clearFormValidation(form);

    document.getElementById('editStaffId').value = staff.staffID;
    document.getElementById('editStaffName').value = staff.name;
    document.getElementById('editStaffDepartment').value = staff.department;
    document.getElementById('editStaffDesignation').value = staff.designation;
    document.getElementById('editStaffEmail').value = staff.email || '';
    document.getElementById('editStaffPhone').value = staff.phone || '';
    document.getElementById('editStaffStatus').value = staff.status;
    document.getElementById('editStaffAssignment').value = staff.assignment;

    const assignmentEl = document.getElementById('editStaffAssignment');
    assignmentEl.readOnly = staff.status === 'Available';

    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function closeEditStaffModal() {
    const modal = document.getElementById('editStaffModal');
    if (!modal) return;

    const form = document.getElementById('editStaffForm');
    if (form) clearFormValidation(form);

    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    editingStaffId = null;
}

function validateEditStaffForm() {
    const form = document.getElementById('editStaffForm');
    const staffIdEl = document.getElementById('editStaffId');
    const nameEl = document.getElementById('editStaffName');
    const deptEl = document.getElementById('editStaffDepartment');
    const emailEl = document.getElementById('editStaffEmail');
    const phoneEl = document.getElementById('editStaffPhone');
    const statusEl = document.getElementById('editStaffStatus');

    return runValidations([
        () => validateStaffId(staffIdEl.value, staffIdEl),
        () => validateName(nameEl.value, 'Staff Name', nameEl),
        () => validateDepartment(deptEl.value, deptEl),
        () => validateEmail(emailEl.value, emailEl),
        () => validatePhone(phoneEl.value, phoneEl, false),
        () => validateAvailabilityStatus(statusEl.value, statusEl)
    ], form);
}

function saveStaffChanges() {
    if (!validateEditStaffForm() || editingStaffId === null) return;

    const staffIndex = staffData.findIndex(s => s.id === editingStaffId);
    if (staffIndex === -1) return;

    const status = document.getElementById('editStaffStatus').value;
    let assignment = document.getElementById('editStaffAssignment').value.trim();
    if (status === 'Available') {
        assignment = '-';
    }

    staffData[staffIndex] = {
        ...staffData[staffIndex],
        name: document.getElementById('editStaffName').value.trim(),
        department: document.getElementById('editStaffDepartment').value,
        designation: document.getElementById('editStaffDesignation').value,
        email: document.getElementById('editStaffEmail').value.trim(),
        phone: document.getElementById('editStaffPhone').value.trim(),
        status,
        assignment
    };

    closeEditStaffModal();
    updateStaffStats();
    renderStaffTable();
    showStaffToast('Staff details updated successfully.');
}

function showStaffToast(message) {
    const toast = document.getElementById('staffToast');
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}
