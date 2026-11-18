import { asRecord } from 'corsair/core';
import type { NinoxEndpoints } from '..';
import { segment, workspacePath } from '../client';
import { call, dataList, dataObject } from './call';
import {
	NinoxEndpointInputSchemas as Inputs,
	NinoxEndpointOutputSchemas as Outputs,
} from './types';

/** The collection path every records route shares. */
function recordsPath(
	workspaceId: string,
	moduleName: string,
	tableName: string,
): string {
	return `${workspacePath(workspaceId)}/modules/${segment(moduleName)}/tables/${segment(tableName)}/records`;
}

/**
 * Reads rows. `filter` is a JSON string rather than an object, because it goes in
 * the query string, and only columns the table marks filterable are accepted.
 */
export const list: NinoxEndpoints['recordsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'records.list',
			input: Inputs.recordsList,
			output: Outputs.recordsList,
		},
		input,
		({
			workspaceId,
			moduleName,
			tableName,
			fields,
			filter,
			sort,
			limit,
			offset,
		}) => ({
			method: 'GET',
			path: recordsPath(workspaceId, moduleName, tableName),
			query: {
				fields: fields?.join(','),
				filter,
				sort,
				limit,
				offset,
			},
		}),
		{
			shape: (raw) => {
				const { items, pageInfo } = dataList(raw, 'row');
				return { rows: items, page_info: pageInfo };
			},
			log: ({ tableName }, result) => ({
				table: tableName,
				count: result.rows.length,
			}),
		},
	);

/**
 * Reads one row by id. The id is not a filterable field, so this is the only way
 * to fetch a known record.
 */
export const get: NinoxEndpoints['recordsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'records.get',
			input: Inputs.recordsGet,
			output: Outputs.recordsGet,
		},
		input,
		({ workspaceId, moduleName, tableName, recordId, fields }) => ({
			method: 'GET',
			path: `${workspacePath(workspaceId)}/modules/${segment(moduleName)}/tables/${segment(tableName)}/record/${segment(String(recordId))}`,
			query: { fields: fields?.join(',') },
		}),
		{
			shape: (raw) => dataObject(raw),
			log: ({ recordId }) => ({ recordId }),
		},
	);

/**
 * Creates rows in one transaction. A single bad record rolls the whole set back,
 * so a batch either lands entirely or not at all.
 */
export const create: NinoxEndpoints['recordsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'records.create',
			input: Inputs.recordsCreate,
			output: Outputs.recordsCreate,
		},
		input,
		({ workspaceId, moduleName, tableName, records }) => ({
			method: 'POST',
			path: recordsPath(workspaceId, moduleName, tableName),
			body: { records },
		}),
		{
			shape: (raw) => dataObject(raw),
			log: ({ tableName }, result) => ({
				table: tableName,
				created: result.ids.length,
			}),
		},
	);

/**
 * Updates rows in one transaction. Sending `_expected` per record turns a
 * concurrent change into a 409 rather than a silent overwrite; `override` skips
 * that check.
 */
export const update: NinoxEndpoints['recordsUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'records.update',
			input: Inputs.recordsUpdate,
			output: Outputs.recordsUpdate,
		},
		input,
		({ workspaceId, moduleName, tableName, override, records }) => ({
			method: 'PATCH',
			path: recordsPath(workspaceId, moduleName, tableName),
			query: { override: override === undefined ? undefined : override },
			body: { records },
		}),
		{
			shape: (raw) => dataObject(raw),
			log: ({ tableName }, result) => ({
				table: tableName,
				updated: result.updatedIds.length,
			}),
		},
	);

/**
 * Deletes rows in one transaction. If any id is wrong the whole set rolls back,
 * so a partial delete cannot happen.
 */
export const remove: NinoxEndpoints['recordsDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'records.delete',
			input: Inputs.recordsDelete,
			output: Outputs.recordsDelete,
		},
		input,
		({ workspaceId, moduleName, tableName, recordIds }) => ({
			method: 'DELETE',
			path: recordsPath(workspaceId, moduleName, tableName),
			body: { records: recordIds },
		}),
		{
			shape: (raw) => dataObject(raw),
			log: ({ tableName }, result) => ({
				table: tableName,
				deleted: result.deletedIds.length,
			}),
		},
	);

/**
 * Creates or updates rows matched by one unique field. An ambiguous match, where
 * more than one row holds the value, answers 409 rather than picking one.
 */
export const upsert: NinoxEndpoints['recordsUpsert'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'records.upsert',
			input: Inputs.recordsUpsert,
			output: Outputs.recordsUpsert,
		},
		input,
		({ workspaceId, moduleName, tableName, matchField, records }) => ({
			method: 'POST',
			path: `${recordsPath(workspaceId, moduleName, tableName)}/upsert`,
			body: { matchField, records },
		}),
		{
			shape: (raw) => dataObject(raw),
			log: ({ tableName, matchField }, result) => ({
				table: tableName,
				matchField,
				created: result.createdIds.length,
				updated: result.updatedIds.length,
			}),
		},
	);

/**
 * Polls the row-level change feed. Only tables with history tracking enabled
 * answer; any other returns 400. Pass the response's `asOf` as `since` next time
 * so no change falls between two polls.
 */
export const changes: NinoxEndpoints['recordsChanges'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'records.changes',
			input: Inputs.recordsChanges,
			output: Outputs.recordsChanges,
		},
		input,
		({ workspaceId, moduleName, tableName, since, asOf, limit, offset }) => ({
			method: 'GET',
			path: `${recordsPath(workspaceId, moduleName, tableName)}/changes`,
			query: { since, asOf, limit, offset },
		}),
		{
			shape: (raw) => {
				const { items, pageInfo } = dataList(raw, 'change');
				return { changes: items, asOf: readAsOf(raw), page_info: pageInfo };
			},
			log: ({ tableName }, result) => ({
				table: tableName,
				changes: result.changes.length,
			}),
		},
	);

/** Reads `meta.asOf` out of the change feed's envelope. */
// unknown: the provider's envelope, read field by field.
function readAsOf(raw: unknown): string | undefined {
	const meta = asRecord(asRecord(raw)?.meta);
	const asOf = meta?.asOf;
	return typeof asOf === 'string' ? asOf : undefined;
}
