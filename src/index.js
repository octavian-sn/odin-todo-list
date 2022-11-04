import './style.css';
import './modal.css';
import { v4 as uuidv4 } from 'uuid';
import { displayProject, displayTodo, toggleModal, highlightProject, clearToDos, deleteProject} from './display.js';
import { id } from 'date-fns/locale';

// Todo factory
const toDo = (name, priority, date, description, id) => {
    return {
        name,
        priority,
        date,
        description,
        id,
    }
}

// Project Factory
const project = (name, id, list) => {
    const toDoList = list || [];
    const showToDoS = () => toDoList;
    const addTodo = (a, b, c, d, e) => {
        const item = toDo(a, b, c, d, e);
        toDoList.push(item);
        saveData();
    }
    const deleteTodo = (a) => {
        toDoList.forEach(element => {
            if (element.id == a) toDoList.splice(toDoList[element], 1);
        });
    }
    return {name, id, toDoList, addTodo, deleteTodo, showToDoS}
}

// Project Manager
const manager = (() => {
    let currentProjectId = JSON.parse(localStorage.getItem('current.project')) || 'upcoming';
    const projects = reconstruct() || [];
    
    const getProject = () => {
        return (manager.projects).find(item => item.id == 
        manager.currentProjectId);
    }
    const changeProject = (a) => {
        manager.currentProjectId = a;
    }
    const addProject = (a, b) => {
        manager.currentProjectId = b;
        const newProject = project(a, b);
        projects.push(newProject);
        saveData();
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

// Process input for project name
const userInput = () => {
    let name = prompt('Enter project name (maximum 12 characters).');
    if (name.length < 13 && name !== '') return name;
    else if (name !== '') {
        alert('Too many characters');
        return userInput();
    }
}

// Update Local Storage
function saveData() {
    localStorage.setItem('todo.projects', JSON.stringify(manager.projects));
    localStorage.setItem('current.project', JSON.stringify(manager.currentProjectId));
}

// Reconstruct Objects from Local Storage
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

////////// Events
// Add Project
document.querySelector('.project-button').addEventListener('click', (e)=> {
    // Add project
    manager.addProject(userInput(), uuidv4());
    const project = manager.getProject();

    // Display project and it's ToDo's
    displayProject(project.name, project.id);
    clearToDos();
});
// Delete Project
document.getElementById('sider-content').addEventListener('click', (e)=> {
    if (e.target.classList.contains('delete')) {
        manager.deleteProject(e.target.parentElement.id);
        deleteProject(e.target.parentElement.id);
        manager.changeProject('');
        clearToDos();
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
    manager.getProject().showToDoS().forEach(item =>{
        displayTodo(item.id, item.name, item.priority, item.date);
    })
    saveData()
    }
});

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
    let project = manager.getProject();

    // Get an id for the ToDo
    let id = uuidv4();

    // Add Todo to project's array
    project.addTodo(title.value, priority.value, date.value, description.value, id);

    // Display Todo
    displayTodo(id, title.value, priority.value, date.value);

    // Close modal and clear fields
    clearFields();
    toggleModal();
});

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
    manager.getProject().showToDoS().forEach(item =>{
        displayTodo(item.id, item.name, item.priority, item.date);
    })
});

// Testing
document.getElementById('test').addEventListener('click', ()=>{
    console.log(`%cCurrent Project Id is: %c${manager.currentProjectId}`, 'color: green', 'color: white');
    console.log(`%cProjects are: %c${manager.projects}`, 'color: green', 'color: white');
    console.log(`%cExecuting getProject(): %c${manager.getProject()}`, 'color: green', 'color: white');
    // console.log(project);
    console.log(manager.projects);
    // console.log(reconstruct());
    // defaultFolder();
})

