/**
 * Adds a subtask to the current task.
 * 
 * @function
 * @param {number} i - Index of the subtask.
 * 
 */
function addSubtask() {
    if (subtask.value != '') {
        subtaskID++;
        getLastID();
        let tempsubtask = {
            'id': id,
            'subtaskid': subtaskID,
            'subtasktitle': subtask.value,
            'done': false
        }
        allSubtasks.push(tempsubtask);
        subtask.value = '';
        generateSubtaskHtml();
        switchBack();
    } else {
        alert("Darf nicht leer sein");
    }
}


/**
 * Generates and renders HTML for displaying subtasks.
 * 
 * @function
 * 
 */
function generateSubtaskHtml() {
    let subtasksHtml = document.getElementById('savedSubtasks');
    subtasksHtml.innerHTML = '';
    for (let i = 0; i < allSubtasks.length; i++) {
        let temptask = allSubtasks[i];
        subtasksHtml.innerHTML += `
            <div class="subtaskItem" id="editSubtask${i}" ondblclick="editSubtaskHtml(${i})">
                <div class="subtaskLine">
                    <img class="dot" src="../assets/img/dot.svg">
                    <p>${temptask['subtasktitle']}</p>
                </div> 
                <div class="subtaskEdit">
                    <img onclick="editSubtaskHtml(${i})" src="../assets/img/edit.png" alt=""> 
                    <div>|</div>
                    <img onclick="delSubtask(${i})" src="../assets/img/delete.svg" alt="">
                </div>
            </div>
    `;
    }
}


/**
 * Edits the HTML representation of a subtask.
 * 
 * @function
 * @param {number} i - Index of the subtask to edit.
 * 
 */
function editSubtaskHtml(i) {
    let editSubtask = document.getElementById(`editSubtask${i}`);
    editSubtask.classList.remove('subtaskItem');
    editSubtask.classList.add('editItem');
    let editValue = allSubtasks[i]['subtasktitle'];
    editSubtask.innerHTML = `
        <div id="editSubtask${i}" class="subtaskLine">
            <input class="editTaskInput" id="editSubtask" type="text" value="${editValue}">
        </div> 
        <div class="editItemIcons">
            <img src="../assets/img/delete.svg" onclick="delSubtask(${i})">
            <div>|</div>
            <img src="../assets/img/check-black.svg" onclick="editSubtask(${i})">
        </div>
    `;
}


/**
 * Deletes a subtask and updates the HTML representation.
 * 
 * @function
 * @param {number} i - Index of the subtask to delete.
 * 
 */
function delSubtask(i) {
    allSubtasks.splice(i, 1);
    generateSubtaskHtml();
}


/**
 * Edits the content of a subtask based on user input.
 * 
 * @function
 * @param {number} i - Index of the subtask to edit.
 * 
 */
function editSubtask(i) {
    let editSubtask = document.getElementById('editSubtask');
    allSubtasks[i].subtasktitle = editSubtask.value;
    generateSubtaskHtml();
}


/**
 * Switches to the input mode for adding a subtask.
 * 
 * @function
 * 
 */
function switchToInput() {
    document.getElementById('inputsubtask').style.display = 'flex';
    document.getElementById('addSubtask').style.display = 'none';
    subtaskInput.addEventListener("focus", () => {
        subtaskContainer.style.borderColor = "#29ABE2";
    });
}


/**
 * Switches back to the normal mode for adding a subtask.
 * 
 * @function
 * 
 */
function switchBack() {
    document.getElementById('inputsubtask').style.display = 'none';
    document.getElementById('addSubtask').style.display = 'flex';
    subtask.value = "";
}


/**
 * Deletes the input value for adding a subtask.
 * 
 * @function
 * 
 */
function delInput() {
    subtask.value = "";
    document.getElementById('inputsubtask').style.display = 'none';
    document.getElementById('addSubtask').style.display = 'flex';
}