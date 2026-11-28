import type { z } from 'zod';
import {
	discourseInputSchemas,
	discourseOutputSchemas,
} from './openapi-schema';
import type {
	DiscourseOperationInputs,
	DiscourseOperationOutputs,
} from './operation-types';

// Inputs and outputs of every operation, keyed by its Corsair name
// (`projects.tasks.create`, `invoices.list`).

export type DiscourseEndpointInputs = DiscourseOperationInputs;
export type DiscourseEndpointOutputs = DiscourseOperationOutputs;

export type {
	DiscourseJsonValue,
	DiscourseOperationId,
} from './operation-types';

/**
 * Every operation's zod schemas by id. Each key is a getter that builds its
 * schema on first read; see endpoints/openapi-schema.ts.
 */
// `unknown` is necessary in the two casts below: TypeScript can't see the
// getters Object.defineProperty adds. schema.test.ts checks every id is present.
export const DiscourseEndpointInputSchemas =
	discourseInputSchemas as unknown as Readonly<
		Record<keyof DiscourseEndpointInputs, z.ZodType>
	>;

export const DiscourseEndpointOutputSchemas =
	// `unknown` because TypeScript can't see the getters Object.defineProperty adds (see above).
	discourseOutputSchemas as unknown as Readonly<
		Record<keyof DiscourseEndpointOutputs, z.ZodType>
	>;
