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
    greetByTime();
}


/**
 * This function searches for the earliest date after today for tasks with progress not "done"
 * 
 * @returns the next deadline date after today for tasks with progress not "done"
 */
function getNextDate() {
    const today = new Date(); // Aktuelles Datum und Uhrzeit

    let nextDate = null; // Nutze null anstelle von 0 für Datumswerte
    summarytasks.forEach((element) => {
        if (element.progress !== "done") {
            const taskDueDate = new Date(element.dueDate);

            if (taskDueDate > today && (!nextDate || taskDueDate < nextDate)) {
                nextDate = taskDueDate;
            }
        }
    });

    if (!nextDate) {
        return "";
    }

    const timeOptions = { month: "long", day: "numeric", year: "numeric" };
    return nextDate.toLocaleString("en", timeOptions);
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

function greetByTime() {
    const currentHour = new Date().getHours();
    let greeting = '';

    if (currentHour >= 5 && currentHour < 12) {
        greeting = "Good morning";
      } else if (currentHour >= 12 && currentHour < 18) {
        greeting = "Good afternoon";
      } else {
        greeting = "Good evening";
      }

     
    let greetingToHtml = document.getElementById('greeting');
    greetingToHtml.innerHTML = `
      ${greeting}
    `;
  }
  
  