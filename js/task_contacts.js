/**
 * Author: Christiane
 * Join Gruppenarbeit 727
 * November 2023
 *
 * Functions to show, add, and assign contacts.
 *
 * @namespace
 */


/**
 * Array containing all contacts, contact pool, filtered contacts
 *
 * @type {Array<Object>}
 */
let allContacts = [];
let contactpool = [];
let filteredContacts = [];


/**
 * Function to toggle the visibility of the list of assignable names in the user's contacts
 *
 * @function
 * @name toggleContacts
 * @todo Implement functionality.
 * @returns {void}
 * 
 */
function toggleContacts() {
    document.getElementById('assignedToContainer').classList.toggle('d-none');
}


/**
 * Function to load contacts and push them into an array
 *
 * @async
 * @function
 * @name addTaskLoadContacts
 * @todo Implement functionality.
 * @returns {Promise<void>}
 * 
 */
async function addTaskLoadContacts() {
    await loadContacts();
    contactpool = [];
    for (let i = 0; i < contacts.length; i++) {
        let tempInitialien = getInitials(contacts[i].nameOfContact);
        let tempContactPool = {
            'id': i,
            'name': contacts[i].nameOfContact,
            'color': getColorByIndex(i),
            'initialien': tempInitialien,
            'assigned': false
        }
        contactpool.push(tempContactPool);
    }
    contactpool.sort((a, b) => a.name.localeCompare(b.name));
}


/**
 * Function to generate HTML for the contact list 
 *
 * @function
 * @name contactlistHtml
 * @param {Array<Object>} contacts - The array of contacts to display 
 * @todo Implement functionality 
 * @returns {string} - The generated HTML string 
 * 
 */
function contactlistHtml(contacts) {
    let contacthtml = '';
    for (let i = 0; i < contacts.length; i++) {
        contacthtml += /*HTML*/ `  
        <div class="contactLine" data-contactid="${contacts[i].id}" onclick="toggleContact(${contacts[i].id}, event)">
                <div class="contact">
                    <div class="contacticon" style="background-color:  ${contacts[i].color};"> 
                        ${contacts[i].initialien}
                    </div>
                    <div> 
                        ${contacts[i].name} 
                    </div>
                </div>
                <div id="checked${contacts[i].id}">
                    <img src="../assets/img/checkbox.png" alt="">
                </div>
            </div>
        `;
    }
    return contacthtml;
}


/**
 * Function to filter contacts based on user input 
 *
 * @function
 * @name filterContacts
 * @todo Implement functionality 
 * @returns {void}
 * 
 */
function filterContacts() {
    const assignedToInput = document.getElementById('assignedTo');
    const inputText = assignedToInput.value.toLowerCase();
    if (inputText === '') {
        filteredContacts = contactpool;
    } else {
        filteredContacts = contactpool.filter(contact => contact.name.toLowerCase().includes(inputText));
    }
    const contactsContainer = document.getElementById('assignedToContainer');
    contactsContainer.innerHTML = /*HTML*/ `
                <section id="assignedToContact">
                    ${contactlistHtml(filteredContacts)}
                </section>
                <button class="createContactBtn"  onclick="overlayAddContact()">
                    Add new contact
                    <img class="addContact" src="../assets/img/person_add.svg" alt="Add Contact">
                </button>
            `;
    updateIcons(filteredContacts);
}


/**
 * Function to update the contact pool 
 *
 * @function
 * @name updateContactPool
 * @todo Implement functionality 
 * @returns {void}
 * 
 */
async function updateContactPool() {
    let i = contacts.length - 1;
    let tempInitialien = getInitials(contacts[i].nameOfContact);
    let tempContactPool = {
        'id': i,
        'name': contacts[i].nameOfContact,
        'color': getColorByIndex(i),
        'initialien': tempInitialien,
        'assigned': false
    };
    const isAssigned = allContacts.some(contact => contact.name === tempContactPool.name);
    if (isAssigned) {
        tempContactPool.assigned = true;
    }
    contactpool.push(tempContactPool);
    contactpool.sort((a, b) => a.name.localeCompare(b.name));
    filterContacts();
}


/**
 * Function to update contact icons based on their assignment status 
 *
 * @function
 * @name updateIcons
 * @param {Array<Object>} filteredContacts - The array of filtered contacts 
 * @returns {void}
 * 
 */
function updateIcons(filteredContacts) {
    for (let i = 0; i < filteredContacts.length; i++) {
        let icon = document.getElementById(`checked${filteredContacts[i].id}`);
        if (filteredContacts[i].assigned) {
            icon.innerHTML = `<img src="../assets/img/check_button_white.svg" alt="">`;
            icon.parentNode.classList.add('checked');
        } else {
            icon.innerHTML = `<img src="../assets/img/checkbox.png" alt="">`;
            icon.parentNode.classList.remove('checked');
        }
    }
}


/**
 * Function to display assigned contacts 
 *
 * @function
 * @name addTaskGetContacts
 * @todo Implement functionality 
 * @returns {void}
 * 
 */
function addTaskGetContacts() {
    let assignedcontacts = document.getElementById('assignedToContainer');
    assignedcontacts.innerHTML = /*HTML*/ `
        <section id="assignedToContact">
            ${contactlistHtml(filteredContacts)}
        </section>       
        <button class="createContactBtn"  onclick="overlayAddContact()">
            Add new contact
            <img class="addContact" src="../assets/img/person_add.svg" alt="Add Contact">
        </button>
        `;
    updateIcons(filteredContacts);
}


/**
 * Function to toggle the selection of a contact 
 *
 * @function
 * @name toggleContact
 * @param {*} contactId - The ID of the contact 
 * @param {Event} event - The click event 
 * @returns {void}
 * 
 */
function toggleContact(contactId, event) {
    const filteredContact = filteredContacts.find(contact => contact.id === contactId);
    if (filteredContact) {
        const originalIndex = contactpool.findIndex(contact => contact.id === filteredContact.id);
        if (originalIndex !== -1) {
            contactpool[originalIndex]['assigned'] ? unchoseContact(originalIndex) : choseContact(originalIndex);
            updateIcons(filteredContacts);
        }
    }
    event.stopPropagation();
}


/**
 * Function to display assigned contacts with icons 
 *
 * @function
 * @name showTaskContacts
 * @returns {void}
 * 
 */
function showTaskContacts() {
    let contactsIcons = document.getElementById('showAssignedContacts');
    contactsIcons.innerHTML = '';
    let counter = allContacts.length;
    for (let i = 0; i < counter; i++) {    
        if (counter > 10) {
            contactsIcons.innerHTML += /*HTML*/ `
            <div class="contacticon" style="background-color:  ${allContacts[i]['color']};"> 
                ${allContacts[i]['initialien']}
            </div>
            <div class="contacticon" style="background-color: black;" onclick="expandContacts()"> 
                +${counter-1}
            </div>
            `;
            i = counter;
            } else if ( counter > 6){
                i = counter;
                expandContacts();
            } else {
            contactsIcons.innerHTML += /*HTML*/ `
            <div class="contacticon" style="background-color:  ${allContacts[i]['color']};"> 
                ${allContacts[i]['initialien']}
            </div>
        `;
        }
    }
}


/**
 * Function to expand assigned contacts with icons when assigned contacts over 10
 *
 * @function
 * @returns {void}
 * 
 */
function expandContacts() {
    let contactsIcons = document.getElementById('showAssignedContacts');
    contactsIcons.innerHTML = '';
    let counter = allContacts.length;
    for (let i = 0; i < counter; i++) {
        contactsIcons.innerHTML += /*HTML*/ `
            <div class="contacticon extra-margin" style="background-color: ${allContacts[i]['color']};"> 
                ${allContacts[i]['initialien']}
            </div>
        `;
    }
}



/**
 * Function to choose a contact 
 *
 * @function
 * @name choseContact
 * @param {number} i - The index of the contact 
 * @returns {void}
 * 
 */
function choseContact(i) {
    if (!contactpool[i]['assigned']) {
        const tempContact = {
            'id': id,
            'contactid': i,
            'name': contactpool[i]['name'],
            'color': contactpool[i]['color'],
            'initialien': contactpool[i]['initialien']
        };
        allContacts.push(tempContact);
        contactpool[i]['assigned'] = true;
        changeMarkedContact(i);
        showTaskContacts();
    } else {
        alert("Kontakt bereits ausgewählt.");
    }
}


/**
 * Function to unchoose a contact 
 *
 * @function
 * @name unchoseContact
 * @param {number} i - The index of the contact 
 * @returns {void}
 * 
 */
function unchoseContact(i) {   
    const contactCheckbox = document.getElementById(`checked${i}`);
    if (contactCheckbox) {
        contactCheckbox.innerHTML = `
            <img src="../assets/img/checkbox.png" alt="">
        `;
        contactCheckbox.parentNode.classList.remove('checked');
        const suche = allContacts.map(el => el.contactid);
        let x = suche.indexOf(i);
        allContacts.splice(x, 1);
        contactpool[i]['assigned'] = false;
        showTaskContacts();
    } 
}


/**
 * Function to remove a contact from an array 
 *
 * @function
 * @name removeContactFromArray
 * @param {string} contactName - The name of the contact to be removed 
 * @returns {void}
 * 
 */
function removeContactFromArray(contactName) {
    loadAllTasks();
    for (let i = 0; i < tasks.length; i++) {
        const item = tasks[i];
        if (item.assignedTo) {
            for (let j = 0; j < item.assignedTo.length; j++) {
                if (item.assignedTo[j].name === contactName) {
                    item.assignedTo.splice(j, 1);
                    return;
                }
            }
        }
    }
}


/**
 * Function to change the marked status of a contact 
 *
 * @function
 * @name changeMarkedContact
 * @param {number} i - The index of the contact 
 * @returns {void}
 * 
 */
function changeMarkedContact(i) {
    const contactCheckbox = document.getElementById(`checked${i}`);
    contactCheckbox.innerHTML = `
        <img src="../assets/img/check_button_white.svg" alt="">
    `;
    contactCheckbox.parentNode.classList.add('checked');
}


/**
 * Function to create a new contact 
 *
 * @async
 * @function
 * @name newContact
 * @todo Implement functionality 
 * @returns {Promise<void>}
 * 
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
    closeOverlayAddContact();
    overlayContactCreated();
    updateContactPool();
}