/**
 * @author Patrick
 * Join Gruppenarbeit 727
 * October 2023
 * 
 */

/**
 * Generates the HTML structure for the main board.
 * This includes the main popup for viewing todo items and the board header with search and add task features.
 * @returns {string} The HTML string representing the board's layout.
 */
function boardHTML() {
    return `
    <div id="editpopup" class="popup"></div>
    <div id="popup" class="popup">
        <div id="notification-popup" class="notification-popup">All Saved</div>
        <div class="container-popup">
            <div class="popup-content">
                <div class="d-flex">
                    <img src="../assets/img/cancel.svg" class="close-btn" onclick="closePopup()" alt="Close">
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
                    <img class="searchImg" src="../assets/img/search.svg" alt="Search">
                </div>
            </div>
            <button class="buttonAddTask" onclick="overlayAddTask('todo')">
                <span>Add Task</span>
                <span>+</span>
            </button>
        </div>
        
        <div class="searchMobile">
            <input type="text" id="inputSearchMobile" class="inputSearch mobile" placeholder="Find task">
            <div class="buttonSearch">
                <img class="searchImg" src="../assets/img/search.svg" alt="Search">
            </div>
        </div>
    </section>
    <section class="boardContent" id="boardContent">
    </section>
`
}


/**
 * Generates the HTML structure for the edit mode of a todo item.
 * This includes fields for editing the title, description, due date, priority, category, assigned contacts, and subtasks of the todo item.
 * @param {Object} todo - The todo item to be edited.
 * @returns {string} The HTML string for the edit mode layout of the specified todo item.
 */
function editBoardHTML(todo) {
    return `
        <div class="container-popup">
            <div class="popup-content">
                <img src="../assets/img/cancel.svg" class="close-btn" onclick="closeEditPopup(${todo.id})" alt="Close">
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
                            <button class="" id="urgent" type="button" onclick="selectPriority('urgent', ${todo.id})">Urgent<img src="../assets/img/urgent.svg" alt=""></button>
                            <button class="" id="medium" type="button" onclick="selectPriority('medium', ${todo.id})">Medium<img src="../assets/img/medium.svg" alt=""></button>
                            <button class="" id="low" type="button" onclick="selectPriority('low', ${todo.id})">Low<img src="../assets/img/low.svg" alt=""></button>
                        </div>
                    </div>
                    <h4>Category</h4>
                    <div class="inputContainer">
                    <select class="" onfocus="updateCategorySelectBoard('${todo.category}')" id="category-board" onchange="handleCategoryChangeBoard()">
                    </select>
                        <div id="inputCategory" class="inputField subtaskContainer d-none">
                            <input type="text" id="newCategory" placeholder="Type..." value="">
                            <img src="../assets/img/close.svg" onclick="clearInput()">
                            <div class='vectorStyle'>|</div>
                            <img src="../assets/img/check-black.svg" onclick="addCategory()">
                        </div>
                    </div>
                    <h4>Assigned to</h4>
                    <div class="inputContainer">
                        <input class="custom-select" onclick="toggleContactsBoard(),filterContactsBoard()"
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
    `
}

/**
 * Renders a progress container for the board with an "Add Task" button.
 *
 * This function generates HTML code for a progress container that includes an "Add Task" button.
 *
 * @param {number} i - The index of the progress container.
 * @param {string} name - The name of the progress container.
 * @returns {string} HTML code for the progress container.
 */
function renderBoardWithAdd(i, name) {
    return `
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
        </div>`;
}

/**
 * Renders a progress container for the board without an "Add Task" button.
 *
 * This function generates HTML code for a progress container without an "Add Task" button.
 *
 * @param {number} i - The index of the progress container.
 * @param {string} name - The name of the progress container.
 * @returns {string} HTML code for the progress container.
 */
function renderBoardWhitoutAdd(i, name) {
    return `
        <div class="progressContainer">
            <div class="progressContainerStatusHead">
                <div class="progressStatus">
                    ${name}
                </div>
            </div>
            <div class="statusContainer" id="statusContainer${i}" ondrop="moveTo('${progress}')" ondragover="allowDrop(event)"></div>
        </div>`;
}

/**
 * Generates HTML code for a progress container with a progress bar.
 *
 * This function creates HTML code for a progress container with a progress bar and displays completed and total subtasks.
 *
 * @param {number} progress - The progress percentage.
 * @param {number} completedSubtasks - The number of completed subtasks.
 * @param {number} totalSubtasks - The total number of subtasks.
 * @returns {string} HTML code for the progress container.
 */
function progressContainer(progress, completedSubtasks, totalSubtasks) {
    return `
        <div class="progress">
            <div class="progress-container">
                <div class="progress-bar" style="width: ${progress}%"></div>
            </div>
            <span class="subtask-container">${completedSubtasks}/${totalSubtasks} Subtasks</span>
        </div>`;
}

/**
 * Generates HTML code for displaying contact information.
 *
 * This function creates HTML code for displaying contact information including a contact icon, name, and checkbox image.
 *
 * @param {Object} contacts - The contact data to display.
 * @returns {string} HTML code for displaying contact information.
 */
function contactHtml(contacts) {
    return ` 
        <div class="contactLine" onclick="toggleContactBoard('${contacts.name}')">
            <div class="contact">
                <div class="contacticon" style="background-color:  ${contacts.color};"> 
                    ${contacts.initialien}
                </div>
                <div class="contactName"> 
                    ${contacts.name} 
                </div>
            </div>
            <div class="contactImage" id="checked${contacts.id}">
                <img src="../assets/img/checkbox.png">
            </div>
        </div>
    `;
}
