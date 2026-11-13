import { logEventFromContext } from 'corsair/core';
import type { GosquaredEndpoints } from '..';
import { makeGosquaredRequest } from '../client';
import type { GosquaredEndpointOutputs } from './types';
import {
	GosquaredEndpointInputSchemas,
	GosquaredEndpointOutputSchemas,
} from './types';

export const trackEvent: GosquaredEndpoints['tracking.trackEvent'] = async (
	ctx,
	input,
) => {
	const parsed =
		GosquaredEndpointInputSchemas['tracking.trackEvent'].parse(input);
	const siteToken = parsed.site_token ?? ctx.options?.siteToken;

	const { site_token: _, ...body } = parsed;

	const response = await makeGosquaredRequest<
		GosquaredEndpointOutputs['tracking.trackEvent']
	>('/tracking/v1/event', ctx.key, {
		method: 'POST',
		body,
		siteToken,
	});

	const parsedResponse =
		GosquaredEndpointOutputSchemas['tracking.trackEvent'].parse(response);

	await logEventFromContext(
		ctx,
		'gosquared.tracking.trackEvent',
		{ eventName: parsed.event.name },
		'completed',
	);

	return parsedResponse;
};

export const identify: GosquaredEndpoints['tracking.identify'] = async (
	ctx,
	input,
) => {
	const parsed =
		GosquaredEndpointInputSchemas['tracking.identify'].parse(input);
	const siteToken = parsed.site_token ?? ctx.options?.siteToken;

	const { site_token: _, ...body } = parsed;

	const response = await makeGosquaredRequest<
		GosquaredEndpointOutputs['tracking.identify']
	>('/tracking/v1/properties', ctx.key, {
		method: 'POST',
		body,
		siteToken,
	});

	const parsedResponse =
		GosquaredEndpointOutputSchemas['tracking.identify'].parse(response);

	await logEventFromContext(
		ctx,
		'gosquared.tracking.identify',
		{ success: true },
		'completed',
	);

	return parsedResponse;
};

export const trackTransaction: GosquaredEndpoints['tracking.trackTransaction'] =
	async (ctx, input) => {
		const parsed =
			GosquaredEndpointInputSchemas['tracking.trackTransaction'].parse(input);
		const siteToken = parsed.site_token ?? ctx.options?.siteToken;

		const { site_token: _, ...body } = parsed;

		const response = await makeGosquaredRequest<
			GosquaredEndpointOutputs['tracking.trackTransaction']
		>('/tracking/v1/transaction', ctx.key, {
			method: 'POST',
			body,
			siteToken,
		});

		const parsedResponse =
			GosquaredEndpointOutputSchemas['tracking.trackTransaction'].parse(
				response,
			);

		await logEventFromContext(
			ctx,
			'gosquared.tracking.trackTransaction',
			{ transactionId: parsed.transaction.id },
			'completed',
		);

		return parsedResponse;
	};

export const trackPageview: GosquaredEndpoints['tracking.trackPageview'] =
	async (ctx, input) => {
		const parsed =
			GosquaredEndpointInputSchemas['tracking.trackPageview'].parse(input);
		const siteToken = parsed.site_token ?? ctx.options?.siteToken;

		const { site_token: _, ...body } = parsed;

		const response = await makeGosquaredRequest<
			GosquaredEndpointOutputs['tracking.trackPageview']
		>('/tracking/v1/pageview', ctx.key, {
			method: 'POST',
			body,
			siteToken,
		});

		const parsedResponse =
			GosquaredEndpointOutputSchemas['tracking.trackPageview'].parse(response);

		await logEventFromContext(
			ctx,
			'gosquared.tracking.trackPageview',
			{ success: true },
			'completed',
		);

		return parsedResponse;
	};
