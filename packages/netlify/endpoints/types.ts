import type { z } from 'zod';
import { netlifyInputSchemas, netlifyOutputSchemas } from './openapi-schema';
import type {
	NetlifyOperationInputs,
	NetlifyOperationOutputs,
} from './operation-types';

// Inputs and outputs of every operation, keyed by its Corsair name
// (`pulls.reviews.create`, `issues.list`).

export type NetlifyEndpointInputs = NetlifyOperationInputs;
export type NetlifyEndpointOutputs = NetlifyOperationOutputs;

export type {
	NetlifyJsonValue,
	NetlifyOperationId,
} from './operation-types';

/**
 * Every operation's zod schemas by id. Each key is a getter that builds its
 * schema on first read; see endpoints/openapi-schema.ts.
 */
// `unknown` is necessary in the two casts below: TypeScript can't see the
// getters Object.defineProperty adds. schema.test.ts checks every id is present.
export const NetlifyEndpointInputSchemas =
	netlifyInputSchemas as unknown as Readonly<
		Record<keyof NetlifyEndpointInputs, z.ZodType>
	>;

export const NetlifyEndpointOutputSchemas =
	// `unknown` because TypeScript can't see the getters Object.defineProperty adds (see above).
	netlifyOutputSchemas as unknown as Readonly<
		Record<keyof NetlifyEndpointOutputs, z.ZodType>
	>;
