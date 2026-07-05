// Demo Login Credentials
const DEMO_USERS = {
  'admin': { password: 'password123', role: 'Admin' },
  'senior': { password: 'password123', role: 'Senior Faculty' },
  'faculty': { password: 'password123', role: 'Technical Faculty' },
  'lab': { password: 'password123', role: 'Lab Technician' },
  'student': { password: 'password123', role: 'Student' },
  'student123': { password: 'password123', role: 'Student' },
  'student@gmail.com': { password: 'password123', role: 'Student' }
};

// DOM Elements
const loginForm = document.getElementById('loginForm');
const roleSelect = document.getElementById('role');
const emailInput = document.getElementById('emailOrUserId');
const passwordInput = document.getElementById('password');
const rememberMeCheckbox = document.getElementById('rememberMe');
const loginButton = document.getElementById('loginButton');
const buttonText = document.getElementById('buttonText');
const togglePasswordBtn = document.getElementById('togglePassword');
const toggleIcon = document.getElementById('toggleIcon');
const formMessage = document.getElementById('formMessage');
const roleError = document.getElementById('roleError');
const emailError = document.getElementById('emailError');
const passwordError = document.getElementById('passwordError');

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  checkExistingSession();

  loginForm.addEventListener('submit', handleSubmit);
  togglePasswordBtn.addEventListener('click', togglePassword);

  roleSelect.addEventListener('change', () => clearFieldError('role'));
  emailInput.addEventListener('input', () => clearFieldError('email'));
  passwordInput.addEventListener('input', () => clearFieldError('password'));

  passwordInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      loginForm.dispatchEvent(new Event('submit'));
    }
  });
});

// Toggle Password Visibility
function togglePassword() {
  const type = passwordInput.type === 'password' ? 'text' : 'password';
  passwordInput.type = type;
  toggleIcon.className = type === 'password' ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash';
}

// Validation Functions
function validateRole(value) {
  if (!value) return { valid: false, error: 'Please select your role.' };
  return { valid: true };
}

function validateEmailOrUserId(value) {
  const trimmedValue = value.trim();
  if (!trimmedValue) return { valid: false, error: 'Email or User ID is required.' };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const usernameRegex = /^[a-zA-Z0-9_]{3,}$/;

  if (!emailRegex.test(trimmedValue) && !usernameRegex.test(trimmedValue)) {
    return { valid: false, error: 'Enter a valid Email or User ID.' };
  }
  return { valid: true, value: trimmedValue.toLowerCase() };
}

function validatePassword(value) {
  if (!value) return { valid: false, error: 'Password is required.' };
  if (value.length < 6) return { valid: false, error: 'Password must be at least 6 characters.' };
  if (value.length > 50) return { valid: false, error: 'Password cannot exceed 50 characters.' };
  return { valid: true };
}

// Error Handling
function clearErrors() {
  roleError.textContent = '';
  emailError.textContent = '';
  passwordError.textContent = '';
  roleSelect.classList.remove('error');
  emailInput.classList.remove('error');
  passwordInput.classList.remove('error');
  hideMessage();
}

function clearFieldError(field) {
  if (field === 'role') { roleError.textContent = ''; roleSelect.classList.remove('error'); }
  if (field === 'email') { emailError.textContent = ''; emailInput.classList.remove('error'); }
  if (field === 'password') { passwordError.textContent = ''; passwordInput.classList.remove('error'); }

  if (!roleError.textContent && !emailError.textContent && !passwordError.textContent) hideMessage();
}

function showMessage(message, type = 'error') {
  formMessage.textContent = message;
  formMessage.className = `message ${type}`;
  formMessage.classList.remove('hidden');
}

function hideMessage() {
  formMessage.classList.add('hidden');
}

// Button State
function setButtonState(state) {
  switch(state) {
    case 'loading':
      loginButton.disabled = true;
      buttonText.innerHTML = '<span class="spinner"></span> Logging in...';
      break;
    case 'success':
      loginButton.disabled = true;
      buttonText.textContent = 'Redirecting...';
      break;
    default:
      loginButton.disabled = false;
      buttonText.textContent = 'LOGIN';
      break;
  }
}

// Handle Form Submit
async function handleSubmit(e) {
  e.preventDefault();
  clearErrors();

  const roleValue = roleSelect.value;
  const emailValue = emailInput.value;
  const passwordValue = passwordInput.value;

  const roleValidation = validateRole(roleValue);
  const emailValidation = validateEmailOrUserId(emailValue);
  const passwordValidation = validatePassword(passwordValue);

  let hasErrors = false;

  if (!roleValidation.valid) { roleError.textContent = roleValidation.error; roleSelect.classList.add('error'); hasErrors = true; }
  if (!emailValidation.valid) { emailError.textContent = emailValidation.error; emailInput.classList.add('error'); hasErrors = true; }
  if (!passwordValidation.valid) { passwordError.textContent = passwordValidation.error; passwordInput.classList.add('error'); hasErrors = true; }

  if (hasErrors) {
    showMessage('Please correct the highlighted errors.', 'error');
    return;
  }

  emailInput.value = emailValidation.value;
  await login(roleValue, emailValidation.value, passwordValue);
}

// Login Function
async function login(selectedRole, emailOrUserId, password) {
  setButtonState('loading');
  await new Promise(resolve => setTimeout(resolve, 1000));

  const user = DEMO_USERS[emailOrUserId];
  if (!user || user.password !== password || user.role !== selectedRole) {
    setButtonState('normal');
    showMessage('Invalid credentials or role selection.', 'error');
    return;
  }

  setButtonState('success');
  showMessage('Login successful! Redirecting...', 'success');

  saveSession({ emailOrUserId, role: user.role, loginTime: new Date().toISOString() });

  setTimeout(() => redirectUser(user.role), 1500);
}

// Save Session
function saveSession(userData) {
  const sessionData = JSON.stringify(userData);
  if (rememberMeCheckbox.checked) localStorage.setItem('rplms_session', sessionData);
  else sessionStorage.setItem('rplms_session', sessionData);
}

// Check Existing Session
function checkExistingSession() {
  const localSession = localStorage.getItem('rplms_session');
  const sessionSession = sessionStorage.getItem('rplms_session');
  if (localSession || sessionSession) {
    const sessionData = JSON.parse(localSession || sessionSession);
    // Optional auto-redirect
    // redirectUser(sessionData.role);
  }
}

// Redirect User Based on Role
function redirectUser(role) {
  switch(role) {
    case 'Admin': window.location.href = './final_admin/admin/index.html'; break;
    case 'Senior Faculty': window.location.href = './final_senior_faculty/final_senior_faculty/index.html'; break;
    case 'Technical Faculty': window.location.href = './faculty-main/facultly.html'; break;
    case 'Lab Technician': window.location.href = './RPLMS--Lab-Incharge-main/RPLMS/RPLMS-main/index.html'; break;
    case 'Student': window.location.href = './student-portal-from-scratch-main/student-portal-from-scratch-main/dashboard.html'; break;
    default: alert(`Dashboard for ${role} is under development.`);
  }
}

// Logout Function
function logout() {
  localStorage.removeItem('rplms_session');
  sessionStorage.removeItem('rplms_session');
  window.location.href = './login1.html';
}
