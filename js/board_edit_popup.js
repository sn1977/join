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
    document.getElementById("editpopup").innerHTML = editBoardHTML(todo);
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
    setPriorityButton(todo.prio);
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
    const addSubtaskContainer = document.createElement('div');
    addSubtaskContainer.classList.add('addSubtaskContainer');
    const addSubtaskInput = document.createElement('input');
    addSubtaskInput.type = 'text';
    addSubtaskInput.placeholder = 'Add a new subtask';
    addSubtaskInput.id = 'newSubtaskInput';
    const addSubtaskImage = document.createElement('img');
    addSubtaskImage.src = '../assets/img/add.svg';
    addSubtaskImage.classList.add('plus-image');
    const buttonsContainer = document.createElement('div');
    buttonsContainer.classList.add('addSubtaskButtonsContainer');
    const cancelSubtaskButton = document.createElement('button');
    const cancelSubtaskImage = document.createElement('img');
    cancelSubtaskImage.src = '../assets/img/cancel.svg';
    cancelSubtaskButton.classList.add('addSubtaskButtons');
    cancelSubtaskButton.appendChild(cancelSubtaskImage);
    cancelSubtaskButton.style.display = 'none';
    const acceptSubtaskButton = document.createElement('button');
    const acceptSubtaskImage = document.createElement('img');
    const vectorImage = document.createElement('img');
    vectorImage.src = '../assets/img/small_vector.svg';
    vectorImage.style.display = 'none';
    acceptSubtaskImage.src = '../assets/img/check-black.svg';
    acceptSubtaskButton.appendChild(acceptSubtaskImage);
    acceptSubtaskButton.classList.add('addSubtaskButtons');
    acceptSubtaskButton.style.display = 'none';
    buttonsContainer.appendChild(cancelSubtaskButton);
    buttonsContainer.appendChild(vectorImage);
    buttonsContainer.appendChild(acceptSubtaskButton);
    addSubtaskContainer.appendChild(addSubtaskInput);
    addSubtaskContainer.appendChild(addSubtaskImage);
    addSubtaskContainer.appendChild(buttonsContainer);
    subtasksContainer.appendChild(addSubtaskContainer);
    addSubtaskInput.addEventListener('click', () => {
        addSubtaskImage.style.display = 'none';
        cancelSubtaskButton.style.display = 'block';
        acceptSubtaskButton.style.display = 'block';
        vectorImage.style = 'block';
    });
    addSubtaskImage.addEventListener('click', () => {
        addSubtaskImage.style.display = 'none';
        cancelSubtaskButton.style.display = 'block';
        acceptSubtaskButton.style.display = 'block';
        vectorImage.style.display = 'block';
        addSubtaskInput.focus();
    });
    cancelSubtaskButton.addEventListener('click', () => {
        addSubtaskInput.value = '';
        addSubtaskImage.style.display = 'block';
        cancelSubtaskButton.style.display = 'none';
        acceptSubtaskButton.style.display = 'none';
        vectorImage.style.display = 'none';
    });
    acceptSubtaskButton.addEventListener('click', () => {
        const newSubtaskTitle = addSubtaskInput.value;
        if (newSubtaskTitle.trim() !== '') {
            todo.subtask.push({ subtasktitle: newSubtaskTitle });
            saveAllTasksToRemote();
            addSubtaskInput.value = '';
            addSubtaskImage.style.display = 'block';
            cancelSubtaskButton.style.display = 'none';
            acceptSubtaskButton.style.display = 'none';
            vectorImage.style.display = 'none';
            generateEditSubtasks(todo);
        }
    });
    if (todo.subtask && todo.subtask.length > 0) {
        todo.subtask.forEach((subtask, index) => {
            const subtaskDiv = document.createElement('div');
            subtaskDiv.classList.add('editSubtask');
            const bulletImage = document.createElement('img');
            bulletImage.classList.add('dot');
            bulletImage.src = '../assets/img/dot.svg';
            subtaskDiv.appendChild(bulletImage);
            const subtaskInput = document.createElement('input');
            subtaskInput.type = 'text';
            subtaskInput.value = subtask.subtasktitle;
            subtaskInput.classList.add('inputSubtaskContainer');
            subtaskInput.disabled = true;
            subtaskInput.id = `inputSubtask-${index}`;
            const editSubtaskButton = document.createElement('button');
            const editSubtaskImage = document.createElement('img');
            if (subtaskInput.disabled) {
                editSubtaskImage.src = '../assets/img/edit.svg';
                editSubtaskImage.classList.add('editimages');
            } else {
                editSubtaskImage.src = '../assets/img/check-black.svg';
                editSubtaskImage.classList.add('editimages');
            }
            editSubtaskButton.appendChild(editSubtaskImage);
            editSubtaskButton.addEventListener('click', () => {
                if (editSubtaskImage.src.includes('edit.svg')) {
                    editSubtaskImage.src = '../assets/img/delete.svg';
                    subtaskDiv.removeChild(bulletImage);
                    subtaskDiv.removeChild(deleteSubtaskButton);
                    const acceptSubtaskButton = document.createElement('button');
                    const acceptSubtaskImage = document.createElement('img');
                    acceptSubtaskImage.src = '../assets/img/check-black.svg';
                    acceptSubtaskImage.classList.add('editimages')
                    acceptSubtaskButton.appendChild(acceptSubtaskImage);
                    acceptSubtaskButton.addEventListener('click', () => {
                        subtask.subtasktitle = subtaskInput.value;
                        subtaskInput.disabled = true;
                        editSubtaskImage.src = '../assets/img/edit.svg';
                        subtaskDiv.insertBefore(bulletImage, subtaskInput);
                        subtaskDiv.removeChild(acceptSubtaskButton);
                        subtaskDiv.appendChild(deleteSubtaskButton);
                    });
                    subtaskDiv.appendChild(acceptSubtaskButton);
                    subtaskInput.disabled = false;
                    subtaskInput.focus();
                } else if (editSubtaskImage.src.includes('delete.svg')) {
                    todo.subtask.splice(index, 1);
                    saveAllTasksToRemote();
                    generateEditSubtasks(todo);
                }
            });
            const additionalImage = document.createElement('img');
            additionalImage.src = '../assets/img/vector.svg';
            additionalImage.classList.add('additional-image');
            let deleteSubtaskButton;
            const deleteSubtaskImage = document.createElement('img');
            deleteSubtaskImage.src = '../assets/img/delete.svg';
            deleteSubtaskImage.classList.add('editimages');
            deleteSubtaskButton = document.createElement('button');
            deleteSubtaskButton.appendChild(deleteSubtaskImage);
            deleteSubtaskButton.addEventListener('click', () => {
                todo.subtask.splice(index, 1);
                saveAllTasksToRemote();
                generateEditSubtasks(todo);
            });
            subtaskDiv.appendChild(subtaskInput);
            subtaskDiv.appendChild(editSubtaskButton);
            subtaskDiv.appendChild(additionalImage);
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

function setPriorityButton(priority) {
    document.querySelectorAll('.button-container button').forEach(button => {
        button.classList.remove('urgent', 'medium', 'low');
        button.classList.add('white');
        const image = button.querySelector('img');
        if (image) {
            image.style.filter = "";
        }
    });
    if (priority) {
        const selectedButton = document.getElementById(priority);
        if (selectedButton) {
            selectedButton.classList.add(priority);
            selectedButton.classList.remove('white');
            const image = selectedButton.querySelector('img');
            if (image) {
                image.style.filter = "brightness(0%) invert(1)";
            }
        }
    }
}

function selectPriority(priority, id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.prio = priority;
        setPriorityButton(priority);
    }
}

async function saveAllChanges(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        const newTitle = document.getElementById('todotitle').value;
        todo.title = newTitle;
        const newDescription = document.getElementById('tododescription').value;
        todo.description = newDescription;
        const selectedPriority = document.querySelector('.button-container .selectedPrio');
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

function closeAssignedToWindow() {
    const assignedToContainer = document.getElementById('assignedToContainer');
    assignedToContainer.classList.add('d-none');
}

document.addEventListener('click', function (event) {
    const assignedToContainer = document.getElementById('assignedToContainer');
    const assignedToInput = document.getElementById('assignedTo');
    if (assignedToContainer && assignedToInput) {
        if (!assignedToContainer.contains(event.target) && !assignedToInput.contains(event.target)) {
            closeAssignedToWindow();
        }
    }
});