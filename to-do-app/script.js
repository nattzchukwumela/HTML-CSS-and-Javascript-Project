// Open or create the IndexedDB database
let db;
const request = indexedDB.open('todoDB', 1);

request.onupgradeneeded = function(event) {
    db = event.target.result;
    const objectStore = db.createObjectStore('todos', { keyPath: 'id' });
    objectStore.createIndex('text', 'text', { unique: false });
    objectStore.createIndex('completed', 'completed', { unique: false });
};

request.onsuccess = function(event) {
    db = event.target.result;
    renderTodos(); // Render todos after database is ready
};

request.onerror = function(event) {
    console.error('Database error:', event.target.errorCode);
};

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

    // Add to IndexedDB
    const transaction = db.transaction(['todos'], 'readwrite');
    const objectStore = transaction.objectStore('todos');
    objectStore.add(todo);

    transaction.oncomplete = function() {
        console.log('Todo added:', todo);
        renderTodos();
    };

    transaction.onerror = function(event) {
        console.error('Transaction error:', event.target.errorCode);
    };
    
    // Clear input
    input.value = '';
}

// Function to toggle todo completion status
function toggleTodo(id) {
    const transaction = db.transaction(['todos'], 'readwrite');
    const objectStore = transaction.objectStore('todos');
    const request = objectStore.get(id);

    request.onsuccess = function(event) {
        const todo = event.target.result;
        todo.completed = !todo.completed;
        const updateRequest = objectStore.put(todo);
        
        updateRequest.onsuccess = function() {
            renderTodos();
        };

        updateRequest.onerror = function(event) {
            console.error('Update error:', event.target.errorCode);
        };
    };

    request.onerror = function(event) {
        console.error('Request error:', event.target.errorCode);
    };
}

// Function to delete a todo
function deleteTodo(id) {
    const transaction = db.transaction(['todos'], 'readwrite');
    const objectStore = transaction.objectStore('todos');
    const request = objectStore.delete(id);

    request.onsuccess = function() {
        renderTodos();
    };

    request.onerror = function(event) {
        console.error('Delete error:', event.target.errorCode);
    };
}

// Function to render todos to DOM
function renderTodos() {
    const todoList = document.getElementById('todoList');
    todoList.innerHTML = '';

    const transaction = db.transaction(['todos'], 'readonly');
    const objectStore = transaction.objectStore('todos');
    const request = objectStore.openCursor();

    request.onsuccess = function(event) {
        const cursor = event.target.result;
        if (cursor) {
            const todo = cursor.value;
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

            cursor.continue();
        }
    };

    request.onerror = function(event) {
        console.error('Cursor error:', event.target.errorCode);
    };
}

// Add enter key support for input
document.getElementById('todoInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTodo();
    }
});

// register service worker

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/serviceworker.js')
        .then(registration => {
          console.log('ServiceWorker registration successful');
        })
        .catch(err => {
          console.log('ServiceWorker registration failed: ', err);
        });
    });
  }