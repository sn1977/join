/**
 * @author Christiane
 * Join Gruppenarbeit 727
 * October 2023
 * 
 * übergreifende Variablen AddTask:
 */
let tasks = [];
let lastPrio = '';
let prio = 'low';
let progress = '';
let id;
let title;
let description;
let assignedTo;
let dueDate;
let category;
let subtask;
let canAdd = true;
let subtaskID = 0;
let allSubtasks = [];
let allContacts = [];
let contactpool = [];
let filteredContacts = [];
// Globale Referenz auf den Event-Listener
let clickEventListener = null;

/**
 * call initial functions addTask
 * 
 */
async function initTask() {
    await loadAllTasks();
    await loadContacts();

    reload();
}


/**
 * funtion to load all tasks from remote server
 * 
 *@param {array} tasks -all tasks
 * 
 */
async function loadAllTasks() {
    tasks = JSON.parse(await getItem('tasks'));
}


/**
 * function to get the ids from the inputfields and save in global variables
 * 
 * @param {string} title -inputfield for title
 * @param {string} description -inputfield for description
 * @param {string} assignedTo -inputfield for assigned contacts
 * @param {string} dueDate -inputfield for  due date
 * @param {string} category -inputfield for category
 * @param {string} subtask -inputfield for subtasks
 * 
 * 
 */
function getInputIDs() {
    title = document.getElementById('title');
    description = document.getElementById('description');
    assignedTo = document.getElementById('assignedTo');
    dueDate = document.getElementById('dueDate');
    category = document.getElementById('category');
    subtask = document.getElementById('subtask');
}


/**
 * function to get the values from the input fields and save in task fo push in tasks
 * 
 * @param {array} task - temp array fo save the values and create the json
 * 
 */
function getTaskValues(progress) {
    let task = {
        'id': id,
        'title': title.value,
        'description': description.value,
        'dueDate': dueDate.value,
        'prio': prio,
        'progress': progress,
        'category': category.value,
        'createdAt': new Date().getTime(),
        'modifiedAt': new Date().getTime(),
        'assignedTo': allContacts,
        'subtask': allSubtasks
    };
    tasks.push(task);
}


/**
 * Add a new task
 * 
 * 
 * 
 */
async function addTask(progress) {
    getInputIDs();
    checkRequieredFields();
    if (canAdd) {
        getLastID();
        getTaskValues(progress);
        await setItem('tasks', JSON.stringify(tasks));      
        emptyFields();
        generateSubtaskHtml();
     
        overlaySuccessAddTask();
        if (lastPrio != '') {
            resetPrio();
        }

        closeOverlay();
    } else {
    }
}


/**
 * 
 * 
 * 
 * 
 */
function overlaySuccessAddTask() {
    const overlayAddTaskSuccess = document.createElement('div');
    overlayAddTaskSuccess.id = 'overlayAddTaskSuccess';
    document.body.appendChild(overlayAddTaskSuccess);

    setTimeout(() => {
        overlayAddTaskSuccess.style.transform = 'translateY(-250%) translateX(50%)';
    }, 50);

    addOverlayAddTaskSuccess();
}


/**
 * 
 * 
 * 
 * 
 */
function addOverlayAddTaskSuccess() {
    document.getElementById('overlayAddTaskSuccess').innerHTML = `
        <div class="success">
            <span class="addtaskSuccess">Task successfully created</span>
            <img src="../assets/img/iconboard.svg">
        </div>
    `;
    setTimeout(() => {
        const overlay = document.getElementById('overlayAddTaskSuccess');
        if (overlay) overlay.remove();
    }, 10000);
}


/**
 * This function finds the max id and retrun a task id for the new added task
 * 
 * @returns 
 * 
 */
async function getLastID() {
    let maxID = 0;
    // Finde die maximale ID in den vorhandenen Aufgaben
    for (const task of tasks) {
        if (task.id > maxID) {
            maxID = task.id;
        }
    }
    if (maxID > 0) {
        id = maxID + 1;
    } else {
        id = 1;
    }
}


/**
 * Function to reset the form 
 * 
 */
function reload() {
    getInputIDs();
    emptyFields();
    resetRequiredFields()
    getLastID();
    addTaskLoadContacts();
    allContacts = [];
    subtaskID = 0;
}


/**
 * This function determines the clicked prio of the current task
 * 
 * @param {string} x = the selected prio is passed
 * @param {string} prio = overall variable containing the prio of the current task input
 * @param {string} lastprio = overall variable that contains the previously selected prio
 *  
 */
function taskPrio(x) {
    prio = x;
    if (lastPrio != '') {
        resetPrio();
    }
    setPrio()
    lastPrio = x;
}


/**
 * Function to change the color of the selected prio
 * 
 * 
 * 
 */
function setPrio() {
    let element = '';
    let imageElement = '';
    element = document.getElementById(`${prio}`);
    element.querySelector('img');
    element.classList.remove('white');
    element.classList.add(`${prio}`);
    imageElement = element.querySelector('img');
    imageElement.style.filter = "brightness(0%) invert(1)";
}


/**
 * function to change the color of the previously selected prio back to white
 * 
 */
function resetPrio() {
    let element = '';
    let imageElement = '';
    element = document.getElementById(`${lastPrio}`);
    element.querySelector('img');
    element.classList.add('white');
    element.classList.remove(`${lastPrio}`);
    imageElement = element.querySelector('img');
    imageElement.style.filter = "brightness(100%) invert(0)";
}


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
 * function
 * 
 * @todo
 * 
 */
function addTaskLoadContacts() {
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
 */
function contactlistHtml(contacts) {
    let contacthtml = '';
    for (let i = 0; i < contacts.length; i++) {
        contacthtml += ` 
            <div class="contactLine" onclick="toggleContact(${contacts[i].id}, event)">
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
 * function
 * 
 * @todo
 * 
 */
function filterContacts() {
    const inputText = assignedToInput.value.toLowerCase(); // Eingegebener Text in Kleinbuchstaben
    addClickEventListener();
    // Wenn kein Text eingegeben wurde, zeige die gesamte Kontaktliste an
    if (inputText === '') {
        filteredContacts = contactpool;
    } else {
        // Andernfalls filtere die Kontakte basierend auf dem eingegebenen Text
        filteredContacts = contactpool.filter(contact => contact.name.toLowerCase().includes(inputText));
    }

    const contactsContainer = document.getElementById('assignedToContainer');
    contactsContainer.innerHTML = `
            <section id="assignedToContact">
                ${contactlistHtml(filteredContacts)}
            </section>
            <button class="createContactBtn"  onclick="addNewContact()">
                Add new contact
                <img class="addContact" src="../assets/img/person_add.svg" alt="Add Contact">
            </button>
        `;
    updateIcons(filteredContacts);
}


async function updateContactPool() {
    await loadContacts();
    if (contactpool.length < contacts.length) {

        let i = contacts.length-1;
        let tempInitialien = getInitials(contacts[i].nameOfContact);
        let tempContactPool = {
            'id': i,
            'name': contacts[i].nameOfContact,
            'color': getColorByIndex(i),
            'initialien': tempInitialien,
            'assigned': false
        }
        contactpool.push(tempContactPool);
        contactpool.sort((a, b) => a.name.localeCompare(b.name));
        filteredContacts();
    }
}


function addNewContact() {
    overlayAddContact();
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
    let contacts = document.getElementById('assignedToContainer');
    contacts.innerHTML = `
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
    const i = filteredContacts.findIndex(contact => contact.id === contactId);
    contactpool[i]['assigned'] ? unchoseContact(i) : choseContact(i);
    updateIcons(filteredContacts);
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


function removeContactFromArray(contactName) {
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


/**
 * function to empty the input fields
 * 
 * 
 */
function emptyFields() {
    progress = '';
    title.value = '';
    description.value = '';
    assignedTo.value = '';
    dueDate.value = '';
    prio = 'low';
    category.value = '';
    subtask.value = '';
    allSubtasks = [];
    canAdd = true;
    let contactsIcons = document.getElementById('showAssignedContacts');
    contactsIcons.innerHTML = '';
    contactpool = [];
    addTaskLoadContacts();
}


/**
 * Funtion to check the requiered fields and mark them
 * 
 * @todo kürzen
 * 
 */
function checkRequieredFields() {
    if (title.value == "") {
        document.getElementById('warningtitle').classList.add("warning");
        document.getElementById('title').classList.add("warning-border");
        canAdd = false;
    } else {
        document.getElementById("warningtitle").classList.remove("warning");
        document.getElementById("title").classList.remove("warning-border");
    }
    if (dueDate.value == "") {
        document.getElementById("warningDueDate").classList.add("warning");
        document.getElementById("dueDate").classList.add("warning-border");
        canAdd = false;
    } else {
        document.getElementById("warningDueDate").classList.remove("warning");
        document.getElementById("dueDate").classList.remove("warning-border");
    }
    if (category.value == "") {
        document.getElementById("warningcategory").classList.add("warning");
        document.getElementById("category").classList.add("warning-border");
        canAdd = false;
    } else {
        document.getElementById("warningcategory").classList.remove("warning");
        document.getElementById("category").classList.remove("warning-border");
    }
}


/**
 * This functions resests all error messages by making them invisible
 * 
 * @todo kürzen
 *
 */
function resetRequiredFields() {
    document.getElementById("warningtitle").classList.remove("warning");
    document.getElementById("title").classList.remove("warning-border");
    document.getElementById("warningDueDate").classList.remove("warning");
    document.getElementById("dueDate").classList.remove("warning-border");
    document.getElementById("warningcategory").classList.remove("warning");
    document.getElementById("category").classList.remove("warning-border");
}


/**
 * 
 * function to add subtasks
 * 
 * 
 * @param {*} i  
 * 
 */
function addSubtask() {
    if (subtask.value != '') {
        subtaskID++;
        getLastID();
        let tempsubtask = {
            'id': id,
            'subtaskid': subtaskID,
            'subtasktitle': subtask.value,
            'done': false
        }
        allSubtasks.push(tempsubtask);
        subtask.value = '';
        generateSubtaskHtml();
        switchBack();
    } else {
        alert("Darf nicht leer sein");
    }
}


function generateSubtaskHtml() {
    let subtasksHtml = document.getElementById('savedSubtasks');
    subtasksHtml.innerHTML = '';
    for (let i = 0; i < allSubtasks.length; i++) {
        let temptask = allSubtasks[i];
        subtasksHtml.innerHTML += `
            <div class="subtaskItem" id="editSubtask${i}" ondblclick="editSubtaskHtml(${i})">
                <div class="subtaskLine">
                    <img class="dot" src="../assets/img/dot.svg">
                    <p>${temptask['subtasktitle']}</p>
                </div> 
                <div class="subtaskEdit">
                    <img onclick="editSubtaskHtml(${i})" src="../assets/img/edit.png" alt=""> 
                    <div>|</div>
                    <img onclick="delSubtask(${i})" src="../assets/img/delete.svg" alt="">
                </div>
            </div>
    `;
    }
}


function editSubtaskHtml(i) {
    let editSubtask = document.getElementById(`editSubtask${i}`);
    editSubtask.classList.remove('subtaskItem');
    editSubtask.classList.add('editItem');
    let editValue = allSubtasks[i]['subtasktitle'];
    editSubtask.innerHTML = `
        <div id="editSubtask${i}" class="subtaskLine">
            <input class="editTaskInput" id="editSubtask" type="text" value="${editValue}">
        </div> 
        <div class="editItemIcons">
            <img src="../assets/img/delete.svg" onclick="delSubtask(${i})">
            <div>|</div>
            <img src="../assets/img/check-black.svg" onclick="editSubtask(${i})">
        </div>
    `;
}



function delSubtask(i) {
    allSubtasks.splice(i, 1);
    generateSubtaskHtml();
}

function editSubtask(i) {
    let editSubtask = document.getElementById('editSubtask');
    allSubtasks[i].subtasktitle = editSubtask.value;
    generateSubtaskHtml();
}


function switchToInput() {
    document.getElementById('inputsubtask').style.display = 'flex';
    document.getElementById('addSubtask').style.display = 'none';
}

function switchBack() {
    document.getElementById('inputsubtask').style.display = 'none';
    document.getElementById('addSubtask').style.display = 'flex';
    subtask.value = "";
}

function delInput() {
    subtask.value = "";
    document.getElementById('inputsubtask').style.display = 'none';
    document.getElementById('addSubtask').style.display = 'flex';
}


// nur für Testzwecke wenn man mal einen Task löschen will
async function delTask(i) {
    tasks.splice(i, 1);
    await setItem('tasks', JSON.stringify(tasks));
    reload();
}