import type { z } from 'zod';
import { boatInputSchemas, boatOutputSchemas } from './openapi-schema';
import type {
	BoatOperationInputs,
	BoatOperationOutputs,
} from './operation-types';

// Inputs and outputs of every operation, keyed by its Corsair name
// (`projects.tasks.create`, `invoices.list`).

export type BoatEndpointInputs = BoatOperationInputs;
export type BoatEndpointOutputs = BoatOperationOutputs;

export type {
	BoatJsonValue,
	BoatOperationId,
} from './operation-types';

/**
 * Every operation's zod schemas by id. Each key is a getter that builds its
 * schema on first read; see endpoints/openapi-schema.ts.
 */
// `unknown` is necessary in the two casts below: TypeScript can't see the
// getters Object.defineProperty adds. schema.test.ts checks every id is present.
export const BoatEndpointInputSchemas = boatInputSchemas as unknown as Readonly<
	Record<keyof BoatEndpointInputs, z.ZodType>
>;

export const BoatEndpointOutputSchemas =
	// `unknown` because TypeScript can't see the getters Object.defineProperty adds (see above).
	boatOutputSchemas as unknown as Readonly<
		Record<keyof BoatEndpointOutputs, z.ZodType>
	>;
