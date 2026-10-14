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

La palette suit une répartition **60/30/10**, appréciée sur l'ensemble du site et non composant par composant. Les teintes partent du croissant du logo (de `#B8E3EE` à `#5AAEC4`, teinte 192°).

| Part | Jeton | Valeur | Usage |
| --- | --- | --- | --- |
| 60 % | `background` | `#F8FAFA` | Fond dominant, légèrement bleuté |
| 30 % | `cyan-100` | `#E4F2F5` | Fond secondaire : formations, admissions, témoignages, aplats décoratifs |
| 10 % | `cyan-500` | `#4AAFC5` | **Turquoise EPHT** : boutons principaux, repères, indicateurs actifs, bloc d'appel final |

| Jeton | Valeur | Usage |
| --- | --- | --- |
| `ink` | `#17262C` | Titres, texte principal, sections sombres, bandeau de coordonnées, pied de page |
| `ink-soft` | `#3A4A50` | Paragraphes longs ; texte secondaire sur fond `cyan-100` |
| `muted` | `#66757B` | Texte secondaire, descriptions, libellés |
| `surface` | `#FFFFFF` | Cartes, en-tête, sections alternées |
| `line` | `#E1E8EA` | Filets et bordures |
| `line-strong` | `#C9D5D9` | Bordures de boutons secondaires et de champs |
| `cyan-50` | `#F1F8FA` | Survols, pastilles |
| `cyan-200`, `cyan-300` | `#C9E6EE`, `#9DD3E0` | Survols, accents sur fond sombre |
| `cyan-600` | `#1E8096` | **Turquoise profond** : boutons principaux (texte blanc), filet des boutons secondaires, indicateurs actifs |
| `cyan-700` | `#1F7186` | **Texte et liens en turquoise** sur fond clair ; survol des boutons principaux |

### Contrastes

Le turquoise EPHT est trop clair pour porter un texte blanc (2,6:1) ou un petit texte sur fond clair (2,4:1). Trois règles en découlent :

- les boutons principaux utilisent le turquoise profond `cyan-600` avec un texte blanc (4,6:1) ; sur un aplat `cyan-500` (bloc d'appel final), le texte reste **sombre** (`ink` : 6,1:1) ;
- un texte ou un lien en turquoise utilise **`cyan-700`** (5,3:1 sur `background`, 4,9:1 sur `cyan-100`) ;
- `muted` passe le seuil AA sur `background` et `surface` (4,6:1 et 4,8:1) mais pas sur `cyan-100` (4,2:1) : sur ce fond, le texte secondaire passe à `ink-soft` (prop `tinted` de `SectionHeader`).

## Typographie

| Rôle | Police | Graisses |
| --- | --- | --- |
| Titres, surtitres, numéros | Plus Jakarta Sans | 500 à 600 |
| Navigation, paragraphes, boutons, formulaires | DM Sans | 400 (texte), 500 (navigation, boutons) |
| Hero de l'accueil : seconde partie du titre | Newsreader (taille optique automatique) | 500 |
| Hero de l'accueil : mention manuscrite | Meow Script | 400 |

Les polices sont servies par le site lui-même (`next/font`), sans appel à un service tiers à l'affichage. Newsreader et Meow Script sont déclarées dans `components/home/heroFonts.ts` : elles ne sont préchargées que sur l'accueil. Les titres sont légèrement resserrés (`letter-spacing` négatif) et leurs espaces légèrement élargies, Plus Jakarta Sans ayant des espaces étroites.

| Classe | Usage | Taille |
| --- | --- | --- |
| `text-display` | Titre principal d'une page (`h1`) | 36 → 56 px |
| `text-title` | Titre de section (`h2`) | 28 → 40 px |
| `text-subtitle` | Titre d'élément : formation, espace, engagement (`h3`) | 19 → 22 px |
| `text-lead` | Texte d'introduction | 17 → 19 px |
| `eyebrow` | Surtitre en capitales espacées | 12 px |

Les textes venus de l'API suivent les usages typographiques français (apostrophe courbe, espaces insécables devant `? ! ; :`), appliqués côté Laravel par `App\Support\Typography`.

## Mise en page

- `container-page` : 1240 px de contenu, marges de 20 px (mobile), 32 px (tablette) et 40 px (grand écran).
- `section-y` : espacement vertical des sections, 56 px (mobile), 80 px (tablette), 96 px (grand écran).
- Grille de 12 colonnes ; les sections varient leurs compositions (texte et image, grille de cartes, triptyque, frise, mosaïque) plutôt que de répéter une même grille.
- Angles : 8 px sur les boutons et les champs, 12 px sur les cartes et les photographies, 16 px sur le bloc d'appel final.
- Bordures de 1 px ; ombres réservées au menu déroulant, au panneau mobile et au survol des cartes, toujours très légères.
- Motif récurrent : un filet fin surmonté d'un court repère turquoise (piliers de l'école, engagements, pédagogie).

## Composants

| Composant | Rôle |
| --- | --- |
| `ButtonLink` | Lien-bouton, 40 px (`sm`), 44 px (`md`) ou 46 px (`lg`, hero). Variantes `primary` (turquoise profond, texte blanc), `ink`, `outline` (filet turquoise), `outline-strong` (sur turquoise), `outline-light` (sur fond sombre). |
| `buttonClasses()` | Les mêmes classes pour un `<button>` natif. |
| `ArrowLink` | Lien de texte avec flèche, pour les actions secondaires. |
| `Eyebrow`, `SectionHeader` | Surtitre en capitales espacées ; titre de section et introduction. |
| `Photo` | Image de la médiathèque : recadrage sur le point d'intérêt, couleur d'attente. |
| `FormationCard` | Carte de formation : photographie, numéro, famille, titre, présentation, durée et diplôme s'ils sont confirmés. |
| `Reveal`, `RevealGroup`, `RevealItem`, `RevealImage` | Apparitions au défilement. |
| `Lightbox` | Visionneuse plein écran (clavier, balayage, vidéo). |
| `PageHero` | En-tête des pages intérieures, dans la composition du hero de l'accueil : fil d'Ariane (et ses données structurées), surtitre, titre, introduction, actions et, facultativement, la photographie de la page sur son aplat cyan (`PageVisual`). |
| `FormationGrid`, `FormationCatalog` | Cartes de formations (jusqu'à quatre par rangée) ; catalogue filtrable par famille de métiers. |
| `StepsTimeline` | Étapes numérotées : frise horizontale sur grand écran, verticale sur mobile. |
| `PhotoGallery` | Galerie : mosaïque éditoriale sur grand écran (séries de six, colonnes alignées), filtre par catégorie, visionneuse. |
| `NewsList`, `ArticleCard` | Actualités : article mis en avant, filtre par catégorie, « Voir plus ». |
| `FilterChips`, `EmptyState`, `ContactPanel` | Filtres en pastilles ; message de liste vide ; encadré d'appel au contact (téléphone, e-mail). |
| `StatusPage`, `UnavailablePage`, `Placeholder` | Écrans d'état et pages en attente de contenu. |

Les champs de formulaire (`input`, `select`, `textarea`, `label`) reçoivent leur style de base dans `globals.css` : hauteur de 44 px, trait fin, focus turquoise.

## Photographies

Toutes les images viennent de la médiathèque Laravel. Les photographies d'illustration restent marquées `is_illustrative` dans la médiathèque, mais ni mention ni crédit ne sont affichés sur le site, à la demande de l'école. Leurs auteurs sont recensés dans [`contenus-a-confirmer.md`](contenus-a-confirmer.md).

## Animations

Réalisées avec Motion, toujours sur `transform` et `opacity`. Durées : 150 à 250 ms pour les interactions (survols, boutons, liens), 300 à 500 ms pour les apparitions de contenu ; courbe de sortie douce (`ease-out-soft`).

| Zone | Effet |
| --- | --- |
| Hero | Lignes du titre montant derrière un masque, apparition décalée du texte, des boutons et des repères ; composition photographique (aplat, vignette en perspective, mention manuscrite) ; carrousel de trois photographies qui défile toutes les 5 s, s'interrompt au survol ou au focus et s'arrête dès qu'on le manipule |
| Défilement | Fondu et légère remontée (16 px) ; apparitions échelonnées dans les listes ; voile sur les photographies |
| Survol | Zoom discret des photographies, soulignement qui se déploie, flèche qui glisse, carte qui se soulève de 2 px |
| En-tête | Fond translucide au défilement, s'efface en descendant, revient en remontant ; indicateur turquoise de la page active |
| Menu mobile | Panneau glissant depuis la droite sur un voile, entrées échelonnées |
| Infrastructures | Défilement automatique des espaces toutes les 5 s quand la galerie est à l'écran (interrompu au survol ou au focus, arrêté dès qu'un espace est choisi) ; indicateur d'onglet qui glisse, fondu enchaîné des photographies, barre de progression |
| Galeries | Photos qui apparaissent l'une après l'autre ; ouverture et navigation de la visionneuse |
| Changement de page | API View Transitions (`PageTransition`, dans chaque page) : l'ancienne page s'efface en remontant à peine (170 ms), la nouvelle apparaît en douceur (460 ms) ; l'en-tête reste immobile. Sans prise en charge par le navigateur, le changement est instantané |
| Titres | Les mots montent un à un derrière un masque (`AnimatedText`) : titres de page et de section, bloc d'appel final |
| Profondeur | Photographies qui glissent doucement dans leur cadre au défilement (`RevealImage parallax`) ; dans les heros, photo, vignette, aplat et mention avancent à des vitesses différentes |
| Lecture | Barre de progression turquoise sous l'en-tête ; bouton de retour en haut de page, avec son anneau de progression |
| Menu | L'indicateur turquoise glisse vers l'entrée survolée puis revient sur la page active |
| Filtres et boutons | Le fond de la pastille active glisse d'un filtre à l'autre ; les boutons s'élèvent d'un pixel au survol et s'enfoncent légèrement au clic |
| Questions fréquentes | Ouverture et fermeture en douceur des accordéons (`details.disclosure`), là où le navigateur sait animer la hauteur |

`prefers-reduced-motion` est respecté : les déplacements, les zooms, la parallaxe et les transitions de page sont supprimés, seuls les fondus subsistent. Sans JavaScript, tout le contenu reste visible.
