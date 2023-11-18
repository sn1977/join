/*** functions copied from contact.js */
const colors = ['#FF7A00', '#9327FF', '#6E52FF', '#FC71FF', '#FFBB2B', '#1FD7C1', '#462F8A', '#0038FF'];


async function loadContacts() {
    contacts = JSON.parse(await getItem('contacts')) || contacts;
}


function loadInitialsHeader() {
    let userInitials = localStorage.getItem('userInitials');
    // Wenn der Benutzer gefunden wird, setzen Sie die Initialen
    let initials = getInitials(userInitials);
    document.getElementById("profileInitials").innerHTML += `<span>${initials}</span>`;
}


function getInitials(name) {
    let words = name.split(' ');
    let initials = "";

    if (words.length >= 2) {
        initials = words[0][0] + words[1][0];
    } else if (words.length === 1) {
        initials = words[0][0];
    }

    return initials.toUpperCase();
}


function getColorByIndex(index) {
    return colors[index % colors.length];
}

function changeBorderColor(inputElement) {
    const frame14Element = inputElement.closest('.frame14');

    if (inputElement.value) {
        frame14Element.style.borderColor = '#29ABE2';  // Ersetzt die 'desiredColor' durch die gewünschte Farbe
    } else {
        frame14Element.style.borderColor = '';  // Setzt den Rahmen zurück auf die ursprüngliche Farbe
    }
}

function initializeContactElements() {
    contactNameElem = document.getElementById('contactName');
    contactEmailElem = document.getElementById('contactEmail');
    contactPhoneElem = document.getElementById('contactPhone');
}


function overlayContactCreated() {
    const overlayCreatedContact = document.createElement('div');
    overlayCreatedContact.id = 'overlayCreatedContact';
    document.body.appendChild(overlayCreatedContact);

    // Erste Bewegung: Overlay in die Ansicht bringen
    setTimeout(() => {
        if (window.innerWidth <= 990) {
            overlayCreatedContact.style.top = '70%'; // Endposition am oberen Rand
        } else if (window.innerWidth <= 1250) {
            overlayCreatedContact.style.left = '650px'; // Für mittelgroße Bildschirme
        } else {
            overlayCreatedContact.style.left = '743px'; // Standardbewegung
        }
    }, 50);

    // Zweite Bewegung: Overlay zurückbewegen
    // setTimeout(() => {
    //     overlayCreatedContact.style.left = '100%'; // Bewegt das Overlay zurück nach rechts
    // }, 3050); // Diese Zeit sollte der Dauer der ersten Bewegung plus einer gewünschten Pause entsprechen
    setTimeout(() => {
        if (window.innerWidth <= 990) {
            // overlayCreatedContact.style.bottom = '100%'; // Bewegt das Overlay wieder nach unten
            overlayCreatedContact.style.top = '100%'; // Bewegt das Overlay wieder nach unten
        } else {
            overlayCreatedContact.style.left = '100%'; // Bewegt das Overlay zurück nach rechts
        }
    }, 3050);

    addOverlayCreatedContact();
}

function overlayAddContact() {
    const overlay = document.createElement('div');
    overlay.id = 'overlayAddContact';
    document.body.appendChild(overlay);

    setTimeout(() => {
        overlay.style.transform = 'translateY(-50%) translateX(50%)';
    }, 50);

    addContact();
}


function addContact() {
    const sideLayout = returnSideLayoutOfContact();
    const contactText = addContactText();
    const contactBtn = addContactBtn();
    const contactCircle = addCircle();
    const closeIcon = addCloseIcon();

    document.getElementById('overlayAddContact').innerHTML = `
        <div class="overlay-contact">
            ${sideLayout}
            ${contactText} 
            ${contactBtn}
            ${contactCircle} 
            ${closeIcon}
        </div>
    `;
}

function returnSideLayoutOfContact() {
    return `
          <div class="overlay-addContact">
            <div class="frame194">
                <img src="../assets/img/Capa%202.png" class="capa2">
                <div class="frame209">
                    <span class="spanHeader">Add contact</span>
                    <span class="spanText"> Tasks are better with a team!</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="94" height="3" viewBox="0 0 94 3" fill="none">
                        <path d="M92 1.5L2 1.5" stroke="#29ABE2" stroke-width="3" stroke-linecap="round"/>
                    </svg>
                </div>
            </div>
        </div>
    `;
}


function addContactText() {
    const contactName = returnContactName();
    const contactEmail = returnContactEmail();
    const contactPhone = returnContactPhone();

    return `
        <form id="myForm">
            <div class=add-contact-text>
                ${contactName}  
                ${contactEmail}      
                ${contactPhone}
            </div>
        </form>
    `;
}


function addContactBtn() {
    const cancelBtn = returnCancelBtn();
    const createContactBtn = returnCreateContactBtn();

    return `
        <div class=frame27 id="frame27">
            ${cancelBtn}
            ${createContactBtn}
        </div>
    `;
}


function addCircle() {
    const circle = returnCircle();
    return `
        <div class=group13>
            ${circle}
        </div>
    `;
}



function addCloseIcon() {
    return `
        <div class="close" onclick="closeOverlayAddContact()">
            <img src="../assets/img/cancel.svg">
        </div>
    `;
}


function closeOverlayAddContact() {
    document.getElementById('overlayAddContact').innerHTML = '';
}



function returnCircle() {
    return `
        <div class=frame79_2>
            <svg class="svg-person-icon" xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120" fill="none">
                <circle cx="60" cy="60" r="60" fill="#D1D1D1"/>
            </svg>
            <img class="person-icon" src="../assets/img/person.svg">
        </div>
    `;
}

function returnContactName() {
    return `
        <div class="add-contact-field">
            <div class="frame14" id="frame14">
                <div class="frame157">
                    <input required type="text" class="text-field" minlength="4" placeholder="Name" id="contactName" oninput="changeBorderColor(this)">
                    <img src="../assets/img/person.png">
                </div>
            </div>
        </div>
    `;
}


function returnContactEmail() {
    return `
        <div class="add-contact-field">
            <div class="frame14">
                <div class="frame157">
                    <input required type="email" minlength="6" class="text-field" placeholder="Email" id="contactEmail" oninput="changeBorderColor(this)">
                    <img src="../assets/img/mail.png">
                </div>
            </div>
        </div>
    `;
}



function returnContactPhone() {
    return `
        <div class="add-contact-field">
            <div class="frame14">
                <div class="frame157">
                    <input required type="tel" minlength="4"class="text-field" placeholder="Phone" id="contactPhone" oninput="changeBorderColor(this)">
                    <img src="../assets/img/call.png">
                </div>
            </div>
        </div>
    `;
}


function returnCancelBtn() {
    return `
        <btn class=cancel-contact onclick="closeOverlayAddContact()">
            <span class="cancel-btn-text">Cancel</span>
            <svg class="cancel-svg-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
                <path d="M12.001 12.5001L17.244 17.7431M6.758 17.7431L12.001 12.5001L6.758 17.7431ZM17.244 7.25708L12 12.5001L17.244 7.25708ZM12 12.5001L6.758 7.25708L12 12.5001Z" stroke="#2A3647" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </btn>
    `;
}

function returnCreateContactBtn() {
    return `
        <btn type="submit" class=create-contact onclick="newContact()" id="mySubmitButton">
            <span class="create-btn-text">Create contact</span>
            <img src="../assets/img/check.svg">
        </btn>
    `;
}

function returnSaveContactBtn() {
    return `
        <btn type="submit" class=create-contact onclick="saveEditedContact(currentSelectedIndex)">
            <span class="create-btn-text">Save</span>
            <img src="../assets/img/check.svg">
        </btn>
    `;
}


function addOverlayCreatedContact() {
    document.getElementById('overlayCreatedContact').innerHTML = `
        <div class="frame73">
            <span class="contactSuccess">Contact successfully created</span>
        </div>
    `;

    // Div entfernen, nachdem die Animation abgeschlossen ist
    setTimeout(() => {
        const overlay = document.getElementById('overlayCreatedContact');
        if (overlay) overlay.remove();
    }, 10000); // Stellen Sie sicher, dass diese Zeitdauer der Dauer Ihrer CSS-Animation entspricht (in diesem Fall 5 Sekunden = 5000 Millisekunden).
}
