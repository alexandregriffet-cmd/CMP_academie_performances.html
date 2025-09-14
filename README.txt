# CMP – Compétences Mentales de Performances (inspiré OMSAT-4)

## Déploiement GitHub Pages
1. Poussez ces fichiers sur la branche `main` de votre dépôt.
2. Activez **Settings → Pages → Deploy from branch** (`main` / root).
3. L'URL racine redirige vers **CMP_academie_performances.html**.

## Fichiers
- `CMP_academie_performances.html` : page principale (questionnaire + résultats en % avec étoile à 10 branches, exports CSV/JSON).
- `index.html` : redirection automatique vers la page ci-dessus (utile pour GitHub Pages).
- `questions.json` : banque d'items (60), dimensions (10), règles d'inversion.
- `assets/bandeau.jpg` : visuel bandeau (modifiable).

## Modifs rapides
- Changer le nom/texte dans `questions.json` et les titres HTML si besoin.
- Remplacer `assets/bandeau.jpg` par votre visuel (même nom de fichier).
