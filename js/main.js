const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const tasksList = document.querySelector('#tasksList');
const emptyList = document.querySelector('#emptyList');

let tasks = [];

if (localStorage.getItem('tasks')) {
    tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks.forEach((task) => renderTask(task));
}

checkEmptyList();

form.addEventListener('submit', addTask);
tasksList.addEventListener('click', deleteTask);
tasksList.addEventListener('click', doneTask);

function addTask(event) {
    // cancel form submission
    event.preventDefault();

    // get the text of the task from the input field
    const taskText = taskInput.value;

    // describe the task as an object
    const newTask = {
        id: Date.now(),
        text: taskText,
        done: false,
    };

    // add a task to the array with tasks
    tasks.push(newTask);

    // save the list of tasks in the browser's LocalStorage
    saveToLocalStorage();

    renderTask(newTask);

    // clear the input field and return focus to it
    taskInput.value = '';
    taskInput.focus();

    checkEmptyList();
}

function deleteTask(event) {
    // check if the click was NOT on the "delete task" button
    if (event.target.dataset.action !== 'delete') return;

    // check that the click was on the "delete task" button
    const parentNode = event.target.closest('.list-group-item');

    // determine the task ID
    const id = Number(parentNode.id);

    // delete the task through array filtering
    tasks = tasks.filter((task) => task.id !== id);

    // save the list of tasks in the browser's LocalStorage
    saveToLocalStorage();

    // remove the task from the markup
    parentNode.remove();

    checkEmptyList();
}

function doneTask(event) {
    // checking that the click was NOT on the "task completed" button
    if (event.target.dataset.action !== 'done') return;

    // check that the click was on the "task completed" button
    const parentNode = event.target.closest('.list-group-item');

    // determine the task ID
    const id = Number(parentNode.id);
    const task = tasks.find((task) => task.id === id);
    task.done = !task.done; // changes the value of the done key in the array to true when you click on the checkmark that the task is completed

    // save the list of tasks in the browser's LocalStorage
    saveToLocalStorage();

    const taskTitle = parentNode.querySelector('.task-title');
    taskTitle.classList.toggle('task-title--done');
}

function checkEmptyList() {
    if (tasks.length === 0) {
        const emptyListHTML = `
            <li id="emptyList" class="list-group-item empty-list">
                <img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
                <div class="empty-list__title">To-do list is empty</div>
            </li>`;
        tasksList.insertAdjacentHTML('afterbegin', emptyListHTML);
    }

    if (tasks.length > 0) {
        const emptyListEl = document.querySelector('#emptyList');
        emptyListEl ? emptyListEl.remove() : null;
    }
}

function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTask(task) {
    // form the CSS class
    const cssClass = task.done ? 'task-title task-title--done' : 'task-title';

    // generate markup for a new task
    const taskHTML = `
        <li id="${task.id}"class="list-group-item d-flex justify-content-between task-item">
            <span class="${cssClass}">${task.text}</span>
            <div class="task-item__buttons">
                <button type="button" data-action="done" class="btn-action">
                    <img src="./img/tick.svg" alt="Done" width="18" height="18">
                </button>
                <button type="button" data-action="delete" class="btn-action">
                    <img src="./img/cross.svg" alt="Done" width="18" height="18">
                </button>
            </div>
        </li>`;

    // add task to page
    tasksList.insertAdjacentHTML('beforeend', taskHTML);
}
