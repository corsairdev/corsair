import { SNAPCHAT_CONVERSION_API_BASE } from '../client';
import { createEndpoint } from './factory';

// ─── Authenticated User ───────────────────────────────────────────────────────
export const getAuthenticatedUserEndpoint = createEndpoint(
	'getAuthenticatedUser',
	{
		path: () => '/me',
	},
);

// ─── Sponsored Content / Ads Library ─────────────────────────────────────────
export const listSponsoredContentEndpoint = createEndpoint(
	'listSponsoredContent',
	{
		path: () => '/ads_library/sponsored_content',
		query: (input) => ({
			limit: input.limit as number | undefined,
			cursor: input.cursor as string | undefined,
		}),
	},
);

export const searchAdsLibrarySponsoredContentEndpoint = createEndpoint(
	'searchAdsLibrarySponsoredContent',
	{
		path: () => '/ads_library/sponsored_content/search',
		query: (input) => ({
			creator_name: input.creator_name as string,
			limit: input.limit as number | undefined,
		}),
	},
);

// ─── Conversion Event Validation ──────────────────────────────────────────────
export const validateConversionEventEndpoint = createEndpoint(
	'validateConversionEvent',
	{
		method: 'POST',
		base: SNAPCHAT_CONVERSION_API_BASE,
		path: (input) => `/pixels/${String(input.pixel_id)}/events/validate`,
		body: (input) => ({ events: input.events }),
	},
);

// ─── Event Details (single) ────────────────────────────────────────────────────
export const getEventDetailsEndpoint = createEndpoint('getEventDetails', {
	path: (input) => `/event_details/${String(input.event_details_id)}`,
});

export const deleteEventDetailsEndpoint = createEndpoint('deleteEventDetails', {
	method: 'DELETE',
	path: (input) => `/event_details/${String(input.event_details_id)}`,
	body: () => undefined,
});
