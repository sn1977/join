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
                            <div class="frame14">
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

function emptyLogInTemplate() {
    let logInTemplate = document.getElementById('logInTemplate');
    logInTemplate.innerHTML = '';
    document.querySelector('.frame156').style.visibility = 'hidden';
}


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
                        <div class="156">
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
                        <button id="btn-signup" disabled type="submit">Sign up</button>
                    </div>
                </div>
                <div class="arrow-left-line">
                    <img src="../assets/img/arrow-left.png" alt="arrow-left" class="arrow-left" onclick="showLogIn()">
                </div>
            </form>
        </div>
    `;
}

function displayFloatingContactDetails(index) {
    let floatingContact = document.getElementById('floatingContact');
    floatingContact.classList.remove('d-none');
    floatingContact.classList.add('floatingContact');

    // Initialen des Kontakts generieren
    let initials = contacts[index].nameOfContact.split(' ').map(word => word[0]).join('');
    const color = getColorByIndex(index);
    // Dynamisches HTML für den ausgewählten Kontakt erstellen
    
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

    // Das generierte HTML in den floatingContact Container einfügen
    floatingContact.innerHTML = contactDetailsHTML;

    // Animation starten
    setTimeout(() => {
        floatingContact.classList.add('show');
    }, 50); // Verzögerung von 50ms, um sicherzustellen, dass der Browser die Änderungen bemerkt
}

function addContact() {
    const sideLayout = returnSideLayoutOfContact();
    const contactText = addContactText();
    const contactBtn = addContactBtn();
    const contactCircle = addCircle();
    const closeIcon = addCloseIcon();

    document.getElementById('overlayAddContact').innerHTML = `
            ${sideLayout}
            ${contactText} 
            ${contactBtn}
            ${contactCircle} 
            ${closeIcon}
        </div>
    `;
}

function editCreatedContact(name, index) {
    const sideLayout = returnSideLayoutOfContact();
    const contactText = addContactText();
    const contactBtn = addEditContactBtn();
    const contactCircle = addEditedCircle(name, index);
    const closeIcon = addCloseIcon();

    document.getElementById('overlayAddContact').innerHTML = `
            ${sideLayout}
            ${contactText} 
            ${contactBtn}
            ${contactCircle} 
            ${closeIcon}
        </div>
    `;
}

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

function returnContactName() {
    return `
        <div class="add-contact-field">
            <div class="frame14" id="frame14">
                <div class="frame157">
                <form>
                    <input required class="text-field" placeholder="Name" id="contactName" type="text" oninput="changeBorderColor(this)">
                    <img src="../assets/img/person.png">
                </form>
                </div>
            </div>
        </div>
    `;
}

function returnContactEmail() {
    return `
        <div class="add-contact-field">
            <div class="frame14">
                <div class="frame157">
                <form onsubmit="return">
                    <input required class="text-field" placeholder="Email" id="contactEmail" type="email" oninput="changeBorderColor(this)">
                    <img src="../assets/img/mail.png">
                </form>
                </div>
            </div>
        </div>
    `;
}


function returnContactPhone() {
    return `
        <div class="add-contact-field">
            <div class="frame14">
                <div class="frame157">
                <form>
                    <input required class="text-field" placeholder="Phone" id="contactPhone" type="tel" oninput="changeBorderColor(this)">
                    <img src="../assets/img/call.png">
                </form>
                </div>
            </div>
        </div>
    `;
}

function addContactBtn() {
    const cancelBtn = returnCancelBtn();
    const createContactBtn = returnCreateContactBtn();

    return `
        <div class=frame27>
            ${cancelBtn}
            ${createContactBtn}
        </div>
    `;
}

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

function returnCancelBtn() {
    return `
        <btn class=cancel-contact onclick="closeOverlayAddContact()">
            <span class="cancel-btn-text">Cancel</span>
            <svg class="cancel-svg-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
                <path d="M12.001 12.5001L17.244 17.7431M6.758 17.7431L12.001 12.5001L6.758 17.7431ZM17.244 7.25708L12 12.5001L17.244 7.25708ZM12 12.5001L6.758 7.25708L12 12.5001Z" stroke="#2A3647" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </btn>
    `;
}

function returnCreateContactBtn() {
    return `
        <btn class=create-contact onclick="newContact()">
            <span class="create-btn-text">Create contact</span>
            <img src="../assets/img/check.svg">
        </btn>
    `;
}

function returnSaveContactBtn() {
    return `
        <btn class=create-contact onclick="saveEditedContact(currentSelectedIndex)"">
            <span class="create-btn-text">Save</span>
            <img src="../assets/img/check.svg">
        </btn>
    `;
}

function addCircle() {
    const circle = returnCircle();
    return `
        <div class=group13>
            ${circle}
        </div>
    `;
}

function addEditedCircle(name, index) {
    const circle = returnEditedCircle(name, index);
    return `
        <div class=group13>
            ${circle}
        </div>
    `;
}

function returnCircle() {
    return `
        <div class=frame79_2>
            <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120" fill="none">
                <circle cx="60" cy="60" r="60" fill="#D1D1D1"/>
            </svg>
            <img class="person-icon" src="../assets/img/person.svg">
        </div>
    `;
}

function returnEditedCircle(name, index) {
    const initials = getInitials(name);
    const color = getColorByIndex(index);
    return `
        <div class="frame79" style="background-color: ${color};">${initials}</div>
    `;
}

function addCloseIcon() {
    return `
        <div class="close" onclick="closeOverlayAddContact()">
            <img src="../assets/img/cancel.svg">
        </div>
    `;
}

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

function contactsHTML() {
    document.getElementById('content').innerHTML += `
        <div id="contactTemplate" onload="loadIncludeHTML(), renderContacts(), initContact()">
            <div class="frame40" id="frame40">
                <h1>Contacts</h1>
                <svg fill="none" height="63" viewBox="0 0 4 63" width="4" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 2V61" stroke="#29ABE2" stroke-linecap="round" stroke-width="3" />
                </svg>
                <span class="spanContacts">Better with a team</span>
            </div>
            <div id="floatingContact" class="d-none"></div>
            <div class="frame97">
                <div class="contact-list">
                    <button id="newContact" onclick="overlayAddContact()">Add new contact
                        <svg fill="none" height="33" viewBox="0 0 33 33" width="33" xmlns="http://www.w3.org/2000/svg">
                            <mask height="33" id="mask0_93463_4951" maskUnits="userSpaceOnUse" style="mask-type:alpha"
                            width="33" x="0" y="0">
                                <rect fill="#D9D9D9" height="32" width="32" x="0.5" y="0.5" />
                            </mask>
                            <g mask="url(#mask0_93463_4951)">
                                <path
                                    d="M25.8294 19.1667C25.5134 19.1667 25.2499 19.0602 25.0388 18.8473C24.8277 18.6343 24.7222 18.3704 24.7222 18.0556V14.9445H21.611C21.2962 14.9445 21.0323 14.8376 20.8194 14.6239C20.6064 14.4102 20.4999 14.1454 20.4999 13.8295C20.4999 13.5136 20.6064 13.2501 20.8194 13.0389C21.0323 12.8278 21.2962 12.7223 21.611 12.7223H24.7222V9.61115C24.7222 9.29635 24.829 9.03246 25.0427 8.81948C25.2564 8.60653 25.5212 8.50005 25.8372 8.50005C26.1531 8.50005 26.4166 8.60653 26.6277 8.81948C26.8388 9.03246 26.9444 9.29635 26.9444 9.61115V12.7223H30.0555C30.3703 12.7223 30.6342 12.8291 30.8472 13.0428C31.0601 13.2566 31.1666 13.5214 31.1666 13.8373C31.1666 14.1532 31.0601 14.4167 30.8472 14.6278C30.6342 14.8389 30.3703 14.9445 30.0555 14.9445H26.9444V18.0556C26.9444 18.3704 26.8375 18.6343 26.6238 18.8473C26.4101 19.0602 26.1453 19.1667 25.8294 19.1667ZM12.4999 16.4778C11.0333 16.4778 9.81473 15.9926 8.84435 15.0223C7.874 14.0519 7.38882 12.8334 7.38882 11.3667C7.38882 9.90005 7.874 8.68154 8.84435 7.71118C9.81473 6.7408 11.0333 6.25562 12.4999 6.25562C13.9666 6.25562 15.1851 6.7408 16.1555 7.71118C17.1258 8.68154 17.611 9.90005 17.611 11.3667C17.611 12.8334 17.1258 14.0519 16.1555 15.0223C15.1851 15.9926 13.9666 16.4778 12.4999 16.4778ZM2.94435 27.1667C2.62955 27.1667 2.36566 27.0602 2.15269 26.8473C1.93973 26.6343 1.83325 26.3704 1.83325 26.0556V23.8334C1.83325 23.063 2.0314 22.3612 2.42769 21.7279C2.824 21.0945 3.3666 20.6186 4.05549 20.3C5.62586 19.5815 7.08022 19.0649 8.41855 18.75C9.75691 18.4352 11.1162 18.2779 12.4963 18.2779C13.8765 18.2779 15.237 18.4352 16.5777 18.75C17.9184 19.0649 19.3666 19.5815 20.9222 20.3C21.611 20.6334 22.1573 21.113 22.561 21.7389C22.9647 22.3649 23.1666 23.063 23.1666 23.8334V26.0556C23.1666 26.3704 23.0601 26.6343 22.8472 26.8473C22.6342 27.0602 22.3703 27.1667 22.0555 27.1667H2.94435ZM4.05545 24.9445H20.9444V23.8334C20.9444 23.5149 20.8648 23.2149 20.7055 22.9334C20.5462 22.6519 20.3073 22.4408 19.9888 22.3C18.5518 21.5963 17.2629 21.1204 16.1222 20.8723C14.9814 20.6241 13.774 20.5 12.4999 20.5C11.2259 20.5 10.0184 20.6278 8.87769 20.8834C7.73695 21.1389 6.44066 21.6112 4.98882 22.3C4.69991 22.4408 4.47212 22.6519 4.30545 22.9334C4.13879 23.2149 4.05545 23.5149 4.05545 23.8334V24.9445ZM12.4999 14.2556C13.3221 14.2556 14.0092 13.9797 14.561 13.4278C15.1129 12.876 15.3888 12.1889 15.3888 11.3667C15.3888 10.5445 15.1129 9.85746 14.561 9.30562C14.0092 8.75375 13.3221 8.47782 12.4999 8.47782C11.6777 8.47782 10.9907 8.75375 10.4388 9.30562C9.88695 9.85746 9.61102 10.5445 9.61102 11.3667C9.61102 12.1889 9.88695 12.876 10.4388 13.4278C10.9907 13.9797 11.6777 14.2556 12.4999 14.2556Z"
                                    fill="white" />
                            </g>
                        </svg>
                    </button>
                    <div id="allContacts"></div>
                </div>
            </div>
        </div>
    `;
}