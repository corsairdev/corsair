import { logEventFromContext } from 'corsair/core';
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
		body: input,
	});

	if (result.resource && ctx.db.webhookSubscriptions) {
		try {
			const uriParts = result.resource.uri.split('/');
			// URI always has at least one segment; last segment is the UUID
			const id = uriParts[uriParts.length - 1]!;
			await ctx.db.webhookSubscriptions.upsertByEntityId(id, {
				id,
				...result.resource,
				user: result.resource.user ?? undefined,
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
	const { uuid, ...query } = input;
	const result = await makeCalendlyRequest<
		CalendlyEndpointOutputs['webhookSubscriptionsGet']
	>(`webhook_subscriptions/${uuid}`, ctx.key, {
		query,
		method: 'GET',
	});

	if (result.resource && ctx.db.webhookSubscriptions) {
		try {
			await ctx.db.webhookSubscriptions.upsertByEntityId(uuid, {
				id: uuid,
				...result.resource,
				user: result.resource.user ?? undefined,
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
		query: input,
	});

	if (result.collection && ctx.db.webhookSubscriptions) {
		try {
			for (const sub of result.collection) {
				const uriParts = sub.uri.split('/');
				// URI always has at least one segment; last segment is the UUID
				const id = uriParts[uriParts.length - 1]!;
				await ctx.db.webhookSubscriptions.upsertByEntityId(id, {
					id,
					...sub,
					user: sub.user ?? undefined,
					created_at: sub.created_at ? new Date(sub.created_at) : null,
					updated_at: sub.updated_at ? new Date(sub.updated_at) : null,
				});
			}
		} catch (error) {
			console.warn('Failed to save webhook subscriptions to database:', error);
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
		const { uuid, ...query } = input;
		const result = await makeCalendlyRequest<
			CalendlyEndpointOutputs['webhookSubscriptionsDelete']
		>(`webhook_subscriptions/${uuid}`, ctx.key, {
			query,
			method: 'DELETE',
		});

		if (ctx.db.webhookSubscriptions) {
			try {
				await ctx.db.webhookSubscriptions.deleteByEntityId(uuid);
			} catch (error) {
				console.warn(
					'Failed to delete webhook subscription from database:',
					error,
				);
			}
		}

		await logEventFromContext(
			ctx,
			'calendly.webhookSubscriptions.delete',
			{ ...input },
			'completed',
		);
		return result;
	};
