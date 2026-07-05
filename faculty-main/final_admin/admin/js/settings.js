/**
 * Settings Logic for RPLMS Administrator
 */

document.addEventListener('DOMContentLoaded', () => {
    initSettings();
});

function initSettings() {
    setupSectionNavigation();
    loadAdminProfileToSettings();
    setupSaveActions();
    setupThemeToggle();
}

function loadAdminProfileToSettings() {
    const form = document.querySelector('#profile .settings-form');
    if (!form) return;

    const profile = getAdminProfile();
    const nameEl = form.querySelector('input[type="text"]');
    const emailEl = form.querySelector('input[type="email"]');
    const phoneEl = form.querySelector('input[type="tel"]');
    const deptEl = form.querySelector('select');

    if (nameEl) nameEl.value = profile.name;
    if (emailEl) emailEl.value = profile.email;
    if (phoneEl) phoneEl.value = profile.phone;
    if (deptEl) deptEl.value = profile.department;
}

/**
 * Handle Sidebar Navigation within Settings
 */
function setupSectionNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSector = document.getElementById(targetId);
            
            // Update active link
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            // Scroll to section
            if (targetSector) {
                targetSector.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

/**
 * Handle Save/Toast notifications
 */
function setupSaveActions() {
    const profileSaveBtn = document.querySelector('#profile .btn-primary');
    const passwordSaveBtn = document.querySelector('#security .btn-primary');

    if (profileSaveBtn) {
        profileSaveBtn.addEventListener('click', () => {
            const form = document.querySelector('#profile .settings-form');
            if (!validateProfileForm()) return;

            const nameEl = form.querySelector('input[type="text"]');
            const emailEl = form.querySelector('input[type="email"]');
            const phoneEl = form.querySelector('input[type="tel"]');
            const deptEl = form.querySelector('select');

            saveAdminProfile({
                name: nameEl.value.trim(),
                email: emailEl.value.trim(),
                phone: phoneEl.value.replace(/\D/g, ''),
                department: deptEl.value
            });

            if (form) clearFormValidation(form);
            showToast('Changes saved successfully!');
        });
    }

    if (passwordSaveBtn) {
        passwordSaveBtn.addEventListener('click', () => {
            const form = document.querySelector('#security .settings-form');
            if (!validatePasswordForm()) return;
            if (form) clearFormValidation(form);
            showToast('Changes saved successfully!');
        });
    }
}

function validateProfileForm() {
    const form = document.querySelector('#profile .settings-form');
    if (!form) return true;

    const nameEl = form.querySelector('input[type="text"]');
    const emailEl = form.querySelector('input[type="email"]');
    const phoneEl = form.querySelector('input[type="tel"]');
    const deptEl = form.querySelector('select');

    return runValidations([
        () => validateName(nameEl.value, 'Full Name', nameEl),
        () => validateEmail(emailEl.value, emailEl),
        () => validatePhone(phoneEl.value.replace(/\D/g, ''), phoneEl, true),
        () => validateDepartment(deptEl.value, deptEl)
    ], form);
}

function validatePasswordForm() {
    const form = document.querySelector('#security .settings-form');
    if (!form) return true;

    const inputs = form.querySelectorAll('input[type="password"]');
    const currentEl = inputs[0];
    const newEl = inputs[1];
    const confirmEl = inputs[2];

    return runValidations([
        () => validateRequired(currentEl.value, 'Current Password', currentEl),
        () => validatePassword(newEl.value, newEl),
        () => validateConfirmPassword(newEl.value, confirmEl.value, confirmEl)
    ], form);
}

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

/**
 * Handle Theme Toggle UI
 */
function setupThemeToggle() {
    const cards = document.querySelectorAll('.theme-card');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            cards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            
            const theme = card.querySelector('p').textContent.toLowerCase();
            showToast(`${theme} applied successfully!`);
            
            // This is just a UI mock, 
            // In a real app we would add 'dark-mode' class to body
            if (theme.includes('dark')) {
                document.body.style.filter = 'invert(0.9) hue-rotate(180deg)';
                // Note: Filter invert is a quick way to mock dark mode but not recommended for production
            } else {
                document.body.style.filter = 'none';
            }
        });
    });
}
