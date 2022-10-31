import './style.css';
import './modal.css';
import { v4 as uuidv4 } from 'uuid';
import { displayProject, displayTodo, toggleModal, highlightProject} from './display.js';

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
const project = (name, id) => {
    // const title = document.getElementById('todo');
    // const description = document.getElementById('task');
    // const priority = document.getElementById('priority');
    // const date = document.getElementById('date');
    const toDoList = [];
    const toDoId = uuidv4();
    const addTodo = () => {
        const item = toDo(name, priority, date, description, toDoId);
        toDoList.push(item);
    }
    const deleteTodo = (a) => {
        toDoList.forEach(element => {
            if (element.id == a) toDoList.splice(toDoList[element], 1);
        });
    }
    return {name, id, toDoId, addTodo, deleteTodo}
}

// Project Manager
const projectManager = (() => {
    let currentTaskId = '';
    let currentProjectId = '';
    const projects = []
    const getProject = () => {
        console.log((projectManager.projects).find(item => item.id == projectManager.currentProjectId))
    }
    const addProject = () => {
        let name = userInput()
        let id = uuidv4();
        currentProjectId = id;
        const newProject = project(name, id);
        projects.push(newProject);
        // displayProject(name, id);
    }
    const addTask = () => {
        let project = getProject();
        project.addTodo();
        currentTaskId = projects[project].toDoId;
        displayTodo()
    }
    const deleteProject = () => {
    } 
    return {getProject, addProject, addTask}
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

////////// Events
// Add Project
document.querySelector('.project-button').addEventListener('click', (e)=> {
    projectManager.addProject();
    const project = projectManager.getProject();
    displayProject(project.name, project.id);
});

// Select Project
const projects = document.getElementsByClassName('project');
Array.from(projects).forEach(element => {
    element.addEventListener('click', (e)=> {
        highlightProject(e.target);
    })
})

// Open ToDo Pop-up
document.querySelector('.todo-button').addEventListener('click', toggleModal);
// Close Todo Pop-up
document.getElementById('overlay').addEventListener('click', toggleModal);


// Add ToDo
document.getElementById('add-task').addEventListener('submit', (e) => {
    e.preventDefault;
    projectManager.addTask();
});


