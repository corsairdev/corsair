import { z } from "zod";
import type {
  CorsairQuery,
  CorsairMutation,
  Dependencies,
  BaseOperation
} from "./types";

type OperationInput<TContext, TInputSchema extends z.ZodType, TOutput> = {
  prompt: string;
  input_type: TInputSchema;
  dependencies?: Dependencies;
} & (
  | {
      response_type: z.ZodType<TOutput>;
      handler: (input: z.infer<TInputSchema>, context: TContext) => Promise<TOutput>;
    }
  | {
      response_type?: never;
      handler: (input: z.infer<TInputSchema>, context: TContext) => Promise<TOutput>;
    }
);

function createValidatedHandler<TInput, TOutput, TContext>(
  originalHandler: (input: TInput, context: TContext) => Promise<TOutput>,
  responseType: z.ZodType<TOutput> | undefined,
  operationType: string,
  prompt: string
) {
  return async (input: TInput, context: TContext): Promise<TOutput> => {
    const result = await originalHandler(input, context);

    if (responseType) {
      try {
        return responseType.parse(result) as TOutput;
      } catch (error) {
        if (error instanceof z.ZodError) {
          throw new Error(
            `${operationType} "${prompt}" handler returned invalid data: ${error.message}`
          );
        }
        throw error;
      }
    }

    return result;
  };
}

function createOperation<TContext, TInputSchema extends z.ZodType, TOutput>(
  input: OperationInput<TContext, TInputSchema, TOutput>,
  operationType: string
): BaseOperation<z.infer<TInputSchema>, TOutput, TContext> {
  const wrappedHandler = createValidatedHandler(
    input.handler,
    input.response_type,
    operationType,
    input.prompt
  );

  return {
    prompt: input.prompt,
    input_type: input.input_type,
    response_type: input.response_type,
    dependencies: input.dependencies,
    handler: wrappedHandler,
  } as BaseOperation<z.infer<TInputSchema>, TOutput, TContext>;
}

export function createQuery<TContext>() {
  return <TInputSchema extends z.ZodType, TOutput = any>(
    query: OperationInput<TContext, TInputSchema, TOutput>
  ): CorsairQuery<z.infer<TInputSchema>, TOutput, TContext> => {
    return createOperation<TContext, TInputSchema, TOutput>(query, "Query");
  };
}

export function createMutation<TContext>() {
  return <TInputSchema extends z.ZodType, TOutput = any>(
    mutation: OperationInput<TContext, TInputSchema, TOutput>
  ): CorsairMutation<z.infer<TInputSchema>, TOutput, TContext> => {
    return createOperation<TContext, TInputSchema, TOutput>(mutation, "Mutation");
  };
}