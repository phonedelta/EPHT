<?php

/*
|--------------------------------------------------------------------------
| Photographies d'illustration
|--------------------------------------------------------------------------
|
| Images placées dans le domaine public (CC0 1.0), utilisées pendant le
| développement en attendant les photographies officielles de l'école.
| Elles sont importées avec l'indicateur « is_illustrative » : le site les
| signale comme photos d'illustration et ne les présente jamais comme des
| vues de l'EPHT.
|
| Source « commons » : photographie publiée à l'origine sur Unsplash sous
| CC0, récupérée sur Wikimedia Commons.
|
*/

$commons = fn (string $file) => 'https://commons.wikimedia.org/wiki/File:'.$file;

return [
    'dressage-au-passe' => [
        'alt' => "Deux cuisiniers dressent des assiettes au passe d'une cuisine professionnelle.",
        'credit' => 'Fabrizio Magoni',
        'credit_url' => $commons('Gourmet_Chef_(Unsplash).jpg'),
        'focal' => [58, 55],
    ],
    'croissants-sur-plaque' => [
        'alt' => 'Croissants alignés sur une plaque de cuisson.',
        'credit' => 'Olia Gozha',
        'credit_url' => $commons('Rivne,_Ukraine_(Unsplash).jpg'),
    ],
    'service-plateau-ardoise' => [
        'alt' => "Une personne présente des amuse-bouches sur un plateau d'ardoise.",
        'credit' => 'Sasha',
        'credit_url' => $commons("Tray_of_Hors_D'oeuvres_(Unsplash).jpg"),
        'focal' => [58, 50],
    ],
    'table-dressee-fleurs' => [
        'alt' => 'Longue table dressée avec des verres à pied et des bouquets de fleurs.',
        'credit' => 'Leon Christopher',
        'credit_url' => $commons('Preparing_the_dinner_(Unsplash_qkcR-gjt3_g).jpg'),
    ],
    'service-plateau-flutes' => [
        'alt' => 'Un serveur porte un plateau de flûtes de champagne.',
        'credit' => 'Matt Bango',
        'credit_url' => 'https://stocksnap.io/photo/waiter-drink-EWJPCRAR3S',
        'focal' => [50, 62],
    ],
    'decoupe-legumes' => [
        'alt' => 'Des mains émincent des légumes verts sur une planche en bois.',
        'credit' => 'Igor Miske',
        'credit_url' => $commons('Cook_(Unsplash).jpg'),
    ],
    'dessert-a-l-assiette' => [
        'alt' => "Dessert à l'assiette nappé d'une sauce versée au pichet.",
        'credit' => 'Pablo Merchán Montes',
        'credit_url' => $commons('Alto_Pasti_Trattoria_-_Cocina_Italiana_Moderna_en_Manizales,_Colombia_(Unsplash).jpg'),
        'focal' => [62, 50],
    ],
    'cuisine-professionnelle' => [
        'alt' => 'Une brigade au travail dans une cuisine professionnelle, vue de dos.',
        'credit' => 'Michael Browning',
        'credit_url' => $commons('Chefs_at_Work_(Unsplash).jpg'),
    ],
    'farine-tamisee' => [
        'alt' => 'Une main laisse tomber de la farine dans un saladier en verre.',
        'credit' => 'Gaelle Marcel',
        'credit_url' => $commons('Making_Bread_(Unsplash).jpg'),
        'focal' => [45, 68],
    ],
    'cuisson-au-wok' => [
        'alt' => 'Des ingrédients sautent dans un wok tenu au-dessus du feu.',
        'credit' => 'Margo Brodowicz',
        'credit_url' => $commons('Street_food_(Unsplash).jpg'),
    ],
    'cuisine-ouverte' => [
        'alt' => 'Un cuisinier, de dos, dans une cuisine ouverte au plan de travail garni.',
        'credit' => 'Joanna Boj',
        'credit_url' => $commons('Cook_in_a_café_(Unsplash).jpg'),
    ],
    'table-de-restaurant' => [
        'alt' => 'Table de restaurant dressée avec des verres et des serviettes.',
        'credit' => 'Paweł Wojciechowski',
        'credit_url' => $commons('Dinner_at_a_bistro_(Unsplash).jpg'),
    ],
    'salle-de-reception' => [
        'alt' => 'Grande salle de réception aux longues tables dressées, sous une charpente éclairée.',
        'credit' => 'Sweet Ice Cream Photography',
        'credit_url' => $commons('Wedding_reception_tables_and_benches_(Unsplash).jpg'),
    ],
    'salle-de-cours' => [
        'alt' => 'Salle de cours avec des tables, des chaises et un écran de projection.',
        'credit' => 'rawpixel',
        'credit_url' => 'https://www.rawpixel.com/image/5924914/photo-image-public-domain-table-room',
    ],
    'salle-informatique' => [
        'alt' => 'Salle équipée de postes informatiques alignés.',
        'credit' => 'rawpixel',
        'credit_url' => 'https://www.rawpixel.com/image/6026535/computer-classroom-free-public-domain-cc0-image',
    ],
    'saute-de-legumes' => [
        'alt' => 'Un cuisinier ganté fait sauter des légumes à la poêle.',
        'credit' => 'Clem Onojeghuo',
        'credit_url' => $commons('Street_Food_in_a_Wok_(Unsplash).jpg'),
    ],
    'taille-des-oignons' => [
        'alt' => 'Des mains gantées taillent des oignons sur une planche, en cuisine professionnelle.',
        'credit' => 'rawpixel',
        'credit_url' => 'https://www.rawpixel.com/image/5920533/photo-image-background-public-domain-kitchen',
    ],
    'entremets-fruits-rouges' => [
        'alt' => 'Petits entremets au chocolat garnis de fruits rouges.',
        'credit' => 'Brina Blum',
        'credit_url' => $commons('Christmas_Dessert_(Unsplash).jpg'),
    ],
    'feuillete-asperges' => [
        'alt' => 'Feuilleté aux asperges présenté sur une assiette.',
        'credit' => 'Markus Spiske',
        'credit_url' => $commons('Pancetta_and_puff_pastry_(Unsplash).jpg'),
    ],
    'brioche-sucre-glace' => [
        'alt' => 'Brioche saupoudrée de sucre glace sur fond sombre.',
        'credit' => 'Jennifer Pallian',
        'credit_url' => $commons('Bakery_Muffin_(Unsplash).jpg'),
        'focal' => [50, 62],
    ],
    'table-dressee-bois' => [
        'alt' => 'Table en bois dressée avec deux assiettes et un verre de vin blanc.',
        'credit' => 'Stefan Johnson',
        'credit_url' => $commons('Vintage_wine_dinner_for_two_(Unsplash).jpg'),
    ],
    'mise-en-place-de-table' => [
        'alt' => 'Une personne dispose les couverts sur une table nappée de blanc.',
        'credit' => 'rawpixel',
        'credit_url' => 'https://www.rawpixel.com/image/6031131/photo-image-flower-public-domain-person',
    ],
    'viennoiseries-ardoise' => [
        'alt' => 'Un croissant et des chocolats disposés sur une ardoise.',
        'credit' => 'Olenka Kotyk',
        'credit_url' => $commons('Rustic_Bakery_Treats_(Unsplash).jpg'),
    ],
];
