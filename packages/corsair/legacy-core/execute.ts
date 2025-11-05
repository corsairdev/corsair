import { z } from "zod";
import type { CorsairOperations, BaseOperation } from "./types";

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

function findOperationByPrompt<TOperations extends CorsairOperations<any>>(
  operations: TOperations,
  prompt: string
): BaseOperation<any, any, any> | null {
  return Object.values(operations).find((op: any) => op.prompt === prompt) || null;
}

function validateInput(operation: BaseOperation<any, any, any>, input: any): { success: true } | { success: false; error: string; errors?: any[] } {
  try {
    operation.input_type.parse(input);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: "Input validation failed",
      errors: error instanceof z.ZodError ? error.issues : [],
    };
  }
}

function validateOutput(operation: BaseOperation<any, any, any>, result: any): { success: true; data: any } | { success: false; error: string } {
  if (!operation.response_type) {
    return { success: true, data: result };
  }

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
}

export async function executeCorsairOperation<
  TOperations extends CorsairOperations<any>,
  TContext = any
>(
  operations: TOperations,
  request: CorsairRequest,
  context: TContext
): Promise<CorsairResponse> {
  try {
    const { prompt, input } = request;

    const operation = findOperationByPrompt(operations, prompt);
    if (!operation) {
      return {
        success: false,
        error: `Unknown prompt: ${prompt}`,
      };
    }

    const inputValidation = validateInput(operation, input);
    if (!inputValidation.success) {
      return inputValidation;
    }

    const result = await operation.handler(input, context);

    const outputValidation = validateOutput(operation, result);
    if (!outputValidation.success) {
      return outputValidation;
    }

    return { success: true, data: outputValidation.data };
  } catch (error) {
    console.error("Corsair execution error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Simplified execute function for testing
export async function execute<TInput, TOutput, TContext>(
  operation: BaseOperation<TInput, TOutput, TContext>,
  input: TInput,
  context: TContext
): Promise<{ success: true; data: TOutput; error: null } | { success: false; data: null; error: string }> {
  try {
    // Validate input
    const inputValidation = validateInput(operation, input);
    if (!inputValidation.success) {
      return {
        success: false,
        data: null,
        error: inputValidation.error + (inputValidation.errors ? `: ${JSON.stringify(inputValidation.errors)}` : '')
      };
    }

    // Execute handler
    const result = await operation.handler(input, context);

    // Validate output
    const outputValidation = validateOutput(operation, result);
    if (!outputValidation.success) {
      return {
        success: false,
        data: null,
        error: outputValidation.error
      };
    }

    return {
      success: true,
      data: outputValidation.data,
      error: null
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}
