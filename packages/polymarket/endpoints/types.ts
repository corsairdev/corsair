import type { z } from 'zod';
import {
	polymarketInputSchemas,
	polymarketOutputSchemas,
} from './openapi-schema';
import type {
	PolymarketOperationInputs,
	PolymarketOperationOutputs,
} from './operation-types';

// Inputs and outputs of every operation, keyed by its Corsair name
// (`pulls.reviews.create`, `issues.list`).

export type PolymarketEndpointInputs = PolymarketOperationInputs;
export type PolymarketEndpointOutputs = PolymarketOperationOutputs;

export type {
	PolymarketJsonValue,
	PolymarketOperationId,
} from './operation-types';

/**
 * Every operation's zod schemas by id. Each key is a getter that builds its
 * schema on first read; see endpoints/openapi-schema.ts.
 */
// `unknown` is necessary in the two casts below: TypeScript can't see the
// getters Object.defineProperty adds. schema.test.ts checks every id is present.
export const PolymarketEndpointInputSchemas =
	polymarketInputSchemas as unknown as Readonly<
		Record<keyof PolymarketEndpointInputs, z.ZodType>
	>;

export const PolymarketEndpointOutputSchemas =
	// `unknown` because TypeScript can't see the getters Object.defineProperty adds (see above).
	polymarketOutputSchemas as unknown as Readonly<
		Record<keyof PolymarketEndpointOutputs, z.ZodType>
	>;
