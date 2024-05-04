import { PrismaClient } from "@prisma/client";
// const PrismaClient = require("@prisma/client");
// const db = new PrismaClient();
const prisma = new PrismaClient();

/* async function seed() {
  await Promise.all(
    getPosts().map((post) => {
      return db.post.create({ data: post });
    })
  );
} */

async function seed() {
  const sr = await prisma.user.create({
    data: {
      username: "john",
      //use hash password
      passwordHash:
        "$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1u",
    },
  });

  await Promise.all(
    getPosts().map((post) => {
      const data = { userId: sr.id, ...post };
      return prisma.post.create({ data });
    })
  );
}
/* async function seed() {
  try {
    const posts = getPost();
    await Promise.all(
      posts.map((post) => {
        return db.post.create({ data: post });
      })
    );
    console.log("Data seeded successfully!");
  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    await db.$disconnect();
  }
} */

seed();

function getPosts() {
  return [
    {
      title: "JavaScript Performance Tips",
      body: `We will look at 10 simple tips and tricks to increase the speed of your code when writing JS`,
    },
    {
      title: "Tailwind vs. Bootstrap",
      body: `Both Tailwind and Bootstrap are very popular CSS frameworks. In this article, we will compare them`,
    },
    {
      title: "Writing Great Unit Tests",
      body: `We will look at 10 simple tips and tricks on writing unit tests in JavaScript`,
    },
    {
      title: "What Is New In PHP 8?",
      body: `In this article we will look at some of the new features offered in version 8 of PHP`,
    },
  ];
}
