import { Request, Response } from "express";
import { CorsairMutations, CorsairQueries } from "../client";
import { ContextFactory, executeCorsairOperation } from "../api/mutation";

export function createExpressHandler<
  TQueries extends CorsairQueries<TContext>,
  TMutations extends CorsairMutations<TContext>,
  TContext
>(
  queries: TQueries,
  mutations: TMutations,
  contextFactory: ContextFactory<TContext>
) {
  return async (req: Request, res: Response) => {
    const context = await contextFactory(req);
    const operations = req.body.operation === "query" ? queries : mutations;
    const result = await executeCorsairOperation(operations, req.body, context);

    if (result.success) {
      res.json(result.data);
    } else {
      const status = result.error.includes("validation") ? 400 : 500;
      res.status(status).json({
        message: result.error,
        errors: result.errors,
      });
    }
  };
}
