import { logEventFromContext } from '../../utils/events';
import type { CalendlyEndpoints } from '..';
import { makeCalendlyRequest } from '../client';
import type { CalendlyEndpointOutputs } from './types';

export const create: CalendlyEndpoints['webhookSubscriptionsCreate'] = async (
	ctx,
	input,
) => {
	const result = await makeCalendlyRequest<
		CalendlyEndpointOutputs['webhookSubscriptionsCreate']
	>('webhook_subscriptions', ctx.key, {
		method: 'POST',
		body: {
			url: input.url,
			events: input.events,
			organization: input.organization,
			scope: input.scope,
			user: input.user,
			signing_key: input.signing_key,
		},
	});

	if (result.resource && ctx.db.webhookSubscriptions) {
		try {
			const uriParts = result.resource.uri.split('/');
			// URI always has at least one segment; last segment is the UUID
			const id = uriParts[uriParts.length - 1]!;
			await ctx.db.webhookSubscriptions.upsertByEntityId(id, {
				id,
				uri: result.resource.uri,
				callback_url: result.resource.callback_url,
				state: result.resource.state,
				scope: result.resource.scope,
				organization: result.resource.organization,
				user: result.resource.user,
				created_at: result.resource.created_at
					? new Date(result.resource.created_at)
					: null,
				updated_at: result.resource.updated_at
					? new Date(result.resource.updated_at)
					: null,
			});
		} catch (error) {
			console.warn('Failed to save webhook subscription to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'calendly.webhookSubscriptions.create',
		{ ...input },
		'completed',
	);
	return result;
};

export const get: CalendlyEndpoints['webhookSubscriptionsGet'] = async (
	ctx,
	input,
) => {
	const result = await makeCalendlyRequest<
		CalendlyEndpointOutputs['webhookSubscriptionsGet']
	>(`webhook_subscriptions/${input.uuid}`, ctx.key, {
		method: 'GET',
	});

	if (result.resource && ctx.db.webhookSubscriptions) {
		try {
			await ctx.db.webhookSubscriptions.upsertByEntityId(input.uuid, {
				id: input.uuid,
				uri: result.resource.uri,
				callback_url: result.resource.callback_url,
				state: result.resource.state,
				scope: result.resource.scope,
				organization: result.resource.organization,
				user: result.resource.user,
				created_at: result.resource.created_at
					? new Date(result.resource.created_at)
					: null,
				updated_at: result.resource.updated_at
					? new Date(result.resource.updated_at)
					: null,
			});
		} catch (error) {
			console.warn('Failed to save webhook subscription to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'calendly.webhookSubscriptions.get',
		{ ...input },
		'completed',
	);
	return result;
};

export const list: CalendlyEndpoints['webhookSubscriptionsList'] = async (
	ctx,
	input,
) => {
	const result = await makeCalendlyRequest<
		CalendlyEndpointOutputs['webhookSubscriptionsList']
	>('webhook_subscriptions', ctx.key, {
		method: 'GET',
		query: {
			organization: input.organization,
			scope: input.scope,
			user: input.user,
			count: input.count,
			page_token: input.page_token,
		},
	});

	if (result.collection && ctx.db.webhookSubscriptions) {
		try {
			for (const sub of result.collection) {
				const uriParts = sub.uri.split('/');
				// URI always has at least one segment; last segment is the UUID
			const id = uriParts[uriParts.length - 1]!;
				await ctx.db.webhookSubscriptions.upsertByEntityId(id, {
					id,
					uri: sub.uri,
					callback_url: sub.callback_url,
					state: sub.state,
					scope: sub.scope,
					organization: sub.organization,
					user: sub.user,
					created_at: sub.created_at ? new Date(sub.created_at) : null,
					updated_at: sub.updated_at ? new Date(sub.updated_at) : null,
				});
			}
		} catch (error) {
			console.warn(
				'Failed to save webhook subscriptions to database:',
				error,
			);
		}
	}

	await logEventFromContext(
		ctx,
		'calendly.webhookSubscriptions.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const deleteSubscription: CalendlyEndpoints['webhookSubscriptionsDelete'] =
	async (ctx, input) => {
		const result = await makeCalendlyRequest<
			CalendlyEndpointOutputs['webhookSubscriptionsDelete']
		>(`webhook_subscriptions/${input.uuid}`, ctx.key, {
			method: 'DELETE',
		});

		await logEventFromContext(
			ctx,
			'calendly.webhookSubscriptions.delete',
			{ ...input },
			'completed',
		);
		return result;
	};
