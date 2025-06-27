document.addEventListener('DOMContentLoaded', loadTasks);

function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  document.getElementById('taskList').innerHTML = '';
  document.getElementById('completedTaskList').innerHTML = '';

  tasks.forEach(task => {
    createTaskElement(task.text, task.priority, task.dueDate, task.completed);
  });
}

function addTask() {
  const taskInput = document.getElementById('taskInput');
  const taskText = taskInput.value.trim();
  const priority = document.getElementById('prioritySelect').value;
  const dueDate = document.getElementById('dueDate').value;

  if (taskText === '') {
    alert("Please enter a task.");
    return;
  }

  createTaskElement(taskText, priority, dueDate, false);
  saveTask(taskText, priority, dueDate, false);

  taskInput.value = '';
  document.getElementById('dueDate').value = '';
}

function createTaskElement(text, priority, dueDate, completed) {
  const targetList = completed ? document.getElementById('completedTaskList') : document.getElementById('taskList');
  const li = document.createElement('li');
  li.className = 'list-group-item d-flex justify-content-between align-items-start flex-column flex-sm-row';

  const leftDiv = document.createElement('div');
  const taskTitle = document.createElement('span');
  taskTitle.textContent = text;
  taskTitle.classList.add(`priority-${priority}`);
  if (completed) taskTitle.classList.add('completed');
  taskTitle.style.cursor = 'pointer';

  taskTitle.onclick = () => {
    taskTitle.classList.toggle('completed');
    updateTasks();
    loadTasks();
  };

  const smallDate = document.createElement('small');
  if (dueDate) {
    smallDate.textContent = `Due: ${dueDate}`;
    smallDate.classList.add('text-muted', 'd-block');
  }

  leftDiv.appendChild(taskTitle);
  if (dueDate) leftDiv.appendChild(smallDate);

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'btn btn-sm btn-danger mt-2 mt-sm-0';
  deleteBtn.innerHTML = '&times;';
  deleteBtn.onclick = () => {
    li.remove();
    updateTasks();
    loadTasks();
  };

  li.appendChild(leftDiv);
  li.appendChild(deleteBtn);
  targetList.appendChild(li);
}

function saveTask(text, priority, dueDate, completed) {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.push({ text, priority, dueDate, completed });
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function updateTasks() {
  const allItems = [...document.querySelectorAll('#taskList li'), ...document.querySelectorAll('#completedTaskList li')];
  const tasks = [];

  allItems.forEach(li => {
    const span = li.querySelector('span');
    const small = li.querySelector('small');
    const text = span.textContent;
    const priority = span.classList.contains('priority-high') ? 'high' :
                     span.classList.contains('priority-medium') ? 'medium' : 'low';
    const dueDate = small ? small.textContent.replace('Due: ', '') : '';
    const completed = span.classList.contains('completed');
    tasks.push({ text, priority, dueDate, completed });
  });

  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function clearAll() {
  localStorage.removeItem('tasks');
  loadTasks();
}

function clearCompleted() {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  const filtered = tasks.filter(task => !task.completed);
  localStorage.setItem('tasks', JSON.stringify(filtered));
  loadTasks();
}

function searchTasks(query) {
  const allItems = document.querySelectorAll('#taskList li, #completedTaskList li');
  allItems.forEach(item => {
    const text = item.querySelector('span').textContent.toLowerCase();
    item.style.display = text.includes(query.toLowerCase()) ? '' : 'none';
  });
}
