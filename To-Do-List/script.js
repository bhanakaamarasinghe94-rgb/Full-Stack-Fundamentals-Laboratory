// Global State
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

// DOM Elements
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const taskCounter = document.getElementById('taskCounter');
const emptyState = document.getElementById('emptyState');
let errorAlert = document.getElementById('errorAlert');
const clearCompletedBtn = document.getElementById('clearCompletedBtn');

const filterAllBtn = document.getElementById('filterAll');
const filterActiveBtn = document.getElementById('filterActive');
const filterCompletedBtn = document.getElementById('filterCompleted');

// Initial Render
renderTasks();

// Event Listeners
addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addTask();
});

clearCompletedBtn.addEventListener('click', clearCompletedTasks);

filterAllBtn.addEventListener('click', () => setFilter('all', filterAllBtn));
filterActiveBtn.addEventListener('click', () => setFilter('active', filterActiveBtn));
filterCompletedBtn.addEventListener('click', () => setFilter('completed', filterCompletedBtn));

// Function to Add a Task
function addTask() {
  const text = taskInput.value.trim();

  // Task 6: Validate input (must not be empty or only spaces)
  if (text === '') {
    errorAlert.classList.remove('d-none');
    return;
  }
  errorAlert.classList.add('d-none');

  const newTask = {
    id: Date.now(),
    text: text,
    completed: false
  };

  tasks.push(newTask);
  saveAndRender();
  taskInput.value = '';
}

// Function to Toggle Task Completion Status
function toggleTask(id) {
  tasks = tasks.map(task => {
    if (task.id === id) {
      return { ...task, completed: !task.completed };
    }
    return task;
  });
  saveAndRender();
}

// Function to Delete Single Task
function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveAndRender();
}

// Function to Clear All Completed Tasks
function clearCompletedTasks() {
  tasks = tasks.filter(task => !task.completed);
  saveAndRender();
}

// Function to Switch Active Filter Tab
function setFilter(filter, button) {
  currentFilter = filter;
  [filterAllBtn, filterActiveBtn, filterCompletedBtn].forEach(btn => btn.classList.remove('active'));
  button.classList.add('active');
  renderTasks();
}

// Function to Save to LocalStorage and Trigger Re-render
function saveAndRender() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTasks();
}

// Main Render Function
function renderTasks() {
  // Clear Current List
  taskList.innerHTML = '';

  // Filter Tasks based on tab
  let filteredTasks = tasks;
  if (currentFilter === 'active') {
    filteredTasks = tasks.filter(t => !t.completed);
  } else if (currentFilter === 'completed') {
    filteredTasks = tasks.filter(t => t.completed);
  }

  // Toggle Empty State Visibility
  if (filteredTasks.length === 0) {
    emptyState.classList.remove('d-none');
  } else {
    emptyState.classList.add('d-none');
  }

  // Render Filtered Items
  filteredTasks.forEach(task => {
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-center py-2 px-3 border rounded mb-2';

    li.innerHTML = `
      <div class="form-check d-flex align-items-center gap-2 mb-0">
        <input class="form-check-input my-0" type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask(${task.id})">
        <span class="${task.completed ? 'completed-task' : ''}">${escapeHtml(task.text)}</span>
      </div>
      <button class="btn btn-danger btn-sm" onclick="deleteTask(${task.id})">Delete</button>
    `;

    taskList.appendChild(li);
  });

  // Task 8: Update Remaining Active Tasks Counter
  const remainingCount = tasks.filter(t => !t.completed).length;
  taskCounter.textContent = `${remainingCount} remaining`;
}

// Helper utility to sanitize user text input
function escapeHtml(text) {
  const div = document.createElement('div');
  div.innerText = text;
  return div.innerHTML;
}