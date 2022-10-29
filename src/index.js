import './style.css';
import './modal.css';
import { v4 as uuidv4 } from 'uuid';
import { displayProject, overlay, toggleModal} from './display.js';
import { project } from './factory.js';

const projectManager = (() => {
    let projectId = '';
    const projects = []
    const addProject = () => {
        let input = prompt('Enter project name (maximum 12 characters).');
        if (input.length < 13 && input !== '') {
            let id = uuidv4();
            projectId = id;
            const item = project(input, id);
            projects.push(item);
            displayProject(input);
        } else if (input !== '') {
            alert('Too many characters');
            addProject();
        }
    } 
    return {projects, projectId, addProject}
})() 

// console.log(projectManager.projects);

const addProjectButton = document.querySelector('.project-button');
addProjectButton.addEventListener('click', projectManager.addProject);

const addTodoButton = document.querySelector('.todo-button');
addTodoButton.addEventListener('click', (e)=> {
    e.preventDefault();
    let project = (projectManager.projects).find(item => item.id == projectManager.projectId);
    project.addTodo();
    project.showList();
})

overlay.addEventListener('click', toggleModal);