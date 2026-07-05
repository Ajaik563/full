/**
 * Project Details Logic for RPLMS Senior Faculty
 */

document.addEventListener('DOMContentLoaded', () => {
    initProjectDetails();
});

function initProjectDetails() {
    setupSearch();
    // Load default project from wireframe on start
    loadProjectData('PRJ-2025-07');
}

/**
 * Search functionality
 */
function setupSearch() {
    const searchInput = document.getElementById('projectIDSearch');
    const searchBtn = document.getElementById('searchBtn');

    const doSearch = () => {
        const searchInput = document.getElementById('projectIDSearch');
        const searchCard = document.querySelector('.search-card');
        const id = searchInput.value.trim().toUpperCase();

        if (!runValidations([
            () => validateRequired(id, 'Project ID', searchInput)
        ], searchCard)) {
            return;
        }

        loadProjectData(id);
    };

    searchBtn.addEventListener('click', doSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') doSearch();
    });
}

/**
 * Load and display project data
 */
function loadProjectData(id) {
    console.log('Loading project:', id);
    
    // Check localStorage teams
    const teams = JSON.parse(localStorage.getItem('teams') || '[]');
    const foundTeam = teams.find(t => t.teamID === id);

    if (foundTeam) {
        displayTeamData(foundTeam);
    } else if (id === 'PRJ-2025-07') {
        // Show the wireframe mock data
        displayMockData();
    } else {
        alert('Project ID not found. Try PRJ-2025-07');
    }
}

function displayTeamData(team) {
    document.getElementById('displayProjectID').textContent = team.teamID;
    document.getElementById('displayStatus').textContent = team.status || 'In Progress';
    document.getElementById('displayTitle').textContent = `: ${team.projectTitle || 'New Research Project'}`;
    document.getElementById('displayLeader').textContent = `: ${team.leader.name} (${team.leader.rollNumber || 'ID'})`;
    document.getElementById('displayStaff').textContent = `: ${team.staff.name}`;
    document.getElementById('displayCreated').textContent = `: ${new Date(team.createdAt).toLocaleDateString()}`;
    document.getElementById('displayStarted').textContent = `: ${new Date(team.createdAt).toLocaleDateString()}`;
    document.getElementById('displayDeadline').textContent = `: ${new Date(team.deadline).toLocaleDateString()} (Active)`;
    
    document.getElementById('displayDescription').textContent = team.description || "No description provided for this project.";
    
    // Update progress (random for mock)
    const progress = Math.floor(Math.random() * 100);
    updateProgress(progress);
    
    // Render Members
    renderMembers(team.members, team.leader);
}

function displayMockData() {
    // Specifically from the wireframe
    document.getElementById('displayProjectID').textContent = 'PRJ-2025-07';
    document.getElementById('displayStatus').textContent = 'In Progress';
    document.getElementById('displayTitle').textContent = ': AI-Powered Inventory Management System';
    document.getElementById('displayLeader').textContent = ': Arun Kumar (22BCS001)';
    document.getElementById('displayStaff').textContent = ': Dr. Meena R';
    document.getElementById('displayCreated').textContent = ': May 15, 2025';
    document.getElementById('displayStarted').textContent = ': May 16, 2025';
    document.getElementById('displayDeadline').textContent = ': July 15, 2025 (60 days left)';
    document.getElementById('displayDescription').textContent = 'The system will automate inventory tracking, stock alerts and reporting using AI/ML models to forecast demand and reduce wastage.';
    
    updateProgress(40);
    
    const mockMembers = [
        { role: 'Team Leader', name: 'Arun Kumar', id: '22BCS001', dept: 'AI & DS', email: 'arun.kumar@example.com' },
        { role: 'Member', name: 'Priya Sharma', id: '22BCS002', dept: 'AI & DS', email: 'priya.sharma@example.com' },
        { role: 'Member', name: 'Rohan Mehta', id: '22BCS003', dept: 'AI & DS', email: 'rohan.mehta@example.com' },
        { role: 'Member', name: 'Sneha P', id: '22BCS004', dept: 'AI & DS', email: 'sneha.p@example.com' },
        { role: 'Member', name: 'Vikram S', id: '22BCS005', dept: 'AI & DS', email: 'vikram.s@example.com' }
    ];
    
    const tbody = document.getElementById('teamMembersBody');
    tbody.innerHTML = mockMembers.map(m => `
        <tr>
            <td>${m.role}</td>
            <td style="font-weight: 600;">${m.name}</td>
            <td>${m.id}</td>
            <td>${m.dept}</td>
            <td style="color: #6366f1;">${m.email}</td>
        </tr>
    `).join('');
}

function updateProgress(percent) {
    const circle = document.getElementById('progressCircle');
    circle.style.setProperty('--percent', percent);
    circle.querySelector('.percentage').textContent = `${percent}%`;
    document.querySelector('.progress-text .p-val').textContent = `${percent}%`;
    document.getElementById('timeProgress').textContent = `${percent}% tasks completed`;
}

function renderMembers(members, leader) {
    const tbody = document.getElementById('teamMembersBody');
    let html = `
        <tr>
            <td style="color: var(--primary-color); font-weight:700;">Team Leader</td>
            <td style="font-weight: 600;">${leader.name}</td>
            <td>${leader.rollNumber || 'STD-001'}</td>
            <td>${leader.department}</td>
            <td style="color: #6366f1;">${leader.name.toLowerCase().replace(' ', '.')}@example.com</td>
        </tr>
    `;
    
    members.forEach(m => {
        html += `
            <tr>
                <td>Member</td>
                <td style="font-weight: 600;">${m.name}</td>
                <td>${m.rollNumber || 'STD-00X'}</td>
                <td>${m.department}</td>
                <td style="color: #6366f1;">${m.name.toLowerCase().replace(' ', '.')}@example.com</td>
            </tr>
        `;
    });
    
    tbody.innerHTML = html;
}
