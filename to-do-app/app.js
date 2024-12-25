// Array to store todo items
let todos = [];

// Function to add a new todo
function addTodo() {
    const input = document.getElementById('todoInput');
    const text = input.value.trim();
    
    // Validate input
    if (text === '') return;

    // Create new todo object
    const todo = {
        id: Date.now(),
        text: text,
        completed: false
    };

    // Add to todos array
    todos.push(todo);
    
    // Clear input
    input.value = '';
    
    // Update display
    renderTodos();
}

// Function to toggle todo completion status
function toggleTodo(id) {
    todos = todos.map(todo => 
        todo.id === id ? {...todo, completed: !todo.completed} : todo
    );
    renderTodos();
}

// Function to delete a todo
function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    renderTodos();
}

// Function to render todos to DOM
function renderTodos() {
    const todoList = document.getElementById('todoList');
    todoList.innerHTML = '';

    todos.forEach(todo => {
        const div = document.createElement('div');
        div.className = 'todo-item';
        
        // Create checkbox for completion status
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = todo.completed;
        checkbox.onclick = () => toggleTodo(todo.id);

        // Create text span
        const span = document.createElement('span');
        span.textContent = todo.text;
        span.className = todo.completed ? 'completed' : '';
        
        // Create delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.onclick = () => deleteTodo(todo.id);
        deleteBtn.style.marginLeft = 'auto';

        // Append elements
        div.appendChild(checkbox);
        div.appendChild(span);
        div.appendChild(deleteBtn);
        todoList.appendChild(div);
    });
}

// Add enter key support for input
document.getElementById('todoInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTodo();
    }
});