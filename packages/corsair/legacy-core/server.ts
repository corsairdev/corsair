import type {
  CorsairQueries,
  CorsairMutations,
  CorsairPrompt,
  InferOperationInput,
  InferOperationOutput,
  InferContext,
} from "./types";

type ServerOptions = {
  validate?: boolean;
};

export function createCorsairServerQueryClient<TQueries extends CorsairQueries<any>>(
  queries: TQueries,
  contextFactory: () => InferContext<TQueries[keyof TQueries]>
) {
  type TContext = InferContext<TQueries[keyof TQueries]>;

  return {
    query: async <P extends keyof TQueries>(
      prompt: CorsairPrompt<P>,
      input: InferOperationInput<TQueries, P>,
      options?: ServerOptions
    ): Promise<InferOperationOutput<TQueries, P>> => {
      const { validate = true } = options || {};
      const query = queries[prompt];
      const context = contextFactory() as TContext;

      if (validate) {
        query.input_type.parse(input);
      }

      const result = await query.handler(input, context);

      if (validate && query.response_type) {
        return query.response_type.parse(result) as InferOperationOutput<TQueries, P>;
      }

      return result as InferOperationOutput<TQueries, P>;
    },
  };
}

export function createCorsairServerMutationClient<TMutations extends CorsairMutations<any>>(
  mutations: TMutations,
  contextFactory: () => InferContext<TMutations[keyof TMutations]>
) {
  type TContext = InferContext<TMutations[keyof TMutations]>;

  return {
    mutate: async <P extends keyof TMutations>(
      prompt: CorsairPrompt<P>,
      input: InferOperationInput<TMutations, P>,
      options?: ServerOptions
    ): Promise<InferOperationOutput<TMutations, P>> => {
      const { validate = true } = options || {};
      const mutation = mutations[prompt];
      const context = contextFactory() as TContext;

      if (validate) {
        mutation.input_type.parse(input);
      }

      const result = await mutation.handler(input, context);

      if (validate && mutation.response_type) {
        return mutation.response_type.parse(result) as InferOperationOutput<TMutations, P>;
      }

      return result as InferOperationOutput<TMutations, P>;
    },
  };
}