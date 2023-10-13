/* Js Code für Log in page */

function init() {
    showLogInStart();
    logInTemplate();
    showLogIn();
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

function comparePasswords() {
    let passwordInput1 = document.getElementById('password').value;
    let passwordInput2 = document.getElementById('password-signup').value;

    if (passwordInput2 != '') {
        if (passwordInput1 === passwordInput2) {
            console.log('richtiges Passwort');
        } else {
            console.log('Falsches Passwort');
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
    const overlay = document.createElement("div");
    overlay.className = "success-overlay animate";
    document.body.classList.add("animate"); // Fügen Sie die animate-Klasse zum Body-Element hinzu

    const message = document.createElement("div");
    message.className = "success-message"; // Fügen Sie hier die gewünschten Klassen für die Nachricht hinzu
    message.innerHTML = "You Signed Up successfully"; // Die Nachricht, die angezeigt werden soll

    overlay.appendChild(message);
    document.body.appendChild(overlay);

    // Schließen Sie das Overlay nach einigen Sekunden
    setTimeout(function () {
        document.body.removeChild(overlay);
        document.body.classList.remove("animate");
        init();
    }, 3000); // Hier können Sie die Dauer des Overlays in Millisekunden festlegen (hier 3 Sekunden)
}

