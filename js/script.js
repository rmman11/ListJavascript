/**
 * Keeping Up With the Javascripts - Part 1: ES6
 * Project #1 - to-do list application
 * Homework Assignment #9 - Template literals
**/

// global variable to handle user information
let user = {};
let isLogged = false;
let body;
let selectedList = {
    name: "",
    lists: []
};
let selectedListID = "";
let selectedTaskID = "";

// goto index at page loaded
document.addEventListener("DOMContentLoaded", applicationStart, false);

function applicationStart() {
    body = document.body;
    body.addEventListener("click", loadListeners, false);
    clearUser();
    loadPage();
}

function loadListeners(event) {
    const target = event.target;
    const classes = target.classList;

    // prevent the checkbox's weird behavior
    if(target.type !== "checkbox") {
        event.preventDefault();
    }

    /** ********** CHANGE PAGE BUTTONS ********** */
    if(classes.contains("page-index")) {
        loadPage(pageIndex());
        return;
    }
    if(classes.contains("page-login")) {
        loadPage(pageLogin());
        return;
    }
    if(classes.contains("page-account")) {
        loadPage(pageAccount());
        return;
    }


    if(classes.contains("page-list")) {
        loadPage(pageDashboard());
        return;
    }

    if(classes.contains("page-dashboard")) {
        loadPage(pageDashboard());
        return;
    }
    if(classes.contains("page-logout")) {
        logout();
        loadPage();
        return;
    }

    /** ********** FORM BUTTONS ********** */
    if(classes.contains("form-clear")) {
        target.closest("form").reset();
        return;
    }

    if(target.id === "form-submit-login") {
        executeLogin(target.closest("form"));
        return;
    }

    if (target.id === "form-account-submit" ) {
        executeAccountForm(target.closest("form"));
        //executeSignup();
        return;
    }

    if (target.id === "form-account-delete" ) {
        deleteAccount();
        //executeSignup();
        return;
    }

    /** ********** LIST BUTTONS ********** */
    if(target.id === "create-new-list") {
        createNewList();
        loadPage(pageDashboard());
        return;
    }

    if(classes.contains("button-list-select")) {
        selectedListID = getListIndexByID(target.id);
        selectedList = user.lists[selectedListID];
        loadPage(pageDashboard());
        return;
    }

    if(classes.contains("button-list-rename")) {
        listRename();
        loadPage(pageDashboard());
        return;
    }

    if(classes.contains("button-list-delete")) {
        listDelete();
        loadPage(pageDashboard());
        return;
    }

    /** ********** TASK BUTTONS ********** */
    if(classes.contains("button-task-done")) {
        selectedTaskID = getTaskIndexByID(target.id);
        taskIsDoneChange(target);
        clearSelectedTask();
        loadPage(pageDashboard());
        return;
    }
    if(classes.contains("button-task-rename")) {
        selectedTaskID = getTaskIndexByID(target.id);
        taskRename();
        clearSelectedTask();
        loadPage(pageDashboard());
        return;
    }
    if(classes.contains("button-task-delete")) {
        selectedTaskID = getTaskIndexByID(target.id);
        taskDelete();
        clearSelectedTask();
        loadPage(pageDashboard());
        return;
    }

    if(target.id === "button-task-add") {
        addNewTask();
        loadPage(pageDashboard());
        // send focus back to the input field to insert new task
        document.getElementById("input-new-task-name").focus();

    }
}

function executeLogin(form) {

    if(checkPassword(form.email.value, form.password.value)) {
        loadUserAccount(form.email.value);
        isLogged = true;
        loadPage(pageDashboard());
    } else {
        showNotification("Your email and password don't match. Please ty again.");
    }
}

// create new or update existing user
function executeAccountForm(form) {

    if( isAccountFormValid(form) ) {
        user.firstName = form.firstName.value;
        user.lastName = form.lastName.value;
        user.email = form.email.value;
        user.password = hashString(form.password.value);

        // // if user is not logged - new user
        if(!isLogged) {
            user.lists = [];
        }

        // save user information
        saveUser();

        // if logged, show message
        if(isLogged) {
            alert("Account updated.")
        } else {
            // saved new user = make logged
            isLogged = true;
        }

        // procced with login
        executeLogin(form);
    }
}

// delete user account
function deleteAccount() {

    if (confirm("Are you sure you want to delete this account?")) {
        localStorage.removeItem(user.email);
        alert("Account: " + user.email + " deleted.");
        logout();
        loadPage();
    }
}

/******************************************************
 * Default HTML pages
 ******************************************************/

// Index defafult html
function pageIndex() {

    changeTitle("a simple to-do task manager");

    let html = `
    
   
    <div class="columns is-centered">
        <div class="column is-half">
            <div class="box">
                <div class="title is-4 has-text-centered">
                    Keeping Up With the Javascripts - Part 1: ES6
                </div>
                <div class="subtitle is-4 has-text-centered">
                    Project #1
                </div>
                <div class="subtitle is-4 has-text-centered">
                Homework Assignment #09 - Template literals
                </div>
                <p class="has-text-justified">
                    A simple "to-do list" application, using client-side HTML, 
                    CSS, and Javascript only. This application should store its 
                    data using localStorage only, and should not connect to any 
                    external APIs, backends, databases etc. This should function 
                    as a "Single Page Application", so the page should never 
                    actually refresh or reload, and no links should direct to any 
                    other page. Instead, when links are clicked (or forms are 
                    submitted), the contents of the page should disappear and the 
                    new content should be loaded in its place, all without 
                    actually redirecting the user.
                </p>
            </div>
        </div>
    </div>
    <div class="buttons are-medium is-centered">
        <button class="button is-info page-account">Sign Up</button>
        <button class="button is-success page-login">Log In</button>
    </div>

    `;

    return html;
}

// handle sign up and account update form
function pageAccount() {

    if(isLogged) {
        changeTitle("Account Settings");
    } else {
        changeTitle("Sign Up");
    }

    let html = `
        <h1 class="title has-text-centered">${isLogged?"Account Settings":"Sign Up"}</h1>
        <div class="columns is-centered">
            <div class="column is-half">
                <div class="box">
                    <form id="form">
                        <div class="field">
                            <label class="label">First Name</label>
                            <div class="control">
                                <input class="input" type="text" placeholder="Your First Name" id="firstName" ${isLogged?`value="${user.firstName}"`:""}>
                            </div>
                        </div>
                        <div class="field">
                            <label class="label">Last Name</label>
                            <div class="control">
                                <input class="input" type="text" placeholder="Your Last Name" id="lastName" ${isLogged?`value="${user.lastName}"`:""}>
                            </div>
                        </div>
                        <div class="field">
                            <label class="label">Email</label>
                            <div class="control">
                                <input class="input" type="email" placeholder="example@email.com" id="email" ${isLogged?`value="${user.email}"`:""}>
                            </div>
                        </div>
                        <div class="field">
                            <label class="label">Password</label>
                            <div class="control">
                                <input class="input" type="password" placeholder="********" id="password">
                            </div>
                        </div>
                        ${ !isLogged?`
                            <div class="field">
                                <div class="control">
                                    <label class="checkbox">
                                        <input type="checkbox" id="agree">
                                            I agree to the terms of use.
                                    </label>
                                </div>
                            </div>`:""}
                        <div class="field is-grouped is-grouped-centered">
                            <div class="control">
                                <button id="form-account-submit" class="button is-info">Register</button>
                            </div>
                            <div class="control">
                                <button class="button ${isLogged?"page-dashboard":"page-login"}">Cancel</button>
                            </div>
                            ${isLogged?`
                            <div class="control">
                                <button id="form-account-delete" class="button is-danger">Delete Account</button>
                            </div>
                            `:""}
                        </div>
                        <div class="field is-grouped is-grouped-centered">
                            <div class="control">
                            ${isLogged?`
                                    <button class="button is-text page-dashboard">&#171; back to dashboard</button>
                                `:`
                                    <button class="button is-text page-login">Already have an account? Log In!</button>
                                `
                            }
                            </div>
                        </div>
                    </form>
                    <div id="notification" class="notification is-hidden"></div>
                </div>
            </div>
        </div>
    `;
    return html;

}

// Login default html
function pageLogin() {

    changeTitle("Log In");

    let html = `
        <h1 class="title has-text-centered">Log In</h1>
        <div class="columns is-centered">
            <div class="column is-half">
                <div class="box">
                    <form id="form">
                        <div class="field">
                            <label class="label">Email</label>
                            <div class="control">
                                <input class="input" type="email" placeholder="example@email.com" id="email">
                            </div>
                        </div>
                        <div class="field">
                            <label class="label">Password</label>
                            <div class="control">
                                <input class="input" type="password" placeholder="********" id="password">
                            </div>
                        </div>
                        <div class="field is-grouped is-grouped-centered">
                            <div class="control">
                                <button id="form-submit-login" class="button is-info">Login</button>
                            </div>
                            <div class="control">
                                <button class="button page-index">Cancel</button>
                            </div>
                        </div>
                        <div class="field is-grouped is-grouped-centered">
                            <div class="control">
                                <button class="button is-text page-account">Don't have an account? Sign Up!</button>
                            </div>
                        </div>
                    </form>
                    <div id="notification" class="notification is-hidden"></div>
                </div>
            </div>
        </div>
    `;

    return html;
}

// Deshboard default html
function pageDashboard() {

    changeTitle("Dashboard");

    let html = `
    <h1 class="title has-text-centered">Dashboard</h1>
    <div class="columns is-centered">
        <div class="column is-full">
            <div class="box">
                <div id="notification" class="notification is-hidden">
                </div>
                <div class="columns">
                    <div class="column is-one-third">
                        <aside class="menu">
                            <p class="menu-label">
                                Lists
                            </p>
                            <ul class="menu-list" id="user-lists">
                                ${loadLists()}
                            </ul>
                            <p class="menu-label"></p>
                            <ul class="menu-list">
                                <li><a class="button is-success is-fullwidth" id="create-new-list">Create new list</a></li>
                            </ul>
                        </aside>
                    </div>
                    <div class="column" id="column-task">
                        <table class="table is-narrow is-hoverable is-fullwidth" id="table-task">
                            <thead class="has-background-dark">
                                <th class="has-text-light" id="table-list-name">
                                ${ selectedList.name }
                                </th>
                                <th class="tools">
                                    <div class="buttons has-addons is-right">
                                        <span class="button button-list-rename is-small is-info is-inverted is-outlined">Rename</span>
                                        <span class="button button-list-delete is-small is-danger is-inverted is-outlined">Delete</span>
                                    </div>
                                </th>
                            </thead>
                            <tfoot class="has-background-dark">
                                <tr>
                                    <th colspan="2">
                                        <div class="field has-addons">
                                            <div class="control is-expanded">
                                                <input class="input" id="input-new-task-name" type="text" placeholder="Task name">
                                            </div>
                                            <div class="control">
                                                <a class="button is-success is-outlined" id="button-task-add">
                                                    Add New Task
                                                </a>
                                            </div>
                                        </div>
                                    </th>
                                </tr>
                            </tfoot>
                            <tbody>
                            ${loadTasks(selectedList.items)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;
    return html;
}


const unloggedButtons = `
    <div class="buttons is-right" id="unlogged-buttons">
        <button class="button is-info is-inverted page-account">Sign Up</button>
        <button class="button is-info is-inverted page-login">Log In</button>
    </div>
`;
const loggedButtons = `
    <div class="buttons is-right" id="logged-buttons">
        <button class="button is-info is-inverted page-account" >Account Settings</button>
        <button class="button is-info is-inverted page-list" >List Task</button>
        <button class="button is-info is-inverted page-logout">Log Out</button>
    </div>
`;

// load selected page
function loadPage(page) {

    page = page || pageIndex();

    let index = `
    
    
  <div id="wrapper">
    <header>
        <div class="row">
            <div class="col-sm-3">
           
                    <h1 class="title">
                        Project List 
                    </h1>
                    <h2 class="subtitle">
                       Task Manager 
                    </h2>
                </div>
                <div class="column has-text-right">
                ${isLogged?loggedButtons:unloggedButtons}
                </div>
            </div>
    </header>

    <section class="section">
        <div class="container" id="content">
        ${page}
        </div>
    </section>
    <footer class='footer'>
    footer page
		</footer>
    </div>
    `;

    body.innerHTML = index;
}

//check signup and update account information forms
function isAccountFormValid(form) {
   // check empty
    if (isEmpty(form.firstName.value) ||
        isEmpty(form.lastName.value)  ||
        isEmpty(form.email.value)     ||
        isEmpty(form.password.value)) {
        //erro
        showNotification("All fields are required. Please ty again.");
        return false;
    }
    // check first name
    if(!isAlpha(form.firstName.value)) {
        showNotification("First Name may only contain letters.");
        return false;
    }
    // check last name
    if(!isAlpha(form.lastName.value)) {
        showNotification("Last Name may only contain letters.");
        return false;
    }
    // check email
    if(!isEmail(form.email.value)) {
        showNotification("Email is invalid.");
        return false;
    }
    // check password
    if(!isAlphaNumeric(form.password.value)) {
        showNotification("Password may only contain letters and numbers.");
        return false;
    }

    // verify checkboxif user is not logged - Sign Up
    if(!isLogged) {
        if(!form.agree.checked) {
            showNotification("You must agree to the terms of use.");
            return false;
        }
    }

    if(isLogged) {
        // check changing email -- Update
        if (form.email.value !== user.email) {
            // user exists
            if(userExists(form.email.value)) {
                showNotification("There is already a user registered with this email. Please try again.");
                return false;
            }
        }
    } else {
        // check username -- Sign Up
        if(userExists(form.email.value)) {
            // verify if user is logged
            showNotification("There is already a user registered with this email. Please try again.");
            return false;
        }
    }

    return true;
}

/**
 * Log out application
 */
function logout() {
    clearUser();
    loadPage();
}

// create new list handler
function createNewList() {

    let newListName = prompt("New List Name", "");
    if (isListNameValid(newListName)) {
        // list object
        let list = {
            name: newListName,
            items: []
        }
        // add list in user lists
        user.lists.push(list);
        // save user information
        saveUser();

        // get new listID
        selectedListID = getListIndexByName(list.name);
        selectedList = user.lists[selectedListID];

        showNotification(`List <strong>${selectedList.name}</strong> succefull created.`,"is-success");
    } else {
        showNotification("List Name may only contain letters, numbers and space. The name can not be empty and must be unique.")
    }
}

// rename list
function listRename() {
    if (isEmpty(selectedListID)) {
        alert("List not selected.");
    } else {
        let newListName = prompt("Rename list ", selectedList.name);

        if(isListNameValid(newListName, true)) {
            user.lists[selectedListID].name = newListName;
            selectedList = user.lists[selectedListID];
            saveUser();
        } else {
            showNotification("List Name may only contain letters, numbers and space. The name can not be empty and must be unique.");
        }
    }
}

// delete list
function listDelete() {
    if (isEmpty(selectedListID)) {
        alert("List not selected.");
    } else {

        if(window.confirm(`Delete: ${selectedList.name} ?`)) {
            user.lists.splice(selectedListID, 1);
            showNotification(`List "${selectedList.name}" deleted.`, "is-success");
            clearSelectedList();
            saveUser();
        }
    }
}

// change button and text decorations and update user
function taskIsDoneChange(elemtent) {
    elemtent.classList.toggle("task-done");
    user.lists[selectedListID].items[selectedTaskID].isDone = !user.lists[selectedListID].items[selectedTaskID].isDone;
}

// rename task
function taskRename() {
    if (isEmpty(selectedTaskID)) {
        alert("Task not selected.");
    } else {
        let newTaskName = prompt("Rename task ", selectedList.items[selectedTaskID].name);

        if(isTaskNameValid(newTaskName, true)) {
            user.lists[selectedListID].items[selectedTaskID].name = newTaskName;
            selectedList = user.lists[selectedListID];
            saveUser();
        } else {
            alert("Task may only contain letters, numbers and spaces. Task can not be empty.");
        }
    }
}

// delete task
function taskDelete() {
    if (isEmpty(selectedTaskID)) {
        alert("Task not selected.");
    } else {
        const taskName = selectedList.items[selectedTaskID].name;

        if(window.confirm(`Delete: ${taskName} ?`)) {
            user.lists[selectedListID].items.splice(selectedTaskID, 1);
            alert(`Task "${taskName}" deleted.`);
            //clearSelectedList();
            saveUser();
        }
    }
}

// add new task
function addNewTask() {

    if (isEmpty(selectedListID)) {
        alert("List not selected.");
    } else {

        const inputTaskName = document.getElementById("input-new-task-name");

        if(isTaskNameValid(inputTaskName.value)) {
            // task object
            let task = {
                name: inputTaskName.value,
                isDone: false
            };
            // add task to list
            user.lists[selectedListID].items.push(task);
            // save user information
            saveUser();
            // clear input field
            inputTaskName.value = "";
            //show information to user
        } else {
            alert("Task may only contain letters, numbers and spaces. Task can not be empty.");
        }
    }
}

/******************************************************
 * Validation Functions
 ******************************************************/

/**
 * Verify if the string informed is empty or null
 */
function isEmpty(value) {

    if(value === null) return true;
    if(value.length === 0) return true;
    return false;
}

/**
 * Verify if the string informed is aphabet only.
 */
function isAlpha(value, space=false) {

    if (isEmpty(value)) return false;

    if(space) {
        return /^[A-Za-z\s]+$/.test(value);
    } else {
        return /^[A-Za-z]+$/.test(value);
    }
}

/**
 * Verify if the string informed is aphanumeric.
 */
function isAlphaNumeric(value, space=false) {

    if (isEmpty(value)) return false;

    if (space) {
        return /^[0-9a-zA-Z\s]+$/.test(value);
    } else {
        return /^[0-9a-zA-Z]+$/.test(value);
    }
}

/**
 * Verify if the email format is valid
 */
function isEmail(value) {

    if (isEmpty(value)) return false;
    // test() returns true if matches the regular expression
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value);
}

/**
 * Verify if user exists in localStorage
 */
function userExists(email) {
    // check is key exists in localStorage
    if (localStorage.getItem(email) === null) return false;

    return true;
}

/**
 * Hash a string using SHA-1. For more information visit:
 * http://caligatio.github.com/jsSHA/
 */
function hashString(text) {
    const sha1 = new jsSHA("SHA-1", "TEXT");
    sha1.update(text);
    return sha1.getHash("HEX");
}

/**
 * Verify if password and email match
 */
function checkPassword(email, password) {
    // verify if password was informed and user exists
    if(isEmpty(password) || !userExists(email)) return false;
    // load user information to check password
    loadUserAccount(email);
    // hash the password informed
    let passHash = hashString(password);
    // verify if the passwords hash are the same
    if(user.password !== passHash) {
        // password incorrect, reset user information
        clearUser();
        return false;
    }
    clearUser();
    return true;
}

/******************************************************
 * User functions
 ******************************************************/

/**
 * Load user information to global variable "user"
 */
function loadUserAccount(email) {
    // parse string to object
    user = JSON.parse(localStorage.getItem(email));
}

/**
 * Save user information to localStorage
 */
function saveUser() {
    localStorage.setItem(user.email, JSON.stringify(user));
}

/**
 * Clear user information variable.
 */
function clearUser() {
    user = {};
    isLogged = false;
    clearSelectedList();
    clearSelectedTask();
}

function clearSelectedList() {
    selectedList = {
        name: "",
        lists: []
    };
    selectedListID = "";
}

function clearSelectedTask() {
    selectedTaskID = "";
}

/******************************************************
 * General page functions
 ******************************************************/

/**
 * Change the window title
 */
function changeTitle(title) {
    document.title = `to-do list - ${title}`;
}


/**
 * Show notifications on page. Type colors based on bulma.io color classes.
 * https://bulma.io/documentation/elements/notification/#colors
 */
function showNotification(message, type="is-danger") {
    const notification = document.getElementById("notification");
    notification.classList.remove("is-hidden","is-danger","is-success", "is-primary", "is-link", "is-info", "is-warning");
    notification.classList.add(type);

    notification.innerHTML = `<button class="delete"></button>${message}`;
    notification.querySelector(".delete").addEventListener("click", function _close() {
        notification.classList.add("is-hidden");
        notification.querySelector(".delete").removeEventListener("click", _close, false);
    }, false);
}

/******************************************************
 * List functions
 ******************************************************/

/**
 * Verify if the list name is valid. List name must be unique.
 */
function isListNameValid(name) {

    if (isAlphaNumeric(name, true)) {

        for(let index in user.lists) {
            // list name exists
            if (user.lists[index].name === name) return false;
        }
        // list name is OK and is unique
        return true;
    }
    // not alphanumeric
    return false;
}


/**
 * Load the lists in the left menu
 */
function loadLists() {

    const html = (user.lists || []).map( (list, index) => {
        return (`
        <li>
            <a class="is-active button-list-select" id="l-${index}">
                ${list.name}
            </a>
        </li>
        `)
    }).join("");

    return html;
}

// load task html
function loadTasks(tasks) {

    const htmlTasks = (tasks || []).map( (task, index) => {
        return (`
        <tr class="task-id">
            <td class="task ${task.isDone ? "task-done": ""}">${task.name}</td>
            <td class="valign">
                <div class="buttons has-addons is-centered">
                    <span id="t-${index}" class="button button-task-done   is-small ${task.isDone ? "is-success": ""}">Done</span>
                    <span id="t-${index}" class="button button-task-rename is-small is-outlined is-info">Rename</span>
                    <span id="t-${index}" class="button button-task-delete is-small is-outlined is-danger">Delete</span>
                </div>
            </td>
        </tr>
        `);
    }).join("");
    return htmlTasks;
}

/**
 * Show the list information on page
 */
function showList(index) {
    // get elements to be modified
    const tbody = document.querySelector("#table-task > tbody");
    const ttitle = document.getElementById("table-list-name");

    // get list
    const list = user.lists[index];
    // get tasks of the list
    let tasks = list.items;

    // show table (remove the is-hidden css class)
    document.getElementById("column-task").classList.remove("is-hidden");
    // show list name in header of the table
    ttitle.innerText = list.name;

    const htmlTasks = (tasks || []).map( (task, index) => {
        return (`
        <tr id="t-${index}" class="task-id">
            <td class="task ${task.isDone ? "task-done": ""}">${task.name}</td>
            <td class="valign">
                <div class="buttons has-addons is-centered">
                    <span class="button button-task-done   is-small ${task.isDone ? "is-success": ""}">Done</span>
                    <span class="button button-task-rename is-small is-outlined is-info">Rename</span>
                    <span class="button button-task-delete is-small is-outlined is-danger">Delete</span>
                </div>
            </td>
        </tr>
        `);
    }).join("");

    tbody.innerHTML = htmlTasks;

}

/**
 * Get list index based on the name of the list.
 * List name must be unique.
 */
function getListIndexByName(name) {
    for(let index in user.lists) {
        // name must be unique
        if (user.lists[index].name === name) return index;
    }
}

/**
 * Get the index of a list, based on the button/link id.
 * List id format: l_X (X is a number)
 */
function getListIndexByID(id) {
    return getIDIndex(id);
}


/******************************************************
 * List - Tasks functions
 ******************************************************/

/**
 * Get the index of a task, based on the button/link id.
 * Task id format: t_X (X is a number)
 */
function getTaskIndexByID(id) {
    return getIDIndex(id);
}

/**
 * Verify if the task name is valid
 */
function isTaskNameValid(name) {
    return isAlphaNumeric(name, true);
}

/**
 * Get the index of an button/link id.
 * List id format: l_X (X is a number)
 */
function getIDIndex(id) {
    return parseInt(id.slice(2));
}
