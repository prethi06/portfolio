let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
const taskList = document.getElementById("taskList");
let undoStack=[];

function renderTasks() {
  taskList.innerHTML = "";

  tasks.forEach((task, index) => {
    let li = document.createElement("li");
    li.className = task.completed ? "completed" : "";
    li.onclick=()=> toggleTask(index);
    li.innerHTML=`
    <span>${task.text}</span>
    `;
    taskList.appendChild(li);
  });

  localStorage.setItem("tasks", JSON.stringify(tasks));
  updateProgress();
}

const input= document.getElementById("taskInput");
input.addEventListener("keydown", function (e){
    if(e.key ==="Enter") {
      addTask();
    }
  });

function addTask() {
  const input = document.getElementById("taskInput");

  if (input.value.trim() === "") return;

  tasks.push({
    text: input.value,
    completed: false
  });

  input.value = "";

  localStorage.setItem("tasks",JSON.stringify(tasks));
  renderTasks();
  updateProgress();
}

function deleteCompleted() {
  tasks = tasks.filter(task => !task.completed);

  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
  updateProgress();
}

function toggleTask(index) {
  if (!tasks[index].completed) {
    undoStack.push({
      task: { ...tasks[index] },
      index: index
    });
  }

  tasks[index].completed = !tasks[index].completed;

  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
  updateProgress();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  renderTasks();
  updateProgress();
}

function updateProgress() {
  const total = tasks.length;
  const completed = tasks.filter(task => task.completed).length;

  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  document.getElementById("progressBar").style.width = percent + "%";
  document.getElementById("progressText").textContent =
    percent + "% Completed";
  
}

function undoLast() {
  if (undoStack.length === 0) return;

  const last = undoStack.pop();

  tasks.splice(last.index, 0, {
    ...last.task,
    completed: false
  });

  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
  updateProgress();
}

renderTasks();