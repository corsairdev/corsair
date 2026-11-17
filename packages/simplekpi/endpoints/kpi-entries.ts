import { logEventFromContext } from 'corsair/core';
import type { SimplekpiEndpoints } from '..';
import { makeSimplekpiRequest, segment } from '../client';
import { call, deletion } from './shared';
import {
	SimplekpiEndpointInputSchemas as Inputs,
	SimplekpiEndpointOutputSchemas as Outputs,
} from './types';

export const list: SimplekpiEndpoints['kpiEntriesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'kpiEntries.list',
			input: Inputs.kpiEntriesList,
			output: Outputs.kpiEntriesList,
		},
		input,
		({ page, rows, ...filters }) => ({
			method: 'GET',
			path: '/v1/kpientries',
			query: { ...filters, page, rows },
		}),
		{
			log: (parsed, result) => ({
				kpiId: parsed.kpiId,
				count: result.length,
			}),
		},
	);

/**
 * An upsert: `kpi_id`, `source_id` and `entry_date` identify the entry, so the
 * same trio again updates it rather than adding a duplicate. A 201 means a new
 * entry, a 200 an existing one; both parse through the same output schema.
 */
export const create: SimplekpiEndpoints['kpiEntriesCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'kpiEntries.create',
			input: Inputs.kpiEntriesCreate,
			output: Outputs.kpiEntriesCreate,
		},
		input,
		(body) => ({ method: 'POST', path: '/v1/kpientries', body }),
		{
			// A valid write with every value empty answers `{ stored: false }` and
			// a 200. Logging the id would then read from a field that is absent.
			log: (parsed, result) => ({
				kpiId: parsed.kpi_id,
				// 'id' in result narrows the union, but the index signature widens
				// the value, so it is checked before being logged.
				entryId:
					'id' in result && typeof result.id === 'number'
						? result.id
						: undefined,
				stored: !('stored' in result),
			}),
		},
	);

export const get: SimplekpiEndpoints['kpiEntriesGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'kpiEntries.get',
			input: Inputs.kpiEntriesGet,
			output: Outputs.kpiEntriesGet,
		},
		input,
		({ id }) => ({ method: 'GET', path: `/v1/kpientries/${segment(id)}` }),
		{ log: ({ id }) => ({ entryId: id }) },
	);

export const update: SimplekpiEndpoints['kpiEntriesUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'kpiEntries.update',
			input: Inputs.kpiEntriesUpdate,
			output: Outputs.kpiEntriesUpdate,
		},
		input,
		({ id, ...body }) => ({
			method: 'PUT',
			path: `/v1/kpientries/${segment(id)}`,
			body,
		}),
		{
			log: ({ id }, result) => ({
				entryId: id,
				stored: !('stored' in result),
			}),
		},
	);

export const remove: SimplekpiEndpoints['kpiEntriesDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'kpiEntries.delete',
			input: Inputs.kpiEntriesDelete,
			output: Outputs.kpiEntriesDelete,
		},
		input,
		({ id }) => ({ method: 'DELETE', path: `/v1/kpientries/${segment(id)}` }),
		{
			shape: (raw, { id }) => deletion(raw, 'kpiEntries.delete', id),
			log: ({ id }) => ({ entryId: id }),
		},
	);

/**
 * The batch route always answers 200, even when every row was rejected, so the
 * status says nothing. `rows_rejected` is the signal, and a batch that dropped
 * every row is reported as an error rather than a silent success.
 */
export const createBatch: SimplekpiEndpoints['kpiEntriesCreateBatch'] = async (
	ctx,
	input,
) => {
	const parsed = Inputs.kpiEntriesCreateBatch.parse(input ?? {});
	const raw = await makeSimplekpiRequest(ctx.key, {
		method: 'POST',
		path: '/v1/kpientries/list',
		body: parsed,
	});
	const result = Outputs.kpiEntriesCreateBatch.parse(raw);

	if (result.rows_added === 0 && result.rows_rejected > 0) {
		throw new Error(
			`kpiEntries.createBatch rejected all ${result.rows_rejected} rows. Check the KPI ids, the sources and that each entry_date is a date the KPI's frequency allows.`,
		);
	}

	await logEventFromContext(
		ctx,
		'simplekpi.kpiEntries.createBatch',
		{
			submitted: parsed.entries.length,
			added: result.rows_added,
			rejected: result.rows_rejected,
		},
		'completed',
	);
	return result;
};
