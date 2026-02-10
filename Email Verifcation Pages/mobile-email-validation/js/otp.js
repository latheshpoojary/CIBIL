/**
 * OTP Verification JavaScript
 * Handles OTP input, validation, and step progression
 */

document.addEventListener('DOMContentLoaded', function() {
    const otpMobileContainer = document.getElementById('otp-mobile-container');
    const otpEmailContainer = document.getElementById('otp-email-container');
    const mainContainer = document.querySelector('.otp-main-container');
    const contentArea = document.querySelector('.otp-content-area');
    const pageSubtitle = document.querySelector('.otp-page-subtitle');

    // Check URL for state - email-unverified = email only, mobile-unverified = mobile only
    const urlParams = new URLSearchParams(window.location.search);
    const state = urlParams.get('state') || urlParams.get('mode');
    const isEmailOnly = state === 'email-unverified' || state === 'mobile-already-verified' || state === 'mobile-verified-alternative-email';
    const isMobileOnly = state === 'mobile-unverified' || state === 'email-already-verified' || state === 'email-verified-alternative-mobile';

    if (isEmailOnly) {
        // Email only: hide mobile, show only email (per Figma)
        if (otpMobileContainer) {
            otpMobileContainer.style.display = 'none';
        }
        if (otpEmailContainer) {
            otpEmailContainer.style.display = '';
            otpEmailContainer.classList.remove('otp-step-collapsed');
            const emailDetails = otpEmailContainer.querySelector('.otp-step-details');
            if (emailDetails) emailDetails.style.display = 'flex';
            const emailHeader = otpEmailContainer.querySelector('.otp-step-header');
            if (emailHeader) emailHeader.classList.remove('otp-step-header-collapsed');
            const stepNumber = otpEmailContainer.querySelector('.otp-step-number-container');
            if (stepNumber) stepNumber.classList.add('otp-step-active');
        }
        if (mainContainer) {
            mainContainer.classList.add('single-step');
        }
        if (contentArea) {
            contentArea.classList.add('single-step');
        }
        if (pageSubtitle) {
            pageSubtitle.textContent = 'We have sent an OTP to your registered email address to verify that this detail belongs to you.';
        }
    } else if (isMobileOnly) {
        // Mobile only: hide email, show only mobile (per Figma)
        if (otpEmailContainer) {
            otpEmailContainer.style.display = 'none';
        }
        if (otpMobileContainer) {
            otpMobileContainer.style.display = '';
        }
        if (mainContainer) {
            mainContainer.classList.add('single-step');
        }
        if (contentArea) {
            contentArea.classList.add('single-step');
        }
        if (pageSubtitle) {
            pageSubtitle.textContent = 'We have sent an OTP to your registered mobile number to verify that this detail belongs to you.';
        }
    }

    // Initialize OTP inputs for both sections
    initializeOTPInputs(otpMobileContainer);
    initializeOTPInputs(otpEmailContainer);

    // Initialize verify buttons
    initializeVerifyButtons();

    // Initialize timers
    initializeTimers();

    // NOTE: initializeVerifiedState() was removed from here.
    // The verified state is now set automatically when OTP is verified via verifyOTP().
    // To test the final verified UI, uncomment the line below:
    // initializeVerifiedState();
});

/**
 * Initialize OTP input fields for a container
 */
function initializeOTPInputs(container) {
    if (!container) return;

    const otpInputs = container.querySelectorAll('.otp-input-field');
    
    otpInputs.forEach((input, index) => {
        // Only allow numeric input
        input.addEventListener('input', function(e) {
            // Remove any non-numeric characters
            this.value = this.value.replace(/[^0-9]/g, '');
            
            if (this.value.length >= 1) {
                // Move to next input if available
                if (index < otpInputs.length - 1) {
                    otpInputs[index + 1].focus();
                } else {
                    // Last input filled, blur to trigger validation
                    this.blur();
                }
            }
            
            // Check if all inputs in this section are filled
            checkOTPComplete(container);
        });

        // Handle paste event
        input.addEventListener('paste', function(e) {
            e.preventDefault();
            const pastedData = (e.clipboardData || window.clipboardData).getData('text');
            const digits = pastedData.replace(/[^0-9]/g, '').slice(0, otpInputs.length);
            
            // Fill inputs with pasted digits
            digits.split('').forEach((digit, idx) => {
                if (otpInputs[index + idx]) {
                    otpInputs[index + idx].value = digit;
                }
            });
            
            // Focus the next empty input or last input
            const nextEmptyIndex = digits.length < otpInputs.length ? index + digits.length : otpInputs.length - 1;
            if (otpInputs[nextEmptyIndex]) {
                otpInputs[nextEmptyIndex].focus();
            }
            
            checkOTPComplete(container);
        });

        // Handle backspace
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Backspace' && this.value.length === 0) {
                // Move to previous input and clear it
                if (index > 0) {
                    otpInputs[index - 1].focus();
                    otpInputs[index - 1].value = '';
                    checkOTPComplete(container);
                }
            }
        });

        // Handle arrow keys
        input.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowLeft' && index > 0) {
                e.preventDefault();
                otpInputs[index - 1].focus();
            } else if (e.key === 'ArrowRight' && index < otpInputs.length - 1) {
                e.preventDefault();
                otpInputs[index + 1].focus();
            }
        });
    });
}

/**
 * Helper function to find the verify button (desktop or mobile)
 * Returns all buttons found so we can enable/disable both
 */
function findVerifyButtons(container) {
    if (!container) return [];
    
    const buttons = [];
    
    // Find desktop button inside field-wrapper
    const fieldWrapper = container.querySelector('.otp-field-wrapper');
    if (fieldWrapper) {
        const desktopBtn = fieldWrapper.querySelector('.otp-verify-button-desktop');
        if (desktopBtn) {
            buttons.push(desktopBtn);
        }
    }
    
    // Find mobile button outside in step-details (sibling of field-wrapper)
    const stepDetails = container.querySelector('.otp-step-details');
    if (stepDetails) {
        // Mobile button is a direct child of step-details, sibling of field-wrapper
        const mobileBtn = stepDetails.querySelector('.otp-verify-button-mobile');
        if (mobileBtn) {
            buttons.push(mobileBtn);
        }
    }
    
    // Fallback: try generic selector if no specific buttons found
    if (buttons.length === 0) {
        const genericBtn = container.querySelector('.otp-verify-button');
        if (genericBtn) {
            buttons.push(genericBtn);
        }
    }
    
    return buttons;
}

/**
 * Check if OTP is complete and enable verify button
 */
function checkOTPComplete(container) {
    if (!container) return;

    const inputs = container.querySelectorAll('.otp-input-field');
    const verifyButtons = findVerifyButtons(container);
    
    if (verifyButtons.length === 0) return;

    const allFilled = Array.from(inputs).every(inp => inp.value.length === 1);
    
    // Enable/disable all buttons (desktop and mobile)
    verifyButtons.forEach(verifyBtn => {
        if (allFilled) {
            verifyBtn.classList.remove('otp-verify-button-disabled');
            verifyBtn.disabled = false;
        } else {
            verifyBtn.classList.add('otp-verify-button-disabled');
            verifyBtn.disabled = true;
        }
    });
}

/**
 * Initialize verify buttons
 */
function initializeVerifyButtons() {
    const verifyButtons = document.querySelectorAll('.otp-verify-button');
    
    verifyButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.classList.contains('otp-verify-button-disabled') || this.disabled) {
                return;
            }
            
            const container = this.closest('.otp-step-section');
            const inputs = container.querySelectorAll('.otp-input-field');
            const otp = Array.from(inputs).map(inp => inp.value).join('');
            
            console.log('Verifying OTP:', otp);
            
            // Simulate verification (replace with actual API call)
            verifyOTP(container, otp);
        });
    });
}

/**
 * Verify OTP (simulate API call)
 */
function verifyOTP(container, otp) {
    const verifyButtons = findVerifyButtons(container);
    
    // Disable all buttons during verification
    verifyButtons.forEach(verifyBtn => {
        verifyBtn.disabled = true;
        verifyBtn.textContent = 'VERIFYING...';
    });

    // Simulate API call
    setTimeout(() => {
        // For demo purposes, accept any 6-digit OTP
        // In production, replace with actual API call
        const isValid = otp.length === 6 && /^\d{6}$/.test(otp);
        
        if (isValid) {
            // Mark as verified
            container.classList.add('otp-step-verified');
            const stepNumber = container.querySelector('.otp-step-number-container');
            if (stepNumber) {
                stepNumber.classList.add('otp-step-active');
            }
            
            // Handle Step 1 (Mobile) and Step 2 (Email) differently
            if (container.id === 'otp-mobile-container') {
                // Step 1: Hide fields, show badge in header
                const fieldWrapper = container.querySelector('.otp-field-wrapper');
                if (fieldWrapper) {
                    fieldWrapper.style.display = 'none';
                }
                const resendWrapper = container.querySelector('.otp-resend-wrapper');
                if (resendWrapper) {
                    resendWrapper.style.display = 'none';
                }
                const infoText = container.querySelector('.otp-step-info');
                if (infoText) {
                    infoText.style.display = 'none';
                }
                
                // Hide all verify buttons (desktop and mobile) after verification
                verifyButtons.forEach(btn => {
                    btn.style.display = 'none';
                    btn.style.visibility = 'hidden';
                    btn.classList.add('otp-button-verified-hidden');
                });
                
                // Also hide mobile button outside field-wrapper (in step-details)
                const stepDetails = container.querySelector('.otp-step-details');
                if (stepDetails) {
                    const mobileBtn = stepDetails.querySelector('.otp-verify-button-mobile');
                    if (mobileBtn) {
                        mobileBtn.style.display = 'none';
                        mobileBtn.style.visibility = 'hidden';
                        mobileBtn.classList.add('otp-button-verified-hidden');
                    }
                    // Also hide any other verify buttons in step-details
                    const allButtons = stepDetails.querySelectorAll('.otp-verify-button');
                    allButtons.forEach(btn => {
                        btn.style.display = 'none';
                        btn.style.visibility = 'hidden';
                        btn.classList.add('otp-button-verified-hidden');
                    });
                }
                
                // Hide desktop button in field-wrapper (even if field-wrapper is hidden)
                if (fieldWrapper) {
                    const desktopBtn = fieldWrapper.querySelector('.otp-verify-button-desktop');
                    if (desktopBtn) {
                        desktopBtn.style.display = 'none';
                        desktopBtn.style.visibility = 'hidden';
                        desktopBtn.classList.add('otp-button-verified-hidden');
                    }
                    // Also hide any buttons in field-wrapper
                    const fieldButtons = fieldWrapper.querySelectorAll('.otp-verify-button');
                    fieldButtons.forEach(btn => {
                        btn.style.display = 'none';
                        btn.style.visibility = 'hidden';
                        btn.classList.add('otp-button-verified-hidden');
                    });
                }
                
                // Final check: hide ALL verify buttons in the container
                const allContainerButtons = container.querySelectorAll('.otp-verify-button');
                allContainerButtons.forEach(btn => {
                    btn.style.display = 'none';
                    btn.style.visibility = 'hidden';
                    btn.classList.add('otp-button-verified-hidden');
                });
                
                // Show verified badge in header
                let verifiedBadge = container.querySelector('.otp-verified-badge');
                if (!verifiedBadge) {
                    verifiedBadge = document.createElement('div');
                    verifiedBadge.className = 'otp-verified-badge';
                    verifiedBadge.innerHTML = `
                        <div class="otp-verified-icon">✓</div>
                        <span class="otp-verified-text">VERIFIED</span>
                    `;
                    const stepHeader = container.querySelector('.otp-step-header');
                    if (stepHeader) {
                        stepHeader.appendChild(verifiedBadge);
                    }
                }
                verifiedBadge.style.display = 'flex';
                
                // Expand email section
                expandEmailSection();
            } else if (container.id === 'otp-email-container') {
                // Step 2: Show info text, show filled fields with badge next to them
                const infoText = container.querySelector('.otp-step-info');
                if (infoText) {
                    infoText.style.display = 'block';
                }
                
                // Make OTP inputs read-only and styled as verified
                const inputs = container.querySelectorAll('.otp-input-field');
                inputs.forEach(input => {
                    input.disabled = true;
                    input.classList.add('otp-input-verified');
                });
                
                // Hide verify button
                // Hide all verify buttons
                const verifyButtons = findVerifyButtons(container);
                verifyButtons.forEach(btn => {
                    btn.style.display = 'none';
                });
                
                // Hide resend wrapper
                const resendWrapper = container.querySelector('.otp-resend-wrapper');
                if (resendWrapper) {
                    resendWrapper.style.display = 'none';
                }
                
                // Show verified badge - append to header for mobile (same line as heading)
                let verifiedBadge = container.querySelector('.otp-verified-badge-step2');
                if (!verifiedBadge) {
                    verifiedBadge = document.createElement('div');
                    verifiedBadge.className = 'otp-verified-badge otp-verified-badge-step2';
                    verifiedBadge.innerHTML = `
                        <div class="otp-verified-icon">✓</div>
                        <span class="otp-verified-text">VERIFIED</span>
                    `;
                    // Append to header for mobile (same line as heading)
                    const stepHeader = container.querySelector('.otp-step-header');
                    if (stepHeader) {
                        stepHeader.appendChild(verifiedBadge);
                    }
                }
                verifiedBadge.style.display = 'flex';
            }
        } else {
            // Show error
            showOTPError(container, 'The OTP entered is incorrect. Please try again.');
            
            // Re-enable button
            if (verifyBtn) {
                verifyBtn.disabled = false;
                verifyBtn.textContent = 'VERIFY OTP';
            }
            
            // Clear inputs and focus first
            const inputs = container.querySelectorAll('.otp-input-field');
            inputs.forEach((inp, idx) => {
                inp.value = '';
                inp.classList.add('otp-input-error');
                if (idx === 0) {
                    setTimeout(() => inp.focus(), 100);
                }
            });
            
            // Remove error class after animation
            setTimeout(() => {
                inputs.forEach(inp => inp.classList.remove('otp-input-error'));
            }, 2000);
        }
    }, 1000);
}

/**
 * Show OTP error message
 */
function showOTPError(container, message) {
    // Remove existing error message
    const existingError = container.querySelector('.otp-error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Create error message
    const errorMsg = document.createElement('p');
    errorMsg.className = 'otp-error-message';
    errorMsg.textContent = message;
    
    // Insert after OTP input group
    const inputGroup = container.querySelector('.otp-input-group');
    if (inputGroup) {
        inputGroup.parentNode.insertBefore(errorMsg, inputGroup.nextSibling);
    }
}

/**
 * Expand email section
 */
function expandEmailSection() {
    const otpEmailContainer = document.getElementById('otp-email-container');
    if (!otpEmailContainer) return;
    
    otpEmailContainer.classList.remove('otp-step-collapsed');
    const emailDetails = otpEmailContainer.querySelector('.otp-step-details');
    if (emailDetails) {
        emailDetails.style.display = 'flex';
    }
    const emailHeader = otpEmailContainer.querySelector('.otp-step-header');
    if (emailHeader) {
        emailHeader.classList.remove('otp-step-header-collapsed');
    }
    const stepNumber = otpEmailContainer.querySelector('.otp-step-number-container');
    if (stepNumber) {
        stepNumber.classList.add('otp-step-active');
    }
    
    // Add step line if it doesn't exist
    const stepIndicator = otpEmailContainer.querySelector('.otp-step-indicator-column');
    if (stepIndicator && !stepIndicator.querySelector('.otp-step-line')) {
        const stepLine = document.createElement('div');
        stepLine.className = 'otp-step-line';
        stepIndicator.appendChild(stepLine);
    }
    
    // Focus first email OTP input
    const firstEmailInput = otpEmailContainer.querySelector('.otp-input-field');
    if (firstEmailInput) {
        setTimeout(() => firstEmailInput.focus(), 300);
    }
}

/**
 * Initialize countdown timers
 */
function initializeTimers() {
    const timers = document.querySelectorAll('.otp-timer');
    
    timers.forEach(timer => {
        let seconds = 30; // Start with 30 seconds
        
        const updateTimer = () => {
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            timer.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
            
            if (seconds > 0) {
                seconds--;
                setTimeout(updateTimer, 1000);
            } else {
                // Timer finished, show resend link
                const resendWrapper = timer.closest('.otp-resend-wrapper');
                if (resendWrapper) {
                    resendWrapper.innerHTML = '<span class="otp-resend-text">Did not receive OTP?</span><span class="otp-resend-link">Resend OTP</span>';
                    
                    const resendLink = resendWrapper.querySelector('.otp-resend-link');
                    if (resendLink) {
                        resendLink.addEventListener('click', function() {
                            // Reset timer
                            seconds = 30;
                            resendWrapper.innerHTML = '<span class="otp-resend-text">Resend OTP in</span><span class="otp-timer">00:30</span>';
                            initializeTimers(); // Re-initialize timer
                            
                            // Clear OTP inputs
                            const container = resendWrapper.closest('.otp-step-section');
                            if (container) {
                                const inputs = container.querySelectorAll('.otp-input-field');
                                inputs.forEach(inp => {
                                    inp.value = '';
                                    inp.disabled = false;
                                });
                                if (inputs[0]) inputs[0].focus();
                                checkOTPComplete(container);
                            }
                            
                            console.log('Resending OTP...');
                            // Add API call here to resend OTP
                        });
                    }
                }
            }
        };
        
        updateTimer();
    });
}

/**
 * Initialize verified state for both steps (final state)
 */
function initializeVerifiedState() {
    const otpMobileContainer = document.getElementById('otp-mobile-container');
    const otpEmailContainer = document.getElementById('otp-email-container');

    // Step 1: Mobile OTP - Verified (hide fields, show badge in header)
    if (otpMobileContainer) {
        otpMobileContainer.classList.add('otp-step-verified');
        const stepNumber = otpMobileContainer.querySelector('.otp-step-number-container');
        if (stepNumber) {
            stepNumber.classList.add('otp-step-active');
        }
        
        // Hide OTP fields and resend timer
        const fieldWrapper = otpMobileContainer.querySelector('.otp-field-wrapper');
        if (fieldWrapper) {
            fieldWrapper.style.display = 'none';
        }
        const resendWrapper = otpMobileContainer.querySelector('.otp-resend-wrapper');
        if (resendWrapper) {
            resendWrapper.style.display = 'none';
        }
        const infoText = otpMobileContainer.querySelector('.otp-step-info');
        if (infoText) {
            infoText.style.display = 'none';
        }
        
        // Show verified badge in header
        let verifiedBadge = otpMobileContainer.querySelector('.otp-verified-badge');
        if (!verifiedBadge) {
            verifiedBadge = document.createElement('div');
            verifiedBadge.className = 'otp-verified-badge';
            verifiedBadge.innerHTML = `
                <div class="otp-verified-icon">✓</div>
                <span class="otp-verified-text">VERIFIED</span>
            `;
            const stepHeader = otpMobileContainer.querySelector('.otp-step-header');
            if (stepHeader) {
                stepHeader.appendChild(verifiedBadge);
            }
        }
        verifiedBadge.style.display = 'flex';
    }

    // Step 2: Email OTP - Verified (show filled fields, badge in header)
    if (otpEmailContainer) {
        otpEmailContainer.classList.add('otp-step-verified');
        otpEmailContainer.classList.remove('otp-step-collapsed');
        
        const stepNumber = otpEmailContainer.querySelector('.otp-step-number-container');
        if (stepNumber) {
            stepNumber.classList.add('otp-step-active');
        }
        
        // Expand email section
        const emailDetails = otpEmailContainer.querySelector('.otp-step-details');
        if (emailDetails) {
            emailDetails.style.display = 'flex';
        }
        const emailHeader = otpEmailContainer.querySelector('.otp-step-header');
        if (emailHeader) {
            emailHeader.classList.remove('otp-step-header-collapsed');
        }
        
        // Fill OTP fields with sample data "502152"
        const emailInputs = otpEmailContainer.querySelectorAll('.otp-input-field');
        const sampleOTP = '502152';
        emailInputs.forEach((input, index) => {
            if (index < sampleOTP.length) {
                input.value = sampleOTP[index];
                input.disabled = true;
                input.classList.add('otp-input-verified');
            }
        });
        
        // Keep email info text visible (don't hide it)
        const infoText = otpEmailContainer.querySelector('.otp-step-info');
        if (infoText) {
            infoText.style.display = 'block';
        }
        
        // Hide verify button and resend timer
        const verifyButtons = findVerifyButtons(otpEmailContainer);
        verifyButtons.forEach(btn => {
            btn.style.display = 'none';
        });
        const resendWrapper = otpEmailContainer.querySelector('.otp-resend-wrapper');
        if (resendWrapper) {
            resendWrapper.style.display = 'none';
        }
        
        // Show verified badge next to OTP fields but vertically aligned with Step 1's badge
        let verifiedBadge = otpEmailContainer.querySelector('.otp-verified-badge-step2');
        if (!verifiedBadge) {
            verifiedBadge = document.createElement('div');
            verifiedBadge.className = 'otp-verified-badge otp-verified-badge-step2';
            verifiedBadge.innerHTML = `
                <div class="otp-verified-icon">✓</div>
                <span class="otp-verified-text">VERIFIED</span>
            `;
            // Append to step-content-wrapper for absolute positioning relative to it
            const stepContentWrapper = otpEmailContainer.querySelector('.otp-step-content-wrapper');
            if (stepContentWrapper) {
                stepContentWrapper.appendChild(verifiedBadge);
            }
        }
        verifiedBadge.style.display = 'flex';
    }
}
