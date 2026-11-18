import { asRecord } from 'corsair/core';
import type { NasdaqEndpoints } from '..';
import { tablePath } from '../client';
import { call, filterQuery } from './call';
import {
	NasdaqEndpointInputSchemas as Inputs,
	NasdaqEndpointOutputSchemas as Outputs,
} from './types';

/** Row values arrive as strings, numbers, booleans or null, never nested. */
const VALUE_TYPES = new Set(['string', 'number', 'boolean']);

// unknown: a cell straight out of the unchecked provider response; this guard
// is what narrows it.
function isScalar(value: unknown): value is string | number | boolean | null {
	return value === null || VALUE_TYPES.has(typeof value);
}

/**
 * Nasdaq answers rows as arrays positionally aligned with `datatable.columns`,
 * not as objects keyed by column name. Both are lifted out of the envelope, and
 * a row holding anything but a scalar fails here rather than reaching a caller
 * as an object where a cell was expected.
 */
// unknown: the body is this endpoint's JSON envelope, validated field by field.
export function shapeRows(raw: unknown): {
	columns: unknown[];
	rows: (string | number | boolean | null)[][];
	// unknown: Nasdaq's cursor, a string or null; anything else is left for the
	// output schema to reject rather than read as the last page.
	next_cursor_id: unknown;
} {
	const envelope = asRecord(raw);
	const datatable = asRecord(envelope?.datatable);
	if (!datatable) {
		throw new Error(`Expected a Nasdaq datatable envelope, got ${typeof raw}`);
	}
	const columns = datatable.columns;
	if (!Array.isArray(columns)) {
		throw new Error('Nasdaq datatable envelope has no columns array');
	}
	const data = datatable.data;
	if (!Array.isArray(data)) {
		throw new Error('Nasdaq datatable envelope has no data array');
	}
	const rows = data.map((row) => {
		if (!Array.isArray(row) || !row.every(isScalar)) {
			throw new Error('Nasdaq returned a row that is not a flat array');
		}
		return row;
	});
	const meta = asRecord(envelope?.meta);
	const cursor = meta?.next_cursor_id;
	return {
		columns,
		rows,
		next_cursor_id: cursor,
	};
}

/**
 * Pages by cursor, not by page number. `next_cursor_id` stays set while rows
 * remain and is null (or absent) on the last page, so a nullish cursor is the
 * only end signal.
 */
export const rows: NasdaqEndpoints['tablesRows'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'tables.rows',
			input: Inputs.tablesRows,
			output: Outputs.tablesRows,
		},
		input,
		({ table, filters, columns, per_page, cursor_id }) => ({
			method: 'GET',
			path: `/datatables/${tablePath(table)}.json`,
			query: {
				...filterQuery(filters),
				'qopts.columns': columns?.join(','),
				'qopts.per_page': per_page,
				'qopts.cursor_id': cursor_id,
			},
		}),
		{
			shape: shapeRows,
			log: ({ table }, result) => ({
				table,
				rows: result.rows.length,
				hasMore: typeof result.next_cursor_id === 'string',
			}),
		},
	);

/**
 * The metadata call is the only way to learn which columns a table makes
 * filterable, so a caller can build `filters` without guessing.
 */
export const metadata: NasdaqEndpoints['tablesMetadata'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'tables.metadata',
			input: Inputs.tablesMetadata,
			output: Outputs.tablesMetadata,
		},
		input,
		({ table }) => ({
			method: 'GET',
			path: `/datatables/${tablePath(table)}/metadata.json`,
		}),
		{
			shape: (raw) => {
				const datatable = asRecord(asRecord(raw)?.datatable);
				if (!datatable) {
					throw new Error(
						`Expected a Nasdaq datatable metadata envelope, got ${typeof raw}`,
					);
				}
				return datatable;
			},
			log: ({ table }, result) => ({
				table,
				columns: result.columns.length,
			}),
		},
	);

/**
 * Bulk export queues a zip and answers a signed link, valid for 30 minutes. The
 * first call usually answers `creating` (lowercase, as sent) with a null link, so a caller polls.
 * Nasdaq documents a 60-per-hour cap on this endpoint.
 */
export const exportTable: NasdaqEndpoints['tablesExport'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'tables.export',
			input: Inputs.tablesExport,
			output: Outputs.tablesExport,
		},
		input,
		({ table, filters, columns }) => ({
			method: 'GET',
			path: `/datatables/${tablePath(table)}.json`,
			query: {
				...filterQuery(filters),
				'qopts.columns': columns?.join(','),
				'qopts.export': true,
			},
		}),
		{
			shape: (raw) => {
				const bulk = asRecord(asRecord(raw)?.datatable_bulk_download);
				if (!bulk) {
					throw new Error(
						`Expected a Nasdaq bulk download envelope, got ${typeof raw}`,
					);
				}
				const file = asRecord(bulk.file);
				const datatable = asRecord(bulk.datatable);
				return {
					file: file ?? undefined,
					datatable: datatable ?? undefined,
					// The nested file.status is the documented one; the top-level
					// field is what the older examples show, so both are read.
					status: file?.status ?? bulk.status,
				};
			},
			log: ({ table }, result) => ({
				table,
				status: result.status ?? undefined,
			}),
		},
	);
