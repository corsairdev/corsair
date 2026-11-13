import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { ForceManagerContext } from '..';
import type { ForceManagerEnvironment } from '../client';
import { makeForceManagerRequest } from '../client';
import { operationDefinitions } from './definitions';
import { forceManagerRoutes } from './routes';

type OperationKey = keyof typeof operationDefinitions;
type OperationInput<K extends OperationKey> = K extends OperationKey
	? z.infer<(typeof operationDefinitions)[K]['input']>
	: never;
type OperationOutput<K extends OperationKey> = K extends OperationKey
	? z.infer<(typeof operationDefinitions)[K]['output']>
	: never;

// `unknown` because caller input and provider responses need runtime validation before use.
function parseSchema<S extends z.ZodType>(
	schema: S,
	value: unknown,
): z.infer<S> {
	const result = schema.safeParse(value);
	if (!result.success) throw result.error;
	return result.data;
}

// `unknown` because transport JSON has no trusted static type before this operation's schema check.
function assertOperationOutput<K extends OperationKey>(
	key: K,
	value: unknown,
): asserts value is OperationOutput<K> {
	const result = operationDefinitions[key].output.safeParse(value);
	if (!result.success) throw result.error;
}

export function safeOperationLogPayload(
	operationId: string,
): Record<string, string> {
	return { operation: operationId };
}

// `unknown` because operation callers provide untrusted arguments before Zod validates them.
export async function executeForceManagerOperation<K extends OperationKey>(
	key: K,
	input: unknown,
	apiKey: string | undefined,
	environment: ForceManagerEnvironment = 'production',
): Promise<OperationOutput<K>> {
	const definition = operationDefinitions[key];
	const parsedInput = parseSchema(definition.input, input);
	let pathIndex = 0;
	const path = definition.path.replace(/\{ID\}|VALUE/g, (token) => {
		const name =
			token === '{ID}'
				? 'id'
				: pathIndex++ === 0
					? 'value'
					: `value${pathIndex}`;
		const pathValue = Object.entries(parsedInput.path ?? {}).find(
			([key]) => key === name,
		)?.[1];
		if (pathValue === undefined) {
			throw new Error(`Missing ForceManager path parameter: ${name}`);
		}
		return encodeURIComponent(String(pathValue));
	});
	const query = parsedInput.query;
	const route = forceManagerRoutes.find((candidate) => candidate.name === key);
	if (!route) {
		throw new Error(`ForceManager operation is out of scope: ${key}`);
	}
	const requestQuery: Record<string, string | number | boolean | undefined> = {
		page: query?.page,
		where: query?.where,
		order: query?.order,
		lang: query?.lang,
		...query?.filters,
	};
	const headers: Record<string, string> = {};
	if (parsedInput.headers?.count !== undefined && route.countHeader) {
		headers[route.countHeader] = String(parsedInput.headers.count);
	}
	if (parsedInput.headers?.extraFieldDescription !== undefined) {
		headers.ExtraFieldDescription = parsedInput.headers.extraFieldDescription;
	}
	// The transport response is provider JSON and remains untrusted until the operation output schema parses it.
	const response = await makeForceManagerRequest<unknown>(
		path,
		apiKey,
		{
			method: definition.method,
			body: parsedInput.body,
			query: requestQuery,
			headers,
		},
		environment,
	);
	assertOperationOutput(key, response);
	return response;
}

export function createOperation<K extends OperationKey>(
	key: K,
): CorsairEndpoint<ForceManagerContext, OperationInput<K>, OperationOutput<K>> {
	return async (ctx, input) => {
		const result = await executeForceManagerOperation(
			key,
			input,
			ctx.key,
			ctx.options.environment ?? 'production',
		);
		const definition = operationDefinitions[key];
		await logEventFromContext(
			ctx,
			`forcemanager.${definition.group}.${key}`,
			safeOperationLogPayload(definition.operationId),
			'completed',
		);
		return result;
	};
}
