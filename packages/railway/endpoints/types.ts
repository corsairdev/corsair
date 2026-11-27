import type { z } from 'zod';
import { railwayInputSchemas, railwayOutputSchemas } from './openapi-schema';
import type {
	RailwayOperationInputs,
	RailwayOperationOutputs,
} from './operation-types';

// Inputs and outputs of every operation, keyed by its Corsair name
// (`pulls.reviews.create`, `issues.list`).

export type RailwayEndpointInputs = RailwayOperationInputs;
export type RailwayEndpointOutputs = RailwayOperationOutputs;

export type {
	RailwayJsonValue,
	RailwayOperationId,
} from './operation-types';

/**
 * Every operation's zod schemas by id. Each key is a getter that builds its
 * schema on first read; see endpoints/openapi-schema.ts.
 */
// `unknown` is necessary in the two casts below: TypeScript can't see the
// getters Object.defineProperty adds. schema.test.ts checks every id is present.
export const RailwayEndpointInputSchemas =
	railwayInputSchemas as unknown as Readonly<
		Record<keyof RailwayEndpointInputs, z.ZodType>
	>;

export const RailwayEndpointOutputSchemas =
	// `unknown` because TypeScript can't see the getters Object.defineProperty adds (see above).
	railwayOutputSchemas as unknown as Readonly<
		Record<keyof RailwayEndpointOutputs, z.ZodType>
	>;
