import type { z } from 'zod';
import { steelInputSchemas, steelOutputSchemas } from './openapi-schema';
import type {
	SteelOperationInputs,
	SteelOperationOutputs,
} from './operation-types';

// Inputs and outputs of every operation, keyed by its Corsair name
// (`projects.tasks.create`, `invoices.list`).

export type SteelEndpointInputs = SteelOperationInputs;
export type SteelEndpointOutputs = SteelOperationOutputs;

export type {
	SteelJsonValue,
	SteelOperationId,
} from './operation-types';

/**
 * Every operation's zod schemas by id. Each key is a getter that builds its
 * schema on first read; see endpoints/openapi-schema.ts.
 */
// `unknown` is necessary in the two casts below: TypeScript can't see the
// getters Object.defineProperty adds. schema.test.ts checks every id is present.
export const SteelEndpointInputSchemas =
	steelInputSchemas as unknown as Readonly<
		Record<keyof SteelEndpointInputs, z.ZodType>
	>;

export const SteelEndpointOutputSchemas =
	// `unknown` because TypeScript can't see the getters Object.defineProperty adds (see above).
	steelOutputSchemas as unknown as Readonly<
		Record<keyof SteelEndpointOutputs, z.ZodType>
	>;
