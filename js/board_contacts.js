/**
 * @author Patrick
 * Join Gruppenarbeit 727
 * October 2023
 * 
 */

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
            const isContactChosen = allContactsBoard.some(ac => ac.name === contact.name);
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
 * @param {string} contactName - The name of the contact to toggle.
 */
function toggleContactBoard(contactName) {
    const contactIsChosen = allContactsBoard.some(contact => contact.name === contactName);
    if (contactIsChosen) {
        unchoseContactBoard(contactName);
    } else {
        choseContactBoard(contactName);
    }
}


/**
 * Selects a contact to be assigned to a task.
 * @param {string} contactName - The name of the contact to be selectetd.
 */
async function choseContactBoard(contactName) {
    const contact = contactpoolBoard.find(contact => contact.name === contactName);
    const isContactAlreadyChosen = allContactsBoard.some(c => c.name === contactName);
    if (contact && !isContactAlreadyChosen) {
        const tempContact = {
            'contactid': contact.id,
            'name': contact.name,
            'color': contact.color,
            'initialien': contact.initialien
        };
        allContactsBoard.push(tempContact);
        updateContactDisplay(contactName, true);
        showTaskContactsBoard();
    }
}


/**
 * Removes a contact from the selected contacts for a task.
 * @param {string} contactName - The name of the contact to remove.
 */
function unchoseContactBoard(contactName) {
    const indexToRemove = allContactsBoard.findIndex(contact => contact.name === contactName);
    if (indexToRemove !== -1) {
        allContactsBoard.splice(indexToRemove, 1);
        updateContactDisplay(contactName, false); // Stellt sicher, dass dies aufgerufen wird
        showTaskContactsBoard();
    }
}


/**
 * Updates the display of a specific contact in the contact list, reflecting its selected or unselected status.
 * @param {string} contactName - The name of the contact whose display is to be updated.
 * @param {boolean} isSelected - A flag indicating whether the contact is selected or not.
 */
function updateContactDisplay(contactName, isSelected) {
    const contact = contactpoolBoard.find(contact => contact.name === contactName);
    if (contact) {
        const contactCheckbox = document.getElementById(`checked${contact.id}`);
        if (contactCheckbox) {
            const checkboxImage = contactCheckbox.querySelector('img');
            if (checkboxImage) {
                checkboxImage.src = isSelected ? "../assets/img/checked.svg" : "../assets/img/checkbox.png";
                checkboxImage.alt = isSelected ? "Assigned" : "Not assigned";
            }
            contactCheckbox.parentNode.classList.toggle('Contactchecked', isSelected);
        }
    }
}


/**
 * Displays the selected contacts as icons in a designated area, indicating who has been assigned to a task.
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
 * Displays the icons of selected contacts for a task in a designated area.
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