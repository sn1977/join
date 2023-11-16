function addTaskLoadContactsBoard() {
    contactpoolBoard = [];
    for (let i = 0; i < contacts.length; i++) {
        let tempInitialien = getInitials(contacts[i].nameOfContact);
        let tempContactPool = {
            'id': i, // Die ID sollte eindeutig sein und mit der ID des zugehörigen HTML-Elements übereinstimmen
            'name': contacts[i].nameOfContact,
            'color': getColorByIndex(i),
            'initialien': tempInitialien
        }
        contactpoolBoard.push(tempContactPool);
    }
    contactpoolBoard.sort(SortArray);
}



function SortArray(x, y) {
    if (x.name < y.name) {
        return -1;
    }
    if (x.name > y.name) {
        return 1;
    }
    return 0;
}



function toggleContactsBoard() {
    const assignedToContainer = document.getElementById('assignedToContainer');
    const isHidden = assignedToContainer.classList.contains('d-none');

    // Wenn der Container ausgeblendet ist, aktualisieren Sie die angezeigten Kontakte
    if (isHidden) {
        filterContactsBoard(); // Aktualisieren Sie die angezeigten Kontakte basierend auf dem aktuellen Filter
        updateIconsBoard(contactpoolBoard); // Stellen Sie sicher, dass dies alle Kontakte berücksichtigt, nicht nur gefilterte
        showSelectedContacts(); // Aktualisieren Sie die ausgewählten Kontakte
    }

    // Hier wird die Klasse umgeschaltet, um die Liste zu zeigen oder zu verstecken.
    assignedToContainer.classList.toggle('d-none');
}

function setupSearchListener() {
    const searchField = document.getElementById('assignedTo'); // Stellen Sie sicher, dass dies die ID Ihres Suchfeldes ist
    if (searchField) {
        searchField.addEventListener('input', filterContactsBoard);
    } else {
        console.log('Suchfeld nicht gefunden');
    }
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

function filterContactsBoard() {
    const assignedToInputBoard = document.getElementById('assignedTo');
    const inputText = assignedToInputBoard.value.toLowerCase(); // Eingegebener Text in Kleinbuchstaben

    const filteredContacts = contactpoolBoard.filter(contact => contact.name.toLowerCase().includes(inputText));

    const contactsContainer = document.getElementById('assignedToContainer');
    contactsContainer.innerHTML = `
        <section id="assignedToContact">
            ${contactlistHtmlBoard(filteredContacts)}
        </section>
    `;
    // getIcon();
    updateIconsBoard(filteredContacts);
}


function updateIconsBoard(contacts) {
    contacts.forEach(contact => {
        let icon = document.getElementById(`checked${contact.id}`);
        if (icon) { // Stellen Sie sicher, dass das Element existiert
            // Überprüfen, ob der Kontakt in allContactsBoard vorhanden ist
            const isContactChosen = allContactsBoard.some(ac => ac.contactid === contact.id);

            if (isContactChosen) {
                icon.innerHTML = `<img src="../assets/img/checked.svg" alt="Assigned">`; // Pfad zum "Haken" Bild
                icon.parentNode.classList.add('Contactchecked');
            } else {
                icon.innerHTML = `<img src="../assets/img/checkbox.png" alt="Not assigned">`; // Pfad zum "Checkbox" Bild
                icon.parentNode.classList.remove('Contactchecked');
            }
        }
    });
}



function contactlistHtmlBoard(contacts) {
    let contacthtml = '';
    for (let i = 0; i < contacts.length; i++) {
        contacthtml += ` 
        <div class="contactLine" onclick="toggleContactBoard(${contacts[i].id})">
                <div class="contact">
                    <div class="contacticon" style="background-color:  ${contacts[i].color};"> 
                        ${contacts[i].initialien}
                    </div>
                    <div class="contactName"> 
                        ${contacts[i].name} 
                    </div>
                </div>
                <div class="contactImage" id="checked${contacts[i].id}">
                    <img src="../assets/img/checkbox.png">
                </div>
            </div>
        `;
    }

    return contacthtml;
}

function toggleContactBoard(contactId) {
    const contactIsChosen = allContactsBoard.some(contact => contact.contactid === contactId);
    if (contactIsChosen) {
        unchoseContactBoard(contactId);
    } else {
        choseContactBoard(contactId);
    }
}


async function choseContactBoard(contactId) {
    // Finde den Kontakt im Pool
    const contact = contactpoolBoard.find(contact => contact.id === contactId);

    // Überprüfen, ob der Kontakt bereits in allContactsBoard existiert
    const isContactAlreadyChosen = allContactsBoard.some(c => c.contactid === contactId);

    // Wenn der Kontakt gefunden wurde und nicht bereits in allContactsBoard existiert
    if (contact && !isContactAlreadyChosen) {
        // Erstelle eine Kopie des Kontakts für allContactsBoard
        const tempContact = {
            'contactid': contact.id,
            'name': contact.name,
            'color': contact.color,
            'initialien': contact.initialien
        };

        // Füge den Kontakt zu allContactsBoard hinzu
        allContactsBoard.push(tempContact);

        // Aktualisiere die Anzeige für diesen Kontakt
        updateContactDisplay(contactId, true);
        showTaskContactsBoard();

    } else {
        console.log("Der Kontakt wurde schon ausgewählt oder existiert nicht.");
    }

}



function unchoseContactBoard(contactId) {
    const indexToRemove = allContactsBoard.findIndex(contact => contact.contactid === contactId);
    if (indexToRemove !== -1) {
        allContactsBoard.splice(indexToRemove, 1);

        updateContactDisplay(contactId, false); // UI aktualisieren
        showTaskContactsBoard();
    }
}


function updateContactDisplay(contactId) {
    const contactCheckbox = document.getElementById(`checked${contactId}`);
    if (!contactCheckbox) return; // Stelle sicher, dass das Element existiert

    // Überprüfen, ob der Kontakt in allContactsBoard vorhanden ist
    const isContactChosen = allContactsBoard.some(contact => contact.contactid === contactId);

    const imageSrc = isContactChosen ? "../assets/img/checked.svg" : "../assets/img/checkbox.png";
    contactCheckbox.innerHTML = `<img src="${imageSrc}" alt="">`;
    contactCheckbox.parentNode.classList.toggle('Contactchecked', isContactChosen);
}





/**
 * This function finds the max id and retrun a task id for the new added task
 * 
 * @returns 
 * 
 */
/* async function getLastID() {
    let maxID = 0;
    // Finde die maximale ID in den vorhandenen Aufgaben
    for (const task of todos) {
        if (task.id > maxID) {
            maxID = task.id;
        }
    }
    if (maxID > 0) {
        id = maxID + 1;
    } else {
        id = 1;
    }
} */


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