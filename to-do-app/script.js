// Open or create the IndexedDB database
let db; // Variable to store the database connection
const request = indexedDB.open('todoDB', 1); // Open a new or existing IndexedDB database named 'todoDB' with version 1

// Event handler for database upgrades
request.onupgradeneeded = function(event) {
    db = event.target.result; // Get the database connection
    const objectStore = db.createObjectStore('todos', { keyPath: 'id' }); // Create an object store named 'todos' with 'id' as the primary key
    objectStore.createIndex('text', 'text', { unique: false }); // Create an index on the 'text' property
    objectStore.createIndex('completed', 'completed', { unique: false }); // Create an index on the 'completed' property
};

// Event handler for successful database connection
request.onsuccess = function(event) {
    db = event.target.result; // Get the database connection
    renderTodos(); // Render todos after database is ready
};

// Event handler for database connection errors
request.onerror = function(event) {
    console.error('Database error:', event.target.errorCode); // Log any errors
};

// Function to add a new todo
function addTodo() {
    const input = document.getElementById('todoInput'); // Get the input element
    const text = input.value.trim(); // Get the input value and trim any whitespace
    
    // Validate input
    if (text === '') return;

    // Create new todo object
    const todo = {
        id: Date.now(), // Use the current timestamp as the unique ID
        text: text, // Set the todo text
        completed: false // Set the completed status to false
    };

    // Add to IndexedDB
    const transaction = db.transaction(['todos'], 'readwrite'); // Create a readwrite transaction
    const objectStore = transaction.objectStore('todos'); // Get the 'todos' object store
    objectStore.add(todo); // Add the todo object to the object store

    // Event handler for successful transaction completion
    transaction.oncomplete = function() {
        console.log('Todo added:', todo); // Log the added todo
        renderTodos(); // Render the updated list of todos
    };

    // Event handler for transaction errors
    transaction.onerror = function(event) {
        console.error('Transaction error:', event.target.errorCode); // Log any errors
    };
    
    // Clear input
    input.value = '';
}

// Function to toggle todo completion status
function toggleTodo(id) {
    const transaction = db.transaction(['todos'], 'readwrite'); // Create a readwrite transaction
    const objectStore = transaction.objectStore('todos'); // Get the 'todos' object store
    const request = objectStore.get(id); // Get the todo object by ID

    // Event handler for successful retrieval
    request.onsuccess = function(event) {
        const todo = event.target.result; // Get the retrieved todo object
        todo.completed = !todo.completed; // Toggle the completed status
        const updateRequest = objectStore.put(todo); // Update the todo object in the object store
        
        // Event handler for successful update
        updateRequest.onsuccess = function() {
            renderTodos(); // Render the updated list of todos
        };

        // Event handler for update errors
        updateRequest.onerror = function(event) {
            console.error('Update error:', event.target.errorCode); // Log any errors
        };
    };

    // Event handler for retrieval errors
    request.onerror = function(event) {
        console.error('Request error:', event.target.errorCode); // Log any errors
    };
}

// Function to delete a todo
function deleteTodo(id) {
    const transaction = db.transaction(['todos'], 'readwrite'); // Create a readwrite transaction
    const objectStore = transaction.objectStore('todos'); // Get the 'todos' object store
    const request = objectStore.delete(id); // Delete the todo object by ID

    // Event handler for successful deletion
    request.onsuccess = function() {
        renderTodos(); // Render the updated list of todos
    };

    // Event handler for deletion errors
    request.onerror = function(event) {
        console.error('Delete error:', event.target.errorCode); // Log any errors
    };
}

// Function to render todos to DOM
function renderTodos() {
    const todoList = document.getElementById('todoList'); // Get the todo list element
    todoList.innerHTML = ''; // Clear the existing list

    const transaction = db.transaction(['todos'], 'readonly'); // Create a readonly transaction
    const objectStore = transaction.objectStore('todos'); // Get the 'todos' object store
    const request = objectStore.openCursor(); // Open a cursor to iterate over the todos

    // Event handler for successful cursor operation
    request.onsuccess = function(event) {
        const cursor = event.target.result; // Get the cursor
        if (cursor) {
            const todo = cursor.value; // Get the todo object from the cursor
            const div = document.createElement('div'); // Create a new div element
            div.className = 'todo-item'; // Set the class name for styling
            
            // Create checkbox for completion status
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = todo.completed;
            checkbox.onclick = () => toggleTodo(todo.id); // Add click event to toggle completion status

            // Create text span
            const span = document.createElement('span');
            span.textContent = todo.text;
            span.className = todo.completed ? 'completed' : ''; // Add 'completed' class if todo is completed
            
            // Create delete button
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.onclick = () => deleteTodo(todo.id); // Add click event to delete the todo
            deleteBtn.style.marginLeft = 'auto';

            // Append elements
            div.appendChild(checkbox);
            div.appendChild(span);
            div.appendChild(deleteBtn);
            todoList.appendChild(div);

            cursor.continue(); // Move to the next item in the cursor
        }
    };

    // Event handler for cursor errors
    request.onerror = function(event) {
        console.error('Cursor error:', event.target.errorCode); // Log any errors
    };
}

// Add enter key support for input
document.getElementById('todoInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTodo(); // Add a new todo when Enter key is pressed
    }
});

// Register service worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/serviceworker.js')
            .then(registration => {
                console.log('ServiceWorker registration successful');
            })
            .catch(err => {
                console.log('ServiceWorker registration failed:', err);
            });
    });
}
