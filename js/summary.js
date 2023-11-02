/**
 * funtion to load all tasks from remote
 * 
 *
 * 
 */
async function loadAllTasks() {
  
}

async function tasksCount() {
    tasks = JSON.parse(await getItem('tasks'));
    let todo = 0;
    let done = 0;
    let inprogress =0;
    let feedback = 0;
    let tasksOnBoard = tasks.length;
    for (let i = 0; i < tasks.length; i++) {
        const item = tasks[i].progress;
        if (item === 'todo'){
            todo++
        }
        if (item === 'done'){
            done++
        }
        if (item === 'inprogress'){
            inprogress++;
        }
        if (item === 'done'){   
            feedback++;
        }
    }
    alert("To Do " + todo);
    alert("done " + done);
    alert("Tasks on Board " + tasksOnBoard);
    alert("In Progress " + inprogress);
    alert("awaiting Feedback " + feedback);
}