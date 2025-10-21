import { CorsairMutations, CorsairQueries, z } from ".";

export type ContextFactory<TContext> = (
  request: any
) => Promise<TContext> | TContext;

export type CorsairRequest = {
  prompt: string;
  input: any;
  operation: "query" | "mutation";
};

export type CorsairResponse<T = any> =
  | { success: true; data: T }
  | { success: false; error: string; errors?: any[] };

export async function executeCorsairOperation<
  TOperations extends CorsairMutations | CorsairQueries,
  TContext = any
>(
  operations: TOperations,
  request: CorsairRequest,
  context: TContext
): Promise<CorsairResponse> {
  try {
    const { prompt, input } = request;

    const operation = Object.values(operations).find(
      (op) => op.prompt === prompt
    );

    if (!operation) {
      return {
        success: false,
        error: `Unknown prompt: ${prompt}`,
      };
    }

    // Validate input
    try {
      operation.input_type.parse(input);
    } catch (error) {
      return {
        success: false,
        error: "Input validation failed",
        errors: error instanceof z.ZodError ? error.issues : [],
      };
    }

    // Execute handler with context
    const result = await operation.handler(input, context);

    // Validate output
    try {
      const validatedResult = operation.response_type.parse(result);
      return { success: true, data: validatedResult };
    } catch (error) {
      console.error("Response validation failed:", error);
      return {
        success: false,
        error: "Internal server error: invalid response format",
      };
    }
  } catch (error) {
    console.error("Corsair execution error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
