import type { KnackContext } from '..';
import type { KnackQuery } from '../client';
import { buildFilterQuery, segment } from '../client';
import { callKnack, resolveSingleRecord } from './call';
import type { KnackEndpointInputs, KnackEndpointOutputs } from './types';
import {
	KnackRecordsCreateInputSchema,
	KnackRecordsCreateResponseSchema,
	KnackRecordsDeleteInputSchema,
	KnackRecordsDeleteResponseSchema,
	KnackRecordsGetInputSchema,
	KnackRecordsGetResponseSchema,
	KnackRecordsListInputSchema,
	KnackRecordsListResponseSchema,
	KnackRecordsUpdateInputSchema,
	KnackRecordsUpdateResponseSchema,
} from './types';

/**
 * Knack takes filters as `filters[0][field]`, `filters[0][operator]` and
 * `filters[0][value]`. The index is required: the unindexed form is silently
 * ignored and every record comes back, so `buildFilterQuery` writes the names.
 */
function buildListQuery(
	parsed: KnackEndpointInputs['recordsList'],
): KnackQuery {
	const query: KnackQuery = {};
	if (parsed.page !== undefined) query.page = parsed.page;
	if (parsed.rows_per_page !== undefined) {
		query.rows_per_page = parsed.rows_per_page;
	}
	if (parsed.sort_field !== undefined) {
		query.sort_field = parsed.sort_field;
		// Knack ignores a sort order with no sort field, so it is only sent
		// alongside one.
		if (parsed.sort_order !== undefined) query.sort_order = parsed.sort_order;
	}
	if (parsed.filters && parsed.filters.length > 0) {
		Object.assign(query, buildFilterQuery(parsed.filters));
	}
	return query;
}

export const list = (
	ctx: KnackContext,
	input: KnackEndpointInputs['recordsList'],
): Promise<KnackEndpointOutputs['recordsList']> =>
	callKnack(
		ctx,
		{
			event: 'records.list',
			input: KnackRecordsListInputSchema,
			output: KnackRecordsListResponseSchema,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/objects/${segment(parsed.object_key)}/records`,
			query: buildListQuery(parsed),
		}),
		{
			log: (parsed, result) => ({
				object_key: parsed.object_key,
				page: result.current_page,
				records: result.records.length,
				total: result.total_records,
			}),
		},
	);

/**
 * Knack has no single-record route: `GET /objects/{key}/records/{id}` answers
 * the bare record, and an id that does not exist answers `200` with an **empty
 * records list** instead of a 404. `resolveSingleRecord` turns that list into
 * the error a caller expects, so a missing record cannot look like a record
 * whose fields are all absent.
 */
export const get = (
	ctx: KnackContext,
	input: KnackEndpointInputs['recordsGet'],
): Promise<KnackEndpointOutputs['recordsGet']> =>
	callKnack(
		ctx,
		{
			event: 'records.get',
			input: KnackRecordsGetInputSchema,
			output: KnackRecordsGetResponseSchema,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/objects/${segment(parsed.object_key)}/records/${segment(parsed.record_id)}`,
		}),
		{
			shape: (raw) => resolveSingleRecord(raw, 'records.get'),
			log: (parsed) => ({
				object_key: parsed.object_key,
				record_id: parsed.record_id,
			}),
		},
	);

export const create = (
	ctx: KnackContext,
	input: KnackEndpointInputs['recordsCreate'],
): Promise<KnackEndpointOutputs['recordsCreate']> =>
	callKnack(
		ctx,
		{
			event: 'records.create',
			input: KnackRecordsCreateInputSchema,
			output: KnackRecordsCreateResponseSchema,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: `/objects/${segment(parsed.object_key)}/records`,
			body: parsed.fields,
		}),
		{
			log: (parsed) => ({
				object_key: parsed.object_key,
				fields: Object.keys(parsed.fields).length,
			}),
		},
	);

export const update = (
	ctx: KnackContext,
	input: KnackEndpointInputs['recordsUpdate'],
): Promise<KnackEndpointOutputs['recordsUpdate']> =>
	callKnack(
		ctx,
		{
			event: 'records.update',
			input: KnackRecordsUpdateInputSchema,
			output: KnackRecordsUpdateResponseSchema,
		},
		input,
		(parsed) => ({
			method: 'PUT',
			path: `/objects/${segment(parsed.object_key)}/records/${segment(parsed.record_id)}`,
			body: parsed.fields,
		}),
		{
			log: (parsed) => ({
				object_key: parsed.object_key,
				record_id: parsed.record_id,
				fields: Object.keys(parsed.fields).length,
			}),
		},
	);

/**
 * Named `remove` because `delete` is reserved in TypeScript; it is registered
 * under the `delete` key. Knack answers `{"delete": true}` and the schema
 * requires that flag, so a 200 without it is not reported as a deletion.
 */
export const remove = (
	ctx: KnackContext,
	input: KnackEndpointInputs['recordsDelete'],
): Promise<KnackEndpointOutputs['recordsDelete']> =>
	callKnack(
		ctx,
		{
			event: 'records.delete',
			input: KnackRecordsDeleteInputSchema,
			output: KnackRecordsDeleteResponseSchema,
		},
		input,
		(parsed) => ({
			method: 'DELETE',
			path: `/objects/${segment(parsed.object_key)}/records/${segment(parsed.record_id)}`,
		}),
		{
			log: (parsed) => ({
				object_key: parsed.object_key,
				record_id: parsed.record_id,
			}),
		},
	);
