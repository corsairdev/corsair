import { logEventFromContext } from 'corsair/core';
import { LinkedInAPIError, makeAuthenticatedLinkedInRequest } from '../client';
import type { LinkedInEndpoints } from '../index';
import type { LinkedInEndpointOutputs } from './types';

export const getImage: LinkedInEndpoints['GetImage'] = async (ctx, input) => {
	const result = await makeAuthenticatedLinkedInRequest<
		LinkedInEndpointOutputs['GetImage']
	>(`/v2/images/${encodeURIComponent(input.image_urn)}`, ctx, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'linkedin.images.get',
		{ ...input },
		'completed',
	);
	return result;
};

type Query = Record<
	string,
	string | number | boolean | ReadonlyArray<string> | undefined
>;

export const getImages: LinkedInEndpoints['GetImages'] = async (ctx, input) => {
	const query: Query = {};
	if (input.urns && input.urns.length > 0) {
		query.q = 'urns';
		// Pass the array through so the HTTP layer emits repeated urns= keys;
		// a comma-joined value is not a valid Restli multi-value for this finder.
		query.urns = input.urns;
	} else if (input.owner) {
		query.q = 'owner';
		query.owner = input.owner;
	} else {
		// LinkedIn's Images finder requires q=urns|owner; calling without it
		// returns a 400. Schema refine should catch this first.
		throw new LinkedInAPIError(
			'getImages requires owner or a non-empty urns list',
		);
	}
	if (input.start !== undefined) query.start = input.start;
	if (input.count !== undefined) query.count = input.count;

	const result = await makeAuthenticatedLinkedInRequest<
		LinkedInEndpointOutputs['GetImages']
	>('/v2/images', ctx, { method: 'GET', query });

	await logEventFromContext(
		ctx,
		'linkedin.images.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const initializeImageUpload: LinkedInEndpoints['InitializeImageUpload'] =
	async (ctx, input) => {
		// The Images API only exists on the versioned /rest surface, and the
		// owner must be wrapped in an initializeUploadRequest envelope.
		const result = await makeAuthenticatedLinkedInRequest<
			LinkedInEndpointOutputs['InitializeImageUpload']
		>('/rest/images?action=initializeUpload', ctx, {
			method: 'POST',
			body: { initializeUploadRequest: { owner: input.owner } },
		});

		await logEventFromContext(
			ctx,
			'linkedin.images.initializeUpload',
			{ ...input },
			'completed',
		);
		return result;
	};

export const registerImageUpload: LinkedInEndpoints['RegisterImageUpload'] =
	async (ctx, input) => {
		const body = {
			registerUploadRequest: {
				recipes: ['urn:li:digitalmediaRecipe:feedshare-image'],
				owner: input.owner,
				serviceRelationships: [
					{
						relationshipType: 'OWNER',
						identifier: 'urn:li:userGeneratedContent',
					},
				],
			},
		};

		// registerUpload lives on the legacy Assets API, which is only served
		// from the /v2 surface — only Images/Videos moved to versioned /rest.
		const result = await makeAuthenticatedLinkedInRequest<
			LinkedInEndpointOutputs['RegisterImageUpload']
		>('/v2/assets?action=registerUpload', ctx, { method: 'POST', body });

		await logEventFromContext(
			ctx,
			'linkedin.images.registerUpload',
			{ ...input },
			'completed',
		);
		return result;
	};
