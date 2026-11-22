import type { StannpEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import type { StannpRecipientAddress } from './types';
import {
	StannpEndpointInputSchemas as Inputs,
	StannpEndpointOutputSchemas as Outputs,
} from './types';

/** Flattens the recipient union into the documented bracket form. */
export function recipientFormFields(
	recipient: number | StannpRecipientAddress,
): Record<string, string | number | boolean | undefined> {
	if (typeof recipient === 'number') return { recipient };
	const fields: Record<string, string | number | boolean | undefined> = {};
	for (const [key, value] of Object.entries(recipient)) {
		if (value === undefined || value === null) continue;
		// unknown: `.loose()` adds an index signature, so the values read as
		// unknown; every declared field is a string.
		fields[`recipient[${key}]`] = value as string | number | boolean;
	}
	return fields;
}

export const create: StannpEndpoints['postcardsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'postcards.create',
			input: Inputs.postcardsCreate,
			output: Outputs.postcardsCreate,
		},
		input,
		(
			{
				size,
				test,
				template,
				recipient,
				message,
				signature,
				front,
				back,
				padding,
				post_unverified,
				clearzone,
				return_address,
				tags,
				addons,
				idempotencyKey,
			},
			base,
		) => ({
			method: 'POST',
			base,
			path: '/v1/postcards/create',
			form: {
				size,
				test,
				template,
				...recipientFormFields(recipient),
				message,
				signature,
				front,
				back,
				padding,
				post_unverified,
				clearzone,
				return_address,
				tags,
				addons,
			},
			idempotencyKey,
		}),
		{
			log: (_, result) => ({
				id: result.id ?? undefined,
				status: result.status ?? undefined,
				cost: result.cost ?? undefined,
			}),
		},
	);

export const get: StannpEndpoints['postcardsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'postcards.get',
			input: Inputs.postcardsGet,
			output: Outputs.postcardsGet,
		},
		input,
		({ id }, base) => ({
			method: 'GET',
			base,
			path: `/v1/postcards/get/${segment(id)}`,
		}),
		{
			log: (_, result) => ({
				id: result.id ?? undefined,
				status: result.status ?? undefined,
			}),
		},
	);

export const cancel: StannpEndpoints['postcardsCancel'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'postcards.cancel',
			input: Inputs.postcardsCancel,
			output: Outputs.postcardsCancel,
		},
		input,
		({ id }, base) => ({
			method: 'POST',
			base,
			path: '/v1/postcards/cancel',
			form: { id },
		}),
		{
			log: ({ id }) => ({ id }),
		},
	);
