import { logEventFromContext } from 'corsair/core';
import { makeAuthenticatedGoogleMeetRequest } from '../client';
import type { GoogleMeetEndpoints } from '..';
import type { GoogleMeetEndpointOutputs } from './types';

export const create: GoogleMeetEndpoints['spacesCreate'] = async (ctx, input) => {
	const result = await makeAuthenticatedGoogleMeetRequest<GoogleMeetEndpointOutputs['spacesCreate']>(
		'/v2/spaces',
		ctx,
		{
			method: 'POST',
			body: input.space,
			query: input.requestId ? { requestId: input.requestId } : undefined,
		},
	);

	if (result.name && ctx.db.spaces) {
		try {
			await ctx.db.spaces.upsertByEntityId(result.name, {
				...result,
				createdAt: new Date(),
			});
		} catch (error) {
			console.warn('Failed to save space to database:', error);
		}
	}

	await logEventFromContext(ctx, 'googlemeet.spaces.create', { ...input }, 'completed');
	return result;
};

export const get: GoogleMeetEndpoints['spacesGet'] = async (ctx, input) => {
	const spaceName = input.name.replace('spaces/', '');
	const result = await makeAuthenticatedGoogleMeetRequest<GoogleMeetEndpointOutputs['spacesGet']>(
		`/v2/spaces/${spaceName}`,
		ctx,
		{ method: 'GET' },
	);

	if (result.name && ctx.db.spaces) {
		try {
			await ctx.db.spaces.upsertByEntityId(result.name, {
				...result,
				createdAt: new Date(),
			});
		} catch (error) {
			console.warn('Failed to save space to database:', error);
		}
	}

	await logEventFromContext(ctx, 'googlemeet.spaces.get', { ...input }, 'completed');
	return result;
};

export const patch: GoogleMeetEndpoints['spacesPatch'] = async (ctx, input) => {
	const spaceName = input.name.replace('spaces/', '');
	const query: Record<string, string> = {};
	if (input.updateMask) {
		query.updateMask = input.updateMask;
	}

	const result = await makeAuthenticatedGoogleMeetRequest<GoogleMeetEndpointOutputs['spacesPatch']>(
		`/v2/spaces/${spaceName}`,
		ctx,
		{
			method: 'PATCH',
			body: input.space,
			query,
		},
	);

	if (result.name && ctx.db.spaces) {
		try {
			await ctx.db.spaces.upsertByEntityId(result.name, {
				...result,
				createdAt: new Date(),
			});
		} catch (error) {
			console.warn('Failed to save space to database:', error);
		}
	}

	await logEventFromContext(ctx, 'googlemeet.spaces.patch', { ...input }, 'completed');
	return result;
};

export const endActiveConference: GoogleMeetEndpoints['spacesEndActiveConference'] = async (ctx, input) => {
	const spaceName = input.name.replace('spaces/', '');
	await makeAuthenticatedGoogleMeetRequest<GoogleMeetEndpointOutputs['spacesEndActiveConference']>(
		`/v2/spaces/${spaceName}:endActiveConference`,
		ctx,
		{ method: 'POST' },
	);

	await logEventFromContext(ctx, 'googlemeet.spaces.endActiveConference', { ...input }, 'completed');
};
