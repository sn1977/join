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

    const groupedContacts = groupContactsByFirstLetter();
    for (const firstLetter in groupedContacts) {
        allContacts.innerHTML += generateContactGroupHTML(firstLetter, groupedContacts[firstLetter]);
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
 * Resets the styles of the previously selected contact.
 */
function resetPreviousContactStyles() {
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
}

/**
 * Sets the styles for the currently selected contact.
 * @param {number} index - The index of the selected contact.
 */
function setCurrentContactStyles(index) {
    const contactBox = document.getElementById(`contactNameBox${index}`);
    const innerContactBox = document.getElementById(`profileBadge${index}`);
    const contactName = document.querySelector(`#contactNameBox${index} .contactName`);

    if (contactBox && innerContactBox && contactName) {
        contactBox.style.background = '#2A3647';
        innerContactBox.style.background = '#2A3647';
        contactName.style.color = '#ffffff';
    }
}

/**
 * Updates the UI to reflect the selection of a contact.
 * @param {number} index - The index of the selected contact.
 */
function updateUIForSelectedContact(index) {
    renderContacts();
    setCurrentContactStyles(index);
    displayWindows(index);
    displayFloatingContactDetails(index);
    isContactDetailsShown = true;
    window.dispatchEvent(new Event('resize')); // Manually trigger a resize event.
}

/**
 * Shows the details for a selected contact.
 * @param {number} i - The index of the selected contact.
 */
function showContactDetails(i) {
    resetPreviousContactStyles();
    currentSelectedIndex = i;
    updateUIForSelectedContact(i);

    // Setze die Anzeige des Kontakts auf wahr und aktualisiere das UI
    isContactDetailsShown = true;
    displayFloatingContactDetails(i);
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
 * Applies styles to the contacts header.
 * @param {boolean} isSmallScreen - Indicates if the screen is small.
 */
function styleContactsHeader(isSmallScreen) {
    const contactsHeader = document.getElementById('frame40');
    if (contactsHeader) {
        if (isSmallScreen) {
            applyStyles(contactsHeader, {
                display: 'inline-flex',
                position: 'fixed',
                left: '0',
                right: '0',
                top: '96px',
                justifyContent: 'center'
            });
        } else {
            resetStyles(contactsHeader);
        }
    }
}

/**
 * Applies styles to the floating contact element.
 * @param {boolean} isSmallScreen - Indicates if the screen is small.
 */
function styleFloatingContact(isSmallScreen) {
    const floatingContact = document.getElementById('floatingContact');
    if (floatingContact) {
        if (isSmallScreen) {
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
        } else {
            resetStyles(floatingContact);
        }
    }
}

/**
 * Applies styles to all rendered contacts.
 * @param {boolean} isSmallScreen - Indicates if the screen is small.
 */
function styleAllRenderedContacts(isSmallScreen) {
    const allRenderedContacts = document.getElementById('frame97');
    const arrowLeft = document.getElementById('arrowLeft');
    if (allRenderedContacts) {
        if (isSmallScreen) {
            if (isContactDetailsShown) {
                applyStyles(allRenderedContacts, { display: 'none' });
                applyStyles(arrowLeft, { display: 'flex' });
            } else {
                applyStyles(allRenderedContacts, { display: 'inline-flex' });
            }
        } else {
            resetStyles(allRenderedContacts);
            resetStyles(arrowLeft);
        }
    }
}

/**
 * Adjusts the window display based on screen size.
 */
function displayWindows() {
    const isSmallScreen = window.innerWidth <= 990;
    styleContactsHeader(isSmallScreen);
    styleFloatingContact(isSmallScreen);
    styleAllRenderedContacts(isSmallScreen);
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
 * Creates and initializes the overlay for contact creation.
 * @return {HTMLElement} The created overlay element.
 */
function initializeOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'overlayCreatedContact';
    document.body.appendChild(overlay);
    return overlay;
}

/**
 * Moves the overlay into view based on screen width.
 * @param {HTMLElement} overlay - The overlay element.
 */
function moveOverlayIntoView(overlay) {
    setTimeout(() => {
        if (window.innerWidth <= 990) {
            overlay.style.top = '70%'; // Position for smaller screens
        } else if (window.innerWidth <= 1250) {
            overlay.style.left = '650px'; // Position for medium screens
        } else {
            overlay.style.left = '743px'; // Default position
        }
    }, 50);
}

/**
 * Moves the overlay out of view after a delay.
 * @param {HTMLElement} overlay - The overlay element.
 */
function moveOverlayOutOfView(overlay) {
    setTimeout(() => {
        if (window.innerWidth <= 990) {
            overlay.style.top = '100%'; // Move down for smaller screens
        } else {
            overlay.style.left = '100%'; // Move right for larger screens
        }
    }, 3050);
}

/**
 * Creates and animates the overlay for contact creation.
 */
function overlayContactCreated() {
    const overlay = initializeOverlay();
    moveOverlayIntoView(overlay);
    moveOverlayOutOfView(overlay);
    addOverlayCreatedContact();
}


/**
 * Deletes a contact from the contacts array and updates the display.
 * @param {number} index - The index of the contact to be deleted.
 */
async function deleteContact(index) {
    if (index >= 0 && index < contacts.length) {
        // Remove contact from array
        contacts.splice(index, 1);

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
    overlayEditContact(contacts[index].nameOfContact, index);

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
        frame14Element.style.borderColor = '#29ABE2';
    } else {
        frame14Element.style.borderColor = '';
    }
}

/**
 * Saves the edited contact details to the contacts array and updates the display.
 * @param {number} index - The index of the contact being edited.
 */
async function saveEditedContact(index) {
    const newName = document.getElementById('contactName').value;
    const newEmail = document.getElementById('contactEmail').value;
    const newPhone = document.getElementById('contactPhone').value;

    contacts[index].nameOfContact = newName;
    contacts[index].emailOfContact = newEmail;
    contacts[index].telOfContact = newPhone;

    await pushBackArrays();

    closeOverlayAddContact();
    renderContacts();
    showContactDetails(index);
}

/**
 * Loads and displays the initials of the user from local storage.
 */
function loadInitialsHeader() {
    let userInitials = localStorage.getItem('userInitials');
    // If the user is found, put the initials
    let initials = getInitials(userInitials);
    document.getElementById("profileInitials").innerHTML += `<span>${initials}</span>`;
}


