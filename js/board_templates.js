function boardHTML() {
    return `
    <div id="editpopup" class="popup"></div>
    <div id="popup" class="popup">
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
    `
}