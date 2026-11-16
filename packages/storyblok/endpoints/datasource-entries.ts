import type { StoryblokEndpoints } from '..';
import { segment } from '../client';
import { call, confirmDeletion, isEmptyBody, wrapRecord } from './shared';
import {
	StoryblokEndpointInputSchemas as Inputs,
	StoryblokEndpointOutputSchemas as Outputs,
} from './types';

export const list: StoryblokEndpoints['datasourceEntriesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'datasourceEntries.list',
			input: Inputs.datasourceEntriesList,
			output: Outputs.datasourceEntriesList,
		},
		input,
		(query) => ({ method: 'GET', path: '/datasource_entries', query }),
		{ log: (_, result) => ({ count: result.datasource_entries.length }) },
	);

export const get: StoryblokEndpoints['datasourceEntriesGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'datasourceEntries.get',
			input: Inputs.datasourceEntriesGet,
			output: Outputs.datasourceEntriesGet,
		},
		input,
		({ datasource_entry_id }) => ({
			method: 'GET',
			path: `/datasource_entries/${segment(datasource_entry_id)}`,
		}),
		{ log: ({ datasource_entry_id }) => ({ entryId: datasource_entry_id }) },
	);

export const create: StoryblokEndpoints['datasourceEntriesCreate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'datasourceEntries.create',
			input: Inputs.datasourceEntriesCreate,
			output: Outputs.datasourceEntriesCreate,
		},
		input,
		(datasource_entry) => ({
			method: 'POST',
			path: '/datasource_entries',
			body: { datasource_entry },
		}),
		{
			log: (_, result) => ({
				entryId: result.datasource_entry.id ?? undefined,
			}),
		},
	);

export const update: StoryblokEndpoints['datasourceEntriesUpdate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'datasourceEntries.update',
			input: Inputs.datasourceEntriesUpdate,
			output: Outputs.datasourceEntriesUpdate,
		},
		input,
		({ datasource_entry_id, dimension_id, ...datasource_entry }) => ({
			method: 'PUT',
			path: `/datasource_entries/${segment(datasource_entry_id)}`,
			// dimension_id sits next to datasource_entry, not inside it.
			body: { datasource_entry, dimension_id },
		}),
		{
			// Storyblok answers a bodyless 204, so the result is what was sent.
			shape: (raw, { datasource_entry_id, name, value, dimension_value }) =>
				isEmptyBody(raw)
					? {
							datasource_entry: {
								id: datasource_entry_id,
								name,
								value,
								...(dimension_value === undefined ? {} : { dimension_value }),
							},
						}
					: wrapRecord('datasource_entry', raw),
			log: ({ datasource_entry_id }) => ({ entryId: datasource_entry_id }),
		},
	);

export const remove: StoryblokEndpoints['datasourceEntriesDelete'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'datasourceEntries.delete',
			input: Inputs.datasourceEntriesDelete,
			output: Outputs.datasourceEntriesDelete,
		},
		input,
		({ datasource_entry_id }) => ({
			method: 'DELETE',
			path: `/datasource_entries/${segment(datasource_entry_id)}`,
		}),
		{
			// A bodyless 204 (or the wrapped record) confirms the delete.
			shape: (raw, { datasource_entry_id }) =>
				confirmDeletion(raw, 'datasource_entry', datasource_entry_id),
			log: ({ datasource_entry_id }) => ({ entryId: datasource_entry_id }),
		},
	);
