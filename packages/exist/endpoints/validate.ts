import type { z } from 'zod';
import type { ExistRequestContext, ExistRequestOptions } from '../client';
import { makeAuthenticatedExistRequest } from '../client';
import type { ExistEndpointInputs, ExistEndpointOutputs } from './types';
import { ExistEndpointInputSchemas, ExistEndpointOutputSchemas } from './types';

export class ExistValidationError extends Error {
	constructor(
		public readonly kind: 'input' | 'output',
		public readonly operation: string,
		// unknown is necessary because Zod issue arrays are provider-agnostic; a closed issue union is infeasible because paths and codes vary by schema
		public readonly issues: unknown,
	) {
		super(`[exist] ${kind} validation failed for ${operation}: ${issues}`);
		this.name = 'ExistValidationError';
	}
}

export type ExistOperationKey = keyof ExistEndpointInputs;

// unknown is necessary because the schema maps are heterogeneous per operation; a closed schema union is infeasible because twelve operations each carry their own shape
type AnyInputSchema = z.ZodType<any, any, any>;

const inputSchemaRecord = ExistEndpointInputSchemas as Record<
	ExistOperationKey,
	AnyInputSchema
>;
const outputSchemaRecord = ExistEndpointOutputSchemas as Record<
	ExistOperationKey,
	AnyInputSchema
>;

export function parseExistInput<K extends ExistOperationKey>(
	operation: K,
	// unknown is necessary because handlers receive shared raw input bags; a closed bag type is infeasible because twelve operations share this validator
	input: unknown,
): ExistEndpointInputs[K] {
	const parsed = inputSchemaRecord[operation].safeParse(input);
	if (!parsed.success) {
		throw new ExistValidationError('input', String(operation), parsed.error);
	}
	return parsed.data as ExistEndpointInputs[K];
}

export async function validatedExistRequest<K extends ExistOperationKey>(
	operation: K,
	endpoint: string,
	ctx: ExistRequestContext,
	options: ExistRequestOptions,
): Promise<ExistEndpointOutputs[K]> {
	const response = await makeAuthenticatedExistRequest<unknown>(
		endpoint,
		ctx,
		options,
	);
	const parsed = outputSchemaRecord[operation].safeParse(response);
	if (!parsed.success) {
		throw new ExistValidationError('output', String(operation), parsed.error);
	}
	return parsed.data as ExistEndpointOutputs[K];
}
