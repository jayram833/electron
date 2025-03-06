const { ipcRenderer } = window.electronAPI


const btnAdd = document.querySelector("#btn-add-task");

btnAdd.addEventListener("click",
    function () {
        const inputText = document.querySelector(".input-text");
        const task = inputText.value.trim();

        if (task) {
            ipcRenderer.send("save-task", task);
            inputText.value = "";
            loadTasks();
        }
    }
)

function loadTasks() {
    ipcRenderer.send('get-tasks')
}

ipcRenderer.on("load-tasks", function (event, tasks) {
    const taskList = document.querySelector("#task-list");
    taskList.innerHTML = tasks.map(task => `<li class="list-item">${task}</li>`).join("")
})
loadTasks();


const btnGetData = document.querySelector(".get-data");


const getData = async function () {
    try {
        const response = await fetch("https://reqres.in/api/users?page=2");
        if (!response.ok) throw new Error("HTTP error");
        const { data } = await response.json();
        console.log(data)

    } catch (e) {
        console.error(e.message)
    }
}

btnGetData.addEventListener("click", function () {
    getData()
})