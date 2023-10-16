let boardNames = [
    'To do',
    'In progress',
    'Await feedback',
    'Done'
]

function init() {
    renderBoard();
    updateHTML();
}


function renderBoard() {
    document.getElementById('content').innerHTML = '';
    document.getElementById('content').innerHTML += /*html*/ `<div class="board" id="board"></div>`;
    document.getElementById('board').innerHTML += /*html*/ `
			<section class="boardHeader" id="boardHeader">
				<div class="boardHeadlineLeft">
					Board
				</div>
				<div class="boardHeadlineRight">
					<div class="search">
						<input type="text" id="inputSearch" class="inputSearch" placeholder="Find task">
						<div class="buttonSearch">
							<img src="../assets/img/search.svg" alt="Search">
						</div>
					</div>
					<button class="buttonAddTask">
						<span>Add Task</span>
						<span>+</span>
					</button>
				</div>
			</section>
            <section class="boardContent" id="boardContent">
			
			</section>
    `;


    for (let i = 0; i < boardNames.length; i++) {
        const name = boardNames[i];
        const category = name.toLowerCase().replace(' ', '');
        if (i < 3) {
            document.getElementById('boardContent').innerHTML += /*html*/ `
            <div class="progressContainer">
                <div class="progressContainerStatusHead">
                    <div class="progressStatus">
                        ${name}
                    </div>
                    <div>
                        <img src="../assets/img/addbutton.svg" alt="Add Task">
                    </div>
                </div>
            <div class="statusContainer" id="statusContainer${i}" ondrop="moveTo('${category}')" ondragover="allowDrop(event)"></div>
        </div>`
        } else {
            document.getElementById('boardContent').innerHTML += /*html*/ `
            <div class="progressContainer">
                <div class="progressContainerStatusHead">
                    <div class="progressStatus">
                        ${name}
                    </div>
                </div>
            <div class="statusContainer" id="statusContainer${i}" ondrop="moveTo('${category}')" ondragover="allowDrop(event)"></div>
        </div>`
        }


    }
}





let todos = [
    {
        'id': 0,
        'title': 'Putzen',
        'category': 'todo',
        'lastMoved': new Date().getTime()
    },
    {
        'id': 1,
        'title': 'Kochen',
        'category': 'inprogress',
        'lastMoved': new Date().getTime()
    },
    {
        'id': 2,
        'title': 'Einkaufen',
        'category': 'awaitfeedback',
        'lastMoved': new Date().getTime()
    },
    {
        'id': 3,
        'title': 'Arbeiten',
        'category': 'done',
        'lastMoved': new Date().getTime()
    }
];

let currentDraggedElement;


function updateHTML() {
    let todo = sortTodos(todos.filter(t => t['category'] == 'todo'));
    document.getElementById('statusContainer0').innerHTML = '';

    for (let i = 0; i < todo.length; i++) {
        const element = todo[i];
        document.getElementById('statusContainer0').innerHTML += generateHTML(element);
    }

    let inprogress = sortTodos(todos.filter(t => t['category'] == 'inprogress'));
    document.getElementById('statusContainer1').innerHTML = '';

    for (let i = 0; i < inprogress.length; i++) {
        const element = inprogress[i];
        document.getElementById('statusContainer1').innerHTML += generateHTML(element);
    }

    let awaitfeedback = sortTodos(todos.filter(t => t['category'] == 'awaitfeedback'));
    document.getElementById('statusContainer2').innerHTML = '';

    for (let i = 0; i < awaitfeedback.length; i++) {
        const element = awaitfeedback[i];
        document.getElementById('statusContainer2').innerHTML += generateHTML(element);
    }

    let done = sortTodos(todos.filter(t => t['category'] == 'done'));
    document.getElementById('statusContainer3').innerHTML = '';

    for (let i = 0; i < done.length; i++) {
        const element = done[i];
        document.getElementById('statusContainer3').innerHTML += generateHTML(element);
    }
}


function startDragging(id) {
    currentDraggedElement = id;
}

function generateHTML(element) {
    return /*html*/ `
        <div draggable="true" class="todo" ondragstart="startDragging(${element['id']})">${element['title']}</div>
    `
}

function allowDrop(ev) {
    ev.preventDefault();
}

function moveTo(category) {
    todos[currentDraggedElement]['category'] = category;
    todos[currentDraggedElement]['lastMoved'] = new Date().getTime();
    updateHTML();
}

function sortTodos(todosArray) {
    return todosArray.sort((a, b) => a.lastMoved - b.lastMoved);
}