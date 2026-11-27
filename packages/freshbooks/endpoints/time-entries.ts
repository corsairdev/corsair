import type { FreshBooksEndpoints } from '..';
import { FreshBooksAPIError, segment } from '../client';
import { FreshBooksEndpointInputSchemas as Inputs, FreshBooksEndpointOutputSchemas as Outputs } from './types';
import { call } from './call';

const base = (businessId: number) =>
	`/timetracking/business/${segment(businessId)}/time_entries`;

export const list: FreshBooksEndpoints['timeEntriesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'timeEntries.list',
			input: Inputs.timeEntriesList,
			output: Outputs.timeEntriesList,
			envelope: 'bare',
		},
		input,
		({
			businessId,
			started_from,
			started_to,
			updated_since,
			billed,
			include_deleted,
			page,
			per_page,
		}) => ({
			method: 'GET',
			path: base(businessId),
			query: {
				started_from,
				started_to,
				updated_since,
				billed,
				include_deleted: include_deleted === undefined ? undefined : 1,
				page,
				per_page,
			},
		}),
		{ log: ({ businessId }) => ({ businessId }) },
	);

export const get: FreshBooksEndpoints['timeEntriesGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'timeEntries.get',
			input: Inputs.timeEntriesGet,
			output: Outputs.timeEntriesGet,
			envelope: 'bare',
		},
		input,
		({ businessId, timeEntryId }) => ({
			method: 'GET',
			path: `${base(businessId)}/${segment(timeEntryId)}`,
		}),
		{ log: ({ businessId, timeEntryId }) => ({ businessId, timeEntryId }) },
	);

export const create: FreshBooksEndpoints['timeEntriesCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'timeEntries.create',
			input: Inputs.timeEntriesCreate,
			output: Outputs.timeEntriesCreate,
			envelope: 'bare',
		},
		input,
		({ businessId, time_entry }) => ({
			method: 'POST',
			path: base(businessId),
			body: { time_entry },
		}),
		{
			log: ({ businessId, time_entry }) => ({
				businessId,
				duration: time_entry.duration,
				projectId: typeof time_entry.project_id === 'number' ? time_entry.project_id : undefined,
			}),
		},
	);

export const update: FreshBooksEndpoints['timeEntriesUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'timeEntries.update',
			input: Inputs.timeEntriesUpdate,
			output: Outputs.timeEntriesUpdate,
			envelope: 'bare',
		},
		input,
		({ businessId, timeEntryId, time_entry }) => ({
			method: 'PUT',
			path: `${base(businessId)}/${segment(timeEntryId)}`,
			body: { time_entry },
		}),
		{ log: ({ businessId, timeEntryId }) => ({ businessId, timeEntryId }) },
	);

// Hard delete: the entry is gone, not marked. The docs answer 204 with no
// content, so any body means the contract changed and must fail.
export const remove: FreshBooksEndpoints['timeEntriesDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'timeEntries.delete',
			input: Inputs.timeEntriesDelete,
			output: Outputs.timeEntriesDelete,
			envelope: 'bare',
		},
		input,
		({ businessId, timeEntryId }) => ({
			method: 'DELETE',
			path: `${base(businessId)}/${segment(timeEntryId)}`,
		}),
		{
			shape: (raw, { timeEntryId }) => {
				if (raw !== undefined && raw !== null && raw !== '') {
					throw new FreshBooksAPIError(
						'Unexpected timeEntries.delete response body',
					);
				}
				return { success: true as const, timeEntryId };
			},
			log: ({ businessId, timeEntryId }) => ({ businessId, timeEntryId }),
		},
	);
