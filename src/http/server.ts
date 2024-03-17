import { PrismaClient } from "@prisma/client";
import fastify from "fastify";
import { z } from "zod";

const app = fastify();

const prisma = new PrismaClient();

app.get("/", () => {
  return "Hello World;";
});

app.post("/polls", async (req, res) => {
  // return "Hello World;";
  const createPollBody = z.object({
    title: z.string(),
  });

  const { title } = createPollBody.parse(req.body);

  await prisma.poll.create({
    data: {
      title,
    },
  });
  const allPolls = await prisma.poll.findMany();

  return res.status(201).send(allPolls.map((poll) => poll.title));

  // return res.send('<h1>something</h1>')
});

app.listen({ port: 3333 }).then(() => {
  console.log("running on http://localhost:3333");
});
