

function overlayAddTask(progressBoard) {
    const overlay = document.createElement('div');
    overlay.id = 'taskContent';
    document.body.appendChild(overlay);

    setTimeout(() => {
        overlay.style.transform = 'translateY(-50%) translateX(50%)';
    }, 50);

    addTaskOverlay(progressBoard);
}





function addTaskOverlay(progressBoard) {

    document.getElementById('taskContent').innerHTML = /*HTML*/ `
    
   
    <div class="taskOverlay">
        <div class="dialogAddTask">
        <h3>Add Task</h3>

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
                            <!-- onblur="switchBack()" -->
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
                    <button class="cancelBtn" onclick="reload()">Cancel <img src="../assets/img/cancel.svg"></button>
                    <button class="activeBtn" onclick="addTask(${progressBoard})">Create Task <img src="../assets/img/check.svg"
                            alt=""></button>
                </div>
            </div>
        </div>
        </div>
    </div>
</div>
    `;
}