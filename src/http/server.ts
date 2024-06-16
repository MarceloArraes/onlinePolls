import fastify from "fastify";
import { createPoll } from "./routes/create-poll";
import { getPoll } from "./routes/get-poll";
import { voteOnPoll } from "./routes/vote-on-poll";
import fastifyCookie from "@fastify/cookie";
import fastifyWebsocket from "@fastify/websocket";
import { pollResults } from "./routes/poll-results";

const app = fastify();
app.register(fastifyCookie, {
  secret: "marcelo-gahfbaajsdnkasdk14116jk756",
  hook: "onRequest",
  parseOptions: {},
});

app.register(fastifyWebsocket);

app.register(pollResults);

app.register(createPoll);
app.register(getPoll);
app.register(voteOnPoll);

app.get("/", () => {
  return "Hello World;";
});

app.listen({ port: 3333 }).then(() => {
  console.log("running on http://localhost:3333");
});
