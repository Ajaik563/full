/**
 * Create Team Logic for RPLMS Senior Faculty
 */

document.addEventListener('DOMContentLoaded', () => {
    initCreateTeam();
});

let selectedLeader = null;
let selectedStaff = null;
let selectedMembers = [];
let memberCount = 3; // Starting with 3 as per wireframe

function initCreateTeam() {
    setupSearch('leaderSearch', 'leaderResults', 'student', (student) => {
        selectedLeader = student;
        document.getElementById('summaryLeader').textContent = student.name;
    });

    setupSearch('staffSearch', 'staffResults', 'staff', (staff) => {
        selectedStaff = staff;
        document.getElementById('summaryStaff').textContent = staff.name;
    });

    setupMemberSearches();
    setupAddMember();
    setupDeadline();
    setupFinalCreation();
    setupReset();
}

/**
 * Generic Search Setup
 */
function setupSearch(inputId, resultsId, type, onSelect) {
    const input = document.getElementById(inputId);
    const results = document.getElementById(resultsId);

    input.addEventListener('input', () => {
        const query = input.value.toLowerCase();
        if (query.length < 2) {
            results.classList.remove('show');
            return;
        }

        const profiles = JSON.parse(localStorage.getItem('profiles') || '[]');
        const filtered = profiles.filter(p => 
            p.role.toLowerCase() === type && 
            (p.name.toLowerCase().includes(query) || (p.rollNumber && p.rollNumber.toLowerCase().includes(query)))
        );

        renderResults(results, filtered, (item) => {
            input.value = item.name;
            results.classList.remove('show');
            onSelect(item);
        });
    });

    // Close results when clicking outside
    document.addEventListener('click', (e) => {
        if (!input.contains(e.target) && !results.contains(e.target)) {
            results.classList.remove('show');
        }
    });
}

function renderResults(container, items, onSelect) {
    if (items.length === 0) {
        container.innerHTML = '<div class="result-item"><span class="result-sub">No results found</span></div>';
    } else {
        container.innerHTML = items.map(item => `
            <div class="result-item" data-id="${item.id}">
                <span class="result-name">${item.name}</span>
                <span class="result-sub">${item.department} | ${item.rollNumber || item.batch}</span>
            </div>
        `).join('');

        container.querySelectorAll('.result-item').forEach(el => {
            el.addEventListener('click', () => {
                const id = el.getAttribute('data-id');
                const item = items.find(i => i.id == id);
                onSelect(item);
            });
        });
    }
    container.classList.add('show');
}

/**
 * Member Specific Logic
 */
function setupMemberSearches() {
    const memberSearches = document.querySelectorAll('.member-search');
    memberSearches.forEach(input => {
        const results = input.nextElementSibling;
        const index = input.getAttribute('data-index');

        input.addEventListener('input', () => {
            const query = input.value.toLowerCase();
            if (query.length < 2) {
                results.classList.remove('show');
                return;
            }

            const profiles = JSON.parse(localStorage.getItem('profiles') || '[]');
            const filtered = profiles.filter(p => 
                p.role.toLowerCase() === 'student' && 
                (p.name.toLowerCase().includes(query) || (p.rollNumber && p.rollNumber.toLowerCase().includes(query)))
            );

            renderResults(results, filtered, (item) => {
                input.value = item.name;
                results.classList.remove('show');
                selectedMembers[index - 1] = item;
                updateMemberSummary();
            });
        });
    });
}

function updateMemberSummary() {
    const count = selectedMembers.filter(m => m).length;
    document.getElementById('summaryMembers').textContent = count > 0 ? `${count} members added` : 'No members added';
    document.getElementById('memberCountBadge').textContent = `${count} / 15 members added`;
}

function setupAddMember() {
    const addBtn = document.getElementById('addMemberBtn');
    addBtn.addEventListener('click', () => {
        if (memberCount >= 15) {
            alert('Maximum 15 members allowed');
            return;
        }

        memberCount++;
        const container = document.getElementById('memberInputsContainer');
        const row = document.createElement('div');
        row.className = 'member-input-row';
        row.id = `row-${memberCount}`;
        row.innerHTML = `
            <span class="member-label">Member ${memberCount}</span>
            <div class="search-container">
                <input type="text" class="search-input member-search" placeholder="Search by name or roll number..." data-index="${memberCount}">
                <div class="dropdown-results"></div>
            </div>
        `;
        container.appendChild(row);
        setupMemberSearches(); // Re-bind for new input
    });
}

/**
 * Deadline Logic
 */
function setupDeadline() {
    const input = document.getElementById('deadlineDate');
    input.addEventListener('change', () => {
        document.getElementById('summaryDeadline').textContent = input.value || 'Not selected';
    });
}

/**
 * Team Creation logic
 */
function setupFinalCreation() {
    document.getElementById('createTeamBtn').addEventListener('click', () => {
        const leaderSearchEl = document.getElementById('leaderSearch');
        const staffSearchEl = document.getElementById('staffSearch');
        const deadlineEl = document.getElementById('deadlineDate');

        const teamContainer = document.querySelector('.steps-scroll-container');

        if (!runValidations([
            () => selectedLeader
                ? { valid: true }
                : { valid: false, message: 'Please select a Team Leader.', field: leaderSearchEl },
            () => selectedMembers.filter(m => m).length > 0
                ? { valid: true }
                : { valid: false, message: 'Please add at least one member.', field: document.querySelector('.member-search') },
            () => selectedStaff
                ? { valid: true }
                : { valid: false, message: 'Please assign a Technical Staff.', field: staffSearchEl },
            () => validateDate(deadlineEl.value, 'Deadline', deadlineEl, { required: true, notPast: true })
        ], teamContainer)) {
            return;
        }

        const teamID = `TEAM-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
        
        const team = {
            id: Date.now(),
            teamID: teamID,
            leader: selectedLeader,
            members: selectedMembers.filter(m => m),
            staff: selectedStaff,
            deadline: document.getElementById('deadlineDate').value,
            status: 'In Progress',
            createdAt: new Date().toISOString()
        };

        // Save to LocalStorage
        let teams = JSON.parse(localStorage.getItem('teams') || '[]');
        teams.unshift(team);
        localStorage.setItem('teams', JSON.stringify(teams));

        // Show Success
        document.getElementById('generatedTeamID').textContent = teamID;
        clearFormValidation(teamContainer);
        document.getElementById('successModal').classList.add('show');
    });
}

function closeModal() {
    document.getElementById('successModal').classList.remove('show');
    // window.location.href = 'dashboard.html'; // Optional redirect
}

function setupReset() {
    document.getElementById('resetBtn').addEventListener('click', () => {
        if(confirm('Are you sure you want to reset all fields?')) {
            window.location.reload();
        }
    });
}
