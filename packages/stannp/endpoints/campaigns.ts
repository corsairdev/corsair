import type { StannpEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	StannpEndpointInputSchemas as Inputs,
	StannpEndpointOutputSchemas as Outputs,
} from './types';

export const list: StannpEndpoints['campaignsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'campaigns.list',
			input: Inputs.campaignsList,
			output: Outputs.campaignsList,
		},
		input,
		(_parsed, base) => ({
			method: 'GET',
			base,
			path: '/v1/campaigns/list',
		}),
		{
			log: (_, result) => ({ count: result.length }),
		},
	);

export const get: StannpEndpoints['campaignsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'campaigns.get',
			input: Inputs.campaignsGet,
			output: Outputs.campaignsGet,
		},
		input,
		({ id }, base) => ({
			method: 'GET',
			base,
			path: `/v1/campaigns/get/${segment(id)}`,
		}),
		{
			log: (_, result) => ({
				id: result.id ?? undefined,
				status: result.status ?? undefined,
			}),
		},
	);

export const create: StannpEndpoints['campaignsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'campaigns.create',
			input: Inputs.campaignsCreate,
			output: Outputs.campaignsCreate,
		},
		input,
		(
			{
				name,
				type,
				template_id,
				file,
				front,
				back,
				size,
				save,
				group_id,
				what_recipients,
				addons,
				idempotencyKey,
			},
			base,
		) => ({
			method: 'POST',
			base,
			path: '/v1/campaigns/create',
			form: {
				name,
				type,
				template_id,
				file,
				front,
				back,
				size,
				save,
				group_id,
				what_recipients,
				addons,
			},
			idempotencyKey,
		}),
		{
			log: ({ group_id }, result) => ({
				groupId: group_id,
				id: result.id ?? undefined,
			}),
		},
	);

export const sample: StannpEndpoints['campaignsSample'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'campaigns.sample',
			input: Inputs.campaignsSample,
			output: Outputs.campaignsSample,
		},
		input,
		({ id }, base) => ({
			method: 'POST',
			base,
			path: '/v1/campaigns/sample',
			form: { id },
		}),
		{
			log: ({ id }) => ({ id }),
		},
	);

export const approve: StannpEndpoints['campaignsApprove'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'campaigns.approve',
			input: Inputs.campaignsApprove,
			output: Outputs.campaignsApprove,
		},
		input,
		({ id }, base) => ({
			method: 'POST',
			base,
			path: '/v1/campaigns/approve',
			form: { id },
		}),
		{
			log: ({ id }) => ({ id }),
		},
	);

export const cost: StannpEndpoints['campaignsCost'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'campaigns.cost',
			input: Inputs.campaignsCost,
			output: Outputs.campaignsCost,
		},
		input,
		({ id }, base) => ({
			method: 'POST',
			base,
			path: '/v1/campaigns/cost',
			form: { id },
		}),
		{
			log: (_, result) => ({ total: result.total ?? undefined }),
		},
	);

export const availableDates: StannpEndpoints['campaignsAvailableDates'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'campaigns.availableDates',
			input: Inputs.campaignsAvailableDates,
			output: Outputs.campaignsAvailableDates,
		},
		input,
		({ start, end }, base) => ({
			method: 'POST',
			base,
			path: '/v1/campaigns/availableDates',
			form: { start, end },
		}),
		{
			log: (_, result) => ({ count: result.length }),
		},
	);

export const book: StannpEndpoints['campaignsBook'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'campaigns.book',
			input: Inputs.campaignsBook,
			output: Outputs.campaignsBook,
		},
		input,
		(
			{ id, send_date, next_available_date, use_balance, idempotencyKey },
			base,
		) => ({
			method: 'POST',
			base,
			path: '/v1/campaigns/book',
			form: { id, send_date, next_available_date, use_balance },
			idempotencyKey,
		}),
		{
			log: ({ id, send_date }) => ({ id, sendDate: send_date }),
		},
	);

// `delete` is a reserved word, so the function is named remove and the
// nested map registers it under the delete key.
export const remove: StannpEndpoints['campaignsDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'campaigns.delete',
			input: Inputs.campaignsDelete,
			output: Outputs.campaignsDelete,
		},
		input,
		({ id }, base) => ({
			method: 'POST',
			base,
			path: '/v1/campaigns/delete',
			form: { id },
		}),
		{
			log: ({ id }) => ({ id }),
		},
	);
