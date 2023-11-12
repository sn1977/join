
let subtaskInputX;
let subtaskContainer;
let subtaskInputFocusListener = () => {};
let subtaskInputBlurListener = () => {};


function addSubtaskEventListeners() {
    subtaskInputX = document.getElementById("subtask"); 
    subtaskContainer = document.querySelector(".subtaskContainer");

    subtaskInputFocusListener = () => {
        subtaskContainer.style.borderColor = "#29ABE2";
    };

    subtaskInputBlurListener = () => {
        subtaskContainer.style.borderColor = "#D1D1D1";
    };

    subtaskInputX.addEventListener("focus", subtaskInputFocusListener);
    subtaskInputX.addEventListener("blur", subtaskInputBlurListener);
}


function removeSubtaskEventListeners() {
    subtaskInputX.removeEventListener("focus", subtaskInputFocusListener);
    subtaskInputX.removeEventListener("blur", subtaskInputBlurListener);
}


function overlayAddTask(progressBoard) {
    const overlay = document.createElement('div');
    overlay.id = 'taskContent';
    document.body.appendChild(overlay);
    addTaskOverlay(progressBoard);
    addSubtaskEventListeners();
}

// Funktion zum Entfernen des Event Listeners
function removeEventListenerFromAssignedToContainer() {
    const assignedToContainer = document.getElementById('assignedToContainer');
    const assignedToInput = document.getElementById('assignedTo');

    function clickHandler(event) {
        if (
            event.target !== assignedToContainer &&
            event.target !== assignedToInput &&
            !assignedToContainer.contains(event.target)
        ) {
            assignedToContainer.classList.add('d-none');
        }
    }

    if (assignedToContainer) {
        document.removeEventListener('click', clickHandler);
    }
}

// Funktion zum Schließen des Overlays und Entfernen des Skripts
function closeOverlay() {
    document.getElementById('taskContent').innerHTML = '';
    const script = document.querySelector('script[src="../js/special_add_task.js"]');
    if (script) {
        script.remove();
        removeEventListenerFromAssignedToContainer();
        removeClickEventListener(); // Entferne den Event Listener
        removeSubtaskEventListeners()
    }
}


function addTaskOverlay(progressBoard) {

    document.getElementById('taskContent').innerHTML = /*HTML*/ `
     
    <div class="taskOverlay">
        <div class="dialogAddTask">
        <h3>Add Task</h3>

        <p>Progress: ${progressBoard}</p>  
        
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
                        <input class="custom-select"  onclick="toggleContacts(), filterContacts()"
                            id="assignedTo" type="text" placeholder="Select contacts to assign">
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
                        <label>Prio</label>
                        <div class="button-container" id="prio">
                            <button class="white" id="urgent" onclick="taskPrio('urgent')" type="button">Urgent<img
                                    src="../assets/img/urgent.svg" alt=""></button>
                            <button class="white" id="medium" onclick="taskPrio('medium')" type="button">Medium<img
                                    src="../assets/img/medium.svg" alt=""></button>
                            <button class="white" id="low" onclick="taskPrio('low')" type="button">Low<img
                                    src="../assets/img/low.svg" alt=""></button>
                        </div>
                    </div>

                    <div class="inputContainer">
                        <label class="required" for="category">Category</label>
                        <select class="custom-select" id="category" name="category" required>
                            <option value="" disabled selected hidden>Select task category</option>
                            <option value="Technical Task">Technical Task</option>
                            <option value="User Story">User Story</option>
                        </select>
                        <div class="warning">
                            <span id="warningcategory" class="invisible">This field is requiered</span>
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

            <div class="footAreaOverlay">
                <p><sup class="required"></sup>This field is required</p>
                <div class=btnAddTask>
                    <button class="cancelBtn" onclick="reload()">Cancel <img src="../assets/img/cancel.svg"></button>
                    <button class="activeBtn" onclick="addTask('${progressBoard}')">Create Task <img src="../assets/img/check.svg"   
                            alt=""></button>
                </div>
            </div>
        </div>
        </div>
    </div>
</div>
    `;

    loadExternalScript()
}

function loadExternalScript() {
    const script = document.createElement('script');
    script.src = '../js/special_add_task.js';
    document.body.appendChild(script);
    initTask();
}
