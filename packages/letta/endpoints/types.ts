import type { z } from 'zod';
import { lettaInputSchemas, lettaOutputSchemas } from './openapi-schema';
import type {
	LettaOperationInputs,
	LettaOperationOutputs,
} from './operation-types';

// Inputs and outputs of every operation, keyed by its Corsair name
// (`projects.tasks.create`, `invoices.list`).

export type LettaEndpointInputs = LettaOperationInputs;
export type LettaEndpointOutputs = LettaOperationOutputs;

export type {
	LettaJsonValue,
	LettaOperationId,
} from './operation-types';

/**
 * Every operation's zod schemas by id. Each key is a getter that builds its
 * schema on first read; see endpoints/openapi-schema.ts.
 */
// `unknown` is necessary in the two casts below: TypeScript can't see the
// getters Object.defineProperty adds. schema.test.ts checks every id is present.
export const LettaEndpointInputSchemas =
	lettaInputSchemas as unknown as Readonly<
		Record<keyof LettaEndpointInputs, z.ZodType>
	>;

export const LettaEndpointOutputSchemas =
	// `unknown` because TypeScript can't see the getters Object.defineProperty adds (see above).
	lettaOutputSchemas as unknown as Readonly<
		Record<keyof LettaEndpointOutputs, z.ZodType>
	>;
