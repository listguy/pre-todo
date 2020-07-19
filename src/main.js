//function that create a string containing the current date and time
function timeString(){
    let time = new Date();
    let createTime = `added at: ${time.getDate()}/${time.getMonth() + 1}/${time.getFullYear()} ${time.getHours()}:${time.getMinutes()}`;
    return createTime;
}


//function that gets task description and priority, and create new task div
function CreateNewTask(task, prio){

    //creating div for new task
    let newTask = document.createElement('div');
    newTask.className = 'todoContainer';

    //creating check-box for the task
    let taskCheck = document.createElement('input');
    taskCheck.setAttribute('type', 'checkbox');
    taskCheck.className = 'taskCheck';

    //creating to-do span containing the task description
    let todo = document.createElement('span');
    todo.innerText = task;
    todo.className = 'todoText';

    //creating Date span containing task creation time
    let taskTime = document.createElement('span');
    taskTime.innerText = timeString();
    taskTime.className='taskTime'

    //creating priority span
    let taskPriority = document.createElement('span');
    taskPriority.innerText = prio;
    taskPriority.className=`todoPriority`;
    taskPriority.setAttribute('color', `taskPriority${prio}`);


    //appending spans to task div
    newTask.appendChild(taskCheck);
    newTask.appendChild(todo);
    newTask.appendChild(taskTime);
    newTask.appendChild(taskPriority);
    return newTask;
}

function AddTask(){
    let viewSection = document.querySelector('#ViewSection');
    let taskDescription = document.querySelector('#textInput');
    let taskPriority = document.querySelector('#prioritySelector');
    viewSection.appendChild(CreateNewTask(taskDescription.value, taskPriority.value));
    taskDescription.value = '';
    taskPriority.value = '';
    taskDescription.focus();
}








let addTaskButton = document.querySelector('#addButton');
addTaskButton.addEventListener('click', AddTask);