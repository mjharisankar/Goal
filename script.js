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
      let goalText = `${goal}\n`;

      questions.forEach(q => {
        const safeId = `${goal.replace(/\\s+/g, '_')}-${q.replace(/\\s+/g, '_')}-week${w}`;
        const value = localStorage.getItem(safeId);
        if (value && value.trim() !== "") {
          goalHasData = true;
          goalText += `${q}: ${value}\n\n`;
        }
      });

      if (goalHasData) {
        hasData = true;
        pdf.setFontSize(14);
        const lines = pdf.splitTextToSize(goalText, 180);
        pdf.text(lines, 10, y);
        y += lines.length * 7 + 5;
        if (y > 270) {
          pdf.addPage();
          y = 20;
        }
      }
    });

    if (!hasData) {
      pdf.setFontSize(12);
      pdf.text("No data entered for this week.", 10, 40);
    }
  }

  pdf.save("Weekly_Reviews.pdf");
}
