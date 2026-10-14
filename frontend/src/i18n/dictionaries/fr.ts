/**
 * Textes d'interface en français : navigation, boutons, libellés.
 *
 * Les contenus éditoriaux (titres de sections, présentations, formations,
 * actualités, coordonnées) ne figurent pas ici : ils viennent de l'API.
 */
export const fr = {
  common: {
    skipToContent: "Aller au contenu",
    readMore: "Lire la suite",
    backToTop: "Revenir en haut de la page",
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
      // Chaque repère est affiché sur deux lignes.
      features: [
        ["Formations", "professionnelles"],
        ["Apprentissage", "par la pratique"],
        ["Accompagnement", "vers l’emploi"],
      ],
      // Mention manuscrite, sur deux lignes.
      tagline: ["Un métier", "passionnant"],
      carousel: {
        label: "Photographies de l’école",
        previous: "Photo précédente",
        next: "Photo suivante",
        show: (position: number) => `Afficher la photo ${position}`,
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

  /*
   * Pages intérieures. Seuls des titres de rubriques et des textes d'usage
   * figurent ici : les présentations viennent de l'API, et aucun fait sur
   * l'école (dates, chiffres, agréments) n'est écrit dans le code.
   */
  pages: {
    breadcrumb: "Fil d’Ariane",
    filters: {
      label: "Filtrer",
      all: "Tout",
    },
    school: {
      projectEyebrow: "Notre projet",
      spacesEyebrow: "Nos espaces",
      spacesCta: "Voir les infrastructures",
    },
    formations: {
      eyebrow: "Catalogue",
      filterLabel: "Filtrer par famille de métiers",
      count: (count: number) => (count > 1 ? `${count} formations` : `${count} formation`),
      empty: "Aucune formation n’est publiée pour le moment.",
      admissionsEyebrow: "Inscription",
    },
    formation: {
      facts: {
        family: "Famille de métiers",
        level: "Niveau",
        diploma: "Diplôme",
        duration: "Durée",
      },
      overviewEyebrow: "Présentation",
      sections: {
        objectives: "Objectifs",
        skills: "Compétences développées",
        program: "Programme",
        requirements: "Conditions d’accès",
        careers: "Débouchés",
        documents: "Documents à fournir",
      },
      faqEyebrow: "Questions fréquentes",
      galleryEyebrow: "En images",
      pendingTitle: "Programme détaillé",
      pending:
        "Le programme, les conditions d’accès et les débouchés de cette formation seront publiés prochainement. Pour toute question, contactez l’école.",
      othersEyebrow: "Formations",
      othersTitle: "Les autres formations",
    },
    admissions: {
      stepsEyebrow: "Étapes",
      stepsTitle: "Le parcours d’inscription",
      chooseEyebrow: "Formations",
      chooseTitle: "Choisir sa formation",
      onlineEyebrow: "Candidature",
      onlineTitle: "Une question avant de candidater ?",
      onlineText:
        "Le dépôt de candidature en ligne ouvrira prochainement. En attendant, l’école répond à vos questions par téléphone et par e-mail.",
    },
    infrastructures: {
      eyebrow: "Espace",
      open: "Agrandir la photo",
    },
    studentLife: {
      galleryEyebrow: "En images",
      galleryTitle: "L’année en images",
      upcomingEyebrow: "Agenda",
      upcomingTitle: "Événements à venir",
      pastEyebrow: "Retour sur",
      pastTitle: "Événements passés",
    },
    careers: {
      eyebrow: "Stages & Carrières",
      title: "Stages et offres d’emploi.",
      lead: "Retrouvez ici les offres de stage et d’emploi publiées par l’école.",
      offersEyebrow: "Offres",
      offersTitle: "Les offres publiées",
      filterLabel: "Filtrer par type d’offre",
      empty: "Aucune offre n’est publiée pour le moment. Les nouvelles offres apparaîtront ici dès leur publication.",
      apply: "Postuler",
      applyByEmail: "Postuler par e-mail",
      expires: (date: string) => `Jusqu’au ${date}`,
      partnersEyebrow: "Partenaires",
      partnersTitle: "Les partenaires de l’école",
      partnerSite: "Site du partenaire",
    },
    news: {
      lead: "Les dernières nouvelles de l’école, de ses formations et de ses étudiants.",
      filterLabel: "Filtrer par catégorie",
      more: "Voir plus d’actualités",
      empty: "Aucune actualité n’est publiée pour le moment.",
      relatedEyebrow: "À lire aussi",
      relatedTitle: "Dans la même catégorie",
    },
    contact: {
      eyebrow: "Contact",
      title: "Contactez l’école.",
      lead: "Une question sur les formations ou sur l’inscription ? L’EPHT vous répond par téléphone et par e-mail.",
      address: "Adresse",
      phone: "Téléphone",
      email: "E-mail",
      whatsapp: "WhatsApp",
      hours: "Horaires",
      social: "Réseaux sociaux",
      call: "Appeler",
      write: "Écrire",
      map: "Voir le plan d’accès",
      mapTitle: "Plan d’accès à l’école",
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
