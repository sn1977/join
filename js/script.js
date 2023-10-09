/* Js Code für Log in page */

function init() {
    showLogIn();
}

// Nach Abschluss der Animation den frame156 & frame153 sichtbar machen
function showLogIn() {
    document.querySelector('.img-size-login').addEventListener('animationend', function () {
        document.querySelector('.frame156').style.visibility = 'visible';
        document.querySelector('.frame153').style.visibility = 'visible';
        document.querySelector('.frame213').style.visibility = 'visible';
    });
}

// document.getElementById("password").addEventListener("input", function () {
//     updatePasswordIcon();
// });

function updatePasswordIcon() {
    const passwordInput = document.getElementById("password");
    const lockIcon = document.querySelector(".img-lock");

    if (passwordInput.value.length > 0) {
        // Wenn ein Passwort eingegeben wurde, ändere das Icon
        lockIcon.src = '../assets/img/visibility_off.png'; // Hier das Icon für entsperrtes Passwort einfügen
        lockIcon.classList.add('img-visibility');
    } else {
        // Wenn kein Passwort eingegeben wurde, verwende das ursprüngliche Icon
        lockIcon.src = '../assets/img/lock.png'; // Hier das Icon für gesperrtes Passwort einfügen
        lockIcon.classList.remove('img-visibility');
    }
}

function togglePasswordVisibility() {
    const passwordInput = document.getElementById("password");
    const toggleIcon = document.querySelector(".toggle-icon");

    if (passwordInput.type === "password") {
        // Wenn das Passwortfeld derzeit vom Typ "password" ist, ändere es zu "text"
        passwordInput.type = "text";
        toggleIcon.src = "../assets/img/visibility.png"; // Icon für sichtbares Passwort
    } else {
        // Andernfalls, wenn das Passwortfeld derzeit vom Typ "text" ist, ändere es zu "password"
        passwordInput.type = "password";
        toggleIcon.src = "../assets/img/visibility_off.png"; // Icon für unsichtbares Passwort
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const checkbox = document.getElementById("pw-checkbox");
    const label = document.querySelector(".remember-password label");
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
});
