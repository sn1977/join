/**
* Count of tasks in the 'todo' , 'done', 'inprogress', 'awaitfeedback' progress category
* Total count of tasks on the board
* Count of tasks with 'urgent' priority that are not in 'done' progress
* Array to store summary tasks.
*
* @type {number}
* @type {Array}
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
 * Function to load all tasks from remote
 * 
 * @async
 * @param {boolean} comesFromLogin - Indicates whether the function is called from the login process
 * 
 */
async function loadAllSummaryTasks(comesFromLogin = false) {
    summarytasks = JSON.parse(await getItem('tasks'));
    tasksCount();
    greetingMobile();
}


/**
 * Function to count the tasks in different progress categories
 * 
 * @async
 * 
 */
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
 * Searches for the earliest date after today for tasks with progress not 'done'
 * 
 * @returns {string} - The next deadline date after today for tasks with progress not 'done'
 * 
 */
function getNextDate() {
    const today = new Date();
    let nextDate = null;
    summarytasks.forEach((element) => {
        if (element.progress !== "done") {
            const [day, month, year] = element.dueDate.split("/");
            const reformattedDate = `${month}/${day}/${year}`;
            const taskDueDate = new Date(reformattedDate);
            if (!isNaN(taskDueDate.getTime()) && (taskDueDate >= today || taskDueDate.getDate() === today.getDate()) && (!nextDate || taskDueDate < nextDate)) {
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


/**
 * Updates the HTML content for the upcoming deadline
 * 
 * @param {string} date - The upcoming deadline date
 * 
 */
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


/**
 * Updates the HTML content for summary statistics
 * 
 */
function summaryHtml (){
    let todoToHtml = document.getElementById('todo');
    todoToHtml.innerHTML = /*HTML*/ `
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


/**
 * Returns a greeting message based on the current time of day
 * 
 * @returns {string} - The greeting message
 * 
 */
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


/**
 * Updates the HTML content for the greeting message
 * 
 */
function greetingHtml() {
    let name = localStorage.getItem('userInitials');
    let greetHtml = document.getElementById("greetingHtml");
    let greetMobileHtml = document.getElementById("greetingMobile");
    if (!name || name === 'G') {
        greetHtml.innerHTML = greetingGuest();
        greetMobileHtml.innerHTML = greetingGuest();       
    } else {
        greetHtml.innerHTML = greetingUser(name);
        greetMobileHtml.innerHTML = greetingUser(name);
    }
}


/**
 * Displays a greeting for guest users
 * 
 * @returns {string} - The greeting message for guest users
 * 
 */
function greetingGuest(){
    let greeting = greetByTime();
    return `<h3>${greeting}!</h3>`;
}


/**
 * Displays a greeting for guest users 
 * 
 * @returns {string} - The greeting message for guest users 
 * 
 */
function greetingUser(name){
    let greeting = greetByTime();
    return `
        <h3>${greeting},</h3>
        <h2>${name}</h2>
    `;
}


/**
 * Displays a mobile greeting message and adjusts display elements based on the window size
 * 
 */
function greetingMobile() {
    const mobileGreet = document.getElementById('greetingMobile');
    const mainContent = document.getElementById('content');   
    function handleWindowSizeChange() {
        const querie = window.matchMedia("(max-width: 1150px)");
        if (querie.matches) { 
            setTimeout(() => {
                mobileGreet.classList.remove('greetingMobile');
                mobileGreet.classList.add('d-none');
                mainContent.classList.remove('d-none');
                mainContent.style.display = 'block';
            }, 3000);
        }
    }
    handleWindowSizeChange();
    window.addEventListener('resize', handleWindowSizeChange);
}