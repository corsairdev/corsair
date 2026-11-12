import { logEventFromContext } from 'corsair/core';
import {
	invalidateCaptureToken,
	isPersonalApiKey,
	makePostHogRequest,
	PostHogAPIError,
	resolveCaptureTarget,
	unpackPostHogCredentials,
} from '../client';
import type { PostHogEndpoints } from '../index';
import type { PostHogEndpointOutputs } from './types';
import { PostHogEndpointInputSchemas } from './types';

/**
 * Sends one event to `/capture/`. With a personal key the project token is
 * looked up and cached; if PostHog rejects it (rotated token), the cache entry
 * is dropped and the event is sent once more with a fresh token.
 */
async function capture<T>(
	ctxKey: string,
	payload: Record<string, unknown>,
): Promise<T> {
	const credentials = unpackPostHogCredentials(ctxKey);
	const send = async () => {
		const { token, base } = await resolveCaptureTarget(credentials);
		return makePostHogRequest<T>('/capture/', token, {
			method: 'POST',
			body: { ...payload, api_key: token },
			base,
		});
	};
	try {
		return await send();
	} catch (error) {
		if (
			error instanceof PostHogAPIError &&
			error.status === 401 &&
			isPersonalApiKey(credentials.key)
		) {
			invalidateCaptureToken(credentials);
			return send();
		}
		throw error;
	}
}

/** Optional timestamp and uuid, only when given. */
function eventMeta(input: { timestamp?: string; uuid?: string }) {
	return {
		...(input.timestamp ? { timestamp: input.timestamp } : {}),
		...(input.uuid ? { uuid: input.uuid } : {}),
	};
}

export const aliasCreate: PostHogEndpoints['aliasCreate'] = async (
	ctx,
	rawInput,
) => {
	const input = PostHogEndpointInputSchemas.aliasCreate.parse(rawInput);
	const response = await capture<PostHogEndpointOutputs['aliasCreate']>(
		ctx.key,
		{
			event: '$create_alias',
			properties: { distinct_id: input.distinct_id, alias: input.alias },
			distinct_id: input.distinct_id,
		},
	);
	await logEventFromContext(
		ctx,
		'posthog.alias.create',
		{ ...input },
		'completed',
	);
	return response;
};

export const eventCreate: PostHogEndpoints['eventCreate'] = async (
	ctx,
	rawInput,
) => {
	const input = PostHogEndpointInputSchemas.eventCreate.parse(rawInput);
	const response = await capture<PostHogEndpointOutputs['eventCreate']>(
		ctx.key,
		{
			event: input.event,
			properties: { ...input.properties, distinct_id: input.distinct_id },
			distinct_id: input.distinct_id,
			...eventMeta(input),
		},
	);

	if (response && ctx.db.events) {
		try {
			const id = input.uuid || `${Date.now()}-${Math.random()}`;
			await ctx.db.events.upsertByEntityId(id, {
				...input,
				id,
				createdAt: new Date(),
			});
		} catch (error) {
			console.warn('Failed to save event to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'posthog.event.create',
		{ ...input },
		'completed',
	);
	return response;
};

export const identityCreate: PostHogEndpoints['identityCreate'] = async (
	ctx,
	rawInput,
) => {
	const input = PostHogEndpointInputSchemas.identityCreate.parse(rawInput);
	const response = await capture<PostHogEndpointOutputs['identityCreate']>(
		ctx.key,
		{
			event: '$identify',
			properties: { ...input.properties, distinct_id: input.distinct_id },
			distinct_id: input.distinct_id,
		},
	);
	await logEventFromContext(
		ctx,
		'posthog.identity.create',
		{ ...input },
		'completed',
	);
	return response;
};

export const trackPage: PostHogEndpoints['trackPage'] = async (
	ctx,
	rawInput,
) => {
	const input = PostHogEndpointInputSchemas.trackPage.parse(rawInput);
	const response = await capture<PostHogEndpointOutputs['trackPage']>(ctx.key, {
		event: '$pageview',
		properties: {
			...input.properties,
			$current_url: input.url,
			distinct_id: input.distinct_id,
		},
		distinct_id: input.distinct_id,
		...eventMeta(input),
	});
	await logEventFromContext(
		ctx,
		'posthog.track.page',
		{ ...input },
		'completed',
	);
	return response;
};

export const trackScreen: PostHogEndpoints['trackScreen'] = async (
	ctx,
	rawInput,
) => {
	const input = PostHogEndpointInputSchemas.trackScreen.parse(rawInput);
	const response = await capture<PostHogEndpointOutputs['trackScreen']>(
		ctx.key,
		{
			event: '$screen',
			properties: {
				...input.properties,
				$screen_name: input.screen_name,
				distinct_id: input.distinct_id,
			},
			distinct_id: input.distinct_id,
			...eventMeta(input),
		},
	);
	await logEventFromContext(
		ctx,
		'posthog.track.screen',
		{ ...input },
		'completed',
	);
	return response;
};
