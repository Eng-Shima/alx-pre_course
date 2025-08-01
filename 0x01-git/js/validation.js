class ResponsiveFormValidator {
    constructor(formId) {
        this.form = document.getElementById(formId);
        this.validators = {};
        this.isSubmitting = false;
        
        if (!this.form) {
            console.error('Form not found with ID:', formId);
            return;
        }
        
        this.init();
    }
    
    init() {
        this.setupValidators();
        this.bindEvents();
        this.setupResponsiveHandlers();
    }
    
    setupValidators() {
        // Full Name validator
        this.validators.fullName = {
            element: document.getElementById('fullName'),
            errorElement: document.getElementById('fullNameError'),
            rules: [
                { test: (value) => value.trim().length > 0, message: 'Full name is required' },
                { test: (value) => value.trim().length >= 2, message: 'Full name must be at least 2 characters' },
                { test: (value) => /^[a-zA-Z\s'-]+$/.test(value), message: 'Full name can only contain letters, spaces, hyphens, and apostrophes' }
            ]
        };
        
        // Email validator
        this.validators.email = {
            element: document.getElementById('email'),
            errorElement: document.getElementById('emailError'),
            rules: [
                { test: (value) => value.trim().length > 0, message: 'Email is required' },
                { test: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), message: 'Please enter a valid email address' }
            ]
        };
        
        // Phone validator
        this.validators.phone = {
            element: document.getElementById('phone'),
            errorElement: document.getElementById('phoneError'),
            rules: [
                { test: (value) => value === '' || /^[\+]?[1-9][\d]{0,15}$/.test(value.replace(/[\s\-\(\)]/g, '')), message: 'Please enter a valid phone number' }
            ]
        };
        
        // Password validator
        this.validators.password = {
            element: document.getElementById('password'),
            errorElement: document.getElementById('passwordError'),
            strengthElement: document.getElementById('passwordStrength'),
            rules: [
                { test: (value) => value.length > 0, message: 'Password is required' },
                { test: (value) => value.length >= 8, message: 'Password must be at least 8 characters long' },
                { test: (value) => /(?=.*[a-z])/.test(value), message: 'Password must contain at least one lowercase letter' },
                { test: (value) => /(?=.*[A-Z])/.test(value), message: 'Password must contain at least one uppercase letter' },
                { test: (value) => /(?=.*\d)/.test(value), message: 'Password must contain at least one number' }
            ]
        };
        
        // Confirm Password validator
        this.validators.confirmPassword = {
            element: document.getElementById('confirmPassword'),
            errorElement: document.getElementById('confirmPasswordError'),
            rules: [
                { test: (value) => value.length > 0, message: 'Please confirm your password' },
                { test: (value) => value === this.validators.password.element.value, message: 'Passwords do not match' }
            ]
        };
        
        // Age validator
        this.validators.age = {
            element: document.getElementById('age'),
            errorElement: document.getElementById('ageError'),
            rules: [
                { test: (value) => value === '' || (parseInt(value) >= 13 && parseInt(value) <= 120), message: 'Age must be between 13 and 120' }
            ]
        };
        
        // Website validator
        this.validators.website = {
            element: document.getElementById('website'),
            errorElement: document.getElementById('websiteError'),
            rules: [
                { test: (value) => value === '' || /^https?:\/\/.+\..+/.test(value), message: 'Please enter a valid URL (include http:// or https://)' }
            ]
        };
        
        // Terms validator
        this.validators.terms = {
            element: document.getElementById('terms'),
            errorElement: document.getElementById('termsError'),
            rules: [
                { test: (value, element) => element.checked, message: 'You must agree to the terms and conditions' }
            ]
        };
    }
    
    bindEvents() {
        // Real-time validation on input
        Object.keys(this.validators).forEach(key => {
            const validator = this.validators[key];
            const element = validator.element;
            
            if (element) {
                // For text inputs
                if (element.type !== 'checkbox') {
                    element.addEventListener('input', () => this.validateField(key));
                    element.addEventListener('blur', () => this.validateField(key));
                    element.addEventListener('focus', () => this.clearFieldError(key));
                } else {
                    // For checkboxes
                    element.addEventListener('change', () => this.validateField(key));
                }
                
                // Special handling for password strength
                if (key === 'password') {
                    element.addEventListener('input', () => this.updatePasswordStrength());
                }
                
                // Special handling for confirm password
                if (key === 'confirmPassword') {
                    this.validators.password.element.addEventListener('input', () => {
                        if (element.value) {
                            this.validateField('confirmPassword');
                        }
                    });
                }
            }
        });
        
        // Form submission
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Prevent double submission
        this.form.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.target.type !== 'textarea') {
                e.preventDefault();
                this.handleSubmit(e);
            }
        });
    }
    
    setupResponsiveHandlers() {
        // Handle viewport changes
        window.addEventListener('resize', this.debounce(() => {
            this.adjustValidationDisplay();
        }, 250));
        
        // Handle orientation changes on mobile
        window.addEventListener('orientationchange', () => {
            setTimeout(() => this.adjustValidationDisplay(), 500);
        });
    }
    
    validateField(fieldName) {
        const validator = this.validators[fieldName];
        if (!validator || !validator.element) return true;
        
        const element = validator.element;
        const value = element.type === 'checkbox' ? element.checked : element.value;
        const errors = [];
        
        // Run all validation rules
        validator.rules.forEach(rule => {
            if (!rule.test(value, element)) {
                errors.push(rule.message);
            }
        });
        
        // Update UI based on validation result
        if (errors.length > 0) {
            this.showFieldError(fieldName, errors[0]);
            element.classList.remove('valid');
            element.classList.add('invalid');
            return false;
        } else {
            this.clearFieldError(fieldName);
            element.classList.remove('invalid');
            if (value !== '' || element.type === 'checkbox') {
                element.classList.add('valid');
            }
            return true;
        }
    }
    
    showFieldError(fieldName, message) {
        const validator = this.validators[fieldName];
        if (validator && validator.errorElement) {
            validator.errorElement.textContent = message;
            validator.errorElement.classList.add('show');
        }
    }
    
    clearFieldError(fieldName) {
        const validator = this.validators[fieldName];
        if (validator && validator.errorElement) {
            validator.errorElement.textContent = '';
            validator.errorElement.classList.remove('show');
        }
    }
    
    updatePasswordStrength() {
        const password = this.validators.password.element.value;
        const strengthElement = this.validators.password.strengthElement;
        
        if (!password) {
            strengthElement.classList.remove('show', 'weak', 'medium', 'strong');
            return;
        }
        
        let strength = 0;
        
        // Length check
        if (password.length >= 8) strength++;
        if (password.length >= 12) strength++;
        
        // Character variety checks
        if (/[a-z]/.test(password)) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        
        strengthElement.classList.add('show');
        strengthElement.classList.remove('weak', 'medium', 'strong');
        
        if (strength <= 2) {
            strengthElement.classList.add('weak');
        } else if (strength <= 4) {
            strengthElement.classList.add('medium');
        } else {
            strengthElement.classList.add('strong');
        }
    }
    
    validateAllFields() {
        let isValid = true;
        
        Object.keys(this.validators).forEach(fieldName => {
            if (!this.validateField(fieldName)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        
        if (this.isSubmitting) return;
        
        const isValid = this.validateAllFields();
        
        if (!isValid) {
            this.focusFirstError();
            return;
        }
        
        this.isSubmitting = true;
        this.showLoading(true);
        
        try {
            // Simulate API call
            await this.simulateSubmission();
            this.showSuccess();
        } catch (error) {
            this.showSubmissionError(error.message);
        } finally {
            this.isSubmitting = false;
            this.showLoading(false);
        }
    }
    
    focusFirstError() {
        const firstErrorField = Object.keys(this.validators).find(fieldName => {
            const validator = this.validators[fieldName];
            return validator.element && validator.element.classList.contains('invalid');
        });
        
        if (firstErrorField) {
            const element = this.validators[firstErrorField].element;
            element.focus();
            
            // Smooth scroll to element on mobile
            if (window.innerWidth <= 768) {
                element.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
            }
        }
    }
    
    showLoading(show) {
        const submitBtn = document.getElementById('submitBtn');
        const btnLoader = document.getElementById('btnLoader');
        
        if (show) {
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
        } else {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    }
    
    async simulateSubmission() {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Simulate random success/failure for demo
        if (Math.random() > 0.1) { // 90% success rate
            return Promise.resolve();
        } else {
            throw new Error('Network error. Please try again.');
        }
    }
    
    showSuccess() {
        const successMessage = document.getElementById('successMessage');
        successMessage.classList.add('show');
        
        // Reset form after success
        setTimeout(() => {
            this.resetForm();
            successMessage.classList.remove('show');
        }, 3000);
    }
    
    showSubmissionError(message) {
        // You could implement a toast notification or modal here
        alert('Submission failed: ' + message);
    }
    
    resetForm() {
        this.form.reset();
        
        // Clear all validation states
        Object.keys(this.validators).forEach(fieldName => {
            const validator = this.validators[fieldName];
            if (validator.element) {
                validator.element.classList.remove('valid', 'invalid');
                this.clearFieldError(fieldName);
            }
        });
        
        // Hide password strength indicator
        const strengthElement = this.validators.password.strengthElement;
        if (strengthElement) {
            strengthElement.classList.remove('show', 'weak', 'medium', 'strong');
        }
    }
    
    adjustValidationDisplay() {
        const isMobile = window.innerWidth <= 768;
        
        // Adjust error message positioning on mobile
        Object.keys(this.validators).forEach(fieldName => {
            const validator = this.validators[fieldName];
            if (validator.errorElement) {
                if (isMobile) {
                    validator.errorElement.style.fontSize = '11px';
                } else {
                    validator.errorElement.style.fontSize = '12px';
                }
            }
        });
    }
    
    // Utility function to debounce resize events
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Initialize the validator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const validator = new ResponsiveFormValidator('validationForm');
    
    // Make validator globally accessible for debugging
    window.formValidator = validator;
    
    // Add some helpful console messages
    console.log('Responsive Form Validator initialized');
    console.log('Available methods:', Object.getOwnPropertyNames(ResponsiveFormValidator.prototype));
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ResponsiveFormValidator;
}