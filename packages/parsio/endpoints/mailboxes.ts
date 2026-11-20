import type { ParsioEndpoints } from '..';
import { call, expectEmptyBody } from './call';
import {
	ParsioEndpointInputSchemas as Inputs,
	ParsioEndpointOutputSchemas as Outputs,
} from './types';

export const list: ParsioEndpoints['mailboxesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'mailboxes.list',
			input: Inputs.mailboxesList,
			output: Outputs.mailboxesList,
		},
		input,
		() => ({ method: 'GET', path: '/mailboxes' }),
		{ log: (_, mailboxes) => ({ count: mailboxes.length }) },
	);

export const get: ParsioEndpoints['mailboxesGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'mailboxes.get',
			input: Inputs.mailboxesGet,
			output: Outputs.mailboxesGet,
		},
		input,
		({ mailboxId }) => ({
			method: 'GET',
			path: `/mailboxes/${encodeURIComponent(mailboxId)}`,
		}),
		{ log: (_, mailbox) => ({ mailboxId: mailbox._id ?? undefined }) },
	);

export const create: ParsioEndpoints['mailboxesCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'mailboxes.create',
			input: Inputs.mailboxesCreate,
			output: Outputs.mailboxesCreate,
		},
		input,
		(body) => ({ method: 'POST', path: '/mailboxes/create', body }),
		{ log: (_, mailbox) => ({ mailboxId: mailbox._id ?? undefined }) },
	);

export const update: ParsioEndpoints['mailboxesUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'mailboxes.update',
			input: Inputs.mailboxesUpdate,
			output: Outputs.mailboxesUpdate,
		},
		input,
		({ mailboxId, ...body }) => ({
			method: 'POST',
			path: `/mailboxes/${encodeURIComponent(mailboxId)}`,
			body,
		}),
		{ log: (_, mailbox) => ({ mailboxId: mailbox._id ?? undefined }) },
	);

export const remove: ParsioEndpoints['mailboxesDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'mailboxes.delete',
			input: Inputs.mailboxesDelete,
			output: Outputs.mailboxesDelete,
		},
		input,
		({ mailboxId }) => ({
			method: 'DELETE',
			path: `/mailboxes/${encodeURIComponent(mailboxId)}`,
		}),
		{
			shape: (raw, { mailboxId }) => {
				expectEmptyBody(raw, 'mailboxes.delete');
				return { mailboxId, success: true };
			},
			log: (_, result) => ({ mailboxId: result.mailboxId }),
		},
	);

export const tableFields: ParsioEndpoints['mailboxesTableFields'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'mailboxes.tableFields',
			input: Inputs.mailboxesTableFields,
			output: Outputs.mailboxesTableFields,
		},
		input,
		({ mailboxId }) => ({
			method: 'GET',
			path: `/mailboxes/${encodeURIComponent(mailboxId)}/tableFields`,
		}),
		{ log: (_, fields) => ({ count: fields.length }) },
	);
