// Export PDF propre avec logo + exclusion des .no-print

async function exportPDF() {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF("p", "mm", "a4");

  const report = document.querySelector("#report, main, body");
  if (!report) {
    alert("Section rapport introuvable");
    return;
  }

  // Convertir en canvas via html2canvas
  const canvas = await html2canvas(report, { scale: 2, ignoreElements: (el) => el.classList.contains("no-print") });
  const imgData = canvas.toDataURL("image/png");
  const imgProps = pdf.getImageProperties(imgData);
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

  pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
  pdf.save("rapport.pdf");
}

// Créer bouton PDF si absent
window.addEventListener("DOMContentLoaded", () => {
  if (!document.querySelector("#export-pdf")) {
    const btn = document.createElement("button");
    btn.id = "export-pdf";
    btn.textContent = "Exporter PDF";
    btn.style.position = "fixed";
    btn.style.top = "10px";
    btn.style.right = "10px";
    btn.style.zIndex = 1000;
    btn.onclick = exportPDF;
    document.body.appendChild(btn);
  }
});
