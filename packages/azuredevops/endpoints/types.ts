import type { z } from 'zod';
import {
	azuredevopsInputSchemas,
	azuredevopsOutputSchemas,
} from './openapi-schema';
import type {
	AzureDevopsOperationInputs,
	AzureDevopsOperationOutputs,
} from './operation-types';

// Inputs and outputs of every operation, keyed by its Corsair name
// (`projects.tasks.create`, `invoices.list`).

export type AzureDevopsEndpointInputs = AzureDevopsOperationInputs;
export type AzureDevopsEndpointOutputs = AzureDevopsOperationOutputs;

export type {
	AzureDevopsJsonValue,
	AzureDevopsOperationId,
} from './operation-types';

/**
 * Every operation's zod schemas by id. Each key is a getter that builds its
 * schema on first read; see endpoints/openapi-schema.ts.
 */
// `unknown` is necessary in the two casts below: TypeScript can't see the
// getters Object.defineProperty adds. schema.test.ts checks every id is present.
export const AzureDevopsEndpointInputSchemas =
	azuredevopsInputSchemas as unknown as Readonly<
		Record<keyof AzureDevopsEndpointInputs, z.ZodType>
	>;

export const AzureDevopsEndpointOutputSchemas =
	// `unknown` because TypeScript can't see the getters Object.defineProperty adds (see above).
	azuredevopsOutputSchemas as unknown as Readonly<
		Record<keyof AzureDevopsEndpointOutputs, z.ZodType>
	>;
