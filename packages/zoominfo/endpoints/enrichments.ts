import type { ZoominfoContext } from '..';
import { callZoominfo } from './shared';
import type { ZoominfoEndpointInputs, ZoominfoEndpointOutputs } from './types';
import {
	EnrichCompanyInputSchema,
	EnrichCompanyResponseSchema,
	EnrichContactInputSchema,
	EnrichContactResponseSchema,
	EnrichIntentInputSchema,
	EnrichIntentResponseSchema,
	EnrichLocationInputSchema,
	EnrichLocationResponseSchema,
	EnrichNewsInputSchema,
	EnrichNewsResponseSchema,
	EnrichScoopInputSchema,
	EnrichScoopResponseSchema,
	EnrichTechnologyInputSchema,
	EnrichTechnologyResponseSchema,
} from './types';

/**
 * Enriches up to 25 companies in one call. Each result carries its own match
 * status, so a partial match set comes back as a 200 rather than an error.
 */
export const enrichCompany = (
	ctx: ZoominfoContext,
	input: ZoominfoEndpointInputs['enrichCompany'],
): Promise<ZoominfoEndpointOutputs['enrichCompany']> =>
	callZoominfo(
		ctx,
		{
			event: 'zoominfo.enrichCompany',
			path: 'enrich/company',
			inputSchema: EnrichCompanyInputSchema,
			outputSchema: EnrichCompanyResponseSchema,
		},
		input,
	);

export const enrichContact = (
	ctx: ZoominfoContext,
	input: ZoominfoEndpointInputs['enrichContact'],
): Promise<ZoominfoEndpointOutputs['enrichContact']> =>
	callZoominfo(
		ctx,
		{
			event: 'zoominfo.enrichContact',
			path: 'enrich/contact',
			inputSchema: EnrichContactInputSchema,
			outputSchema: EnrichContactResponseSchema,
		},
		input,
	);

export const enrichIntent = (
	ctx: ZoominfoContext,
	input: ZoominfoEndpointInputs['enrichIntent'],
): Promise<ZoominfoEndpointOutputs['enrichIntent']> =>
	callZoominfo(
		ctx,
		{
			event: 'zoominfo.enrichIntent',
			path: 'enrich/intent',
			inputSchema: EnrichIntentInputSchema,
			outputSchema: EnrichIntentResponseSchema,
		},
		input,
	);

/** Returns every known office for a company, not just the headquarters. */
export const enrichLocation = (
	ctx: ZoominfoContext,
	input: ZoominfoEndpointInputs['enrichLocation'],
): Promise<ZoominfoEndpointOutputs['enrichLocation']> =>
	callZoominfo(
		ctx,
		{
			event: 'zoominfo.enrichLocation',
			path: 'enrich/location',
			inputSchema: EnrichLocationInputSchema,
			outputSchema: EnrichLocationResponseSchema,
		},
		input,
	);

export const enrichNews = (
	ctx: ZoominfoContext,
	input: ZoominfoEndpointInputs['enrichNews'],
): Promise<ZoominfoEndpointOutputs['enrichNews']> =>
	callZoominfo(
		ctx,
		{
			event: 'zoominfo.enrichNews',
			path: 'enrich/news',
			inputSchema: EnrichNewsInputSchema,
			outputSchema: EnrichNewsResponseSchema,
		},
		input,
	);

export const enrichScoop = (
	ctx: ZoominfoContext,
	input: ZoominfoEndpointInputs['enrichScoop'],
): Promise<ZoominfoEndpointOutputs['enrichScoop']> =>
	callZoominfo(
		ctx,
		{
			event: 'zoominfo.enrichScoop',
			path: 'enrich/scoop',
			inputSchema: EnrichScoopInputSchema,
			outputSchema: EnrichScoopResponseSchema,
		},
		input,
	);

/** Technologies ZoomInfo has detected in a company's stack. */
export const enrichTechnology = (
	ctx: ZoominfoContext,
	input: ZoominfoEndpointInputs['enrichTechnology'],
): Promise<ZoominfoEndpointOutputs['enrichTechnology']> =>
	callZoominfo(
		ctx,
		{
			event: 'zoominfo.enrichTechnology',
			path: 'enrich/tech',
			inputSchema: EnrichTechnologyInputSchema,
			outputSchema: EnrichTechnologyResponseSchema,
		},
		input,
	);
