# Design system

Les jetons sont déclarés dans [`frontend/src/app/globals.css`](../frontend/src/app/globals.css) (bloc `@theme` de Tailwind CSS 4).

## Logo

Le logo est le logo officiel de l'EPHT, repris du site historique. Le seul fichier disponible étant une image de 174 × 127 px, il a été **retracé en vectoriel** à partir de mesures faites sur ce fichier, sans rien y ajouter ni en modifier le dessin. Détails, limites et fichiers sources : [`brand/README.md`](brand/README.md).

| Usage | Fichier ou composant |
| --- | --- |
| En-tête, administration, pages de connexion | `<Logo />` — `frontend/src/components/brand/Logo.tsx` |
| Pied de page et fonds sombres | `<Logo variant="negative" />` (lettres et point en blanc) |
| Export statique (e-mails, partage) | `frontend/public/brand/logo-epht.svg`, `logo-epht-negatif.svg` |
| Favicon | `frontend/src/app/icon.svg`, `favicon.ico`, `apple-icon.png` — l'emblème seul sur fond anthracite, lisible à 16 px |

Le logo conserve ses proportions : ne pas l'étirer, ne pas en séparer les éléments en dehors du favicon.

## Couleurs

La palette indicative du cahier des charges a été confrontée aux couleurs réelles du logo. Le croissant va d'un cyan clair `#B8E3EE` à un cyan soutenu `#5AAEC4`, teinte 192° : les valeurs proposées étaient justes, elles ont été conservées à quelques points près et prolongées vers le sombre pour le texte.

| Jeton | Valeur | Usage |
| --- | --- | --- |
| `cyan-50` | `#EFF8FA` | Fond de section teinté |
| `cyan-100` | `#DFF1F6` | Fond d'attente d'une image |
| `cyan-300` | `#A5DDEA` | Cyan secondaire, accents sur fond sombre |
| `cyan-400` | `#7CC8DA` | **Cyan principal** : boutons, bandeau d'appel |
| `cyan-500` | `#5BB5CA` | Cyan profond : filets, repères |
| `cyan-600` | `#3D9BB2` | Numéros en grand corps |
| `cyan-700` | `#236E82` | **Texte et liens en cyan** sur fond clair |
| `ink` | `#18252B` | Titres, pied de page |
| `ink-soft` | `#3B4A52` | Texte courant |
| `muted` | `#5A6A72` | Texte secondaire |
| `background` | `#F6FAFB` | Fond alterné |
| `surface` | `#FCFDFE` | Fond principal |
| `line` | `#DFEAEF` | Filets et bordures |

### Contrastes

Le cyan du logo est trop clair pour porter du texte sur fond blanc (1,9:1). Deux règles en découlent :

- sur un bouton cyan, le texte est **sombre** (`ink` sur `cyan-400` : 8,3:1) ;
- un texte ou un lien en cyan utilise **`cyan-700`** (5,8:1 sur blanc).

Le gris secondaire proposé (`#64747C`) passait de justesse le seuil AA sur fond teinté ; il a été légèrement foncé (`#5A6A72`, 5,3:1).

## Typographie

| Rôle | Police | Classe |
| --- | --- | --- |
| Titres éditoriaux | DM Serif Display (romain et italique) | `font-display` |
| Navigation, paragraphes, formulaires | Manrope | `font-sans` (par défaut) |

Les deux polices sont servies par le site lui-même (`next/font`), sans appel à un service tiers à l'affichage.

| Classe | Usage | Taille |
| --- | --- | --- |
| `text-display` | Titre du hero, une fois par page | 40 → 72 px |
| `text-title` | Titre de section | 30 → 44 px |
| `text-subtitle` | Titre d'élément (formation, espace) | 22 → 28 px |
| `text-lead` | Texte d'introduction | 17 → 19 px |
| `eyebrow` | Surtitre en capitales espacées | 12 px |

Les textes venus de l'API suivent les usages typographiques français (apostrophe courbe, espaces insécables devant `? ! ; :`), appliqués côté Laravel par `App\Support\Typography`.

## Mise en page

- `container-page` : largeur maximale 1344 px, marges de 20 px (mobile) à 48 px (grand écran).
- `section-y` : espacement vertical des sections.
- Grille de 12 colonnes ; les sections alternent volontairement leurs compositions (5/7, 7/5, mosaïques) plutôt que de répéter une même grille de cartes.
- Angles : 2 px sur les boutons, aucun arrondi sur les photographies. Pas d'ombres portées, hormis le menu déroulant.

## Composants

| Composant | Rôle |
| --- | --- |
| `ButtonLink` | Lien-bouton. Variantes `primary`, `ink`, `outline`, `outline-strong`, `outline-light`. |
| `ArrowLink` | Lien de texte avec flèche, pour les actions secondaires. |
| `SectionHeader` | Surtitre, titre de section, introduction. |
| `Photo` | Image de la médiathèque : recadrage sur le point d'intérêt, couleur d'attente, mention d'illustration. |
| `Reveal`, `RevealGroup`, `RevealItem`, `RevealImage` | Apparitions au défilement. |
| `Lightbox` | Visionneuse plein écran (clavier, balayage, vidéo). |
| `PageIntro`, `StatusPage`, `Placeholder` | En-têtes de page et écrans d'état. |

## Photographies

Toutes les images viennent de la médiathèque Laravel. Une image marquée `is_illustrative` porte la mention **« Photo d'illustration »** : elle n'est jamais présentée comme une vue de l'école. La mention disparaît d'elle-même quand une photographie officielle la remplace dans l'administration — aucun changement de code n'est nécessaire.

## Animations

Réalisées avec Motion, toujours sur `transform` et `opacity`.

| Zone | Effet |
| --- | --- |
| Hero | Lignes du titre montant derrière un masque, voile qui découvre l'image, apparition décalée du texte et des boutons |
| Défilement | Fondu et légère remontée ; apparitions échelonnées dans les listes ; voile sur les photographies |
| Survol | Zoom lent des photographies, soulignement qui se déploie, flèche qui glisse |
| En-tête | Se compacte au défilement, s'efface en descendant, revient en remontant |
| Menu mobile | Ouverture en fondu, entrées échelonnées |
| Galeries | Fondu enchaîné entre les espaces ; ouverture et navigation de la visionneuse |

`prefers-reduced-motion` est respecté : les déplacements et les zooms sont supprimés, seuls les fondus subsistent. Sans JavaScript, tout le contenu reste visible.
