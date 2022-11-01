import './style.css';
import './modal.css';
import { v4 as uuidv4 } from 'uuid';
import { displayProject, displayTodo, toggleModal, highlightProject, clearToDos} from './display.js';

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
    const toDoList = [];
    const currentToDo = '';
    const showList = () => toDoList;
    const addTodo = (a, b, c, d, e) => {
        const item = toDo(a, b, c, d, e);
        toDoList.push(item);
    }
    const deleteTodo = (a) => {
        toDoList.forEach(element => {
            if (element.id == a) toDoList.splice(toDoList[element], 1);
        });
    }
    return {name, id, currentToDo, addTodo, deleteTodo, showList}
}

// Project Manager
const projectManager = (() => {
    let currentTaskId = '';
    let currentProjectId = '';
    const projects = []
    const getProject = () => {
        return (projectManager.projects).find(item => item.id == 
        projectManager.currentProjectId);
    }
    const addProject = () => {
        let name = userInput()
        let id = uuidv4();
        projectManager.currentProjectId = id;
        const newProject = project(name, id);
        projects.push(newProject);
    }
    const deleteProject = () => {
    } 
    return {getProject, addProject, projects, currentProjectId}
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
    clearToDos();
});

// Select Project
document.getElementById('sider-content').addEventListener('click' , (e)=> {
    let project = e.target.closest('.project');
    highlightProject(project);
    clearToDos();
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
    let project = projectManager.getProject();
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




// Testing
document.getElementById('test').addEventListener('click', ()=>{
    // console.log(`%cCurrent Project Id is: %c${projectManager.currentProjectId}`, 'color: green', 'color: white');
    // console.log(`%cProjects are: %c${projectManager.projects}`, 'color: green', 'color: white');
    // console.log(`%cExecuting getProject(): %c${projectManager.getProject()}`, 'color: green', 'color: white');
    let project = projectManager.getProject()
    console.log(project)
})

