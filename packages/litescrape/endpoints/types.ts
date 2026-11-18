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

/**
 * Every operation's zod schemas by id. The 200 manifest operations are getters
 * that build their schema on first read; see endpoints/openapi-schema.ts.
 */
export const LitescrapeEndpointInputSchemas: Readonly<
	Record<string, z.ZodType>
> = Object.defineProperties(
	{
		'keys.status': KeysStatusInputSchema,
		'keys.usage': KeysUsageInputSchema,
	},
	Object.getOwnPropertyDescriptors(litescrapeInputSchemas),
);

export const LitescrapeEndpointOutputSchemas: Readonly<
	Record<string, z.ZodType>
> = Object.defineProperties(
	{
		'keys.status': KeysStatusResponseSchema,
		'keys.usage': KeysUsageResponseSchema,
	},
	Object.getOwnPropertyDescriptors(litescrapeOutputSchemas),
);
