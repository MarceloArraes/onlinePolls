import z from "zod";
import { prisma } from "../../lib/prisma";
import { FastifyInstance } from "fastify";
import { redis } from "../../lib/redis";
import { title } from "process";

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

    if (!poll) {
      return res.status(400).send({ message: "Poll not found" });
    }

    const result = await redis.zrange(pollId, 0, -1, "WITHSCORES");

    console.log("result", result);

    const votes = result.reduce((obj, line, index) => {
      if (index % 2 == 0) {
        const score = result[index + 1];
        Object.assign(obj, { [line]: score });
      }
      return obj;
    }, {} as Record<string, number>);
    console.log("votes", votes);
    // const allPolls = await prisma.poll.findMany();
    return res.send({
      poll: {
        id: poll.id,
        title: poll.title,
        options: poll.options.map((option) => {
          return {
            id: option.id,
            title: option.title,
            score: option.id in votes ? votes[option.id] : 0,
          };
        }),
      },
    });
    // return res.status(201).send(allPolls.map((poll) => poll.title));

    // return res.send('<h1>something</h1>')
  });
}
