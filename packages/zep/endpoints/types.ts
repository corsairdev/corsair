import type { z } from 'zod';
import { zepInputSchemas, zepOutputSchemas } from './openapi-schema';
import type {
	ZepOperationInputs,
	ZepOperationOutputs,
} from './operation-types';

// Inputs and outputs of every operation, keyed by its Corsair name
// (`projects.tasks.create`, `invoices.list`).

export type ZepEndpointInputs = ZepOperationInputs;
export type ZepEndpointOutputs = ZepOperationOutputs;

export type {
	ZepJsonValue,
	ZepOperationId,
} from './operation-types';

/**
 * Every operation's zod schemas by id. Each key is a getter that builds its
 * schema on first read; see endpoints/openapi-schema.ts.
 */
// `unknown` is necessary in the two casts below: TypeScript can't see the
// getters Object.defineProperty adds. schema.test.ts checks every id is present.
export const ZepEndpointInputSchemas = zepInputSchemas as unknown as Readonly<
	Record<keyof ZepEndpointInputs, z.ZodType>
>;

export const ZepEndpointOutputSchemas =
	// `unknown` because TypeScript can't see the getters Object.defineProperty adds (see above).
	zepOutputSchemas as unknown as Readonly<
		Record<keyof ZepEndpointOutputs, z.ZodType>
	>;
