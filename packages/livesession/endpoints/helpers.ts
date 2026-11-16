import { logEventFromContext } from 'corsair/core';
import type { LiveSessionContext } from '../index';
import type {
	LiveSessionEndpointInputs,
	LiveSessionEndpointOutputs,
} from './types';
import {
	LiveSessionEndpointInputSchemas,
	LiveSessionEndpointOutputSchemas,
} from './types';

export class LiveSessionValidationError extends Error {
	constructor(
		public readonly kind: 'input' | 'output',
		public readonly operation: string,
		// unknown is necessary because Zod issue arrays are provider-agnostic; a
		// closed issue union is infeasible because paths and codes vary by schema.
		public readonly issues: unknown,
	) {
		super(`[livesession] ${kind} validation failed for ${operation}`);
		this.name = 'LiveSessionValidationError';
	}
}

export function parseInput<K extends keyof LiveSessionEndpointInputs>(
	operation: K,
	input: LiveSessionEndpointInputs[K],
): LiveSessionEndpointInputs[K] {
	const schema = LiveSessionEndpointInputSchemas[operation];
	const parsed = schema.safeParse(input);
	if (!parsed.success) {
		throw new LiveSessionValidationError(
			'input',
			String(operation),
			parsed.error,
		);
	}
	// Safe: the operation key selects the matching schema, so the parsed value
	// has the same shape as the declared input for that key.
	return parsed.data as LiveSessionEndpointInputs[K];
}

export function parseOutput<K extends keyof LiveSessionEndpointOutputs>(
	operation: K,
	response: LiveSessionEndpointOutputs[K],
): LiveSessionEndpointOutputs[K] {
	const schema = LiveSessionEndpointOutputSchemas[operation];
	const parsed = schema.safeParse(response);
	if (!parsed.success) {
		throw new LiveSessionValidationError(
			'output',
			String(operation),
			parsed.error,
		);
	}
	// Safe: the operation key selects the matching schema, so the parsed value
	// has the same shape as the declared output for that key.
	return parsed.data as LiveSessionEndpointOutputs[K];
}

export async function complete<T>(
	ctx: LiveSessionContext,
	operation: string,
	request: Promise<T>,
): Promise<T> {
	const response = await request;
	// Operation and status are sufficient; request fields can contain customer data.
	await logEventFromContext(ctx, operation, {}, 'completed');
	return response;
}
