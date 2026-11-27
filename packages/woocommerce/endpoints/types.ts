import type { z } from 'zod';
import {
	woocommerceInputSchemas,
	woocommerceOutputSchemas,
} from './openapi-schema';
import type {
	WoocommerceOperationInputs,
	WoocommerceOperationOutputs,
} from './operation-types';

// Inputs and outputs of every operation, keyed by its Corsair name
// (`pulls.reviews.create`, `issues.list`).

export type WoocommerceEndpointInputs = WoocommerceOperationInputs;
export type WoocommerceEndpointOutputs = WoocommerceOperationOutputs;

export type {
	WoocommerceJsonValue,
	WoocommerceOperationId,
} from './operation-types';

/**
 * Every operation's zod schemas by id. Each key is a getter that builds its
 * schema on first read; see endpoints/openapi-schema.ts.
 */
// `unknown` is necessary in the two casts below: TypeScript can't see the
// getters Object.defineProperty adds. schema.test.ts checks every id is present.
export const WoocommerceEndpointInputSchemas =
	woocommerceInputSchemas as unknown as Readonly<
		Record<keyof WoocommerceEndpointInputs, z.ZodType>
	>;

export const WoocommerceEndpointOutputSchemas =
	// `unknown` because TypeScript can't see the getters Object.defineProperty adds (see above).
	woocommerceOutputSchemas as unknown as Readonly<
		Record<keyof WoocommerceEndpointOutputs, z.ZodType>
	>;
