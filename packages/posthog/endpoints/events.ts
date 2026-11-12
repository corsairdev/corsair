import { logEventFromContext } from 'corsair/core';
import {
	makePostHogRequest,
	resolveCaptureTarget,
	unpackPostHogCredentials,
} from '../client';
import type { PostHogEndpoints } from '../index';
import type { PostHogEndpointOutputs } from './types';

async function captureTarget(ctxKey: string) {
	return resolveCaptureTarget(unpackPostHogCredentials(ctxKey));
}

export const aliasCreate: PostHogEndpoints['aliasCreate'] = async (
	ctx,
	input,
) => {
	const { token, base } = await captureTarget(ctx.key);
	const payload = {
		api_key: token,
		event: '$create_alias',
		properties: {
			distinct_id: input.distinct_id,
			alias: input.alias,
		},
		distinct_id: input.distinct_id,
	};

	const response = await makePostHogRequest<
		PostHogEndpointOutputs['aliasCreate']
	>('/capture/', token, {
		method: 'POST',
		body: payload,
		base,
	});

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
	input,
) => {
	const { token, base } = await captureTarget(ctx.key);
	const payload: Record<string, unknown> = {
		api_key: token,
		event: input.event,
		properties: {
			...input.properties,
			distinct_id: input.distinct_id,
		},
		distinct_id: input.distinct_id,
	};

	if (input.timestamp) {
		payload.timestamp = input.timestamp;
	}

	if (input.uuid) {
		payload.uuid = input.uuid;
	}

	const response = await makePostHogRequest<
		PostHogEndpointOutputs['eventCreate']
	>('/capture/', token, {
		method: 'POST',
		body: payload,
		base,
	});

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
	input,
) => {
	const { token, base } = await captureTarget(ctx.key);
	const payload = {
		api_key: token,
		event: '$identify',
		properties: {
			...input.properties,
			distinct_id: input.distinct_id,
		},
		distinct_id: input.distinct_id,
	};

	const response = await makePostHogRequest<
		PostHogEndpointOutputs['identityCreate']
	>('/capture/', token, {
		method: 'POST',
		body: payload,
		base,
	});

	await logEventFromContext(
		ctx,
		'posthog.identity.create',
		{ ...input },
		'completed',
	);
	return response;
};

export const trackPage: PostHogEndpoints['trackPage'] = async (ctx, input) => {
	const { token, base } = await captureTarget(ctx.key);
	const payload: Record<string, unknown> = {
		api_key: token,
		event: '$pageview',
		properties: {
			...input.properties,
			$current_url: input.url,
			distinct_id: input.distinct_id,
		},
		distinct_id: input.distinct_id,
	};

	if (input.timestamp) {
		payload.timestamp = input.timestamp;
	}

	if (input.uuid) {
		payload.uuid = input.uuid;
	}

	const response = await makePostHogRequest<
		PostHogEndpointOutputs['trackPage']
	>('/capture/', token, {
		method: 'POST',
		body: payload,
		base,
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
	input,
) => {
	const { token, base } = await captureTarget(ctx.key);
	const payload: Record<string, unknown> = {
		api_key: token,
		event: '$screen',
		properties: {
			...input.properties,
			$screen_name: input.screen_name,
			distinct_id: input.distinct_id,
		},
		distinct_id: input.distinct_id,
	};

	if (input.timestamp) {
		payload.timestamp = input.timestamp;
	}

	if (input.uuid) {
		payload.uuid = input.uuid;
	}

	const response = await makePostHogRequest<
		PostHogEndpointOutputs['trackScreen']
	>('/capture/', token, {
		method: 'POST',
		body: payload,
		base,
	});

	await logEventFromContext(
		ctx,
		'posthog.track.screen',
		{ ...input },
		'completed',
	);
	return response;
};
