import type { z } from 'zod';
import type { ThinkificResponse } from './responses';
import type {
	ThinkificOperationInputSchemas,
	ThinkificOperationOutputSchemas,
} from './schemas';

export {
	ThinkificOperationInputSchemas as ThinkificEndpointInputSchemas,
	ThinkificOperationOutputSchemas as ThinkificEndpointOutputSchemas,
} from './schemas';

export type ThinkificOperationInputs = {
	[K in keyof typeof ThinkificOperationInputSchemas]: z.input<
		(typeof ThinkificOperationInputSchemas)[K]
	>;
};

/** What each operation returns: the documented shape, parsed leniently (see responses.ts). */
export type ThinkificOperationOutputs = {
	[K in keyof typeof ThinkificOperationOutputSchemas]: ThinkificResponse<
		z.output<(typeof ThinkificOperationOutputSchemas)[K]>
	>;
};

export type ThinkificEndpointInputs = ThinkificOperationInputs;
export type ThinkificEndpointOutputs = ThinkificOperationOutputs;
