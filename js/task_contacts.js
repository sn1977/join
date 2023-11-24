/**
 * @author Christiane
 * Join Gruppenarbeit 727
 * November 2023
 * 
 * functions to show, add and assigned contacts
 * 
 * 
 */
let allContacts = [];
let contactpool = [];
let filteredContacts = [];



/**
 * this function opens and closes the list of assignable names in the user's contacts
 * 
 * @todo
 * 
 */
function toggleContacts() {
    document.getElementById('assignedToContainer').classList.toggle('d-none');
}



/**
 * function to load the contacts and push them in to an array
 * 
 * @todo
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
    // contactpool.sort(SortArray);
    contactpool.sort((a, b) => a.name.localeCompare(b.name));
}




/**
 * function
 * 
 * @todo
 * 
 *   <div class="contactLine" onclick="toggleContact(${contacts[i].id}, event)">
 * 
 */
function contactlistHtml(contacts) {
    let contacthtml = '';
    for (let i = 0; i < contacts.length; i++) {
        contacthtml += ` 
          
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
 * function to filter the contacts if a search value is input, otherwise the full contactlist
 * 
 * @todo
 * 
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
    contactsContainer.innerHTML = `
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


function addTaskGetContacts() {
    let assignedcontacts = document.getElementById('assignedToContainer');
    assignedcontacts.innerHTML = `
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
 * 
 * function to chose or unchose a contact
 * 
 * @param {*} contactId 
 * @param {*} event 
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




function showTaskContacts() {
    let contactsIcons = document.getElementById('showAssignedContacts');
    contactsIcons.innerHTML = '';
    for (let i = 0; i < allContacts.length; i++) {
        contactsIcons.innerHTML += `
                <div class="contacticon" style="background-color:  ${allContacts[i]['color']};"> 
                    ${allContacts[i]['initialien']}
                </div>
        `;
    }
}


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
        // Der Kontakt ist bereits ausgewählt / nur für Testzwecke, sollte nie erreicht werden
        alert("Kontakt bereits ausgewählt.");
    }
}


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




function removeContactFromArray(contactName) {
    loadAllTasks();
    for (let i = 0; i < tasks.length; i++) {
        const item = tasks[i];
        if (item.assignedTo) {
            for (let j = 0; j < item.assignedTo.length; j++) {
                if (item.assignedTo[j].name === contactName) {
                    // Der Kontakt wurde gefunden, lösche ihn aus dem Array
                    item.assignedTo.splice(j, 1);
                    return;
                }
            }
        }
    }
}


function changeMarkedContact(i) {
    const contactCheckbox = document.getElementById(`checked${i}`);
    contactCheckbox.innerHTML = `
        <img src="../assets/img/check_button_white.svg" alt="">
    `;
    contactCheckbox.parentNode.classList.add('checked');
}







async function newContact() {
    initializeContactElements();
    console.log('nameOfContact:', contactNameElem.value);
    console.log('emailOfContact:', contactEmailElem.value);
    console.log('telOfContact:', contactPhoneElem.value);

    // Neuen Kontakt erstellen
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