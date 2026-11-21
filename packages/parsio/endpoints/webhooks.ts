import { asRecord } from 'corsair/core';
import type { ParsioEndpoints } from '..';
import { makeParsioRequest } from '../client';
import { call, expectEmptyBody } from './call';
import {
	ParsioEndpointInputSchemas as Inputs,
	ParsioEndpointOutputSchemas as Outputs,
} from './types';

export const listForMailbox: ParsioEndpoints['webhooksListForMailbox'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'webhooks.listForMailbox',
			input: Inputs.webhooksListForMailbox,
			output: Outputs.webhooksListForMailbox,
		},
		input,
		({ mailboxId }) => ({
			method: 'GET',
			path: `/webhooks/mb/${encodeURIComponent(mailboxId)}`,
		}),
		{ log: (_, webhooks) => ({ count: webhooks.length }) },
	);

export const get: ParsioEndpoints['webhooksGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'webhooks.get',
			input: Inputs.webhooksGet,
			output: Outputs.webhooksGet,
		},
		input,
		({ webhookId }) => ({
			method: 'GET',
			path: `/webhooks/${encodeURIComponent(webhookId)}`,
		}),
		{ log: (_, webhook) => ({ webhookId: webhook._id ?? undefined }) },
	);

export const create: ParsioEndpoints['webhooksCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'webhooks.create',
			input: Inputs.webhooksCreate,
			output: Outputs.webhooksCreate,
		},
		input,
		({ mailboxId, table_id, ...body }) => ({
			method: 'POST',
			path: `/webhooks/${encodeURIComponent(mailboxId)}`,
			// The API refuses a missing table_id ("table_id must be a string",
			// live); an empty one means no table.
			body: { ...body, table_id: table_id ?? '' },
		}),
		{
			// The answer carries the webhook's signing secret (live); the id is
			// all that is logged.
			log: (_, webhook) => ({ webhookId: webhook._id ?? undefined }),
		},
	);

export const update: ParsioEndpoints['webhooksUpdate'] = async (ctx, input) => {
	// The API requires url, event and table_id on every update (live:
	// "url must be a string; event must be a string; table_id must be a
	// string"), so the current values fill whatever the caller leaves out.
	const parsedInput = Inputs.webhooksUpdate.parse(input ?? {});
	const current =
		asRecord(
			await makeParsioRequest(ctx.key, {
				method: 'GET',
				path: `/webhooks/${encodeURIComponent(parsedInput.webhookId)}`,
			}),
		) ?? {};
	const keep = (key: string) =>
		typeof current[key] === 'string' ? (current[key] as string) : undefined;
	return call(
		ctx,
		{
			event: 'webhooks.update',
			input: Inputs.webhooksUpdate,
			output: Outputs.webhooksUpdate,
		},
		input,
		({ webhookId, ...body }) => ({
			method: 'POST',
			path: '/webhooks',
			body: {
				_id: webhookId,
				url: keep('url'),
				event: keep('event'),
				table_id: keep('table_id') ?? '',
				...Object.fromEntries(
					Object.entries(body).filter(([, value]) => value !== undefined),
				),
			},
		}),
		{
			shape: (raw) => {
				const result = asRecord(raw);
				if (result?.isError === true) {
					throw new Error(
						`Parsio webhooks.update refused: ${typeof result.errMsg === 'string' ? result.errMsg : 'no reason given'}`,
					);
				}
				return raw;
			},
			log: (parsed) => ({ webhookId: parsed.webhookId }),
		},
	);
};

export const remove: ParsioEndpoints['webhooksDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'webhooks.delete',
			input: Inputs.webhooksDelete,
			output: Outputs.webhooksDelete,
		},
		input,
		({ ids }) => ({
			method: 'DELETE',
			path: '/webhooks',
			body: { ids },
		}),
		{
			shape: (raw, { ids }) => {
				expectEmptyBody(raw, 'webhooks.delete');
				return { ids, success: true };
			},
			log: (_, result) => ({ count: result.ids.length }),
		},
	);
