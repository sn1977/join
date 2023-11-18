/**
 * An array to store contact information.
 * @type {Array<Object>}
 */
let contacts = [];

/**
 * Color codes for UI styling.
 * @type {Array<string>}
 */
const colors = ['#FF7A00', '#9327FF', '#6E52FF', '#FC71FF', '#FFBB2B', '#1FD7C1', '#462F8A', '#0038FF'];

/**
 * DOM elements for contact form fields.
 */
let contactNameElem, contactEmailElem, contactPhoneElem;

/**
 * The currently selected index in the contact array.
 * @type {?number}
 */
let currentSelectedIndex = null;

/**
 * Indicates whether contact details are being shown.
 * @type {boolean}
 */
let isContactDetailsShown = false;

/**
 * Initializes the global variables for form elements.
 */
function initializeContactElements() {
    contactNameElem = document.getElementById('contactName');
    contactEmailElem = document.getElementById('contactEmail');
    contactPhoneElem = document.getElementById('contactPhone');
}

/**
 * Initializes the contact list by loading existing contacts and displaying them.
 */
async function initContact() {
    await loadContacts();
    await cleanUpContacts();
    renderContacts();
}

/**
* Loads the contact list from remote storage.
*/
async function loadContacts() {
    contacts = JSON.parse(await getItem('contacts'));
}

/**
 * Removes invalid or incomplete contacts from the contact list and resaves it.
 */
async function cleanUpContacts() {
    contacts = contacts.filter(contact => contact.nameOfContact && contact.emailOfContact && contact.telOfContact);
    await setItem('contacts', JSON.stringify(contacts));
    renderContacts();
}

/**
 * Sorts the contact list alphabetically by name.
 */
function sortContactsByName() {
    contacts.sort((a, b) => a.nameOfContact.localeCompare(b.nameOfContact));
}

/**
 * Creates a new contact based on form fields and adds it to the contact list.
 */
async function newContact() {
    initializeContactElements();

    let newContact = {
        nameOfContact: contactNameElem.value,
        emailOfContact: contactEmailElem.value,
        telOfContact: contactPhoneElem.value,
    };

    contacts.push(newContact);
    await setItem('contacts', JSON.stringify(contacts));

    resetContactField();
    closeOverlayAddContact();
    renderContacts();

    let newIndex = contacts.findIndex(contact => contact.nameOfContact === newContact.nameOfContact);
    showContactDetails(newIndex);
    overlayContactCreated();
}

/**
 * Resets the values of the contact form fields.
 */
function resetContactField() {
    contactNameElem.value = '';
    contactEmailElem.value = '';
    contactPhoneElem.value = '';
}

/**
 * Groups contacts by the first letter of their names.
 * @return {Object} An object with keys as first letters and values as arrays of contacts.
 */
function groupContactsByFirstLetter() {
    sortContactsByName();
    return contacts.reduce((groups, contact) => {
        const firstLetter = contact.nameOfContact[0].toUpperCase();
        if (!groups[firstLetter]) {
            groups[firstLetter] = [];
        }
        groups[firstLetter].push(contact);
        return groups;
    }, {});
}

/**
 * Renders the contacts in the UI.
 */
function renderContacts() {
    let allContacts = document.getElementById('allContacts');
    allContacts.innerHTML = '';

    // const groupedContacts = groupByFirstLetter(nameOfContact);
    const groupedContacts = groupContactsByFirstLetter();

    for (const firstLetter in groupedContacts) {
        allContacts.innerHTML += `
            <div class="frame112">
                <span>${firstLetter}</span>
            </div>
            <div class="frame119">
                <svg class="parting-line" fill="none" height="2" viewBox="0 0 354 2" width="354" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1H353" stroke="#D1D1D1" stroke-linecap="round"/>
                </svg>
            </div>`;

        groupedContacts[firstLetter].forEach((contact) => {
            const index = contacts.indexOf(contact);
            allContacts.innerHTML += showContact(contact.nameOfContact, index);
        });
    }
}

/**
 * Gets the initials from a full name.
 * @param {string} name - The full name of the contact.
 * @return {string} The initials of the name.
 */
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

/**
 * Gets a color based on an index.
 * @param {number} index - The index to determine the color.
 * @return {string} A hex color code.
 */
function getColorByIndex(index) {
    return colors[index % colors.length];
}

/**
 * Shows the contact information.
 * @param {string} name - The name of the contact.
 * @param {number} index - The index of the contact in the contacts array.
 * @return {string} HTML string representing the contact.
 */
function showContact(name, index) {
    const contact = contacts[index];
    const initials = getInitials(contact.nameOfContact);
    const color = getColorByIndex(index);

    return `
        <div class="contact-name contact-hover" id="contactNameBox${index}" onclick="showContactDetails(${index})">
            <div class="profile-badge contact-hover" id="profileBadge${index}" >
                <div class="group9" style="background-color: ${color};">${initials}</div> <!-- Verwendung der Initialen -->
                <div class="frame81">
                    <span class="contactName">${contact.nameOfContact}</span>
                    <span class="contactEmail">${contact.emailOfContact}</span>
                </div>
            </div>
        </div>`;
}

/**
 * Displays the details of a specific contact.
 * @param {number} i - The index of the contact in the contacts array.
 */
function showContactDetails(i) {
    // Wenn bereits ein Kontakt ausgewählt wurde, werden dessen Stile zurück
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

    renderContacts();

    let contactBox = document.getElementById(`contactNameBox${i}`);
    let innerContactBox = document.getElementById(`profileBadge${i}`);
    let contactName = document.querySelector(`#contactNameBox${i} .contactName`);

    if (contactBox && innerContactBox && contactName) {
        contactBox.style.background = '#2A3647';
        innerContactBox.style.background = '#2A3647';
        contactName.style.color = '#ffffff';
    }
    currentSelectedIndex = i;
    displayWindows(i);
    displayFloatingContactDetails(i);

    isContactDetailsShown = true;

    // Manuelles Auslösen eines resize Events
    window.dispatchEvent(new Event('resize'));
}

/**
 * Listens for window resize events and adjusts the display of windows based on the current size.
 */
window.addEventListener('resize', function () {
    displayWindows(currentSelectedIndex);
});

/**
 * Applies a set of CSS styles to a given DOM element.
 * @param {HTMLElement} element - The DOM element to which the styles will be applied.
 * @param {Object} styles - An object containing CSS properties and values.
 */
function applyStyles(element, styles) {
    Object.assign(element.style, styles);
}

/**
 * Resets the styles of a given DOM element by removing the 'style' attribute.
 * @param {HTMLElement} element - The DOM element whose styles will be reset.
 */
function resetStyles(element) {
    element.removeAttribute('style');
}

/**
 * Adjusts the layout and visibility of certain elements based on the window's width.
 */
function displayWindows() {
    let contactsHeader = document.getElementById('frame40');
    let floatingContact = document.getElementById('floatingContact');
    let allRenderedContacts = document.getElementById('frame97');
    let arrowLeft = document.getElementById('arrowLeft');

    if (window.innerWidth <= 990) {
        if (contactsHeader) {
            applyStyles(contactsHeader, {
                display: 'inline-flex',
                position: 'fixed',
                left: '0',
                right: '0',
                top: '96px',
                justifyContent: 'center'
            });
        }
        if (floatingContact) {
            applyStyles(floatingContact, {
                display: 'inline-flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: '21px',
                width: '650px',
                height: '364px',
                top: '330px',
                position: 'absolute',
                left: '50px'
            });
        }
        if (allRenderedContacts) {
            if (isContactDetailsShown) {
                applyStyles(allRenderedContacts, {
                    display: 'none'
                });
                applyStyles(arrowLeft, {
                    display: 'block'
                });
            } else {
                applyStyles(allRenderedContacts, {
                    display: 'inline-flex',
                });
            }
        }
    } else {
        if (contactsHeader) resetStyles(contactsHeader);
        if (floatingContact) resetStyles(floatingContact);
        if (allRenderedContacts) resetStyles(allRenderedContacts);
        if (arrowLeft) resetStyles(arrowLeft);
    }
}

/**
 * Creates and displays an overlay for adding a new contact.
 */
function overlayAddContact() {
    const overlay = document.createElement('div');
    overlay.id = 'overlayAddContact';
    document.body.appendChild(overlay);

    setTimeout(() => {
        overlay.style.transform = 'translateY(-50%) translateX(50%)';
    }, 50);

    addContact();
}

/**
 * Closes and clears the content of the 'Add Contact' overlay.
 */
function closeOverlayAddContact() {
    document.getElementById('overlayAddContact').innerHTML = '';
}

/**
 * Creates and displays a notification overlay when a contact is created.
 */
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

/**
 * Deletes a contact from the contacts array and updates the display.
 * @param {number} index - The index of the contact to be deleted.
 */
async function deleteContact(index) {
    if (index >= 0 && index < contacts.length) {
        // Kontakt aus dem Array entfernen
        contacts.splice(index, 1);

        // Die Änderungen zurück in den Remote-Speicher speichern
        await setItem('contacts', JSON.stringify(contacts));
        renderContacts();
        hideFloatingContact();
    }
}

/**
 * Saves the current contacts array to remote storage.
 */
async function pushBackArrays() {
    try {
        await setItem('contacts', JSON.stringify(contacts));
    } catch (error) {
        console.error("Error updating remote storage:", error);
    }
}

/**
 * Hides the floating contact details display.
 */
function hideFloatingContact() {
    let floatingContact = document.getElementById('floatingContact');
    floatingContact.classList.remove('show');
    floatingContact.innerHTML = '';
}

/**
 * Displays the overlay for editing a contact.
 * @param {string} name - The name of the contact being edited.
 * @param {number} index - The index of the contact in the contacts array.
 */
function overlayEditContact(name, index) {
    const overlay = document.createElement('div');
    overlay.id = 'overlayAddContact';
    document.body.appendChild(overlay);

    setTimeout(() => {
        overlay.style.transform = 'translateY(-50%) translateX(50%)';
    }, 50);

    editCreatedContact(name, index);
}

/**
 * Handles the editing process for a contact.
 * @param {number} index - The index of the contact to be edited.
 */
function editContact(index) {
    // Das overlayAddContact Overlay aufrufen
    overlayEditContact(contacts[index].nameOfContact, index);

    // Die Werte des aktuellen Kontakts in die Eingabefelder des Overlays setzen
    document.getElementById('contactName').value = contacts[index].nameOfContact;
    document.getElementById('contactEmail').value = contacts[index].emailOfContact;
    document.getElementById('contactPhone').value = contacts[index].telOfContact;
}

/**
 * Changes the border color of an input element based on its content.
 * @param {HTMLElement} inputElement - The input element whose border color will be changed.
 */
function changeBorderColor(inputElement) {
    const frame14Element = inputElement.closest('.frame14');

    if (inputElement.value) {
        frame14Element.style.borderColor = '#29ABE2';  // Ersetzt die 'desiredColor' durch die gewünschte Farbe
    } else {
        frame14Element.style.borderColor = '';  // Setzt den Rahmen zurück auf die ursprüngliche Farbe
    }
}

/**
 * Saves the edited contact details to the contacts array and updates the display.
 * @param {number} index - The index of the contact being edited.
 */
async function saveEditedContact(index) {
    // Die aktuellen Werte aus den Eingabefeldern holen
    const newName = document.getElementById('contactName').value;
    const newEmail = document.getElementById('contactEmail').value;
    const newPhone = document.getElementById('contactPhone').value;

    // Die Werte in den Arrays aktualisieren
    contacts[index].nameOfContact = newName;
    contacts[index].emailOfContact = newEmail;
    contacts[index].telOfContact = newPhone;

    // Die aktualisierten Arrays zurück in den Remote-Speicher speichern
    await pushBackArrays();

    // Das Overlay schließen und die Kontaktliste aktualisieren
    closeOverlayAddContact();
    renderContacts();
    showContactDetails(index);
}

/**
 * Loads and displays the initials of the user from local storage.
 */
function loadInitialsHeader() {
    let userInitials = localStorage.getItem('userInitials');
    // Wenn der Benutzer gefunden wird, setzen Sie die Initialen
    let initials = getInitials(userInitials);
    document.getElementById("profileInitials").innerHTML += `<span>${initials}</span>`;
}


