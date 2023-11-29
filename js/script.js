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
 * Initializes the login page by showing the login template and adding event listener for email and passwort input field.
 */
function init() {
    showLogInStart();
    logInTemplate();
    eventListenerForEmailLogin();
    eventListenerForPasswordLogin();
}

/**
 * Adds an event listener to the email input field in the login form.
 * The listener calls functions to reset the email field and remove any error messages
 * related to email validation and wrong password when the user starts typing.
 */
function eventListenerForEmailLogin() {
    const loginEmailInput = document.getElementById('loginMail');
    if (loginEmailInput) {
        loginEmailInput.addEventListener('input', function () {
            resetEmailField();
            resetWrongPasswordMessage();
            const passwordBorderElement = document.getElementById('loginPassword');
            if (passwordBorderElement) {
                passwordBorderElement.style.border = '';
            }
        });
    }
}

/**
 * Removes the 'wrong-password' error message if it exists.
 * This function is triggered when the user starts typing in either the email or password field.
 */
function resetWrongPasswordMessage() {
    const wrongPasswordDiv = document.querySelector('.wrong-password');
    if (wrongPasswordDiv) {
        wrongPasswordDiv.remove();
    }
}

/**
 * Resets the email field by removing any 'no-email' error messages and resetting the border style.
 * This function is triggered by the input event listener on the email input field.
 */
function resetEmailField() {
    const noEmailDiv = document.querySelector('.no-email');
    if (noEmailDiv) {
        noEmailDiv.remove();
    }

    const emailBorderElement = document.getElementById('loginEmail');
    if (emailBorderElement) {
        emailBorderElement.style.border = '';
    }
}


/**
 * Adds an input event listener to the password input field for the login form.
 * This listener resets the password field's border and error message upon user input.
 */
function eventListenerForPasswordLogin() {
    const loginPasswordInput = document.getElementById('password-login');
    if (loginPasswordInput) {
        loginPasswordInput.addEventListener('input', resetPasswordField);
    }
}

/**
 * Resets the password input field by removing any error messages and resetting the border style.
 * This function is triggered by the input event listener on the password input field.
 */
function resetPasswordField() {
    const wrongPasswordDiv = document.querySelector('.wrong-password');
    if (wrongPasswordDiv) {
        wrongPasswordDiv.remove();
    }

    const passwordBorderElement = document.getElementById('loginPassword');
    if (passwordBorderElement) {
        passwordBorderElement.style.border = '';
    }
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
        } else {
            iconChecked.style.display = "none";
            iconUnchecked.style.display = "inline-block";
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
 * Handles the successful login process for a user.
 * Stores the user's initials in localStorage and redirects to the summary page.
 * @param {Object} user - The user object that successfully logged in.
 */
function handleSuccessfulLogin(user) {
    localStorage.setItem('userInitials', user.name);
    location.href = "../html/summary.html";
}

/**
 * Handles the failed login process.
 * Sets appropriate border styles based on the field that caused the login failure.
 * @param {HTMLElement} emailBorder - The DOM element for the email input border.
 * @param {HTMLElement} passwordBorder - The DOM element for the password input border.
 */
function handleFailedLogin(emailBorder, passwordBorder) {
    let wrongField = wrongPassword();

    if (wrongField === 'email') {
        emailBorder.style.border = '1px solid #FF001F';
        passwordBorder.style.border = '';
    } else if (wrongField === 'password') {
        passwordBorder.style.border = '1px solid #FF001F';
        emailBorder.style.border = '';
    } else {
        emailBorder.style.border = '';
        passwordBorder.style.border = '1px solid #FF001F';
        displayWrongPasswordMessage();
    }
}

/**
 * Processes the login form submission.
 * Checks user credentials and calls appropriate functions for successful or failed login.
 * @param {Event} event - The event object associated with the form submission.
 */
function login(event) {
    if (event) {
        event.preventDefault();
    }

    let email = document.getElementById('loginMail');
    let emailBorder = document.getElementById('loginEmail');
    let password = document.getElementById('password-login');
    let passwordBorder = document.getElementById('loginPassword');
    let user = users.find(u => u.email === email.value && u.password === password.value);

    if (user) {
        handleSuccessfulLogin(user);
    } else {
        handleFailedLogin(emailBorder, passwordBorder);
        email.value = '';
        password.value = '';
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
 * Checks if the email input field is empty and displays an error message if so.
 * This function creates a new div element to show the error message if the email is not entered.
 * It returns a string indicating which field caused the error ('email' or 'none').
 * @returns {string} The field that caused the error ('email' or 'none').
 */
function wrongPassword() {
    const emailInput = document.getElementById('loginMail');
    const emailPattern = /.{4,}@/; // Überprüft, ob mindestens 5 Zeichen inklusive '@' vorhanden sind

    if (!emailPattern.test(emailInput.value)) {
        let noEmailDiv = document.querySelector('.no-email');

        // Erstellt das Div nur, wenn es noch nicht existiert
        if (!noEmailDiv) {
            noEmailDiv = document.createElement('div');
            noEmailDiv.className = 'no-email';
            const divWithClass157 = document.querySelector('.frame155');
            divWithClass157.appendChild(noEmailDiv);
        }

        noEmailDiv.innerHTML = 'Please enter a valid e-mail!';
        return 'email';
    }
    return 'none';
}


/**
 * Displays an error message when the password is wrong.
 * This function creates a new div element to show the error message if the password entered is incorrect.
 */
function displayWrongPasswordMessage() {
    let wrongPasswordDiv = document.querySelector('.wrong-password');
    if (!wrongPasswordDiv) {
        wrongPasswordDiv = document.createElement('div');
        const divWithClass156 = document.querySelector('.div-156');
        divWithClass156.appendChild(wrongPasswordDiv);
        wrongPasswordDiv.className = 'wrong-password';
    }
    wrongPasswordDiv.innerHTML = 'Wrong password! Oops! Try again.';
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
 * Checks if the privacy policy checkbox is checked.
 * @returns {boolean} True if the checkbox is checked, false otherwise.
 */
function isPrivacyPolicyAccepted() {
    const privacyCheckbox = document.getElementById('privacy-checkbox');
    return privacyCheckbox && privacyCheckbox.checked;
}

/**
 * Compares the entered passwords and handles the registration or error display.
 */
function compareAndRegisterPasswords() {
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
 * Compares the entered passwords and registers the user if they match,
 * provided that the privacy policy checkbox is checked.
 * @param {Event} event - The event object associated with the form submission.
 */
function comparePasswords(event) {
    if (event) {
        event.preventDefault();
    }

    if (!isPrivacyPolicyAccepted()) {
        alert('Please accept the privacy policy.');
        return;
    }

    compareAndRegisterPasswords();
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

