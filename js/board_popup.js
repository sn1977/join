function openPopup(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        const categoryClass = todo['category'] === 'User Story' ? 'user-story' : 'technical-task';
        const popupCategory = document.getElementById('popupCategory');
        popupCategory.classList.remove('user-story', 'technical-task');
        popupCategory.classList.add(categoryClass);
        document.getElementById('popupTitle').innerText = todo.title;
        document.getElementById('popupDescription').innerText = todo.description;
        document.getElementById('popupCategory').innerText = todo.category;
        document.getElementById('table').innerHTML = '';
        document.getElementById('table').innerHTML += /*html*/ `<tr><td class="td-left">Due Date:</td><td>${todo.dueDate}</td></tr>`;
        document.getElementById('table').innerHTML += /*html*/ `<tr><td class="td-left">Priority</td><td><div class="priodiv"><span style="
        text-transform: capitalize;
        margin-right: 15px;">
        ${todo.prio}</span><img src="../assets/img/${todo.prio}.svg"></div></td></tr>`;
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
        document.getElementById('popup-buttons').innerHTML += /*html*/`
        <div style="display: flex;
        justify-content: flex-end;
        gap: 8px;">
            <div class="buttonContainer">
                <div class="buttonpopup delete-edit-buttons" onclick="deleteTodo(${todo.id})">
                    <img src="../assets/img/delete.svg">
                    Delete
                </div>
                <img src="../assets/img/small_vector.svg">
                <div class="buttonpopup delete-edit-buttons" onclick="openEditPopup(${todo.id})">
                    <img src="../assets/img/edit.svg">Edit
                </div>
            </div>
        </div>
        `;
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
        document.getElementById("assigned-table-div").innerHTML += /*html*/ `
        <div class="assignedToUsers">
            <div class="user-badge-board" style="background-color:${element.color}">
                ${element.initialien}
            </div>
            <div>
                ${element.name}
            </div>
        </div>
        `
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