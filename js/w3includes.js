async function loadIncludeHTML() {
    await includeHTML();
    loadInitialsHeader();
}

async function includeHTML() {
    let includeElements = document.querySelectorAll('[w3-include-html]');
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        file = element.getAttribute("w3-include-html"); // "includes/header.html"
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = 'Page not found';
        }
    }
}

function togglePopup(event) {
    let popup = document.getElementById('header-popup');
    if (popup) {
        popup.classList.toggle('popup-visible');
        event.stopPropagation();
    }
}

document.addEventListener('click', function (event) {
    let popup = document.getElementById('header-popup');
    let profileInitials = document.getElementById('profileInitials');
    if (popup.classList.contains('popup-visible') &&
        !popup.contains(event.target) &&
        !profileInitials.contains(event.target)) {
        popup.classList.remove('popup-visible');
    }
});