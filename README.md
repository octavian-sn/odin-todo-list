# odin-todo-list
Project: Todo List from TheOdinProject curriculum

[Live preview](https://octavian-sn.github.io/odin-todo-list/)

[Link to assignment](https://www.theodinproject.com/lessons/node-path-javascript-todo-list)

Functionality:

The project uses local storage, meaning that, when refreshing the browser, information will be retained. 

When first adding a task, if a project has not been created and selected, the task will automatically be added into the *All Tasks* folder. *All Tasks* is a folder on it's own, but it displays all other tasks from others folders as well, so basically all tasks.

*Today* displays tasks that have a due date, set for the current day, and *This week* displays tasks that are within the current week's interval.

When deleting a project, the containing tasks are deleted along with it.

Checkboxes at the right side of a task, mark it for completion.

When clicking a task, it will be expanded to display it's details (which can be modified), current folder, priority and due date.

If the current folder will be changed, the task will disappear, since it will no longer be contained in that folder, EXCEPT if you are browsing from *All Tasks*, which as previously mentioned, it displays all tasks.

Changing priority will render the information in real time, and switch colors according to new set priority.

Changing dates will render information in real time, and if you are  browsing from *Today* or *This week*, the tasks will disappear accordingly to match the newly up-dated information. (E.G. changing due date on a task for next week while browsing from *This week* will make it disappear.)

Deleting a task, will permanently delete it from local storage.



Challenges:

This project has been very challenging but also highly educational, because, as it turned out, I didn't quite understood modules before diving into this project, and looking back at it now, I think it would have been quite impossible to achieve such a feat with spaghetti code.

Throughout this project I have used everything I learned so far in the curriculum and learned even more doing so. I found myself stuck a few times, first being when I realized that I didn't know how to actually organize all my code, due to not understanding modules correctly, which sort of linked with my second issue, passing arguments to functions from event capturing and DOM traversing. Due to not spending enough time with this concept, this simple fact eluded me at the beginning, which really confused me, since I was aware that it was going to be quite a large project and that I would need to separate the display from the logic.

I also had some trouble figuring out how to reattach methods back to my project objects when retrieving them from local storage. I figured I could either use a prototype or recreate them using the same constructor, I decided on the latter.  

I got to practice my usage of OOP, HTML, CSS, Vanilla JS, WebPack, NPM and Photoshopping .
