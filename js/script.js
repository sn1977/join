/**
 * Globale Variable, die eine Liste von Benutzern speichert.
 * @type {Array<Object>}
 */
let users = [];

/**
 * Globale Variablen für DOM-Elemente.
 * @type {HTMLElement}
 */
let nameElement;
let emailElement;
let passwordElement;
let passwordSignupElement;

/**
 * Initializes the login page elements.
 */
function initializeElements() {
    nameElement = document.getElementById('name');
    emailElement = document.getElementById('email');
    passwordElement = document.getElementById('password');
    passwordSignupElement = document.getElementById('password-signup');
}

/**
 * Initializes the login page by showing the login template.
 */
function init() {
    showLogInStart();
    logInTemplate();
}

/**
 * Reveals specific elements after the completion of an animation.
 */
function showLogInStart() {
    document.querySelector('.img-size-login').addEventListener('animationend', function () {
        document.querySelector('.frame156').style.visibility = 'visible';
        document.querySelector('.frame153').style.visibility = 'visible';
        document.querySelector('.frame213').style.visibility = 'visible';
    });
}

/**
 * Shows the login template and makes certain elements visible.
 */
function showLogIn() {
    logInTemplate();
    document.querySelector('.frame156').style.visibility = 'visible';
    document.querySelector('.frame153').style.visibility = 'visible';
    document.querySelector('.frame213').style.visibility = 'visible';
}

/**
 * Clears the content of the 'logInTemplate' HTML element and hides a specific frame.
 */
function emptyLogInTemplate() {
    let logInTemplate = document.getElementById('logInTemplate');
    logInTemplate.innerHTML = '';
    document.querySelector('.frame156').style.visibility = 'hidden';
}


/**
 * Updates the visibility icon based on password input field value.
 * @param {string} inputId - The ID of the input element for the password.
 */
function updatePasswordIcon(inputId) {
    const passwordInput = document.getElementById(inputId);
    const lockIcon = document.querySelector(`[data-for="${inputId}"]`);

    if (passwordInput && lockIcon) {
        if (passwordInput.value.length > 0) {
            lockIcon.src = '../assets/img/visibility_off.png';
            lockIcon.classList.add('img-visibility');
        } else {
            lockIcon.src = '../assets/img/lock.png';
            lockIcon.classList.remove('img-visibility');
        }
    }
}

/**
 * Toggles the visibility of the password in an input field.
 * @param {string} inputId - The ID of the input element for the password.
 * @param {string} toggleIconClass - The class for the toggle icon element.
 */
function togglePasswordVisibility(inputId, toggleIconClass) {
    const passwordInput = document.getElementById(inputId);
    const toggleIcon = document.querySelector(toggleIconClass);

    if (passwordInput && toggleIcon) {
        if (passwordInput.type === "password") {
            passwordInput.type = "text";
            toggleIcon.src = "../assets/img/visibility.png"; // Icon for visible password
        } else {
            passwordInput.type = "password";
            toggleIcon.src = "../assets/img/visibility_off.png"; // Icon for invisible password
        }
    }
}

/**
 * Handles the change event of the remember password checkbox.
 */
function checkboxChange() {
    const checkbox = document.getElementById("pw-checkbox");
    const iconChecked = document.querySelector(".icon-checked");
    const iconUnchecked = document.querySelector(".icon-unchecked");

    checkbox.addEventListener("change", function () {
        if (this.checked) {
            iconChecked.style.display = "inline-block";
            iconUnchecked.style.display = "none";
        } else {
            iconChecked.style.display = "none";
            iconUnchecked.style.display = "inline-block";
        }
    });
}

/**
 * Handles the change event of the privacy policy checkbox.
 */
function privacyCheckboxChange() {
    const privacyCheckbox = document.getElementById('privacy-checkbox');
    const iconChecked = document.querySelector(".icon-checked");
    const iconUnchecked = document.querySelector(".icon-unchecked");
    const btnSignup = document.getElementById("btn-signup");

    privacyCheckbox.addEventListener("change", function () {
        if (this.checked) {
            iconChecked.style.display = "inline-block";
            iconUnchecked.style.display = "none";
            btnSignup.disabled = false;
        } else {
            iconChecked.style.display = "none";
            iconUnchecked.style.display = "inline-block";
            btnSignup.disabled = true;
        }
    });
}

/**
 * Displays the sign-up template and initializes the input elements.
 */
function signUp() {
    signUpTemplate();
    initializeElements();
}

/**
 * Redirects to the privacy policy page.
 */
function redirectToPrivacyPolicy() {
    document.getElementById('btn-privacy-policy').onclick = redirect => {
        location.href = "../html/data_protection.html";
    };
}

/**
 * Creates and displays a success overlay message.
 */
function overlaySuccess() {
    const overlay = document.createElement('div');
    overlay.className = 'success-overlay animate';
    document.body.classList.add('animate');

    const message = document.createElement('div');
    message.className = 'success-message';
    message.innerHTML = 'You Signed Up successfully';

    overlay.appendChild(message);
    document.body.appendChild(overlay);

    setTimeout(Timeout => {
        document.body.removeChild(overlay);
        document.body.classList.remove('animate');
        showLogIn();
    }, 3000);
}

/**
 * Attempts to log in a user with provided credentials.
 * @param {Event} event - The event object associated with the form submission.
 */
function login(event) {
    // Prevent default form submission behavior
    if (event) {
        event.preventDefault();
    }
    let email = document.getElementById('loginMail');
    let password = document.getElementById('password-login');
    let user = users.find(u => u.email == email.value && u.password == password.value);
    if (user) {
        localStorage.setItem('userInitials', user.name);
        location.href = "../html/summary.html";
    } else {
        password.value = '';
        document.getElementById('loginPassword').style.border = '1px solid #FF001F';
        wrongPassword();
    }
}

/**
 * Handles login for a guest user.
 */
function guestLogin() {
    localStorage.setItem('userInitials', 'G');
    location.href = "../html/summary.html";
}

/**
 * Displays an alert for a wrong password attempt.
 */
function wrongPassword() {
    let wrongPassword = document.createElement('div');
    const divWithClass156 = document.querySelector('.div-156');
    divWithClass156.appendChild(wrongPassword);
    wrongPassword.className = 'wrong-password';
    wrongPassword.innerHTML = 'Wrong password Ups! Try again.';
}

/**
 * Checks if a user with the provided email already exists.
 * @returns {boolean} True if the user exists, false otherwise.
 */
function checkExistingUser() {
    let email = document.getElementById('email');
    let user = users.find(u => u.email == email.value);

    if (user) {
        alert('Email already exists!');
        return true;
    }
    return false;
}

/**
 * Compares the entered passwords and registers the user if they match.
 * @param {Event} event - The event object associated with the form submission.
 */
function comparePasswords(event) {
    if (event) {
        event.preventDefault();
    }
    let password = document.getElementById('password');
    let passwordControl = document.getElementById('password-signup');
    if (password.value === passwordControl.value) {
        if (!checkExistingUser()) {
            overlaySuccess();
            register();
        } else {
            document.getElementById('signUpEmail').style.border = '1px solid #FF001F';
        }
    } else {
        document.getElementById('signUPControl').style.border = '1px solid #FF001F';
        failedPasswordMatch();
        passwordControl.value = '';
    }
}

/**
 * Displays an alert when password confirmation fails.
 */
function failedPasswordMatch() {
    let failedPasswordMatch = document.createElement('div');
    const divWithClass156 = document.querySelector('.div-156');
    divWithClass156.appendChild(failedPasswordMatch);
    failedPasswordMatch.className = 'wrong-password';
    failedPasswordMatch.innerHTML = 'Ups! your password don’t match';
}

