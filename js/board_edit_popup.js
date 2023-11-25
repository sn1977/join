/**
 * @author Patrick
 * Join Gruppenarbeit 727
 * October 2023
 * 
 */

/**
 * Opens the edit popup for a specific todo item.
 * @param {number} id - The unique identifier of the todo item to be edited.
 */
function openEditPopup(id) {
    const todo = todos.find(t => t.id === id);
    closePopup();
    createEditPopup(todo);
    initializeDatepicker();
    document.getElementById('editpopup').style.display = 'flex';
    document.getElementById('popup').style.display = 'none';
}


/**
 * Creates and displays the edit popup with the details of the specified todo item.
 * @param {Object} todo - The todo item to be edited.
 */
function createEditPopup(todo) {
    allContactsBoard = todo.assignedTo;
    document.getElementById("editpopup").innerHTML = '';
    document.getElementById("editpopup").innerHTML = editBoardHTML(todo);
    updateCategorySelectBoard(todo.category);
    showSelectedContacts();
    setupSearchListener();
    generateEditSubtasks(todo);
    generateAssignedToEditPopup(todo);
    setPriorityButton(todo.prio);
    document.getElementById('editpopup').style.display = 'flex';
    document.getElementById('popup').style.display = 'none';
}


/**
 * Closes the edit popup and refreshes the task list.
 * @param {number} id - The unique identifier of the todo item.
 */
async function closeEditPopup(id) {
    await loadAllTasksFromRemote();
    openPopup(id)
    document.getElementById('editpopup').style.display = 'none';
    document.getElementById('popup').style.display = 'flex';
    document.getElementById('editpopup').innerHTML = '';
}


/**
 * Generates the subtask editing section within the edit popup.
 * @param {Object} todo - The todo item containing subtasks to be edited.
 */
function generateEditSubtasks(todo) {
    const subtasksContainer = document.getElementById('savedSubtasks');
    subtasksContainer.innerHTML = '';
    const addSubtaskContainer = document.createElement('div');
    addSubtaskContainer.classList.add('addSubtaskContainer');
    const addSubtaskInput = document.createElement('input');
    addSubtaskInput.type = 'text';
    addSubtaskInput.placeholder = 'Add a new subtask';
    addSubtaskInput.id = 'newSubtaskInput';
    addSubtaskInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            const newSubtaskTitle = addSubtaskInput.value.trim();
            if (newSubtaskTitle !== '') {
                todo.subtask.push({ subtasktitle: newSubtaskTitle });
                addSubtaskInput.value = '';
                generateEditSubtasks(todo);
            }
        }
    });
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


/**
 * Generates and displays assigned contacts in the edit popup.
 * @param {Object} todo - The todo item with assigned contacts.
 */
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


/**
 * Sets the priority button in the UI based on the todo item's priority.
 * @param {string} priority - The priority level of the todo item.
 */
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


/**
 * Updates the priority of a todo item.
 * @param {string} priority - The new priority to be set.
 * @param {number} id - The unique identifier of the todo item.
 */
function selectPriority(priority, id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.prio = priority;
        setPriorityButton(priority);
    }
}


/**
 * Saves all changes made in the edit popup to the todo item.
 * @param {number} id - The unique identifier of the todo item to be updated.
 */
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
        const categorySelect = document.getElementById('category-board');
        const selectedCategory = categorySelect.value;
        todo.category = selectedCategory;
        await saveAllTasksToRemote();
        await loadAllTasksFromRemote();
        closeEditPopup(id);
        openPopup();
        updateHTML();
        showNotification();
    }
}


/**
 * Initializes the date picker for selecting due dates.
 */
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


/**
 * Closes the assigned to window in the UI.
 */
function closeAssignedToWindow() {
    const assignedToContainer = document.getElementById('assignedToContainer');
    assignedToContainer.classList.add('d-none');
}


/**
 * Event listener to handle clicks outside of the assigned to window, causing it to close.
 */
document.addEventListener('click', function (event) {
    const assignedToContainer = document.getElementById('assignedToContainer');
    const assignedToInput = document.getElementById('assignedTo');
    if (assignedToContainer && assignedToInput) {
        if (!assignedToContainer.contains(event.target) && !assignedToInput.contains(event.target)) {
            closeAssignedToWindow();
        }
    }
});


/**
 * Updates the category selection dropdown in the board view.
 *
 * This function populates the category selection dropdown element with options based on the provided category array
 * and selects the specified category if it matches the selectedCategory parameter.
 *
 * @param {string} selectedCategory - The category to be selected in the dropdown (if applicable).
 */
function updateCategorySelectBoard(selectedCategory) {
    const categorySelect = document.getElementById('category-board');
    categorySelect.innerHTML = '';
    categoryArray.forEach((category) => {
        let option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        if (selectedCategory === category) {
            option.selected = true;
        }
        categorySelect.appendChild(option);
    });
    const newCategoryOption = document.createElement('option');
    newCategoryOption.value = 'Enter new category';
    newCategoryOption.innerText = 'Enter new category';
    newCategoryOption.classList = 'markText';
    categorySelect.appendChild(newCategoryOption);
}


/**
 * Handles the change event of the category selection dropdown in the board view.
 *
 * This function checks the selected value of the category dropdown, and if it equals "Enter new category",
 * it displays an input field for entering a new category. Otherwise, it hides the input field.
 */
function handleCategoryChangeBoard() {
    let categorySelect = document.getElementById("category-board");
    let newCategoryInput = document.getElementById("inputCategory");
    if (categorySelect.value === "Enter new category") {
        newCategoryInput.classList.remove("d-none");
    } else {
        newCategoryInput.classList.add("d-none");
    }
}


/**
 * Displays a notification popup for a brief period of time.
 *
 * This function shows a notification popup by setting its display style to 'block'. After a delay of 3000 milliseconds (3 seconds),
 * the notification popup is hidden by setting its display style to 'none'.
 */
function showNotification() {
    const notificationPopup = document.getElementById('notification-popup');
    notificationPopup.style.display = 'block';
    setTimeout(() => {
        notificationPopup.style.display = 'none';
    }, 3000);
}