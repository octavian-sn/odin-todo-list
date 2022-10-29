import { v4 as uuidv4 } from 'uuid';

const toDo = (id, name, description, date, priority) => {
    return {
        id,
        name,
        description,
        date,
        priority
    }
}

export const project = (name, id) => {
    const title = document.getElementById('todo');
    const description = document.getElementById('task');
    const priority = document.getElementById('priority');
    const date = document.getElementById('date');
    const toDoList = [];
    const addTodo = () => {
        const item = toDo(uuidv4(), title.value, description.value, date.value, priority.value)
        toDoList.push(item);
    }
    const deleteTodo = (a) => {
        toDoList.forEach(element => {
            if (element.id == a) toDoList.splice(toDoList[element], 1);
        });
    }
    return {name, id, addTodo, deleteTodo}
}

const addTodo = document.getElementById('add-task');
addTodo.addEventListener('click', (e)=> {
    e.preventDefault();
    let project = (projectManager.projects).find(item => item.id == projectManager.projectId);
    project.addTodo();
    project.showList();
})