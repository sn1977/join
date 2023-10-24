let nameOfContact = ['Anton Mayer', 'Alfred Müller', 'Beate Müller'];
let emailOfContact = ['anton@gmail.com', 'alfred@gmail.com', 'beate@gmail.com'];
let telOfContact = [123456, 789456, 456951];

let contactNameElem;
let contactEmailElem;
let contactPhoneElem;
let currentSelectedIndex = null;

function initializeContactElements() {
    contactNameElem = document.getElementById('contactName');
    contactEmailElem = document.getElementById('contactEmail');
    contactPhoneElem = document.getElementById('contactPhone');
}

async function initContact(){
    await removeStorage();
    await loadContacts();
    renderContacts();
}

async function loadContacts(){
    nameOfContact = JSON.parse(await getItem('nameOfContact')) || ['Anton Mayer', 'Alfred Müller', 'Beate Müller'];
    emailOfContact = JSON.parse(await getItem('emailOfContact')) || ['anton@gmail.com', 'alfred@gmail.com', 'beate@gmail.com'];
    telOfContact = JSON.parse(await getItem('telOfContact')) || [123456, 789456, 456951];
}

async function newContact() {
    initializeContactElements();

    nameOfContact.push(contactNameElem.value);
    emailOfContact.push(contactEmailElem.value);
    telOfContact.push(contactPhoneElem.value);

    await setItem('nameOfContact', JSON.stringify(nameOfContact));
    await setItem('emailOfContact', JSON.stringify(emailOfContact));
    await setItem('telOfContact', JSON.stringify(telOfContact));

    resetContactField();
    closeOverlayAddContact();
    renderContacts();
}

function resetContactField() {
    contactNameElem.value = '';
    contactEmailElem.value = '';
    contactPhoneElem.value = '';
}

function groupByFirstLetter(names) {
    return names.reduce((groups, name) => {
        if (name && name.length > 0) {  // Überprüfen, ob der Name existiert und nicht leer ist
            const firstLetter = name[0].toUpperCase();
            if (!groups[firstLetter]) {
                groups[firstLetter] = [];
            }
            groups[firstLetter].push(name);
        }
        return groups;
    }, {});
}


function renderContacts() {
    let allContacts = document.getElementById('allContacts');
    allContacts.innerHTML = '';

    const groupedContacts = groupByFirstLetter(nameOfContact);

    for (const firstLetter in groupedContacts) {
        allContacts.innerHTML += `
            <div class="frame112">
                <span>${firstLetter}</span>
            </div>
            <div class="frame119">
                <svg fill="none" height="2" viewBox="0 0 354 2" width="354" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1H353" stroke="#D1D1D1" stroke-linecap="round"/>
                </svg>
            </div>`;

        groupedContacts[firstLetter].forEach((name) => {
            const originalIndex = nameOfContact.indexOf(name);
            allContacts.innerHTML += showContact(name, originalIndex);
        });
    }
}

function showContact(name, index) {
    return `
        <div class="contact-name contact-hover" id="contactNameBox${index}" onclick="showContactDetails(${index})">
            <div class="profile-badge contact-hover" id="profileBadge${index}">
                <div class="group9">${name.substring(0,2).toUpperCase()}</div>
                <div class="frame81">
                    <span class="contactName">${name}</span>
                    <span class="contactEmail">${emailOfContact[index]}</span>
                </div>
            </div>
        </div>`;
}

function showContactDetails(i) {
    // Wenn bereits ein Kontakt ausgewählt wurde, setzen Sie seine Stile zurück
    if (currentSelectedIndex !== null) {
        const previousContactBox = document.getElementById(`contactNameBox${currentSelectedIndex}`);
        const previousInnerContactBox = document.getElementById(`profileBadge${currentSelectedIndex}`);
        const previousContactName = document.querySelector(`#contactNameBox${currentSelectedIndex} .contactName`);

        if (previousContactBox && previousInnerContactBox && previousContactName) {
            previousContactBox.style.background = '';
            previousInnerContactBox.style.background = '';
            previousContactName.style.color = '#000000';
        }
    }

    let contactBox = document.getElementById(`contactNameBox${i}`);
    let innerContactBox = document.getElementById(`profileBadge${i}`);
    let contactName = document.querySelector(`#contactNameBox${i} .contactName`);

    if (contactBox && innerContactBox && contactName) {
        contactBox.style.background = '#2A3647';
        innerContactBox.style.background = '#2A3647';
        contactName.style.color = '#ffffff';
    }
    currentSelectedIndex = i;

    // Rufen Sie die neue Funktion auf, um die Details im floatingContact anzuzeigen
    displayFloatingContactDetails(i);
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

function closeOverlayAddContact() {
    document.getElementById('overlayAddContact').innerHTML = '';
}

function overlayContactCreated() {
    let floatingContact = document.getElementById('floatingContact');
    
    let overlaySuccessHTML = `
        <div class="frame73">
            <span class="contactSuccess">Contact succesfully created</span>
        </div>
    `;

    // Das generierte HTML in den floatingContact Container einfügen
    floatingContact.innerHTML = overlaySuccessHTML;

    // Animation starten
    setTimeout(() => {
        floatingContact.classList.add('show');
    }, 50); // Verzögerung von 50ms, um sicherzustellen, dass der Browser die Änderungen bemerkt
}

async function removeStorage() {
    await Promise.all([
        deleteItem('nameOfContact'),
        deleteItem('emailOfContact'),
        deleteItem('telOfContact')
    ]);
}