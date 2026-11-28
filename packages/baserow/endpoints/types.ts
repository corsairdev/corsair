import type { z } from 'zod';
import { baserowInputSchemas, baserowOutputSchemas } from './openapi-schema';
import type {
	BaserowOperationInputs,
	BaserowOperationOutputs,
} from './operation-types';

// Inputs and outputs of every operation, keyed by its Corsair name
// (`projects.tasks.create`, `invoices.list`).

export type BaserowEndpointInputs = BaserowOperationInputs;
export type BaserowEndpointOutputs = BaserowOperationOutputs;

export type {
	BaserowJsonValue,
	BaserowOperationId,
} from './operation-types';

/**
 * Every operation's zod schemas by id. Each key is a getter that builds its
 * schema on first read; see endpoints/openapi-schema.ts.
 */
// `unknown` is necessary in the two casts below: TypeScript can't see the
// getters Object.defineProperty adds. schema.test.ts checks every id is present.
export const BaserowEndpointInputSchemas =
	baserowInputSchemas as unknown as Readonly<
		Record<keyof BaserowEndpointInputs, z.ZodType>
	>;

export const BaserowEndpointOutputSchemas =
	// `unknown` because TypeScript can't see the getters Object.defineProperty adds (see above).
	baserowOutputSchemas as unknown as Readonly<
		Record<keyof BaserowEndpointOutputs, z.ZodType>
	>;
