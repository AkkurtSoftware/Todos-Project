//Tüm Elementler Seçildi
const form = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo");
const todoList = document.querySelector(".list-group");
const firstCardBody = document.querySelectorAll(".card-body")[0];
const secondCardBody = document.querySelectorAll(".card-body")[1];
const filter = document.querySelector("#filter");
const clear = document.querySelector("#clear-todos");

eventListeners();

function eventListeners() {//Tüm Event Listenerlar
    form.addEventListener("submit",addTodo);
    document.addEventListener("DOMContentLoaded",loadAllTodosToUI);
    secondCardBody.addEventListener("click",deleteTodoToUI);
    filter.addEventListener("keyup",filterTodos);
    clear.addEventListener("click",clearAllTodos);
}

function clearAllTodos() {
    //Arayüzden todoları kaldırma
    if (confirm("Tüm todoları silmek istediğinize emin misiniz?")) {
        //todoList.innerHTML = "";//Yavaş yöntem

        while (todoList.firstElementChild != null) {
            todoList.removeChild(todoList.firstElementChild);
        }
        localStorage.removeItem("todos");

        if (todoList.firstElementChild === null) {
            showAlert("success","Bütün todolar başarılı bir şekilde silindi");
        }
    }
}
function filterTodos(e) {
    const filterValue = e.target.value.toLowerCase();
    const listItems = document.querySelectorAll(".list-group-item");

    listItems.forEach(function(listItem){
        const text = listItem.textContent.toLowerCase();

        if (text.indexOf(filterValue) === -1) {
            //Bulunamadı
            listItem.setAttribute("style","display : none !important");
        } else {
            listItem.setAttribute("style","display : block");
        }
    });
}
function deleteTodoToUI(e) {
    if (e.target.className === "fa fa-remove") {
        const liItem = e.target.parentElement.parentElement;
        liItem.remove();
        deleteTodoToStorage(liItem.textContent);
        showAlert("success","Todo başarı ile silindi");
    }
}
function deleteTodoToStorage(deletetodo) {
    let todos = getTodosFromStorage();

    todos.forEach(function(todo,index){
        if (todo === deletetodo) {
            todos.splice(index,1);//Arrayden değeri silebiliriz
        }
    });

    localStorage.setItem("todos",JSON.stringify(todos));
}
function loadAllTodosToUI() {
    let todos = getTodosFromStorage();

    todos.forEach(function(todo){
        addTodoToUI(todo);
    });
}
function addTodo(e) {

    const newTodo = todoInput.value.trim();

    if (newTodo === "") {
        showAlert("danger","Lütfen bir todo giriniz!");
    } else {
        addTodoToUI(newTodo);
        addTodoToStorage(newTodo);
        showAlert("success","Todo başarı ile eklendi");
    }


    e.preventDefault();
    todoInput.value = "";
}
function addTodoToUI(newTodo) {//String değerini liste item'ı olarak ekleyecek
    //List Item oluşturma
    const listItem = document.createElement("li");
    listItem.className = "list-group-item d-flex justify-content-between";
    
    //Link oluşturma
    const link = document.createElement("a");
    link.href = "#";
    link.className = "delete-item";
    link.innerHTML = "<i class='fa fa-remove'></i>";

    //Text Node ekleme
    listItem.appendChild(document.createTextNode(newTodo));
    listItem.appendChild(link);

    //Todo List'e List Item'ı ekleme
    todoList.appendChild(listItem);
}
function getTodosFromStorage() {//Storage'dan todoları almak
    let todos;
    if (localStorage.getItem("todos") === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }
    return todos;
}
function addTodoToStorage(newTodo) {
    let todos = getTodosFromStorage();

    todos.push(newTodo);

    localStorage.setItem("todos",JSON.stringify(todos));
}
function showAlert(type,message) {
    //success, danger, info, primary, secondary, warning, light, dark
    const alert = document.createElement("div");

    alert.className = `alert alert-${type}`;
    alert.textContent = message;

    firstCardBody.appendChild(alert);

    //setTimeout
    setTimeout(function(){
        alert.remove();
    },2500);
}