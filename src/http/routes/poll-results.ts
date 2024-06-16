import { FastifyInstance } from "fastify";
import { voting } from "../../utils/voting-pub-sub";
import z from "zod";

export async function pollResults(app: FastifyInstance) {
  app.get("/polls/:pollId/results", { websocket: true }, (connection, req) => {
    // connection.on("message", (message: string) => {
    //   connection.send("hi from server" + message);

    // });

    const getPollParams = z.object({
      pollId: z.string().uuid(),
    });

    const { pollId } = getPollParams.parse(req.params);

    voting.subscribe(pollId, (message) => {
      connection.send(JSON.stringify(message));
    });
  });
}
