/**
 * Common Validation Module for RPLMS Senior Faculty
 * Reusable client-side field validators with inline error UI.
 */

const VALIDATION_SUMMARY_TEXT = 'Please correct the highlighted errors.';
const INVALID_CLASS = 'is-invalid';

function findFieldGroup(field) {
    if (!field) return null;
    return field.closest('.form-group, .student-form-group, .staff-form-group, .search-container, .project-search-container, .step-content') || field.parentElement;
}

function findFieldErrorElement(field) {
    if (!field) return null;

    if (field.id) {
        const byId = document.getElementById(`${field.id}Error`);
        if (byId) return byId;
    }

    const group = findFieldGroup(field);
    if (!group) return null;

    return group.querySelector('.validation-error, .field-error');
}

function getOrCreateFieldErrorElement(field) {
    const existing = findFieldErrorElement(field);
    if (existing) return existing;

    const group = findFieldGroup(field);
    const errorEl = document.createElement('span');
    errorEl.className = 'validation-error';
    errorEl.setAttribute('role', 'alert');
    group.appendChild(errorEl);
    return errorEl;
}

function setFieldError(field, message) {
    if (!field) return;
    field.classList.add(INVALID_CLASS);
    const errorEl = getOrCreateFieldErrorElement(field);
    errorEl.textContent = message;
}

function clearFieldError(field) {
    if (!field) return;
    field.classList.remove(INVALID_CLASS);

    const errorEl = findFieldErrorElement(field);
    if (errorEl) errorEl.textContent = '';
}

function clearFormValidation(container) {
    if (!container) return;

    container.querySelectorAll(`.${INVALID_CLASS}`).forEach(el => {
        el.classList.remove(INVALID_CLASS);
    });

    container.querySelectorAll('.validation-error, .field-error').forEach(el => {
        el.textContent = '';
    });

    const summary = container.querySelector('.validation-summary');
    if (summary) summary.remove();
}

function showValidationSummary(container) {
    if (!container) return;

    let summary = container.querySelector('.validation-summary');
    if (!summary) {
        summary = document.createElement('div');
        summary.className = 'validation-summary';
        summary.setAttribute('role', 'alert');
        summary.textContent = VALIDATION_SUMMARY_TEXT;
        container.insertBefore(summary, container.firstChild);
    }
}

function bindLiveValidationClear(container) {
    if (!container || container.dataset.validationBound === 'true') return;
    container.dataset.validationBound = 'true';

    const clearHandler = (e) => {
        if (e.target.matches('input, select, textarea')) {
            clearFieldError(e.target);
        }
    };

    container.addEventListener('input', clearHandler);
    container.addEventListener('change', clearHandler);
}

/**
 * Run all validators, show every inline error, and display the summary banner.
 * @param {Array<() => { valid: boolean, message?: string, field?: HTMLElement }>} checks
 * @param {HTMLElement} container
 * @returns {boolean} true if all validations pass
 */
function runValidations(checks, container) {
    if (container) {
        clearFormValidation(container);
        bindLiveValidationClear(container);
    }

    const failures = checks
        .map(check => check())
        .filter(result => !result.valid);

    if (failures.length === 0) {
        return true;
    }

    failures.forEach(result => setFieldError(result.field, result.message));

    const summaryContainer = container
        || failures[0].field?.closest('form')
        || failures[0].field?.closest('.card, .steps-scroll-container, .student-modal');

    showValidationSummary(summaryContainer);

    if (failures[0].field && typeof failures[0].field.focus === 'function') {
        failures[0].field.focus();
    }

    const summary = summaryContainer?.querySelector('.validation-summary');
    if (summary) {
        summary.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    if (summaryContainer && summaryContainer !== container) {
        bindLiveValidationClear(summaryContainer);
    }

    return false;
}

function validateRequired(value, fieldLabel, field) {
    const trimmed = (value || '').toString().trim();
    if (!trimmed) {
        return { valid: false, message: `${fieldLabel} is required.`, field };
    }
    return { valid: true };
}

function validateName(value, fieldLabel, field) {
    const trimmed = (value || '').trim();
    if (!trimmed) {
        return { valid: false, message: `${fieldLabel} is required.`, field };
    }
    if (trimmed.length < 3 || trimmed.length > 50) {
        return { valid: false, message: 'Please enter a valid name.', field };
    }
    if (!/^[A-Za-z][A-Za-z.\- ]{2,49}$/.test(trimmed)) {
        return { valid: false, message: 'Please enter a valid name.', field };
    }
    return { valid: true };
}

function validateStudentId(value, field) {
    const trimmed = (value || '').trim();
    if (!trimmed) {
        return { valid: false, message: 'Student ID is required.', field };
    }
    if (!/^STD\d{7}$/.test(trimmed)) {
        return { valid: false, message: 'Invalid Student ID.', field };
    }
    return { valid: true };
}

function validateRollNumber(value, field) {
    const trimmed = (value || '').trim();
    if (!trimmed) {
        return { valid: false, message: 'Roll Number is required.', field };
    }
    if (!/^[A-Za-z0-9]+$/.test(trimmed)) {
        return { valid: false, message: 'Please enter a valid Roll Number.', field };
    }
    return { valid: true };
}

function validateStaffId(value, field) {
    const trimmed = (value || '').trim();
    if (!trimmed) {
        return { valid: false, message: 'Staff ID is required.', field };
    }
    if (!/^STF\d{3}$/.test(trimmed)) {
        return { valid: false, message: 'Invalid Staff ID.', field };
    }
    return { valid: true };
}

function validateAvailabilityStatus(value, field) {
    if (value !== 'Available' && value !== 'Assigned') {
        return { valid: false, message: 'Please select a valid Availability Status.', field };
    }
    return { valid: true };
}

function validatePhone(value, field, required) {
    const isRequired = required !== false;
    const trimmed = (value || '').trim();
    if (!trimmed) {
        if (isRequired) {
            return { valid: false, message: 'Phone Number is required.', field };
        }
        return { valid: true };
    }
    if (!/^\d{10}$/.test(trimmed)) {
        return { valid: false, message: 'Phone Number must contain exactly 10 digits.', field };
    }
    return { valid: true };
}

function validateEmail(value, field) {
    const trimmed = (value || '').trim();
    if (!trimmed) {
        return { valid: false, message: 'Email ID is required.', field };
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
        return { valid: false, message: 'Please enter a valid Email Address.', field };
    }
    return { valid: true };
}

function validatePassword(value, field) {
    const trimmed = value || '';
    if (!trimmed) {
        return { valid: false, message: 'Password is required.', field };
    }
    if (trimmed.length < 8 || trimmed.length > 20) {
        return {
            valid: false,
            message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
            field
        };
    }
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,20}$/.test(trimmed)) {
        return {
            valid: false,
            message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
            field
        };
    }
    return { valid: true };
}

function validateConfirmPassword(password, confirmPassword, field) {
    if (!confirmPassword) {
        return { valid: false, message: 'Confirm Password is required.', field };
    }
    if (password !== confirmPassword) {
        return { valid: false, message: 'Passwords do not match.', field };
    }
    return { valid: true };
}

function validateDepartment(value, field) {
    const trimmed = (value || '').trim();
    if (!trimmed || /^select/i.test(trimmed)) {
        return { valid: false, message: 'Please select a Department.', field };
    }
    return { valid: true };
}

function validateBatch(value, field) {
    const trimmed = (value || '').trim();
    if (!trimmed || /^select/i.test(trimmed)) {
        return { valid: false, message: 'Please select a Batch/Year.', field };
    }
    return { valid: true };
}

function validateStatus(value, field) {
    if (value !== 'Active' && value !== 'Inactive') {
        return { valid: false, message: 'Please select a valid Status.', field };
    }
    return { valid: true };
}

function validateTeam(value, field, required) {
    const isRequired = required === true;
    const trimmed = (value || '').trim();
    if (!isRequired && !trimmed) {
        return { valid: true };
    }
    if (!trimmed) {
        return { valid: false, message: 'Please select a Team.', field };
    }
    return { valid: true };
}

function validateBudget(value, field, required) {
    const isRequired = required !== false;
    const trimmed = (value || '').toString().trim();
    if (!trimmed) {
        if (isRequired) {
            return { valid: false, message: 'Budget Amount is required.', field };
        }
        return { valid: true };
    }
    if (!/^\d+(\.\d{1,2})?$/.test(trimmed) || parseFloat(trimmed) <= 0) {
        return { valid: false, message: 'Please enter a valid Budget Amount.', field };
    }
    return { valid: true };
}

function validateQuantity(value, field, required) {
    const isRequired = required !== false;
    const trimmed = (value || '').toString().trim();
    if (!trimmed) {
        if (isRequired) {
            return { valid: false, message: 'Quantity is required.', field };
        }
        return { valid: true };
    }
    if (!/^[1-9]\d*$/.test(trimmed)) {
        return { valid: false, message: 'Please enter a valid Quantity.', field };
    }
    return { valid: true };
}

function validateDate(value, fieldLabel, field, options) {
    const opts = options || {};
    const trimmed = (value || '').trim();

    if (!trimmed) {
        if (opts.required !== false) {
            return { valid: false, message: `${fieldLabel} is required.`, field };
        }
        return { valid: true };
    }

    const date = new Date(trimmed);
    if (isNaN(date.getTime())) {
        return { valid: false, message: `Please enter a valid ${fieldLabel}.`, field };
    }

    if (opts.notFuture) {
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        if (date > today) {
            return { valid: false, message: `${fieldLabel} cannot be a future date.`, field };
        }
    }

    if (opts.notPast) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (date < today) {
            return { valid: false, message: `${fieldLabel} cannot be in the past.`, field };
        }
    }

    return { valid: true };
}

function validateDateRange(startValue, endValue, startField, endField, startLabel, endLabel) {
    const startResult = validateDate(startValue, startLabel || 'Start Date', startField, { required: true });
    if (!startResult.valid) return startResult;

    const endResult = validateDate(endValue, endLabel || 'End Date', endField, { required: true });
    if (!endResult.valid) return endResult;

    const startDate = new Date(startValue);
    const endDate = new Date(endValue);

    if (endDate < startDate) {
        return {
            valid: false,
            message: 'End Date cannot be earlier than Start Date.',
            field: endField
        };
    }

    return { valid: true };
}

function validateDescription(value, field, required) {
    const isRequired = required !== false;
    const trimmed = (value || '').trim();

    if (!trimmed) {
        if (isRequired) {
            return { valid: false, message: 'Description is required.', field };
        }
        return { valid: true };
    }

    if (trimmed.length < 10 || trimmed.length > 500) {
        return { valid: false, message: 'Description should contain at least 10 characters.', field };
    }

    return { valid: true };
}
