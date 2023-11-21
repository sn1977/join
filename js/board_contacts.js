/**
 * Loads and sorts the contacts into the board for the task addition process.
 */
function addTaskLoadContactsBoard() {
    contactpoolBoard = [];
    for (let i = 0; i < contacts.length; i++) {
        let tempInitialien = getInitials(contacts[i].nameOfContact);
        let tempContactPool = {
            'id': i,
            'name': contacts[i].nameOfContact,
            'color': getColorByIndex(i),
            'initialien': tempInitialien
        }
        contactpoolBoard.push(tempContactPool);
    }
    contactpoolBoard.sort(SortArray);
}


/**
 * Sorts an array of objects alphabetically based on the 'name' property.
 * @param {Object} x - The first object to compare.
 * @param {Object} y - The second object to compare.
 * @returns {number} A value determining the order of the objects.
 */
function SortArray(x, y) {
    if (x.name < y.name) {
        return -1;
    }
    if (x.name > y.name) {
        return 1;
    }
    return 0;
}


/**
 * Toggles the display of the contacts board.
 * Filters and updates the contacts board each time it's displayed.
 */
function toggleContactsBoard() {
    const assignedToContainer = document.getElementById('assignedToContainer');
    const isHidden = assignedToContainer.classList.contains('d-none');
    if (isHidden) {
        filterContactsBoard();
        updateIconsBoard(contactpoolBoard);
        showSelectedContacts();
    }
    assignedToContainer.classList.toggle('d-none');
}


/**
 * Sets up a listener for the search field to filter contacts in real-time.
 */
function setupSearchListener() {
    const searchField = document.getElementById('assignedTo');
    if (searchField) {
        searchField.addEventListener('input', filterContactsBoard);
    }
}


/**
 * Generates initials from a given name.
 * @param {string} name - The name to generate initials from.
 * @returns {string} The initials of the name.
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
 * Provides a color from a predefined array based on the given index.
 * @param {number} index - The index to determine which color to return.
 * @returns {string} The color associated with the given index.
 */
function getColorByIndex(index) {
    return colors[index % colors.length];
}


/**
 * Filters the contacts displayed on the board based on user input in the search field.
 */
function filterContactsBoard() {
    const assignedToInputBoard = document.getElementById('assignedTo');
    const inputText = assignedToInputBoard.value.toLowerCase();
    const filteredContacts = contactpoolBoard.filter(contact => contact.name.toLowerCase().includes(inputText));
    const contactsContainer = document.getElementById('assignedToContainer');
    contactsContainer.innerHTML = `
        <section id="assignedToContact">
            ${contactlistHtmlBoard(filteredContacts)}
        </section>
    `;
    updateIconsBoard(filteredContacts);
}


/**
 * Updates the selection icons for contacts based on their selection status.
 * @param {Array} contacts - The list of contacts to update icons for.
 */
function updateIconsBoard(contacts) {
    contacts.forEach(contact => {
        let icon = document.getElementById(`checked${contact.id}`);
        if (icon) {
            const isContactChosen = allContactsBoard.some(ac => ac.contactid === contact.id);
            if (isContactChosen) {
                icon.innerHTML = `<img src="../assets/img/checked.svg" alt="Assigned">`;
                icon.parentNode.classList.add('Contactchecked');
            } else {
                icon.innerHTML = `<img src="../assets/img/checkbox.png" alt="Not assigned">`;
                icon.parentNode.classList.remove('Contactchecked');
            }
        }
    });
}


/**
 * Generates the HTML content for a list of contacts.
 * @param {Array} contacts - The list of contacts to generate HTML for.
 * @returns {string} The HTML content for the contacts list.
 */
function contactlistHtmlBoard(contacts) {
    let contacthtml = '';
    for (let i = 0; i < contacts.length; i++) {
        contacthtml += contactHtml(contacts[i]);
    }
    return contacthtml;
}


/**
 * Toggles the selection state of a contact in the task assignment process.
 * @param {number} contactId - The ID of the contact to toggle.
 */
function toggleContactBoard(contactId) {
    const contactIsChosen = allContactsBoard.some(contact => contact.contactid === contactId);
    if (contactIsChosen) {
        unchoseContactBoard(contactId);
    } else {
        choseContactBoard(contactId);
    }
}


/**
 * Selects a contact to be assigned to a task.
 * @param {number} contactId - The ID of the contact to be selected.
 */
async function choseContactBoard(contactId) {
    const contact = contactpoolBoard.find(contact => contact.id === contactId);
    const isContactAlreadyChosen = allContactsBoard.some(c => c.contactid === contactId);
    if (contact && !isContactAlreadyChosen) {
        const tempContact = {
            'contactid': contact.id,
            'name': contact.name,
            'color': contact.color,
            'initialien': contact.initialien
        };
        allContactsBoard.push(tempContact);
        updateContactDisplay(contactId, true);
        showTaskContactsBoard();
    }
}


/**
 * Removes a selected contact from the task assignment.
 * @param {number} contactId - The ID of the contact to be unselected.
 */
function unchoseContactBoard(contactId) {
    const indexToRemove = allContactsBoard.findIndex(contact => contact.contactid === contactId);
    if (indexToRemove !== -1) {
        allContactsBoard.splice(indexToRemove, 1);
        updateContactDisplay(contactId, false);
        showTaskContactsBoard();
    }
}


/**
 * Updates the display of a contact's selection status.
 * @param {number} contactId - The ID of the contact whose display is to be updated.
 */
function updateContactDisplay(contactId) {
    const contactCheckbox = document.getElementById(`checked${contactId}`);
    if (!contactCheckbox) return;
    const isContactChosen = allContactsBoard.some(contact => contact.contactid === contactId);
    const imageSrc = isContactChosen ? "../assets/img/checked.svg" : "../assets/img/checkbox.png";
    contactCheckbox.innerHTML = `<img src="${imageSrc}" alt="">`;
    contactCheckbox.parentNode.classList.toggle('Contactchecked', isContactChosen);
}


/**
 * Shows the icons of selected contacts for a task.
 */
function showTaskContactsBoard() {
    let contactsIcons = document.getElementById('showAssignedContacts');
    contactsIcons.innerHTML = '';
    for (let i = 0; i < allContactsBoard.length; i++) {
        contactsIcons.innerHTML += `
                <div class="contacticon" style="background-color:  ${allContactsBoard[i]['color']};"> 
                    ${allContactsBoard[i]['initialien']}
                </div>
        `;
    }
}


/**
 * Displays the selected contacts for the task.
 */
function showSelectedContacts() {
    let selectedContactsContainer = document.getElementById('showAssignedContacts');
    selectedContactsContainer.innerHTML = '';
    for (let i = 0; i < allContactsBoard.length; i++) {
        selectedContactsContainer.innerHTML += `
            <div class="contacticon" style="background-color: ${allContactsBoard[i].color};"> 
                ${allContactsBoard[i].initialien}
            </div>
        `;
    }
}