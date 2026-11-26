import type { z } from 'zod';
import { inkboxInputSchemas, inkboxOutputSchemas } from './openapi-schema';
import type {
	InkboxOperationInputs,
	InkboxOperationOutputs,
} from './operation-types';

// Inputs and outputs of every operation, keyed by its Corsair name
// (`mail.messages.send`, `phone.texts.list`).

export type InkboxEndpointInputs = InkboxOperationInputs;
export type InkboxEndpointOutputs = InkboxOperationOutputs;

export type {
	InkboxJsonValue,
	InkboxOperationId,
} from './operation-types';

/**
 * Every operation's zod schemas by id. Each key is a getter that builds its
 * schema on first read; see endpoints/openapi-schema.ts.
 */
// `unknown` is necessary in the two casts below: TypeScript can't see the
// getters Object.defineProperty adds. schema.test.ts checks every id is present.
export const InkboxEndpointInputSchemas =
	inkboxInputSchemas as unknown as Readonly<
		Record<keyof InkboxEndpointInputs, z.ZodType>
	>;

export const InkboxEndpointOutputSchemas =
	// `unknown` because TypeScript can't see the getters Object.defineProperty adds (see above).
	inkboxOutputSchemas as unknown as Readonly<
		Record<keyof InkboxEndpointOutputs, z.ZodType>
	>;
