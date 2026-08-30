import type { ZoominfoContext } from '..';
import { callZoominfo } from './shared';
import type { ZoominfoEndpointInputs, ZoominfoEndpointOutputs } from './types';
import {
	LookupInputFieldsInputSchema,
	ZoominfoInputFieldsResponseSchema,
} from './types';

/**
 * The five lookups below report which filters the caller's own subscription can
 * use on each search, via `accessGranted`. Entitlements differ per account, so
 * the answer is only meaningful when read at runtime.
 */
function inputFieldsEndpoint(resource: string, event: string) {
	return (
		ctx: ZoominfoContext,
		input: ZoominfoEndpointInputs['getCompanySearchInputFields'],
	): Promise<ZoominfoEndpointOutputs['getCompanySearchInputFields']> =>
		callZoominfo(
			ctx,
			{
				event,
				path: `lookup/inputfields/${resource}/search`,
				method: 'GET',
				inputSchema: LookupInputFieldsInputSchema,
				outputSchema: ZoominfoInputFieldsResponseSchema,
			},
			input,
		);
}

export const getCompanySearchInputFields = inputFieldsEndpoint(
	'company',
	'zoominfo.getCompanySearchInputFields',
);

export const getContactSearchInputFields = inputFieldsEndpoint(
	'contact',
	'zoominfo.getContactSearchInputFields',
);

export const getIntentSearchInputFields = inputFieldsEndpoint(
	'intent',
	'zoominfo.getIntentSearchInputFields',
);

export const getNewsSearchInputFields = inputFieldsEndpoint(
	'news',
	'zoominfo.getNewsSearchInputFields',
);

export const getScoopSearchInputFields = inputFieldsEndpoint(
	'scoop',
	'zoominfo.getScoopSearchInputFields',
);
