//local storage deceleration
let localStorage = window.localStorage;

// tasks counter deceleration
let taskCounter = localStorage.getItem("counter")
  ? localStorage.getItem("counter")
  : 0;
document.querySelector("#counter").innerText = `${taskCounter}`;

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

//add event listener to search bar
let completedTasks = document.querySelector("#completedTasks");
completedTasks.addEventListener("change", returnTask);

//add event listener to clean completed tasks
let cleanButton = document.querySelector("#cleanCompleted");
cleanButton.addEventListener("click", cleanCompleted);



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



// local storage control function
function addToLocalStorage(target, task) {
  let local = localStorage.getItem(target);
  if (local === null) {
    local = "";
  }
  local += task.outerHTML;
  localStorage.setItem(target, local);
}

function removeFromLocalStorage(base, task) {
  let local = localStorage.getItem(base);
  local = local.replace(task.outerHTML, "");
  localStorage.setItem(base, local);
}

function loadFromLocalStorage(base, father) {
  let local = localStorage.getItem(base);
  father.innerText = "";
  if (local !== null) {
    father.innerHTML += local;
    let prio = document.querySelectorAll(".todoPriority");
    for (let i = 0; i < prio.length; i++) {
      prio[i].addEventListener("click", changePriority);
    }
  }
  if (father.id === "completedTasks" && local !== null && local !== "") {
    father.querySelector(".taskCheck").setAttribute("checked", true);
  }
}

// load data from local storage
loadFromLocalStorage("tasks", tasksList);
loadFromLocalStorage("completedTasks", completedTasks);




//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




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

//function that create tooltip containing buttons for priority selection
function createTooltip() {
  let tooltip = document.createElement("span");
  tooltip.className = "tooltip";
  for (let i = 1; i <= 5; i++) {
    let button = document.createElement("button");
    button.className = `prio${i}`;
    button.innerText = i;
    button.addEventListener("click", changePriority);
    tooltip.appendChild(button);
  }

  return tooltip;
}

// function that changes the priority of task according to button click
function changePriority(event) {
  if (event.target.closest("section").id === "completedSection") {
    return;
  }
  let priority = event.target.closest("span").parentElement; //todoPriority element
  let Task = priority.closest("div"); // todoContainer element
  let tasks = localStorage.getItem("tasks"); // tasks local storage
  tasks = tasks.replace(Task.outerHTML, "--$special_identifier$--"); //replace Task with unique symbol

  //create new priority element
  let taskPriority = document.createElement("span");
  taskPriority.innerText = event.target.innerText;
  taskPriority.className = `todoPriority`;
  taskPriority.setAttribute("color", `taskPriority${event.target.innerText}`);
  taskPriority.appendChild(createTooltip());

  Task.replaceChild(taskPriority, priority);
  debugger;
  tasks = tasks.replace("--$special_identifier$--", Task.outerHTML);

  localStorage.setItem("tasks", tasks);
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
  taskPriority.appendChild(createTooltip());

  //increasing tasks counter
  taskCounter++;
  localStorage.setItem("counter", taskCounter);
  document.querySelector("#counter").innerText = `${taskCounter}`;

  //appending spans to task div
  newTask.appendChild(taskCheck);
  newTask.appendChild(todo);
  newTask.appendChild(taskTime);
  newTask.appendChild(taskPriority);

  addToLocalStorage("tasks", newTask);

  newTask.addEventListener("mousedown", mouseDownHandler);

  return newTask;
}

//function making sure input is full - form validation
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
    localStorage.setItem("counter", taskCounter);
    document.querySelector("#counter").innerText = `${taskCounter}`;

    removeFromLocalStorage("tasks", fatherDiv);

    fatherDiv.querySelector(".taskCheck").setAttribute("checked", true);
    //inserting element to completed tasks section
    let compList = document.querySelector("#completedTasks");
    compList.appendChild(fatherDiv);
    fatherDiv.querySelector(".todoCreatedAt").hidden = true;

    addToLocalStorage("completedTasks", fatherDiv);
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

//function to search the pattern in the search box in the view section
function searchTask(event) {
  let search = event.target.value;
  // removing current searches if search input is empty
  if (search === "") {
    let list = document.querySelector("#ViewSection");
    let listItems = list.querySelectorAll("div");
    for (let i = 0; i < listItems.length; i++) {
      let task = listItems[i].querySelector("span");
      task.innerHTML = task.innerText;
    }
    return;
  }
  // highlighting and reorganizing according to search
  let searchKey = `(${search})`;
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

// function that return unchecked tasks from complete section
function returnTask(event) {
  if (!event.target.checked) {
    let fatherDiv = event.target.closest("div");

    removeFromLocalStorage("completedTasks", fatherDiv);

    fatherDiv.querySelector(".taskCheck").removeAttribute("checked");
    fatherDiv.querySelector(".todoCreatedAt").innerText = timeString(); // updating task time
    fatherDiv.querySelector(".todoCreatedAt").hidden = false;
    let tasksList = document.querySelector("#ViewSection");
    tasksList.appendChild(fatherDiv);

    addToLocalStorage("tasks", fatherDiv);

    taskCounter++;
    localStorage.setItem("counter", taskCounter);
    document.querySelector("#counter").innerText = `${taskCounter}`;
  }
}

//function hat cleans completed tasks section
function cleanCompleted() {
  let completedTasks = document.querySelector("#completedTasks");
  let tasks = completedTasks.querySelectorAll("div");
  for (let i = 0; i < tasks.length; i++) {
    tasks[i].remove();
  }
  let compTasks = localStorage.getItem("completedTasks");
  compTasks = "";
  localStorage.setItem("completedTasks", compTasks);
}

//function that delete an element
function deleteElement(elem) {
  elem.closest("section").id === "ViewSection"
    ? delFromView(elem)
    : removeFromLocalStorage("completedTasks", elem);

  function delFromView(elem) {
    //decreasing tasks counter
    taskCounter--;
    localStorage.setItem("counter", taskCounter);
    document.querySelector("#counter").innerText = `${taskCounter}`;
    removeFromLocalStorage("tasks", elem);
  }

  elem.remove();
}



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//dragging elements functions

// The current dragging item
let draggingEle;

// The current position of mouse relative to the dragging element
let x = 0;
let y = 0;

let placeholder;
let isDraggingStarted = false;

const mouseDownHandler = function (e) {
  if (e.target.parentElement.className === "tooltip") {
    return;
  }

  if (e.target.className === "taskCheck") {
    return;
  }
  draggingEle = e.target.closest("div");

  // Calculate the mouse position
  const rect = draggingEle.getBoundingClientRect();
  x = e.pageX - rect.left;
  y = e.pageY - rect.top;

  // Attach the listeners to `document`
  document.addEventListener("mousemove", mouseMoveHandler);
  document.addEventListener("mouseup", mouseUpHandler);
};

const mouseMoveHandler = function (e) {
  // Set position for dragging element
  draggingEle.setAttribute("style", "");
  draggingEle.style.position = "absolute";
  draggingEle.style.top = `${e.pageY - y}px`;
  draggingEle.style.left = `${e.pageX - x}px`;
  draggingEle.style.width = `${
    draggingEle.closest("section").getBoundingClientRect().width - 20
  }px`;

  const draggingRect = draggingEle.getBoundingClientRect();

  if (!isDraggingStarted) {
    // Update the flag
    isDraggingStarted = true;

    // Let the placeholder take the height of dragging element
    // So the next element won't move up
    placeholder = document.createElement("div");
    placeholder.classList.add("placeholder");
    draggingEle.parentNode.insertBefore(placeholder, draggingEle.nextSibling);

    // Set the placeholder's height
    placeholder.style.height = `${draggingRect.height}px`;
  }

  const prevEle = draggingEle.previousElementSibling;
  const nextEle = placeholder.nextElementSibling;

  if (prevEle && isAbove(draggingEle, prevEle)) {
    // The current order    -> The new order
    // prevEle              -> placeholder
    // draggingEle          -> draggingEle
    // placeholder          -> prevEle
    swap(placeholder, draggingEle);
    swap(placeholder, prevEle);
    return;
  }

  if (nextEle && isAbove(nextEle, draggingEle)) {
    // The current order    -> The new order
    // draggingEle          -> nextEle
    // placeholder          -> placeholder
    // nextEle              -> draggingEle
    swap(nextEle, placeholder);
    swap(nextEle, draggingEle);
  }

};

const mouseUpHandler = function (event) {
  if (placeholder.parentNode !== null && placeholder !== null) {
    // Remove the placeholder
    placeholder && placeholder.parentNode.removeChild(placeholder);
  }
  // Reset the flag
  isDraggingStarted = false;

  // Remove the position styles
  draggingEle.style.removeProperty("top");
  draggingEle.style.removeProperty("left");
  draggingEle.style.removeProperty("position");
  draggingEle.style.removeProperty("width");
  draggingEle.removeAttribute("style");

  let garbage = document.querySelector("#trashCan").getBoundingClientRect();
  var mousex = event.clientX; // Get the horizontal coordinate
  var mousey = event.clientY; // Get the vertical coordinate

  if (
    garbage.x < mousex &&
    mousex < garbage.right &&
    garbage.y < mousey &&
    mousey < garbage.bottom
  ) {
    deleteElement(draggingEle);
  }

  x = null;
  y = null;
  draggingEle = null;

  // Remove the handlers of `mousemove` and `mouseup`
  document.removeEventListener("mousemove", mouseMoveHandler);
  document.removeEventListener("mouseup", mouseUpHandler);
};

const list = document.getElementById("ViewSection");

// Query all items
[].slice.call(list.querySelectorAll(".todoContainer")).forEach(function (item) {
  item.addEventListener("mousedown", mouseDownHandler);
});

const isAbove = function (nodeA, nodeB) {
  // Get the bounding rectangle of nodes
  const rectA = nodeA.getBoundingClientRect();
  const rectB = nodeB.getBoundingClientRect();

  return rectA.top + rectA.height / 2 < rectB.top + rectB.height / 2;
};

const swap = function (nodeA, nodeB) {
  const parentA = nodeA.parentNode;
  const siblingA = nodeA.nextSibling === nodeB ? nodeA : nodeA.nextSibling;

  // Move `nodeA` to before the `nodeB`
  nodeB.parentNode.insertBefore(nodeA, nodeB);

  // Move `nodeB` to before the sibling of `nodeA`
  parentA.insertBefore(nodeB, siblingA);
};
