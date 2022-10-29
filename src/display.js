const modal = document.getElementById('modal');
export const overlay = document.getElementById('overlay');

export function displayProject(identify) {
    const container = document.getElementById('sider-content');

    const project = document.createElement('div');
    project.classList.add('project');
    project.id = identify;
    const name = document.createElement('div');
    name.classList.add('project-name');
    const icon = document.createElement('div');
    icon.classList.add('icon');
    name.appendChild(icon);
    const text = document.createTextNode(identify);
    name.appendChild(text);
    project.appendChild(name);
    const erase = document.createElement('div');
    erase.addEventListener('click', ()=> {
        deleteProjectDom(identify);
    });
    erase.classList.add('delete');
    project.appendChild(erase);
    container.appendChild(project);
}

function deleteProjectDom(arg) {
    const project = document.getElementById(arg);
    project.remove();
}

export function displayTask (nameA, priorityA, dateA) {
    const container = document.getElementById('content-show');
    
    const task = document.createElement('div');
    task.classList.add('todo');

    const name = document.createElement('div');
    name.classList.add('todo-name');
    name.innerText = nameA;
    task.appendChild(name);
    const priority = document.createElement('div');
    priority.classList.add('todo-priority');
    priority.innerText = priorityA;
    task.appendChild(priority);
    const date = document.createElement('div');
    date.classList.add('todo-date');
    date.innerText = dateA;
    task.appendChild(date);
    const button = document.createElement('button');
    button.innerText = 'Complete';
    task.appendChild(button);

    container.appendChild(task);
}

export function toggleModal () {
    modal.classList.toggle('active');
    overlay.classList.toggle('active');
}
