/* Js Code für Log in page */

// Nach Abschluss der Animation den frame156 & frame153 sichtbar machen
function showLogIn() {
    document.querySelector('.img-size-login').addEventListener('animationend', function () {
        document.querySelector('.frame156').style.visibility = 'visible';
        document.querySelector('.frame153').style.visibility = 'visible';
    });
}


