import type { MocoEndpoints } from '..';
import { segment } from '../client';
import { call, emptyBodyShape } from './call';
import type { CustomPropertiesInput } from './types';
import {
	MocoEndpointInputSchemas as Inputs,
	MocoEndpointOutputSchemas as Outputs,
	wrapListPage,
} from './types';

export const list: MocoEndpoints['dealsList'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'deals.list',
			input: Inputs.dealsList,
			output: Outputs.dealsList,
		},
		input,
		({
			page,
			status,
			tags,
			closed_from,
			closed_to,
			company_id,
			person_id,
		}) => ({
			replayable: true,
			method: 'GET',
			path: '/deals',
			query: {
				page,
				status,
				tags,
				closed_from,
				closed_to,
				company_id,
				person_id,
			},
		}),
		{
			shape: (raw, parsed) => wrapListPage(raw, parsed.page),
			log: (_, result) => ({ items: result.items.length }),
		},
	);

export const get: MocoEndpoints['dealsGet'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'deals.get',
			input: Inputs.dealsGet,
			output: Outputs.dealsGet,
		},
		input,
		({ id }) => ({
			replayable: true,
			method: 'GET',
			path: `/deals/${segment(id)}`,
		}),
		{
			log: ({ id }) => ({ id }),
		},
	);

function upsertBody(input: {
	name?: string;
	deal_category_id?: number;
	money?: number;
	currency?: string;
	status?: string;
	company_id?: number;
	customer_id?: number;
	person_id?: number;
	user_id?: number;
	info?: string;
	reminder_date?: string;
	closed_on?: string;
	service_period_from?: string;
	service_period_to?: string;
	tags?: string[];
	custom_properties?: CustomPropertiesInput;
}) {
	return {
		name: input.name,
		deal_category_id: input.deal_category_id,
		money: input.money,
		currency: input.currency,
		status: input.status,
		company_id: input.company_id,
		customer_id: input.customer_id,
		person_id: input.person_id,
		user_id: input.user_id,
		info: input.info,
		reminder_date: input.reminder_date,
		closed_on: input.closed_on,
		service_period_from: input.service_period_from,
		service_period_to: input.service_period_to,
		tags: input.tags,
		custom_properties: input.custom_properties,
	};
}

export const create: MocoEndpoints['dealsCreate'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'deals.create',
			input: Inputs.dealsCreate,
			output: Outputs.dealsCreate,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/deals',
			body: upsertBody(parsed),
			mediaType: 'application/json',
		}),
		{
			log: (_, result) => ({ id: result.id ?? undefined }),
		},
	);

export const update: MocoEndpoints['dealsUpdate'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'deals.update',
			input: Inputs.dealsUpdate,
			output: Outputs.dealsUpdate,
		},
		input,
		({ id, ...rest }) => ({
			method: 'PATCH',
			path: `/deals/${segment(id)}`,
			body: upsertBody(rest),
			mediaType: 'application/json',
		}),
		{
			log: ({ id }) => ({ id }),
		},
	);

export const remove: MocoEndpoints['dealsDelete'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'deals.delete',
			input: Inputs.dealsDelete,
			output: Outputs.dealsDelete,
		},
		input,
		({ id }) => ({
			method: 'DELETE',
			path: `/deals/${segment(id)}`,
		}),
		{
			shape: (raw, { id }) => emptyBodyShape(raw, id),
			log: ({ id }) => ({ id }),
		},
	);
