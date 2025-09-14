function exportPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const report = document.getElementById("report");

  doc.html(report, {
    callback: function (doc) {
      doc.save("rapport_cmp.pdf");
    },
    x: 10,
    y: 10,
    html2canvas: { scale: 0.8 }
  });
}