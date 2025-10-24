import {
  useQuery,
  UseQueryOptions,
  useMutation,
  UseMutationOptions,
} from "@tanstack/react-query";
import { z } from "zod";

type Dependencies = {
  tables?: string[];
  columns?: string[];
};

export type CorsairMutation<TInput = any, TOutput = any, TContext = any> = {
  prompt: string;
  input_type: z.ZodType<TInput>;
  response_type?: z.ZodType<TOutput>;
  dependencies?: Dependencies;
  handler: (input: TInput, context: TContext) => Promise<TOutput>;
};

export type CorsairMutations<TContext = any> = {
  [K: string]: CorsairMutation<any, any, TContext>;
};

export const createMutation = <TContext>() => {
  return <TInputSchema extends z.ZodType, TOutput = any>(
    mutation: {
      prompt: string;
      input_type: TInputSchema;
      dependencies?: Dependencies;
    } & (
      | {
          response_type: z.ZodType<TOutput>;
          handler: (
            input: z.infer<TInputSchema>,
            context: TContext
          ) => Promise<TOutput>;
        }
      | {
          response_type?: never;
          handler: (
            input: z.infer<TInputSchema>,
            context: TContext
          ) => Promise<TOutput>;
        }
    )
  ): CorsairMutation<z.infer<TInputSchema>, TOutput, TContext> => {
    // Wrap handler with runtime validation if response_type is provided
    const originalHandler = mutation.handler;
    const wrappedHandler = async (
      input: z.infer<TInputSchema>,
      context: TContext
    ): Promise<TOutput> => {
      const result = await originalHandler(input, context);

      // Runtime validation if schema is provided
      if (mutation.response_type) {
        try {
          return mutation.response_type.parse(result) as TOutput;
        } catch (error) {
          if (error instanceof z.ZodError) {
            throw new Error(
              `Mutation "${mutation.prompt}" handler returned invalid data: ${error.message}`
            );
          }
          throw error;
        }
      }

      return result;
    };

    return {
      prompt: mutation.prompt,
      input_type: mutation.input_type,
      response_type: mutation.response_type,
      dependencies: mutation.dependencies,
      handler: wrappedHandler,
    } as CorsairMutation<z.infer<TInputSchema>, TOutput, TContext>;
  };
};

// QUERY TYPES
export type CorsairQuery<TInput = any, TOutput = any, TContext = any> = {
  prompt: string;
  input_type: z.ZodType<TInput>;
  response_type?: z.ZodType<TOutput>;
  dependencies?: Dependencies;
  handler: (input: TInput, context: TContext) => Promise<TOutput>;
};

export type CorsairQueries<TContext = any> = Record<
  string,
  CorsairQuery<any, any, TContext>
>;

export const createQuery = <TContext>() => {
  return <TInputSchema extends z.ZodType, TOutput = any>(
    query: {
      prompt: string;
      input_type: TInputSchema;
      dependencies?: Dependencies;
    } & (
      | {
          response_type: z.ZodType<TOutput>;
          handler: (
            input: z.infer<TInputSchema>,
            context: TContext
          ) => Promise<TOutput>;
        }
      | {
          response_type?: never;
          handler: (
            input: z.infer<TInputSchema>,
            context: TContext
          ) => Promise<TOutput>;
        }
    )
  ): CorsairQuery<z.infer<TInputSchema>, TOutput, TContext> => {
    // Wrap handler with runtime validation if response_type is provided
    const originalHandler = query.handler;
    const wrappedHandler = async (
      input: z.infer<TInputSchema>,
      context: TContext
    ): Promise<TOutput> => {
      const result = await originalHandler(input, context);

      // Runtime validation if schema is provided
      if (query.response_type) {
        try {
          return query.response_type.parse(result) as TOutput;
        } catch (error) {
          if (error instanceof z.ZodError) {
            throw new Error(
              `Query "${query.prompt}" handler returned invalid data: ${error.message}`
            );
          }
          throw error;
        }
      }

      return result;
    };

    return {
      prompt: query.prompt,
      input_type: query.input_type,
      response_type: query.response_type,
      dependencies: query.dependencies,
      handler: wrappedHandler,
    } as CorsairQuery<z.infer<TInputSchema>, TOutput, TContext>;
  };
};

// Type utilities
type InferZodInput<T> = T extends z.ZodType<infer U> ? U : never;
type InferZodOutput<T> = T extends z.ZodType<infer U> ? U : never;

type InputForPrompt<
  TOperations extends CorsairMutations | CorsairQueries,
  P extends keyof TOperations
> = InferZodInput<TOperations[P]["input_type"]>;

type OutputForPrompt<
  TOperations extends CorsairMutations | CorsairQueries,
  P extends keyof TOperations
> = TOperations[P] extends CorsairQuery<any, infer TOutput, any>
  ? TOutput
  : TOperations[P] extends CorsairMutation<any, infer TOutput, any>
  ? TOutput
  : never;

// Public type inference utilities (similar to tRPC's inferRouterOutputs)
export type InferQueryOutput<T> = T extends CorsairQuery<any, infer TOutput, any>
  ? TOutput
  : never;

export type InferQueryInput<T> = T extends CorsairQuery<infer TInput, any, any>
  ? TInput
  : never;

export type InferMutationOutput<T> = T extends CorsairMutation<
  any,
  infer TOutput,
  any
>
  ? TOutput
  : never;

export type InferMutationInput<T> = T extends CorsairMutation<
  infer TInput,
  any,
  any
>
  ? TInput
  : never;

export type InferQueriesOutputs<T extends CorsairQueries> = {
  [K in keyof T]: InferQueryOutput<T[K]>;
};

export type InferQueriesInputs<T extends CorsairQueries> = {
  [K in keyof T]: InferQueryInput<T[K]>;
};

export type InferMutationsOutputs<T extends CorsairMutations> = {
  [K in keyof T]: InferMutationOutput<T[K]>;
};

export type InferMutationsInputs<T extends CorsairMutations> = {
  [K in keyof T]: InferMutationInput<T[K]>;
};

export function createCorsairQueryClient<TQueries extends CorsairQueries>(
  queries: TQueries
) {
  return {
    useQuery: <P extends keyof TQueries>(
      prompt: P,
      input: InputForPrompt<TQueries, P>,
      options?: Omit<
        UseQueryOptions<OutputForPrompt<TQueries, P>>,
        "queryKey" | "queryFn"
      > & {
        endpoint?: string;
        validate?: boolean;
      }
    ) => {
      const {
        endpoint = "/api/corsair",
        validate = true,
        ...queryOptions
      } = options || {};

      const query = queries[prompt];

      return useQuery<OutputForPrompt<TQueries, P>>({
        // Use prompt + input as cache key
        queryKey: [prompt, input],
        queryFn: async () => {
          if (validate) {
            query.input_type.parse(input);
          }

          const res = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              prompt: query.prompt,
              input,
              operation: "query",
            }),
          });

          if (!res.ok) {
            const error = await res
              .json()
              .catch(() => ({ message: "Unknown error" }));
            throw new Error(error.message || `API error: ${res.status}`);
          }

          const data = await res.json();

          if (validate && query.response_type) {
            return query.response_type.parse(data);
          }

          return data;
        },
        ...queryOptions,
      });
    },
  };
}

export function createCorsairMutationClient<
  TMutations extends CorsairMutations
>(mutations: TMutations) {
  return {
    useMutation: <P extends keyof TMutations>(
      prompt: P,
      options?: Omit<
        UseMutationOptions<
          OutputForPrompt<TMutations, P>,
          Error,
          InputForPrompt<TMutations, P>
        >,
        "mutationFn"
      > & {
        endpoint?: string;
        validate?: boolean;
      }
    ) => {
      const {
        endpoint = "/api/corsair",
        validate = true,
        ...mutationOptions
      } = options || {};

      const mutation = mutations[prompt];

      return useMutation<
        OutputForPrompt<TMutations, P>,
        Error,
        InputForPrompt<TMutations, P>
      >({
        ...mutationOptions,
        mutationFn: async (input) => {
          if (validate) {
            mutation.input_type.parse(input);
          }

          const res = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              prompt: mutation.prompt,
              input,
              operation: "mutation",
            }),
          });

          if (!res.ok) {
            const error = await res
              .json()
              .catch(() => ({ message: "Unknown error" }));
            throw new Error(error.message || `API error: ${res.status}`);
          }

          const data = await res.json();

          if (validate && mutation.response_type) {
            return mutation.response_type.parse(data);
          }

          return data;
        },
      });
    },
  };
}

export function createCorsairServerQueryClient<TQueries extends CorsairQueries>(
  queries: TQueries,
  contextFactory: () => TQueries[keyof TQueries] extends CorsairQuery<
    any,
    any,
    infer C
  >
    ? C
    : never
) {
  type TContext = TQueries[keyof TQueries] extends CorsairQuery<
    any,
    any,
    infer C
  >
    ? C
    : never;

  return {
    query: async <P extends keyof TQueries>(
      prompt: P,
      input: InputForPrompt<TQueries, P>,
      options?: {
        validate?: boolean;
      }
    ): Promise<OutputForPrompt<TQueries, P>> => {
      const { validate = true } = options || {};
      const query = queries[prompt];
      const context = contextFactory() as TContext;

      if (validate) {
        query.input_type.parse(input);
      }

      const result = await query.handler(input, context);

      if (validate && query.response_type) {
        return query.response_type.parse(result);
      }

      return result;
    },
  };
}

export function createCorsairServerMutationClient<
  TMutations extends CorsairMutations
>(
  mutations: TMutations,
  contextFactory: () => TMutations[keyof TMutations] extends CorsairMutation<
    any,
    any,
    infer C
  >
    ? C
    : never
) {
  type TContext = TMutations[keyof TMutations] extends CorsairMutation<
    any,
    any,
    infer C
  >
    ? C
    : never;

  return {
    mutate: async <P extends keyof TMutations>(
      prompt: P,
      input: InputForPrompt<TMutations, P>,
      options?: {
        validate?: boolean;
      }
    ): Promise<OutputForPrompt<TMutations, P>> => {
      const { validate = true } = options || {};
      const mutation = mutations[prompt];
      const context = contextFactory() as TContext;

      if (validate) {
        mutation.input_type.parse(input);
      }

      const result = await mutation.handler(input, context);

      if (validate && mutation.response_type) {
        return mutation.response_type.parse(result);
      }

      return result;
    },
  };
}
