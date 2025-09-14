CMP Patch Universal v1
======================

Ce patch corrige ton questionnaire CMP :
- Supprime les boutons "Exporter CSV" et "Exporter JSON"
- Cache la section "Détail par item / thème" (ni visible ni exportée en PDF)
- Ajoute un seul bouton "Exporter PDF" (fixe en haut à droite)

Installation :
1. Copie `cmp_patch_hide_details.js` et `export-pdf.js` dans le même dossier que ta page CMP (HTML).
2. Dans ton HTML CMP (avant </body>), ajoute :

<script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
<script src="export-pdf.js"></script>
<script src="cmp_patch_hide_details.js"></script>

3. Recharge la page. Tu verras uniquement le bouton Exporter PDF, et les détails auront disparu.

