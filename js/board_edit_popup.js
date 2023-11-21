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
function generateEditSubtasks(todo) {
    const subtasksContainer = document.getElementById('savedSubtasks');
    subtasksContainer.innerHTML = '';
    const addSubtaskContainer = createAddSubtaskContainer(todo);
    subtasksContainer.appendChild(addSubtaskContainer);
    if (todo.subtask && todo.subtask.length > 0) {
        todo.subtask.forEach((subtask, index) => {
            const subtaskDiv = createSubtaskDiv(todo, subtask, index);
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

function createAddSubtaskContainer(todo) {
    const addSubtaskContainer = document.createElement('div');
    addSubtaskContainer.classList.add('addSubtaskContainer');
    const addSubtaskInput = createAddSubtaskInput(todo);
    const addSubtaskImage = createAddSubtaskImage();
    const buttonsContainer = createButtonsContainer();
    addSubtaskContainer.appendChild(addSubtaskInput);
    addSubtaskContainer.appendChild(addSubtaskImage);
    addSubtaskContainer.appendChild(buttonsContainer);
    return addSubtaskContainer;
}


function createAddSubtaskInput(todo) {
    const addSubtaskInput = document.createElement('input');
    addSubtaskInput.type = 'text';
    addSubtaskInput.placeholder = 'Add a new subtask';
    addSubtaskInput.id = 'newSubtaskInput';
    addSubtaskInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            addNewSubtask(todo, addSubtaskInput.value);
        }
    });
    return addSubtaskInput;
}


function createAddSubtaskImage() {
    const addSubtaskImage = document.createElement('img');
    addSubtaskImage.src = '../assets/img/add.svg';
    addSubtaskImage.classList.add('plus-image');
    return addSubtaskImage;
}


function addNewSubtask(todo, subtaskTitle) {
    if (subtaskTitle.trim() !== '') {
        todo.subtask.push({ subtasktitle: subtaskTitle.trim() });
        saveAllTasksToRemote();
        generateEditSubtasks(todo);
    }
}


function createButtonsContainer() {
    const buttonsContainer = document.createElement('div');
    buttonsContainer.classList.add('addSubtaskButtonsContainer');
    const cancelSubtaskButton = createButtonWithImage('../assets/img/cancel.svg', 'addSubtaskButtons');
    cancelSubtaskButton.style.display = 'none';
    const acceptSubtaskButton = createButtonWithImage('../assets/img/check-black.svg', 'addSubtaskButtons');
    acceptSubtaskButton.style.display = 'none';
    buttonsContainer.appendChild(cancelSubtaskButton);
    buttonsContainer.appendChild(acceptSubtaskButton);
    return buttonsContainer;
}

function createButtonWithImage(imageSrc, buttonClass) {
    const button = document.createElement('button');
    const image = document.createElement('img');
    image.src = imageSrc;
    button.classList.add(buttonClass);
    button.appendChild(image);
    return button;
}


function createSubtaskDiv(todo, subtask, index) {
    const subtaskDiv = document.createElement('div');
    subtaskDiv.classList.add('editSubtask');
    const bulletImage = createImageElement('../assets/img/dot.svg', 'dot');
    subtaskDiv.appendChild(bulletImage);
    const subtaskInput = createSubtaskInput(subtask, index);
    subtaskDiv.appendChild(subtaskInput);
    const editSubtaskButton = createEditSubtaskButton(subtaskInput, todo, subtask, index);
    subtaskDiv.appendChild(editSubtaskButton);
    const deleteSubtaskButton = createDeleteSubtaskButton(todo, index);
    subtaskDiv.appendChild(deleteSubtaskButton);
    return subtaskDiv;
}

function createImageElement(src, className) {
    const image = document.createElement('img');
    image.src = src;
    image.classList.add(className);
    return image;
}

function createSubtaskInput(subtask, index) {
    const subtaskInput = document.createElement('input');
    subtaskInput.type = 'text';
    subtaskInput.value = subtask.subtasktitle;
    subtaskInput.classList.add('inputSubtaskContainer');
    subtaskInput.disabled = true;
    subtaskInput.id = `inputSubtask-${index}`;
    return subtaskInput;
}


function createEditSubtaskButton(subtaskInput, todo, subtask, index) {
    const editSubtaskButton = document.createElement('button');
    const editSubtaskImage = document.createElement('img');
    editSubtaskImage.src = subtaskInput.disabled ? '../assets/img/edit.svg' : '../assets/img/check-black.svg';
    editSubtaskImage.classList.add('editimages');
    editSubtaskButton.appendChild(editSubtaskImage);
    editSubtaskButton.addEventListener('click', () => {
        if (subtaskInput.disabled) {
            subtaskInput.disabled = false;
            subtaskInput.focus();
            editSubtaskImage.src = '../assets/img/check-black.svg';
        } else {
            subtaskInput.disabled = true;
            subtask.subtasktitle = subtaskInput.value;
            editSubtaskImage.src = '../assets/img/edit.svg';
            saveAllTasksToRemote();
            generateEditSubtasks(todo);
        }
    });
    return editSubtaskButton;
}


function createDeleteSubtaskButton(todo, index) {
    const deleteSubtaskButton = document.createElement('button');
    const deleteSubtaskImage = document.createElement('img');
    deleteSubtaskImage.src = '../assets/img/delete.svg';
    deleteSubtaskImage.classList.add('editimages');
    deleteSubtaskButton.appendChild(deleteSubtaskImage);
    deleteSubtaskButton.addEventListener('click', () => {
        todo.subtask.splice(index, 1);
        saveAllTasksToRemote();
        generateEditSubtasks(todo);
    });
    return deleteSubtaskButton;
}

async function closeEditPopup(id) {
    await loadAllTasksFromRemote();
    openPopup(id)
    document.getElementById('editpopup').style.display = 'none';
    document.getElementById('popup').style.display = 'flex';
    document.getElementById('editpopup').innerHTML = '';
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


function handleCategoryChangeBoard() {
    let categorySelect = document.getElementById("category-board");
    let newCategoryInput = document.getElementById("inputCategory");
    if (categorySelect.value === "Enter new category") {
        newCategoryInput.classList.remove("d-none");
    } else {
        newCategoryInput.classList.add("d-none");
    }
}


function showNotification() {
    const notificationPopup = document.getElementById('notification-popup');
    notificationPopup.style.display = 'block';
    setTimeout(() => {
        notificationPopup.style.display = 'none';
    }, 3000);
}