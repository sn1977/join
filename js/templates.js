/**
 * Generates and displays the login template in the 'logInTemplate' HTML element.
 */
function logInTemplate() {
    let logInTemplate = document.getElementById('logInTemplate');
    logInTemplate.innerHTML = ` 
        <div class="frame153">
            <div class="frame159">
                <h1>Log in</h1>
            <div class="underline"></div>
            </div>
            <form onsubmit="return login();">
                <div class="frame250">
                    <div class="login">
                        <div class="frame155">
                            <div class="frame14"  id="loginEmail">
                                <div class="frame157">
                                    <input class="input-login" id="loginMail" placeholder="Email" required type="email">                                    
                                <div>
                                <img alt="Email" class="img-email" src="../assets/img/mail.png">
                           </div>
                        </div>
                    </div>
                </div>
                <div class="div-156">
                    <div class="frame14" id="loginPassword">
                        <div class="frame158">                                       
                            <input class="input-login input-asterisk" id="password-login" oninput="updatePasswordIcon('password-login', '.img-lock')" placeholder="Password" required type="password">                                       
                        <div class="password-toggle" onclick="togglePasswordVisibility('password-login', '.toggle-icon')">
                        <img alt="password" class="img-lock toggle-icon" data-for="password-login" src="../assets/img/lock.png">
                    </div>
                </div>
            </div>
        </div>
        <div class="remember-password">
            <input id="pw-checkbox" name="pw-checkbox" type="checkbox">
            <label for="pw-checkbox" onclick="checkboxChange()">
                <img alt="Unchecked Icon" class="icon-unchecked" src="../assets/img/checkbox.png">
                <img alt="Checked Icon" class="icon-checked" src="../assets/img/checkedIcon.png">
                Remember me
            </label>
        </div>
                        </div>
                        <div class="frame176">
                            <button class="btn-login" onclick="login(event)" type="submit">Log in</button>
                            <button class="btn-guest" onclick="guestLogin()">Guest Log in</button>
                        </div>
                    </div>
    			</form>
    		</div>`;
}

/**
 * Generates and displays the sign-up template in the 'logInTemplate' HTML element.
 */
function signUpTemplate() {
    emptyLogInTemplate();
    let signUpTemplate = document.getElementById('logInTemplate');
    signUpTemplate.innerHTML = `
        <div id="signUp-container">
            <div class="frame159-2">
                <h1>Sign up</h1>
                <div class="underline"></div>
            </div>
            <form onsubmit="return comparePasswords(event);">
                <div class="frame212">
                    <div class="frame160">
                        <div class="frame155">
                            <div class="frame14">
                                <div class="frame157">
                                    <input id="name" class="input-login" placeholder="Name" required type="text" minlength="5">
                                    <img alt="Email" class="img-person" src="../assets/img/person.png">
                                </div>
                            </div>
                        </div>
                        <div class="frame155">
                            <div class="frame14" id="signUpEmail">
                                <div class="frame157">
                                    <input id="email" class="input-login" placeholder="Email" required type="email">
                                    <img alt="Email" class="img-email" src="../assets/img/mail.png">
                                </div>
                            </div>
                        </div>
                        <div class="frame155">
                            <div class="frame14-signUp">
                                <div class="frame158">
                                    <input required class="input-login input-asterisk" id="password" oninput="updatePasswordIcon('password', '.img-lock')"
                                            placeholder="Password" type="password">
                                    <div class="password-toggle" onclick="togglePasswordVisibility('password', '.toggle-icon')">
                                        <img alt="password" class="img-lock toggle-icon" src="../assets/img/lock.png" data-for="password">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="div-156">
                            <div class="frame14-signUp" id="signUPControl">
                                <div class="frame158">
                                    <input required class="input-login input-asterisk" id="password-signup" oninput="updatePasswordIcon('password-signup', '.img-lock')"
                                            placeholder="Confirm Password" type="password">
                                    <div class="password-toggle" onclick="togglePasswordVisibility('password-signup', '.toggle-icon')">
                                        <img alt="password" class="img-lock toggle-icon" src="../assets/img/lock.png" data-for="password-signup">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="privacy-policy-check">
                        <input id="privacy-checkbox" name="privacy-checkbox" type="checkbox">
                        <label for="privacy-checkbox" onclick="privacyCheckboxChange()">
                            <img alt="Unchecked Icon" class="icon-unchecked" src="../assets/img/checkbox.png">
                            <img alt="Checked Icon" class="icon-checked" src="../assets/img/checkedIcon.png">
                            <span class="label-privacy-policy">I accept the</span> 
                            <button type="button" id="btn-privacy-policy" onclick="redirectToPrivacyPolicy()">Privacy Policy</button>
                        </label>
                    </div>
                    <div class="btn-signup-container">
                        <button id="btn-signup" type="submit">Sign up</button>
                    </div>
                </div>
                <div class="arrow-left-line">
                    <img src="../assets/img/arrow-left.png" alt="arrow-left" class="arrow-left" onclick="showLogIn()">
                </div>
            </form>
        </div>
    `;
}

/**
 * Flag to track if it's the first call to display the floating contact details.
 */
let isFirstCall = true;

/**
 * Displays the floating contact details.
 * If it's the first call, it directly shows the contact details.
 * If not, it first hides the current details, updates the content, and then shows the new details.
 * @param {number} index - The index of the contact in the contacts array.
 */
function displayFloatingContactDetails(index) {
    let floatingContact = document.getElementById('floatingContact');

    if (isFirstCall) {
        updateFloatingContactContent(index);
        floatingContact.classList.add('show');
        isFirstCall = false;
    } else {
        floatingContact.classList.remove('show');

        setTimeout(() => {
            updateFloatingContactContent(index);

            floatingContact.classList.add('show');
        }, 400);
    }
}

/**
 * Updates the content of the floating contact details panel with the contact's information.
 * @param {number} index - The index of the contact in the contacts array.
 */
function updateFloatingContactContent(index) {
    let floatingContact = document.getElementById('floatingContact');

    floatingContact.classList.remove('d-none');
    floatingContact.classList.add('floatingContact');

    let initials = contacts[index].nameOfContact.split(' ').map(word => word[0]).join('');
    const color = getColorByIndex(index);

    let contactDetailsHTML = `
        <div class="frame105">
            <div class="frame79" style="background-color: ${color};">${initials}</div>
            <div class="frame104">
                <div class="frame81">${contacts[index].nameOfContact}</div>
                <div class="frame204">
                    <div class="frame108" onclick="editContact(${index})">
                        <svg class=icon-edit xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <mask id="mask0_94406_3876" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                                <rect width="24" height="24" fill="#D9D9D9"/>
                            </mask>
                            <g mask="url(#mask0_94406_3876)">
                                <path d="M5 19H6.4L15.025 10.375L13.625 8.975L5 17.6V19ZM19.3 8.925L15.05 4.725L16.45 3.325C16.8333 2.94167 17.3042 2.75 17.8625 2.75C18.4208 2.75 18.8917 2.94167 19.275 3.325L20.675 4.725C21.0583 5.10833 21.2583 5.57083 21.275 6.1125C21.2917 6.65417 21.1083 7.11667 20.725 7.5L19.3 8.925ZM17.85 10.4L7.25 21H3V16.75L13.6 6.15L17.85 10.4Z" fill="#2A3647"/>
                            </g>
                        </svg>                
                        <span class="delete-edit-text">Edit</span>
                    </div>
                    <div class="deleteContact" onclick="deleteContact(${index})">
                        <svg class=icon-edit fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                            <mask height="24" id="mask0_94406_4140" maskUnits="userSpaceOnUse" style="mask-type:alpha" width="24" x="0" y="0">
                                <rect fill="#D9D9D9" height="24" width="24"/>
                            </mask>
                            <g mask="url(#mask0_94406_4140)">
                                <path d="M7 21C6.45 21 5.97917 20.8042 5.5875 20.4125C5.19583 20.0208 5 19.55 5 19V6C4.71667 6 4.47917 5.90417 4.2875 5.7125C4.09583 5.52083 4 5.28333 4 5C4 4.71667 4.09583 4.47917 4.2875 4.2875C4.47917 4.09583 4.71667 4 5 4H9C9 3.71667 9.09583 3.47917 9.2875 3.2875C9.47917 3.09583 9.71667 3 10 3H14C14.2833 3 14.5208 3.09583 14.7125 3.2875C14.9042 3.47917 15 3.71667 15 4H19C19.2833 4 19.5208 4.09583 19.7125 4.2875C19.9042 4.47917 20 4.71667 20 5C20 5.28333 19.9042 5.52083 19.7125 5.7125C19.5208 5.90417 19.2833 6 19 6V19C19 19.55 18.8042 20.0208 18.4125 20.4125C18.0208 20.8042 17.55 21 17 21H7ZM7 6V19H17V6H7ZM9 16C9 16.2833 9.09583 16.5208 9.2875 16.7125C9.47917 16.9042 9.71667 17 10 17C10.2833 17 10.5208 16.9042 10.7125 16.7125C10.9042 16.5208 11 16.2833 11 16V9C11 8.71667 10.9042 8.47917 10.7125 8.2875C10.5208 8.09583 10.2833 8 10 8C9.71667 8 9.47917 8.09583 9.2875 8.2875C9.09583 8.47917 9 8.71667 9 9V16ZM13 16C13 16.2833 13.0958 16.5208 13.2875 16.7125C13.4792 16.9042 13.7167 17 14 17C14.2833 17 14.5208 16.9042 14.7125 16.7125C14.9042 16.5208 15 16.2833 15 16V9C15 8.71667 14.9042 8.47917 14.7125 8.2875C14.5208 8.09583 14.2833 8 14 8C13.7167 8 13.4792 8.09583 13.2875 8.2875C13.0958 8.47917 13 8.71667 13 9V16Z" fill="#2A3647"/>
                            </g>
                        </svg>
                        <span class="delete-edit-text">Delete</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="frame160">Contact Information</div>
        <div class="frame101">
            <div class="frame102">
                <span class="text">Email</span>
                <span class="email">${contacts[index].emailOfContact}</span>
            </div>
            <div class="frame103">
                <span class="text">Phone</span>
                <span class="delete-edit-text">${contacts[index].telOfContact}</span>
            </div>
        </div>
    `;

    floatingContact.innerHTML = contactDetailsHTML;
}

/**
 * Constructs the HTML for the 'Add Contact' form and appends it to the overlay.
 */
function addContact() {
    const sideLayout = returnSideLayoutOfContact();
    const contactText = addContactText();
    const contactBtn = addContactBtn();
    const contactCircle = addCircle();
    const closeIcon = addCloseIcon();

    document.getElementById('overlayAddContact').innerHTML = `
        <form class="overlay-contact" onsubmit="newContact(); return false;">
            ${sideLayout}
            ${contactText} 
            ${contactBtn}
            ${contactCircle} 
            ${closeIcon}
        </form>
    `;
}

/**
 * Constructs and displays the HTML for the 'Edit Contact' form in the overlay.
 * @param {string} name - The name of the contact being edited.
 * @param {number} index - The index of the contact in the contacts array.
 */
function editCreatedContact(name, index) {
    const sideLayout = returnSideLayoutOfEditContact();
    const contactText = editContactText(index);
    const contactBtn = addEditContactBtn();
    const contactCircle = addEditedCircle(name, index);
    const closeIcon = addCloseIcon();

    document.getElementById('overlayAddContact').innerHTML = `
        <form class="overlay-contact" onsubmit="saveEditedContact(${index}); return false;">
            ${sideLayout}
            ${contactText} 
            ${contactBtn}
            ${contactCircle} 
            ${closeIcon}
        </form>
    `;
}

/**
 * Constructs the HTML content for the contact fields in the edit form.
 * @param {number} index - The index of the contact in the contacts array.
 * @return {string} HTML content for the edit contact form fields.
 */
function editContactText(index) {
    const contact = contacts[index];
    const contactName = returnEditContactName(contact.nameOfContact);
    const contactEmail = returnEditContactEmail(contact.emailOfContact);
    const contactPhone = returnEditContactPhone(contact.telOfContact);

    return `
        <div class="add-contact-text">
            ${contactName}  
            ${contactEmail}      
            ${contactPhone}
        </div>
    `;
}

/**
 * Returns HTML for the editable contact name input field.
 * @param {string} nameValue - The current name value of the contact.
 * @return {string} HTML content for the editable contact name input field.
 */
function returnEditContactName(nameValue) {
    return `
        <div class="add-contact-field">
            <div class="frame14" id="frame14">
                <div class="frame157">
                    <input required type="text" class="text-field" minlength="4" placeholder="Name" id="contactName" value="${nameValue}" oninput="changeBorderColor(this)">
                    <img src="../assets/img/person.png">
                </div>
            </div>
        </div>
    `;
}
/**
 * Returns HTML for the editable contact email input field.
 * @param {string} emailValue - The current email value of the contact.
 * @return {string} HTML content for the editable contact email input field.
 */
function returnEditContactEmail(emailValue) {
    return `
        <div class="add-contact-field">
            <div class="frame14">
                <div class="frame157">
                    <input required type="email" minlength="6" class="text-field" placeholder="Email" id="contactEmail" value="${emailValue}" oninput="changeBorderColor(this)">
                    <img src="../assets/img/mail.png">
                </div>
            </div>
        </div>
    `;
}

/**
 * Returns HTML for the editable contact phone input field.
 * @param {string} phoneValue - The current phone value of the contact.
 * @return {string} HTML content for the editable contact phone input field.
 */
function returnEditContactPhone(phoneValue) {
    return `
        <div class="add-contact-field">
            <div class="frame14">
                <div class="frame157">
                    <input required type="tel" minlength="4" class="text-field" placeholder="Phone" id="contactPhone" value="${phoneValue}" oninput="changeBorderColor(this)" onkeypress="validatePhoneNumberInput(event)">
                    <img class="phone-icon" src="../assets/img/call.png">
                </div>
            </div>
        </div>
    `;
}

/**
 * Validates phone number input to allow only numerical values.
 * @param {Event} event - The keypress event object.
 */
function validatePhoneNumberInput(event) {
    let char = String.fromCharCode(event.which);
    if (!(/[0-9]/.test(char))) {
        event.preventDefault();
    }
}

/**
 * Returns the HTML side-layout for adding a contact.
 * @return {string} HTML content.
 */
function returnSideLayoutOfContact() {
    return `
          <div class="overlay-addContact">
            <div class="frame194">
                <img src="../assets/img/Capa%202.png" class="capa2">
                <div class="frame209">
                    <span class="spanHeader">Add contact</span>
                    <span class="spanText"> Tasks are better with a team!</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="94" height="3" viewBox="0 0 94 3" fill="none">
                        <path d="M92 1.5L2 1.5" stroke="#29ABE2" stroke-width="3" stroke-linecap="round"/>
                    </svg>
                </div>
            </div>
        </div>
    `;
}

/**
 * Returns the HTML side-layout for editing a contact.
 * @return {string} HTML content.
 */
function returnSideLayoutOfEditContact() {
    return `
          <div class="overlay-addContact">
            <div class="frame194">
                <img src="../assets/img/Capa%202.png" class="capa2">
                <div class="frame209">
                    <span class="spanHeader">Edit contact</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="94" height="3" viewBox="0 0 94 3" fill="none">
                        <path d="M92 1.5L2 1.5" stroke="#29ABE2" stroke-width="3" stroke-linecap="round"/>
                    </svg>
                </div>
            </div>
        </div>
    `;
}

/**
 * Constructs the HTML for the contact form fields.
 * @return {string} HTML content for contact fields.
 */
function addContactText() {
    const contactName = returnContactName();
    const contactEmail = returnContactEmail();
    const contactPhone = returnContactPhone();

    return `
        <div class=add-contact-text>
            ${contactName}  
            ${contactEmail}      
            ${contactPhone}
        </div>
    `;
}

/**
 * Returns HTML for the contact name input field.
 * @return {string} HTML content for contact name input field.
 */
function returnContactName() {
    return `
        <div class="add-contact-field">
            <div class="frame14" id="frame14">
                <div class="frame157">
                    <input required type="text" class="text-field" minlength="4" placeholder="Name" id="contactName" oninput="changeBorderColor(this)">
                    <img src="../assets/img/person.png">
                </div>
            </div>
        </div>
    `;
}

/**
 * Returns HTML for the contact email input field.
 * @return {string} HTML content for contact email input field.
 */
function returnContactEmail() {
    return `
        <div class="add-contact-field">
            <div class="frame14">
                <div class="frame157">
                    <input required type="email" minlength="6" class="text-field" placeholder="Email" id="contactEmail" oninput="changeBorderColor(this)">
                    <img src="../assets/img/mail.png">
                </div>
            </div>
        </div>
    `;
}

/**
 * Returns HTML for the contact phone input field.
 * @return {string} HTML content for contact phone input field.
 */
function returnContactPhone() {
    return `
        <div class="add-contact-field">
            <div class="frame14">
                <div class="frame157">
                    <input required type="tel" minlength="4" class="text-field" placeholder="Phone" id="contactPhone" pattern="^[0-9]*$" oninput="changeBorderColor(this)" title="Only numbers are allowed">
                    <img class="phone-icon" src="../assets/img/call.png">
                </div>
            </div>
        </div>
    `;
}

/**
 * Constructs and returns the HTML for the contact form buttons.
 * @return {string} HTML content for the contact form buttons.
 */
function addContactBtn() {
    const cancelBtn = returnCancelBtn();
    const createContactBtn = returnCreateContactBtn();

    return `
        <div class=frame27 id="frame27">
            ${cancelBtn}
            ${createContactBtn}
        </div>
    `;
}

/**
 * Constructs and returns the HTML for the edit contact form buttons.
 * @return {string} HTML content for the edit contact form buttons.
 */
function addEditContactBtn() {
    const cancelBtn = returnCancelBtn();
    const saveContactBtn = returnSaveContactBtn();

    return `
        <div class=frame27>
            ${cancelBtn}
            ${saveContactBtn}
        </div>
    `;
}

/**
 * Returns HTML for the cancel button.
 * @return {string} HTML content for the cancel button.
 */
function returnCancelBtn() {
    return `
        <button class=cancel-contact onclick="closeOverlayAddContact()">
            <span class="cancel-btn-text">Cancel</span>
            <svg class="cancel-svg-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
                <path d="M12.001 12.5001L17.244 17.7431M6.758 17.7431L12.001 12.5001L6.758 17.7431ZM17.244 7.25708L12 12.5001L17.244 7.25708ZM12 12.5001L6.758 7.25708L12 12.5001Z" stroke="#2A3647" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </button>
    `;
}

/**
 * Returns HTML for the create contact button.
 * @return {string} HTML content for the create contact button.
 */
function returnCreateContactBtn() {
    return `
        <button type="submit" class=create-contact id="mySubmitButton">
            <span class="create-btn-text">Create contact</span>
            <img src="../assets/img/check.svg">
        </button>
    `;
}

/**
 * Returns HTML for the save contact button.
 * @return {string} HTML content for the save contact button.
 */
function returnSaveContactBtn() {
    return `
        <btn type="submit" class=save-contact onclick="saveEditedContact(currentSelectedIndex)">
            <span class="create-btn-text">Save</span>
            <img src="../assets/img/check.svg">
        </btn>
    `;
}

/**
 * Constructs and returns the HTML for the contact profile circle.
 * @return {string} HTML content for the contact profile circle.
 */
function addCircle() {
    const circle = returnCircle();
    return `
        <div class=group13>
            ${circle}
        </div>
    `;
}

/**
 * Constructs and returns the HTML for the edited contact profile circle.
 * @param {string} name - The name of the contact.
 * @param {number} index - The index of the contact in the contacts array.
 * @return {string} HTML content for the edited contact profile circle.
 */
function addEditedCircle(name, index) {
    const circle = returnEditedCircle(name, index);
    return `
        <div class=group13>
            ${circle}
        </div>
    `;
}

/**
 * Returns HTML for the default contact circle.
 * @return {string} HTML content for the default contact circle.
 */
function returnCircle() {
    return `
        <div class=frame79_2>
            <svg class="svg-person-icon" xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120" fill="none">
                <circle cx="60" cy="60" r="60" fill="#D1D1D1"/>
            </svg>
            <img class="person-icon" src="../assets/img/person.svg">
        </div>
    `;
}

/**
 * Returns HTML for the edited contact circle with initials and color.
 * @param {string} name - The name of the contact.
 * @param {number} index - The index of the contact in the contacts array.
 * @return {string} HTML content for the edited contact circle.
 */
function returnEditedCircle(name, index) {
    const initials = getInitials(name);
    const color = getColorByIndex(index);
    return `
        <div class="frame79" style="background-color: ${color};">${initials}</div>
    `;
}

/**
 * Returns HTML for the close icon in the overlay.
 * @return {string} HTML content for the close icon.
 */
function addCloseIcon() {
    return `
        <div class="close" onclick="closeOverlayAddContact()">
            <img src="../assets/img/cancel.svg">
        </div>
    `;
}

/**
 * Adds a message indicating successful contact creation to the overlay.
 */
function addOverlayCreatedContact() {
    document.getElementById('overlayCreatedContact').innerHTML = `
        <div class="frame73">
            <span class="contactSuccess">Contact successfully created</span>
        </div>
    `;

    // Div entfernen, nachdem die Animation abgeschlossen ist
    setTimeout(() => {
        const overlay = document.getElementById('overlayCreatedContact');
        if (overlay) overlay.remove();
    }, 10000); // Stellen Sie sicher, dass diese Zeitdauer der Dauer Ihrer CSS-Animation entspricht (in diesem Fall 5 Sekunden = 5000 Millisekunden).
}

/**
 * Generates HTML string for a group of contacts.
 * @param {string} letter - The letter grouping the contacts.
 * @param {Array<Object>} contactGroup - An array of contact objects.
 * @return {string} HTML string representing the group of contacts.
 */
function generateContactGroupHTML(letter, contactGroup) {
    let groupHTML = `
        <div class="frame112">
            <span>${letter}</span>
        </div>
        <div class="frame119">
            <svg class="parting-line" fill="none" height="2" viewBox="0 0 354 2" width="354" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1H353" stroke="#D1D1D1" stroke-linecap="round"/>
            </svg>
        </div>`;

    contactGroup.forEach((contact) => {
        const index = contacts.indexOf(contact);
        groupHTML += showContact(contact.nameOfContact, index);
    });

    return groupHTML;
}