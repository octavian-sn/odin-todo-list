import './style.css';
import './modal.css';
import './dropdown.css'
import { v4 as uuidv4 } from 'uuid';
import { deleteToDoS, displayProject, displayTodo, toggleModal, highlightProject,
     clearToDos, deleteProject, checkUncheckToDo, expandToDo, deleteTask,
    } from './display.js';

// Todo factory
const toDo = (name, priority, date, description, id, projectId, status = 'uncompleted') => {
    return {
        name,
        priority,
        date,
        description,
        id,
        projectId,
        status
    }
}

// Project Factory
const project = (name, id, list) => {
    const toDoList = list || [];
    const showToDoS = () => toDoList;
    const addTodo = (a, b, c, d, e, f) => {
        const item = toDo(a, b, c, d, e, f);
        toDoList.push(item);
    }
    const getToDo = (a) => {
        return toDoList.find(item => item.id == a);
    }
    const checkToDo = (a) => {
        toDoList.forEach(task => {
            if (task.id === a) {
                if (task.status === 'uncompleted') {
                    task.status = 'completed'
                } else { task.status = 'uncompleted'}
            }
        })
    }
    const deleteTodo = (a) => {
        toDoList.forEach(task => {
            if (task.id == a) toDoList.splice(toDoList.indexOf(task), 1);
        });
    }
    const changeTodoDetails = (a, b) => {
        getToDo(a).description = b;
    }
    return {name, id, toDoList, addTodo, getToDo, deleteTodo, showToDoS, checkToDo,
    changeTodoDetails}
}

// Project Manager
const manager = (() => {
    let currentProjectId = JSON.parse(localStorage.getItem('current.project')) || 'upcoming';
    const projects = reconstruct() || [];
    const getProject = (a) => {
        return (manager.projects).find(item => item.id == a);
    }
    const changeProject = (a) => {
        manager.currentProjectId = a;
    }
    const addProject = (a, b) => {
        manager.currentProjectId = b;
        const newProject = project(a, b);
        projects.push(newProject);
    }
    const deleteProject = (a) => {
        projects.forEach(project => {
            if (project.id == a) {
                projects.splice(projects.indexOf(project), 1);
            }
        })
    } 
    return {getProject, addProject, changeProject, deleteProject, projects, 
        currentProjectId}
})() 

// Process prompt input for project name
function userInput() {
    let name = prompt('Enter project name (maximum 15 characters).');
    if (name === '') {
        alert('Name cannot be empty.');
        return userInput();
    } else if (name.length > 16) {
        alert('Input is not a valid name, please try again.');
        return userInput();
    } else {
        return name;
    }
}

// Update Local Storage
function saveData() {
    localStorage.setItem('todo.projects', JSON.stringify(manager.projects));
    localStorage.setItem('current.project', JSON.stringify(manager.currentProjectId));
}

// Reconstruct Objects from Local Storage if there are any
function reconstruct() {
    if (JSON.parse(localStorage.getItem('todo.projects')) === null) null;
    else {
        const oldArray = JSON.parse(localStorage.getItem('todo.projects'));
        const array = [];
        oldArray.forEach((item) => {array.push(project(item.name, item.id, item.toDoList))});
        return array;
    }
}

// Create default folder (Upcoming)
function defaultFolder () {
    if (JSON.stringify(manager.projects) === JSON.stringify([])) {
        manager.addProject('upcoming', 'upcoming')
        manager.changeProject('upcoming');
        document.getElementById('upcoming').classList.add('selected');
    }
}

// Display AllToDos
function displayAllToDos () {
    manager.projects.forEach(project => {
        project.showToDoS().forEach(item =>{
            displayTodo(item.id, item.name, item.priority, item.date, item.projectId, item.status);
        })
    })
}

////////// Events
// Add Project
document.querySelector('.project-button').addEventListener('click', (e)=> {
    // Add project
    manager.addProject(userInput(), uuidv4());
    const project = manager.getProject(manager.currentProjectId);

    // Display project
    displayProject(project.name, project.id);
    clearToDos();
    saveData()
});

// Delete Project
document.getElementById('sider-content').addEventListener('click', (e)=> {
    if (e.target.classList.contains('delete')) {
        manager.deleteProject(e.target.parentElement.id);
        deleteProject(e.target.parentElement.id);
        manager.changeProject('');
        deleteToDoS(e.target.parentElement.id);
        saveData();
    }
})

// Select Project
document.getElementById('sider-content').addEventListener('click', (e)=> {
    // Eliminate delete button from event listener
    if (!e.target.classList.contains('delete')) {
        // Highlight project upon selection
    let project = e.target.closest('.project');
    highlightProject(project);

    // Set current project in manager
    manager.changeProject(project.id);

    // Display current project's ToDo's
    clearToDos();
    manager.getProject(manager.currentProjectId).showToDoS().forEach(item =>{
        displayTodo(item.id, item.name, item.priority, item.date, 
            manager.currentProjectId, item.status);
    })
    saveData()
    }
});

// Select Upcoming
document.getElementById('upcoming').addEventListener('click', (e)=> {
    clearToDos();
    // Display all ToDos
    displayAllToDos();
    manager.changeProject('upcoming');
    highlightProject();
    document.getElementById('upcoming').classList.add('selected');
    saveData();
})

// Open ToDo Pop-up
document.querySelector('.todo-button').addEventListener('click', toggleModal);
// Close Todo Pop-up
document.getElementById('overlay').addEventListener('click', toggleModal);

// Add ToDo
document.getElementById('add-task').addEventListener('click', (e) => {
    e.preventDefault();

    const title = document.getElementById('todo');
    const description = document.getElementById('task');
    const priority = document.getElementById('priority');
    const date = document.getElementById('date');

    function clearFields() {
        title.value = '';
        description.value = '';
        priority.value = 'Optional';
        date.value = '';
    }
    // Select project
    let project = manager.getProject(manager.currentProjectId);

    // Get an id for the ToDo
    let id = uuidv4();

    // Add Todo to project's array
    project.addTodo(title.value, priority.value, date.value, description.value, 
        id, manager.currentProjectId);

    // Display Todo
    displayTodo(id, title.value, priority.value, date.value, manager.currentProjectId);

    // Close modal and clear fields
    clearFields();
    toggleModal();
    saveData()
});

// Check/Uncheck ToDo's for completion
document.getElementById('content-show').addEventListener('click', (e)=> {
    if (e.target.type == 'checkbox') {
        // Identify parent project
        const project = manager.getProject(e.target.parentElement.getAttribute('data-parent'));
        // Data
        project.checkToDo(e.target.parentElement.id);
        // DOM
        checkUncheckToDo(e.target.parentElement.id);
        saveData();
    }
})

// Expand ToDo and Delete ToDo
document.getElementById('content-show').addEventListener('click', (e) => {
    const todoID = e.target.closest('.todo').id;
    const projectID = e.target.closest('.todo').getAttribute('data-parent')
    const project = manager.getProject(projectID);
    const toDo = project.getToDo(todoID);

    // Expand ToDo when clicking on name/priority/date
    if (e.target.classList.contains('todo-name') ||
    e.target.classList.contains('todo-priority') ||
    e.target.classList.contains('todo-date')) {
        expandToDo(todoID, toDo.description, toDo.priority, toDo.date,
            manager.projects, projectID);
    }

    // Delete ToDo
    if (e.target.classList.contains('delete-task')) {
        deleteTask(todoID);
        project.deleteTodo(todoID);
        saveData()
    }
})



// Initial Page Load
window.addEventListener('load', ()=> {
    defaultFolder();
    manager.projects.forEach(item=> {
        if (item.id !== 'upcoming') {
            displayProject(item.name, item.id);
        }
    })
    highlightProject()
    document.getElementById(manager.currentProjectId).classList.add('selected');
    if (manager.currentProjectId === 'upcoming') {
        displayAllToDos();
    } else {
        manager.getProject(manager.currentProjectId).showToDoS().forEach(item =>{
            displayTodo(item.id, item.name, item.priority, item.date, item.projectId, item.status);
        })
    }
});

// Testing
document.getElementById('test').addEventListener('click', ()=>{
    console.log(`%cCurrent Project Id is: %c${manager.currentProjectId}`, 'color: green', 'color: white');
    console.log(`%cProjects are: %c${manager.projects}`, 'color: green', 'color: white');
    console.log(`%cExecuting getProject(): %c${manager.getProject(manager.currentProjectId)}`, 'color: green', 'color: white');
    console.log(manager.projects);
    // console.log(manager.getProject(manager.currentProjectId).showToDoS());
    // console.log(reconstruct());
    // defaultFolder();
})

