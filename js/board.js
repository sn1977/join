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
];

let contactNameElem;
let contactEmailElem;
let contactPhoneElem;

let todos = [];

/**
 * Initialization of all functions required for startup
 */
async function initboard() {
    await loadAllTasksFromRemote();
    await loadContacts();
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

async function loadContacts() {
    nameOfContact = JSON.parse(await getItem('nameOfContact')) || ['Anton Mayer', 'Alfred Müller', 'Beate Müller'];
    emailOfContact = JSON.parse(await getItem('emailOfContact')) || ['anton@gmail.com', 'alfred@gmail.com', 'beate@gmail.com'];
    telOfContact = JSON.parse(await getItem('telOfContact')) || [123456, 789456, 456951];
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
            <div id="editpopup" class="popup"></div>
            <div id="popup" class="popup">
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
                                <tbody id="table" class="table-style">
                                </tbody>
                            </table>
                            <div id="subtask-container-table">

                            </div>
                        </div>
                        <div id="popup-buttons">

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
        document.getElementById('table').innerHTML += /*html*/ `<tr><td class="td-left">Due Date:</td><td>${formatDate(todo.dueDate)}</td></tr>`;
        document.getElementById('table').innerHTML += /*html*/ `<tr><td class="td-left">Priority</td><td><div class="d-flex"><span style="
        text-transform: capitalize;
        margin-right: 15px;">
        ${todo.prio}</span><img src="/assets/img/${todo.prio}.svg"></div></td></tr>`;
        document.getElementById('table').innerHTML += /*html*/ `<tr><td class="td-left" id="assigned-table"><div class="assignedToContainer"><span>Assigned To:</span><div id="assigned-table-div"></div></div></td></tr>`;
        document.getElementById('subtask-container-table').innerHTML = '';
        document.getElementById('subtask-container-table').innerHTML += /*html*/ `<div class="table-row">
        <div class="table-cell td-left">Subtasks</div>
        <div class="table-cell">
            <div id="subtask-content" class="subtask-content">
            </div>
        </div>
    </div>
    `;
        generateSubtask(todo);
        generateAssignedTo(todo);
        document.getElementById('popup').style.display = 'flex';
        document.getElementById('popup-buttons').innerHTML = '';
        document.getElementById('popup-buttons').innerHTML += /*html*/`<div style="display: flex;
        justify-content: flex-end;
        gap: 8px;">
        <div class="buttonContainer">
        <div class="buttonpopup delete-edit-buttons" onclick="deleteTodo(${todo.id})"><img src="../assets/img/delete.svg">Delete</div><img src="../assets/img/small_vector.svg"><div class="buttonpopup delete-edit-buttons" onclick="openEditPopup(${todo.id})"><img src="../assets/img/edit.svg">Edit</div></div></div>`;

    } else {
        console.error('Task not found');
    }
}

function generateSubtask(todo) {
    for (let i = 0; i < todo.subtask.length; i++) {
        const element = todo.subtask[i];
        const imgClass = element.done ? 'checked' : 'unchecked';
        const checkboxHTML = `
        <div class="subtask-popup-content">
            <div class="popupInputStyle ${imgClass}" id="popupSubtask${i}" onclick="updateSubtaskStatus(${todo.id}, ${i}, this)" style="cursor:pointer"></div>
            <div>${element.subtasktitle}</div>
        </div>
        `;
        document.getElementById('subtask-content').innerHTML += checkboxHTML;
    }
}

function generateAssignedTo(todo) {
    document.getElementById("assigned-table-div").innerHTML = '';
    document.getElementById("assigned-table-div").innerHTML += /*html*/ ``
    for (let i = 0; i < todo.assignedTo.length; i++) {
        const element = todo.assignedTo[i];
        document.getElementById("assigned-table-div").innerHTML += /*html*/ `<div class="assignedToUsers"><div class="user-badge-board" style="background-color:${element.color}">${element.initialien}</div><div>${element.name}</div></div>`

    }
}

function updateSubtaskStatus(todoId, subtaskId, imgElement) {
    const todo = todos.find(t => t.id === todoId);
    if (todo && todo.subtask[subtaskId]) {
        todo.subtask[subtaskId].done = !todo.subtask[subtaskId].done;
        imgElement.className = todo.subtask[subtaskId].done ? 'popupInputStyle checked' : 'popupInputStyle unchecked';
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
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}


function openEditPopup(id) {
    const todo = todos.find(t => t.id === id);
    createEditPopup(todo);
    document.getElementById('editpopup').style.display = 'flex';
    document.getElementById('popup').style.display = 'none';
}

function createEditPopup(todo) {
    document.getElementById("editpopup").innerHTML = '';
    document.getElementById("editpopup").innerHTML += /*html*/ `
        <div class="container-popup">
            <div class="popup-content">
                <img src="/assets/img/cancel.svg" class="close-btn" onclick="closeEditPopup(${todo.id})" alt="Close">
                <div>
                    <h2>Editmodus: "${todo.title}"</h2>
                </div>
                <div class="popup-info-container">
                    <h4>Title</h4>
                    <input type="text" id="todotitle" placeholder="Title" value="${todo.title}">
                    <h4>Description</h4>
                    <textarea type="text" id="tododescription" placeholder="Description">${todo.description}</textarea>
                    <h4>Due Date</h4>
                    <input type="date" id="tododuedate" value="${formatDate(todo.dueDate)}">
                    <div class="direction" id="priority">
                        <h4>Priority</h4>
                        <div class="button-container">
                            <button class="white ${todo.prio === 'urgent' ? 'selected' : ''}" id="urgent" type="button" onclick="selectPriority('urgent', ${todo.id})">Urgent<img src="../assets/img/urgent.svg" alt=""></button>
                            <button class="white ${todo.prio === 'medium' ? 'selected' : ''}" id="medium" type="button" onclick="selectPriority('medium', ${todo.id})">Medium<img src="../assets/img/medium.svg" alt=""></button>
                            <button class="white ${todo.prio === 'low' ? 'selected' : ''}" id="low" type="button" onclick="selectPriority('low', ${todo.id})">Low<img src="../assets/img/low.svg" alt=""></button>
                        </div>
                    </div>
                    <h4>Category</h4>
                    <div class="inputContainer">
                        <select class="custom-select" id="category" name="category" required>
                            <option value="" disabled selected hidden>Select task category</option>
                            <option value="Technical Task">Technical Task</option>
                            <option value="User Story">User Story</option>
                        </select>
                    </div>
                    <h4>Assigned to</h4>
                    <div id="assignedToContactEditPopup"></div>
                    <div class="inputContainer">
                        <h4>Subtask</h4>
                        <div id="savedSubtasks" class="savedSubtasks"></div>
                    </div>
                </div>
                <div class="popup-buttons">
                    <button class="buttonSaveChanges" onclick="saveAllChanges(${todo.id})">Speichern</button>
                </div>
        </div>
    `;

    const selectedCategory = todo.category;

    const categorySelect = document.getElementById('category');

    for (let i = 0; i < categorySelect.options.length; i++) {
        const option = categorySelect.options[i];
        if (option.value === selectedCategory) {
            option.selected = true;
            break;
        }
    }

    generateEditSubtasks(todo);
    generateAssignedToEditPopup(todo);
}


function closeEditPopup(id) {
    openPopup(id)
    document.getElementById('editpopup').style.display = 'none';
    document.getElementById('popup').style.display = 'flex';
    document.getElementById("editpopup").innerHTML = '';
}

function generateEditSubtasks(todo) {
    const subtasksContainer = document.getElementById('savedSubtasks');
    subtasksContainer.innerHTML = '';
    if (todo.subtask && todo.subtask.length > 0) {
        todo.subtask.forEach((subtask, index) => {
            const subtaskDiv = document.createElement('div');
            subtaskDiv.classList.add('editSubtask');
            const subtaskInput = document.createElement('input');
            subtaskInput.type = 'text';
            subtaskInput.id = `subtaskInput-${index}`;
            subtaskInput.value = subtask.subtasktitle;
            subtaskInput.addEventListener('input', (e) => {
                todo.subtask[index].subtasktitle = e.target.value;
                saveAllTasksToRemote();
            });

            const deleteSubtaskButton = document.createElement('button');
            const deleteSubtaskImage = document.createElement('img');
            deleteSubtaskImage.src = '../assets/img/delete.svg';
            deleteSubtaskButton.appendChild(deleteSubtaskImage);
            deleteSubtaskButton.addEventListener('click', () => {
                todo.subtask.splice(index, 1);
                saveAllTasksToRemote();
                generateEditSubtasks(todo);
            });

            subtaskDiv.appendChild(subtaskInput);
            subtaskDiv.appendChild(deleteSubtaskButton);
            subtasksContainer.appendChild(subtaskDiv);
        });
    }

    const addSubtaskInput = document.createElement('input');
    addSubtaskInput.type = 'text';
    addSubtaskInput.placeholder = 'Add a new subtask';
    addSubtaskInput.id = 'inputSubtask'
    addSubtaskInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && addSubtaskInput.value.trim() !== '') {
            const newSubtask = {
                subtasktitle: addSubtaskInput.value.trim(),
                done: false
            };
            todo.subtask.push(newSubtask);
            saveAllTasksToRemote();
            addSubtaskInput.value = '';
            generateEditSubtasks(todo);
        }
    });

    subtasksContainer.insertBefore(addSubtaskInput, subtasksContainer.firstChild);
}

function generateAssignedToEditPopup(todo) {
    const assignedToContainer = document.getElementById('assignedToContactEditPopup');
    assignedToContainer.innerHTML = '';

    if (todo.assignedTo && todo.assignedTo.length > 0) {
        todo.assignedTo.forEach((contact) => {
            const assignedToDiv = document.createElement('div');
            assignedToDiv.classList.add('assignedToUsers');

            const userBadge = document.createElement('div');
            userBadge.classList.add('user-badge-board');
            userBadge.style.backgroundColor = contact.color;
            userBadge.textContent = contact.initialien;

            const userName = document.createElement('div');
            userName.textContent = contact.name;

            assignedToDiv.appendChild(userBadge);
            assignedToDiv.appendChild(userName);
            assignedToContainer.appendChild(assignedToDiv);
        });
    }
}

function selectPriority(priority, id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.prio = priority;

        document.querySelectorAll('.button-container button').forEach(button => {
            button.classList.remove('selected');
        });

        const selectedButton = document.getElementById(priority);
        selectedButton.classList.add('selected');

        saveAllTasksToRemote();
    }
}
function saveAllChanges(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        const newTitle = document.getElementById('todotitle').value;
        todo.title = newTitle;

        const newDescription = document.getElementById('tododescription').value;
        todo.description = newDescription;

        const selectedPriority = document.querySelector('.button-container .selected');
        if (selectedPriority) {
            const priority = selectedPriority.id;
            todo.prio = priority;
        }

        const dueDate = document.getElementById('tododuedate').value;
        todo.dueDate = dueDate;

        const categorySelect = document.getElementById('category');
        const selectedCategory = categorySelect.value;
        todo.category = selectedCategory;

        saveAllTasksToRemote();
        closeEditPopup(id);
        updateHTML();
    } else {
        console.error('Task not found');
    }
}


