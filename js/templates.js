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
