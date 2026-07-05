/**
 * Core Application Logic for RPLMS Senior Faculty Portal Module
 */

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    toggleSidebar();
    highlightActiveLink();
    initSeniorFacultyProfile();
    initLogoutLinks();
}

function initLogoutLinks() {
    document.querySelectorAll('a[href="#"], .menu-item, .sidebar-footer a').forEach(link => {
        const text = (link.textContent || '').trim().toLowerCase();
        if (text.includes('sign out') || text.includes('logout')) {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                localStorage.removeItem('seniorFacultyProfile');
                localStorage.removeItem('adminProfile');
                localStorage.removeItem('rplms_session');
                window.location.href = '../../../login1.html';
            });
        }
    });
}

/**
 * Handle sidebar toggle on mobile
 */
function toggleSidebar() {
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');

    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
    }
}

/**
 * Highlight the active sidebar menu item based on the current URL
 */
function highlightActiveLink() {
    const currentPath = window.location.pathname;
    const menuItems = document.querySelectorAll('.menu-item');

    menuItems.forEach(item => {
        const itemPath = item.getAttribute('href');
        
        // Remove active class from all
        item.classList.remove('active');

        // Check if the current page matches the item's href
        if (currentPath.includes(itemPath) && itemPath !== '#') {
            item.classList.add('active');
        } 
        // Special case for dashboard if we are at root or pages/
        else if ((currentPath === '/' || currentPath.endsWith('index.html')) && itemPath.includes('dashboard.html')) {
            item.classList.add('active');
        }
    });
}

/**
 * Common Tool: Format Date
 */
function formatDate(date) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
}

/**
 * Common Tool: Toggle Element Visibility
 */
function toggleElement(id, displayStyle = 'block') {
    const el = document.getElementById(id);
    if (el) {
        el.style.display = el.style.display === 'none' ? displayStyle : 'none';
    }
}

/**
 * Senior Faculty Profile — shared data, navbar sync, and profile modal
 */
const SENIOR_FACULTY_PROFILE_KEY = 'seniorFacultyProfile';
const LEGACY_ADMIN_PROFILE_KEY = 'adminProfile';

function getDefaultSeniorFacultyProfile() {
    return {
        name: 'Senior Faculty Name',
        role: 'Senior Faculty',
        email: 'faculty.name@university.edu',
        phone: '9876543210',
        department: 'AI & DS',
        employeeId: 'SF-2025-001',
        joinedOn: 'January 2024',
        status: 'Active'
    };
}

function getSeniorFacultyProfile() {
    let stored = JSON.parse(localStorage.getItem(SENIOR_FACULTY_PROFILE_KEY) || 'null');

    if (!stored) {
        const legacy = JSON.parse(localStorage.getItem(LEGACY_ADMIN_PROFILE_KEY) || 'null');
        if (legacy) {
            stored = {
                ...legacy,
                role: legacy.role === 'Administrator' ? 'Senior Faculty' : legacy.role
            };
            localStorage.setItem(SENIOR_FACULTY_PROFILE_KEY, JSON.stringify(stored));
        }
    }

    const profile = { ...getDefaultSeniorFacultyProfile(), ...(stored || {}) };
    if (profile.role === 'Senior Faculty') {
        profile.role = 'Senior Faculty';
    }
    return profile;
}

function saveSeniorFacultyProfile(updates) {
    const profile = { ...getSeniorFacultyProfile(), ...updates, role: 'Senior Faculty' };
    localStorage.setItem(SENIOR_FACULTY_PROFILE_KEY, JSON.stringify(profile));
    syncNavbarProfile(profile);
    syncDashboardWelcome(profile);
    return profile;
}

function syncNavbarProfile(profile) {
    const data = profile || getSeniorFacultyProfile();
    document.querySelectorAll('.user-name').forEach(el => {
        el.textContent = data.name;
    });
    document.querySelectorAll('.user-role').forEach(el => {
        el.textContent = data.role;
    });
}

function syncDashboardWelcome(profile) {
    const data = profile || getSeniorFacultyProfile();
    const welcomeTitle = document.querySelector('.page-title.welcome-title');
    if (welcomeTitle) {
        welcomeTitle.textContent = `Welcome, ${data.name} 👋`;
    }
}

function initSeniorFacultyProfile() {
    const profile = getSeniorFacultyProfile();
    syncNavbarProfile(profile);
    syncDashboardWelcome(profile);
    injectSeniorFacultyProfileModal();
    setupSeniorFacultyProfileTrigger();
}

function injectSeniorFacultyProfileModal() {
    if (document.getElementById('seniorFacultyProfileModal')) return;

    const modal = document.createElement('div');
    modal.id = 'seniorFacultyProfileModal';
    modal.className = 'senior-faculty-profile-overlay';
    modal.setAttribute('aria-hidden', 'true');
    modal.innerHTML = `
        <div class="senior-faculty-profile-modal" role="dialog" aria-labelledby="seniorFacultyProfileTitle" aria-modal="true">
            <div class="senior-faculty-profile-header">
                <h3 id="seniorFacultyProfileTitle">My Profile</h3>
                <button type="button" class="senior-faculty-profile-close" id="seniorFacultyProfileClose" aria-label="Close">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
            </div>
            <div class="senior-faculty-profile-body">
                <div class="senior-faculty-profile-hero">
                    <div class="senior-faculty-profile-avatar" id="seniorFacultyProfileAvatar">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    </div>
                    <div>
                        <h4 id="seniorFacultyProfileName">Senior Faculty Name</h4>
                        <p id="seniorFacultyProfileRole">Senior Faculty</p>
                        <span class="senior-faculty-profile-status" id="seniorFacultyProfileStatus">Active</span>
                    </div>
                </div>
                <div class="senior-faculty-profile-details">
                    <div class="senior-faculty-profile-item">
                        <span class="senior-faculty-profile-label">Employee ID</span>
                        <span class="senior-faculty-profile-value" id="seniorFacultyProfileEmployeeId">SF-2025-001</span>
                    </div>
                    <div class="senior-faculty-profile-item">
                        <span class="senior-faculty-profile-label">Email ID</span>
                        <span class="senior-faculty-profile-value" id="seniorFacultyProfileEmail">faculty.name@university.edu</span>
                    </div>
                    <div class="senior-faculty-profile-item">
                        <span class="senior-faculty-profile-label">Phone Number</span>
                        <span class="senior-faculty-profile-value" id="seniorFacultyProfilePhone">9876543210</span>
                    </div>
                    <div class="senior-faculty-profile-item">
                        <span class="senior-faculty-profile-label">Department</span>
                        <span class="senior-faculty-profile-value" id="seniorFacultyProfileDepartment">AI & DS</span>
                    </div>
                    <div class="senior-faculty-profile-item">
                        <span class="senior-faculty-profile-label">Joined On</span>
                        <span class="senior-faculty-profile-value" id="seniorFacultyProfileJoined">January 2024</span>
                    </div>
                </div>
            </div>
            <div class="senior-faculty-profile-footer">
                <button type="button" class="btn btn-outline" id="seniorFacultyProfileCloseBtn">Close</button>
                <a href="settings.html" class="btn btn-primary" id="seniorFacultyProfileEditLink">Edit Profile</a>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    document.getElementById('seniorFacultyProfileClose').addEventListener('click', closeSeniorFacultyProfileModal);
    document.getElementById('seniorFacultyProfileCloseBtn').addEventListener('click', closeSeniorFacultyProfileModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeSeniorFacultyProfileModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeSeniorFacultyProfileModal();
        }
    });
}

function setupSeniorFacultyProfileTrigger() {
    document.querySelectorAll('.user-profile').forEach(profile => {
        profile.setAttribute('role', 'button');
        profile.setAttribute('tabindex', '0');
        profile.setAttribute('aria-label', 'View senior faculty profile');

        profile.addEventListener('click', openSeniorFacultyProfileModal);
        profile.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openSeniorFacultyProfileModal();
            }
        });
    });
}

function populateSeniorFacultyProfileModal() {
    const profile = getSeniorFacultyProfile();

    document.getElementById('seniorFacultyProfileName').textContent = profile.name;
    document.getElementById('seniorFacultyProfileRole').textContent = profile.role;
    document.getElementById('seniorFacultyProfileStatus').textContent = profile.status;
    document.getElementById('seniorFacultyProfileEmployeeId').textContent = profile.employeeId;
    document.getElementById('seniorFacultyProfileEmail').textContent = profile.email;
    document.getElementById('seniorFacultyProfilePhone').textContent = profile.phone;
    document.getElementById('seniorFacultyProfileDepartment').textContent = profile.department;
    document.getElementById('seniorFacultyProfileJoined').textContent = profile.joinedOn;

    const editLink = document.getElementById('seniorFacultyProfileEditLink');
    if (editLink) {
        const isInPages = window.location.pathname.includes('/pages/');
        editLink.href = isInPages ? 'settings.html' : 'pages/settings.html';
    }
}

function openSeniorFacultyProfileModal() {
    const modal = document.getElementById('seniorFacultyProfileModal');
    if (!modal) return;

    populateSeniorFacultyProfileModal();
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function closeSeniorFacultyProfileModal() {
    const modal = document.getElementById('seniorFacultyProfileModal');
    if (!modal) return;

    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}
