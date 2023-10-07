/* Js Code für Log in page */

// Nach Abschluss der Animation den .frame156 sichtbar machen
function showLogIn() {
    document.querySelector('.img-size-login').addEventListener('animationend', function () {
        document.querySelector('.frame156').style.visibility = 'visible';
    });
}