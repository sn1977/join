/* Js Code für Log in page */

function init() {
    showLogIn();
    logInTemplate();
}

// Nach Abschluss der Animation den frame156 & frame153 sichtbar machen
function showLogIn() {
    document.querySelector('.img-size-login').addEventListener('animationend', function () {
        document.querySelector('.frame156').style.visibility = 'visible';
        document.querySelector('.frame153').style.visibility = 'visible';
        document.querySelector('.frame213').style.visibility = 'visible';
    });
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
}

function redirectToPrivacyPolicy() {
    document.getElementById('btn-privacy-policy').onclick = function () {
        location.href = "../html/data_protection.html";
    };
}

function overlaySuccess() {
    console.log('Hallo');
}