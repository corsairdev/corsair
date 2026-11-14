import { AuthMissingError, logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { EncodianContext } from '..';
import { makeEncodianRequest } from '../client';
import {
	EncodianEndpointInputSchemas,
	EncodianEndpointOutputSchemas,
	EncodianOperationRoutes,
} from './generated';
import type { EncodianOperationId } from './types';

type ParsedOperationInput = {
	// `unknown` because operation bodies differ; operation schemas validate each body before use.
	body?: unknown;
	query?: Record<string, string | number | boolean | undefined>;
	path?: Record<string, string | number>;
};

// `unknown` because Zod's generic output type does not expose the shared request envelope.
function isParsedOperationInput(value: unknown): value is ParsedOperationInput {
	if (typeof value !== 'object' || value === null || Array.isArray(value))
		return false;
	if ('query' in value && value.query !== undefined) {
		if (
			typeof value.query !== 'object' ||
			value.query === null ||
			Array.isArray(value.query)
		)
			return false;
		if (
			!Object.values(value.query).every(
				(item) =>
					typeof item === 'string' ||
					typeof item === 'number' ||
					typeof item === 'boolean' ||
					item === undefined,
			)
		)
			return false;
	}
	if ('path' in value) {
		if (
			typeof value.path !== 'object' ||
			value.path === null ||
			Array.isArray(value.path)
		)
			return false;
		if (
			!Object.values(value.path).every(
				(item) => typeof item === 'string' || typeof item === 'number',
			)
		)
			return false;
	}
	return true;
}

async function executeWithSchemas<
	TInput extends z.ZodType,
	TOutput extends z.ZodType,
>(
	route: (typeof EncodianOperationRoutes)[EncodianOperationId],
	inputSchema: TInput,
	outputSchema: TOutput,
	apiKey: string | undefined,
	// `unknown` is accepted only at this transport boundary and parsed before network I/O.
	input: unknown,
): Promise<z.output<TOutput>> {
	if (!apiKey) throw new AuthMissingError('encodian', 'api_key');
	const parsedInput = inputSchema.parse(input);
	if (!isParsedOperationInput(parsedInput))
		throw new Error('Encodian input must be an operation object');
	const response = await makeEncodianRequest(route, apiKey, parsedInput);
	return outputSchema.parse(response);
}

export async function callEncodianOperation(
	id: EncodianOperationId,
	apiKey: string | undefined,
	// `unknown` lets tests exercise malformed calls that public endpoint types reject at compile time.
	input: unknown,
): Promise<unknown> {
	// `unknown` because responses are consumed only after the operation output schema parses them.
	return executeWithSchemas(
		EncodianOperationRoutes[id],
		EncodianEndpointInputSchemas[id],
		EncodianEndpointOutputSchemas[id],
		apiKey,
		input,
	);
}

export function createEncodianEndpoint<K extends EncodianOperationId>(id: K) {
	const route = EncodianOperationRoutes[id];
	const inputSchema = EncodianEndpointInputSchemas[id];
	const outputSchema = EncodianEndpointOutputSchemas[id];
	return async (ctx: EncodianContext, input: z.input<typeof inputSchema>) => {
		const result = await executeWithSchemas(
			route,
			inputSchema,
			outputSchema,
			ctx.key,
			input,
		);
		await logEventFromContext(
			ctx,
			'encodian.' + id,
			encodianLogPayload(id),
			'completed',
		);
		return result;
	};
}

export function encodianLogPayload(operationId: EncodianOperationId): {
	operationId: string;
} {
	return { operationId };
}
