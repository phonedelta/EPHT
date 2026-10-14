# Logo EPHT

## Source

Le logo provient du site officiel actuel (`epht.ma`). Aucun fichier source (AI, SVG, PDF) n'était disponible : le seul original est une image JPEG de **174 × 127 px**, conservée ici sans modification dans [`logo-epht-site-historique.jpg`](logo-epht-site-historique.jpg).

## Vectorisation

Pour un affichage net sur tous les écrans, le logo a été retracé en vectoriel à partir de mesures prises sur cette image. Rien n'a été inventé : chaque forme est celle du fichier d'origine.

Ce que les mesures ont établi :

- **Proportions.** Le site historique publie deux versions du logo, déformées en sens opposé (étirée sur la page d'accueil, comprimée sur les autres). En prenant pour référence le point noir, qui doit être rond, les deux versions donnent la même largeur d'origine : 154 px pour 127 px de haut. Le tracé reprend ces proportions.
- **Croissant.** Ses deux bords sont des arcs de cercle de même rayon, décalés l'un par rapport à l'autre (écart moyen entre le tracé et l'image : moins d'un pixel).
- **Couleurs.** Dégradé du croissant de `#5AAEC4` à `#B8E3EE`, relevé sur l'image.

Les mesures sont dans [`geometry.json`](geometry.json). Les fichiers SVG se régénèrent avec :

```bash
node docs/brand/build-logo.mjs <dossier-de-sortie>
```

## Limites à connaître

- Les deux lignes de signature sous le sigle (en arabe et en français) mesurent quatre à six pixels de haut dans l'original : elles ne peuvent pas être retracées lettre à lettre avec certitude. La version web reprend donc l'emblème et le sigle « EPHT ». Le nom complet de l'école est écrit en texte à côté du logo, là où il a sa place (pied de page).
- L'original présente un léger liseré mauve le long du bord intérieur du croissant, probablement dû à la compression de l'image. Il n'a pas été reproduit.

**Si l'école dispose du fichier source de son logo**, il doit remplacer ce tracé : il suffit de substituer les fichiers de `frontend/public/brand/` et le composant `frontend/src/components/brand/Logo.tsx`.
