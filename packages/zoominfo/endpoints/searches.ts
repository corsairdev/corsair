import type { ZoominfoContext } from '..';
import { callZoominfo } from './shared';
import type { ZoominfoEndpointInputs, ZoominfoEndpointOutputs } from './types';
import {
	SearchCompaniesInputSchema,
	SearchCompaniesResponseSchema,
	SearchContactsInputSchema,
	SearchContactsResponseSchema,
	SearchIntentInputSchema,
	SearchIntentResponseSchema,
	SearchNewsInputSchema,
	SearchNewsResponseSchema,
	SearchScoopsInputSchema,
	SearchScoopsResponseSchema,
} from './types';

/** Paged company results. Use rpp and page to walk beyond the first page. */
export const searchCompanies = (
	ctx: ZoominfoContext,
	input: ZoominfoEndpointInputs['searchCompanies'],
): Promise<ZoominfoEndpointOutputs['searchCompanies']> =>
	callZoominfo(
		ctx,
		{
			event: 'zoominfo.searchCompanies',
			path: 'search/company',
			inputSchema: SearchCompaniesInputSchema,
			outputSchema: SearchCompaniesResponseSchema,
		},
		input,
	);

export const searchContacts = (
	ctx: ZoominfoContext,
	input: ZoominfoEndpointInputs['searchContacts'],
): Promise<ZoominfoEndpointOutputs['searchContacts']> =>
	callZoominfo(
		ctx,
		{
			event: 'zoominfo.searchContacts',
			path: 'search/contact',
			inputSchema: SearchContactsInputSchema,
			outputSchema: SearchContactsResponseSchema,
		},
		input,
	);

export const searchIntent = (
	ctx: ZoominfoContext,
	input: ZoominfoEndpointInputs['searchIntent'],
): Promise<ZoominfoEndpointOutputs['searchIntent']> =>
	callZoominfo(
		ctx,
		{
			event: 'zoominfo.searchIntent',
			path: 'search/intent',
			inputSchema: SearchIntentInputSchema,
			outputSchema: SearchIntentResponseSchema,
		},
		input,
	);

export const searchNews = (
	ctx: ZoominfoContext,
	input: ZoominfoEndpointInputs['searchNews'],
): Promise<ZoominfoEndpointOutputs['searchNews']> =>
	callZoominfo(
		ctx,
		{
			event: 'zoominfo.searchNews',
			path: 'search/news',
			inputSchema: SearchNewsInputSchema,
			outputSchema: SearchNewsResponseSchema,
		},
		input,
	);

export const searchScoops = (
	ctx: ZoominfoContext,
	input: ZoominfoEndpointInputs['searchScoops'],
): Promise<ZoominfoEndpointOutputs['searchScoops']> =>
	callZoominfo(
		ctx,
		{
			event: 'zoominfo.searchScoops',
			path: 'search/scoop',
			inputSchema: SearchScoopsInputSchema,
			outputSchema: SearchScoopsResponseSchema,
		},
		input,
	);
