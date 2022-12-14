import './style.css';
import './modal.css';
import './dropdown.css'
import { v4 as uuidv4 } from 'uuid';
import { deleteToDoS, displayProject, displayTodo, toggleModal, highlightProject,
     clearToDos, deleteProject, checkUncheckToDo, expandToDo, deleteTask,
    toDoColoring} from './display.js';
import { isThisWeek, isToday, parseISO } from 'date-fns';

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
    const moveTodo = (a) => {
        toDoList.push(a);
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
        let deleted = ''
        toDoList.forEach(task => {
            if (task.id == a) {
                deleted = toDoList.splice(toDoList.indexOf(task), 1);
            }
        });
        return deleted;
    }
    const changeTodoDetails = (id, detail, data) => {
        const task = getToDo(id);
        if (detail === 'description') {
            task.description = data;
        } else if (detail === 'date') {
            task.date = data;
        } else if (detail === 'priority') {
            task.priority = data;
        } else if ( detail === 'projectId') {
            task.projectId = data;
        }
    }
    return {name, id, toDoList, addTodo, getToDo, deleteTodo, showToDoS, checkToDo,
    changeTodoDetails, moveTodo}
}

// Project Manager
const manager = (() => {
    let currentProjectId = JSON.parse(localStorage.getItem('current.project')) || 'upcoming';
    const projects = reconstruct() || [];
    const getProject = (a) => {
        return (manager.projects).find(item => item.id == a);
    }
    const getAllToDoS = () => {
        let allToDoS = []
        manager.projects.forEach(project => {
            allToDoS = allToDoS.concat(project.showToDoS())
        })
        return allToDoS
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
        currentProjectId, getAllToDoS}
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
function defaultFolder() {
    if (JSON.stringify(manager.projects) === JSON.stringify([])) {
        manager.addProject('upcoming', 'upcoming')
        manager.changeProject('upcoming');
        document.getElementById('upcoming').classList.add('selected');
    }
}

// Display AllToDos
function displayAllToDos(a = manager.getAllToDoS()) {
    a.forEach(item =>{
        displayTodo(item.id, item.name, item.priority, item.date, item.projectId, item.status);
    })
}

// Filter ToDo's for day/week
function filterTasks(a) {
    let tasks
    if (a === 'today') {
        tasks = manager.getAllToDoS().filter(task => {
            return isToday(parseISO(task.date));
        })
    }
    if (a === 'week') {
        tasks = manager.getAllToDoS().filter(task => {
            return isThisWeek(parseISO(task.date));
        })
    }
    return tasks.filter(task => {
        if (task.status === 'uncompleted') return task;
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

        // Remove elements from DOM if they are checked for completion WHILE IN 'Today' or 'This week' filters
        if (document.getElementById('today').classList.contains('selected') ||
        document.getElementById('week').classList.contains('selected')) {
            e.target.parentElement.remove();
        }
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

// Change project/details/date/priority
document.getElementById('content-show').addEventListener('input', (e)=> {
    const todoID = e.target.closest('.todo').id;
    const projectID = e.target.closest('.todo').getAttribute('data-parent')
    const project = manager.getProject(projectID);
    const toDo = project.getToDo(todoID);
    
    // Change project
    if (e.target.id === 'project-drop') {
        const newProjectId = document.getElementById('project-drop').value;
        if (newProjectId === projectID) return;
        else {
            // Change ToDo's PROJECT ID
            project.changeTodoDetails(todoID, 'projectId', newProjectId);
            // Move the deleted ToDo into the selected object's array
            manager.getProject(newProjectId).moveTodo(project.deleteTodo(todoID)[0]);
            // De-render the todo if current folder is not Upcoming
            if (manager.currentProjectId !== 'upcoming') deleteTask(todoID);
                // Set new id of parent folder to the div when changing folders WHEN in upcoming
            if (manager.currentProjectId === 'upcoming') {
                e.target.closest('.todo').dataset.parent = newProjectId;
            }
            saveData();
        }
    }

    // Change details
    if (e.target.type === 'textarea') {
        project.changeTodoDetails(todoID, 'description', 
        document.getElementById('details').value);
        saveData()
    }

    // Change date
    if (e.target.type === 'date') {
        const newValue = document.getElementById('date').value;
        const display = e.target.parentElement.parentElement.previousSibling.
        previousSibling;
        project.changeTodoDetails(todoID, 'date', newValue);
        display.innerText = newValue;
        saveData()

        // While browsing in 'today/this week', if newly selected date doesn't coincide with filter, remove tasks
        if (document.getElementById('today').classList.contains('selected') &&
        !isToday(parseISO(newValue))) e.target.closest('.todo').remove();
        if (document.getElementById('week').classList.contains('selected') &&
        !isThisWeek(parseISO(newValue))) e.target.closest('.todo').remove();
    }

    // Change priority
    if (e.target.id === 'priority-drop') {
        const newValue = document.getElementById('priority-drop').value
        const display = e.target.parentElement.parentElement.previousSibling.
        previousSibling.previousSibling;
        project.changeTodoDetails(todoID, 'priority', newValue)
        display.innerText = newValue
        // Change colors when changing priority
        toDoColoring(newValue, e.target.closest('.todo'), 
        e.target.parentElement.parentElement.previousSibling.previousSibling.previousSibling);
        saveData();
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

// Sorting ToDo's for Today
document.getElementById('today').addEventListener('click', (e) => {
    clearToDos()
    displayAllToDos(filterTasks('today'));
    highlightProject();
    document.getElementById('today').classList.add('selected');
})

// Sorting ToDo's for This Week
document.getElementById('week').addEventListener('click', (e) => {
    clearToDos()
    displayAllToDos(filterTasks('week'));
    highlightProject();
    document.getElementById('week').classList.add('selected');
})

// Disable 'add project button' when navigating today/this week filters
window.addEventListener('click', () => {
    const title = document.getElementById('content-title').childNodes[1];
    const button = document.getElementById('content-title').childNodes[3];
    if (document.getElementById('today').classList.contains('selected')) {
        title.innerText = "Today";
        button.style.visibility = 'hidden';
    } else if (document.getElementById('week').classList.contains('selected')) {
        title.innerText = "This week";
        button.style.visibility = 'hidden';
    } else {
        title.innerText = "Add Task";
        button.style.visibility = 'visible';
    }
})

// Testing
// document.getElementById('test').addEventListener('click', ()=>{
//     console.log(`%cCurrent Project Id is: %c${manager.currentProjectId}`, 'color: green', 'color: white');
//     console.log(`%cProjects are: %c${manager.projects}`, 'color: green', 'color: white');
//     console.log(`%cExecuting getProject(): %c${manager.getProject(manager.currentProjectId)}`, 'color: green', 'color: white');
//     console.log(manager.projects);
//     const task = manager.getProject(manager.currentProjectId).toDoList[1];
//     const today = format(new Date, 'yyyy-MM-dd');
//     const week = format(addDays(new Date, 7), 'yyyy-MM-dd')
//     console.log(task.date, today, week)
//     console.log(isToday(parseISO(task.date)))
//     console.log(isThisWeek(parseISO(task.date)))
// })

