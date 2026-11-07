import { asRecord } from 'corsair/core';
import type { FollowUpBossEndpoints } from '..';
import { segment } from '../client';
import { call, envelopeMany, envelopeMeta, envelopeOne } from './call';
import {
	WebhooksInputSchemas as Inputs,
	WebhooksOutputSchemas as Outputs,
} from './webhooks-types';

// The aggregated schema registry in './registry' reads the family maps from
// this module, so they are re-exported alongside the handlers.
export { WebhooksInputSchemas, WebhooksOutputSchemas } from './webhooks-types';

// Handlers are structurally typed until the central FollowUpBossEndpoints map
// gains the webhooks family; call() owns input parsing and output validation.

export const webhooksList: FollowUpBossEndpoints['webhooksList'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'webhooks.list',
			input: Inputs.webhooksList,
			output: Outputs.webhooksList,
		},
		input,
		(query) => ({ method: 'GET', path: '/webhooks', query }),
		{
			shape: (raw) => ({
				webhooks: envelopeMany(raw, 'webhooks'),
				_metadata: envelopeMeta(raw),
			}),
			log: (_, result) => ({ count: result.webhooks.length }),
		},
	);

export const webhooksCreate: FollowUpBossEndpoints['webhooksCreate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'webhooks.create',
			input: Inputs.webhooksCreate,
			output: Outputs.webhooksCreate,
		},
		input,
		(body) => ({ method: 'POST', path: '/webhooks', body }),
		{
			// The create answers 200 with the bare webhook, either bare or wrapped.
			shape: (raw) => envelopeOne(raw, 'webhooks'),
			log: (_, result) => ({ webhookId: result.id ?? undefined }),
		},
	);

export const webhooksGet: FollowUpBossEndpoints['webhooksGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'webhooks.get',
			input: Inputs.webhooksGet,
			output: Outputs.webhooksGet,
		},
		input,
		({ id }) => ({ method: 'GET', path: `/webhooks/${segment(id)}` }),
		{
			// A single fetch arrives as `{ webhooks: [webhook] }` or bare.
			shape: (raw) => envelopeOne(raw, 'webhooks'),
			log: ({ id }) => ({ webhookId: id }),
		},
	);

export const webhooksUpdate: FollowUpBossEndpoints['webhooksUpdate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'webhooks.update',
			input: Inputs.webhooksUpdate,
			output: Outputs.webhooksUpdate,
		},
		input,
		({ id, ...body }) => ({
			method: 'PUT',
			path: `/webhooks/${segment(id)}`,
			body,
		}),
		{
			shape: (raw) => envelopeOne(raw, 'webhooks'),
			log: ({ id }) => ({ webhookId: id }),
		},
	);

export const webhooksDelete: FollowUpBossEndpoints['webhooksDelete'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'webhooks.delete',
			input: Inputs.webhooksDelete,
			output: Outputs.webhooksDelete,
		},
		input,
		({ id }) => ({ method: 'DELETE', path: `/webhooks/${segment(id)}` }),
		{
			// unknown: the documented 200 body is empty, but FUB may echo the
			// deleted webhook in it.
			shape: (raw, { id }) => ({ id, resource: asRecord(raw) }),
			log: ({ id }) => ({ webhookId: id }),
		},
	);

// ── webhook events ─────────────────────────────────────────────────────────

// GET /webhookEvents/:id: the published path uses the `:id` colon style, the
// one path in the spec not written with `{id}` braces; the `{id}` template
// semantics are used here so the segment is interpolated and encoded like
// every other path parameter.
export const webhookEventsGet: FollowUpBossEndpoints['webhookEventsGet'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'webhookEvents.get',
			input: Inputs.webhookEventsGet,
			output: Outputs.webhookEventsGet,
		},
		input,
		({ id }) => ({ method: 'GET', path: `/webhookEvents/${segment(id)}` }),
		{
			// The delivery events arrive as the `webhookEvents` list (or a bare
			// array); the full list is preserved, including an empty one.
			shape: (raw) => {
				const record = asRecord(raw);
				// The documented envelope wins, even when its list is empty. A
				// non-list `webhookEvents` (null, an object) goes to output
				// validation as-is so it fails instead of passing as one event.
				if (record && 'webhookEvents' in record) {
					return record.webhookEvents;
				}
				if (Array.isArray(raw)) return raw;
				// A bare single-event 200 body still parses, wrapped as a list.
				return record ? [raw] : [];
			},
			log: ({ id }) => ({ webhookId: id }),
		},
	);
