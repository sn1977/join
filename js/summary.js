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
    summarytasks.forEach(task => {
        const { progress, prio } = task;
        if (progress === 'todo') todo++;
        if (progress === 'done') done++;
        if (progress === 'inprogress') inprogress++;
        if (progress === 'awaitfeedback') feedback++;
        if (prio === 'urgent' && progress !== 'done') urgent++;
    });
    let date = getNextDate();
    upcomingHtml (date);
    summaryHtml ();
    greetingHtml();
}


/**
 * This function searches for the earliest date after today for tasks with progress not "done"
 * 
 * @returns the next deadline date after today for tasks with progress not "done"
 */
function getNextDate() {
    const today = new Date();
    let nextDate = null;
    summarytasks.forEach((element) => {
        if (element.progress !== "done") {
            // Umformatieren des Datums von "TT/MM/JJJJ" zu "MM/TT/JJJJ"
            const [day, month, year] = element.dueDate.split("/");
            const reformattedDate = `${month}/${day}/${year}`;
            const taskDueDate = new Date(reformattedDate);

            if (!isNaN(taskDueDate.getTime()) && taskDueDate > today && (!nextDate || taskDueDate < nextDate)) {
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
        <div class="d-flex-start">
            <div class="upcoming">
                ${date}
            </div>
            <span class="upcomingSubline">
                Upcoming Deadline
            </span>
        </div>
    `;
}


function summaryHtml (){

    let todoToHtml = document.getElementById('todo');
    todoToHtml.innerHTML = `
        <div id="todoImg">     </div>
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
        <div id="doneImg">     </div>
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
      return greeting;
}


  
function greetingHtml() {
    let greeting = greetByTime();
    let name = localStorage.getItem('userInitials');
    let greetHtml = document.getElementById("greetingHtml");
    if (name === 'G') {
         greetHtml.innerHTML = `
            <h3>${greeting}!</h3>
            `;
        }
    else {
        greetHtml.innerHTML = `
            <h3>${greeting},</h3>
            <h2>${name} </h2>
            `;
    }
} 