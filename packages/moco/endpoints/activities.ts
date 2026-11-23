import type { MocoEndpoints } from '..';
import { segment } from '../client';
import { call, emptyBodyShape } from './call';
import {
	MocoEndpointInputSchemas as Inputs,
	MocoEndpointOutputSchemas as Outputs,
	wrapListPage,
} from './types';

export const list: MocoEndpoints['activitiesList'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'activities.list',
			input: Inputs.activitiesList,
			output: Outputs.activitiesList,
		},
		input,
		({
			page,
			from,
			to,
			user_id,
			task_id,
			company_id,
			project_id,
			deal_id,
			billable,
			billed,
			term,
			tag,
			remote_id,
		}) => ({
			replayable: true,
			method: 'GET',
			path: '/activities',
			query: {
				from,
				to,
				user_id,
				task_id,
				company_id,
				project_id,
				deal_id,
				billable,
				billed,
				term,
				tag,
				remote_id,
				page,
			},
		}),
		{
			shape: (raw, parsed) => wrapListPage(raw, parsed.page),
			log: (_, result) => ({ items: result.items.length }),
		},
	);

export const get: MocoEndpoints['activitiesGet'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'activities.get',
			input: Inputs.activitiesGet,
			output: Outputs.activitiesGet,
		},
		input,
		({ id }) => ({
			replayable: true,
			method: 'GET',
			path: `/activities/${segment(id)}`,
		}),
		{
			log: ({ id }) => ({ id }),
		},
	);

export const create: MocoEndpoints['activitiesCreate'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'activities.create',
			input: Inputs.activitiesCreate,
			output: Outputs.activitiesCreate,
		},
		input,
		({
			date,
			project_id,
			task_id,
			company_id,
			hours,
			seconds,
			description,
			tag,
			billable,
			remote_service,
			remote_url,
			remote_id,
			stop_timer,
		}) => ({
			// The response body is the created activity itself; nothing to shape.
			method: 'POST',
			path: '/activities',
			body: {
				date,
				project_id,
				task_id,
				company_id,
				hours,
				seconds,
				description,
				tag,
				billable,
				remote_service,
				remote_url,
				remote_id,
				stop_timer,
			},
			mediaType: 'application/json',
		}),
		{
			log: (_, result) => ({ id: result.id ?? undefined }),
		},
	);

export const update: MocoEndpoints['activitiesUpdate'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'activities.update',
			input: Inputs.activitiesUpdate,
			output: Outputs.activitiesUpdate,
		},
		input,
		({
			id,
			date,
			project_id,
			task_id,
			company_id,
			hours,
			seconds,
			description,
			tag,
			billable,
			remote_service,
			remote_url,
			remote_id,
			stop_timer,
		}) => ({
			method: 'PATCH',
			path: `/activities/${segment(id)}`,
			body: {
				date,
				project_id,
				task_id,
				company_id,
				hours,
				seconds,
				description,
				tag,
				billable,
				remote_service,
				remote_url,
				remote_id,
				stop_timer,
			},
			mediaType: 'application/json',
		}),
		{
			log: ({ id }) => ({ id }),
		},
	);

export const remove: MocoEndpoints['activitiesDelete'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'activities.delete',
			input: Inputs.activitiesDelete,
			output: Outputs.activitiesDelete,
		},
		input,
		({ id }) => ({
			method: 'DELETE',
			path: `/activities/${segment(id)}`,
		}),
		{
			// The activity is gone by now, so a bodyless answer is a success.
			shape: (raw, { id }) => emptyBodyShape(raw, id),
			log: ({ id }) => ({ id }),
		},
	);
