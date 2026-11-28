import type { z } from 'zod';
import { segmentInputSchemas, segmentOutputSchemas } from './openapi-schema';
import type {
	SegmentOperationInputs,
	SegmentOperationOutputs,
} from './operation-types';

// Inputs and outputs of every operation, keyed by its Corsair name
// (`projects.tasks.create`, `invoices.list`).

export type SegmentEndpointInputs = SegmentOperationInputs;
export type SegmentEndpointOutputs = SegmentOperationOutputs;

export type {
	SegmentJsonValue,
	SegmentOperationId,
} from './operation-types';

/**
 * Every operation's zod schemas by id. Each key is a getter that builds its
 * schema on first read; see endpoints/openapi-schema.ts.
 */
// `unknown` is necessary in the two casts below: TypeScript can't see the
// getters Object.defineProperty adds. schema.test.ts checks every id is present.
export const SegmentEndpointInputSchemas =
	segmentInputSchemas as unknown as Readonly<
		Record<keyof SegmentEndpointInputs, z.ZodType>
	>;

export const SegmentEndpointOutputSchemas =
	// `unknown` because TypeScript can't see the getters Object.defineProperty adds (see above).
	segmentOutputSchemas as unknown as Readonly<
		Record<keyof SegmentEndpointOutputs, z.ZodType>
	>;
