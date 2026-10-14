/**
 * Textes d'interface en français : navigation, boutons, libellés.
 *
 * Les contenus éditoriaux (titres de sections, présentations, formations,
 * actualités, coordonnées) ne figurent pas ici : ils viennent de l'API.
 */
export const fr = {
  common: {
    skipToContent: "Aller au contenu",
    illustrativePhoto: "Photo d’illustration",
    photoCredit: "Photo",
    readMore: "Lire la suite",
    backToHome: "Retour à l’accueil",
    close: "Fermer",
    previous: "Précédent",
    next: "Suivant",
  },

  nav: {
    label: "Navigation principale",
    openMenu: "Ouvrir le menu",
    closeMenu: "Fermer le menu",
    home: "Accueil",
    school: "L’École",
    formations: "Formations",
    allFormations: "Toutes les formations",
    admissions: "Admissions",
    infrastructures: "Infrastructures",
    studentLife: "Vie à l’EPHT",
    careers: "Stages & Carrières",
    news: "Actualités",
    contact: "Contact",
    apply: "Demander une inscription",
  },

  home: {
    hero: {
      eyebrow: "École hôtelière · Salé",
      primaryCta: "Découvrir nos formations",
      secondaryCta: "Demander une inscription",
      facts: {
        formations: "Formations",
        campus: "Campus",
        admissions: "Admissions",
        admissionsValue: "Candidature en ligne",
      },
    },
    about: {
      eyebrow: "L’école",
      cta: "Découvrir notre école",
    },
    formations: {
      eyebrow: "Formations",
      cta: "Consulter la formation",
      all: "Voir toutes les formations",
      duration: "Durée",
      diploma: "Diplôme",
      empty: "Les formations seront bientôt présentées ici.",
    },
    practice: {
      eyebrow: "Pédagogie",
    },
    why: {
      eyebrow: "Nos engagements",
    },
    infrastructures: {
      eyebrow: "Infrastructures",
      cta: "Découvrir nos infrastructures",
      listLabel: "Espaces de l’école",
    },
    admissions: {
      eyebrow: "Admissions",
      cta: "Commencer mon inscription",
      stepsLabel: "Étapes de l’admission",
    },
    studentLife: {
      eyebrow: "Vie étudiante",
      cta: "Découvrir la vie à l’EPHT",
      open: "Agrandir la photo",
      play: "Lire la vidéo",
    },
    testimonials: {
      eyebrow: "Témoignages",
    },
    news: {
      eyebrow: "Actualités",
      all: "Toutes les actualités",
    },
    cta: {
      primary: "Demander une inscription",
      secondary: "Contacter l’école",
    },
  },

  lightbox: {
    label: "Galerie de photos",
    counter: (current: number, total: number) => `${current} sur ${total}`,
    previous: "Photo précédente",
    next: "Photo suivante",
    close: "Fermer la galerie",
  },

  footer: {
    navigation: "Navigation",
    formations: "Formations",
    contact: "Coordonnées",
    follow: "Suivre l’école",
    legal: "Mentions légales",
    privacy: "Politique de confidentialité",
    rights: "Tous droits réservés.",
    phone: "Téléphone",
    mobile: "Mobile",
    email: "E-mail",
    address: "Adresse",
  },

  placeholder: {
    eyebrow: "En préparation",
    text: "Cette page est en cours de réalisation. Son contenu sera publié lors d’une prochaine étape du projet.",
    contact: "Contacter l’école",
  },

  errors: {
    notFoundTitle: "Cette page est introuvable.",
    notFoundText: "L’adresse est peut-être erronée, ou la page a été déplacée.",
    errorTitle: "Une erreur est survenue.",
    errorText: "La page n’a pas pu s’afficher. Vous pouvez réessayer dans un instant.",
    retry: "Réessayer",
    unavailableTitle: "Le site est momentanément indisponible.",
    unavailableText: "Les informations ne peuvent pas être affichées pour le moment. Merci de revenir dans quelques instants.",
  },
} as const;

export type Dictionary = typeof fr;
