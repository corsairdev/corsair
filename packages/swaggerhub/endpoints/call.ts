import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { SwaggerhubContext } from '..';
import type { SwaggerhubRequest } from '../client';
import { makeSwaggerhubRequest } from '../client';

type LogFields = Record<string, string | number | boolean | undefined>;

/**
 * Validates the input, sends the request, validates the response, then logs the
 * event. A definition can be a whole API document, so `log` reports the owner,
 * name and version rather than the body.
 */
export async function call<Input extends z.ZodType, Output extends z.ZodType>(
	ctx: SwaggerhubContext,
	operation: { event: string; input: Input; output: Output },
	// unknown: raw caller input, parsed below by the operation's input schema.
	rawInput: unknown,
	toRequest: (parsed: z.output<Input>) => SwaggerhubRequest,
	options: {
		// unknown: raw is the response body. The output schema validates whatever
		// this returns.
		shape?: (raw: unknown, parsed: z.output<Input>) => unknown;
		log?: (parsed: z.output<Input>, result: z.output<Output>) => LogFields;
	} = {},
): Promise<z.output<Output>> {
	const parsed = operation.input.parse(rawInput ?? {});

	/** Logging never decides the outcome: a log failure must not mask a result. */
	const logSafely = async (
		payload: LogFields,
		status: 'completed' | 'failed',
	): Promise<void> => {
		await logEventFromContext(
			ctx,
			`swaggerhub.${operation.event}`,
			payload,
			status,
		).catch(() => undefined);
	};

	let result: z.output<Output>;
	try {
		const raw = await makeSwaggerhubRequest(ctx.key, toRequest(parsed));
		result = operation.output.parse(
			options.shape ? options.shape(raw, parsed) : raw,
		);
	} catch (error) {
		// Only the request and the response parse are inside this try. The success
		// log is outside it on purpose: `logEvent` throws when `encryptDataAtRest`
		// is configured without a kek, and if a *write* had already landed, a
		// rethrow from here would report success as failure and a retry would
		// duplicate it.
		await logSafely(
			{
				failed: true,
				error: error instanceof Error ? error.message : String(error),
			},
			'failed',
		);
		throw error;
	}

	await logSafely(options.log?.(parsed, result) ?? {}, 'completed');
	return result;
}

/** Drops unset query values so nothing empty is sent. */
export function queryOf(
	values: Record<string, string | number | boolean | undefined>,
): Record<string, string | number | boolean | undefined> {
	return Object.fromEntries(
		Object.entries(values).filter(([, value]) => value !== undefined),
	);
}

/**
 * Reads the text body of a definition route. SwaggerHub serves the definition
 * under `application/yaml`, `application/json`, `text/plain` or
 * `application/graphql` depending on how it was stored, and `corsair/http` parses
 * JSON but leaves the others as text, so an object is re-serialized to keep the
 * output one shape.
 * unknown: the body is whatever the route served.
 */
export function readDefinition(raw: unknown): string {
	if (typeof raw === 'string') return raw;
	if (raw === undefined || raw === null) return '';
	// A JSON or YAML definition that the parser already turned into an object.
	return JSON.stringify(raw);
}

/**
 * Turns a missing or non-array `<key>` array into a named failure, so a route
 * that answered an unexpected shape does not read as an empty list.
 * unknown: the body is untyped until this reads it.
 */
export function readArray<T>(
	// unknown: the body is untyped until this reads the key off it.
	container: unknown,
	key: string,
	parse: (item: unknown) => T,
	label: string,
): T[] {
	const record =
		container !== null && typeof container === 'object'
			? (container as Record<string, unknown>)
			: undefined;
	const value = record?.[key];
	if (!Array.isArray(value)) {
		throw new Error(`SwaggerHub returned no ${key} array for ${label}`);
	}
	return value.map(parse);
}
