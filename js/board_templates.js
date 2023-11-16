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
                    <img src="../assets/img/search.svg" alt="Search">
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
                <img src="../assets/img/search.svg" alt="Search">
            </div>
        </div>
    </section>
    <section class="boardContent" id="boardContent">
    
    </section>
`
}