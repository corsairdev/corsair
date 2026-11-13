import { logEventFromContext } from 'corsair/core';
import type { GigasheetEndpoints } from '..';
import { makeGigasheetRequest } from '../client';
import {
	GigasheetEndpointInputSchemas,
	GigasheetEndpointOutputSchemas,
	type UserGetDetailsResponse,
	type UserGetEnrichmentCreditsResponse,
	type UserWhoamiResponse,
} from './types';

export const whoami: GigasheetEndpoints['user.whoami'] = async (ctx, input) => {
	const parsedInput = GigasheetEndpointInputSchemas['user.whoami'].parse(input);
	// /user/whoami is public: if no key is bound, it returns anonymous status.
	const response = await makeGigasheetRequest<UserWhoamiResponse>(
		'/user/whoami',
		ctx.key || undefined,
		{
			method: 'GET',
		},
	);

	const parsed =
		GigasheetEndpointOutputSchemas['user.whoami'].parse(response);

	await logEventFromContext(
		ctx,
		'gigasheet.user.whoami',
		{ authenticated: parsed.authenticated },
		'completed',
	);

	return parsed;
};

export const getDetails: GigasheetEndpoints['user.getDetails'] = async (
	ctx,
	input,
) => {
	GigasheetEndpointInputSchemas['user.getDetails'].parse(input);
	const response = await makeGigasheetRequest<UserGetDetailsResponse>(
		'/user/details',
		ctx.key,
		{
			method: 'GET',
		},
	);

	const parsed =
		GigasheetEndpointOutputSchemas['user.getDetails'].parse(response);

	await logEventFromContext(
		ctx,
		'gigasheet.user.getDetails',
		{ hasUser: Boolean(parsed.id || parsed.username) },
		'completed',
	);

	return parsed;
};

export const getSpaceUsed: GigasheetEndpoints['user.getSpaceUsed'] = async (
	ctx,
	input,
) => {
	GigasheetEndpointInputSchemas['user.getSpaceUsed'].parse(input);
	// `unknown` because /user/space-used returns either a raw integer byte count or a wrapped object.
	const raw = await makeGigasheetRequest<unknown>(
		'/user/space-used',
		ctx.key,
		{
			method: 'GET',
		},
	);

	const normalized =
		typeof raw === 'number'
			? { bytesUsed: raw }
			: typeof raw === 'object' && raw !== null && 'bytesUsed' in raw
				? (raw as { bytesUsed: number })
				: { bytesUsed: 0 };

	const parsed =
		GigasheetEndpointOutputSchemas['user.getSpaceUsed'].parse(normalized);

	await logEventFromContext(
		ctx,
		'gigasheet.user.getSpaceUsed',
		{ bytesUsed: parsed.bytesUsed },
		'completed',
	);

	return parsed;
};

export const getEnrichmentCredits: GigasheetEndpoints['user.getEnrichmentCredits'] =
	async (ctx, input) => {
		GigasheetEndpointInputSchemas['user.getEnrichmentCredits'].parse(input);
		const response =
			await makeGigasheetRequest<UserGetEnrichmentCreditsResponse>(
				'/user/enrichment-credits',
				ctx.key,
				{
					method: 'GET',
				},
			);

		const parsed =
			GigasheetEndpointOutputSchemas['user.getEnrichmentCredits'].parse(
				response,
			);

		await logEventFromContext(
			ctx,
			'gigasheet.user.getEnrichmentCredits',
			{ used: parsed.Used, limit: parsed.Limit },
			'completed',
		);

		return parsed;
	};

export const User = {
	whoami,
	getDetails,
	getSpaceUsed,
	getEnrichmentCredits,
};
