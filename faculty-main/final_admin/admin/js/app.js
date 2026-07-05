/**
 * Core Application Logic for RPLMS Admin Portal Module
 */

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    toggleSidebar();
    highlightActiveLink();
    initAdminProfile();
    initLogoutLinks();
}

function initLogoutLinks() {
    document.querySelectorAll('a[href="#"], .menu-item, .sidebar-footer a').forEach(link => {
        const text = (link.textContent || '').trim().toLowerCase();
        if (text.includes('sign out') || text.includes('logout')) {
            link.addEventListener('click', function (e) {
                e.preventDefault();
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
 * Admin Profile — shared data, navbar sync, and profile modal
 */
const ADMIN_PROFILE_KEY = 'adminProfile';

function getDefaultAdminProfile() {
    return {
        name: 'Admin Name',
        role: 'Administrator',
        email: 'faculty.name@university.edu',
        phone: '9876543210',
        department: 'AI & DS',
        employeeId: 'ADM-2025-001',
        joinedOn: 'January 2024',
        status: 'Active'
    };
}

function getAdminProfile() {
    const stored = JSON.parse(localStorage.getItem(ADMIN_PROFILE_KEY) || 'null');
    return { ...getDefaultAdminProfile(), ...(stored || {}) };
}

function saveAdminProfile(updates) {
    const profile = { ...getAdminProfile(), ...updates };
    localStorage.setItem(ADMIN_PROFILE_KEY, JSON.stringify(profile));
    syncNavbarProfile(profile);
    return profile;
}

function syncNavbarProfile(profile) {
    const data = profile || getAdminProfile();
    document.querySelectorAll('.user-name').forEach(el => {
        el.textContent = data.name;
    });
    document.querySelectorAll('.user-role').forEach(el => {
        el.textContent = data.role;
    });
}

function initAdminProfile() {
    syncNavbarProfile();
    injectAdminProfileModal();
    setupAdminProfileTrigger();
}

function injectAdminProfileModal() {
    if (document.getElementById('adminProfileModal')) return;

    const modal = document.createElement('div');
    modal.id = 'adminProfileModal';
    modal.className = 'admin-profile-overlay';
    modal.setAttribute('aria-hidden', 'true');
    modal.innerHTML = `
        <div class="admin-profile-modal" role="dialog" aria-labelledby="adminProfileTitle" aria-modal="true">
            <div class="admin-profile-header">
                <h3 id="adminProfileTitle">My Profile</h3>
                <button type="button" class="admin-profile-close" id="adminProfileClose" aria-label="Close">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
            </div>
            <div class="admin-profile-body">
                <div class="admin-profile-hero">
                    <div class="admin-profile-avatar" id="adminProfileAvatar">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    </div>
                    <div>
                        <h4 id="adminProfileName">Admin Name</h4>
                        <p id="adminProfileRole">Administrator</p>
                        <span class="admin-profile-status" id="adminProfileStatus">Active</span>
                    </div>
                </div>
                <div class="admin-profile-details">
                    <div class="admin-profile-item">
                        <span class="admin-profile-label">Employee ID</span>
                        <span class="admin-profile-value" id="adminProfileEmployeeId">ADM-2025-001</span>
                    </div>
                    <div class="admin-profile-item">
                        <span class="admin-profile-label">Email ID</span>
                        <span class="admin-profile-value" id="adminProfileEmail">faculty.name@university.edu</span>
                    </div>
                    <div class="admin-profile-item">
                        <span class="admin-profile-label">Phone Number</span>
                        <span class="admin-profile-value" id="adminProfilePhone">9876543210</span>
                    </div>
                    <div class="admin-profile-item">
                        <span class="admin-profile-label">Department</span>
                        <span class="admin-profile-value" id="adminProfileDepartment">AI & DS</span>
                    </div>
                    <div class="admin-profile-item">
                        <span class="admin-profile-label">Joined On</span>
                        <span class="admin-profile-value" id="adminProfileJoined">January 2024</span>
                    </div>
                </div>
            </div>
            <div class="admin-profile-footer">
                <button type="button" class="btn btn-outline" id="adminProfileCloseBtn">Close</button>
                <a href="settings.html" class="btn btn-primary" id="adminProfileEditLink">Edit Profile</a>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    document.getElementById('adminProfileClose').addEventListener('click', closeAdminProfileModal);
    document.getElementById('adminProfileCloseBtn').addEventListener('click', closeAdminProfileModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeAdminProfileModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeAdminProfileModal();
        }
    });
}

function setupAdminProfileTrigger() {
    document.querySelectorAll('.user-profile').forEach(profile => {
        profile.setAttribute('role', 'button');
        profile.setAttribute('tabindex', '0');
        profile.setAttribute('aria-label', 'View admin profile');

        profile.addEventListener('click', openAdminProfileModal);
        profile.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openAdminProfileModal();
            }
        });
    });
}

function populateAdminProfileModal() {
    const profile = getAdminProfile();

    document.getElementById('adminProfileName').textContent = profile.name;
    document.getElementById('adminProfileRole').textContent = profile.role;
    document.getElementById('adminProfileStatus').textContent = profile.status;
    document.getElementById('adminProfileEmployeeId').textContent = profile.employeeId;
    document.getElementById('adminProfileEmail').textContent = profile.email;
    document.getElementById('adminProfilePhone').textContent = profile.phone;
    document.getElementById('adminProfileDepartment').textContent = profile.department;
    document.getElementById('adminProfileJoined').textContent = profile.joinedOn;

    const editLink = document.getElementById('adminProfileEditLink');
    if (editLink) {
        const isInPages = window.location.pathname.includes('/pages/');
        editLink.href = isInPages ? 'settings.html' : 'pages/settings.html';
    }
}

function openAdminProfileModal() {
    const modal = document.getElementById('adminProfileModal');
    if (!modal) return;

    populateAdminProfileModal();
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function closeAdminProfileModal() {
    const modal = document.getElementById('adminProfileModal');
    if (!modal) return;

    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}
