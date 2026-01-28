import { logEventFromContext } from '../../utils/events';
import type { PostHogEndpoints } from '..';
import { makePostHogRequest } from '../client';
import type { PostHogEndpointOutputs } from './types';

export const aliasCreate: PostHogEndpoints['aliasCreate'] = async (
	ctx,
	input,
) => {
	const payload = {
		api_key: ctx.key,
		event: '$create_alias',
		properties: {
			distinct_id: input.distinct_id,
			alias: input.alias,
		},
		distinct_id: input.distinct_id,
	};

	const response = await makePostHogRequest<
		PostHogEndpointOutputs['aliasCreate']
	>('/capture/', ctx.key, {
		method: 'POST',
		body: payload,
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
	const payload: any = {
		api_key: ctx.key,
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
	>('/capture/', ctx.key, {
		method: 'POST',
		body: payload,
	});

	if (ctx.db.events && response) {
		try {
			await ctx.db.events.upsert(
				input.uuid || `${Date.now()}-${Math.random()}`,
				{
					id: input.uuid || `${Date.now()}-${Math.random()}`,
					event: input.event,
					distinct_id: input.distinct_id,
					timestamp: input.timestamp,
					uuid: input.uuid,
					properties: input.properties,
					createdAt: new Date(),
				},
			);
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
	const payload = {
		api_key: ctx.key,
		event: '$identify',
		properties: {
			...input.properties,
			distinct_id: input.distinct_id,
		},
		distinct_id: input.distinct_id,
	};

	const response = await makePostHogRequest<
		PostHogEndpointOutputs['identityCreate']
	>('/capture/', ctx.key, {
		method: 'POST',
		body: payload,
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
	const payload: any = {
		api_key: ctx.key,
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
	>('/capture/', ctx.key, {
		method: 'POST',
		body: payload,
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
	const payload: any = {
		api_key: ctx.key,
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
	>('/capture/', ctx.key, {
		method: 'POST',
		body: payload,
	});

	await logEventFromContext(
		ctx,
		'posthog.track.screen',
		{ ...input },
		'completed',
	);
	return response;
};
