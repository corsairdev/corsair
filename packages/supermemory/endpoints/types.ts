import type { z } from 'zod';
import {
	supermemoryInputSchemas,
	supermemoryOutputSchemas,
} from './openapi-schema';
import type {
	SupermemoryOperationInputs,
	SupermemoryOperationOutputs,
} from './operation-types';

// Inputs and outputs of every operation, keyed by its Corsair name
// (`projects.tasks.create`, `invoices.list`).

export type SupermemoryEndpointInputs = SupermemoryOperationInputs;
export type SupermemoryEndpointOutputs = SupermemoryOperationOutputs;

export type {
	SupermemoryJsonValue,
	SupermemoryOperationId,
} from './operation-types';

/**
 * Every operation's zod schemas by id. Each key is a getter that builds its
 * schema on first read; see endpoints/openapi-schema.ts.
 */
// `unknown` is necessary in the two casts below: TypeScript can't see the
// getters Object.defineProperty adds. schema.test.ts checks every id is present.
export const SupermemoryEndpointInputSchemas =
	supermemoryInputSchemas as unknown as Readonly<
		Record<keyof SupermemoryEndpointInputs, z.ZodType>
	>;

export const SupermemoryEndpointOutputSchemas =
	// `unknown` because TypeScript can't see the getters Object.defineProperty adds (see above).
	supermemoryOutputSchemas as unknown as Readonly<
		Record<keyof SupermemoryEndpointOutputs, z.ZodType>
	>;
