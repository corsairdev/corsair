import type { z } from 'zod';
import { giteaInputSchemas, giteaOutputSchemas } from './openapi-schema';
import type {
	GiteaOperationInputs,
	GiteaOperationOutputs,
} from './operation-types';

// Inputs and outputs of every operation, keyed by its Corsair name
// (`pulls.reviews.create`, `issues.list`).

export type GiteaEndpointInputs = GiteaOperationInputs;
export type GiteaEndpointOutputs = GiteaOperationOutputs;

export type {
	GiteaJsonValue,
	GiteaOperationId,
} from './operation-types';

/**
 * Every operation's zod schemas by id. Each key is a getter that builds its
 * schema on first read; see endpoints/openapi-schema.ts.
 */
// `unknown` is necessary in the two casts below: TypeScript can't see the
// getters Object.defineProperty adds. schema.test.ts checks every id is present.
export const GiteaEndpointInputSchemas =
	giteaInputSchemas as unknown as Readonly<
		Record<keyof GiteaEndpointInputs, z.ZodType>
	>;

export const GiteaEndpointOutputSchemas =
	// `unknown` because TypeScript can't see the getters Object.defineProperty adds (see above).
	giteaOutputSchemas as unknown as Readonly<
		Record<keyof GiteaEndpointOutputs, z.ZodType>
	>;
