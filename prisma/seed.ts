import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { demoCategories } from "../src/data/demo/menu";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const db = new PrismaClient({ adapter });

async function main() {
  const itemIdByKey = new Map<string, string>();

  for (const [catIndex, category] of demoCategories.entries()) {
    const catRecord = await db.menuCategory.upsert({
      where: { id: category.id },
      update: { name: category.name, order: catIndex },
      create: { id: category.id, name: category.name, order: catIndex },
    });

    for (const [itemIndex, item] of category.items.entries()) {
      const itemRecord = await db.menuItem.upsert({
        where: { id: item.id },
        update: {
          name: item.name,
          description: item.description,
          price: item.price,
          image: item.image,
          categoryId: catRecord.id,
          order: itemIndex,
        },
        create: {
          id: item.id,
          name: item.name,
          description: item.description,
          price: item.price,
          image: item.image,
          categoryId: catRecord.id,
          order: itemIndex,
        },
      });
      itemIdByKey.set(item.id, itemRecord.id);
    }
  }

  const demoOrders = [
    {
      id: "order-demo-1",
      tableNumber: 3,
      status: "new" as const,
      note: null,
      items: [
        { itemId: "item-couscous", quantity: 2 },
        { itemId: "item-citronnade", quantity: 2 },
      ],
    },
    {
      id: "order-demo-2",
      tableNumber: 7,
      status: "in_progress" as const,
      note: "Sans oignons pour la table 7",
      items: [
        { itemId: "item-tajine", quantity: 1 },
        { itemId: "item-bourek", quantity: 1 },
        { itemId: "item-the-menthe", quantity: 1 },
      ],
    },
    {
      id: "order-demo-3",
      tableNumber: 1,
      status: "ready" as const,
      note: null,
      items: [{ itemId: "item-poisson", quantity: 1 }, { itemId: "item-jus-orange", quantity: 1 }],
    },
    {
      id: "order-demo-4",
      tableNumber: 5,
      status: "served" as const,
      note: null,
      items: [
        { itemId: "item-chakhchoukha", quantity: 2 },
        { itemId: "item-eau", quantity: 2 },
        { itemId: "item-makroud", quantity: 1 },
      ],
    },
  ];

  for (const order of demoOrders) {
    await db.orderItem.deleteMany({ where: { orderId: order.id } });
    await db.order.upsert({
      where: { id: order.id },
      update: { tableNumber: order.tableNumber, status: order.status, note: order.note },
      create: {
        id: order.id,
        tableNumber: order.tableNumber,
        status: order.status,
        note: order.note,
      },
    });

    for (const line of order.items) {
      const menuItem = await db.menuItem.findUniqueOrThrow({
        where: { id: itemIdByKey.get(line.itemId) },
      });
      await db.orderItem.create({
        data: {
          orderId: order.id,
          menuItemId: menuItem.id,
          quantity: line.quantity,
          unitPrice: menuItem.price,
        },
      });
    }
  }

  console.log(
    `Seed terminé : ${demoCategories.length} catégories, ${itemIdByKey.size} articles, ${demoOrders.length} commandes de démo.`,
  );
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$disconnect();
  });
