import { z } from 'zod'

export type Dependencies = {
  tables?: string[]
  columns?: string[]
}

export type CorsairPrompt<T> = T | (string & {})

export type OperationType = 'query' | 'mutation'

export interface BaseOperation<TInput, TOutput, TContext> {
  prompt: string
  input_type: z.ZodType<TInput> | TInput
  response_type?: z.ZodType<TOutput>
  dependencies?: Dependencies
  pseudocode?: string
  function_name?: string
  handler: (input: TInput, context: TContext) => Promise<TOutput>
}

export interface CorsairQuery<TInput, TOutput, TContext>
  extends BaseOperation<TInput, TOutput, TContext> {}

export interface CorsairMutation<TInput, TOutput, TContext>
  extends BaseOperation<TInput, TOutput, TContext> {}

export type CorsairQueries<TContext = unknown> = Record<
  string,
  CorsairQuery<any, any, TContext>
>

export type CorsairMutations<TContext = unknown> = Record<
  string,
  CorsairMutation<any, any, TContext>
>

export type CorsairOperations<TContext = unknown> =
  | CorsairQueries<TContext>
  | CorsairMutations<TContext>

export type InferInput<T> = T extends BaseOperation<infer TInput, any, any>
  ? TInput
  : never

export type InferOutput<T> = T extends BaseOperation<any, infer TOutput, any>
  ? TOutput
  : never

export type InferContext<T> = T extends BaseOperation<any, any, infer TContext>
  ? TContext
  : never

export type InferOperationInput<
  TOperations extends CorsairOperations<any>,
  P extends keyof TOperations
> = InferInput<TOperations[P]>

export type InferOperationOutput<
  TOperations extends CorsairOperations<any>,
  P extends keyof TOperations
> = InferOutput<TOperations[P]>

export type InferQueriesInputs<T extends CorsairQueries<any>> = {
  [K in keyof T]: InferInput<T[K]>
}

export type InferQueriesOutputs<T extends CorsairQueries<any>> = {
  [K in keyof T]: InferOutput<T[K]>
}

export type InferMutationsInputs<T extends CorsairMutations<any>> = {
  [K in keyof T]: InferInput<T[K]>
}

export type InferMutationsOutputs<T extends CorsairMutations<any>> = {
  [K in keyof T]: InferOutput<T[K]>
}

// Legacy type aliases for backward compatibility
export type InferQueryInput<T> = InferInput<T>
export type InferQueryOutput<T> = InferOutput<T>
export type InferMutationInput<T> = InferInput<T>
export type InferMutationOutput<T> = InferOutput<T>
