// Add project
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

// Delete project
export function deleteProject(arg) {
    const project = document.getElementById(arg);
    project.remove();
}

// Render ToDo's
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
    // Change div color according to priority
    toDoColoring(c, task, priority)

    task.appendChild(priority);
    const date = document.createElement('div');
    date.classList.add('todo-date');
    date.innerText = d;
    task.appendChild(date);
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    if (f === 'completed') {
        checkbox.checked = true;
        task.classList.add('completed');
    }
    task.appendChild(checkbox);

    container.appendChild(task);
}

export function toDoColoring (value, taskDiv, priorityDiv) {
    if (value === 'CAN WAIT') {
        taskDiv.style.borderLeftColor = 'var(--yellow-color)';
        priorityDiv.style.color = 'var(--yellow-color)';
    }
    if (value === 'URGENT') {
        taskDiv.style.borderLeftColor = 'var(--red-color)';
        priorityDiv.style.color = 'var(--red-color)';
    } 
    if (value === 'OPTIONAL') {
        taskDiv.style.borderLeftColor = 'var(--gray-color)';
        priorityDiv.style.color = 'white';
    }
}

// Modal for adding ToDo's
export function toggleModal () {
    const modal = document.getElementById('modal');
    const overlay = document.getElementById('overlay');
    modal.classList.toggle('active');
    overlay.classList.toggle('active');
}

// Highlight when selecting a project
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

// Clear ToDo's along with parent folder
export function deleteToDoS (a) {
    const tasks = document.querySelectorAll(`[data-parent='${a}']`);
    tasks.forEach(task => {
        task.remove();
    })
}

export function deleteTask (a) {
    document.getElementById(a).remove();
}

// Check for completion
export function checkUncheckToDo (a) {
    document.getElementById(a).classList.toggle('completed');
}

export function expandToDo (taskId, taskDetails, taskPriority, taskDate, projects,
    projectId) {
    // Task container
    const container = document.getElementById(taskId);
    // Close drop-down if an expanded todo is selected
    if (container.lastChild.classList.contains('dropdown')) {
        container.lastChild.remove();
        container.style.backgroundImage = "url('../src/down.png')"
    } else {
        // Close all other drop-downs if there are any
        if (document.getElementById('dropdown')) {
            const drop = document.getElementById('dropdown');
            drop.parentElement.style.backgroundImage = "url('../src/down.png')";
            drop.remove()
        };

        // Change arrow icon when selecting the ToDo
        container.style.backgroundImage = "url('../src/up.png')"
        
        // Create drop-down on selected todo
        const dropdown = document.createElement('div');
        dropdown.id = 'dropdown';
        dropdown.classList.add('dropdown');
    
        // ToDo details
        const text = document.createElement('textarea');
        text.name ='details';
        text.id ='details';
        text.cols ='30';
        text.rows ='10';
        text.value = taskDetails;
        dropdown.appendChild(text);
    
        // PROJECT selector
        const projectDiv = document.createElement('div');
        projectDiv.classList.add('row-one');
        const projectLabel = document.createElement('label');
        projectLabel.for ='project-drop';
        projectLabel.innerText = 'Change project:';
        projectDiv.appendChild(projectLabel);
        const projectSelect = document.createElement('select');
        projectSelect.name ='project-drop';
        projectSelect.id ='project-drop';
        // For each project create an option setting it's id as value and name as inner text
        projects.forEach(project => {
            const option = document.createElement('option');
            option.value = project.id;
            option.innerText = project.name;
            if (projectId === project.id) {option.selected = true};
            projectSelect.appendChild(option);
        })
        projectDiv.appendChild(projectSelect);
        dropdown.appendChild(projectDiv);
    
        // PRIORITY Selector
        const priorityDiv = document.createElement('div');
        priorityDiv.classList.add('row-two');
        const priorityLabel = document.createElement('label');
        priorityLabel.for ='priority-drop';
        priorityLabel.innerText ='Priority';
        priorityDiv.appendChild(priorityLabel);
        const prioritySelect = document.createElement('select');
        prioritySelect.name ='priority-drop';
        prioritySelect.id ='priority-drop';
        const optionOne = document.createElement('option');
        optionOne.value ='OPTIONAL';
        optionOne.innerText ='Optional';
        prioritySelect.appendChild(optionOne);
        const optionTwo = document.createElement('option');
        optionTwo.value ='CAN WAIT';
        optionTwo.innerText ='Can wait';
        prioritySelect.appendChild(optionTwo);
        const optionThree = document.createElement('option');
        optionThree.value ='URGENT';
        optionThree.innerText ='Urgent';
        prioritySelect.appendChild(optionThree);
        // Select current priority
        if (optionOne.value == taskPriority) {
            optionOne.selected = true;
        } else if (optionTwo.value == taskPriority) {
            optionTwo.selected = true;
        } else { optionThree.selected = true};
        priorityDiv.appendChild(prioritySelect);
        dropdown.appendChild(priorityDiv);
    
        // DATE Selector
        const dateDiv = document.createElement('div');
        dateDiv.classList.add('row-three');
        const dateLabel = document.createElement('label');
        dateLabel.for ='date-drop';
        dateLabel.innerText ='Due date:';
        dateDiv.appendChild(dateLabel);
        const dateInput = document.createElement('input');
        dateInput.type ='date';
        dateInput.id ='date';
        dateInput.name ='date';
        dateInput.value =taskDate;
        dateDiv.appendChild(dateInput);
        dropdown.appendChild(dateDiv);
    
        // DELETE Button
        const button = document.createElement('button');
        button.classList.add('delete-task');
        button.innerText = 'DELETE TASK';
        dropdown.appendChild(button);
    
        // Append dropdown to ToDo's div
        container.appendChild(dropdown);
    }
}