import { asRecord } from 'corsair/core';
import type { Mem0Endpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	Mem0EndpointInputSchemas as Inputs,
	Mem0EndpointOutputSchemas as Outputs,
} from './types';

export const list: Mem0Endpoints['webhooksList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'webhooks.list',
			input: Inputs.webhooksList,
			output: Outputs.webhooksList,
		},
		input,
		({ project_id }) => ({
			method: 'GET',
			path: `/api/v1/webhooks/projects/${segment(project_id)}/`,
		}),
		{
			// Mem0 answers with a bare array, so it is wrapped for the schema. A
			// body that is not an array is left for the schema to reject rather
			// than being reported as no webhooks.
			shape: (raw) => ({ webhooks: raw }),
			log: (_, result) => ({ count: result.webhooks.length }),
		},
	);

export const create: Mem0Endpoints['webhooksCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'webhooks.create',
			input: Inputs.webhooksCreate,
			output: Outputs.webhooksCreate,
		},
		input,
		({ project_id, name, url, event_types, is_active }) => ({
			method: 'POST',
			path: `/api/v1/webhooks/projects/${segment(project_id)}/`,
			body: { name, url, event_types, is_active },
		}),
		{
			log: (_, result) => ({
				webhookId: result.webhook_id,
				events: result.event_types?.length,
				active: result.is_active ?? undefined,
			}),
		},
	);

export const update: Mem0Endpoints['webhooksUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'webhooks.update',
			input: Inputs.webhooksUpdate,
			output: Outputs.webhooksUpdate,
		},
		input,
		({ webhook_id, name, url, event_types }) => ({
			method: 'PUT',
			path: `/api/v1/webhooks/${segment(webhook_id)}/`,
			body: { name, url, event_types },
		}),
		{
			// Mem0 answers with `{ message }`, which some deployments replace with
			// the updated webhook, so both are kept.
			shape: (raw, { webhook_id }) => {
				const record = asRecord(raw);
				const webhook = record && 'webhook_id' in record ? record : undefined;
				return {
					success: true,
					webhook_id,
					...record,
					...(webhook ? { webhook } : {}),
				};
			},
			log: ({ webhook_id }) => ({ webhookId: webhook_id }),
		},
	);

export const remove: Mem0Endpoints['webhooksDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'webhooks.delete',
			input: Inputs.webhooksDelete,
			output: Outputs.webhooksDelete,
		},
		input,
		({ webhook_id }) => ({
			method: 'DELETE',
			path: `/api/v1/webhooks/${segment(webhook_id)}/`,
		}),
		{
			// The webhook is gone by now, so a missing body is not a failure.
			shape: (raw, { webhook_id }) => ({
				success: true,
				webhook_id,
				...asRecord(raw),
			}),
			log: ({ webhook_id }) => ({ webhookId: webhook_id }),
		},
	);
