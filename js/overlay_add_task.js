/**
 * Initializes variables and event listeners for the 'subtaskInput' and 'subtaskContainer'
 * 
 * @global
 * @type {HTMLInputElement}
 * @type {() => void}
 * 
 */
let subtaskInput;
let subtaskContainer;
let subtaskInputFocusListener = () => { };
let subtaskInputBlurListener = () => { };          


/**
 * Adds event listeners for focusing and blurring on the 'subtaskInput'
 * 
 */
function addSubtaskEventListeners() {
    subtaskInput = document.getElementById("subtask");
    subtaskContainer = document.querySelector(".subtaskContainer");
    subtaskInputFocusListener = () => {
        subtaskContainer.style.borderColor = "#29ABE2";
    };
    subtaskInputBlurListener = () => {
        subtaskContainer.style.borderColor = "#D1D1D1";
    };
    subtaskInput.addEventListener("focus", subtaskInputFocusListener);
    subtaskInput.addEventListener("blur", subtaskInputBlurListener);
}


/**
 * Removes event listeners for focusing and blurring on the 'subtaskInput'
 * 
 */
function removeSubtaskEventListeners() {
    subtaskInput.removeEventListener("focus", subtaskInputFocusListener);
    subtaskInput.removeEventListener("blur", subtaskInputBlurListener);
}


/**
 * Creates an overlay for adding a task, initializes the necessary elements, and adds event listeners
 * 
 * @param {string} progressBoard - The progress board identifier
 * 
 */
function overlayAddTask(progressBoard) {
    const overlay = document.createElement('div');
    overlay.id = 'taskContent';
    document.body.appendChild(overlay);
    addTaskOverlay(progressBoard);
    addSubtaskEventListeners();
    eventListenerFromAssignedToContainer();
}


/**
 * Event listener function to close the overlay and remove the script
 * 
 */
function closeOverlay() {
    document.getElementById('taskContent').innerHTML = '';
    const script = document.querySelector('script[src="../js/special_add_task.js"]');
    if (script) {
        script.remove();
        eventListenerFromAssignedToContainer();
        removeClickEventListener(); 
        removeSubtaskEventListeners();
    }
}


/**
 * Event listener function to handle clicks outside the 'assignedToContainer'
 * Removes the 'd-none' class from 'assignedToContainer' if it exists and
 * hides the container when the click event occurs outside of 'assignedToContainer'
 * 
 * @function
 * @name eventListenerFromAssignedToContainer
 * @param {Event} event - The click event.
 * @returns {void}
 * 
 */
function eventListenerFromAssignedToContainer() {
    document.addEventListener('click', function (event) {
        const assignedToContainer = document.getElementById('assignedToContainer');
        const assignedToInput = document.getElementById('assignedTo');  
        if (assignedToContainer) {
            assignedToContainer.classList.remove('d-none');
            if (
                event.target !== assignedToContainer &&
                event.target !== assignedToInput &&
                !assignedToContainer.contains(event.target)
            ) {
                assignedToContainer.classList.add('d-none');
            }
        }
    });
}


/**
 * Creates and populates the HTML content for the task overlay
 * 
 * 
 * @param {string} progressBoard - The progress board identifier
 * 
 */
function addTaskOverlay(progressBoard) {
    document.getElementById('taskContent').innerHTML = /*HTML*/ `
     
    <div class="taskOverlay">
        <div class="dialogAddTask">
            <h3>Add Task</h3>
            <div id="closeOverlay" onclick="closeOverlay()">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <mask id="mask0_102384_5574" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                        <rect width="24" height="24" fill="#D9D9D9"/>
                    </mask>
                    <g mask="url(#mask0_102384_5574)">
                        <path d="M12 13.4L7.1 18.3C6.91667 18.4834 6.68333 18.575 6.4 18.575C6.11667 18.575 5.88333 18.4834 5.7 18.3C5.51667 18.1167 5.425 17.8834 5.425 17.6C5.425 17.3167 5.51667 17.0834 5.7 16.9L10.6 12L5.7 7.10005C5.51667 6.91672 5.425 6.68338 5.425 6.40005C5.425 6.11672 5.51667 5.88338 5.7 5.70005C5.88333 5.51672 6.11667 5.42505 6.4 5.42505C6.68333 5.42505 6.91667 5.51672 7.1 5.70005L12 10.6L16.9 5.70005C17.0833 5.51672 17.3167 5.42505 17.6 5.42505C17.8833 5.42505 18.1167 5.51672 18.3 5.70005C18.4833 5.88338 18.575 6.11672 18.575 6.40005C18.575 6.68338 18.4833 6.91672 18.3 7.10005L13.4 12L18.3 16.9C18.4833 17.0834 18.575 17.3167 18.575 17.6C18.575 17.8834 18.4833 18.1167 18.3 18.3C18.1167 18.4834 17.8833 18.575 17.6 18.575C17.3167 18.575 17.0833 18.4834 16.9 18.3L12 13.4Z" fill="#2A3647"/>
                    </g>
                </svg> 
            </div>           
            <div class="formAddTask">
                <div class="formInput">
                    <div class="leftSide">
                        <div class="inputContainer">
                            <label class="required" for="title">Title</label>
                            <input class="inputField" required type="text" id="title" placeholder="Enter a title">
                            <div class="warning">
                                <span id="warningtitle" class="invisible">This field is requiered</span>
                            </div>
                        </div>
                        <div class="inputContainer">
                            <label for="description">Description</label>
                            <textarea class="inputField description" minlength="5" id="description" rows="8" cols="50"
                                placeholder="Enter a Description"></textarea>
                        </div>
                        <div class="inputContainer">
                            <label for="assignedTo">Assigned to</label>
                            <input oninput="filterContacts()" onclick="filterContacts()" class="custom-select" id="assignedTo" type="text" placeholder="Select contacts to assign">
                            <div class="d-none assignedToContainer" id="assignedToContainer">
                            </div>
                        </div>
                        <div id="showAssignedContacts"></div>
                    </div>
                    <div class="divider">
                    </div>
                    <div class="rightSide">
                        <div class="inputContainer">
                            <label class="required" for="dueDate">Due date</label>
                            <input class="inputField" required placeholder="dd/mm/yyyy" type="text" id="dueDate">
                            <div class="warning">
                                <span id="warningDueDate" class="invisible">This field is requiered</span>
                            </div>
                        </div>
                        <div class="inputContainer">
                        <label class="required">Prio</label>
                        <div class="button-container" id="prio">
                            <button class="${prio === 'urgent' ? 'urgent' : 'white'}" id="urgent"
                                onclick="selectTaskPrio('urgent')" type="button">Urgent<img
                                    src="../assets/img/urgent.svg" alt=""></button>
                            <button class="${prio === 'medium' ? 'medium' : 'white'}" id="medium"
                                onclick="selectTaskPrio('medium')" type="button">Medium<img
                                    src="../assets/img/medium.svg" alt=""></button>
                            <button class="${prio === 'low' ? 'low' : 'white'}" id="low" onclick="selectTaskPrio('low')"
                                type="button">Low<img src="../assets/img/low.svg" alt=""></button>
                        </div>
                        <div class="warning">
                            <span id="warningPrio" class="invisible">This field is required</span>
                        </div>
                    </div>
                        <div class="inputContainer">
                            <label class="required" for="category">Category</label>
                            <div>
                                <select class="custom-select" onfocus="updateCategorySelect()" id="category" name="category"
                                    onchange="handleCategoryChange()" required>
                                    <option value="" disabled selected hidden>Select task category</option>
                                </select>
                                <div id="inputCategory" class="inputField subtaskContainer d-none">
                                    <input type="text" id="newCategory" placeholder="Type..." value="">
                                    <img src="../assets/img/close.svg" onclick="clearInput()">
                                    <div>|</div>
                                    <img src="../assets/img/check-black.svg" onclick="addCategory()">
                                </div>
                            </div>
                            <div class="warning">
                                <span id="warningcategory" class="invisible">This field is required</span>
                            </div>
                        </div>
                        <div class="inputContainer">
                            <label for="subtask">Subtask</label>
                            <div class="inputField subtaskContainer">
                                <input type="text" id="subtask" placeholder="Add new subtask" onfocus="switchToInput()">
                                <div id="addSubtask">
                                    <img src="../assets/img/add.svg" onclick="switchToInput()">
                                </div>
                                <div id="inputsubtask" style="display: none;">
                                    <img src="../assets/img/close.svg" onclick="delInput()">
                                    <div>|</div>
                                    <img src="../assets/img/check-black.svg" onclick="addSubtask()">
                                </div>
                            </div>
                            <div id="savedSubtasks" class="savedSubtasks">
                        </div>
                    </div>
                </div>
            </div>
            <div class="footArea">
                <p><sup class="required"></sup>This field is required</p>
                <div class=btnAddTask>
                    <button class="cancelBtn" onclick="reload()">Clear <img src="../assets/img/cancel.svg"></button>
                    <button class="activeBtn" onclick="addTaskBoard('${progressBoard}')">Create Task <img src="../assets/img/check.svg" alt=""></button>
                </div>
            </div>
        </div>
    </div>
</div>
    `;
    loadExternalScript()
}


/**
 * Loads external scripts and initializes related functionalities for the task overlay
 * 
 */
function loadExternalScript() {
    initTask();
    initializeDatepicker();
    addTaskLoadContacts();
    placeholderCategory()
}


/**
 * Adds a task to the board, stores it in local storage, clears input fields, and triggers success overlay
 * 
 * @async
 * @param {string} progress - The progress board identifier
 * 
 */
async function addTaskBoard(progress) {
    getInputIDs();
    checkRequieredFields();
    if (canAdd) {
        getLastID();
        getTaskValues(progress);
        await setItem('tasks', JSON.stringify(tasks));
        emptyFields();
        generateSubtaskHtml();
        overlaySuccessAddTaskBoard();
        closeOverlay();
    } else {
    }
   await initboard();
}


/**
 * Displays an overlay indicating a successful task creation and redirects to the board page
 * 
 * @function
 * 
 */
function overlaySuccessAddTaskBoard() {
    const overlayContainer = document.createElement('div');
    overlayContainer.id = 'overlaySuccess';
    document.body.appendChild(overlayContainer);
    setTimeout(() => {
        overlayContainer.style.left = '50%'; 
    }, 50);
    setTimeout(() => {
        overlayContainer.remove(); 
        }, 3050);
    addOverlayAddTaskSuccess();
}