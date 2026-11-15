import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import { z } from 'zod';
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

const responseSchemaCache = new WeakMap<z.ZodType, z.ZodType>();

/**
 * The operation schemas come from the OpenAPI examples, so they say `string` where real records hold
 * `null`, and pin one scalar type per field. Those strict shapes stay on the inputs and in the docs; a
 * response is parsed with this looser copy instead, so a call that already ran on ForceManager is not
 * reported as failed because a field came back empty or as a number. Object shapes are kept: every
 * known field may be missing or null, scalars accept any JSON scalar, unknown fields pass through.
 */
export function toResponseSchema(schema: z.ZodType): z.ZodType {
	const cached = responseSchemaCache.get(schema);
	if (cached) return cached;
	let loose: z.ZodType = schema;
	if (schema instanceof z.ZodObject) {
		const shape: Record<string, z.ZodType> = {};
		for (const [key, value] of Object.entries(schema.shape)) {
			shape[key] = toResponseSchema(value as z.ZodType).nullish();
		}
		loose = z.object(shape).passthrough();
	} else if (
		schema instanceof z.ZodOptional ||
		schema instanceof z.ZodNullable
	) {
		loose = toResponseSchema(schema.unwrap() as z.ZodType).nullish();
	} else if (schema instanceof z.ZodArray) {
		loose = z.array(toResponseSchema(schema.element as z.ZodType));
	} else if (schema instanceof z.ZodRecord) {
		loose = z.record(
			z.string(),
			toResponseSchema(schema.valueType as z.ZodType).nullish(),
		);
	} else if (schema instanceof z.ZodUnion) {
		const options = schema.options as readonly z.ZodType[];
		loose = z.union(options.map((option) => toResponseSchema(option)));
	} else if (
		schema instanceof z.ZodString ||
		schema instanceof z.ZodNumber ||
		schema instanceof z.ZodBoolean ||
		schema instanceof z.ZodEnum
	) {
		loose = z.union([z.string(), z.number(), z.boolean()]);
	}
	responseSchemaCache.set(schema, loose);
	return loose;
}

// `unknown` because transport JSON has no trusted static type before this operation's schema check.
function assertOperationOutput<K extends OperationKey>(
	key: K,
	value: unknown,
): asserts value is OperationOutput<K> {
	const result = toResponseSchema(operationDefinitions[key].output).safeParse(
		value,
	);
	if (!result.success) throw result.error;
}

export function assertForceManagerLoggingConfiguration(
	context: Parameters<typeof logEventFromContext>[0],
): void {
	if (context.encryptDataAtRest && !context.kek) {
		throw new Error('encryptDataAtRest requires kek');
	}
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
		const segment = String(pathValue);
		if (segment === '.' || segment === '..') {
			throw new Error(`Invalid ForceManager path parameter: ${name}`);
		}
		return encodeURIComponent(segment);
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
		assertForceManagerLoggingConfiguration(ctx);
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
