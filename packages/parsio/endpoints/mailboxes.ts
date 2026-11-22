import { asRecord } from 'corsair/core';
import type { ParsioEndpoints } from '..';
import { makeParsioRequest } from '../client';
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

export const update: ParsioEndpoints['mailboxesUpdate'] = async (
	ctx,
	input,
) => {
	// The API requires email_prefix on every update ("email_prefix must be a
	// string", live), so the current one is read when the caller gives none.
	const parsedInput = Inputs.mailboxesUpdate.parse(input ?? {});
	let emailPrefix = parsedInput.email_prefix;
	if (emailPrefix === undefined) {
		const current = Outputs.mailboxesGet.parse(
			await makeParsioRequest(ctx.key, {
				method: 'GET',
				path: `/mailboxes/${encodeURIComponent(parsedInput.mailboxId)}`,
			}),
		);
		if (typeof current.email_prefix !== 'string') {
			throw new Error(
				'Parsio mailboxes.update: the mailbox answered no email_prefix to keep',
			);
		}
		emailPrefix = current.email_prefix;
	}
	return call(
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
			body: { ...body, email_prefix: emailPrefix },
		}),
		{
			shape: (raw) => {
				const result = asRecord(raw);
				if (result?.isError === true) {
					throw new Error(
						`Parsio mailboxes.update refused: ${typeof result.errMsg === 'string' ? result.errMsg : 'no reason given'}`,
					);
				}
				return raw;
			},
			log: (parsed) => ({ mailboxId: parsed.mailboxId }),
		},
	);
};

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
