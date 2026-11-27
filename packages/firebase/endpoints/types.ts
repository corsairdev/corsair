import type { z } from 'zod';
import { firebaseInputSchemas, firebaseOutputSchemas } from './openapi-schema';
import type {
	FirebaseOperationInputs,
	FirebaseOperationOutputs,
} from './operation-types';

// Inputs and outputs of every operation, keyed by its Corsair name
// (`pulls.reviews.create`, `issues.list`).

export type FirebaseEndpointInputs = FirebaseOperationInputs;
export type FirebaseEndpointOutputs = FirebaseOperationOutputs;

export type {
	FirebaseJsonValue,
	FirebaseOperationId,
} from './operation-types';

/**
 * Every operation's zod schemas by id. Each key is a getter that builds its
 * schema on first read; see endpoints/openapi-schema.ts.
 */
// `unknown` is necessary in the two casts below: TypeScript can't see the
// getters Object.defineProperty adds. schema.test.ts checks every id is present.
export const FirebaseEndpointInputSchemas =
	firebaseInputSchemas as unknown as Readonly<
		Record<keyof FirebaseEndpointInputs, z.ZodType>
	>;

export const FirebaseEndpointOutputSchemas =
	// `unknown` because TypeScript can't see the getters Object.defineProperty adds (see above).
	firebaseOutputSchemas as unknown as Readonly<
		Record<keyof FirebaseEndpointOutputs, z.ZodType>
	>;
