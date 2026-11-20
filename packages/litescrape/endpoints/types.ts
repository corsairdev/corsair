import type { z } from 'zod';
import type {
	KeysStatusInput,
	KeysStatusResponse,
	KeysUsageInput,
	KeysUsageResponse,
} from './keys';
import {
	KeysStatusInputSchema,
	KeysStatusResponseSchema,
	KeysUsageInputSchema,
	KeysUsageResponseSchema,
} from './keys';
import {
	litescrapeInputSchemas,
	litescrapeOutputSchemas,
} from './openapi-schema';
import type {
	LitescrapeOperationInputs,
	LitescrapeOperationOutputs,
} from './operation-types';

// Inputs and outputs of every operation, keyed by its Corsair name
// (`google.search`, `amazon.product`, `keys.status`).

export type LitescrapeEndpointInputs = LitescrapeOperationInputs & {
	'keys.status': KeysStatusInput;
	'keys.usage': KeysUsageInput;
};

export type LitescrapeEndpointOutputs = LitescrapeOperationOutputs & {
	'keys.status': KeysStatusResponse;
	'keys.usage': KeysUsageResponse;
};

export type {
	KeysStatusInput,
	KeysStatusResponse,
	KeysUsageInput,
	KeysUsageResponse,
};
export type {
	LitescrapeJsonValue,
	LitescrapeOperationId,
} from './operation-types';

// `unknown` is necessary in the two casts below: TypeScript can't see the 200
// getters Object.defineProperties adds, so the literal looks like it has only
// the two keys entries. schema.test.ts checks every id is present.
/**
 * Every operation's zod schemas by id, keyed by the known operation names (an
 * arbitrary string needs an `in` check first). The 200 manifest operations are getters
 * that build their schema on first read; see endpoints/openapi-schema.ts.
 */
export const LitescrapeEndpointInputSchemas = Object.defineProperties(
	{
		'keys.status': KeysStatusInputSchema,
		'keys.usage': KeysUsageInputSchema,
	},
	Object.getOwnPropertyDescriptors(litescrapeInputSchemas),
) as unknown as Readonly<Record<keyof LitescrapeEndpointInputs, z.ZodType>>;

export const LitescrapeEndpointOutputSchemas = Object.defineProperties(
	{
		'keys.status': KeysStatusResponseSchema,
		'keys.usage': KeysUsageResponseSchema,
	},
	Object.getOwnPropertyDescriptors(litescrapeOutputSchemas),
) as unknown as Readonly<Record<keyof LitescrapeEndpointOutputs, z.ZodType>>;
