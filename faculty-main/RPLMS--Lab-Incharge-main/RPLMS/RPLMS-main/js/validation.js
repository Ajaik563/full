// Advanced Client-Side Validation, Forms Manager, and Auto-backups

class RPLMSFormValidator {
    /**
     * Initializes validator for a specific form
     * @param {string} formId 
     * @param {Object} schema Validation definition (key: field name, rules: {required, email, numeric, min, max, charLimit, dateType})
     * @param {Function} onSubmitSuccess Callback when form is valid and submitted
     * @param {string} autosaveKey Optional key for auto-saving drafts (localStorage)
     */
    constructor(formId, schema, onSubmitSuccess, autosaveKey = null) {
        this.form = document.getElementById(formId);
        if (!this.form) return;

        this.schema = schema;
        this.onSubmitSuccess = onSubmitSuccess;
        this.autosaveKey = autosaveKey;
        this.isDirty = false;
        this.submitBtn = this.form.querySelector('button[type="submit"]') || this.form.querySelector('.btn-primary');

        this.init();
    }

    init() {
        this.setupListeners();
        this.setupCharCounters();

        if (this.autosaveKey) {
            this.loadDraft();
            this.setupAutosave();
        }
    }

    setupListeners() {
        // Submit handler
        this.form.addEventListener("submit", (e) => {
            e.preventDefault();
            if (this.validate()) {
                // SQL keywords detection
                const rawString = JSON.stringify(this.getFormData());
                if (hasSqlInfectionRisk(rawString)) {
                    showToast("Potential SQL injection keywords detected in form input! Please clean your inputs.", "error");
                    return;
                }

                // Disable button to prevent double submission
                if (this.submitBtn) {
                    const originalHtml = this.submitBtn.innerHTML;
                    this.submitBtn.disabled = true;
                    this.submitBtn.innerHTML = `&#8635; Loading...`;

                    setTimeout(() => {
                        this.onSubmitSuccess(this.getFormData());
                        this.clearDraft();
                        this.isDirty = false;
                        this.submitBtn.disabled = false;
                        this.submitBtn.innerHTML = originalHtml;
                    }, 800);
                } else {
                    this.onSubmitSuccess(this.getFormData());
                    this.clearDraft();
                    this.isDirty = false;
                }
            }
        });

        // Form inputs change marker
        this.form.querySelectorAll("input, select, textarea").forEach(input => {
            input.addEventListener("input", () => {
                this.isDirty = true;
                this.clearFieldValidation(input);

                // Auto check schema and submit state
                this.checkSubmitStateDebounced();
            });

            input.addEventListener("blur", () => {
                this.validateField(input);
            });
        });

        // Reset confirmation
        this.form.addEventListener("reset", (e) => {
            e.preventDefault();
            createConfirmationModal(
                "Confirm Form Reset",
                "Are you sure you want to clear all inputs? Any unsaved changes will be lost.",
                () => {
                    this.form.querySelectorAll("input, select, textarea").forEach(ctrl => {
                        if (ctrl.type === "submit" || ctrl.type === "reset" || ctrl.tagName === "BUTTON") return;
                        if (ctrl.hasAttribute("readonly") || ctrl.hasAttribute("disabled")) return;
                        ctrl.value = "";
                    });
                    this.clearDraft();
                    this.isDirty = false;
                    this.form.querySelectorAll(".is-invalid").forEach(el => el.classList.remove("is-invalid"));
                    this.form.querySelectorAll(".invalid-feedback").forEach(el => el.style.display = "none");
                    this.setupCharCounters();
                    showToast("Form cleared", "info");
                },
                "Reset Form",
                true
            );
        });

        // Warning before leaving unsaved shifts
        window.addEventListener("beforeunload", (e) => {
            if (this.isDirty) {
                e.preventDefault();
                e.returnValue = "You have unsaved changes. Are you sure you want to leave?";
                return e.returnValue;
            }
        });
    }

    // Live submit button disable checker
    checkSubmitStateDebounced() {
        if (!this.submitBtn) return;
        // We don't disable unless they want strict live checks. 
        // Let's keep it responsive but check constraints.
    }

    setupCharCounters() {
        this.form.querySelectorAll("textarea").forEach(textarea => {
            const name = textarea.name;
            const rule = this.schema[name];
            if (rule && rule.charLimit) {
                // Find counter element
                let counter = textarea.parentElement.querySelector(".textarea-char-counter");
                if (!counter) {
                    counter = document.createElement("div");
                    counter.className = "textarea-char-counter";
                    textarea.parentElement.appendChild(counter);
                }

                const updateCounter = () => {
                    const len = textarea.value.length;
                    counter.textContent = `${len} / ${rule.charLimit}`;
                    if (len > rule.charLimit) {
                        counter.style.color = "#EF4444";
                    } else {
                        counter.style.color = "var(--text-secondary)";
                    }
                };

                textarea.addEventListener("input", updateCounter);
                updateCounter(); // First load
            }
        });
    }

    validate() {
        let isValid = true;
        let firstInvalidField = null;

        Object.keys(this.schema).forEach(fieldName => {
            const input = this.form.querySelector(`[name="${fieldName}"]`);
            if (input) {
                const fieldValid = this.validateField(input);
                if (!fieldValid) {
                    isValid = false;
                    if (!firstInvalidField) firstInvalidField = input;
                }
            }
        });

        if (!isValid && firstInvalidField) {
            firstInvalidField.focus();
            showToast("Please review the highlighted errors", "error");
        }

        return isValid;
    }

    validateField(input) {
        const name = input.name;
        const rule = this.schema[name];
        if (!rule) return true;

        let value = input.value;
        if (typeof value === "string") {
            value = value.trim(); // Trim whitespace
        }

        let errorMsg = "";

        // Required Field check
        if (rule.required && (!value || value === "")) {
            errorMsg = "This field is required";
        }
        // Indian phone validation
        else if (rule.type === "indianPhone" && value !== "") {
            const indianPhoneRegex = /^(\+91[\s\-]?)?[6-9]\d{9}$/;
            if (!indianPhoneRegex.test(value.replace(/\s/g, ""))) {
                errorMsg = "Enter a valid Indian phone number (e.g. +91 9876543210)";
            }
        }
        // Generic phone validation
        else if (rule.type === "phone" && value !== "") {
            const phoneRegex = /^\+?[0-9\s\-]{8,15}$/;
            if (!phoneRegex.test(value)) {
                errorMsg = "Enter a valid phone number (8-15 digits)";
            }
        }
        // Password strength validation
        else if (rule.type === "password" && value !== "") {
            if (value.length < 8) {
                errorMsg = "Password must be at least 8 characters";
            } else if (!/[a-zA-Z]/.test(value)) {
                errorMsg = "Password must include at least one letter";
            } else if (!/[0-9]/.test(value)) {
                errorMsg = "Password must include at least one number";
            } else if (!/[^a-zA-Z0-9]/.test(value)) {
                errorMsg = "Password must include at least one special character";
            }
        }
        // Email validation
        else if (rule.type === "email" && value !== "") {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                errorMsg = "Enter a valid email address";
            }
        }
        // Numeric validation
        else if (rule.type === "numeric" && value !== "") {
            const num = parseFloat(value);
            if (isNaN(num)) {
                errorMsg = "Must be a valid number";
            } else {
                if (rule.min !== undefined && num < rule.min) {
                    errorMsg = `Must be at least ${rule.min}`;
                }
                if (rule.max !== undefined && num > rule.max) {
                    errorMsg = `Must not exceed ${rule.max}`;
                }
            }
        }
        // No-only-numbers validation
        else if (rule.noOnlyNumbers && value !== "" && /^\d+$/.test(value)) {
            errorMsg = "This field cannot contain only numbers";
        }
        // Character Limit validation
        else if (rule.charLimit && value.length > rule.charLimit) {
            errorMsg = `Cannot exceed ${rule.charLimit} characters`;
        }
        // Date/Time past/future limitations
        else if (rule.dateType && value !== "") {
            const dateVal = new Date(value);
            const today = new Date();
            // Set hours to 0 to compare dates purely
            today.setHours(0, 0, 0, 0);

            if (rule.dateType === "future" && dateVal < today) {
                errorMsg = "Date must be today or in the future";
            }
            if (rule.dateType === "past" && dateVal > today) {
                errorMsg = "Date must be today or in the past";
            }
        }

        if (errorMsg) {
            this.showFieldError(input, errorMsg);
            return false;
        } else {
            this.clearFieldValidation(input);
            return true;
        }
    }

    showFieldError(input, message) {
        input.classList.add("is-invalid");
        let feedback = input.parentElement.querySelector(".invalid-feedback");
        if (!feedback) {
            feedback = document.createElement("span");
            feedback.className = "invalid-feedback";
            input.parentElement.appendChild(feedback);
        }
        feedback.textContent = message;
        feedback.style.display = "block";
    }

    clearFieldValidation(input) {
        input.classList.remove("is-invalid");
        const feedback = input.parentElement.querySelector(".invalid-feedback");
        if (feedback) {
            feedback.style.display = "none";
        }
    }

    getFormData() {
        const data = {};
        const formData = new FormData(this.form);
        for (const [key, val] of formData.entries()) {
            data[key] = escapeHtml(val.trim()); // Sanitize HTML (XSS prevention)
        }
        return data;
    }

    // --- Auto-Save draft functionality ---
    setupAutosave() {
        this.form.querySelectorAll("input, select, textarea").forEach(input => {
            input.addEventListener("input", debounce(() => {
                const formData = this.getFormData();
                localStorage.setItem(this.autosaveKey, JSON.stringify(formData));
            }, 500));
        });
    }

    loadDraft() {
        const draftText = localStorage.getItem(this.autosaveKey);
        if (draftText) {
            try {
                const draft = JSON.parse(draftText);
                let hasData = false;

                // Check if draft has any actual content to justify restore
                Object.keys(draft).forEach(key => {
                    if (draft[key]) hasData = true;
                });

                if (hasData) {
                    // Ask if user wants to restore draft
                    setTimeout(() => {
                        createConfirmationModal(
                            "Restore Unsaved Draft?",
                            "We found an unsaved draft for this form. Would you like to restore it?",
                            () => {
                                Object.keys(draft).forEach(name => {
                                    const input = this.form.querySelector(`[name="${name}"]`);
                                    if (input && !input.hasAttribute("readonly") && !input.hasAttribute("disabled")) {
                                        input.value = draft[name];
                                        // Trigger input event to layout counters
                                        input.dispatchEvent(new Event("input"));
                                    }
                                });
                                showToast("Draft restored successfully", "success");
                            },
                            "Yes, Restore",
                            false
                        );
                    }, 300);
                }
            } catch (err) {
                console.error("Failed to parse draft", err);
            }
        }
    }

    clearDraft() {
        if (this.autosaveKey) {
            localStorage.removeItem(this.autosaveKey);
        }
    }
}
