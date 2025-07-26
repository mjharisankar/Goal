const goals = [
  "Mental/Emotional/Spiritual Wellbeing",
  "Love & Relationships",
  "Physical Health & Muscle Gain",
  "Organization & Structure",
  "Hobbies & Creativity",
  "Career & Skills",
  "Finance",
  "Family & Social Life"
];

const questions = [
  "What did I do well this week?",
  "What obstacles did I face?",
  "What will I improve next week?",
  "Rate progress (1-10)"
];

function loadForm(week) {
  const form = document.getElementById("review-form");
  form.innerHTML = "";
  goals.forEach(goal => {
    const section = document.createElement("div");
    section.className = "section";
    const title = document.createElement("h2");
    title.innerText = goal;
    section.appendChild(title);
    questions.forEach(q => {
      const label = document.createElement("label");
      label.innerText = q;
      const textarea = document.createElement("textarea");
      const safeId = `${goal.replace(/\\s+/g, '_')}-${q.replace(/\\s+/g, '_')}-week${week}`;
      textarea.id = safeId;
      const saved = localStorage.getItem(safeId);
      if (saved) textarea.value = saved;
      section.appendChild(label);
      section.appendChild(textarea);
    });
    form.appendChild(section);
  });
}

function saveReview() {
  const week = document.getElementById("week").value;
  goals.forEach(goal => {
    questions.forEach(q => {
      const safeId = `${goal.replace(/\\s+/g, '_')}-${q.replace(/\\s+/g, '_')}-week${week}`;
      const value = document.getElementById(safeId).value;
      localStorage.setItem(safeId, value);
    });
  });
  alert("Review saved for Week " + week);
}

function loadReview() {
  const week = document.getElementById("week").value;
  loadForm(week);
}

function downloadAllReviews() {
  let content = "Weekly Goal Reviews\\n\\n";
  for (let w = 1; w <= 52; w++) {
    let weekData = "";
    goals.forEach(goal => {
      weekData += `\\nWeek ${w} - ${goal}\\n`;
      questions.forEach(q => {
        const safeId = `${goal.replace(/\\s+/g, '_')}-${q.replace(/\\s+/g, '_')}-week${w}`;
        const value = localStorage.getItem(safeId);
        if (value && value.trim() !== "") {
          weekData += `${q}: ${value}\\n`;
        }
      });
    });
    if (weekData.trim() !== `Week ${w} - ${goals[0]}`) {
      content += weekData + "\\n";
    }
  }
  const element = document.createElement("a");
  const blob = new Blob([content], { type: "application/pdf" });
  element.href = URL.createObjectURL(blob);
  element.download = "Weekly_Reviews.pdf";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

window.onload = () => {
  const week = document.getElementById("week").value;
  loadForm(week);
  const dlBtn = document.createElement("button");
  dlBtn.innerText = "Download All Reviews (PDF)";
  dlBtn.onclick = downloadAllReviews;
  document.body.appendChild(dlBtn);
};
