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
                            <button class="btn-guest">Guest Log in</button>
                        </div>
                    </div>
    			</form>
    		</div>`;
}

function emptyLogInTemplate() {
    let logInTemplate = document.getElementById('logInTemplate');
    logInTemplate.innerHTML = '';
    document.querySelector('.frame156').style.visibility = 'hidden';
    // document.querySelector('.frame213').style.visibility = 'hidden';
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
    
    // Initialen des Kontakts generieren
    let initials = nameOfContact[index].split(' ').map(word => word[0]).join('');
  
    // Dynamisches HTML für den ausgewählten Kontakt erstellen
    let contactDetailsHTML = `
        <div class="frame105">
            <div class="frame79">${initials}</div>
            <div class="frame104">
                <div class="frame81">${nameOfContact[index]}</div>
                <div class="frame204">
                    <div class="frame108" onclick="#">
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
                    <div class="deleteContact" onclick="#">
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
                <span class="email">${emailOfContact[index]}</span>
            </div>
            <div class="frame103">
                <span class="text">Phone</span>
                <span class="delete-edit-text">${telOfContact[index]}</span>
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
