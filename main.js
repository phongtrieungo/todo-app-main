const newTodoInput = document.querySelector('#new-todo-input');
const tasksDOM = document.body.querySelector('#tasks');
const filterSection = document.body.querySelector('#filter-section');
const filterList = document.body.querySelectorAll('.item');
const numberOfLeftItem = document.body.querySelector('#clear-item-left');
const clearCompleted = document.body.querySelector('#clear-completed');

const removeItem = (child, id) => {
    let todoArray = JSON.parse(localStorage.getItem('todos'));
    todoArray = todoArray.filter(item => item.id !== id);
    localStorage.setItem('todos', JSON.stringify(todoArray));
    tasksDOM.removeChild(child);
    if (!todoArray.length) {
        filterSection.classList.add('hide');
    }
};

const markCompleted = (taskIcon, text, id) => {
    const replacedIcon = document.createElement('img');
    replacedIcon.src = './images/icon-check.svg';
    replacedIcon.classList.add('task-check-status');

    taskIcon.replaceWith(replacedIcon);
    text.classList.add('completed-status');

    let todoArray = JSON.parse(localStorage.getItem('todos'));
    todoArray = todoArray.map(item => {
        if (item.id === id) {
            return { ...item, status: 'Completed'}
        }
        return item;
    });
    localStorage.setItem('todos', JSON.stringify(todoArray));
}

const createTaskItemElement = (item) => {
    const li = document.createElement('li');
    const content = document.createElement('span');
    const text = document.createElement('p');
    const remove = document.createElement('img');
    let taskIcon = null;

    if (item.status === 'Active') {
        taskIcon = document.createElement('span');
        taskIcon.classList.add('circle')
    } else {
        taskIcon = document.createElement('img');
        taskIcon.src = './images/icon-check.svg';
        taskIcon.classList.add('task-check-status');
    }

    li.classList.add('task-list-item');
    content.classList.add('content');
    text.innerHTML = item.content;
    if (item.status === 'Completed') {
        text.classList.add('completed-status');
    }
    remove.src = './images/icon-cross.svg';
    content.appendChild(taskIcon);
    content.appendChild(text);
    li.appendChild(content);
    li.appendChild(remove);
    li.dataset.id = item.id;
    
    taskIcon.addEventListener('click', () => markCompleted(taskIcon, text, item.id));
    remove.addEventListener('click', () => removeItem(li, item.id));
    return li;
};

const loadTasks = (status = 'All') => {
    const todoArray = JSON.parse(localStorage.getItem('todos'));
    if (todoArray.length) {
        filterSection.classList.remove('hide');
        numberOfLeftItem.innerHTML = todoArray.filter(item => item.status === 'Active').length.toString();
    } else {
        filterSection.classList.add('hide');
        numberOfLeftItem.innerHTML = todoArray.length.toString();
    }

    while(tasksDOM.firstChild) {
        tasksDOM.removeChild(tasksDOM.firstChild);
    }
    
    todoArray?.forEach(item => {
        if (status === 'All') {
            const taskItemDOM = createTaskItemElement(item);
            tasksDOM.appendChild(taskItemDOM);
            return;
        }

        if (item.status === status) {
            const taskItemDOM = createTaskItemElement(item);
            tasksDOM.appendChild(taskItemDOM);
        } 
    });
    
};

newTodoInput.addEventListener('keydown', (event) => {
    if (event.keyCode == 13) {
        let newTodo = {
            content: newTodoInput.value,
            status: 'Active'
        };

        if (localStorage.getItem('todos')) {
            
            const todoArray = JSON.parse(localStorage.getItem('todos'));
            newTodo = {...newTodo, id: todoArray.length + 1}
            todoArray.push(newTodo);
            localStorage.setItem('todos', JSON.stringify(todoArray));

            const taskItemDOM = createTaskItemElement(newTodo);
            tasksDOM.appendChild(taskItemDOM);
        } else {
            const todoArray = [];
            todoArray.push({...newTodo, id: 1});
            localStorage.setItem('todos', JSON.stringify(todoArray));
        }

        newTodoInput.value = '';
        filterSection.classList.remove('hide');
    }
});

filterList.forEach(filterItem => {
    filterItem.addEventListener('click', e => {
        filterList.forEach(item => item.classList.remove('text-primary'));
        filterItem.classList.add('text-primary');
        loadTasks(e.target.innerHTML);
    });
});

clearCompleted.addEventListener('click', () => {
    const todoArray = JSON.parse(localStorage.getItem('todos')).filter(item => item.status === 'Active');
    while(tasksDOM.firstChild) {
        tasksDOM.removeChild(tasksDOM.firstChild);
    }
    
    todoArray?.forEach(item => {
        const taskItemDOM = createTaskItemElement(item);
        tasksDOM.appendChild(taskItemDOM);
    });

    localStorage.setItem('todos', JSON.stringify(todoArray));
});

loadTasks();