import type { z } from 'zod';
import { ghostInputSchemas, ghostOutputSchemas } from './openapi-schema';
import type {
	GhostOperationInputs,
	GhostOperationOutputs,
} from './operation-types';

// Inputs and outputs of every operation, keyed by its Corsair name
// (`projects.tasks.create`, `invoices.list`).

export type GhostEndpointInputs = GhostOperationInputs;
export type GhostEndpointOutputs = GhostOperationOutputs;

export type {
	GhostJsonValue,
	GhostOperationId,
} from './operation-types';

/**
 * Every operation's zod schemas by id. Each key is a getter that builds its
 * schema on first read; see endpoints/openapi-schema.ts.
 */
// `unknown` is necessary in the two casts below: TypeScript can't see the
// getters Object.defineProperty adds. schema.test.ts checks every id is present.
export const GhostEndpointInputSchemas =
	ghostInputSchemas as unknown as Readonly<
		Record<keyof GhostEndpointInputs, z.ZodType>
	>;

export const GhostEndpointOutputSchemas =
	// `unknown` because TypeScript can't see the getters Object.defineProperty adds (see above).
	ghostOutputSchemas as unknown as Readonly<
		Record<keyof GhostEndpointOutputs, z.ZodType>
	>;
