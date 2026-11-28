import type { z } from 'zod';
import { n8nInputSchemas, n8nOutputSchemas } from './openapi-schema';
import type {
	N8nOperationInputs,
	N8nOperationOutputs,
} from './operation-types';

// Inputs and outputs of every operation, keyed by its Corsair name
// (`projects.tasks.create`, `invoices.list`).

export type N8nEndpointInputs = N8nOperationInputs;
export type N8nEndpointOutputs = N8nOperationOutputs;

export type {
	N8nJsonValue,
	N8nOperationId,
} from './operation-types';

/**
 * Every operation's zod schemas by id. Each key is a getter that builds its
 * schema on first read; see endpoints/openapi-schema.ts.
 */
// `unknown` is necessary in the two casts below: TypeScript can't see the
// getters Object.defineProperty adds. schema.test.ts checks every id is present.
export const N8nEndpointInputSchemas = n8nInputSchemas as unknown as Readonly<
	Record<keyof N8nEndpointInputs, z.ZodType>
>;

export const N8nEndpointOutputSchemas =
	// `unknown` because TypeScript can't see the getters Object.defineProperty adds (see above).
	n8nOutputSchemas as unknown as Readonly<
		Record<keyof N8nEndpointOutputs, z.ZodType>
	>;
