document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('signup-form');

    const inputs = {
        firstName: document.getElementById('firstName'),
        lastName: document.getElementById('lastName'),
        displayName: document.getElementById('displayName'),
        email: document.getElementById('email'),
        password: document.getElementById('password'),
        confirmPassword: document.getElementById('confirmPassword')
    };

    const submitBtn = document.getElementById('submitBtn');
    const successMessage = document.querySelector('.success-message');
    const passwordStrengthMeter = document.getElementById('password-strength');
    const passwordStrengthText = document.querySelector('.password-strength-text');

    // Toggle password visibility
    document.querySelectorAll('.toggle-password').forEach(btn => {
        btn.addEventListener('click', () => {
            const target = document.getElementById(btn.dataset.target);
            if (target.type === 'password') {
                target.type = 'text';
                btn.textContent = 'Hide';
            } else {
                target.type = 'password';
                btn.textContent = 'Show';
            }
        });
    });

    // Validation events
    Object.values(inputs).forEach(input => {
        input.addEventListener('input', () => {
            if (input.id === 'firstName' || input.id === 'lastName') {
                autoFillDisplayName();
                validateInput(inputs.displayName);
            }

            validateInput(input);
            updateSubmitState();

            if (input.id === 'password') {
                updatePasswordStrength(input.value);
            }
        });
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let isFormValid = true;
        Object.values(inputs).forEach(inp => {
            if (!validateInput(inp)) {
                isFormValid = false;
            }
        });

        if (isFormValid) {
            successMessage.hidden = false;
            form.reset();
            Object.values(inputs).forEach(inp => {
                const container = getContainer(inp);
                container.classList.remove('success');
            });
            passwordStrengthMeter.value = 0;
            passwordStrengthText.textContent = '';
            submitBtn.disabled = true;
        }
    });

    function validateInput(input) {
        const container = getContainer(input);
        const errorMsg = container.querySelector('small:last-of-type');
        let valid = true;

        switch (input.id) {
            case 'firstName':
            case 'lastName':
            case 'displayName':
                if (input.value.trim() === '') {
                    showError('This field is required');
                } else if (!/^[A-Za-z\s\'-]{2,}$/.test(input.value.trim())) {
                    showError('Only letters, min 2 chars');
                } else {
                    showSuccess();
                }
                break;
            case 'email':
                if (input.value.trim() === '') {
                    showError('Email is required');
                } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/i.test(input.value.trim())) {
                    showError('Email is invalid');
                } else {
                    showSuccess();
                }
                break;
            case 'password':
                if (input.value.trim() === '') {
                    showError('Password is required');
                } else if (input.value.length < 8) {
                    showError('At least 8 characters');
                } else {
                    showSuccess();
                }
                break;
            case 'confirmPassword':
                if (input.value.trim() === '') {
                    showError('Please confirm password');
                } else if (input.value !== inputs.password.value) {
                    showError('Passwords do not match');
                } else {
                    showSuccess();
                }
                break;
            default:
                break;
        }

        function showError(message) {
            container.classList.add('error');
            container.classList.remove('success');
            errorMsg.textContent = message;
            valid = false;
        }

        function showSuccess() {
            container.classList.remove('error');
            container.classList.add('success');
            errorMsg.textContent = '';
        }

        return valid;
    }

    function updateSubmitState() {
        const hasError = Object.values(inputs).some(inp => {
            const container = getContainer(inp);
            return container.classList.contains('error') || inp.value.trim() === '';
        });

        submitBtn.disabled = hasError;
    }

    function updatePasswordStrength(value) {
        let strength = 0;

        if (value.length >= 8) strength++;
        if (/[A-Z]/.test(value)) strength++;
        if (/[0-9]/.test(value)) strength++;
        if (/[^A-Za-z0-9]/.test(value)) strength++;

        passwordStrengthMeter.value = strength;
        const levels = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong'];
        passwordStrengthText.textContent = levels[strength];

        // Update meter color class
        passwordStrengthMeter.className = '';
        passwordStrengthMeter.classList.add(`strength-${strength}`);
    }

    function autoFillDisplayName() {
        const first = inputs.firstName.value.trim();
        const last = inputs.lastName.value.trim();
        inputs.displayName.value = `${first} ${last}`.trim();
    }

    function getContainer(input) {
        // For nested inputs inside password wrapper
        if (input.parentElement.classList.contains('form-control')) {
            return input.parentElement;
        }
        return input.parentElement.parentElement;
    }
}); 