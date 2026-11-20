import type { StannpEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import { recipientFormFields } from './postcards';
import {
	StannpEndpointInputSchemas as Inputs,
	StannpEndpointOutputSchemas as Outputs,
} from './types';

export const create: StannpEndpoints['lettersCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'letters.create',
			input: Inputs.lettersCreate,
			output: Outputs.lettersCreate,
		},
		input,
		(
			{
				test,
				recipient,
				template,
				file,
				pages,
				size,
				duplex,
				clearzone,
				post_unverified,
				tags,
				addons,
				idempotencyKey,
			},
			base,
		) => ({
			method: 'POST',
			base,
			path: '/v1/letters/create',
			form: {
				test,
				...recipientFormFields(recipient),
				template,
				file,
				pages,
				size,
				duplex,
				clearzone,
				post_unverified,
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

export const post: StannpEndpoints['lettersPost'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'letters.post',
			input: Inputs.lettersPost,
			output: Outputs.lettersPost,
		},
		input,
		(
			{
				test,
				country,
				pdf,
				size,
				duplex,
				transactional,
				tags,
				addons,
				idempotencyKey,
			},
			base,
		) => ({
			method: 'POST',
			base,
			path: '/v1/letters/post',
			form: { test, country, pdf, size, duplex, transactional, tags, addons },
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

export const get: StannpEndpoints['lettersGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'letters.get',
			input: Inputs.lettersGet,
			output: Outputs.lettersGet,
		},
		input,
		({ id }, base) => ({
			method: 'GET',
			base,
			path: `/v1/letters/get/${segment(id)}`,
		}),
		{
			log: (_, result) => ({
				id: result.id ?? undefined,
				status: result.status ?? undefined,
			}),
		},
	);

export const cancel: StannpEndpoints['lettersCancel'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'letters.cancel',
			input: Inputs.lettersCancel,
			output: Outputs.lettersCancel,
		},
		input,
		({ id }, base) => ({
			method: 'POST',
			base,
			path: '/v1/letters/cancel',
			form: { id },
		}),
		{
			log: ({ id }) => ({ id }),
		},
	);
