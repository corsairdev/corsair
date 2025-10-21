import { NextRequest, NextResponse } from "next/server";
import { CorsairMutations, CorsairQueries } from "../core";
import { ContextFactory, executeCorsairOperation } from "../core/execute";

export function createNextJsHandler<
  TQueries extends CorsairQueries<TContext>,
  TMutations extends CorsairMutations<TContext>,
  TContext
>(
  queries: TQueries,
  mutations: TMutations,
  contextFactory: ContextFactory<TContext>
) {
  return async (request: NextRequest, _context: { params: Promise<any> }) => {
    const body = await request.json();

    const corsairContext = await contextFactory(request);

    // Route to correct operation based on type
    const operations = body.operation === "query" ? queries : mutations;
    const result = await executeCorsairOperation(operations, body, corsairContext);

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
