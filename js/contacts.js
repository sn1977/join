let nameOfContact = ['Anton Mayer', 'Alfred Müller', 'Beate Müller'];
let emailOfContact = ['anton@gmail.com', 'alfred@gmail.com', 'beate@gmail.com'];

function groupByFirstLetter(names) {
    return names.reduce((groups, name) => {
        const firstLetter = name[0].toUpperCase();
        if (!groups[firstLetter]) {
            groups[firstLetter] = [];
        }
        groups[firstLetter].push(name);
        return groups;
    }, {});
}

function renderContacts() {
    let allContacts = document.getElementById('allContacts');
    allContacts.innerHTML = ''; // Vor dem Hinzufügen von Kontakten löschen

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

function showContactDetails(i) {
    let contactBox = document.getElementById(`contactNameBox${i}`);
    let innerContactBox = document.getElementById(`profileBadge${i}`);
    let contactName = document.querySelector(`#contactNameBox${i} .contactName`); // Da es eine Klasse ist, verwenden wir querySelector

    if (contactBox && innerContactBox && contactName) {
        contactBox.style.background = '#2A3647';
        innerContactBox.style.background = '#2A3647';
        contactName.style.color = '#ffffff';
    }
}

function showContact(name, index) {
    return `
        <div class="contact-name" id="contactNameBox${index}" onclick="showContactDetails(${index})">
            <div class="profile-badge" id="profileBadge${index}">
                <div class="group9">${name.substring(0,2).toUpperCase()}</div>
                <div class="frame81">
                    <span class="contactName">${name}</span>
                    <span class="contactEmail">${emailOfContact[index]}</span>
                </div>
            </div>
        </div>`;
}



