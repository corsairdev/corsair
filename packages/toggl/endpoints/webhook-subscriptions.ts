import { logEventFromContext } from 'corsair/core';
import { makeTogglRequest } from '../client';
import type { TogglEndpoints } from '../index';
import { auditPayload } from './logging';
import type { TogglEndpointOutputs } from './types';

/**
 * Toggl's webhook subscription management, served from a separate host path
 * (`/webhooks/api/v1`) rather than the Track v9 API.
 *
 * These manage subscriptions on Toggl's side. The plugin still registers no
 * Corsair webhook handlers — see the note in index.ts.
 */

/** Reads the health of Toggl's webhooks service, which runs on its own host. */
export const getStatus: TogglEndpoints['webhooksGetStatus'] = async (
	ctx,
	input,
) => {
	const result = await makeTogglRequest<
		TogglEndpointOutputs['webhooksGetStatus']
	>('status', ctx.key, { method: 'GET', base: 'webhooks' });

	await logEventFromContext(
		ctx,
		'toggl.webhooks.getStatus',
		auditPayload(input, []),
		'completed',
	);
	return result;
};

export const getEventFilters: TogglEndpoints['webhooksGetEventFilters'] =
	async (ctx, input) => {
		const result = await makeTogglRequest<
			TogglEndpointOutputs['webhooksGetEventFilters']
		>('event_filters', ctx.key, { method: 'GET', base: 'webhooks' });

		await logEventFromContext(
			ctx,
			'toggl.webhooks.getEventFilters',
			auditPayload(input, []),
			'completed',
		);
		return result ?? {};
	};

export const listSubscriptions: TogglEndpoints['webhooksListSubscriptions'] =
	async (ctx, input) => {
		const result = await makeTogglRequest<
			TogglEndpointOutputs['webhooksListSubscriptions']
		>(`subscriptions/${input.workspace_id}`, ctx.key, {
			method: 'GET',
			base: 'webhooks',
		});

		await logEventFromContext(
			ctx,
			'toggl.webhooks.listSubscriptions',
			auditPayload(input, ['workspace_id']),
			'completed',
		);
		return result ?? [];
	};

export const deleteSubscription: TogglEndpoints['webhooksDeleteSubscription'] =
	async (ctx, input) => {
		await makeTogglRequest<unknown>(
			`subscriptions/${input.workspace_id}/${input.subscription_id}`,
			ctx.key,
			{ method: 'DELETE', base: 'webhooks' },
		);

		await logEventFromContext(
			ctx,
			'toggl.webhooks.deleteSubscription',
			auditPayload(input, ['workspace_id', 'subscription_id']),
			'completed',
		);
		return { deleted: true, id: input.subscription_id };
	};
