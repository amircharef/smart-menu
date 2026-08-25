// Seed data for prisma/seed.ts — `order` is assigned at seed time (array index).
export const demoCategories = [
  {
    id: "cat-entrees",
    name: "Entrées",
    items: [
      {
        id: "item-chorba",
        name: "Chorba Frik",
        description: "Soupe traditionnelle à la viande d'agneau et au frik, épices douces.",
        price: 350,
        image:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Bean_soup_with_tomatoes_and_red_peppers.jpeg/960px-Bean_soup_with_tomatoes_and_red_peppers.jpeg",
      },
      {
        id: "item-mechouia",
        name: "Salade Mechouia",
        description: "Poivrons et tomates grillés, ail, huile d'olive, servie fraîche.",
        price: 300,
        image:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Salade_Mechouwya%2C_Tunisie%2C_juin_2021.jpg/960px-Salade_Mechouwya%2C_Tunisie%2C_juin_2021.jpg",
      },
      {
        id: "item-bourek",
        name: "Bourek (x4)",
        description: "Feuilletés croustillants à la viande hachée et persil.",
        price: 400,
        image: "https://upload.wikimedia.org/wikipedia/commons/3/39/Bourekalgerien.jpg",
      },
    ],
  },
  {
    id: "cat-plats",
    name: "Plats",
    items: [
      {
        id: "item-couscous",
        name: "Couscous Royal",
        description: "Semoule fine, légumes de saison, agneau, poulet et merguez.",
        price: 1200,
        image:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Moroccan_cuscus%2C_from_Casablanca%2C_September_2018.jpg/960px-Moroccan_cuscus%2C_from_Casablanca%2C_September_2018.jpg",
      },
      {
        id: "item-tajine",
        name: "Tajine Zitoune",
        description: "Poulet mijoté aux olives et citron confit, servi avec pain maison.",
        price: 950,
        image:
          "https://upload.wikimedia.org/wikipedia/commons/3/3a/Tajine-marocain-un-plat-varie-et-sain_%28cropped%29.jpg",
      },
      {
        id: "item-chakhchoukha",
        name: "Chakhchoukha",
        description: "Galette effritée, sauce tomate relevée et viande d'agneau.",
        price: 900,
        image: "https://upload.wikimedia.org/wikipedia/commons/c/c5/Algerian_Chakhchoukha.jpg",
      },
      {
        id: "item-poisson",
        name: "Poisson Grillé",
        description: "Daurade grillée, riz safrané et légumes de saison.",
        price: 1400,
        image:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/02_Grilled_fish_and_seafood_dinner_in_Canary_Islands_-_Gran_Canaria_restaurant%2C_marisco_mixto_a_la_parrilla.jpg/960px-02_Grilled_fish_and_seafood_dinner_in_Canary_Islands_-_Gran_Canaria_restaurant%2C_marisco_mixto_a_la_parrilla.jpg",
      },
    ],
  },
  {
    id: "cat-boissons",
    name: "Boissons",
    items: [
      {
        id: "item-citronnade",
        name: "Citronnade Maison",
        description: "Citron pressé, menthe fraîche, sucre de canne.",
        price: 250,
        image:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Lemonade_-_27682817724.jpg/960px-Lemonade_-_27682817724.jpg",
      },
      {
        id: "item-the-menthe",
        name: "Thé à la Menthe",
        description: "Thé vert traditionnel, menthe fraîche, servi chaud.",
        price: 200,
        image:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Tunisian_Tea_with_pine_nuts.jpg/960px-Tunisian_Tea_with_pine_nuts.jpg",
      },
      {
        id: "item-eau",
        name: "Eau Minérale (50cl)",
        description: "Eau minérale plate ou gazeuse.",
        price: 100,
        image:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Belu_Bottled_Mineral_Water.jpg/960px-Belu_Bottled_Mineral_Water.jpg",
      },
      {
        id: "item-jus-orange",
        name: "Jus d'Orange Frais",
        description: "Oranges pressées à la commande.",
        price: 300,
        image:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Orangejuice.jpg/960px-Orangejuice.jpg",
      },
    ],
  },
  {
    id: "cat-desserts",
    name: "Desserts",
    items: [
      {
        id: "item-makroud",
        name: "Makroud (x3)",
        description: "Pâtisserie à la semoule fourrée aux dattes, miel.",
        price: 350,
        image:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Makrouds.JPG/960px-Makrouds.JPG",
      },
      {
        id: "item-baklawa",
        name: "Baklawa",
        description: "Pâte filo, amandes et miel, à la commande.",
        price: 400,
        image: "https://upload.wikimedia.org/wikipedia/commons/c/c7/Baklava%281%29.png",
      },
      {
        id: "item-kalb-el-louz",
        name: "Kalb el Louz",
        description: "Semoule aux amandes imbibée de sirop parfumé à l'eau de fleur d'oranger.",
        price: 350,
        image:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Kalb-el-louz.jpg/960px-Kalb-el-louz.jpg",
      },
    ],
  },
];
