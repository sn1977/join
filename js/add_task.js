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



/**
 * Call initial functions
 * 
 */
async function initTask() {
    await loadAllTasks();
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
        'assignedTo': ['Gerlinde', 'Knut'],
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
    checkRequieredFields('title');
    // checkRequieredFields();
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
}


function getContacts() {

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
    prio = '';
    category.value = '';
    subtask.value = '';
    allSubtasks = [];
}


/**
 * Funtion to check the requiered fields and mark them
 * 
 * @todo kürzen
 * 
 */
function checkRequieredFields() {
    

   /*  let test1 = `${field}.value`;
    alert(test1);
    
    if (test1 == "") {
        alert("HIER");
        let test = document.getElementById(`warning${field}`);
        test.classList.add("warning");
        document.getElementById(`${field}`).classList.add("warning-border");
        canAdd = false;
    } else {
        document.getElementById(`warning${field}`).classList.remove("warning");
        document.getElementById(`${field}`).classList.remove("warning-border");
        canAdd = true;
    } */


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
            <div class="subtaskItem">
                <div id="editSubtask${i}" class="subtaskLine">
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


function editSubtaskHtml(i){
    let editSubtask = document.getElementById(`editSubtask${i}`);
    let editValue = allSubtasks[i]['subtasktitle'];
    editSubtask.innerHTML = `
            <div class="editItem">
                <div id="editSubtask${i}" class="subtaskLine">
                    <input class="blabbla" id="editSubtask" type="text" value="${editValue}">
                </div> 
                <div class="editItemIcons">
                    <img src="../assets/img/delete.svg" onclick="delSubtask(${i})">
                    <div>|</div>
                    <img src="../assets/img/check-black.svg" onclick="editSubtask(${i})">
                </div>
            </div>
    `;
    }



function delSubtask(i) {
    allSubtasks.splice(i, 1);
    generateSubtaskHtml();
}

function editSubtask(i){
    let editSubtask = document.getElementById('editSubtask');
     allSubtasks[i].subtasktitle = editSubtask.value;
}


function switchToInput(){
    document.getElementById('inputsubtask').style.display = 'flex';
    document.getElementById('addSubtask').style.display = 'none';
}

function switchBack (){

    document.getElementById('inputsubtask').style.display = 'none';
    document.getElementById('addSubtask').style.display = 'flex';   
    subtask.value = "";
}

function delInput (){    
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