import { logEventFromContext } from 'corsair/core';
import type { CustomerioEndpoints } from '..';
import type { CustomerioJsonObject } from '../client';
import { makeTrackRequest, resolveTrackCredential } from '../client';
import type { CustomerioEndpointOutputs } from './types';

// PUT /api/v1/customers/{identifier}
// Docs: https://docs.customer.io/integrations/api/track/
// Creates the person profile when it does not exist, otherwise updates it.
export const identifyPerson: CustomerioEndpoints['identifyPerson'] = async (
	ctx,
	input,
) => {
	const body: CustomerioJsonObject = {
		...input.attributes,
	};
	if (input.email !== undefined) {
		body.email = input.email;
	}
	if (input.id !== undefined) {
		body.id = input.id;
	}
	if (input.created_at !== undefined) {
		body.created_at = input.created_at;
	}
	const response = await makeTrackRequest<
		CustomerioEndpointOutputs['identifyPerson']
	>(
		`/api/v1/customers/${encodeURIComponent(input.identifier)}`,
		await resolveTrackCredential(ctx),
		{
			method: 'PUT',
			body,
			region: ctx.options.region,
		},
	);
	// Minimal logging: identifier, email and attributes are PII, so no input
	// payload is persisted.
	await logEventFromContext(
		ctx,
		'customerio.profiles.identifyPerson',
		{},
		'completed',
	);
	return response;
};

// POST /api/v1/merge_customers
// Docs: https://docs.customer.io/integrations/api/track/
// Moves all data from the secondary profile into the primary profile.
export const createAlias: CustomerioEndpoints['createAlias'] = async (
	ctx,
	input,
) => {
	const body: CustomerioJsonObject = {
		primary: input.primary,
		secondary: input.secondary,
	};
	const response = await makeTrackRequest<
		CustomerioEndpointOutputs['createAlias']
	>('/api/v1/merge_customers', await resolveTrackCredential(ctx), {
		method: 'POST',
		body,
		region: ctx.options.region,
	});
	// Minimal logging: primary/secondary are profile identifiers, so no
	// input payload is persisted.
	await logEventFromContext(
		ctx,
		'customerio.profiles.createAlias',
		{},
		'completed',
	);
	return response;
};

// POST /api/v1/customers/{identifier}/suppress
// Docs: https://docs.customer.io/integrations/api/track/
// Permanently deletes the profile and blocks re-adding the same identifier.
export const suppressPerson: CustomerioEndpoints['suppressPerson'] = async (
	ctx,
	input,
) => {
	const response = await makeTrackRequest<
		CustomerioEndpointOutputs['suppressPerson']
	>(
		`/api/v1/customers/${encodeURIComponent(input.identifier)}/suppress`,
		await resolveTrackCredential(ctx),
		{ method: 'POST', body: {}, region: ctx.options.region },
	);
	// Minimal logging: the identifier is PII, so no input payload is persisted.
	await logEventFromContext(
		ctx,
		'customerio.profiles.suppressPerson',
		{},
		'completed',
	);
	return response;
};

// POST /api/v1/customers/{identifier}/events
// Docs: https://docs.customer.io/integrations/api/track/
export const trackEvent: CustomerioEndpoints['trackEvent'] = async (
	ctx,
	input,
) => {
	const body: CustomerioJsonObject = {
		name: input.name,
	};
	if (input.data !== undefined) {
		body.data = input.data;
	}
	if (input.timestamp !== undefined) {
		body.timestamp = input.timestamp;
	}
	if (input.type !== undefined) {
		body.type = input.type;
	}
	if (input.anonymous_id !== undefined) {
		body.anonymous_id = input.anonymous_id;
	}
	const response = await makeTrackRequest<
		CustomerioEndpointOutputs['trackEvent']
	>(
		`/api/v1/customers/${encodeURIComponent(input.identifier)}/events`,
		await resolveTrackCredential(ctx),
		{ method: 'POST', body, region: ctx.options.region },
	);
	// Minimal logging: only the developer-defined event name is persisted;
	// the identifier and event data are excluded.
	await logEventFromContext(
		ctx,
		'customerio.profiles.trackEvent',
		{ name: input.name },
		'completed',
	);
	return response;
};

// POST /unsubscribe/{delivery_id} (host root, no /api/v1 prefix)
// Docs: https://docs.customer.io/integrations/api/track/
export const unsubscribeDelivery: CustomerioEndpoints['unsubscribeDelivery'] =
	async (ctx, input) => {
		const body: CustomerioJsonObject = {};
		if (input.unsubscribe !== undefined) {
			body.unsubscribe = input.unsubscribe;
		}
		const response = await makeTrackRequest<
			CustomerioEndpointOutputs['unsubscribeDelivery']
		>(
			`/unsubscribe/${encodeURIComponent(input.delivery_id)}`,
			await resolveTrackCredential(ctx),
			{
				method: 'POST',
				body,
				region: ctx.options.region,
			},
		);
		// Minimal logging: the delivery id identifies a message recipient,
		// so no input payload is persisted.
		await logEventFromContext(
			ctx,
			'customerio.profiles.unsubscribeDelivery',
			{},
			'completed',
		);
		return response;
	};

// POST /api/v1/metrics (supported replacement for deprecated POST /api/v1/push/events)
// Docs: https://docs.customer.io/integrations/api/track/
export const reportPushEvents: CustomerioEndpoints['reportPushEvents'] = async (
	ctx,
	input,
) => {
	const body: CustomerioJsonObject = {
		delivery_id: input.delivery_id,
		metric: input.metric ?? input.event ?? 'opened',
	};
	if (input.href !== undefined) {
		body.href = input.href;
	}
	if (input.reason !== undefined) {
		body.reason = input.reason;
	}
	if (input.timestamp !== undefined) {
		body.timestamp = input.timestamp;
	}
	if (input.recipient !== undefined) {
		body.recipient = input.recipient;
	}
	const response = await makeTrackRequest<
		CustomerioEndpointOutputs['reportPushEvents']
	>('/api/v1/metrics', await resolveTrackCredential(ctx), {
		method: 'POST',
		body,
		region: ctx.options.region,
	});
	// Minimal logging: only the closed-enum metric name is persisted;
	// delivery id, recipient, URL and reason are excluded.
	await logEventFromContext(
		ctx,
		'customerio.profiles.reportPushEvents',
		{ metric: input.metric ?? input.event },
		'completed',
	);
	return response;
};
