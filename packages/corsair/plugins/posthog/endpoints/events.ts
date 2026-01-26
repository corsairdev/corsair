import { logEvent } from '../../utils/events';
import type { PostHogEndpoints } from '..';
import { makePostHogRequest } from '../client';
import type { PostHogEndpointOutputs } from './types';

export const aliasCreate: PostHogEndpoints['aliasCreate'] = async (
	ctx,
	input,
) => {
	const payload = {
		api_key: ctx.options.credentials.apiKey,
		event: '$create_alias',
		properties: {
			distinct_id: input.distinct_id,
			alias: input.alias,
		},
		distinct_id: input.distinct_id,
	};

	const response = await makePostHogRequest<PostHogEndpointOutputs['aliasCreate']>(
		'/capture/',
		ctx.options.credentials.apiKey,
		{
			method: 'POST',
			body: payload,
		},
	);

	await logEvent(
		ctx.database,
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
		api_key: ctx.options.credentials.apiKey,
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

	const response = await makePostHogRequest<PostHogEndpointOutputs['eventCreate']>(
		'/capture/',
		ctx.options.credentials.apiKey,
		{
			method: 'POST',
			body: payload,
		},
	);

	if (ctx.db.events && response) {
		try {
			await ctx.db.events.upsert(input.uuid || `${Date.now()}-${Math.random()}`, {
				id: input.uuid || `${Date.now()}-${Math.random()}`,
				event: input.event,
				distinct_id: input.distinct_id,
				timestamp: input.timestamp,
				uuid: input.uuid,
				properties: input.properties,
				createdAt: new Date(),
			});
		} catch (error) {
			console.warn('Failed to save event to database:', error);
		}
	}

	await logEvent(
		ctx.database,
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
		api_key: ctx.options.credentials.apiKey,
		event: '$identify',
		properties: {
			...input.properties,
			distinct_id: input.distinct_id,
		},
		distinct_id: input.distinct_id,
	};

	const response = await makePostHogRequest<PostHogEndpointOutputs['identityCreate']>(
		'/capture/',
		ctx.options.credentials.apiKey,
		{
			method: 'POST',
			body: payload,
		},
	);

	await logEvent(
		ctx.database,
		'posthog.identity.create',
		{ ...input },
		'completed',
	);
	return response;
};

export const trackPage: PostHogEndpoints['trackPage'] = async (
	ctx,
	input,
) => {
	const payload: any = {
		api_key: ctx.options.credentials.apiKey,
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

	const response = await makePostHogRequest<PostHogEndpointOutputs['trackPage']>(
		'/capture/',
		ctx.options.credentials.apiKey,
		{
			method: 'POST',
			body: payload,
		},
	);

	await logEvent(
		ctx.database,
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
		api_key: ctx.options.credentials.apiKey,
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

	const response = await makePostHogRequest<PostHogEndpointOutputs['trackScreen']>(
		'/capture/',
		ctx.options.credentials.apiKey,
		{
			method: 'POST',
			body: payload,
		},
	);

	await logEvent(
		ctx.database,
		'posthog.track.screen',
		{ ...input },
		'completed',
	);
	return response;
};
