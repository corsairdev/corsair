import type { z } from 'zod';
import {
	wordpressInputSchemas,
	wordpressOutputSchemas,
} from './openapi-schema';
import type {
	WordpressOperationInputs,
	WordpressOperationOutputs,
} from './operation-types';

// Inputs and outputs of every operation, keyed by its Corsair name
// (`pulls.reviews.create`, `issues.list`).

export type WordpressEndpointInputs = WordpressOperationInputs;
export type WordpressEndpointOutputs = WordpressOperationOutputs;

export type {
	WordpressJsonValue,
	WordpressOperationId,
} from './operation-types';

/**
 * Every operation's zod schemas by id. Each key is a getter that builds its
 * schema on first read; see endpoints/openapi-schema.ts.
 */
// `unknown` is necessary in the two casts below: TypeScript can't see the
// getters Object.defineProperty adds. schema.test.ts checks every id is present.
export const WordpressEndpointInputSchemas =
	wordpressInputSchemas as unknown as Readonly<
		Record<keyof WordpressEndpointInputs, z.ZodType>
	>;

export const WordpressEndpointOutputSchemas =
	// `unknown` because TypeScript can't see the getters Object.defineProperty adds (see above).
	wordpressOutputSchemas as unknown as Readonly<
		Record<keyof WordpressEndpointOutputs, z.ZodType>
	>;
