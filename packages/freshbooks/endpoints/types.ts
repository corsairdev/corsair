import type { z } from 'zod';
import {
	freshbooksInputSchemas,
	freshbooksOutputSchemas,
} from './openapi-schema';
import type {
	FreshBooksOperationInputs,
	FreshBooksOperationOutputs,
} from './operation-types';

// Inputs and outputs of every operation, keyed by its Corsair name
// (`projects.tasks.create`, `invoices.list`).

export type FreshBooksEndpointInputs = FreshBooksOperationInputs;
export type FreshBooksEndpointOutputs = FreshBooksOperationOutputs;

export type {
	FreshBooksJsonValue,
	FreshBooksOperationId,
} from './operation-types';

/**
 * Every operation's zod schemas by id. Each key is a getter that builds its
 * schema on first read; see endpoints/openapi-schema.ts.
 */
// `unknown` is necessary in the two casts below: TypeScript can't see the
// getters Object.defineProperty adds. schema.test.ts checks every id is present.
export const FreshBooksEndpointInputSchemas =
	freshbooksInputSchemas as unknown as Readonly<
		Record<keyof FreshBooksEndpointInputs, z.ZodType>
	>;

export const FreshBooksEndpointOutputSchemas =
	// `unknown` because TypeScript can't see the getters Object.defineProperty adds (see above).
	freshbooksOutputSchemas as unknown as Readonly<
		Record<keyof FreshBooksEndpointOutputs, z.ZodType>
	>;
