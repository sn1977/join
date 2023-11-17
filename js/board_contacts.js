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
    if (isHidden) {
        filterContactsBoard();
        updateIconsBoard(contactpoolBoard);
        showSelectedContacts();
    }
    assignedToContainer.classList.toggle('d-none');
}

function setupSearchListener() {
    const searchField = document.getElementById('assignedTo');
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
    } else {
        console.log("Der Kontakt wurde schon ausgewählt oder existiert nicht.");
    }
}

function unchoseContactBoard(contactId) {
    const indexToRemove = allContactsBoard.findIndex(contact => contact.contactid === contactId);
    if (indexToRemove !== -1) {
        allContactsBoard.splice(indexToRemove, 1);
        updateContactDisplay(contactId, false);
        showTaskContactsBoard();
    }
}

function updateContactDisplay(contactId) {
    const contactCheckbox = document.getElementById(`checked${contactId}`);
    if (!contactCheckbox) return;
    const isContactChosen = allContactsBoard.some(contact => contact.contactid === contactId);
    const imageSrc = isContactChosen ? "../assets/img/checked.svg" : "../assets/img/checkbox.png";
    contactCheckbox.innerHTML = `<img src="${imageSrc}" alt="">`;
    contactCheckbox.parentNode.classList.toggle('Contactchecked', isContactChosen);
}

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