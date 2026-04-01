const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');

let todos = JSON.parse(localStorage.getItem('todos')) || [];


function loadTodos() {
    todoList.innerHTML = '';
    todos.forEach((todo, index) => {
        addTodoToList(todo, index);
    });
}

function addTodoToList(todo, index) {
    const li = document.createElement('li');
    li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
    li.innerHTML = `
        <input type="checkbox" ${todo.completed ? 'checked' : ''} onchange="toggleTodo(${index})">
        <span>${todo.text}</span>
        <button class="delete-btn" onclick="deleteTodo(${index})">Delete</button>
    `;
    todoList.appendChild(li);
}

function addTodo() {
    const text = todoInput.value.trim();
    if (text === '') return;

    todos.push({ text, completed: false });
    localStorage.setItem('todos', JSON.stringify(todos));
    todoInput.value = '';
    loadTodos();
}

function toggleTodo(index) {
    todos[index].completed = !todos[index].completed;
    localStorage.setItem('todos', JSON.stringify(todos));
    loadTodos();
}

function deleteTodo(index) {
    todos.splice(index, 1);
    localStorage.setItem('todos', JSON.stringify(todos));
    loadTodos();
}


addBtn.addEventListener('click', addTodo);
todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTodo();
});


loadTodos();
