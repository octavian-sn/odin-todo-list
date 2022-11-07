export function displayProject(title, number) {
    const container = document.getElementById('sider-content');

    const project = document.createElement('div');
    project.classList.add('project');
    project.id = number;
    const name = document.createElement('div');
    name.classList.add('project-name');
    const icon = document.createElement('div');
    icon.classList.add('icon');
    name.appendChild(icon);
    const text = document.createTextNode(title);
    name.appendChild(text);
    project.appendChild(name);
    const erase = document.createElement('div');
    erase.classList.add('delete');
    project.appendChild(erase);
    container.appendChild(project);
    // Highlight newly created project as selected
    highlightProject(project);
}

export function deleteProject(arg) {
    const project = document.getElementById(arg);
    project.remove();
}

export function displayTodo (a, b, c, d, e, f) {
    const container = document.getElementById('content-show');
    
    const task = document.createElement('div');
    task.id = a;
    task.dataset.parent = e;
    task.classList.add('todo');

    const name = document.createElement('div');
    name.classList.add('todo-name');
    name.innerText = b;
    task.appendChild(name);
    const priority = document.createElement('div');
    priority.classList.add('todo-priority');
    priority.innerText = c;
    if (c === 'CAN WAIT') {
        task.style.borderLeftColor = 'var(--yellow-color)';
        priority.style.color = 'var(--yellow-color)';
    }
    if (c === 'URGENT') {
        task.style.borderLeftColor = 'var(--red-color)';
        priority.style.color = 'var(--red-color)';
    }
    task.appendChild(priority);
    const date = document.createElement('div');
    date.classList.add('todo-date');
    date.innerText = d;
    task.appendChild(date);
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    if (f === 'completed') {
        checkbox.checked = true;
        task.classList.add = 'completed';
    }
    task.appendChild(checkbox);

    container.appendChild(task);
}

export function toggleModal () {
    const modal = document.getElementById('modal');
    const overlay = document.getElementById('overlay');
    modal.classList.toggle('active');
    overlay.classList.toggle('active');
}

export function highlightProject (domElement) {
    const projects = document.getElementsByClassName('project');
    const options = document.getElementsByClassName('category');
    Array.from(options).forEach(element => {
        element.classList.remove('selected')
    });
    Array.from(projects).forEach(element => {
        element.classList.remove('selected');
    });
    if (domElement) domElement.classList.add('selected');
}

export function clearToDos () {
    document.getElementById('content-show').innerHTML = '';
}

export function deleteToDoS (a) {
    const tasks = document.querySelectorAll(`[data-parent='${a}']`);
    tasks.forEach(task => {
        task.remove();
    })
}