/**
 * @author Christiane
 * Join Gruppenarbeit 727
 * October 2023
 * 
 * übergreifende Variablen AddTask:
 */
let tasks = [];
let lastPrio = '';
let prio = '';
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


// JavaScript, um die Platzhalteroption auszuwählen
document.getElementById("category").selectedIndex = 0;
//Mindestdatum bei Fällig bis = heute
document.getElementById("dueDate").min = new Date().toISOString().split("T")[0];
//Fokus für subtask Input field
const subtaskInput = document.getElementById("subtask");
const subtaskContainer = document.querySelector(".subtaskContainer");

subtaskInput.addEventListener("focus", () => {
    subtaskContainer.style.borderColor = "#29ABE2"; // Ändere die Border-Farbe auf Fokus
});

subtaskInput.addEventListener("blur", () => {
    subtaskContainer.style.borderColor = "#D1D1D1"; // Ändere die Border-Farbe zurück, wenn der Fokus verloren geht
});

$(document).ready(function () {
    $("#dueDate").datepicker();
});


/**
 * Call initial functions
 * 
 */
async function initTask() {
    await loadAllTasks();
    await loadContacts();
    addTaskLoadContacts();
    reload();
}


/**
 * funtion to load all tasks from remote
 * 
 *
 * 
 */
async function loadAllTasks() {
    tasks = JSON.parse(await getItem('tasks'));
}


/**
 * Function to get the ids from the inputfields
 * 
 * @returns 
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
 * 
 * 
 * 
 */
function getTaskValues(progress) {
    let task = {
        'id': id,
        'title': title.value,
        'description': description.value,
        'dueDate': Date(dueDate.value),
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
        if (lastPrio != '') {
            resetPrio();
        }
    } else {
        alert("Füll den Käse richtig aus!")
    }
}


/**
 * This function finds the mask id and retrun a task id for the new added task
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
        id = 1; // Setze die ID auf 1, wenn keine Aufgaben vorhanden sind
        // alert("Keine Aufgaben");
    }
    // alert("Gespeicherte Aufgaben: " + maxID);
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
    subtaskID = 0;
}


/**
 * This function prevents the onclick event 
 * 
 * @param {event} event - onclick event
 */
// function eventOnClick(event) {
//     event.stopPropagation(); // prevents event bubbling
//   }


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
 * Function to change the color of the previously selected prio back to white
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
    addTaskGetContacts();
    showTaskContacts()
}


function addTaskLoadContacts() {
    for (let i = 0; i < nameOfContact.length; i++) {
        let tempInitialien = getInitials(nameOfContact[i]);
        let tempContactPool = {
            'id': i,
            'name': nameOfContact[i],
            'color': getColorByIndex(i),
            'initialien': tempInitialien,
            'assigned': false
        }
        contactpool.push(tempContactPool);
    }
    contactpool.sort(SortArray);
    console.log(contactpool);
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


function addTaskGetContacts() {
    let contacts = document.getElementById('assignedToContact');
    contacts.innerHTML = '';

    for (let i = 0; i < contactpool.length; i++) {
        contacts.innerHTML += ` 
            <div class="contactLine">
                <div class="contact">
                    <div class="contacticon" style="background-color:  ${contactpool[i]['color']};"> 
                        ${contactpool[i]['initialien']}
                    </div>
                    <div> 
                        ${contactpool[i]['name']} 
                    </div>
                </div>
                <div id="checked${i}">

                </div>
            </div>
        `;

        let icon = document.getElementById(`checked${i}`);

        if (contactpool[i]['assigned']) {
            icon.innerHTML = `<img onclick="unchoseContact(${i})" src="../assets/img/check_button_white.svg" alt=""></img>`;
            icon.parentNode.classList.add('checked');
        } else {
            icon.innerHTML = `<img onclick="choseContact(${i})" src="../assets/img/checkbox.png" alt=""></img>`;
            icon.parentNode.classList.remove('checked');
        }
    }
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
    getLastID();
    let tempContact = {
        'id': id,
        'contactid': i,
        'name': nameOfContact[i],
        'color': contactpool[i]['color'],
        'initialien': contactpool[i]['initialien']
    }
    allContacts.push(tempContact);
    contactpool[i]['assigned'] = true;
    changeMarkedContact(i);
    showTaskContacts();
}


function unchoseContact(i) {
    const contactCheckbox = document.getElementById(`checked${i}`);
    contactCheckbox.innerHTML = `
        <img onclick="choseContact(${i})" src="../assets/img/checkbox.png" alt="">
    `;
    contactCheckbox.parentNode.classList.remove('checked');
    allContacts.splice(i, 1);
    contactpool[i]['assigned'] = false;
    showTaskContacts();
}


function changeMarkedContact(i) {
    const contactCheckbox = document.getElementById(`checked${i}`);
    contactCheckbox.innerHTML = `
        <img onclick="unchoseContact(${i})" src="../assets/img/check_button_white.svg" alt="">
    `;
    contactCheckbox.parentNode.classList.add('checked');
}


// Klick-Ereignis außerhalb des Dropdown-Menüs hinzufügen, um es zu schließen
document.addEventListener('click', function (event) {
    const assignedToContainer = document.getElementById('assignedToContainer');
    const assignedToInput = document.getElementById('assignedTo');

    // Überprüfen, ob das Klickereignis nicht im Dropdown-Menü oder im Eingabefeld stattfindet - funktioniert noch nicht sauber!
    if (event.target !== assignedToContainer && event.target !== assignedToInput) {
        assignedToContainer.classList.add('d-none');
    }
});


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
    prio = '';
    category.value = '';
    subtask.value = '';
    allSubtasks = [];
    canAdd = true;
    let contactsIcons = document.getElementById('showAssignedContacts');
    contactsIcons.innerHTML = '';
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
    alert(canAdd);
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