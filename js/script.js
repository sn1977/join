/* Js Code für Log in page */
// Initialisierung
let users = [];
let nameElement;
let emailElement;
let passwordElement;
let passwordSignupElement;

function initializeElements() {
    nameElement = document.getElementById('name');
    emailElement = document.getElementById('email');
    passwordElement = document.getElementById('password');
    passwordSignupElement = document.getElementById('password-signup');
}

function init() {
    showLogInStart();
    logInTemplate();
}

// Nach Abschluss der Animation den frame156 & frame153 sichtbar machen
function showLogInStart() {
    document.querySelector('.img-size-login').addEventListener('animationend', function () {
        document.querySelector('.frame156').style.visibility = 'visible';
        document.querySelector('.frame153').style.visibility = 'visible';
        document.querySelector('.frame213').style.visibility = 'visible';
    });
}

function showLogIn() {
    logInTemplate();
    document.querySelector('.frame156').style.visibility = 'visible';
    document.querySelector('.frame153').style.visibility = 'visible';
    document.querySelector('.frame213').style.visibility = 'visible';
}

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

function togglePasswordVisibility(inputId, toggleIconClass) {
    const passwordInput = document.getElementById(inputId);
    const toggleIcon = document.querySelector(toggleIconClass);

    if (passwordInput && toggleIcon) {
        if (passwordInput.type === "password") {
            passwordInput.type = "text";
            toggleIcon.src = "../assets/img/visibility.png"; // Icon für sichtbares Passwort
        } else {
            passwordInput.type = "password";
            toggleIcon.src = "../assets/img/visibility_off.png"; // Icon für unsichtbares Passwort
        }
    }
}


function checkboxChange() {
    const checkbox = document.getElementById("pw-checkbox");
    // const privacyCheckbox = document.getElementById('privacy-checkbox');
    const iconChecked = document.querySelector(".icon-checked");
    const iconUnchecked = document.querySelector(".icon-unchecked");
    const btnSignup = document.getElementById("btn-signup");

    checkbox.addEventListener("change", function () {
        if (this.checked) {
            iconChecked.style.display = "inline-block";
            iconUnchecked.style.display = "none";
            // btnSignup.disabled = false; // Aktivieren Sie den Registrierungsbutton
        } else {
            iconChecked.style.display = "none";
            iconUnchecked.style.display = "inline-block";
            // btnSignup.disabled = true; // Deaktivieren Sie den Registrierungsbutton
        }
    });
}

function privacyCheckboxChange() {
    const privacyCheckbox = document.getElementById('privacy-checkbox');
    const iconChecked = document.querySelector(".icon-checked");
    const iconUnchecked = document.querySelector(".icon-unchecked");
    const btnSignup = document.getElementById("btn-signup");

    privacyCheckbox.addEventListener("change", function () {
        if (this.checked) {
            iconChecked.style.display = "inline-block";
            iconUnchecked.style.display = "none";
            btnSignup.disabled = false; // Aktivieren Sie den Registrierungsbutton
        } else {
            iconChecked.style.display = "none";
            iconUnchecked.style.display = "inline-block";
            btnSignup.disabled = true; // Deaktivieren Sie den Registrierungsbutton
        }
    });
}

function signUp() {
    signUpTemplate();
    initializeElements(); // Hier initialisieren wir die Elemente, nachdem das SignUp-Template geladen wurde.
}

function redirectToPrivacyPolicy() {
    document.getElementById('btn-privacy-policy').onclick = redirect => {
        location.href = "../html/data_protection.html";
    };
}

function overlaySuccess() {
    const overlay = document.createElement('div');
    overlay.className = 'success-overlay animate';
    document.body.classList.add('animate'); // Fügen Sie die animate-Klasse zum Body-Element hinzu

    const message = document.createElement('div');
    message.className = 'success-message'; // Fügen Sie hier die gewünschten Klassen für die Nachricht hinzu
    message.innerHTML = 'You Signed Up successfully'; // Die Nachricht, die angezeigt werden soll

    overlay.appendChild(message);
    document.body.appendChild(overlay);

    // Schließen Sie das Overlay nach einigen Sekunden
    setTimeout(Timeout => {
        document.body.removeChild(overlay);
        document.body.classList.remove('animate');
        showLogIn();
    }, 3000); // Hier können Sie die Dauer des Overlays in Millisekunden festlegen (hier 3 Sekunden)
}

function login(event) {
    // Verhindern Sie das Standardverhalten des Formulars
    if (event) {
        event.preventDefault();
    }
    let email = document.getElementById('loginMail');
    let password = document.getElementById('password-login');
    let user = users.find(u => u.email == email.value && u.password == password.value);
    if (user) {
        localStorage.setItem('userInitials', user.name);
        location.href = "../html/contacts.html";
    } else {
        password.value = '';
        document.getElementById('loginPassword').style.border = '1px solid #FF001F';
        wrongPassword();
    }
}

function guestLogin() {
    localStorage.setItem('userInitials', 'G');
    location.href = "../html/contacts.html";
}

function wrongPassword() {
    let wrongPassword = document.createElement('div');
    const divWithClass156 = document.querySelector('.div-156');
    divWithClass156.appendChild(wrongPassword);
    wrongPassword.className = 'wrong-password';
    wrongPassword.innerHTML = 'Wrong password Ups! Try again.';
}

function checkExistingUser() {
    let email = document.getElementById('email');
    let user = users.find(u => u.email == email.value);

    if (user) {
        alert('Email already exists!');
        return true; // Benutzer existiert bereits
    }
    return false; // Benutzer existiert nicht
}


function comparePasswords(event) {
    // Verhindern Sie das Standardverhalten des Formulars
    if (event) {
        event.preventDefault();
    }
    let password = document.getElementById('password');
    let passwordControl = document.getElementById('password-signup');
    if (password.value === passwordControl.value) {
        if (!checkExistingUser()) { // Wenn der Benutzer nicht existiert, fahren Sie fort
            overlaySuccess();
            register();
        } else {
            document.getElementById('signUpEmail').style.border = '1px solid #FF001F'; // Hervorheben des E-Mail-Feldes, wenn ein Benutzer bereits existiert
        }
    } else {
        document.getElementById('signUPControl').style.border = '1px solid #FF001F';
        failedPasswordMatch();
        passwordControl.value = '';
    }
}

function failedPasswordMatch() {
    let failedPasswordMatch = document.createElement('div');
    const divWithClass156 = document.querySelector('.div-156');
    divWithClass156.appendChild(failedPasswordMatch);
    failedPasswordMatch.className = 'wrong-password';
    failedPasswordMatch.innerHTML = 'Ups! your password don’t match';
}

