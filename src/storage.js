// Update Local Storage
function saveData() {
    localStorage.setItem('todo.projects', JSON.stringify(manager.projects))
}

const projects = JSON.parse(localStorage.getItem('todo.projects')) || [];
