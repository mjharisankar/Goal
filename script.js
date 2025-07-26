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
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();
  let firstPage = true;

  for (let w = 1; w <= 52; w++) {
    let hasData = false;

    if (!firstPage) pdf.addPage();
    firstPage = false;

    pdf.setFontSize(18);
    pdf.text(`Week ${w} Review`, 10, 20);
    let y = 30;

    goals.forEach(goal => {
      let goalHasData = false;
      let linesArray = [];

      linesArray.push(goal);

      questions.forEach(q => {
        const safeId = `${goal.replace(/\\s+/g, '_')}-${q.replace(/\\s+/g, '_')}-week${w}`;
        const value = localStorage.getItem(safeId);
        if (value && value.trim() !== "") {
          goalHasData = true;
          linesArray.push(`${q}: ${value}`);
          linesArray.push(""); // blank line between questions
        }
      });

      if (goalHasData) {
        hasData = true;
        pdf.setFontSize(14);
        const wrapped = pdf.splitTextToSize(linesArray, 180);
        wrapped.forEach(line => {
          pdf.text(line, 10, y);
          y += 7;
          if (y > 270) {
            pdf.addPage();
            y = 20;
          }
        });
        y += 5; // extra space after each goal
      }
    });

    if (!hasData) {
      pdf.setFontSize(12);
      pdf.text("No data entered for this week.", 10, 40);
    }
  }

  pdf.save("Weekly_Reviews.pdf");
}

window.onload = () => {
  const week = document.getElementById("week").value;
  loadForm(week);
  const dlBtn = document.createElement("button");
  dlBtn.innerText = "Download All Reviews (PDF)";
  dlBtn.onclick = downloadAllReviews;
  document.body.appendChild(dlBtn);
};
