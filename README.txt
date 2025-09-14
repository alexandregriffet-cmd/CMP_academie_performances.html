CMP – Hotfix PDF (logo centré + résultats uniquement) • v1
==========================================================

Ce patch n'écrase PAS votre page. Il agit "par dessus" :
- supprime les boutons Exporter CSV/JSON s'ils existent
- masque définitivement le bloc "Détail par item" (écran + PDF)
- ajoute/garantit le bouton "Exporter PDF" si besoin
- exporte UNIQUEMENT la carte "Résultats"
- centre votre logo (bandeau) en haut du PDF
- pagine automatiquement si les résultats dépassent une page

Installation (GitHub Pages) — 30 secondes
-----------------------------------------
1) Déposez ces 2 fichiers à la RACINE de votre dépôt :
   - cmp-hotfix.css
   - cmp-hotfix.js

2) Ouvrez votre fichier : CMP_academie_performances.html
   et juste AVANT </head>, ajoutez :
     <link rel="stylesheet" href="cmp-hotfix.css">

   puis juste AVANT </body>, ajoutez :
     <script src="cmp-hotfix.js"></script>

3) Sauvegardez, poussez sur la branche principale,
   puis forcez le rafraîchissement (Cmd/Ctrl + Shift + R).

Aucune autre manipulation nécessaire.

Si votre page n'a pas exactement le titre H2 "Résultats",
le script basculera automatiquement sur la carte contenant #scoreTable.

—
Support : si vous souhaitez une version "page de garde PDF" (logo centré + titre + participant + date en page 1, puis les résultats en page 2), demandez-moi et je vous fournis un hotfix v2.