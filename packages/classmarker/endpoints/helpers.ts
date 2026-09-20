import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { makeClassmarkerRequest } from '../client';

type Parseable<T> = {
	parse: (input: unknown) => T;
};

type EndpointContext = {
	key: string;
	$getAccountId: () => Promise<string>;
};

export async function runClassmarkerEndpoint<TInput, TOutput>(
	ctx: EndpointContext,
	params: {
		operation: string;
		path: string;
		// unknown justified: generic endpoint plumbing validated by Zod schemas.
		input: unknown;
		inputSchema: Parseable<TInput>;
		outputSchema: Parseable<TOutput>;
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
		query?: Record<string, string | number | boolean | undefined>;
		// unknown justified: request body is arbitrary caller-supplied JSON.
		body?: unknown;
		logPayload?: Record<string, unknown>;
		// unknown justified: untyped provider JSON, narrowed by callers/output schema.
		responseTransformer?: (response: unknown) => unknown;
	},
): Promise<TOutput> {
	if (!ctx.key) {
		throw new AuthMissingError('classmarker', 'api_key');
	}

	params.inputSchema.parse(params.input);
	const response = await makeClassmarkerRequest<unknown>(params.path, ctx.key, {
		method: params.method ?? 'GET',
		query: params.query,
		body: params.body,
	});

	const transformedResponse = params.responseTransformer
		? params.responseTransformer(response)
		: response;
	const parsed = params.outputSchema.parse(transformedResponse);

	await logEventFromContext(
		ctx,
		`classmarker.${params.operation}`,
		params.logPayload ?? {},
		'completed',
	);

	return parsed;
}
