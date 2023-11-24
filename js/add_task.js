/**
 * @author Christiane
 * Join Gruppenarbeit 727
 * October 2023
 * 
 * übergreifende Variablen AddTask:
 */
let tasks = [];
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
let prio = 'low';


/**
 * call initial functions addTask
 * 
 */
async function initTask() {
    await loadAllTasks();
    await loadCategories();
    initializeButtons();
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
 * funtion to load all categories from remote server
 * 
 *@param {array} categories -all tasks
 * 
 */
async function loadCategories() {
    categoryArray = JSON.parse(await getItem('categories')) || categoryArray;
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
    } else {
        alert("sollte nicht möglich sein");
    }
}


/**
 * 
 * 
 * 
 * 
 */
function overlaySuccessAddTask() {
    const overlayContainer = document.createElement('div');
    overlayContainer.style.display = 'flex';
    overlayContainer.style.alignItems = 'center';
    overlayContainer.style.justifyContent = 'center';
    overlayContainer.style.height = '100vh'; // Vollständige Bildschirmhöhe
    overlayContainer.style.position = 'fixed';
    overlayContainer.style.top = '0';
    overlayContainer.style.left = '0';
    overlayContainer.style.width = '100%';

    const overlayAddTaskSuccess = document.createElement('div');
    overlayAddTaskSuccess.id = 'overlayAddTaskSuccess';
    overlayAddTaskSuccess.classList.add('success');
    overlayContainer.appendChild(overlayAddTaskSuccess);
    document.body.appendChild(overlayContainer);

    setTimeout(() => {
        overlayAddTaskSuccess.style.transform = 'translateY(-50%) translateX(-50%)';

        // Nach weiteren 3 Sekunden auf eine andere Seite weiterleiten
        setTimeout(() => {
            window.location.href = 'board.html';
        }, 3000);
    }, 50);

    addOverlayAddTaskSuccess();
}

function addOverlayAddTaskSuccess() {
    const overlayContainer = document.createElement('div');
    document.getElementById('overlaySuccess').innerHTML = `
    <div class="success">
        <span class="addtaskSuccess">Task successfully created</span>
        <img src="../assets/img/iconboard.svg" class="successIcon">
    </div>
    `;
    // Div entfernen, nachdem die Animation abgeschlossen ist
    setTimeout(() => {
        const overlay = document.getElementById('overlaySuccess');
        if (overlay) overlay.remove();
    }, 10000); // Stellen Sie sicher, dass diese Zeitdauer der Dauer Ihrer CSS-Animation entspricht (in diesem Fall 5 Sekunden = 5000 Millisekunden).
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
        <img src="../assets/img/iconboard.svg" class="successIcon">
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
async function reload() {
    getInputIDs();
    emptyFields();
    resetRequiredFields()
    getLastID();
    await addTaskLoadContacts();
    initializeButtons();
    handleCategoryChange()
    allSubtasks = [];
    allContacts = [];
    subtaskID = 0;
    generateSubtaskHtml();
}



/**
 * 
 * this function add the class white to all buttons from prio at the beginnung or clearing
 * 
 *  
 * 
 */

 
/**
 * This function adds the class 'white' to all buttons at the beginning or clearing
 */
function initializeButtons() {
    ['urgent', 'medium', 'low'].forEach(p => {
        const button = document.getElementById(p);
        if (button) {
            button.classList.add('white');
            button.classList.remove(prio);
        }
    });
}


/**
* This function determines the clicked prio of the current task, removes the class 'white',
* and sets the overall variable 'prio' to the current priority
*
* @param {string} priority - the selected prio by clicking
*/
function selectTaskPrio(priority) {
    initializeButtons();
    const currentPriorityButton = document.getElementById(prio);
    if (currentPriorityButton) {
        currentPriorityButton.classList.add('white');
        currentPriorityButton.classList.remove(prio);
    }
    prio = priority;
    const selectedButton = document.getElementById(priority);
    if (selectedButton) {
        selectedButton.classList.remove('white');
        selectedButton.classList.add(prio);
    }
}



/**
 * function to empty the input fields
 * 
 * 
 */
async function emptyFields() {
    progress = '';
    title.value = '';
    description.value = '';
    assignedTo.value = '';
    dueDate.value = '';
    category.value = '';
    subtask.value = '';
    allSubtasks = [];
    canAdd = true;
    let contactsIcons = document.getElementById('showAssignedContacts');
    contactsIcons.innerHTML = '';
    await addTaskLoadContacts();
    const currentPriorityButton = document.getElementById(prio);
    if (currentPriorityButton) {
        currentPriorityButton.classList.add('white');
        currentPriorityButton.classList.remove(prio);
    }
    prio = 'low';
}


/**
 * Funtion to check the requiered fields and mark them
 * 
 * 
 * 
 */
function checkRequieredFields() {
    canAdd = true;

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
 * 
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