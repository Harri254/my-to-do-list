let form1 = document.querySelector('#form1');
let dateList = [];  // To hold and sort the date entries
let showingDate = document.querySelector('.showing-date');

form1.addEventListener("submit", (e) => {
    e.preventDefault();

    // Date input
    let date = document.querySelector("#date");
    const dateInput = date.value;

    // If the date input is empty, show an alert
    if (dateInput === "") {
        alert("Select a date!");
        return;
    }

    // Validate if the date is today or a future date
    const selectedDate = new Date(dateInput);
    const today = new Date();
    today.setHours(0, 0, 0, 0);  // Set time to 00:00 for today

    if (selectedDate < today) {
        alert("You cannot select a past date!");
        return;
    }

    // Check if the date already exists in the list
    if (dateList.some(dateObj => dateObj.date === dateInput)) {
        alert("This date is already added!");
        return;
    }

    // Add the valid date to the dateList array
    dateList.push({
        date: dateInput,
        day: getDayOfWeek(dateInput),
        tasks: []  // Initialize an empty array for tasks
    });

    // Sort the dateList array by date
    dateList.sort((a, b) => new Date(a.date) - new Date(b.date));

    // Render all dates and tasks
    renderAllDates();
});

// Function to get the day of the week from the date input
function getDayOfWeek(dateInput) {
    const day = new Date(dateInput);
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayOfWeek = day.getDay();
    return daysOfWeek[dayOfWeek];
}

// Function to render all dates and their tasks
function renderAllDates() {
    // Clear the previous content before rendering the sorted dates
    showingDate.innerHTML = '';

    // Render the sorted date entries
    dateList.forEach((entry) => {
        renderDate(entry);
    });
}

// Function to render a date with tasks and buttons
function renderDate(dateEntry) {
    // Create a new container for each date
    let dateContainer = document.createElement('div');
    dateContainer.classList.add('date-container');

    // Subcontainer1: Input Manipulators
    let inputManipulator = document.createElement('div');
    inputManipulator.classList.add('input-manipulators');

    // Subcontainer1 Content: Showing Day and Buttons
    let showingDay = document.createElement('h3');
    showingDay.classList.add('showing-day');
    showingDay.textContent = `${dateEntry.day}, ${dateEntry.date}`;

    let addTask = document.createElement('button');
    addTask.classList.add('addtask');
    addTask.innerText = 'Add Task';

    let rmvDay = document.createElement('button');
    rmvDay.classList.add('rmv-day');
    rmvDay.innerText = '-';

    // Append showingDay, addTask, and rmvDay to the inputManipulator container
    inputManipulator.appendChild(showingDay);
    inputManipulator.appendChild(addTask);
    inputManipulator.appendChild(rmvDay);

    // Append the inputManipulator container to the dateContainer
    dateContainer.appendChild(inputManipulator);

    // Render existing tasks
    dateEntry.tasks.forEach(task => {
        createTask(dateContainer, task, dateEntry);
    });

    // Append the dateContainer to the showingDate container
    showingDate.appendChild(dateContainer);

    // Add Task Functionality: Add another task when 'Add Task' button is clicked
    addTask.addEventListener('click', () => {
        // Check if a task input already exists
        if (!dateContainer.querySelector('.toadd')) {
            createTaskAdder(dateContainer, dateEntry, addTask);
        }
    });

    // Remove the entire date container when rmvDay button is clicked
    rmvDay.addEventListener('click', () => {
        // Remove the entry from dateList
        dateList = dateList.filter(entry => entry.date !== dateEntry.date);
        // Remove the DOM element (dateContainer)
        dateContainer.remove();
    });
}

function createTaskAdder(dateContainer, dateEntry, addTaskButton) {
    // Create subcontainer2: task-adder
    let toAdd = document.createElement('div');
    toAdd.classList.add('toadd');

    // Subcontainer2 Content: Task Form
    let taskAdder = document.createElement('form');
    taskAdder.classList.add('task-adder');

    let taskInput = document.createElement('input');
    taskInput.setAttribute('type', 'text');
    taskInput.setAttribute('placeholder', 'Enter a task');
    taskInput.classList.add('task');

    let submitTask = document.createElement('input');
    submitTask.setAttribute('type', 'submit');
    submitTask.value = 'Add Task';
    submitTask.classList.add('submit-task');

    // Append the inputs to the taskAdder form
    taskAdder.appendChild(taskInput);
    taskAdder.appendChild(submitTask);

    // Append the taskAdder form to the toAdd container
    toAdd.appendChild(taskAdder);

    // Insert the toAdd container right after the inputManipulator
    dateContainer.insertBefore(toAdd, addTaskButton.parentNode.nextSibling);

    // Focus on the input field immediately after adding it to the DOM
    setTimeout(() => taskInput.focus(), 0);

    // Handle the submission of the task form
    taskAdder.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent form submission

        let taskText = taskInput.value.trim();

        if (taskText === '') {
            alert("Enter a valid task");
            return;
        }

        // Capitalize the first letter of the task
        taskText = taskText.charAt(0).toUpperCase() + taskText.slice(1);
        

        // Add the task to the dateEntry's tasks array
        dateEntry.tasks.push(taskText);

        createTask(dateContainer, taskText, dateEntry);

        // Remove the task adder form
        toAdd.remove();
    });
}

function createTask(dateContainer, taskText, dateEntry) {
    // Create task container
    let taskContainer = document.createElement('div');
    taskContainer.classList.add('task1');

    // Task content
    let taskItem = document.createElement('span');
    taskItem.textContent = taskText;
    taskItem.style.marginLeft = '10px';  // Add some space after the checkbox

    // Checkbox for task completion
    let taskCheckbox = document.createElement('input');
    taskCheckbox.setAttribute('type', 'checkbox');

    // Remove task button
    let removeTask = document.createElement('button');
    removeTask.classList.add('remove-task');
    removeTask.innerText = 'x';
    removeTask.style.marginLeft = '10px';  // Add some space before the remove button

    // Remove the task when clicking the remove button
    removeTask.addEventListener('click', () => {
        // Remove the task from the dateEntry's tasks array
        dateEntry.tasks = dateEntry.tasks.filter(task => task !== taskText);
        taskContainer.remove();
    });

    // Append task content to task container
    taskContainer.appendChild(taskCheckbox);
    taskContainer.appendChild(taskItem);
    taskContainer.appendChild(removeTask);

    // Append task container to dateContainer
    dateContainer.appendChild(taskContainer);
}

