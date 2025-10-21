import { executeCorsairMutation } from "../api/mutation";
import { CorsairMutations } from "../client";
import { FastifyRequest, FastifyReply } from "fastify";

export function createFastifyHandler<TMutations extends CorsairMutations>(
  mutations: TMutations
) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const result = await executeCorsairMutation(
      mutations,
      request.body as CorsairRequest
    );

    if (result.success) {
      reply.send(result.data);
    } else {
      const status = result.error.includes("validation") ? 400 : 500;
      reply.status(status).send({
        message: result.error,
        errors: result.errors,
      });
    }
  };
}
