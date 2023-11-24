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