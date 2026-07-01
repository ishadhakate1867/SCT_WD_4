const taskInput = document.getElementById("taskInput");
const description = document.getElementById("description");
const taskDate = document.getElementById("taskDate");
const taskTime = document.getElementById("taskTime");
const priority = document.getElementById("priority");
const category = document.getElementById("category");
const taskList = document.getElementById("taskList");
const searchInput = document.getElementById("searchInput");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");
const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");

// Load Tasks
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let currentFilter = "all";

// Save Tasks
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Update Statistics
function updateStats() {

    let total = tasks.length;

    let completed = tasks.filter(task => task.completed).length;

    let pending = total - completed;

    totalTasks.textContent = total;
    completedTasks.textContent = completed;
    pendingTasks.textContent = pending;

    let percent = total === 0 ? 0 : Math.round((completed / total) * 100);

    progressBar.value = percent;
    progressText.textContent = percent + "%";
}

// Render Tasks
function renderTasks() {

    taskList.innerHTML = "";

    let keyword = searchInput.value.toLowerCase();

    tasks.forEach((task, index) => {

        if (
            keyword &&
            !task.title.toLowerCase().includes(keyword)
        ) return;

        if (
            currentFilter === "completed" &&
            !task.completed
        ) return;

        if (
            currentFilter === "pending" &&
            task.completed
        ) return;

        let li = document.createElement("li");

        li.className = "task";

        if (task.completed)
            li.classList.add("completed");

        let priorityClass = task.priority.toLowerCase();

        li.innerHTML = `

        <h3>${task.favorite ? "⭐ " : ""}${task.title}</h3>

        <p>${task.description}</p>

        <p><strong>Date:</strong> ${task.date}</p>

        <p><strong>Time:</strong> ${task.time}</p>

        <p><strong>Category:</strong> ${task.category}</p>

        <span class="priority ${priorityClass}">
        ${task.priority}
        </span>

        <div class="task-buttons">

            <button class="complete-btn"
            onclick="toggleComplete(${index})">

            ${
                task.completed
                ? "Undo"
                : "Complete"
            }

            </button>

            <button class="edit-btn"
            onclick="editTask(${index})">

            Edit

            </button>

            <button class="favorite-btn"
            onclick="favoriteTask(${index})">

            ⭐

            </button>

            <button class="delete-btn"
            onclick="deleteTask(${index})">

            Delete

            </button>

        </div>

        `;

        taskList.appendChild(li);

    });

    updateStats();
}

// Add Task
function addTask() {

    if (taskInput.value.trim() === "") {

        alert("Please enter a task.");

        return;

    }

    const task = {

        title: taskInput.value,

        description: description.value,

        date: taskDate.value,

        time: taskTime.value,

        priority: priority.value,

        category: category.value,

        completed: false,

        favorite: false

    };

    tasks.push(task);

    saveTasks();

    renderTasks();

    taskInput.value = "";
    description.value = "";
    taskDate.value = "";
    taskTime.value = "";
    priority.value = "Low";
    category.value = "Personal";
}

// Initial Load
renderTasks();

function toggleComplete(index) {

    tasks[index].completed = !tasks[index].completed;

    saveTasks();
    renderTasks();
}

// Delete Task
function deleteTask(index) {

    if(confirm("Are you sure you want to delete this task?")){

        tasks.splice(index,1);

        saveTasks();
        renderTasks();
    }
}

// Edit Task
function editTask(index){

    let task = tasks[index];

    let newTitle = prompt("Edit Task Title", task.title);

    if(newTitle === null) return;

    let newDescription = prompt(
        "Edit Description",
        task.description
    );

    if(newDescription === null)
        newDescription = task.description;

    task.title = newTitle.trim() || task.title;
    task.description = newDescription;

    saveTasks();
    renderTasks();
}

// Favorite Task
function favoriteTask(index){

    tasks[index].favorite =
        !tasks[index].favorite;

    // Move favorite tasks to top
    tasks.sort((a,b)=>b.favorite-a.favorite);

    saveTasks();
    renderTasks();
}

// Search Tasks
searchInput.addEventListener("keyup",function(){

    renderTasks();

});

// Filter Buttons
const filterButtons =
document.querySelectorAll(".filter-btn");

filterButtons.forEach(button=>{

    button.addEventListener("click",function(){

        // Remove active class
        filterButtons.forEach(btn=>
            btn.classList.remove("active")
        );

        this.classList.add("active");

        currentFilter =
        this.dataset.filter;

        renderTasks();

    });

});

// Sort Tasks by Priority
function sortByPriority(){

    const order={
        High:3,
        Medium:2,
        Low:1
    };

    tasks.sort((a,b)=>
        order[b.priority]-order[a.priority]
    );

    saveTasks();
    renderTasks();

}

// Sort Tasks by Date
function sortByDate(){

    tasks.sort((a,b)=>{

        let dateA=new Date(
            a.date+" "+a.time
        );

        let dateB=new Date(
            b.date+" "+b.time
        );

        return dateA-dateB;

    });

    saveTasks();
    renderTasks();

}

// Theme Button
const themeBtn = document.getElementById("themeBtn");

// Load Theme
if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    themeBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
}

// Toggle Theme
themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {

        localStorage.setItem("theme", "dark");

        themeBtn.innerHTML =
            '<i class="fa-solid fa-sun"></i>';

    } else {

        localStorage.setItem("theme", "light");

        themeBtn.innerHTML =
            '<i class="fa-solid fa-moon"></i>';
    }

});

// Add Task Button
document
.getElementById("addTaskBtn")
.addEventListener("click", addTask);

// Press Enter to Add Task
taskInput.addEventListener("keypress", function (e) {

    if (e.key === "Enter") {

        e.preventDefault();

        addTask();

    }

});

// Clear Completed Tasks
document
.getElementById("clearCompleted")
.addEventListener("click", function () {

    if (!confirm("Delete all completed tasks?"))
        return;

    tasks = tasks.filter(task => !task.completed);

    saveTasks();

    renderTasks();

});

// Clear All Tasks
document
.getElementById("clearAll")
.addEventListener("click", function () {

    if (!confirm("Delete all tasks?"))
        return;

    tasks = [];

    saveTasks();

    renderTasks();

});

// Highlight Overdue Tasks
function highlightOverdue() {

    const cards =
        document.querySelectorAll(".task");

    cards.forEach((card, index) => {

        const task = tasks[index];

        if (!task.date) return;

        const dueDate =
            new Date(task.date + " " + task.time);

        const now = new Date();

        if (!task.completed && dueDate < now) {

            card.style.borderLeft =
                "6px solid red";

        } else {

            card.style.borderLeft =
                "6px solid limegreen";

        }

    });

}

// Update UI Every Minute
setInterval(() => {

    highlightOverdue();

}, 60000);

// Initial Startup
window.onload = function () {

    renderTasks();

    highlightOverdue();

};

// Optional: Sort by Priority on Double Click
document
.getElementById("priority")
.addEventListener("dblclick", function () {

    sortByPriority();

});

// Optional: Sort by Date on Double Click
document
.getElementById("taskDate")
.addEventListener("dblclick", function () {

    sortByDate();

});

// Save Before Closing
window.addEventListener("beforeunload", function () {

    saveTasks();

});