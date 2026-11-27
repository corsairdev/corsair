import type { z } from 'zod';
import { instaboxInputSchemas, instaboxOutputSchemas } from './openapi-schema';
import type {
	InstaboxOperationInputs,
	InstaboxOperationOutputs,
} from './operation-types';

// Inputs and outputs of every operation, keyed by its Corsair name
// (`sandboxes.commands.run`, `agents.list`).

export type InstaboxEndpointInputs = InstaboxOperationInputs;
export type InstaboxEndpointOutputs = InstaboxOperationOutputs;

export type {
	InstaboxJsonValue,
	InstaboxOperationId,
} from './operation-types';

/**
 * Every operation's zod schemas by id. Each key is a getter that builds its
 * schema on first read; see endpoints/openapi-schema.ts.
 */
// `unknown` is necessary in the two casts below: TypeScript can't see the
// getters Object.defineProperty adds. schema.test.ts checks every id is present.
export const InstaboxEndpointInputSchemas =
	instaboxInputSchemas as unknown as Readonly<
		Record<keyof InstaboxEndpointInputs, z.ZodType>
	>;

export const InstaboxEndpointOutputSchemas =
	// `unknown` because TypeScript can't see the getters Object.defineProperty adds (see above).
	instaboxOutputSchemas as unknown as Readonly<
		Record<keyof InstaboxEndpointOutputs, z.ZodType>
	>;
