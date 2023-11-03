async function initRegister(){
    await loadUsers();
}

async function loadUsers(){
    users = JSON.parse(await getItem('users'));
}

async function register() {
    users.push({
        name: nameElement.value,
        email: emailElement.value,
        password: passwordElement.value,
        passwordControl: passwordSignupElement.value,
    });
    await setItem('users', JSON.stringify(users));
    resetForm();
}

function resetForm() {
    nameElement.value = '';
    emailElement.value = '';
    passwordElement.value = '';
    passwordSignupElement.value = '';
}
