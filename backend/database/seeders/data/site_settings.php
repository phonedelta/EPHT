<?php

use App\Enums\SettingType as Type;

/*
|--------------------------------------------------------------------------
| Paramètres initiaux du site
|--------------------------------------------------------------------------
|
| Chaque entrée : clé pointée => [type, valeur, public ?]. Le groupe est le
| premier segment de la clé. Ces valeurs ne sont écrites qu'à la création :
| une fois modifiées dans l'administration, elles ne sont plus écrasées.
|
| Les textes éditoriaux sont provisoires et doivent être validés par l'école.
| Les coordonnées reprennent celles du site historique epht.ma.
|
*/

return [

    // --- Identité ----------------------------------------------------------
    'general.name' => [Type::String, 'EPHT'],
    'general.full_name' => [Type::String, "École Privée d'Hôtellerie et de Tourisme"],
    'general.tagline' => [Type::String, 'École hôtelière à Salé'],
    'general.description' => [Type::Text, "L'EPHT est un établissement privé de formation professionnelle situé à Salé. L'école prépare aux métiers de l'hôtellerie et de la restauration : service, cuisine et pâtisserie."],
    'general.logo' => [Type::Media, null],

    // --- Coordonnées -------------------------------------------------------
    'contact.address_lines' => [Type::Json, ['Lotissement Sbihi, Avenue Lalla Asmae', 'Immeuble 9, Tabriquet', 'Salé, Maroc']],
    'contact.district' => [Type::String, 'Tabriquet'],
    'contact.city' => [Type::String, 'Salé'],
    'contact.country' => [Type::String, 'Maroc'],
    'contact.phone' => [Type::Phone, '+212 5 37 78 69 06'],
    'contact.mobile' => [Type::Phone, '+212 6 01 16 74 70'],
    'contact.email' => [Type::Email, 'contact@epht.ma'],
    // À renseigner une fois le numéro WhatsApp officiellement confirmé.
    'contact.whatsapp' => [Type::Phone, null],
    'contact.latitude' => [Type::Number, null],
    'contact.longitude' => [Type::Number, null],
    'contact.map_url' => [Type::Url, null],
    'contact.opening_hours' => [Type::Json, null],

    // --- Réseaux sociaux ---------------------------------------------------
    // Seul le lien présent sur le site historique est renseigné.
    'social.facebook' => [Type::Url, 'https://www.facebook.com/epht.ecolehoteliere'],
    'social.instagram' => [Type::Url, null],
    'social.linkedin' => [Type::Url, null],
    'social.youtube' => [Type::Url, null],
    'social.tiktok' => [Type::Url, null],

    // --- Référencement -----------------------------------------------------
    'seo.default_title' => [Type::String, 'EPHT — École hôtelière à Salé : restauration, cuisine, pâtisserie'],
    'seo.title_template' => [Type::String, '%s | EPHT Salé'],
    'seo.default_description' => [Type::Text, "École Privée d'Hôtellerie et de Tourisme à Salé : formations professionnelles en restauration, cuisine et pâtisserie. Découvrez les formations et déposez votre demande d'inscription en ligne."],
    'seo.keywords' => [Type::Json, ['école hôtelière Salé', 'formation cuisine Salé', 'formation pâtisserie Salé', 'formation restauration Maroc', 'formation professionnelle Salé']],
    'seo.og_image' => [Type::Media, null],

    // --- Accueil : hero ----------------------------------------------------
    'home.hero.title' => [Type::Json, ['Apprenez un métier.', 'Construisez votre avenir.']],
    'home.hero.description' => [Type::Text, "Découvrez les formations professionnelles de l'EPHT dans les métiers de l'hôtellerie et de la restauration, à Salé."],
    'home.hero.image' => [Type::Media, null],
    'home.hero.secondary_image' => [Type::Media, null],

    // --- Accueil : présentation -------------------------------------------
    'home.about.title' => [Type::String, "Une école tournée vers les métiers de l'hôtellerie."],
    'home.about.lead' => [Type::Text, "À Salé, l'EPHT forme aux métiers de la restauration, de la cuisine et de la pâtisserie, avec une idée simple : apprendre un métier, c'est d'abord le pratiquer."],
    'home.about.body' => [Type::Json, [
        "L'enseignement s'organise autour de la pratique. Les gestes se répètent en atelier, les techniques s'acquièrent en situation et chaque séance prépare aux exigences d'un environnement professionnel.",
        "Les formateurs accompagnent chaque étudiant tout au long de son parcours, de l'entrée en formation à la préparation de son insertion professionnelle.",
    ]],
    'home.about.pillars' => [Type::Json, [
        ['title' => 'Notre mission', 'text' => "Préparer à l'exercice d'un métier de l'hôtellerie et de la restauration."],
        ['title' => 'Notre approche', 'text' => 'Une pédagogie fondée sur la pratique, en atelier et en travaux pratiques.'],
        ['title' => 'Notre accompagnement', 'text' => 'Un suivi de chaque étudiant, du premier jour à la fin de la formation.'],
    ]],
    'home.about.image' => [Type::Media, null],

    // --- Accueil : formations ---------------------------------------------
    'home.formations.title' => [Type::String, 'Des formations pour apprendre un métier.'],
    'home.formations.intro' => [Type::Text, "Service en salle, cuisine, pâtisserie : chaque formation prépare à un métier précis de l'hôtellerie et de la restauration."],

    // --- Accueil : formation pratique -------------------------------------
    'home.practice.title' => [Type::String, 'Apprendre par la pratique.'],
    'home.practice.intro' => [Type::Text, "Un métier de l'hôtellerie s'apprend en le pratiquant. Ateliers et travaux pratiques occupent une place centrale dans la formation."],
    'home.practice.points' => [Type::Json, [
        ['title' => 'Les ateliers', 'text' => 'Des séances consacrées aux gestes et aux techniques du métier.'],
        ['title' => 'Les équipements', 'text' => 'Des espaces dédiés à la cuisine, à la pâtisserie et au service.'],
        ['title' => 'Les travaux pratiques', 'text' => 'Des mises en situation pour appliquer ce qui a été appris.'],
        ['title' => 'Les compétences', 'text' => "Une progression suivie, des bases jusqu'à l'autonomie."],
        ['title' => 'La préparation au métier', 'text' => 'Une formation tournée vers les réalités du monde professionnel.'],
    ]],
    'home.practice.image' => [Type::Media, null],
    'home.practice.image_secondary' => [Type::Media, null],
    'home.practice.image_tertiary' => [Type::Media, null],

    // --- Accueil : pourquoi choisir l'EPHT --------------------------------
    'home.why.title' => [Type::String, "Pourquoi choisir l'EPHT ?"],
    'home.why.intro' => [Type::Text, 'Quatre repères guident notre manière de former.'],
    'home.why.items' => [Type::Json, [
        ['title' => 'Une formation orientée métier', 'text' => "Chaque formation prépare à un métier identifié de l'hôtellerie et de la restauration."],
        ['title' => 'Un enseignement pratique', 'text' => "Les techniques s'apprennent par le geste, en atelier et en travaux pratiques."],
        ['title' => 'Un accompagnement pédagogique', 'text' => 'Les formateurs suivent la progression de chaque étudiant et le guident dans ses apprentissages.'],
        ['title' => "Une préparation à l'environnement professionnel", 'text' => 'Rigueur, présentation, travail en équipe : la formation prépare aux exigences du secteur.'],
    ]],

    // --- Accueil : infrastructures ----------------------------------------
    'home.infrastructures.title' => [Type::String, 'Des espaces pensés pour apprendre.'],
    'home.infrastructures.intro' => [Type::Text, "Chaque espace de l'école a un rôle dans la formation, de la cuisine à la salle de cours."],

    // --- Accueil : admissions ---------------------------------------------
    'home.admissions.title' => [Type::String, 'Votre avenir commence ici.'],
    'home.admissions.intro' => [Type::Text, "La demande d'inscription se fait en ligne. Elle est ensuite étudiée par l'école et reste soumise à validation."],
    'home.admissions.steps' => [Type::Json, [
        ['title' => 'Choisir une formation', 'text' => 'Consultez les formations et identifiez celle qui correspond à votre projet.'],
        ['title' => 'Envoyer une candidature', 'text' => 'Remplissez le formulaire en ligne et joignez les documents demandés.'],
        ['title' => "Passer les étapes d'admission", 'text' => "L'école étudie votre dossier et vous contacte pour la suite."],
        ['title' => "Finaliser l'inscription après validation", 'text' => "Une fois votre candidature validée, vous complétez votre inscription auprès de l'école."],
    ]],

    // --- Accueil : vie étudiante ------------------------------------------
    'home.student_life.title' => [Type::String, "La vie à l'EPHT, au rythme des ateliers."],
    'home.student_life.intro' => [Type::Text, "Travaux pratiques, événements, activités, réalisations des étudiants et soutenances rythment l'année."],

    // --- Accueil : témoignages, actualités, appel final -------------------
    'home.testimonials.title' => [Type::String, "Ils parlent de l'EPHT."],
    'home.news.title' => [Type::String, "Les actualités de l'école."],
    'home.cta.title' => [Type::String, 'Prêt à construire votre avenir professionnel ?'],
    'home.cta.text' => [Type::Text, "Déposez votre demande d'inscription en ligne ou contactez l'école pour toute question sur les formations."],
];
