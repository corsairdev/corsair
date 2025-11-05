import { z } from "zod";
import type {
  CorsairQuery,
  CorsairMutation,
  Dependencies,
  BaseOperation,
} from "./types";

type OperationInput<TContext, TInputSchema extends z.ZodType | any, TOutput> = {
  prompt: string;
  input_type: TInputSchema;
  dependencies?: Dependencies;
} & (
  | {
      response_type: z.ZodType<TOutput>;
      handler: (
        input: TInputSchema extends z.ZodType ? z.infer<TInputSchema> : TInputSchema,
        context: TContext
      ) => Promise<TOutput>;
    }
  | {
      response_type?: never;
      handler: (
        input: TInputSchema extends z.ZodType ? z.infer<TInputSchema> : TInputSchema,
        context: TContext
      ) => Promise<TOutput>;
    }
);

function createValidatedHandler<TInput, TOutput, TContext>(
  originalHandler: (input: TInput, context: TContext) => Promise<TOutput>,
  responseType: z.ZodType<TOutput> | undefined,
  inputType: any,
  operationType: string,
  prompt: string
) {
  return async (input: TInput, context: TContext): Promise<TOutput> => {
    // Validate input if it's a Zod schema
    let validatedInput = input;
    if (inputType && typeof inputType === 'object' && 'parse' in inputType) {
      try {
        validatedInput = (inputType as z.ZodType<TInput>).parse(input);
      } catch (error) {
        if (error instanceof z.ZodError) {
          throw new Error(
            `${operationType} "${prompt}" received invalid input: ${error.message}`
          );
        }
        throw error;
      }
    }

    const result = await originalHandler(validatedInput, context);

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

function createOperation<TContext, TInputSchema extends z.ZodType | any, TOutput>(
  input: OperationInput<TContext, TInputSchema, TOutput>,
  operationType: string
): BaseOperation<TInputSchema extends z.ZodType ? z.infer<TInputSchema> : TInputSchema, TOutput, TContext> {
  const wrappedHandler = createValidatedHandler(
    input.handler,
    input.response_type,
    input.input_type,
    operationType,
    input.prompt
  );

  return {
    prompt: input.prompt,
    input_type: input.input_type,
    response_type: input.response_type,
    dependencies: input.dependencies,
    handler: wrappedHandler,
  } as BaseOperation<TInputSchema extends z.ZodType ? z.infer<TInputSchema> : TInputSchema, TOutput, TContext>;
}

export function createQuery<TContext>() {
  return <TInputSchema extends z.ZodType | any, TOutput = any>(
    query: OperationInput<TContext, TInputSchema, TOutput>
  ): CorsairQuery<TInputSchema extends z.ZodType ? z.infer<TInputSchema> : TInputSchema, TOutput, TContext> => {
    return createOperation<TContext, TInputSchema, TOutput>(query, "Query");
  };
}

export function createMutation<TContext>() {
  return <TInputSchema extends z.ZodType | any, TOutput = any>(
    mutation: OperationInput<TContext, TInputSchema, TOutput>
  ): CorsairMutation<TInputSchema extends z.ZodType ? z.infer<TInputSchema> : TInputSchema, TOutput, TContext> => {
    return createOperation<TContext, TInputSchema, TOutput>(
      mutation,
      "Mutation"
    );
  };
}
