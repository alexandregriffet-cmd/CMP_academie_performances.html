// CMP Patch Universal v1
// Masque "Détail par item", supprime Export CSV/JSON et garde uniquement Export PDF

window.addEventListener("DOMContentLoaded", () => {
  // Supprimer boutons Export CSV/JSON
  const csvBtn = document.querySelector("#export-csv, button#export-csv, button:contains('Exporter CSV')");
  if (csvBtn) csvBtn.remove();
  const jsonBtn = document.querySelector("#export-json, button#export-json, button:contains('Exporter JSON')");
  if (jsonBtn) jsonBtn.remove();

  // Supprimer via texte si nécessaire
  document.querySelectorAll("button").forEach(btn => {
    if (btn.textContent.includes("Exporter CSV") || btn.textContent.includes("Exporter JSON")) {
      btn.remove();
    }
  });

  // Masquer la section "Détail par item" ou "Détail par thème"
  const detailSection = document.querySelector("#detail-par-item, #detail-par-theme");
  if (detailSection) {
    detailSection.style.display = "none";
    detailSection.classList.add("no-print");
  }
});
