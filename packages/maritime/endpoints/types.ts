import type { z } from 'zod';
import { maritimeInputSchemas, maritimeOutputSchemas } from './openapi-schema';
import type {
	MaritimeOperationInputs,
	MaritimeOperationOutputs,
} from './operation-types';

// Inputs and outputs of every operation, keyed by its Corsair name
// (`sandboxes.commands.run`, `agents.list`).

export type MaritimeEndpointInputs = MaritimeOperationInputs;
export type MaritimeEndpointOutputs = MaritimeOperationOutputs;

export type {
	MaritimeJsonValue,
	MaritimeOperationId,
} from './operation-types';

/**
 * Every operation's zod schemas by id. Each key is a getter that builds its
 * schema on first read; see endpoints/openapi-schema.ts.
 */
// `unknown` is necessary in the two casts below: TypeScript can't see the
// getters Object.defineProperty adds. schema.test.ts checks every id is present.
export const MaritimeEndpointInputSchemas =
	maritimeInputSchemas as unknown as Readonly<
		Record<keyof MaritimeEndpointInputs, z.ZodType>
	>;

export const MaritimeEndpointOutputSchemas =
	// `unknown` because TypeScript can't see the getters Object.defineProperty adds (see above).
	maritimeOutputSchemas as unknown as Readonly<
		Record<keyof MaritimeEndpointOutputs, z.ZodType>
	>;
