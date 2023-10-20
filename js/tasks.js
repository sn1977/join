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

let todos = [
    {
        'id': 0,
        'title': 'Putzen',
        'description': 'Putzen',
        'category': 'todo',
        'type': 'Technical Task',
        'lastMoved': new Date().getTime()
    },
    {
        'id': 1,
        'title': 'Kochen',
        'description': 'Kochen',
        'category': 'inprogress',
        'type': 'User Story',
        'lastMoved': new Date().getTime()
    },
    {
        'id': 2,
        'title': 'Einkaufen',
        'description': 'Einkaufen',
        'category': 'awaitfeedback',
        'type': 'User Story',
        'lastMoved': new Date().getTime()
    },
    {
        'id': 3,
        'title': 'Arbeiten',
        'description': 'Arbeiten',
        'category': 'done',
        'type': 'Technical Task',
        'lastMoved': new Date().getTime()
    }
];




todos = loadTasksFromLocalStorage();




todos = todos.map(task => transformTaskData(task));

/**
 * Initialization of all functions required for startup
 */
function init() {
    renderBoard();
    updateHTML();
}

/**
 * function to load the tasks
 * 
 * @returns {array} - This is the array from localstorage 
 */
function loadTasksFromLocalStorage() {
    let allTasksAsString = localStorage.getItem('allTasks');
    let loadedTasks = JSON.parse(allTasksAsString);
    return loadedTasks || [];
}

/**
 * This function transform the Array from localstorage to use
 * 
 * @param {string} task - this is the template from todo
 * @returns {array} - return the final Array to use
 */
function transformTaskData(task) {
    return {
        id: task.id,
        title: task.title,
        description: task.description,
        category: task.category.toLowerCase().replace(' ', ''),
        type: task.type,
        lastMoved: task.modifiedAt
    };
}

/**
 * This Function save tasks to the localstorage 
 */
function saveTasksToLocalStorage() {
    let allTasksAsString = JSON.stringify(todos);
    localStorage.setItem('allTasks', allTasksAsString);
}

/**
 * This function renders the board
 */
function renderBoard() {
    document.getElementById('content').innerHTML = '';
    document.getElementById('content').innerHTML += /*html*/ `<div class="board" id="board"></div>`;
    document.getElementById('board').innerHTML += /*html*/ `
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
        const category = name.toLowerCase().replace(' ', '');
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
            <div class="statusContainer" id="statusContainer${i}" ondrop="moveTo('${category}')" ondragover="allowDrop(event)"></div>
        </div>`
        } else {
            document.getElementById('boardContent').innerHTML += /*html*/ `
            <div class="progressContainer">
                <div class="progressContainerStatusHead">
                    <div class="progressStatus">
                        ${name}
                    </div>
                </div>
            <div class="statusContainer" id="statusContainer${i}" ondrop="moveTo('${category}')" ondragover="allowDrop(event)"></div>
        </div>`
        }
    }
}



/**
 * This function filter and sort the todos and renders the tasks on the board
 */
function updateHTML() {
    let todo = sortTodos(todos.filter(t => t['category'] == 'todo'));
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


    let inprogress = sortTodos(todos.filter(t => t['category'] == 'inprogress'));
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

    let awaitfeedback = sortTodos(todos.filter(t => t['category'] == 'awaitfeedback'));
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

    let done = sortTodos(todos.filter(t => t['category'] == 'done'));
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
    return /*html*/ `
        <div draggable="true" class="todo" 
             ondragstart="startDragging(${element['id']})"
             ondragend="stopDragging(${element['id']})">
            <div class="todoContainer">
                <div class="todoType">${element['type']}</div>
                <div class="todoInfo">
                    <span class="todoTitle">${element['title']}</span>
                    <span class="todoDescription">${element['description']}</span>
                </div>
                <div>Users</div>
            </div>
        </div>
    `
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
 * This function is used to move the task to the selected category
 * 
 * @param {string} category 
 */
function moveTo(category) {
    const todoItem = todos.find(todo => todo.id === currentDraggedElement);

    if (todoItem) {
        todoItem['category'] = category;
        todoItem['lastMoved'] = new Date().getTime();
        updateHTML();
        saveTasksToLocalStorage();
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
    return todosArray.sort((a, b) => a.lastMoved - b.lastMoved);
}