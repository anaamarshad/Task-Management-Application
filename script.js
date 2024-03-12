document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('taskForm');
    const input = document.getElementById('taskInput');
    const taskList = document.getElementById('taskList');

    form.addEventListener('submit', e => {
        e.preventDefault();
        const taskText = input.value.trim();
        if (taskText) {
            addTaskToDOM(taskText);
            addTaskToDatabase(taskText); // Add task to the database
            input.value = '';
        }
    });

    function addTaskToDOM(text) {
        const taskElement = document.createElement('li');
        taskElement.textContent = text;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = function() {
            taskElement.remove();
            deleteTaskFromDatabase(text); // Delete task from the database
        };

        const completeButton = document.createElement('button');
        completeButton.textContent = 'Complete';
        completeButton.onclick = function() {
            taskElement.classList.toggle('complete');
            updateTaskInDatabase(text, !taskElement.classList.contains('complete')); // Update task completion status in the database
        };

        taskElement.appendChild(completeButton);
        taskElement.appendChild(deleteButton);
        taskList.appendChild(taskElement);
    }

    // Function to add task to the database
    function addTaskToDatabase(text) {
        fetch('/tasks.db', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text, completed: false }) // Assuming all tasks are initially not completed
        })
        .then(response => response.json())
        .then(data => console.log('Task added to database:', data))
        .catch(error => console.error('Error adding task to database:', error));
    }

    // Function to load tasks from the server and add them to the DOM
    function loadTasks() {
        fetch('/tasks.db')
            .then(response => response.json())
            .then(tasks => {
                tasks.forEach(task => addTaskToDOM(task.text));
            })
            .catch(error => console.error('Error loading tasks from database:', error));
    }

    // Function to delete task from the database
    function deleteTaskFromDatabase(text) {
        fetch('/tasks.db', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete task');
            }
            console.log('Task deleted from database');
        })
        .catch(error => console.error('Error deleting task from database:', error));
    }

    // Function to update task completion status in the database
    function updateTaskInDatabase(text, completed) {
        fetch('/tasks.db', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text, completed })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update task');
            }
            console.log('Task updated in database');
        })
        .catch(error => console.error('Error updating task in database:', error));
    }

    loadTasks(); // Load tasks from the database when the page loads
});
