import { logEventFromContext } from 'corsair/core';
import { makeAuthenticatedLinkedInRequest } from '../client';
import type { LinkedInEndpoints } from '../index';
import type { LinkedInEndpointOutputs } from './types';

export const getMyInfo: LinkedInEndpoints['GetMyInfo'] = async (ctx, input) => {
	const result = await makeAuthenticatedLinkedInRequest<
		LinkedInEndpointOutputs['GetMyInfo']
	>('/v2/userinfo', ctx, {
		method: 'GET',
		query: input.projection ? { projection: input.projection } : undefined,
	});

	const entityId = result.sub ?? result.id;
	if (entityId && ctx.db.users) {
		try {
			await ctx.db.users.upsertByEntityId(entityId, {
				id: entityId,
				sub: result.sub,
				name: result.name,
				given_name: result.given_name,
				family_name: result.family_name,
				picture: result.picture,
				email: result.email,
				locale: result.locale,
				vanityName: result.vanityName,
				headline: result.headline,
			});
		} catch {
			// best-effort local cache; ignore persistence failures
		}
	}

	await logEventFromContext(
		ctx,
		'linkedin.profile.getMyInfo',
		{ ...input },
		'completed',
	);
	return result;
};

export const getPerson: LinkedInEndpoints['GetPerson'] = async (ctx, input) => {
	const result = await makeAuthenticatedLinkedInRequest<
		LinkedInEndpointOutputs['GetPerson']
	>(`/v2/people/${encodeURIComponent(input.person_id)}`, ctx, {
		method: 'GET',
		query: input.projection ? { projection: input.projection } : undefined,
	});

	await logEventFromContext(
		ctx,
		'linkedin.profile.getPerson',
		{ ...input },
		'completed',
	);
	return result;
};
