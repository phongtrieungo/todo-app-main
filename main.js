const newTodoInput = document.querySelector('#new-todo-input');
const tasksDOM = document.body.querySelector('#tasks');

const removeItem = (child, id) => {
    let todoArray = JSON.parse(localStorage.getItem('todos'));
    todoArray = todoArray.filter(item => item.id !== id);
    localStorage.setItem('todos', JSON.stringify(todoArray));
    tasksDOM.removeChild(child)
};

const createTaskItemElement = (item) => {
    const li = document.createElement('li');
    const content = document.createElement('span');
    const text = document.createElement('p');
    const remove = document.createElement('img');
    let taskIcon = null;

    if (item.status === 'New') {
        taskIcon = document.createElement('span');
        taskIcon.classList.add('circle')
    } else {
        taskIcon = document.createElement('img');
        taskIcon.src = './images/icon-check.svg';
        taskIcon.classList.add('task-check-status');
    }

    li.classList.add('task-list-item');
    content.classList.add('content');
    text.innerHTML = item.content
    remove.src = './images/icon-cross.svg';
    content.appendChild(taskIcon);
    content.appendChild(text);
    li.appendChild(content);
    li.appendChild(remove);
    li.dataset.id = item.id;
    
    remove.addEventListener('click', () => removeItem(li, item.id));
    return li;
};

const loadTasks = () => {
    const todoArray = JSON.parse(localStorage.getItem('todos'));
    todoArray.forEach(item => {
        const taskItemDOM = createTaskItemElement(item);
        tasksDOM.appendChild(taskItemDOM);
    });

};

newTodoInput.addEventListener('keydown', (event) => {
    if (event.keyCode == 13) {
        let newTodo = {
            content: newTodoInput.value,
            status: 'New'
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
    }
});

loadTasks();