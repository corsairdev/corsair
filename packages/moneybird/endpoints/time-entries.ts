import type { MoneybirdEndpoints } from '..';
import { idSegment } from '../client';
import { call, emptyBodyShape } from './call';
import {
	MoneybirdEndpointInputSchemas as Inputs,
	MoneybirdEndpointOutputSchemas as Outputs,
	wrapListPage,
} from './types';

export const list: MoneybirdEndpoints['timeEntriesList'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'timeEntries.list',
			input: Inputs.timeEntriesList,
			output: Outputs.timeEntriesList,
		},
		input,
		({ page, per_page, filter }) => ({
			replayable: true,
			method: 'GET',
			path: '/time_entries.json',
			query: { page, per_page, filter },
		}),
		{
			shape: (raw, parsed) => wrapListPage(raw, parsed.page, parsed.per_page),
			log: (_, result) => ({ items: result.items.length }),
		},
	);

export const get: MoneybirdEndpoints['timeEntriesGet'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'timeEntries.get',
			input: Inputs.timeEntriesGet,
			output: Outputs.timeEntriesGet,
		},
		input,
		({ id }) => ({
			replayable: true,
			method: 'GET',
			path: `/time_entries/${idSegment(id)}.json`,
		}),
		{
			log: ({ id }) => ({ id }),
		},
	);

function upsertBody(input: {
	project_id?: string | number;
	user_id?: string | number;
	started_at?: string;
	ended_at?: string;
	description?: string;
	billable?: boolean;
}) {
	return {
		project_id: input.project_id,
		user_id: input.user_id,
		started_at: input.started_at,
		ended_at: input.ended_at,
		description: input.description,
		billable: input.billable,
	};
}

export const create: MoneybirdEndpoints['timeEntriesCreate'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'timeEntries.create',
			input: Inputs.timeEntriesCreate,
			output: Outputs.timeEntriesCreate,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/time_entries.json',
			body: { time_entry: upsertBody(parsed) },
			mediaType: 'application/json',
		}),
		{
			log: (_, result) => ({ id: result.id }),
		},
	);

export const update: MoneybirdEndpoints['timeEntriesUpdate'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'timeEntries.update',
			input: Inputs.timeEntriesUpdate,
			output: Outputs.timeEntriesUpdate,
		},
		input,
		({ id, ...rest }) => ({
			method: 'PATCH',
			path: `/time_entries/${idSegment(id)}.json`,
			body: { time_entry: upsertBody(rest) },
			mediaType: 'application/json',
		}),
		{
			log: ({ id }) => ({ id }),
		},
	);

export const remove: MoneybirdEndpoints['timeEntriesDelete'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'timeEntries.delete',
			input: Inputs.timeEntriesDelete,
			output: Outputs.timeEntriesDelete,
		},
		input,
		({ id }) => ({
			method: 'DELETE',
			path: `/time_entries/${idSegment(id)}.json`,
		}),
		{
			shape: (raw, { id }) => emptyBodyShape(raw, String(id)),
			log: ({ id }) => ({ id }),
		},
	);
