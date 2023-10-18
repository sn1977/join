/**
 * @author Christiane
 * Join Gruppenarbeit 727
 * October 2023
 * 
 * 
 */

let allTasks = [];
let lastPrio = '';
let prio = '';
let progress = '';
let taskID = 0;  //jeder Task bekommt eine eindeutige Nummer - muss online abgerufen werden!


// JavaScript, um die Platzhalteroption auszuwählen
document.getElementById("category").selectedIndex = 0;
let message = document.getElementById("title");

message.setCustomValidity("MESSAGE");
message.reportValidity();


/**
 * funtion to load the task
 * 
 * @todo!
 * 
 */
function loadAllTasks(){
    let allTasksAsString = localStorage.getItem('allTasks');
    allTasks = JSON.parse (allTasksAsString);
}

/**
 * Function to reset the form 
 */
function reload(){
    getInput();
    emptyFields(title,  description, assignedTo, dueDate,  category, subtask);
}


/**
 * This function determines the clicked prio of the current task
 * 
 * @param {string} x = the selected prio is passed
 * @param {string} prio = overall variable containing the prio of the current task input
 * @param {string} lastprio = overall variable that contains the previously selected prio
 *  
 */
function taskPrio(x){
    prio = x;
    if(lastPrio != '') {
        resetPrio();
    }
    setPrio ()
    lastPrio = x; 
}

/**
 * Function to change the color of the selected color
 * 
 */
function setPrio (){
    let element = '';
    let imageElement = '';
    element = document.getElementById(`${prio}`);
    element.querySelector('img');
    element.classList.remove ('white');
    element.classList.add (`${prio}`);
    imageElement = element.querySelector('img');
    imageElement.style.filter = "brightness(0%) invert(1)";  
}


/**
 * Function to change the color of the previously selected prio back to white
 * 
 */
function resetPrio(){
    let element = '';
    let imageElement = '';
    element = document.getElementById(`${lastPrio}`);
    element.querySelector('img');
    element.classList.add ('white');
    element.classList.remove (`${lastPrio}`);
    imageElement = element.querySelector('img');
    imageElement.style.filter = "brightness(100%) invert(0)";  
}


// this function opens and closes the list of assignable names in the user's contacts
function toggleContacts() { 
    document.getElementById('assignedToContainer').classList.toggle('d-none');
}


/**
 * Fügt einen neuen Task hinzu
 * 
 * 
 * 
 */
function addTask (progress){

    getInput(); 
    taskID++;

    let task = {
        'taskId' : taskID,
        'title' : title.value,
        'description': description.value,
        'assignedTo' : assignedTo.value,
        'dueDate' : Date(dueDate.value),
        'prio' : prio,
        'category': category.value,
        'subtask' : subtask.value,
        'progress' : progress,
        'createdAt': new Date().getTime(),
        'modifiedAt': new Date().getTime(),
        'assignedTo' : getContacts()
    };

    allTasks.push(task);
    let allTasksAsString = JSON.stringify(allTasks);
    localStorage.setItem('allTasks', allTasksAsString);
    alert("Aufgabe hinnzugefügt");
    emptyFields(title,  description, assignedTo, dueDate,  category, subtask);
    resetPrio();
}

/**
 * Function to get the var from the inputfields
 * 
 * @returns 
 */
function getInput(){
    let title = document.getElementById('title');
    let description = document.getElementById('description');
    let assignedTo = document.getElementById('assignedTo');
    let dueDate = document.getElementById('dueDate');
    let category = document.getElementById('category');
    let subtask = document.getElementById('subtask');

    return (title, description, assignedTo, dueDate, category, subtask);
}

function getContacts(){

}

function emptyFields(title, description, assignedTo, dueDate, category, subtask){
    progress = '';
    title.value ='';
    description.value ='';
    assignedTo.value = '';
    dueDate.value = '';
    prio = '';
    category.value = '';
    subtask.value = '';
}


function openSelect (){
    document.getElementById('assignedTo').append = 'multiple';
}