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
      },
      {
        id: "item-mechouia",
        name: "Salade Mechouia",
        description: "Poivrons et tomates grillés, ail, huile d'olive, servie fraîche.",
        price: 300,
      },
      {
        id: "item-bourek",
        name: "Bourek (x4)",
        description: "Feuilletés croustillants à la viande hachée et persil.",
        price: 400,
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
      },
      {
        id: "item-tajine",
        name: "Tajine Zitoune",
        description: "Poulet mijoté aux olives et citron confit, servi avec pain maison.",
        price: 950,
      },
      {
        id: "item-chakhchoukha",
        name: "Chakhchoukha",
        description: "Galette effritée, sauce tomate relevée et viande d'agneau.",
        price: 900,
      },
      {
        id: "item-poisson",
        name: "Poisson Grillé",
        description: "Daurade grillée, riz safrané et légumes de saison.",
        price: 1400,
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
      },
      {
        id: "item-the-menthe",
        name: "Thé à la Menthe",
        description: "Thé vert traditionnel, menthe fraîche, servi chaud.",
        price: 200,
      },
      {
        id: "item-eau",
        name: "Eau Minérale (50cl)",
        description: "Eau minérale plate ou gazeuse.",
        price: 100,
      },
      {
        id: "item-jus-orange",
        name: "Jus d'Orange Frais",
        description: "Oranges pressées à la commande.",
        price: 300,
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
      },
      {
        id: "item-baklawa",
        name: "Baklawa",
        description: "Pâte filo, amandes et miel, à la commande.",
        price: 400,
      },
      {
        id: "item-kalb-el-louz",
        name: "Kalb el Louz",
        description: "Semoule aux amandes imbibée de sirop parfumé à l'eau de fleur d'oranger.",
        price: 350,
      },
    ],
  },
];
