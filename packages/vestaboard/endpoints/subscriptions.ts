import { logEventFromContext } from 'corsair/core';
import type { VestaboardEndpoints } from '..';
import { makeVestaboardRequest } from '../client';
import { VestaboardSubscription } from '../schema';
import {
	SubscriptionsListOutputSchema,
	SubscriptionsPostMessageOutputSchema,
} from './types';

function parseSubscriptionList(raw: unknown) {
	const rows = Array.isArray(raw)
		? raw
		: raw && typeof raw === 'object' && 'subscriptions' in raw
			? (raw as { subscriptions: unknown }).subscriptions
			: raw;
	return SubscriptionsListOutputSchema.parse({
		subscriptions: VestaboardSubscription.array().parse(rows),
	});
}

export const list: VestaboardEndpoints['subscriptionsList'] = async (ctx) => {
	const response = parseSubscriptionList(
		await makeVestaboardRequest('/subscriptions', ctx.key),
	);
	await logEventFromContext(
		ctx,
		'vestaboard.subscriptions.list',
		{},
		'completed',
	);
	return response;
};

export const postMessage: VestaboardEndpoints['subscriptionsPostMessage'] =
	async (ctx, input) => {
		const body =
			input.characters !== undefined
				? { characters: input.characters }
				: { text: input.text };
		const response = SubscriptionsPostMessageOutputSchema.parse(
			await makeVestaboardRequest(
				`/subscriptions/${encodeURIComponent(input.subscriptionId)}/message`,
				ctx.key,
				{ method: 'POST', body },
			),
		);
		await logEventFromContext(
			ctx,
			'vestaboard.subscriptions.postMessage',
			{ subscriptionId: input.subscriptionId },
			'completed',
		);
		return response;
	};
