import z from "zod";
import { prisma } from "../../lib/prisma";
import { FastifyInstance } from "fastify";

export async function getPoll(app: FastifyInstance) {
  app.get("/polls/:pollId", async (req, res) => {
    // return "Hello World;";

    const getPollParams = z.object({
      pollId: z.string().uuid(),
    });

    // const createPollBody = z.object({
    //   title: z.string(),
    //   options: z.array(z.string()),
    // });
    const { pollId } = getPollParams.parse(req.params);
    // const { title, options } = createPollBody.parse(req.body);

    const poll = await prisma.poll.findUnique({
      // data: {
      //   title,
      //   options: {
      //     createMany: {
      //       data: options.map((option) => {
      //         return { title: option };
      //       }),
      //     },
      //   },
      // },
      where: {
        id: pollId,
      },
      include: {
        options: {
          select: {
            title: true,
            id: true,
          },
        },
      },
    });

    // const allPolls = await prisma.poll.findMany();
    return res.status(201).send({ pollId: poll });
    // return res.status(201).send(allPolls.map((poll) => poll.title));

    // return res.send('<h1>something</h1>')
  });
}
