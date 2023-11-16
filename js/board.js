/**
 * @author Patrick
 * Join Gruppenarbeit 727
 * October 2023
 * 
 */
let subtaskEditMode = false;
let currentDraggedElement;
let boardNames = [
    'To do',
    'In progress',
    'Await feedback',
    'Done'
];
const progressStages = ['todo', 'inprogress', 'awaitfeedback', 'done'];


let todos = [];
let contactpoolBoard = [];
// const colors = ['#FF7A00', '#9327FF', '#6E52FF', '#FC71FF', '#FFBB2B', '#1FD7C1', '#462F8A', '#0038FF'];
let allContactsBoard = [];


/**
 * Initialization of all functions required for startup
 */
async function initboard() {
    await loadAllTasksFromRemote();
    await loadContacts();
    renderBoard();
    updateHTML();
    addTaskLoadContactsBoard();
}



/**
 * 
 * This function load all task from remote Storage
 * 
 */
async function loadAllTasksFromRemote() {
    try {
        const remoteData = await getItem('tasks');
        if (remoteData) {
            todos = JSON.parse(remoteData);
        } else {
            todos = [];
        }
    } catch (error) {
        console.error('Fehler beim Herunterladen der Daten von Remote:', error);
    }
}

async function loadContacts() {
    /* nameOfContact = JSON.parse(await getItem('nameOfContact')) || ['Anton Mayer', 'Alfred Müller', 'Beate Müller'];
    emailOfContact = JSON.parse(await getItem('emailOfContact')) || ['anton@gmail.com', 'alfred@gmail.com', 'beate@gmail.com'];
    telOfContact = JSON.parse(await getItem('telOfContact')) || [123456, 789456, 456951]; */
    contacts = JSON.parse(await getItem('contacts')) || contacts;
}

/**
 * 
 * This function save all tasks to Remote Storage
 * 
 */
async function saveAllTasksToRemote() {
    try {
        await setItem('tasks', JSON.stringify(todos));
    } catch (error) {
        console.error('Fehler beim Hochladen der Daten:', error);
    }
}

/**
 * This function renders the board
 */
function renderBoard() {
    document.getElementById('content').innerHTML = '';
    document.getElementById('content').innerHTML += /*html*/ `<div class="board" id="board"></div>`;
    document.getElementById('board').innerHTML += boardHTML();
    for (let i = 0; i < boardNames.length; i++) {
        const name = boardNames[i];
        const progress = name.toLowerCase().replace(' ', '');
        if (i < 3) {
            document.getElementById('boardContent').innerHTML += /*html*/ `
            <div class="progressContainer">
                <div class="progressContainerStatusHead">
                    <div class="progressStatus">
                        ${name}
                    </div>
                    <div>
                    <img src="../assets/img/addbutton.svg" alt="Add Task" class="add-button" onclick="overlayAddTask('${progress}')">
                    </div>
                </div>
            <div class="statusContainer" id="statusContainer${i}" ondrop="moveTo('${progress}')" ondragover="allowDrop(event)"></div>
        </div>`
        } else {
            document.getElementById('boardContent').innerHTML += /*html*/ `
            <div class="progressContainer">
                <div class="progressContainerStatusHead">
                    <div class="progressStatus">
                        ${name}
                    </div>
                </div>
            <div class="statusContainer" id="statusContainer${i}" ondrop="moveTo('${progress}')" ondragover="allowDrop(event)"></div>
        </div>`
        }
    }

    const searchInput = document.getElementById('inputSearch');
    searchInput.addEventListener('keyup', searchTasks);
    const searchInputMobile = document.getElementById('inputSearchMobile');
    searchInputMobile.addEventListener('keyup', searchTasksMobile);
}


/**
 * This function filters the tasks based on the search query and updates the HTML
 */
function searchTasks() {
    const searchQuery = document.getElementById('inputSearch').value.toLowerCase();
    const filteredTodos = todos.filter(todo => {
        return todo.title.toLowerCase().includes(searchQuery) ||
            todo.category.toLowerCase().includes(searchQuery) ||
            todo.description.toLowerCase().includes(searchQuery) ||
            (todo.assignedTo && todo.assignedTo.some(benutzer => {
                return benutzer.name.toLowerCase().includes(searchQuery) ||
                    benutzer.initialien.toLowerCase().includes(searchQuery);
            }));
    });

    // Call updateHTML but pass the filtered list if there is a search query
    updateHTML(searchQuery ? filteredTodos : todos);
}

function searchTasksMobile() {
    const searchQuery = document.getElementById('inputSearchMobile').value.toLowerCase();
    const filteredTodos = todos.filter(todo => {
        return todo.title.toLowerCase().includes(searchQuery) ||
            todo.category.toLowerCase().includes(searchQuery) ||
            todo.description.toLowerCase().includes(searchQuery) ||
            (todo.assignedTo && todo.assignedTo.some(benutzer => {
                return benutzer.name.toLowerCase().includes(searchQuery) ||
                    benutzer.initialien.toLowerCase().includes(searchQuery);
            }));
    });

    // Call updateHTML but pass the filtered list if there is a search query
    updateHTML(searchQuery ? filteredTodos : todos);
}


/**
 * This function filter and sort the todos and renders the tasks on the board
 * @param {array} tasks - The list of tasks to display, defaults to original todos if not provided
 */
function updateHTML(tasks = todos) {
    let todo = sortTodos(tasks.filter(t => t['progress'] == 'todo'));
    document.getElementById('statusContainer0').innerHTML = '';
    if (todo.length == 0) {
        document.getElementById('statusContainer0').innerHTML = /*html*/ `
        <div class="noTaskDiv">No Tasks To do</div>
        `;
    } else {
        for (let i = 0; i < todo.length; i++) {
            const element = todo[i];
            document.getElementById('statusContainer0').innerHTML += generateHTML(element);
        }
    }

    let inprogress = sortTodos(tasks.filter(t => t['progress'] == 'inprogress'));
    document.getElementById('statusContainer1').innerHTML = '';
    if (inprogress.length == 0) {
        document.getElementById('statusContainer1').innerHTML = /*html*/ `
        <div class="noTaskDiv">No Tasks In Progress</div>
        `;
    } else {
        for (let i = 0; i < inprogress.length; i++) {
            const element = inprogress[i];
            document.getElementById('statusContainer1').innerHTML += generateHTML(element);
        }
    }

    let awaitfeedback = sortTodos(tasks.filter(t => t['progress'] == 'awaitfeedback'));
    document.getElementById('statusContainer2').innerHTML = '';
    if (awaitfeedback.length == 0) {
        document.getElementById('statusContainer2').innerHTML = /*html*/ `
        <div class="noTaskDiv">No Tasks Awaiting Feedback</div>
        `;
    } else {
        for (let i = 0; i < awaitfeedback.length; i++) {
            const element = awaitfeedback[i];
            document.getElementById('statusContainer2').innerHTML += generateHTML(element);
        }
    }

    let done = sortTodos(tasks.filter(t => t['progress'] == 'done'));
    document.getElementById('statusContainer3').innerHTML = '';
    if (done.length == 0) {
        document.getElementById('statusContainer3').innerHTML = /*html*/ `
        <div class="noTaskDiv">No Tasks Done</div>
        `;
    } else {
        for (let i = 0; i < done.length; i++) {
            const element = done[i];
            document.getElementById('statusContainer3').innerHTML += generateHTML(element);
        }
    }
}


/**
 * This function starts the dragging of the task and add the rotaded class
 * 
 * @param {number} id 
 */
function startDragging(id) {
    currentDraggedElement = id;
    let element = document.querySelector(`[ondragstart="startDragging(${id})"]`);
    element.classList.add("rotated");
}

/**
 * This function stops the dragging of the task and remove the rotaded class
 * 
 * @param {number} id 
 */
function stopDragging(id) {
    let element = document.querySelector(`[ondragstart="startDragging(${id})"]`);
    element.classList.remove("rotated");
}


/**
 * Diese Funktion generiert HTML für eine Aufgabe und deren zugewiesene Benutzer.
 * 
 * @param {array} element 
 * @returns das HTML  
 */
function generateHTML(element) {
    const categoryClass = element['category'] === 'User Story' ? 'user-story' : 'technical-task';

    // Berechne den Fortschritt der Teilaufgaben
    const abgeschlosseneTeilaufgaben = element.subtask ? element.subtask.filter(task => task.done).length : 0;
    const gesamteTeilaufgaben = element.subtask ? element.subtask.length : 0;
    const fortschritt = gesamteTeilaufgaben > 0 ? (abgeschlosseneTeilaufgaben / gesamteTeilaufgaben) * 100 : 0;

    let zugewieseneBenutzerHTML = '';
    const benutzerAnzahl = element.assignedTo.length;
    const maxAnzeigeBenutzer = 5;

    if (benutzerAnzahl > 0) {
        element.assignedTo.slice(0, maxAnzeigeBenutzer).forEach(benutzer => {
            zugewieseneBenutzerHTML += `<div class="user-badge-board extra-margin" style="background-color:${benutzer.color}">${benutzer.initialien}</div>`;
        });

        if (benutzerAnzahl > maxAnzeigeBenutzer) {
            zugewieseneBenutzerHTML += `<div class="user-badge-board extra-margin moreusers">+${benutzerAnzahl - maxAnzeigeBenutzer}</div>`;
        }
    }

    let progressHTML = '';
    if (gesamteTeilaufgaben > 0) {
        progressHTML = `
            <div class="progress">
                <div class="progress-container">
                    <div class="progress-bar" id="myBar" style="width: ${fortschritt}%"></div>
                </div>
                <span class="subtask-container">${abgeschlosseneTeilaufgaben}/${gesamteTeilaufgaben} Subtasks</span>
            </div>
        `;
    } else {
        progressHTML = `
        <div class="progress">
            
        </div>`
    }

    // Überprüfe den Status des Todos, um Pfeile zu aktivieren oder zu deaktivieren
    const isTop = element.progress === 'todo'; // Anpassen basierend auf Ihrer Logik
    const isBottom = element.progress === 'done'; // Anpassen basierend auf Ihrer Logik

    let upArrowDisabled = isTop ? 'disabled' : '';
    let downArrowDisabled = isBottom ? 'disabled' : '';

    return /*html*/ `
      <div class="todo" 
           draggable="true"
           ondragstart="startDragging(${element['id']})"
           ondragend="stopDragging(${element['id']})"
           onclick="openPopup(${element['id']})">
           
        <div class="todoContainer">
          <div class="todoType ${categoryClass}">${element['category']}</div>
          <div class="todoInfo">
            <span class="todoTitle">${element['title']}</span>
            <span class="todoDescription">${element['description']}</span>
          </div>
          ${progressHTML}
          <div class="assignedToUsers">${zugewieseneBenutzerHTML}</div>
          <div class="todo-arrows">
              <button class="arrow-buttons" ${upArrowDisabled} onclick="event.stopPropagation(); moveTask(${element['id']}, 'up')">↑</button>
              <button class="arrow-buttons" ${downArrowDisabled} onclick="event.stopPropagation(); moveTask(${element['id']}, 'down')">↓</button>
          </div>
        </div>
      </div>
    `;
}



async function moveTask(taskId, direction) {
    const taskIndex = todos.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
        const currentStageIndex = progressStages.indexOf(todos[taskIndex].progress);
        if (direction === 'up' && currentStageIndex > 0) {
            // Bewege den Task zum vorherigen Fortschrittsstatus
            todos[taskIndex].progress = progressStages[currentStageIndex - 1];
        } else if (direction === 'down' && currentStageIndex < progressStages.length - 1) {
            // Bewege den Task zum nächsten Fortschrittsstatus
            todos[taskIndex].progress = progressStages[currentStageIndex + 1];
        }

        // Aktualisiere die Ansicht nach dem Verschieben
        updateHTML();
        await saveAllTasksToRemote();

    } else {
        console.error(`Task with ID ${taskId} not found.`);
    }
}



function moveTaskUp(index) {
    if (index > 0) {
        // Tausche den Task mit dem vorherigen Task
        [todos[index], todos[index - 1]] = [todos[index - 1], todos[index]];
        console.log(`Task moved up: `, todos);

    }
}

function moveTaskDown(index) {
    if (index < todos.length - 1) {
        // Tausche den Task mit dem nächsten Task
        [todos[index], todos[index + 1]] = [todos[index + 1], todos[index]];
        console.log(`Task moved down: `, todos);

    }
}



/**
 * This function is used to prevent the default action of the drag event
 * 
 * @param {string} ev 
 */
function allowDrop(ev) {
    ev.preventDefault();
}

/**
 * This function is used to move the task to the selected progress
 * 
 * @param {string} progress 
 */
async function moveTo(progress) {
    const todoItem = todos.find(todo => todo.id === currentDraggedElement);

    if (todoItem) {
        todoItem['progress'] = progress;
        todoItem['modifiedAt'] = new Date().getTime();
        updateHTML();
        await saveAllTasksToRemote();
    } else {
        console.error(`Todo with ID ${currentDraggedElement} not found!`);
    }

}

/**
 * This function sorts the todos by last modified
 * 
 * @param {array} todosArray 
 * @returns a new array sorted by last modified
 */
function sortTodos(todosArray) {
    return todosArray.sort((a, b) => a.modifiedAt - b.modifiedAt);
}


