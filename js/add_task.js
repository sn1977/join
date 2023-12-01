/**
 * Functions and variables for managing tasks and categories.
 * 
 * @author Christiane
 * @version 1.0
 * @since October 2023
 * @module TaskManagement
 * 
 */


/**
 * Array to store task data.
 * 
 * @type {Array}
 * 
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
let prio = '';


/**
 *  Initializes the task-related functions.
 * 
 * @async
 * @function
 * 
 */
async function initTask() {
    await loadAllTasks();
    await loadCategories();
    initializeButtons();
    reload();
}


/**
 * Loads all tasks from the remote server.
 * 
 * @async
 * @function
 * @param {Array} tasks - Array to store all tasks.
 * 
 */
async function loadAllTasks() {
    tasks = JSON.parse(await getItem('tasks'));
}


/**
 * Loads all categories from the remote server.
 * 
 * @async
 * @function
 * @param {Array} categories - Array to store all categories.
 * 
 */
async function loadCategories() {
    categoryArray = JSON.parse(await getItem('categories')) || categoryArray;
}


/**
 *  Retrieves input field IDs and saves them in global variables.
 * 
 * @function
 * @param {string} title - Input field for title.
 * @param {string} description - Input field for description.
 * @param {string} assignedTo - Input field for assigned contacts.
 * @param {string} dueDate - Input field for due date.
 * @param {string} category - Input field for category.
 * @param {string} subtask - Input field for subtasks.
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
 * Gathers values from input fields to create a new task.
 * 
 * @function
 * @param {string} progress - Progress status of the task.
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
 * Adds a new task.
 * 
 * @async
 * @function
 * @param {string} progress - Progress status of the task
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
    }
}


/**
 * Displays an overlay indicating a successful task creation and redirects to the board page
 * 
 * @function
 * 
 */
function overlaySuccessAddTask() {
    const overlayContainer = document.createElement('div');
    overlayContainer.id = 'overlaySuccess';
    document.body.appendChild(overlayContainer);
    setTimeout(() => {
        overlayContainer.style.left = '50%';
    }, 50);
    setTimeout(() => {
        window.location.href = 'board.html';
    }, 3050);
    addOverlayAddTaskSuccess();
}


/**
 * Adds content to the success overlay
 * 
 * @function
 * 
 */
function addOverlayAddTaskSuccess() {
    const overlayContainer = document.getElementById('overlaySuccess');
    if (overlayContainer) {
        overlayContainer.innerHTML = /*HTML*/ `
        <div class="success">
            <span class="addtaskSuccess">Task successfully created</span>
            <img src="../assets/img/iconboard.svg" class="successIcon">
        </div>
        `;
        setTimeout(() => {
            overlayContainer.remove();
        }, 10000);
    }
}


/**
 * Finds the maximum task ID and returns an ID for the new task.
 * 
 * @async
 * @function
 * @returns {number} - New task ID.
 * 
 */
async function getLastID() {
    let maxID = 0;
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
 * Resets the form and associated variables.
 * 
 * @async
 * @function
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
    placeholderCategory();
}


/**
 * Initializes buttons, setting their initial state.
 * 
 * @function
 * 
 */
function initializeButtons() {
    ['urgent', 'medium', 'low'].forEach(p => {
        const button = document.getElementById(p);
        if (button) {
            button.classList.add('white');
            if (prio) {
                button.classList.remove(prio);
            }
        }
    });
}


/**
*  Selects the priority of a task and updates the UI.

 * @function
 * @param {string} priority - Selected priority.
 * 
*/
function selectTaskPrio(priority) {
    initializeButtons();
    if (prio) {
        const currentPriorityButton = document.getElementById(prio);
        if (currentPriorityButton) {
            currentPriorityButton.classList.add('white');
            currentPriorityButton.classList.remove(prio);
        }
    }
    prio = priority;
    const selectedButton = document.getElementById(priority);
    if (selectedButton) {
        selectedButton.classList.remove('white');
        selectedButton.classList.add(prio);
    }
}


/**
 * Empties the input fields and resets related variables.
 * 
 * @async
 * @function
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
    if(prio) {
    const currentPriorityButton = document.getElementById(prio);
     if (currentPriorityButton) {
         currentPriorityButton.classList.add('white');
         currentPriorityButton.classList.remove(prio);
     }
    }
    prio = '';
}


/**
 * Checks required fields and marks them if empty.
 * 
 * @function
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
    if (prio == '') {
        document.getElementById("warningPrio").classList.add("warning");
        document.getElementById("prio").classList.add("warning-border");
        canAdd = false;
    } else {
        document.getElementById("warningPrio").classList.remove("warning");
        document.getElementById("prio").classList.remove("warning-border");
    }
}


/**
 * Resets error messages for required fields.
 * 
 * @function
 * 
 */
function resetRequiredFields() {
    document.getElementById("warningtitle").classList.remove("warning");
    document.getElementById("title").classList.remove("warning-border");
    document.getElementById("warningDueDate").classList.remove("warning");
    document.getElementById("dueDate").classList.remove("warning-border");
    document.getElementById("warningcategory").classList.remove("warning");
    document.getElementById("category").classList.remove("warning-border");
    document.getElementById("warningPrio").classList.remove("warning");
    document.getElementById("prio").classList.remove("warning-border");
}