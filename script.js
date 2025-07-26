let goals = JSON.parse(localStorage.getItem("goals")) || [];

function displayGoals() {
  const list = document.getElementById("goal-list");
  list.innerHTML = "";
  goals.forEach((goal, index) => {
    const div = document.createElement("div");
    div.className = "goal-item";
    div.innerHTML = `
      <span>${goal.text}</span>
      <button onclick="toggleGoal(${index})">${goal.done ? "Undo" : "Done"}</button>
      <button onclick="deleteGoal(${index})">Delete</button>
    `;
    if (goal.done) div.style.textDecoration = "line-through";
    list.appendChild(div);
  });
}

function addGoal() {
  const input = document.getElementById("goal-input");
  if (input.value.trim() !== "") {
    goals.push({ text: input.value, done: false });
    input.value = "";
    saveGoals();
  }
}

function toggleGoal(index) {
  goals[index].done = !goals[index].done;
  saveGoals();
}

function deleteGoal(index) {
  goals.splice(index, 1);
  saveGoals();
}

function saveGoals() {
  localStorage.setItem("goals", JSON.stringify(goals));
  displayGoals();
}

displayGoals();
