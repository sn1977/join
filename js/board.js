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
let allContactsBoard = [];


/**
 * Initializes the application, loads tasks and contacts from remote storage, and prepares the board.
 */
async function initboard() {
    await loadAllTasksFromRemote();
    await loadContacts();
    renderBoard();
    updateHTML();
    addTaskLoadContactsBoard();
}



/**
 * Loads all tasks from remote storage and updates the local state.
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

/**
 * Loads contact data from remote storage.
 */
async function loadContacts() {
    contacts = JSON.parse(await getItem('contacts')) || contacts;
}

/**
 * Saves all current tasks to remote storage.
 */
async function saveAllTasksToRemote() {
    try {
        await setItem('tasks', JSON.stringify(todos));
    } catch (error) {
        console.error('Fehler beim Hochladen der Daten:', error);
    }
}

/**
 * Renders the main task board with different progress containers.
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
 * Filters tasks based on a search query entered in the standard search input.
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
    updateHTML(searchQuery ? filteredTodos : todos);
}

/**
 * Filters tasks based on a search query entered in the mobile search input.
 */
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
    updateHTML(searchQuery ? filteredTodos : todos);
}


/**
 * Updates the HTML representation of the task board, optionally filtering the tasks displayed.
 * @param {array} [tasks=todos] - The list of tasks to be displayed. Defaults to the original list of all tasks.
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
 * Starts the drag action for a task and applies a visual effect.
 * @param {number} id - The unique identifier of the task being dragged.
 */
function startDragging(id) {
    currentDraggedElement = id;
    let element = document.querySelector(`[ondragstart="startDragging(${id})"]`);
    element.classList.add("rotated");
}

/**
 * Stops the drag action for a task and removes the visual effect.
 * @param {number} id - The unique identifier of the task that was being dragged.
 */
function stopDragging(id) {
    let element = document.querySelector(`[ondragstart="startDragging(${id})"]`);
    element.classList.remove("rotated");
}


/**
 * Generates HTML content for a single task, including its subtasks and assigned users.
 * @param {Object} element - The task object for which HTML content is generated.
 * @returns {string} HTML content for the given task.
 */
function generateHTML(element) {
    const categoryClass = element['category'] === 'User Story' ? 'user-story' : 'technical-task';
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

    const isTop = element.progress === 'todo';
    const isBottom = element.progress === 'done';
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

/**
 * Moves a task up or down in the list of tasks based on the specified direction.
 * @param {number} taskId - The unique identifier of the task to be moved.
 * @param {string} direction - The direction to move the task ('up' or 'down').
 */
async function moveTask(taskId, direction) {
    const taskIndex = todos.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
        const currentStageIndex = progressStages.indexOf(todos[taskIndex].progress);
        if (direction === 'up' && currentStageIndex > 0) {
            todos[taskIndex].progress = progressStages[currentStageIndex - 1];
        } else if (direction === 'down' && currentStageIndex < progressStages.length - 1) {
            todos[taskIndex].progress = progressStages[currentStageIndex + 1];
        }
        updateHTML();
        await saveAllTasksToRemote();
    } else {
        console.error(`Task with ID ${taskId} not found.`);
    }
}

/**
 * Moves a task up in the task list by swapping it with the task above it.
 * @param {number} index - The current index of the task in the todos array.
 */
function moveTaskUp(index) {
    if (index > 0) {
        [todos[index], todos[index - 1]] = [todos[index - 1], todos[index]];
        console.log(`Task moved up: `, todos);
    }
}

/**
 * Moves a task down in the task list by swapping it with the task below it.
 * @param {number} index - The current index of the task in the todos array.
 */
function moveTaskDown(index) {
    if (index < todos.length - 1) {
        [todos[index], todos[index + 1]] = [todos[index + 1], todos[index]];
        console.log(`Task moved down: `, todos);
    }
}

/**
 * Prevents the default behavior for the dragover event to allow dropping.
 * @param {Event} ev - The dragover event object.
 */
function allowDrop(ev) {
    ev.preventDefault();
}

/**
 * Moves a task to a specified progress stage when dropped.
 * @param {string} progress - The progress stage to move the task to.
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
 * Sorts an array of tasks by their last modification time.
 * @param {array} todosArray - The array of tasks to be sorted.
 * @returns {array} A sorted array of tasks.
 */
function sortTodos(todosArray) {
    return todosArray.sort((a, b) => a.modifiedAt - b.modifiedAt);
}