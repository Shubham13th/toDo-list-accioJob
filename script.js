const itemName = document.getElementById('itemName');
const itemDeadline = document.getElementById('itemDeadline');
const priority = document.getElementById('priority');
const todoForm = document.getElementById('todoForm');

const todayTodoList = document.getElementById('todayTodoList');
const futureTodoList = document.getElementById('futureTodoList');
const completedTodoList = document.getElementById('completedTodoList');

// Load existing items from localStorage
let todos = JSON.parse(localStorage.getItem('todos')) || [];

const priorityOrder = {
    "High": 1,
    "Medium": 2,
    "Low": 3
};

function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

itemDeadline.addEventListener('focus', () => {
    itemDeadline.type = 'date';
})

itemDeadline.addEventListener('blur', () => {
    itemDeadline.type = 'text';
})



// Function to create a list item in the DOM
function createListItem(todo) {
    const listItem = document.createElement('li');
    listItem.classList.add('list-item');
    listItem.innerHTML = `
        <p>${todo.taskName}</p>
        <p>${todo.deadline}</p>
        <p>${todo.priority}</p>
        <i class="fas fa-check complete" title="Mark as completed"></i>
        <i class="fas fa-trash delete" title="Delete item"></i>
    `;

    // Append to correct section
    if (todo.completed) {
        listItem.classList.add('completed');
        listItem.querySelector('.complete').style.display = 'none';
        completedTodoList.appendChild(listItem);
    } else {
        const selectedDate = new Date(todo.deadline);
        selectedDate.setHours(0, 0, 0, 0);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate.getTime() === today.getTime()) {
            todayTodoList.appendChild(listItem);
        } else {
            futureTodoList.appendChild(listItem);
        }
    }

    // Complete functionality
    const completeIcon = listItem.querySelector('.complete');
    completeIcon.addEventListener('click', () => {
        todo.completed = true;
        listItem.classList.add('completed');
        completedTodoList.appendChild(listItem);
        completeIcon.style.display = 'none';
        saveTodos();
    });

    // Delete functionality
    const deleteIcon = listItem.querySelector('.delete');
    deleteIcon.addEventListener('click', () => {
        todos = todos.filter(t => t !== todo);
        listItem.remove();
        saveTodos();
    });
}


function sortTodos(todoArray) {
    return todoArray.sort((a, b) => {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
}

function renderTodos() {
    // Clear existing lists
    todayTodoList.innerHTML = '';
    futureTodoList.innerHTML = '';
    completedTodoList.innerHTML = '';

    // Sort before rendering
    let sortedTodos = sortTodos([...todos]);

    sortedTodos.forEach(todo => createListItem(todo));
}



renderTodos();

todoForm.addEventListener('submit', (event) => {
    event.preventDefault();

    let selectedDate = new Date(itemDeadline.value);
    selectedDate.setHours(0, 0, 0, 0);

    let today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!itemName.value || !itemDeadline.value || !priority.value) {
        alert("Please fill all the fields");
        return;
    }

    if (selectedDate < today) {
        alert("Please enter a valid deadline");
        return;
    }

    const todoItem = {
        taskName: itemName.value,
        deadline: itemDeadline.value,
        priority: priority.value,
        completed: false
    }

    todos.push(todoItem);
    saveTodos();
    renderTodos();   // re-render sorted todos


    // Clear input fields
    itemName.value = '';
    itemDeadline.value = '';
    priority.value = '';
});
