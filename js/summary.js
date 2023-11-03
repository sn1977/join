/**
 * funtion to load all tasks from remote
 * 
 *
 * 
 */
let todo = 0;
let done = 0;
let inprogress =0;
let feedback = 0;
let tasksOnBoard = 0;
let urgent = 0;
let summarytasks = [];


/**
 * funtion to load all tasks from remote
 * 
 *
 * 
 */
async function loadAllSummaryTasks() {
    summarytasks = JSON.parse(await getItem('tasks'));
    tasksCount();
}


async function tasksCount() {    
    tasksOnBoard = summarytasks.length;
    for (let i = 0; i < summarytasks.length; i++) {
        const item = summarytasks[i].progress;
        const itemprio = summarytasks[i].prio;

        if (item === 'todo'){
            todo++
        }
        if (item === 'done'){
            done++
        }
        if (item === 'inprogress'){
            inprogress++;
        }
        if (item === 'awaitfeedback'){   
            feedback++;
        }
        if (itemprio === 'urgent'){
            urgent++;
        }
    }
    let date = getNextDate();
    upcomingHtml (date);
    summaryHtml ();
}


/**
 * This function searches all arrays for the earliest date
 * 
 * @returns the next deadline date
 */
function getNextDate() {
    let nextDate = 0;
    summarytasks.find((element) => {
        if (element.dueDate < nextDate || nextDate == 0) {
            nextDate = element.dueDate;
        }
    });
    if (nextDate == 0) {
        return "";
    }
    const timeOptions = { month: "long", day: "numeric", year: "numeric" }
    return new Date(nextDate).toLocaleString("en", timeOptions);
}

function upcomingHtml(date) {
    let upcomingToHtml = document.getElementById('upcoming');
    upcomingToHtml.innerHTML = `
        <div class="d-flex">
            <div class="upcoming">
                ${date}
            </div>
            <span>
                Upcoming Deadline
            </span>
        </div>
    `;


}


function summaryHtml (){

    let todoToHtml = document.getElementById('todo');
    todoToHtml.innerHTML = `
        <img src="../assets/img/todo.svg" alt="">
        <div class="d-flex">
            <div class="number">
                ${todo}
            </div>
            <span>
                To-Do
            </span>
        </div>
    `;

    let doneToHtml = document.getElementById('done');
    doneToHtml.innerHTML = `
        <img src="../assets/img/done.svg" alt="">
        <div class="d-flex">
            <div class="number">
                ${done}
            </div>
            <span>
                Done
            </span>
        </div>
    `;


    let tasksToHtml = document.getElementById('tasks');
    tasksToHtml.innerHTML = `
        <div class="number">
            ${tasksOnBoard}
        </div>
        <span>
            Tasks in<br> 
            Board
        </span>
    `;

    let progressToHtml = document.getElementById('progress');
    progressToHtml.innerHTML = `
        <div class="number">
            ${inprogress}
        </div>
        <span>
            Tasks in<br> 
            Progress
        </span> 
    `;

    let feedbackToHtml = document.getElementById('waiting');
    feedbackToHtml.innerHTML = `
        <div class="number">
            ${feedback}
        </div>
        <span>
            Awaiting<br> 
            Feedback
        </span> 
    `;

    
    let urgentToHtml = document.getElementById('urgentbox');
    urgentToHtml.innerHTML = `
        <div class="iconurgent">
            <img src="../assets/img/urgent_white.svg" alt="">
        </div>
        <div class="d-flex">
            <div class="number">
                ${urgent}
            </div>
            <span>
                Urgent
            </span>
        </div>
        <img src="../assets/img/vector.svg" alt="">
    `;


}