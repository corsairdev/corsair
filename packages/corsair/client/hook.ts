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
  response_type: z.ZodType<TOutput>;
  dependencies?: Dependencies;
  handler: (input: TInput, context: TContext) => Promise<TOutput>;
};

export type CorsairMutations<TContext = any> = {
  [K: string]: CorsairMutation<any, any, TContext>;
};

export const createMutation =
  <TContext>() =>
  <TInputSchema extends z.ZodType, TOutputSchema extends z.ZodType>(mutation: {
    prompt: string;
    input_type: TInputSchema;
    dependencies?: Dependencies;
    response_type: TOutputSchema;
    handler: (
      input: z.infer<TInputSchema>,
      context: TContext
    ) => Promise<z.infer<TOutputSchema>>;
  }): CorsairMutation<
    z.infer<TInputSchema>,
    z.infer<TOutputSchema>,
    TContext
  > => {
    return mutation as CorsairMutation<
      z.infer<TInputSchema>,
      z.infer<TOutputSchema>,
      TContext
    >;
  };

// QUERY TYPES
export type CorsairQuery<TInput = any, TOutput = any, TContext = any> = {
  prompt: string;
  input_type: z.ZodType<TInput>;
  response_type: z.ZodType<TOutput>;
  dependencies?: Dependencies;
  handler: (input: TInput, context: TContext) => Promise<TOutput>;
};

export type CorsairQueries<TContext = any> = Record<
  string,
  CorsairQuery<any, any, TContext>
>;

export const createQuery =
  <TContext>() =>
  <TInputSchema extends z.ZodType, TOutputSchema extends z.ZodType>(query: {
    prompt: string;
    input_type: TInputSchema;
    response_type: TOutputSchema;
    dependencies?: Dependencies;
    handler: (
      input: z.infer<TInputSchema>,
      context: TContext
    ) => Promise<z.infer<TOutputSchema>>;
  }): CorsairQuery<z.infer<TInputSchema>, z.infer<TOutputSchema>, TContext> => {
    return query as CorsairQuery<
      z.infer<TInputSchema>,
      z.infer<TOutputSchema>,
      TContext
    >;
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
> = InferZodOutput<TOperations[P]["response_type"]>;

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

          if (validate) {
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

          if (validate) {
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

      if (validate) {
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

      if (validate) {
        return mutation.response_type.parse(result);
      }

      return result;
    },
  };
}
