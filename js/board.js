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
                    <div class="mobileHeadlineRight">
                    <button class="buttonAddTask" onclick="overlayAddTask('todo')">
						<span>+</span>
					</button>
                </div>
				</div>
				<div class="boardHeadlineRight">
					<div class="search">
						<input type="text" id="inputSearch" class="inputSearch" placeholder="Find task">
						<div class="buttonSearch">
							<img src="../assets/img/search.svg" alt="Search">
						</div>
					</div>
					<button class="buttonAddTask" onclick="overlayAddTask('todo')">
						<span>Add Task</span>
						<span>+</span>
					</button>
				</div>
                
                <div class="searchMobile">
					<input type="text" id="inputSearch" class="inputSearch mobile" placeholder="Find task">
					<div class="buttonSearch">
						<img src="../assets/img/search.svg" alt="Search">
					</div>
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
                        <img src="../assets/img/addbutton.svg" alt="Add Task" onclick="overlayAddTask('${progress}')">
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
}


/**
 * This function filters the tasks based on the search query and updates the HTML
 */
function searchTasks() {
    const searchQuery = document.getElementById('inputSearch').value.toLowerCase();
    const filteredTodos = todos.filter(todo => {
        return todo.title.toLowerCase().includes(searchQuery) ||
            todo.category.toLowerCase().includes(searchQuery);
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

    const zugewieseneBenutzerHTML = element.assignedTo.map(benutzer => (
        `<div class="user-badge-board extra-margin" style="background-color:${benutzer.color}">${benutzer.initialien}</div>`
    )).join('');

    return /*html*/ `
      <div draggable="true" class="todo" 
           ondragstart="startDragging(${element['id']})"
           ondragend="stopDragging(${element['id']})"
           onclick="openPopup(${element['id']})">
           
        <div class="todoContainer">
          <div class="todoType ${categoryClass}">${element['category']}</div>
          <div class="todoInfo">
            <span class="todoTitle">${element['title']}</span>
            <span class="todoDescription">${element['description']}</span>
          </div>
          <div class="progress">
            <div class="progress-container">
              <div class="progress-bar" id="myBar" style="width: ${fortschritt}%"></div>
            </div>
            <span class="subtask-container">${abgeschlosseneTeilaufgaben}/${gesamteTeilaufgaben} Subtasks</span>
          </div>
          <div class="assignedToUsers">${zugewieseneBenutzerHTML}</div>
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
        const categoryClass = todo['category'] === 'User Story' ? 'user-story' : 'technical-task';

        // Entferne zuerst alle vorherigen Klassen
        const popupCategory = document.getElementById('popupCategory');
        popupCategory.classList.remove('user-story', 'technical-task');

        // Füge die entsprechende Klasse basierend auf der Kategorie hinzu
        popupCategory.classList.add(categoryClass);

        document.getElementById('popupTitle').innerText = todo.title;
        document.getElementById('popupDescription').innerText = todo.description;
        document.getElementById('popupCategory').innerText = todo.category;
        document.getElementById('table').innerHTML = '';
        document.getElementById('table').innerHTML += /*html*/ `<tr><td class="td-left">Due Date:</td><td>${todo.dueDate}</td></tr>`;
        document.getElementById('table').innerHTML += /*html*/ `<tr><td class="td-left">Priority</td><td><div class="d-flex"><span style="
        text-transform: capitalize;
        margin-right: 15px;">
        ${todo.prio}</span><img src="/assets/img/${todo.prio}.svg"></div></td></tr>`;
        document.getElementById('table').innerHTML += /*html*/ `<tr><td class="td-left" id="assigned-table"><div class=""><span>Assigned To:</span><div id="assigned-table-div"></div></div></td></tr>`;
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

    }
}


function generateSubtask(todo) {
    for (let i = 0; i < todo.subtask.length; i++) {
        const element = todo.subtask[i];
        const imgClass = element.done ? 'checkedSub' : 'uncheckedSub';
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
        imgElement.className = todo.subtask[subtaskId].done ? 'popupInputStyle checkedSub' : 'popupInputStyle uncheckedSub';
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
        renderBoard();
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
    renderBoard();
    updateHTML();
}

function formatDate(input) {
    let date = new Date(input);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${day}/${month}/${year}`;
}



function openEditPopup(id) {
    const todo = todos.find(t => t.id === id);

    closePopup();
    createEditPopup(todo);
    initializeDatepicker();
    document.getElementById('editpopup').style.display = 'flex';
    document.getElementById('popup').style.display = 'none';
}

function createEditPopup(todo) {
    allContactsBoard = todo.assignedTo;
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
                    <input type="text" id="dueDate" value="${todo.dueDate}">
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

                    <div class="inputContainer">
                        <input class="custom-select"  onclick="toggleContactsBoard(),filterContactsBoard()"
                            id="assignedTo" type="text" placeholder="Select contacts to assign">
                        <div class="d-none assignedToContainerBoard" id="assignedToContainer">                          
                        </div>
                    </div>

                    <div id="showAssignedContacts"></div>

                    <h4>Subtask</h4>
                    <div class="inputContainer">
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


    showSelectedContacts();
    setupSearchListener();
    generateEditSubtasks(todo);
    generateAssignedToEditPopup(todo);
}

async function closeEditPopup(id) {
    await loadAllTasksFromRemote();
    openPopup(id)
    document.getElementById('editpopup').style.display = 'none';
    document.getElementById('popup').style.display = 'flex';
    document.getElementById("editpopup").innerHTML = '';
}

function generateEditSubtasks(todo) {
    const subtasksContainer = document.getElementById('savedSubtasks');
    subtasksContainer.innerHTML = '';

    // Erstelle eine gemeinsame div für das Input-Feld und die Buttons
    const addSubtaskContainer = document.createElement('div');
    addSubtaskContainer.classList.add('addSubtaskContainer'); // Fügen Sie eine CSS-Klasse für das Styling hinzu

    // Füge ein Eingabefeld zum Hinzufügen neuer Subtasks über den aktuellen Subtasks hinzu
    const addSubtaskInput = document.createElement('input');
    addSubtaskInput.type = 'text';
    addSubtaskInput.placeholder = 'Add a new subtask';
    addSubtaskInput.id = 'newSubtaskInput'; // Setze eine ID für das Eingabefeld

    // Erstelle ein Bild mit einem Plus-Symbol und füge es zur gemeinsamen div hinzu
    const addSubtaskImage = document.createElement('img');
    addSubtaskImage.src = '../assets/img/add.svg'; // Pfad zum Plus-Symbol
    addSubtaskImage.classList.add('plus-image'); // Füge eine CSS-Klasse hinzu, um das Bild zu stylen

    // Erstelle einen Button-Container für die Buttons
    const buttonsContainer = document.createElement('div');
    buttonsContainer.classList.add('addSubtaskButtonsContainer');

    // Erstelle einen Button mit einem Kreuz-Symbol und füge ihn zum Button-Container hinzu
    const cancelSubtaskButton = document.createElement('button');
    const cancelSubtaskImage = document.createElement('img');
    cancelSubtaskImage.src = '../assets/img/cancel.svg'; // Pfad zum Kreuz-Symbol
    cancelSubtaskButton.classList.add('addSubtaskButtons');
    cancelSubtaskButton.appendChild(cancelSubtaskImage);
    cancelSubtaskButton.style.display = 'none'; // Verstecke den Button standardmäßig

    // Erstelle einen Button mit einem Haken-Symbol und füge ihn zum Button-Container hinzu
    const acceptSubtaskButton = document.createElement('button');
    const acceptSubtaskImage = document.createElement('img');
    const vectorImage = document.createElement('img');
    vectorImage.src = '../assets/img/small_vector.svg';
    vectorImage.style.display = 'none';
    acceptSubtaskImage.src = '../assets/img/check-black.svg'; // Pfad zum Haken-Symbol
    acceptSubtaskButton.appendChild(acceptSubtaskImage);
    acceptSubtaskButton.classList.add('addSubtaskButtons');
    acceptSubtaskButton.style.display = 'none'; // Verstecke den Button standardmäßig


    // Füge die Buttons zum Button-Container hinzu
    buttonsContainer.appendChild(cancelSubtaskButton);
    buttonsContainer.appendChild(vectorImage);
    buttonsContainer.appendChild(acceptSubtaskButton);

    // Füge das Eingabefeld und das Bild zur gemeinsamen div hinzu
    addSubtaskContainer.appendChild(addSubtaskInput);
    addSubtaskContainer.appendChild(addSubtaskImage);
    addSubtaskContainer.appendChild(buttonsContainer);

    // Füge die gemeinsame div dem Subtask-Container hinzu
    subtasksContainer.appendChild(addSubtaskContainer);

    // Überwache das Klickereignis für das Eingabefeld, um das Bild und die Buttons anzuzeigen
    addSubtaskInput.addEventListener('click', () => {
        addSubtaskImage.style.display = 'none'; // Verstecke das Plus-Symbol
        cancelSubtaskButton.style.display = 'block'; // Zeige den Abbrechen-Button an
        acceptSubtaskButton.style.display = 'block'; // Zeige den Akzeptieren-Button an
        vectorImage.style = 'block';
    });

    // Überwache das Klickereignis für das Plus-Symbol, um es zu verbergen und die Buttons anzuzeigen
    addSubtaskImage.addEventListener('click', () => {
        addSubtaskImage.style.display = 'none'; // Verstecke das Plus-Symbol
        cancelSubtaskButton.style.display = 'block'; // Zeige den Abbrechen-Button an
        acceptSubtaskButton.style.display = 'block'; // Zeige den Akzeptieren-Button an
        vectorImage.style.display = 'block';
        addSubtaskInput.focus(); // Fokussiere automatisch das Eingabefeld
    });

    // Klickereignis für den Abbrechen-Button
    cancelSubtaskButton.addEventListener('click', () => {
        addSubtaskInput.value = ''; // Setze das Eingabefeld zurück
        addSubtaskImage.style.display = 'block'; // Zeige das Plus-Symbol wieder an
        cancelSubtaskButton.style.display = 'none'; // Verstecke den Abbrechen-Button
        acceptSubtaskButton.style.display = 'none'; // Verstecke den Akzeptieren-Button
        vectorImage.style.display = 'none';
    });

    // Klickereignis für den Akzeptieren-Button
    acceptSubtaskButton.addEventListener('click', () => {
        const newSubtaskTitle = addSubtaskInput.value;
        if (newSubtaskTitle.trim() !== '') {
            // Hinzufügen des neuen Subtasks und Zurücksetzen des Eingabefelds
            todo.subtask.push({ subtasktitle: newSubtaskTitle });
            saveAllTasksToRemote();
            addSubtaskInput.value = ''; // Setze das Eingabefeld zurück
            addSubtaskImage.style.display = 'block'; // Zeige das Plus-Symbol wieder an
            cancelSubtaskButton.style.display = 'none'; // Verstecke den Abbrechen-Button
            acceptSubtaskButton.style.display = 'none'; // Verstecke den Akzeptieren-Button
            vectorImage.style.display = 'none';
            generateEditSubtasks(todo); // Aktualisiere die Ansicht der Subtasks
        }
    });

    if (todo.subtask && todo.subtask.length > 0) {
        todo.subtask.forEach((subtask, index) => {
            const subtaskDiv = document.createElement('div');
            subtaskDiv.classList.add('editSubtask');

            // Füge das Bild (Punkt oder anderes Symbol) links neben dem Input-Element hinzu
            const bulletImage = document.createElement('img');
            bulletImage.classList.add('dot');
            bulletImage.src = '../assets/img/dot.svg'; // Passen Sie den Pfad zum gewünschten Bild an
            subtaskDiv.appendChild(bulletImage);

            const subtaskInput = document.createElement('input');
            subtaskInput.type = 'text';
            subtaskInput.value = subtask.subtasktitle;
            subtaskInput.classList.add('inputSubtaskContainer');
            subtaskInput.disabled = true; // Eingabefeld ist standardmäßig deaktiviert
            subtaskInput.id = `inputSubtask-${index}`; // Setze eine eindeutige ID für jedes Eingabefeld

            const editSubtaskButton = document.createElement('button');
            const editSubtaskImage = document.createElement('img');

            // Prüfe, ob das Eingabefeld aktiviert ist, und ändere das Symbol entsprechend
            if (subtaskInput.disabled) {
                editSubtaskImage.src = '../assets/img/edit.svg'; // Stiftsymbol, wenn das Eingabefeld deaktiviert ist
            } else {
                editSubtaskImage.src = '../assets/img/check-black.svg'; // Häkchensymbol, wenn das Eingabefeld aktiviert ist
            }

            editSubtaskButton.appendChild(editSubtaskImage);
            editSubtaskButton.addEventListener('click', () => {
                if (editSubtaskImage.src.includes('edit.svg')) {
                    // Ändere das Symbol zu einem Löschsymbol
                    editSubtaskImage.src = '../assets/img/delete.svg';

                    // Entferne das Bild (Punkt) links neben dem Input-Element
                    subtaskDiv.removeChild(bulletImage);

                    // Ersetze das "Delete"-Button-Element durch ein "Haken"-Button-Element
                    subtaskDiv.removeChild(deleteSubtaskButton);
                    const acceptSubtaskButton = document.createElement('button');
                    const acceptSubtaskImage = document.createElement('img');
                    acceptSubtaskImage.src = '../assets/img/check-black.svg';
                    acceptSubtaskButton.appendChild(acceptSubtaskImage);

                    acceptSubtaskButton.addEventListener('click', () => {
                        // Aktualisiere den Subtask-Titel mit dem Wert aus dem Eingabefeld
                        subtask.subtasktitle = subtaskInput.value;

                        // Deaktiviere das Eingabefeld
                        subtaskInput.disabled = true;

                        // Ändere das Symbol zurück zu einem Stiftsymbol
                        editSubtaskImage.src = '../assets/img/edit.svg';

                        // Füge das Bild (Punkt) links neben dem Input-Element hinzu
                        subtaskDiv.insertBefore(bulletImage, subtaskInput);

                        // Ersetze das "Haken"-Button-Element durch das "Delete"-Button-Element
                        subtaskDiv.removeChild(acceptSubtaskButton);
                        subtaskDiv.appendChild(deleteSubtaskButton);
                    });

                    subtaskDiv.appendChild(acceptSubtaskButton);

                    // Aktiviere das Eingabefeld, damit es bearbeitet werden kann
                    subtaskInput.disabled = false;
                    subtaskInput.focus(); // Setze den Fokus auf das Eingabefeld
                } else if (editSubtaskImage.src.includes('delete.svg')) {
                    // Löschen des Subtasks (wie zuvor)
                    todo.subtask.splice(index, 1);
                    saveAllTasksToRemote();
                    generateEditSubtasks(todo);
                }
            });

            const additionalImage = document.createElement('img');
            additionalImage.src = '../assets/img/vector.svg'; // Pfad zum zusätzlichen Bild
            additionalImage.classList.add('additional-image'); // Füge eine CSS-Klasse hinzu, um das zusätzliche Bild zu stylen

            let deleteSubtaskButton; // Deklarieren Sie die deleteSubtaskButton-Variable im äußeren Gültigkeitsbereich

            const deleteSubtaskImage = document.createElement('img');
            deleteSubtaskImage.src = '../assets/img/delete.svg';

            deleteSubtaskButton = document.createElement('button');
            deleteSubtaskButton.appendChild(deleteSubtaskImage);
            deleteSubtaskButton.addEventListener('click', () => {
                todo.subtask.splice(index, 1);
                saveAllTasksToRemote();
                generateEditSubtasks(todo);
            });

            subtaskDiv.appendChild(subtaskInput);
            subtaskDiv.appendChild(editSubtaskButton);
            subtaskDiv.appendChild(additionalImage); // Füge das zusätzliche Bild zwischen Edit und Delete Buttons hinzu

            // Überprüfen Sie, ob deleteSubtaskButton bereits ein Kind von subtaskDiv ist, bevor Sie es hinzufügen
            if (!subtask.editMode) {
                subtaskDiv.appendChild(deleteSubtaskButton);
            }

            subtasksContainer.appendChild(subtaskDiv);
        });
    }
}

function generateAssignedToEditPopup(todo) {

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
async function saveAllChanges(id) {
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

        const dueDate = document.getElementById('dueDate').value;
        todo.dueDate = dueDate;

        const categorySelect = document.getElementById('category');
        const selectedCategory = categorySelect.value;
        todo.category = selectedCategory;

        saveAllTasksToRemote();
        await loadAllTasksFromRemote();
        closeEditPopup(id);
        openPopup();
        updateHTML();
    }

}

function initializeDatepicker() {
    var currentDate = new Date();
    $("#dueDate").datepicker({
        minDate: currentDate,
        dateFormat: 'dd/mm/yy'
    });

    $("#dueDate").on("input", function () {
        var selectedDate = $("#dueDate").datepicker("getDate");
        var warningDueDate = $("#warningDueDate");

        if (selectedDate < currentDate) {
            warningDueDate.text("Das Datum sollte mindestens heute sein");
            warningDueDate.removeClass("invisible");
        } else {
            warningDueDate.addClass("invisible");
        }
    });
}

function addTaskLoadContactsBoard() {
    contactpoolBoard = [];
    for (let i = 0; i < contacts.length; i++) {
        let tempInitialien = getInitials(contacts[i].nameOfContact);
        let tempContactPool = {
            'id': i, // Die ID sollte eindeutig sein und mit der ID des zugehörigen HTML-Elements übereinstimmen
            'name': contacts[i].nameOfContact,
            'color': getColorByIndex(i),
            'initialien': tempInitialien
        }
        contactpoolBoard.push(tempContactPool);
    }
    contactpoolBoard.sort(SortArray);
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



function toggleContactsBoard() {
    const assignedToContainer = document.getElementById('assignedToContainer');
    const isHidden = assignedToContainer.classList.contains('d-none');

    // Wenn der Container ausgeblendet ist, aktualisieren Sie die angezeigten Kontakte
    if (isHidden) {
        filterContactsBoard(); // Aktualisieren Sie die angezeigten Kontakte basierend auf dem aktuellen Filter
        updateIconsBoard(contactpoolBoard); // Stellen Sie sicher, dass dies alle Kontakte berücksichtigt, nicht nur gefilterte
        showSelectedContacts(); // Aktualisieren Sie die ausgewählten Kontakte
    }

    // Hier wird die Klasse umgeschaltet, um die Liste zu zeigen oder zu verstecken.
    assignedToContainer.classList.toggle('d-none');
}

function setupSearchListener() {
    const searchField = document.getElementById('assignedTo'); // Stellen Sie sicher, dass dies die ID Ihres Suchfeldes ist
    if (searchField) {
        searchField.addEventListener('input', filterContactsBoard);
    } else {
        console.log('Suchfeld nicht gefunden');
    }
}

function getInitials(name) {
    let words = name.split(' ');
    let initials = "";

    if (words.length >= 2) {
        initials = words[0][0] + words[1][0];
    } else if (words.length === 1) {
        initials = words[0][0];
    }

    return initials.toUpperCase();
}

function getColorByIndex(index) {
    return colors[index % colors.length];
}

function filterContactsBoard() {
    const assignedToInputBoard = document.getElementById('assignedTo');
    const inputText = assignedToInputBoard.value.toLowerCase(); // Eingegebener Text in Kleinbuchstaben

    const filteredContacts = contactpoolBoard.filter(contact => contact.name.toLowerCase().includes(inputText));

    const contactsContainer = document.getElementById('assignedToContainer');
    contactsContainer.innerHTML = `
        <section id="assignedToContact">
            ${contactlistHtmlBoard(filteredContacts)}
        </section>
    `;
    // getIcon();
    updateIconsBoard(filteredContacts);
}


function updateIconsBoard(contacts) {
    contacts.forEach(contact => {
        let icon = document.getElementById(`checked${contact.id}`);
        if (icon) { // Stellen Sie sicher, dass das Element existiert
            // Überprüfen, ob der Kontakt in allContactsBoard vorhanden ist
            const isContactChosen = allContactsBoard.some(ac => ac.contactid === contact.id);

            if (isContactChosen) {
                icon.innerHTML = `<img src="../assets/img/checked.svg" alt="Assigned">`; // Pfad zum "Haken" Bild
                icon.parentNode.classList.add('Contactchecked');
            } else {
                icon.innerHTML = `<img src="../assets/img/checkbox.png" alt="Not assigned">`; // Pfad zum "Checkbox" Bild
                icon.parentNode.classList.remove('Contactchecked');
            }
        }
    });
}



function contactlistHtmlBoard(contacts) {
    let contacthtml = '';
    for (let i = 0; i < contacts.length; i++) {
        contacthtml += ` 
        <div class="contactLine" onclick="toggleContactBoard(${contacts[i].id})">
                <div class="contact">
                    <div class="contacticon" style="background-color:  ${contacts[i].color};"> 
                        ${contacts[i].initialien}
                    </div>
                    <div class="contactName"> 
                        ${contacts[i].name} 
                    </div>
                </div>
                <div class="contactImage" id="checked${contacts[i].id}">
                    <img src="../assets/img/checkbox.png">
                </div>
            </div>
        `;
    }

    return contacthtml;
}

function toggleContactBoard(contactId) {
    const contactIsChosen = allContactsBoard.some(contact => contact.contactid === contactId);
    if (contactIsChosen) {
        unchoseContactBoard(contactId);
    } else {
        choseContactBoard(contactId);
    }
}


async function choseContactBoard(contactId) {
    // Finde den Kontakt im Pool
    const contact = contactpoolBoard.find(contact => contact.id === contactId);

    // Überprüfen, ob der Kontakt bereits in allContactsBoard existiert
    const isContactAlreadyChosen = allContactsBoard.some(c => c.contactid === contactId);

    // Wenn der Kontakt gefunden wurde und nicht bereits in allContactsBoard existiert
    if (contact && !isContactAlreadyChosen) {
        // Erstelle eine Kopie des Kontakts für allContactsBoard
        const tempContact = {
            'contactid': contact.id,
            'name': contact.name,
            'color': contact.color,
            'initialien': contact.initialien
        };

        // Füge den Kontakt zu allContactsBoard hinzu
        allContactsBoard.push(tempContact);

        // Aktualisiere die Anzeige für diesen Kontakt
        updateContactDisplay(contactId, true);
        showTaskContactsBoard();

    } else {
        console.log("Der Kontakt wurde schon ausgewählt oder existiert nicht.");
    }

}



function unchoseContactBoard(contactId) {
    const indexToRemove = allContactsBoard.findIndex(contact => contact.contactid === contactId);
    if (indexToRemove !== -1) {
        allContactsBoard.splice(indexToRemove, 1);

        updateContactDisplay(contactId, false); // UI aktualisieren
        showTaskContactsBoard();
    }
}


function updateContactDisplay(contactId) {
    const contactCheckbox = document.getElementById(`checked${contactId}`);
    if (!contactCheckbox) return; // Stelle sicher, dass das Element existiert

    // Überprüfen, ob der Kontakt in allContactsBoard vorhanden ist
    const isContactChosen = allContactsBoard.some(contact => contact.contactid === contactId);

    const imageSrc = isContactChosen ? "../assets/img/checked.svg" : "../assets/img/checkbox.png";
    contactCheckbox.innerHTML = `<img src="${imageSrc}" alt="">`;
    contactCheckbox.parentNode.classList.toggle('Contactchecked', isContactChosen);
}





/**
 * This function finds the max id and retrun a task id for the new added task
 * 
 * @returns 
 * 
 */
/* async function getLastID() {
    let maxID = 0;
    // Finde die maximale ID in den vorhandenen Aufgaben
    for (const task of todos) {
        if (task.id > maxID) {
            maxID = task.id;
        }
    }
    if (maxID > 0) {
        id = maxID + 1;
    } else {
        id = 1;
    }
} */


function showTaskContactsBoard() {
    let contactsIcons = document.getElementById('showAssignedContacts');
    contactsIcons.innerHTML = '';
    for (let i = 0; i < allContactsBoard.length; i++) {
        contactsIcons.innerHTML += `
                <div class="contacticon" style="background-color:  ${allContactsBoard[i]['color']};"> 
                    ${allContactsBoard[i]['initialien']}
                </div>
        `;
    }
}

function showSelectedContacts() {
    let selectedContactsContainer = document.getElementById('showAssignedContacts');
    selectedContactsContainer.innerHTML = '';

    for (let i = 0; i < allContactsBoard.length; i++) {
        selectedContactsContainer.innerHTML += `
            <div class="contacticon" style="background-color: ${allContactsBoard[i].color};"> 
                ${allContactsBoard[i].initialien}
            </div>
        `;
    }
}