let allTasks = [];
let lastPrio = '';
let prio = '';


function reload(){
    getInput();
    emptyFields(title, description, assignedTo, dueDate, prio, category, subtask);
}


// JavaScript, um die Platzhalteroption auszuwählen
document.getElementById("assignedTo").selectedIndex = 0;
document.getElementById("category").selectedIndex = 0;


function taskPrio(i){
    if(lastPrio != '') {
        resetPrio();
    }
    switch(i) {
        case 1:
            prio = 'urgent';
          break;
        case 2:
            prio = 'medium';
          break;
        case 3:
            prio = 'low';
        break;            
      }
      setPrio (i)
      lastPrio = i; 
}


function setPrio (i){
    let element = '';
    let imageElement = '';
    element = document.getElementById(`prio${i}`);
    element.querySelector('img');
    element.classList.remove ('white');
    element.classList.add (`${prio}`);
    imageElement = element.querySelector('img');
    imageElement.style.filter = "brightness(0%) invert(1)";  
}


function resetPrio(){
    let element = '';
    let imageElement = '';
    element = document.getElementById(`prio${lastPrio}`);
    element.querySelector('img');
    element.classList.add ('white');
    element.classList.remove (`${prio}`);
    imageElement = element.querySelector('img');
    imageElement.style.filter = "brightness(100%) invert(0)";  
}



/**
 * Fügt einen neuen Task hinzu
 * 
 * 
 * 
 */
function addTask (progress){

    getInput();
    
    let task = {
        'title' : title.value,
        'description': description.value,
        'assignedTo' : assignedTo.value,
        'dueDate' : Date(dueDate.value),
        'prio' : prio,
        'category': category.value,
        'subtask' : subtask.value,
        'progress' : progress,
        'createdAt': new Date().getTime()
    };

    allTasks.push(task);
    let allTasksAsString = JSON.stringify(allTasks);
    localStorage.setItem('allTasks', allTasksAsString);
    emptyFields(title, description, assignedTo, dueDate, prio, category, subtask);
    resetPrio();
}

function getInput(){
    let title = document.getElementById('title');
    let description = document.getElementById('description');
    let assignedTo = document.getElementById('assignedTo');
    let dueDate = document.getElementById('dueDate');
    let category = document.getElementById('category');
    let subtask = document.getElementById('subtask');

    return (title, description, assignedTo, dueDate, category, subtask);
}


function emptyFields(title, description, assignedTo, dueDate, prio, category, subtask){
    title.value ='';
    description.value ='';
    assignedTo.value = '';
    dueDate.value = '';
    prio = '';
    category.value = '';
    subtask.value = '';
}


function loadAllTasks(){
    let allTasksAsString = localStorage.getItem('allTasks');
    allTasks = JSON.parse (allTasksAsString);

    console.log ('loaded all Tesk', allTasks);
}



      /* // Eine Funktion, um die Daten abzurufen und in das Dropdown-Feld einzufügen
        function populateDropdown() {
            // Hier sollten Sie eine Ajax-Anfrage an Ihre serverseitige API senden, um die Daten abzurufen.
            // Nehmen wir an, Ihre API gibt ein JSON-Array mit Optionen zurück.

            // Beispiel-Daten (ersetzen Sie dies durch Ihre eigene Logik):
            var optionsData = [
                { id: 1, name: "Option 1" },
                { id: 2, name: "Option 2" },
                { id: 3, name: "Option 3" },
            ];

            var select = document.getElementById("options");

            // Schleife, um Daten in das Dropdown-Feld einzufügen
            optionsData.forEach(function (option) {
                var optionElement = document.createElement("option");
                optionElement.value = option.id;
                optionElement.textContent = option.name;
                select.appendChild(optionElement);
            });
        }

        // Die Funktion aufrufen, um das Dropdown-Feld zu füllen
        populateDropdown(); */
