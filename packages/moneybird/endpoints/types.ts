import type { z } from 'zod';
import {
	moneybirdInputSchemas,
	moneybirdOutputSchemas,
} from './openapi-schema';
import type {
	MoneybirdOperationInputs,
	MoneybirdOperationOutputs,
} from './operation-types';

// Inputs and outputs of every operation, keyed by its Corsair name
// (`projects.tasks.create`, `invoices.list`).

export type MoneybirdEndpointInputs = MoneybirdOperationInputs;
export type MoneybirdEndpointOutputs = MoneybirdOperationOutputs;

export type {
	MoneybirdJsonValue,
	MoneybirdOperationId,
} from './operation-types';

/**
 * Every operation's zod schemas by id. Each key is a getter that builds its
 * schema on first read; see endpoints/openapi-schema.ts.
 */
// `unknown` is necessary in the two casts below: TypeScript can't see the
// getters Object.defineProperty adds. schema.test.ts checks every id is present.
export const MoneybirdEndpointInputSchemas =
	moneybirdInputSchemas as unknown as Readonly<
		Record<keyof MoneybirdEndpointInputs, z.ZodType>
	>;

export const MoneybirdEndpointOutputSchemas =
	// `unknown` because TypeScript can't see the getters Object.defineProperty adds (see above).
	moneybirdOutputSchemas as unknown as Readonly<
		Record<keyof MoneybirdEndpointOutputs, z.ZodType>
	>;
