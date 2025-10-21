import { NextRequest, NextResponse } from "next/server";
import { CorsairMutations, CorsairQueries } from "../client";
import { ContextFactory, executeCorsairOperation } from "../api";

export function createNextJsHandler<
  TQueries extends CorsairQueries<TContext>,
  TMutations extends CorsairMutations<TContext>,
  TContext
>(
  queries: TQueries,
  mutations: TMutations,
  contextFactory: ContextFactory<TContext>
) {
  return async (request: NextRequest) => {
    const body = await request.json();

    const context = await contextFactory(request);

    // Route to correct operation based on type
    const operations = body.operation === "query" ? queries : mutations;
    const result = await executeCorsairOperation(operations, body, context);

    if (result.success) {
      return NextResponse.json(result.data);
    } else {
      const status = result.error.includes("validation") ? 400 : 500;
      return NextResponse.json(
        { message: result.error, errors: result.errors },
        { status }
      );
    }
  };
}
