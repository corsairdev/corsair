import type { z } from 'zod';
import {
	defillamaInputSchemas,
	defillamaOutputSchemas,
} from './openapi-schema';
import type {
	DefillamaOperationInputs,
	DefillamaOperationOutputs,
} from './operation-types';

// Inputs and outputs of every operation, keyed by its Corsair name
// (`pulls.reviews.create`, `issues.list`).

export type DefillamaEndpointInputs = DefillamaOperationInputs;
export type DefillamaEndpointOutputs = DefillamaOperationOutputs;

export type {
	DefillamaJsonValue,
	DefillamaOperationId,
} from './operation-types';

/**
 * Every operation's zod schemas by id. Each key is a getter that builds its
 * schema on first read; see endpoints/openapi-schema.ts.
 */
// `unknown` is necessary in the two casts below: TypeScript can't see the
// getters Object.defineProperty adds. schema.test.ts checks every id is present.
export const DefillamaEndpointInputSchemas =
	defillamaInputSchemas as unknown as Readonly<
		Record<keyof DefillamaEndpointInputs, z.ZodType>
	>;

export const DefillamaEndpointOutputSchemas =
	// `unknown` because TypeScript can't see the getters Object.defineProperty adds (see above).
	defillamaOutputSchemas as unknown as Readonly<
		Record<keyof DefillamaEndpointOutputs, z.ZodType>
	>;
