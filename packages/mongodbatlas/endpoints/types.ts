import type { z } from 'zod';
import {
	mongodbatlasInputSchemas,
	mongodbatlasOutputSchemas,
} from './openapi-schema';
import type {
	MongoDBAtlasOperationInputs,
	MongoDBAtlasOperationOutputs,
} from './operation-types';

// Inputs and outputs of every operation, keyed by its Corsair name
// (`pulls.reviews.create`, `issues.list`).

export type MongoDBAtlasEndpointInputs = MongoDBAtlasOperationInputs;
export type MongoDBAtlasEndpointOutputs = MongoDBAtlasOperationOutputs;

export type {
	MongoDBAtlasJsonValue,
	MongoDBAtlasOperationId,
} from './operation-types';

/**
 * Every operation's zod schemas by id. Each key is a getter that builds its
 * schema on first read; see endpoints/openapi-schema.ts.
 */
// `unknown` is necessary in the two casts below: TypeScript can't see the
// getters Object.defineProperty adds. schema.test.ts checks every id is present.
export const MongoDBAtlasEndpointInputSchemas =
	mongodbatlasInputSchemas as unknown as Readonly<
		Record<keyof MongoDBAtlasEndpointInputs, z.ZodType>
	>;

export const MongoDBAtlasEndpointOutputSchemas =
	// `unknown` because TypeScript can't see the getters Object.defineProperty adds (see above).
	mongodbatlasOutputSchemas as unknown as Readonly<
		Record<keyof MongoDBAtlasEndpointOutputs, z.ZodType>
	>;
