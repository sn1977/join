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


// JavaScript, um die Platzhalteroption auszuwählen
document.getElementById("category").selectedIndex = 0;
//Mindestdatum bei Fällig bis = heute
document.getElementById("dueDate").min = new Date().toISOString().split("T")[0];


/**
 * Call initial functions
 * 
 */
async function initTask() {
    await loadAllTasks();
    getLastID();
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
function getTaskValues(progress){
    let task = {
        'id' : id,
        'title' : title.value,
        'description' : description.value,
        'assignedTo' : assignedTo.value,
        'dueDate' : Date(dueDate.value),
        'prio' : prio,
        'type' : category.value,
        'category' : progress,
        'createdAt' : new Date().getTime(),
        'modifiedAt' : new Date().getTime(),
        'assignedTo': ['Gerlinde', 'Knut'],
        'subtask' : ['putzen', 'waschen']
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
        id++;
        getTaskValues(progress);
        await setItem('tasks', JSON.stringify(tasks)); 
        emptyFields();
        if (lastPrio!=''){
            resetPrio();
        }
    } else {
        alert("Füll den Käse richtig aus!")
    }
}


/**
 * This function recaluclates all task ids and retrun a task id for the new added task
 * 
 * @returns 
 * 
 */
async function getLastID(){
    id = tasks.length;
    //Vorbereitung um doppelte IDs zu finden ..... bzw beim leeren Array abfangen
    let tid = tasks.find(i => i.id == id);
    if (tid){
        alert("Gespeicherte Aufgaben:  " + id);
    } else{
        id == 0;
        alert("Keine Aufgaben");
        alert(id);
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
}


/**
 * This function prevents the onclick event 
 * 
 * @param {event} event - onclick event
 */
function eventOnClick(event) {
    event.stopPropagation(); // prevents event bubbling
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
}


function openSelect() {
    document.getElementById('assignedTo').append = 'multiple';
}



/**
 * Funtion to check the requiered fields and mark them
 * 
 * @todo kürzen
 * 
 */
function checkRequieredFields(){
    canAdd = true;
    if (title.value == "") {
        document.getElementById('warningTitle').classList.add ("warning");
        document.getElementById('title').classList.add ("warning-border");
        canAdd = false;
    } else {
        document.getElementById("warningTitle").classList.remove ("warning");
        document.getElementById("title").classList.remove ("warning-border");
    }
    if (dueDate.value == "") {
        document.getElementById("warningDueDate").classList.add ("warning");
        document.getElementById("dueDate").classList.add ("warning-border");
        canAdd = false;
    } else {
        document.getElementById("warningDueDate").classList.remove ("warning");
        document.getElementById("dueDate").classList.remove ("warning-border");
      }
    if (category.value == "") {
        document.getElementById("warningcategory").classList.add ("warning");
        document.getElementById("category").classList.add ("warning-border");
        canAdd = false;
    } else {
        document.getElementById("warningcategory").classList.remove ("warning");
        document.getElementById("category").classList.remove ("warning-border");
    }
}


/**
 * This functions resests all error messages by making them invisible
 * 
 * @todo kürzen
 *
 */
function resetRequiredFields() {
    document.getElementById("warningTitle").classList.remove ("warning");
    document.getElementById("title").classList.remove ("warning-border");
    document.getElementById("warningDueDate").classList.remove ("warning");
    document.getElementById("dueDate").classList.remove ("warning-border");
    document.getElementById("warningcategory").classList.remove ("warning");
    document.getElementById("category").classList.remove ("warning-border");
}



// TO DO

/**
 * This function adds a new subtask
 * 
 * 
 */
function addSubtask() {
    let subtask = document.getElementById('subtask');
    subtask.value !== '' ? subtaskJS.push(subtask.value) : '';
    document.getElementById('subtask').innerHTML = '';
    for (let i = 0; i < subtaskJS.length; i++) {
        document.getElementById('allSubtsaks').innerHTML += subtaskHTML(i);
        subtask.value = '';
    }
}

function subtaskHTML (i){
    return `HALLO`;
}

/**
 * This function delets the selected subtask
 * 
 * @param {object} subtaskObjElement 
 */
function deleteSubtask(subtaskObjElement) {
    subtaskObj.splice(subtaskObjElement, 1);
    addSubtask();
}

/**
 * This function is for the edditing of the subtask
 * 
 * @param {number} count 
 */
function editSubtask(count) {
    const subtaskText = document.getElementById("idSubTaskText" + count).innerText;
    document.getElementById("idSubTaskTextEditContainer" + count).classList.toggle("subTaskTextEdit");
    document.getElementById("idSubTaskdefaultContainer" + count).classList.toggle("d-none");
    document.getElementById("idSubTaskTextEdit" + count).value = subtaskText;
}


/**
 * This function saves the subtask into the subtask array and call the subTask function
 * 
 * @param {number} count - for unique identifier
 */
function editSubtaskText(count) {
    subtaskObj[count] = document.getElementById('idSubTaskTextEdit' + count).value;
    addSubtask();
}


// nur für Testzwecke wenn man mal einen Task löschen will
async function delTask(i) {
    tasks.splice(i, 1);
    await setItem('tasks', JSON.stringify(tasks));
    reload();
  }