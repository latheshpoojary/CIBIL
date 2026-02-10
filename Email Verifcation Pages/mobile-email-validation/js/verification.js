// Helper functions to show/hide error messages
function showError(fieldName, errorMessage) {
    const row = document.getElementById(`row-${fieldName}`);
    if (!row) return;

    const errorElement = row.querySelector('.error-message');
    const input = row.querySelector('.info-value');
    const container = row.querySelector('.info-value-container');

    if (errorElement) {
        const errorText = errorElement.querySelector('.error-message-text');
        if (errorText && errorMessage) {
            errorText.textContent = errorMessage;
        }
        errorElement.classList.remove('error-message--hidden');
    }

    // Add error class to input and container
    if (input) {
        input.classList.add('error');
    }
    if (container) {
        container.classList.add('error');
    }
    row.classList.add('error');
}

function hideError(fieldName) {
    const row = document.getElementById(`row-${fieldName}`);
    if (!row) return;

    const errorElement = row.querySelector('.error-message');
    const input = row.querySelector('.info-value');
    const container = row.querySelector('.info-value-container');

    if (errorElement) {
        errorElement.classList.add('error-message--hidden');
    }

    // Remove error class from input and container
    if (input) {
        input.classList.remove('error');
    }
    if (container) {
        container.classList.remove('error');
    }
    row.classList.remove('error');
}

// Conflict handling functions
function showConflictWarning(type, message) {
    const conflictWarning = document.getElementById('conflict-warning');
    const conflictText = document.getElementById('conflict-warning-text');
    const pageSubtitle = document.getElementById('page-subtitle');
    
    if (conflictWarning && conflictText) {
        const warningMessage = message || getDefaultConflictMessage(type);
        // Support multi-line messages (CSS white-space: pre-line handles line breaks)
        conflictText.textContent = warningMessage;
        conflictWarning.classList.remove('conflict-warning--hidden');
    }
    
    // Hide or update subtitle when conflict is shown
    if (pageSubtitle) {
        pageSubtitle.style.display = 'none';
    }
}

function hideConflictWarning() {
    const conflictWarning = document.getElementById('conflict-warning');
    const pageSubtitle = document.getElementById('page-subtitle');
    
    if (conflictWarning) {
        conflictWarning.classList.add('conflict-warning--hidden');
    }
    
    // Show subtitle again when conflict is hidden
    if (pageSubtitle) {
        pageSubtitle.style.display = 'block';
    }
}

function getDefaultConflictMessage(type) {
    if (type === 'mobile') {
        return 'This mobile number is already registered with another account. Please use a different mobile number or email ID.';
    } else if (type === 'email') {
        return 'This email ID is already registered with another account. Please use a different email ID or mobile number.';
    }
    return 'This contact detail is already registered with another account. Please use a different contact detail.';
}

function showAlternativeError(fieldName, errorMessage) {
    const row = document.getElementById(`row-${fieldName}`);
    if (!row) return;
    const errorElement = row.querySelector('.error-message');
    const input = row.querySelector('.info-value, input');
    const container = row.querySelector('.info-value-container');
    if (errorElement) {
        const errorText = errorElement.querySelector('.error-message-text');
        if (errorText && errorMessage) errorText.textContent = errorMessage;
        errorElement.classList.remove('error-message--hidden');
    }
    if (input) input.classList.add('error');
    if (container) container.classList.add('error');
}

function hideAlternativeError(fieldName) {
    const row = document.getElementById(`row-${fieldName}`);
    if (!row) return;
    const errorElement = row.querySelector('.error-message');
    const input = row.querySelector('.info-value, input');
    const container = row.querySelector('.info-value-container');
    if (errorElement) errorElement.classList.add('error-message--hidden');
    if (input) input.classList.remove('error');
    if (container) container.classList.remove('error');
}

function setConflictState(fieldName, isConflict) {
    if (isConflict) {
        const conflictMessage = getDefaultConflictMessage(fieldName);
        showConflictWarning(fieldName, conflictMessage);
        showError(fieldName, conflictMessage);
    } else {
        hideConflictWarning();
        hideError(fieldName);
    }
}

// Make functions globally available
window.showError = showError;
window.hideError = hideError;
window.showAlternativeError = showAlternativeError;
window.hideAlternativeError = hideAlternativeError;
window.showConflictWarning = showConflictWarning;
window.hideConflictWarning = hideConflictWarning;
window.setConflictState = setConflictState;

document.addEventListener('DOMContentLoaded', function() {
    const sendOtpBtn = document.getElementById('send-otp-btn');

    // Edit / Cancel toggle
    document.querySelectorAll('.edit-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const container = this.closest('.info-value-container');
            const input = container.querySelector('.info-value');
            const isCancel = this.classList.contains('edit-link--cancel');
            const row = this.closest('.info-row');
            const disclaimer = row ? row.querySelector('.edit-disclaimer') : null;

            if (isCancel) {
                // Cancel: disable input, revert to Edit button
                if (input) {
                    input.setAttribute('disabled', 'disabled');
                }
                this.classList.remove('edit-link--cancel');
                this.innerHTML = '<img src="./images/edit_icon.svg" class="edit-icon" alt=""><span class="edit-link-text">Edit</span>';

                // Hide disclaimer
                if (disclaimer) {
                    disclaimer.classList.add('edit-disclaimer--hidden');
                }

                // Hide error message when canceling
                const fieldName = row ? row.id.replace('row-', '') : null;
                if (fieldName) {
                    hideError(fieldName);
                }
            } else {
                // Edit: enable input, switch to Cancel button
                if (input) {
                    input.removeAttribute('disabled');
                    input.focus();
                    const val = input.value;
                    input.value = '';
                    input.value = val;
                }
                this.classList.add('edit-link--cancel');
                this.innerHTML = 'Cancel';

                // Show disclaimer
                if (disclaimer) {
                    disclaimer.classList.remove('edit-disclaimer--hidden');
                }
            }
        });
    });

    // Send OTP button - validate alternative fields if shown, then redirect
    if (sendOtpBtn) {
        sendOtpBtn.addEventListener('click', function() {
            const state = this.dataset.state || '';
            const rowAltEmail = document.getElementById('row-alternative-email');
            const rowAltMobile = document.getElementById('row-alternative-mobile');
            const altEmailInput = document.getElementById('alternative-email-input');
            const altMobileInput = document.getElementById('alternative-mobile-input');
            let valid = true;

            hideAlternativeError('alternative-email');
            hideAlternativeError('alternative-mobile');

            // Validate alternative email if visible
            if (rowAltEmail && !rowAltEmail.classList.contains('info-row--hidden')) {
                const val = (altEmailInput && altEmailInput.value || '').trim();
                if (!val) {
                    showAlternativeError('alternative-email', 'Please enter a valid email address.');
                    valid = false;
                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
                    showAlternativeError('alternative-email', 'Please enter a valid email address.');
                    valid = false;
                }
            }

            // Validate alternative mobile if visible
            if (rowAltMobile && !rowAltMobile.classList.contains('info-row--hidden')) {
                const val = (altMobileInput && altMobileInput.value || '').trim().replace(/\D/g, '');
                if (!val || val.length !== 10) {
                    showAlternativeError('alternative-mobile', 'Please enter a valid 10-digit mobile number.');
                    valid = false;
                }
            }

            if (!valid) return;

            const url = state ? `otp.html?state=${state}` : 'otp.html';
            console.log("OTP Sent. Redirecting to OTP verification page.");
            window.location.href = url;
        });
    }
});
