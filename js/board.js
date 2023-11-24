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
let categoryColors = ['#20D7C2', '#0000ff', '#FF7A00', '#9327FF', '#6E52FF', '#FC71FF', '#FFBB2B', '#1FD7C1', '#462F8A', '#0038FF']


/**
 * Initializes the application, loads tasks and contacts from remote storage, and prepares the board.
 */
async function initboard() {
    await loadAllTasksFromRemote();
    await loadContacts();
    await loadCategories();
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
 * funtion to load all categories from remote server
 * 
 *@param {array} categories -all tasks
 * 
 */
async function loadCategories() {
    categoryArray = JSON.parse(await getItem('categories')) || categoryArray;
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
 * Renders the board interface.
 *
 * This function is responsible for rendering the board interface by performing the following tasks:
 * 1. Initializes the board.
 * 2. Adds content to the board.
 * 3. Sets up event listeners for search functionality.
 */
function renderBoard() {
    initializeBoard();
    addBoardContent();
    setupSearchListeners();
}


/**
 * Initializes the board by setting up the initial structure.
 *
 * This function initializes the board by performing the following tasks:
 * 1. Clears the content of the 'content' element.
 * 2. Adds a 'board' container element to the 'content' element.
 * 3. Appends the HTML structure for the board content.
 */
function initializeBoard() {
    document.getElementById('content').innerHTML = '';
    document.getElementById('content').innerHTML += /*html*/ `<div class="board" id="board"></div>`;
    document.getElementById('board').innerHTML += boardHTML();
}


/**
 * Adds content to the board based on the predefined board names.
 *
 * This function iterates through the predefined board names and adds progress containers to the board
 * based on the names and their corresponding progress status. It uses the `addProgressContainer` function
 * to create and append progress containers to the board.
 */
function addBoardContent() {
    for (let i = 0; i < boardNames.length; i++) {
        const name = boardNames[i];
        const progress = name.toLowerCase().replace(' ', '');
        addProgressContainer(i, name, progress);
    }
}


/**
 * Adds a progress container to the board.
 *
 * This function generates HTML for a progress container based on the provided parameters and appends it
 * to the 'boardContent' element.
 *
 * @param {number} index - The index of the progress container.
 * @param {string} name - The name of the progress container.
 * @param {string} progress - The progress status associated with the container.
 */
function addProgressContainer(index, name, progress) {
    const containerHTML = index < 3 ?
        getContainerWithAddButton(name, progress, index) :
        getContainerWithoutAddButton(name, progress, index);

    document.getElementById('boardContent').innerHTML += containerHTML;
}


/**
 * Generates HTML for a progress container with an "Add Task" button.
 *
 * This function creates HTML code for a progress container that includes a button for adding tasks.
 *
 * @param {string} name - The name of the progress container.
 * @param {string} progress - The progress status associated with the container.
 * @param {number} index - The index of the progress container.
 * @returns {string} HTML code for the progress container.
 */
function getContainerWithAddButton(name, progress, index) {
    return /*html*/ `
    <div class="progressContainer">
        <div class="progressContainerStatusHead">
            <div class="progressStatus">${name}</div>
            <div>
                <img src="../assets/img/addbutton.svg" alt="Add Task" class="add-button" onclick="overlayAddTask('${progress}')">
            </div>
        </div>
        <div class="statusContainer" id="statusContainer${index}" ondrop="moveTo('${progress}')" ondragover="allowDrop(event)"></div>
    </div>`;
}


/**
 * Generates HTML for a progress container without an "Add Task" button.
 *
 * This function creates HTML code for a progress container without an "Add Task" button.
 *
 * @param {string} name - The name of the progress container.
 * @param {string} progress - The progress status associated with the container.
 * @param {number} index - The index of the progress container.
 * @returns {string} HTML code for the progress container.
 */
function getContainerWithoutAddButton(name, progress, index) {
    return /*html*/ `
    <div class="progressContainer">
        <div class="progressContainerStatusHead">
            <div class="progressStatus">${name}</div>
        </div>
        <div class="statusContainer" id="statusContainer${index}" ondrop="moveTo('${progress}')" ondragover="allowDrop(event)"></div>
    </div>`;
}



/**
 * Sets up event listeners for search functionality.
 *
 * This function adds event listeners to search input elements for handling keyup events
 * and triggering searchTasks and searchTasksMobile functions.
 */
function setupSearchListeners() {
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
 * Updates the HTML content of the board with tasks grouped by progress.
 *
 * This function updates the content of the board by calling 'updateStatusContainer' for each progress status.
 *
 * @param {Array} tasks - An array of tasks to display on the board. Defaults to 'todos' if not provided.
 */
function updateHTML(tasks = todos) {
    updateStatusContainer(tasks, 'todo', 'statusContainer0');
    updateStatusContainer(tasks, 'inprogress', 'statusContainer1');
    updateStatusContainer(tasks, 'awaitfeedback', 'statusContainer2');
    updateStatusContainer(tasks, 'done', 'statusContainer3');
}

/**
 * Updates a specific progress container with filtered tasks.
 *
 * This function filters tasks by their progress status, sorts them, and updates the HTML content of the specified container.
 *
 * @param {Array} tasks - An array of tasks.
 * @param {string} progress - The progress status to filter tasks by.
 * @param {string} containerId - The ID of the container to update with the filtered tasks.
 */
function updateStatusContainer(tasks, progress, containerId) {
    const filteredTasks = sortTodos(tasks.filter(t => t['progress'] === progress));
    const container = document.getElementById(containerId);
    container.innerHTML = getContainerHTML(filteredTasks, progress);
}

/**
 * Generates HTML code for a progress container based on tasks or a "No Tasks" message.
 *
 * This function creates HTML code for a progress container based on the provided tasks. If no tasks are available, it displays a "No Tasks" message.
 *
 * @param {Array} tasks - An array of tasks to display in the container.
 * @param {string} progress - The progress status associated with the container.
 * @returns {string} HTML code for the progress container.
 */
function getContainerHTML(tasks, progress) {
    if (tasks.length === 0) {
        return `<div class="noTaskDiv">No Tasks ${formatProgressDisplayName(progress)}</div>`;
    } else {
        return tasks.map(task => generateHTML(task)).join('');
    }
}

/**
 * Formats the display name for a progress status.
 *
 * This function takes a progress status and returns its formatted display name.
 *
 * @param {string} progress - The progress status.
 * @returns {string} Formatted display name for the progress status.
 */
function formatProgressDisplayName(progress) {
    switch (progress) {
        case 'todo': return 'To do';
        case 'inprogress': return 'In Progress';
        case 'awaitfeedback': return 'Awaiting Feedback';
        case 'done': return 'Done';
        default: return '';
    }
}

/**
 * Sets up the dragging of a task element.
 *
 * This function sets the currently dragged element when a task is being dragged and adds a CSS class for styling.
 *
 * @param {string} id - The ID of the task element being dragged.
 */
function startDragging(id) {
    currentDraggedElement = id;
    window.currentlyDraggedElement = document.querySelector(`[ondragstart="startDragging(${id})"]`);
    if (window.currentlyDraggedElement) {
        window.currentlyDraggedElement.classList.add("rotated");
    }
}

/**
 * Stops the dragging of a task element and resets the reference.
 */
function stopDragging() {
    if (window.currentlyDraggedElement) {
        window.currentlyDraggedElement.classList.remove("rotated");
        window.currentlyDraggedElement = null; // Reset the reference
    }
}

/**
 * Generates HTML for a task element based on the provided task data.
 *
 * This function creates HTML code for a task element based on the provided task data, including category color, progress, assigned users, and arrow buttons.
 *
 * @param {Object} element - The task data to display.
 * @returns {string} HTML code for the task element.
 */
function generateHTML(element) {
    const categoryColor = getCategoryColor(element);
    const progressHTML = generateProgressHTML(element);
    const assignedUsersHTML = generateAssignedUsersHTML(element);
    const arrowButtonsHTML = generateArrowButtonsHTML(element);
    return createTodoHTML(element, categoryColor, progressHTML, assignedUsersHTML, arrowButtonsHTML);
}

/**
 * Creates HTML code for a task element.
 *
 * This function generates HTML code for a task element based on the provided data, including category color, progress, assigned users, and arrow buttons.
 *
 * @param {Object} element - The task data to display.
 * @param {string} categoryColor - The color associated with the task's category.
 * @param {string} progressHTML - HTML code for the task's progress display.
 * @param {string} assignedUsersHTML - HTML code for the task's assigned users display.
 * @param {string} arrowButtonsHTML - HTML code for the task's arrow buttons.
 * @returns {string} HTML code for the task element.
 */
function createTodoHTML(element, categoryColor, progressHTML, assignedUsersHTML, arrowButtonsHTML) {
    return /*html*/ `
    <div class="todo" draggable="true" ondragstart="startDragging(${element['id']})" ondragend="stopDragging(${element['id']})" onclick="openPopup(${element['id']})">
        <div class="todoContainer">
            <div class="todoType" style="background-color:${categoryColor};">${element['category']}</div>
            <div class="todoInfo">
                <span class="todoTitle">${element['title']}</span>
                <span class="todoDescription">${element['description']}</span>
            </div>
            ${progressHTML}
            <div class="todo-bottom">
                <div class="assignedToUsers">${assignedUsersHTML}</div>
                <img src="../assets/img/${element.prio}.svg">  
            </div>
            <div class="todo-arrows">${arrowButtonsHTML}</div>
        </div>
    </div>`;
}

/**
 * Gets the color associated with a task's category.
 *
 * This function determines the color associated with a task's category based on its index in the categoryArray.
 *
 * @param {Object} element - The task data.
 * @returns {string} The color associated with the category.
 */
function getCategoryColor(element) {
    const categoryIndex = categoryArray.indexOf(element['category']);
    return getColorByIndexBoard(categoryIndex);
}

/**
 * Generates HTML code for the progress display of a task.
 *
 * This function calculates the progress of a task based on its subtasks and generates HTML code for the progress display.
 *
 * @param {Object} element - The task data.
 * @returns {string} HTML code for the progress display.
 */
function generateProgressHTML(element) {
    const totalSubtasks = element.subtask ? element.subtask.length : 0;
    const completedSubtasks = element.subtask ? element.subtask.filter(task => task.done).length : 0;
    const progress = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;
    if (totalSubtasks > 0) {
        return progressContainer(progress, completedSubtasks, totalSubtasks);
    } else {
        return `<div class="progress"></div>`;
    }
}

/**
 * Generates HTML code for the assigned users display of a task.
 *
 * This function generates HTML code for displaying assigned users of a task, with a limit on the number of displayed users.
 *
 * @param {Object} element - The task data.
 * @returns {string} HTML code for the assigned users display.
 */
function generateAssignedUsersHTML(element) {
    let html = '';
    const maxDisplayUsers = 5;
    const userCount = element.assignedTo.length;
    element.assignedTo.slice(0, maxDisplayUsers).forEach(user => {
        html += `<div class="user-badge-board extra-margin" style="background-color:${user.color}">${user.initialien}</div>`;
    });
    if (userCount > maxDisplayUsers) {
        html += `<div class="user-badge-board extra-margin moreusers">+${userCount - maxDisplayUsers}</div>`;
    }
    return html;
}


/**
 * Generates HTML for arrow buttons used for task movement.
 *
 * This function generates HTML code for up and down arrow buttons based on the provided element's progress status.
 * It includes buttons for moving the task up or down in a task list.
 *
 * @param {Object} element - The task element for which arrow buttons are generated.
 * @returns {string} HTML code for the arrow buttons.
 */
function generateArrowButtonsHTML(element) {
    const isTop = element.progress === 'todo';
    const isBottom = element.progress === 'done';
    const upArrowDisabled = isTop ? 'disabled' : '';
    const downArrowDisabled = isBottom ? 'disabled' : '';
    return `
        <button class="arrow-buttons" ${upArrowDisabled} onclick="event.stopPropagation(); moveTask(${element['id']}, 'up')">↑</button>
        <button class="arrow-buttons" ${downArrowDisabled} onclick="event.stopPropagation(); moveTask(${element['id']}, 'down')">↓</button>`;
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
    }
}


/**
 * Moves a task down in the task list by swapping it with the task below it.
 * @param {number} index - The current index of the task in the todos array.
 */
function moveTaskDown(index) {
    if (index < todos.length - 1) {
        [todos[index], todos[index + 1]] = [todos[index + 1], todos[index]];
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


/**
 * Gets a color based on an index.
 * @param {number} index - The index to determine the color.
 * @return {string} A hex color code.
 */
function getColorByIndexBoard(index) {
    return categoryColors[index % categoryColors.length];
}