/**
 * @author Patrick
 * Join Gruppenarbeit 727
 * October 2023
 * 
 */

let currentDraggedElement;
let boardNames = [
    'To do',
    'In progress',
    'Await feedback',
    'Done'
]

let todos = [];

/**
 * Initialization of all functions required for startup
 */
async function init() {
    await loadAllTasksFromRemote();
    renderBoard();
    updateHTML();
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
    document.getElementById('board').innerHTML += /*html*/ `
            <div id="popup" class="popup" style="display: none;">
                <div class="container-popup">
                    <div class="popup-content">
                        <div class="d-flex">
                            <img src="/assets/img/cancel.svg" class="close-btn" onclick="closePopup()" alt="Close">
                            <p class="todoType" id="popupCategory"></p>
                        </div> 
                        <div class="popup-info-container">
                            <h2 id="popupTitle"></h2>
                            <p id="popupDescription"></p>
                            <table>
                                <tbody id="table">
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                
            </div> 
			<section class="boardHeader" id="boardHeader">
				<div class="boardHeadlineLeft">
					Board
				</div>
				<div class="boardHeadlineRight">
					<div class="search">
						<input type="text" id="inputSearch" class="inputSearch" placeholder="Find task">
						<div class="buttonSearch">
							<img src="../assets/img/search.svg" alt="Search">
						</div>
					</div>
					<button class="buttonAddTask">
						<span>Add Task</span>
						<span>+</span>
					</button>
				</div>
			</section>
            <section class="boardContent" id="boardContent">
			
			</section>
    `;

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
                        <img src="../assets/img/addbutton.svg" alt="Add Task">
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
}



/**
 * This function filter and sort the todos and renders the tasks on the board
 */
function updateHTML() {
    let todo = sortTodos(todos.filter(t => t['progress'] == 'todo'));
    document.getElementById('statusContainer0').innerHTML = '';
    if (todo.length == 0) {
        document.getElementById('statusContainer0').innerHTML = /*html*/ `
        <div class="noTaskDiv">No Tasks To do</div>
        `
    } else {
        for (let i = 0; i < todo.length; i++) {
            const element = todo[i];
            document.getElementById('statusContainer0').innerHTML += generateHTML(element);
        }
    }


    let inprogress = sortTodos(todos.filter(t => t['progress'] == 'inprogress'));
    document.getElementById('statusContainer1').innerHTML = '';
    if (inprogress.length == 0) {
        document.getElementById('statusContainer1').innerHTML = /*html*/ `
        <div class="noTaskDiv">No Tasks To do</div>
        `
    } else {
        for (let i = 0; i < inprogress.length; i++) {
            const element = inprogress[i];
            document.getElementById('statusContainer1').innerHTML += generateHTML(element);
        }
    }

    let awaitfeedback = sortTodos(todos.filter(t => t['progress'] == 'awaitfeedback'));
    document.getElementById('statusContainer2').innerHTML = '';
    if (awaitfeedback.length == 0) {
        document.getElementById('statusContainer2').innerHTML = /*html*/ `
        <div class="noTaskDiv">No Tasks To do</div>
        `
    } else {
        for (let i = 0; i < awaitfeedback.length; i++) {
            const element = awaitfeedback[i];
            document.getElementById('statusContainer2').innerHTML += generateHTML(element);
        }
    }

    let done = sortTodos(todos.filter(t => t['progress'] == 'done'));
    document.getElementById('statusContainer3').innerHTML = '';
    if (done.length == 0) {
        document.getElementById('statusContainer3').innerHTML = /*html*/ `
        <div class="noTaskDiv">No Tasks To do</div>
        `
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
 * This Function renders the Todo HTML
 * 
 * @param {array} element 
 * @returns the HTML  
 */
function generateHTML(element) {
    // Berechne den Fortschritt der Subtasks
    const completedSubtasks = element.subtask ? element.subtask.filter(task => task.done).length : 0;
    const totalSubtasks = element.subtask ? element.subtask.length : 0;
    const progress = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

    return /*html*/ `
      <div draggable="true" class="todo" 
           ondragstart="startDragging(${element['id']})"
           ondragend="stopDragging(${element['id']})"
           onclick="openPopup(${element['id']})">
           
        <div class="todoContainer">
          <div class="todoType">${element['category']}</div>
          <div class="todoInfo">
            <span class="todoTitle">${element['title']}</span>
            <span class="todoDescription">${element['description']}</span>
          </div>
          <div class="progress">
            <div class="progress-container">
              <div class="progress-bar" id="myBar" style="width: ${progress}%"></div>
            </div>
            <span class="subtask-container">${completedSubtasks}/${totalSubtasks} Subtasks</span>
          </div>
          <div>Users</div>
        </div>
      </div>
    `;
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

/**
 * This function opens the popup with the selected task
 * 
 * @param {string} element 
 */
function openPopup(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        document.getElementById('popupTitle').innerText = todo.title;
        document.getElementById('popupDescription').innerText = todo.description;
        document.getElementById('popupCategory').innerText = todo.category;
        document.getElementById('table').innerHTML = '';
        document.getElementById('table').innerHTML += /*html*/ `<tr><td>Due Date:</td><td>${formatDate(todo.dueDate)}</td></tr>`;
        document.getElementById('table').innerHTML += /*html*/ `<tr><td>Priority</td><td><div><span style="
        text-transform: capitalize;
    ">${todo.prio}</span><img src="/assets/img/${todo.prio}.svg"></div></td></tr>`;
        document.getElementById('table').innerHTML += /*html*/ `<tr><td><span>Assigned To:</span><div>${todo.assignedTo}</div></td></tr>`
        document.getElementById('table').innerHTML += /*html*/ `<tr><td>Subtask:</td><td><div id="subtask-content"></div></td></tr>`;
        generateSubtask(todo);
        document.getElementById('popup').style.display = 'flex';
        document.getElementById('popup').innerHTML += `
    <button onclick="deleteTodo(${todo.id})">Löschen</button>
`;
    } else {
        console.error('Task not found');
    }
}

function generateSubtask(todo) {
    for (let i = 0; i < todo.subtask.length; i++) {
        const element = todo.subtask[i];
        const isChecked = element.done ? 'checked' : '';
        const checkboxHTML = `
            <input type="checkbox" ${isChecked} onchange="updateSubtaskStatus(${todo.id}, ${i}, this)">
            <div>${element.subtasktitle}</div>
        `;
        document.getElementById('subtask-content').innerHTML += checkboxHTML;
    }
}

function updateSubtaskStatus(todoId, subtaskId, checkboxElement) {
    const todo = todos.find(t => t.id === todoId);
    if (todo && todo.subtask[subtaskId]) {
        todo.subtask[subtaskId].done = checkboxElement.checked;
        saveAllTasksToRemote();
        updateHTML();
    }
}

function deleteTodo(todoId) {
    const index = todos.findIndex(t => t.id === todoId);
    if (index !== -1) {
        todos.splice(index, 1);
        saveAllTasksToRemote();
        closePopup();
        updateHTML();
    } else {
        console.error(`Todo with ID ${todoId} not found!`);
    }
}



/**
 * This function closes the popup
 */
function closePopup() {
    document.getElementById('popup').style.display = 'none';
}

function formatDate(input) {
    let date = new Date(input);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}