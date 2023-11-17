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
    document.getElementById("editpopup").innerHTML += /*html*/ `
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
                        <select class="custom-select" id="category" name="category" required>
                            <option value="" disabled selected hidden>Select task category</option>
                            <option value="Technical Task">Technical Task</option>
                            <option value="User Story">User Story</option>
                        </select>
                    </div>
                    <h4>Assigned to</h4>

                    <div class="inputContainer">
                        <input class="custom-select"  onclick="toggleContactsBoard(),filterContactsBoard()"
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
    `;

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

    // Erstelle eine gemeinsame div für das Input-Feld und die Buttons
    const addSubtaskContainer = document.createElement('div');
    addSubtaskContainer.classList.add('addSubtaskContainer'); // Fügen Sie eine CSS-Klasse für das Styling hinzu

    // Füge ein Eingabefeld zum Hinzufügen neuer Subtasks über den aktuellen Subtasks hinzu
    const addSubtaskInput = document.createElement('input');
    addSubtaskInput.type = 'text';
    addSubtaskInput.placeholder = 'Add a new subtask';
    addSubtaskInput.id = 'newSubtaskInput'; // Setze eine ID für das Eingabefeld

    // Erstelle ein Bild mit einem Plus-Symbol und füge es zur gemeinsamen div hinzu
    const addSubtaskImage = document.createElement('img');
    addSubtaskImage.src = '../assets/img/add.svg'; // Pfad zum Plus-Symbol
    addSubtaskImage.classList.add('plus-image'); // Füge eine CSS-Klasse hinzu, um das Bild zu stylen

    // Erstelle einen Button-Container für die Buttons
    const buttonsContainer = document.createElement('div');
    buttonsContainer.classList.add('addSubtaskButtonsContainer');

    // Erstelle einen Button mit einem Kreuz-Symbol und füge ihn zum Button-Container hinzu
    const cancelSubtaskButton = document.createElement('button');
    const cancelSubtaskImage = document.createElement('img');
    cancelSubtaskImage.src = '../assets/img/cancel.svg'; // Pfad zum Kreuz-Symbol
    cancelSubtaskButton.classList.add('addSubtaskButtons');
    cancelSubtaskButton.appendChild(cancelSubtaskImage);
    cancelSubtaskButton.style.display = 'none'; // Verstecke den Button standardmäßig

    // Erstelle einen Button mit einem Haken-Symbol und füge ihn zum Button-Container hinzu
    const acceptSubtaskButton = document.createElement('button');
    const acceptSubtaskImage = document.createElement('img');
    const vectorImage = document.createElement('img');
    vectorImage.src = '../assets/img/small_vector.svg';
    vectorImage.style.display = 'none';
    acceptSubtaskImage.src = '../assets/img/check-black.svg'; // Pfad zum Haken-Symbol
    acceptSubtaskButton.appendChild(acceptSubtaskImage);
    acceptSubtaskButton.classList.add('addSubtaskButtons');
    acceptSubtaskButton.style.display = 'none'; // Verstecke den Button standardmäßig


    // Füge die Buttons zum Button-Container hinzu
    buttonsContainer.appendChild(cancelSubtaskButton);
    buttonsContainer.appendChild(vectorImage);
    buttonsContainer.appendChild(acceptSubtaskButton);

    // Füge das Eingabefeld und das Bild zur gemeinsamen div hinzu
    addSubtaskContainer.appendChild(addSubtaskInput);
    addSubtaskContainer.appendChild(addSubtaskImage);
    addSubtaskContainer.appendChild(buttonsContainer);

    // Füge die gemeinsame div dem Subtask-Container hinzu
    subtasksContainer.appendChild(addSubtaskContainer);

    // Überwache das Klickereignis für das Eingabefeld, um das Bild und die Buttons anzuzeigen
    addSubtaskInput.addEventListener('click', () => {
        addSubtaskImage.style.display = 'none'; // Verstecke das Plus-Symbol
        cancelSubtaskButton.style.display = 'block'; // Zeige den Abbrechen-Button an
        acceptSubtaskButton.style.display = 'block'; // Zeige den Akzeptieren-Button an
        vectorImage.style = 'block';
    });

    // Überwache das Klickereignis für das Plus-Symbol, um es zu verbergen und die Buttons anzuzeigen
    addSubtaskImage.addEventListener('click', () => {
        addSubtaskImage.style.display = 'none'; // Verstecke das Plus-Symbol
        cancelSubtaskButton.style.display = 'block'; // Zeige den Abbrechen-Button an
        acceptSubtaskButton.style.display = 'block'; // Zeige den Akzeptieren-Button an
        vectorImage.style.display = 'block';
        addSubtaskInput.focus(); // Fokussiere automatisch das Eingabefeld
    });

    // Klickereignis für den Abbrechen-Button
    cancelSubtaskButton.addEventListener('click', () => {
        addSubtaskInput.value = ''; // Setze das Eingabefeld zurück
        addSubtaskImage.style.display = 'block'; // Zeige das Plus-Symbol wieder an
        cancelSubtaskButton.style.display = 'none'; // Verstecke den Abbrechen-Button
        acceptSubtaskButton.style.display = 'none'; // Verstecke den Akzeptieren-Button
        vectorImage.style.display = 'none';
    });

    // Klickereignis für den Akzeptieren-Button
    acceptSubtaskButton.addEventListener('click', () => {
        const newSubtaskTitle = addSubtaskInput.value;
        if (newSubtaskTitle.trim() !== '') {
            // Hinzufügen des neuen Subtasks und Zurücksetzen des Eingabefelds
            todo.subtask.push({ subtasktitle: newSubtaskTitle });
            saveAllTasksToRemote();
            addSubtaskInput.value = ''; // Setze das Eingabefeld zurück
            addSubtaskImage.style.display = 'block'; // Zeige das Plus-Symbol wieder an
            cancelSubtaskButton.style.display = 'none'; // Verstecke den Abbrechen-Button
            acceptSubtaskButton.style.display = 'none'; // Verstecke den Akzeptieren-Button
            vectorImage.style.display = 'none';
            generateEditSubtasks(todo); // Aktualisiere die Ansicht der Subtasks
        }
    });

    if (todo.subtask && todo.subtask.length > 0) {
        todo.subtask.forEach((subtask, index) => {
            const subtaskDiv = document.createElement('div');
            subtaskDiv.classList.add('editSubtask');

            // Füge das Bild (Punkt oder anderes Symbol) links neben dem Input-Element hinzu
            const bulletImage = document.createElement('img');
            bulletImage.classList.add('dot');
            bulletImage.src = '../assets/img/dot.svg'; // Passen Sie den Pfad zum gewünschten Bild an
            subtaskDiv.appendChild(bulletImage);

            const subtaskInput = document.createElement('input');
            subtaskInput.type = 'text';
            subtaskInput.value = subtask.subtasktitle;
            subtaskInput.classList.add('inputSubtaskContainer');
            subtaskInput.disabled = true; // Eingabefeld ist standardmäßig deaktiviert
            subtaskInput.id = `inputSubtask-${index}`; // Setze eine eindeutige ID für jedes Eingabefeld

            const editSubtaskButton = document.createElement('button');
            const editSubtaskImage = document.createElement('img');

            // Prüfe, ob das Eingabefeld aktiviert ist, und ändere das Symbol entsprechend
            if (subtaskInput.disabled) {
                editSubtaskImage.src = '../assets/img/edit.svg'; // Stiftsymbol, wenn das Eingabefeld deaktiviert ist
                editSubtaskImage.classList.add('editimages');
            } else {
                editSubtaskImage.src = '../assets/img/check-black.svg'; // Häkchensymbol, wenn das Eingabefeld aktiviert ist
                editSubtaskImage.classList.add('editimages');
            }

            editSubtaskButton.appendChild(editSubtaskImage);
            editSubtaskButton.addEventListener('click', () => {
                if (editSubtaskImage.src.includes('edit.svg')) {
                    // Ändere das Symbol zu einem Löschsymbol
                    editSubtaskImage.src = '../assets/img/delete.svg';

                    // Entferne das Bild (Punkt) links neben dem Input-Element
                    subtaskDiv.removeChild(bulletImage);

                    // Ersetze das "Delete"-Button-Element durch ein "Haken"-Button-Element
                    subtaskDiv.removeChild(deleteSubtaskButton);
                    const acceptSubtaskButton = document.createElement('button');
                    const acceptSubtaskImage = document.createElement('img');
                    acceptSubtaskImage.src = '../assets/img/check-black.svg';
                    acceptSubtaskImage.classList.add('editimages')

                    acceptSubtaskButton.appendChild(acceptSubtaskImage);

                    acceptSubtaskButton.addEventListener('click', () => {
                        // Aktualisiere den Subtask-Titel mit dem Wert aus dem Eingabefeld
                        subtask.subtasktitle = subtaskInput.value;

                        // Deaktiviere das Eingabefeld
                        subtaskInput.disabled = true;

                        // Ändere das Symbol zurück zu einem Stiftsymbol
                        editSubtaskImage.src = '../assets/img/edit.svg';


                        // Füge das Bild (Punkt) links neben dem Input-Element hinzu
                        subtaskDiv.insertBefore(bulletImage, subtaskInput);

                        // Ersetze das "Haken"-Button-Element durch das "Delete"-Button-Element
                        subtaskDiv.removeChild(acceptSubtaskButton);
                        subtaskDiv.appendChild(deleteSubtaskButton);
                    });

                    subtaskDiv.appendChild(acceptSubtaskButton);

                    // Aktiviere das Eingabefeld, damit es bearbeitet werden kann
                    subtaskInput.disabled = false;
                    subtaskInput.focus(); // Setze den Fokus auf das Eingabefeld
                } else if (editSubtaskImage.src.includes('delete.svg')) {
                    // Löschen des Subtasks (wie zuvor)
                    todo.subtask.splice(index, 1);
                    saveAllTasksToRemote();
                    generateEditSubtasks(todo);
                }
            });

            const additionalImage = document.createElement('img');
            additionalImage.src = '../assets/img/vector.svg'; // Pfad zum zusätzlichen Bild
            additionalImage.classList.add('additional-image'); // Füge eine CSS-Klasse hinzu, um das zusätzliche Bild zu stylen

            let deleteSubtaskButton; // Deklarieren Sie die deleteSubtaskButton-Variable im äußeren Gültigkeitsbereich

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
            subtaskDiv.appendChild(additionalImage); // Füge das zusätzliche Bild zwischen Edit und Delete Buttons hinzu

            // Überprüfen Sie, ob deleteSubtaskButton bereits ein Kind von subtaskDiv ist, bevor Sie es hinzufügen
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
    // Gehe durch alle Buttons und aktualisiere ihre Klassen und Stile
    document.querySelectorAll('.button-container button').forEach(button => {
        // Entferne spezifische Klassen und Stile
        button.classList.remove('urgent', 'medium', 'low');
        button.classList.add('white'); // Füge zunächst allen Buttons die Klasse 'white' hinzu
        const image = button.querySelector('img');
        if (image) {
            image.style.filter = ""; // Setze den Bildstil zurück
        }
    });

    // Füge die spezifische Prioritätsklasse zum ausgewählten Button hinzu
    // Entferne die Klasse 'white' und wende den Stil auf das Bild an
    if (priority) {
        const selectedButton = document.getElementById(priority);
        if (selectedButton) {
            selectedButton.classList.add(priority);
            selectedButton.classList.remove('white'); // Entferne 'white' vom ausgewählten Button
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
    assignedToContainer.classList.add('d-none'); // Verstecke das Fenster
}

document.addEventListener('click', function (event) {
    const assignedToContainer = document.getElementById('assignedToContainer');
    const assignedToInput = document.getElementById('assignedTo');

    // Prüfe, ob die Elemente existieren, bevor die 'contains' Methode aufgerufen wird
    if (assignedToContainer && assignedToInput) {
        if (!assignedToContainer.contains(event.target) && !assignedToInput.contains(event.target)) {
            closeAssignedToWindow(); // Schließe das Fenster
        }
    }
});
