/**
 * Review Page Config Loader
 * Loads config from JSON and applies "both unverified, no conflict" state by default
 */

let reviewConfig = null;

async function loadReviewConfig() {
    try {
        const response = await fetch('./data/review-config.json');
        if (!response.ok) {
            throw new Error(`Failed to load config: ${response.statusText}`);
        }
        reviewConfig = await response.json();
        return reviewConfig;
    } catch (error) {
        console.error('Error loading review config:', error);
        reviewConfig = {
            defaultState: 'both-unverified-no-conflict',
            states: {
                'both-unverified-no-conflict': {
                    id: 'both-unverified-no-conflict',
                    name: 'Both Unverified, No Conflict',
                    title: 'Review Your Contact Details',
                    subtitle: 'To ensure your security, we need to verify your email address and mobile number through different OTPs. Please confirm these details, as they cannot be modified later.',
                    showConflictWarning: false,
                    showAlternativeEmail: false,
                    showAlternativeMobile: false,
                    showMobileRow: true,
                    showEmailRow: true,
                    mobile: { number: '9879879870' },
                    email: { address: 'johndoe@example.com' }
                },
                'email-unverified': {
                    id: 'email-unverified',
                    name: 'Email Unverified',
                    title: 'Review Your Contact Details',
                    subtitle: 'To ensure your security, we need to verify your email address through an OTP. Please confirm these details, as they cannot be modified later.',
                    showConflictWarning: false,
                    showAlternativeEmail: false,
                    showAlternativeMobile: false,
                    showMobileRow: false,
                    showEmailRow: true,
                    mobile: { number: '9879879870' },
                    email: { address: 'johndoe@example.com' }
                },
                'mobile-unverified': {
                    id: 'mobile-unverified',
                    name: 'Mobile Unverified',
                    title: 'Review Your Contact Details',
                    subtitle: 'To ensure your security, we need to verify your mobile number through an OTP. Please confirm these details, as they cannot be modified later.',
                    showConflictWarning: false,
                    showAlternativeEmail: false,
                    showAlternativeMobile: false,
                    showMobileRow: true,
                    showEmailRow: false,
                    mobile: { number: '9879879870' },
                    email: { address: 'johndoe@example.com' }
                },
                'mobile-already-verified': {
                    id: 'mobile-already-verified',
                    name: 'Mobile Already Verified',
                    title: 'Review Your Contact Details',
                    subtitle: 'To ensure your security, we need to verify your email address through an OTP. Please confirm these details, as they cannot be modified later.',
                    showConflictWarning: false,
                    showAlternativeEmail: false,
                    showAlternativeMobile: false,
                    showMobileRow: true,
                    showEmailRow: true,
                    alreadyVerifiedField: 'mobile',
                    mobile: { number: '9879879870' },
                    email: { address: 'johndoe@example.com' }
                },
                'email-already-verified': {
                    id: 'email-already-verified',
                    name: 'Email Already Verified',
                    title: 'Review Your Contact Details',
                    subtitle: 'To ensure your security, we need to verify your mobile number through an OTP. Please confirm these details, as they cannot be modified later.',
                    showConflictWarning: false,
                    showAlternativeEmail: false,
                    showAlternativeMobile: false,
                    showMobileRow: true,
                    showEmailRow: true,
                    alreadyVerifiedField: 'email',
                    mobile: { number: '9879879870' },
                    email: { address: 'johndoe@example.com' }
                },
                'mobile-verified-alternative-email': {
                    id: 'mobile-verified-alternative-email',
                    name: 'Mobile Verified, Alternative Email',
                    title: 'Update Your Contact Details',
                    showConflictWarning: true,
                    conflictMessage: 'Your registered email id has been verified. However, you can add an alternative email id to get OTP on this email id or other communications.',
                    showAlternativeEmail: true,
                    showAlternativeMobile: false,
                    showMobileRow: false,
                    showEmailRow: false,
                    mobile: { number: '9879879870' },
                    email: { address: 'johndoe@example.com' }
                },
                'mobile-unverified-alternative-email': {
                    id: 'mobile-unverified-alternative-email',
                    name: 'Mobile Unverified, Alternative Email',
                    title: 'Update Your Contact Details',
                    showConflictWarning: true,
                    conflictMessage: 'Your mobile number is unverified. Please verify your mobile number. You can also add an alternative email address to get OTP on this email or other communications.',
                    showAlternativeEmail: true,
                    showAlternativeMobile: false,
                    showMobileRow: true,
                    showEmailRow: false,
                    mobile: { number: '9879879870' },
                    email: { address: 'johndoe@example.com' }
                },
                'email-verified-alternative-mobile': {
                    id: 'email-verified-alternative-mobile',
                    name: 'Email Verified, Alternative Mobile',
                    title: 'Update Your Contact Details',
                    showConflictWarning: true,
                    conflictMessage: 'Conflict of information is observed. Your CIBIL-registered email is verified. To continue please provide us an alternate mobile to verify.',
                    showAlternativeEmail: false,
                    showAlternativeMobile: true,
                    showMobileRow: false,
                    showEmailRow: false,
                    mobile: { number: '9879879870' },
                    email: { address: 'johndoe@example.com' }
                },
                'email-unverified-alternative-mobile': {
                    id: 'email-unverified-alternative-mobile',
                    name: 'Email Unverified, Alternative Mobile',
                    title: 'Update Your Contact Details',
                    showConflictWarning: true,
                    conflictMessage: 'We noticed a conflict in your information. To ensure you receive all important updates, please verify your details. The mobile number associated with your account cannot be verified at this moment. You must provide an alternative mobile number to proceed.',
                    showAlternativeEmail: false,
                    showAlternativeMobile: true,
                    showMobileRow: false,
                    showEmailRow: true,
                    unverifiedField: 'email',
                    mobile: { number: '9879879870' },
                    email: { address: 'johndoe@example.com' }
                },
                'both-alternative': {
                    id: 'both-alternative',
                    name: 'Both Alternative',
                    title: 'Verify your Contact Details',
                    showConflictWarning: true,
                    conflictMessage: 'It appears that your current Mobile Number and Email ID are registered with multiple accounts. Please provide alternate Mobile Number and Email ID to proceed.',
                    showAlternativeEmail: true,
                    showAlternativeMobile: true,
                    showMobileRow: false,
                    showEmailRow: false,
                    mobile: { number: '9879879870' },
                    email: { address: 'johndoe@example.com' }
                }
            }
        };
        return reviewConfig;
    }
}

function applyReviewState(stateId = null) {
    if (!reviewConfig) {
        console.error('Review config not loaded');
        return;
    }

    const id = stateId || reviewConfig.defaultState || 'both-unverified-no-conflict';
    const state = reviewConfig.states?.[id];

    if (!state) {
        console.warn(`State "${id}" not found, using default`);
        return;
    }

    const pageTitle = document.getElementById('page-title');
    const subtitle = document.querySelector('.page-subtitle');
    const conflictWarning = document.getElementById('conflict-warning');
    const rowAlternativeEmail = document.getElementById('row-alternative-email');
    const rowAlternativeMobile = document.getElementById('row-alternative-mobile');
    const rowMobile = document.getElementById('row-mobile');
    const rowEmail = document.getElementById('row-email');

    // Title
    if (pageTitle && state.title) {
        pageTitle.textContent = state.title;
    }

    // Subtitle
    if (subtitle) {
        subtitle.style.display = 'block';
        if (state.subtitle) {
            subtitle.textContent = state.subtitle;
        }
    }

    // Conflict / alternative warning
    if (conflictWarning) {
        if (state.showConflictWarning && state.conflictMessage) {
            conflictWarning.classList.remove('conflict-warning--hidden');
            const conflictText = document.getElementById('conflict-warning-text');
            if (conflictText) conflictText.textContent = state.conflictMessage;
            if (subtitle) subtitle.style.display = 'none';
        } else {
            conflictWarning.classList.add('conflict-warning--hidden');
            if (subtitle) subtitle.style.display = 'block';
        }
    }

    // Alternative fields
    if (rowAlternativeEmail) {
        if (state.showAlternativeEmail) {
            rowAlternativeEmail.classList.remove('info-row--hidden');
            rowAlternativeEmail.style.display = '';
            const altInput = document.getElementById('alternative-email-input');
            if (altInput) altInput.removeAttribute('disabled');
        } else {
            rowAlternativeEmail.classList.add('info-row--hidden');
            rowAlternativeEmail.style.display = 'none';
            const altInput = document.getElementById('alternative-email-input');
            if (altInput) { altInput.setAttribute('disabled', 'disabled'); altInput.value = ''; }
        }
    }
    if (rowAlternativeMobile) {
        if (state.showAlternativeMobile) {
            rowAlternativeMobile.classList.remove('info-row--hidden');
            rowAlternativeMobile.style.display = '';
            const altInput = document.getElementById('alternative-mobile-input');
            if (altInput) altInput.removeAttribute('disabled');
        } else {
            rowAlternativeMobile.classList.add('info-row--hidden');
            rowAlternativeMobile.style.display = 'none';
            const altInput = document.getElementById('alternative-mobile-input');
            if (altInput) { altInput.setAttribute('disabled', 'disabled'); altInput.value = ''; }
        }
    }

    // Mobile row
    if (rowMobile) {
        if (state.showMobileRow) {
            rowMobile.classList.remove('hidden');
            rowMobile.style.display = '';
            const input = rowMobile.querySelector('.info-value');
            if (input && state.mobile?.number) {
                input.value = state.mobile.number;
            }
        } else {
            rowMobile.classList.add('hidden');
            rowMobile.style.display = 'none';
        }
    }

    // Email row
    if (rowEmail) {
        if (state.showEmailRow) {
            rowEmail.classList.remove('hidden');
            rowEmail.style.display = '';
            const input = rowEmail.querySelector('.info-value');
            if (input && state.email?.address) {
                input.value = state.email.address;
            }
        } else {
            rowEmail.classList.add('hidden');
            rowEmail.style.display = 'none';
        }
    }

    // "Already verified" state - show error on the verified field (per Figma)
    if (typeof hideError === 'function') {
        hideError('mobile');
        hideError('email');
    }
    if (state.alreadyVerifiedField && typeof showError === 'function') {
        showError(state.alreadyVerifiedField, state.alreadyVerifiedField === 'mobile'
            ? 'This mobile number is already verified, try another mobile number.'
            : 'This email address is already verified, try another email address.');
    }

    // "Unverified" status (e.g. Email unverified) - show under field, hide when not set
    const emailUnverifiedStatus = document.getElementById('email-unverified-status');
    if (emailUnverifiedStatus) {
        if (state.unverifiedField === 'email') {
            emailUnverifiedStatus.classList.remove('field-status--hidden');
        } else {
            emailUnverifiedStatus.classList.add('field-status--hidden');
        }
    }

    // Store state on SEND OTP button for redirect to OTP page
    const sendOtpBtn = document.getElementById('send-otp-btn');
    if (sendOtpBtn) {
        sendOtpBtn.dataset.state = state.id;
    }
}

function hideAlternativeFieldsImmediately() {
    const rowAlternativeEmail = document.getElementById('row-alternative-email');
    const rowAlternativeMobile = document.getElementById('row-alternative-mobile');
    if (rowAlternativeEmail) {
        rowAlternativeEmail.classList.add('info-row--hidden');
        rowAlternativeEmail.style.display = 'none';
    }
    if (rowAlternativeMobile) {
        rowAlternativeMobile.classList.add('info-row--hidden');
        rowAlternativeMobile.style.display = 'none';
    }
}

async function initReviewConfigLoader() {
    hideAlternativeFieldsImmediately();
    await loadReviewConfig();
    const urlParams = new URLSearchParams(window.location.search);
    const stateId = urlParams.get('state') || urlParams.get('mode');
    applyReviewState(stateId || null);
}
