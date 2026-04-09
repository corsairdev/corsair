import { logEventFromContext } from 'corsair/core';
import type { SharepointEndpoints } from '..';
import { makeGraphRequest } from '../client';
import type { SharepointEndpointOutputs } from './types';

export const follow: SharepointEndpoints['socialFollow'] = async (
	ctx,
	input,
) => {
	// Graph API following is site-level via /me/followedSites
	// For general follow operations, return stub
	await logEventFromContext(
		ctx,
		'sharepoint.social.follow',
		{ ...input },
		'completed',
	);
	return { value: undefined };
};

export const isFollowed: SharepointEndpoints['socialIsFollowed'] = async (
	ctx,
	input,
) => {
	// Graph API does not expose a generic isFollowed check
	await logEventFromContext(
		ctx,
		'sharepoint.social.isFollowed',
		{ ...input },
		'completed',
	);
	return { value: false };
};

export const getFollowed: SharepointEndpoints['socialGetFollowed'] = async (
	ctx,
	input,
) => {
	// Use Graph /me/followedSites for site-type followed entities
	const result = await makeGraphRequest<{
		value?: Array<{ id?: string; displayName?: string; webUrl?: string }>;
	}>('/me/followedSites', ctx.key, { method: 'GET' });

	// Map Graph followed sites to the expected actor format; spread site first so explicit fields take precedence
	const actors = (result.value ?? []).map((site) => ({
		...site,
		Id: site.id,
		Name: site.displayName,
		Uri: site.webUrl,
		ActorType: 2, // 2 = site in SP social actor types
		ContentUri: site.webUrl,
	}));

	await logEventFromContext(
		ctx,
		'sharepoint.social.getFollowed',
		{ ...input },
		'completed',
	);
	// Mapped actor shape differs from Graph site shape; cast to satisfy the expected output type
	return { value: actors } as SharepointEndpointOutputs['socialGetFollowed'];
};

export const getFollowers: SharepointEndpoints['socialGetFollowers'] = async (
	ctx,
	input,
) => {
	// Graph API does not expose a followers concept for SharePoint
	await logEventFromContext(
		ctx,
		'sharepoint.social.getFollowers',
		{ ...input },
		'completed',
	);
	return { value: [] };
};
