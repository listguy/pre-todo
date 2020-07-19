//function that create a string containing the current date and time
function timeString() {
  let time = new Date();
  let createTime = `${time.getFullYear()}-${
    time.getMonth() + 1
  }-${time.getDate()} ${time.getHours()}:${
    time.getMinutes() > 10 ? time.getMinutes() : `0${time.getMinutes()}`
  }:${time.getSeconds() > 10 ? time.getSeconds() : `0${time.getSeconds()}`}`;
  return createTime;
}

//function that gets task description and priority, and create new task div
function CreateNewTask(task, prio) {
  //creating div for new task
  let newTask = document.createElement("div");
  newTask.className = "todoContainer";

  //creating check-box for the task
  let taskCheck = document.createElement("input");
  taskCheck.setAttribute("type", "checkbox");
  taskCheck.className = "taskCheck";

  //creating to-do span containing the task description
  let todo = document.createElement("span");
  todo.innerText = task;
  todo.className = "todoText";

  //creating Date span containing task creation time
  let taskTime = document.createElement("span");
  taskTime.innerText = timeString();
  taskTime.className = "todoCreatedAt";

  //creating priority span
  let taskPriority = document.createElement("span");
  taskPriority.innerText = prio;
  taskPriority.className = `todoPriority`;
  taskPriority.setAttribute("color", `taskPriority${prio}`);

  //increasing tasks counter
  taskCounter++;
  document.querySelector("#counter").innerText = `${taskCounter}`;

  //appending spans to task div
  newTask.appendChild(taskCheck);
  newTask.appendChild(todo);
  newTask.appendChild(taskTime);
  newTask.appendChild(taskPriority);

  return newTask;
}

function taskValidation(task, prio) {
  let Alert = document.querySelector("#alert");
  Alert.innerText = "";
  if (task.length === 0) {
    Alert.innerText += "Enter Task";
    return false;
  }
  if (prio === "") {
    Alert.innerHTML += "Enter Priority";
    return false;
  }
  return true;
}

//function to add new task to the view section
function AddTask() {
  let viewSection = document.querySelector("#ViewSection");
  let taskDescription = document.querySelector("#textInput");
  let taskPriority = document.querySelector("#prioritySelector");
  if (taskValidation(taskDescription.value, taskPriority.value)) {
    viewSection.appendChild(
      CreateNewTask(taskDescription.value, taskPriority.value)
    );
    taskDescription.value = "";
    taskPriority.value = "";
    taskDescription.focus();
  }
}

//function that removes checked items
function taskCheck(event) {
  if (event.target.checked) {
    let fatherDiv = event.target.closest("div");
    taskCounter--;
    document.querySelector("#counter").innerText = `${taskCounter}`;

    //inserting element to completed tasks section
    let compList = document.querySelector('#completedTasks');
    compList.appendChild(fatherDiv);
    fatherDiv.querySelector('.todoCreatedAt').hidden = true;
  }
}

//function hat sorts the list
function sortList() {
  let list = document.querySelector("#ViewSection");
  let listItems = list.querySelectorAll("div");
  for (let i = 1; i <= 5; i++) {
    listItems.forEach(function (item) {
      if (item.querySelector(".todoPriority").innerText === i.toString()) {
        list.insertBefore(item, list.firstChild);
      }
    });
  }
}

//function that search the pattern in the search ox in all tasks
function searchTask(event) {
  let search = event.target.value;
  // removing current searches if search input is empty
  if (search === "") {
    let list1 = document.querySelector("#ViewSection");
    let listItems1 = list1.querySelectorAll("div");
    for (let i = 0; i < listItems1.length; i++) {
      let task1 = listItems1[i].querySelector("span");
      task1.innerHTML = task1.innerText;
    }
    return;
  }
  // highlighting and reorganizing according to search
  let searchKey = `(${search})+`;
  searchKey = new RegExp(searchKey, "ig");
  let list = document.querySelector("#ViewSection");
  let listItems = list.querySelectorAll("div");
  for (let i = 0; i < listItems.length; i++) {
    let task = listItems[i].querySelector("span");
    let repTask = task.innerText.replace(
      searchKey,
      `<span class='highlight'>${search}</span>`
    );
    task.innerHTML = repTask;
    if (list[0] !== listItems[i] && searchKey.test(task.innerText)) {
      list.insertBefore(listItems[i], list.firstChild);
    }
  }
}

// tasks counter deceleration
let taskCounter = 0;

// add event listener to add new task
let addTaskButton = document.querySelector("#addButton");
addTaskButton.addEventListener("click", AddTask);

//add event listener to remove task when checked
let tasksList = document.querySelector("#ViewSection");
tasksList.addEventListener("change", taskCheck);

//add event listener to sort the list
let sortButton = document.querySelector("#sortButton");
sortButton.addEventListener("click", sortList);

//add event listener to type in search box
let searchBar = document.querySelector("#searchInput");
searchBar.addEventListener("input", searchTask);
