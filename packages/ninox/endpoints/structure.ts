import { asRecord } from 'corsair/core';
import type { NinoxEndpoints } from '..';
import { segment, workspacePath } from '../client';
import { call, dataList, dataObject } from './call';
import {
	NinoxEndpointInputSchemas as Inputs,
	NinoxEndpointOutputSchemas as Outputs,
} from './types';

function modulePath(workspaceId: string, moduleName: string): string {
	return `${workspacePath(workspaceId)}/modules/${segment(moduleName)}`;
}

function tablePath(
	workspaceId: string,
	moduleName: string,
	tableName: string,
): string {
	return `${modulePath(workspaceId, moduleName)}/tables/${segment(tableName)}`;
}

/**
 * A delete answers 204 with no body. Any other status already threw, so the
 * plugin reports the name it removed.
 */
function deleted(raw: unknown, name: string) {
	// unknown: the empty body, or a provider envelope if Ninox ever adds one.
	const record = asRecord(raw);
	if (raw !== undefined && raw !== null && raw !== '' && !record) {
		throw new Error(`Expected an empty Ninox delete answer, got ${typeof raw}`);
	}
	return { deleted: true as const, name };
}

/** Reads one module (app) by its internal name. */
export const moduleGet: NinoxEndpoints['moduleGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'modules.get',
			input: Inputs.moduleGet,
			output: Outputs.moduleGet,
		},
		input,
		({ workspaceId, moduleName }) => ({
			method: 'GET',
			path: modulePath(workspaceId, moduleName),
		}),
		{ shape: (raw) => ({ module: dataObject(raw) }) },
	);

/** Reads one table with all of its field definitions. */
export const tableGet: NinoxEndpoints['tableGet'] = (ctx, input) =>
	call(
		ctx,
		{ event: 'tables.get', input: Inputs.tableGet, output: Outputs.tableGet },
		input,
		({ workspaceId, moduleName, tableName }) => ({
			method: 'GET',
			path: tablePath(workspaceId, moduleName, tableName),
		}),
		{
			shape: (raw) => ({ table: dataObject(raw) }),
			log: ({ tableName }, result) => ({
				table: tableName,
				fields: result.table.fields?.length ?? 0,
			}),
		},
	);

/** Creates a table in a module. Add its fields with fields.create. */
export const tableCreate: NinoxEndpoints['tableCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'tables.create',
			input: Inputs.tableCreate,
			output: Outputs.tableCreate,
		},
		input,
		({ workspaceId, moduleName, table }) => ({
			method: 'POST',
			path: `${modulePath(workspaceId, moduleName)}/tables`,
			body: table,
		}),
		{
			shape: (raw) => ({ table: dataObject(raw) }),
			log: ({ table }) => ({ table: table.name }),
		},
	);

/** Deletes a table and every record in it. There is no undo through the API. */
export const tableDelete: NinoxEndpoints['tableDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'tables.delete',
			input: Inputs.tableDelete,
			output: Outputs.tableDelete,
		},
		input,
		({ workspaceId, moduleName, tableName }) => ({
			method: 'DELETE',
			path: tablePath(workspaceId, moduleName, tableName),
		}),
		{
			shape: (raw, { tableName }) => deleted(raw, tableName),
			log: ({ tableName }) => ({ table: tableName }),
		},
	);

/** Adds a field (column) to a table. */
export const fieldCreate: NinoxEndpoints['fieldCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'fields.create',
			input: Inputs.fieldCreate,
			output: Outputs.fieldCreate,
		},
		input,
		({ workspaceId, moduleName, tableName, field }) => ({
			method: 'POST',
			path: `${tablePath(workspaceId, moduleName, tableName)}/fields`,
			body: field,
		}),
		{
			shape: (raw) => ({ field: dataObject(raw) }),
			log: ({ tableName, field }) => ({ table: tableName, type: field.type }),
		},
	);

/** Removes a field and the values every record held in it. */
export const fieldDelete: NinoxEndpoints['fieldDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'fields.delete',
			input: Inputs.fieldDelete,
			output: Outputs.fieldDelete,
		},
		input,
		({ workspaceId, moduleName, tableName, fieldName }) => ({
			method: 'DELETE',
			path: `${tablePath(workspaceId, moduleName, tableName)}/fields/${segment(fieldName)}`,
		}),
		{
			shape: (raw, { fieldName }) => deleted(raw, fieldName),
			log: ({ tableName }) => ({ table: tableName }),
		},
	);

/** Lists a table's saved views. */
export const viewsList: NinoxEndpoints['viewsList'] = (ctx, input) =>
	call(
		ctx,
		{ event: 'views.list', input: Inputs.viewsList, output: Outputs.viewsList },
		input,
		({ workspaceId, moduleName, tableName }) => ({
			method: 'GET',
			path: `${tablePath(workspaceId, moduleName, tableName)}/views`,
		}),
		{
			shape: (raw) => ({ views: dataList(raw, 'view').items }),
			log: (_, result) => ({ count: result.views.length }),
		},
	);

/**
 * Runs Ninox script in a module, the way a formula or button would. A script can
 * read, change and delete records, so this is destructive. With `wait` Ninox
 * answers the result; a script that runs long (or `background`) answers the run.
 */
export const scriptExecute: NinoxEndpoints['scriptExecute'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'scripts.execute',
			input: Inputs.scriptExecute,
			output: Outputs.scriptExecute,
		},
		input,
		({ workspaceId, moduleName, script, tableName, rowId, mode }) => ({
			method: 'POST',
			path: `${workspacePath(workspaceId)}/script/exec`,
			query: { mode },
			body: { moduleName, script, tableName, rowId },
		}),
		{
			shape: (raw) => {
				// The envelope key tells them apart, never the script's value:
				// a 200 is { data: <result> } and a 202 is { run: { id, status } }.
				const envelope = asRecord(raw);
				if (envelope && 'data' in envelope) return { result: envelope.data };
				const run = asRecord(envelope?.run);
				if (run) return { run };
				throw new Error('Expected a Ninox script answer with data or run');
			},
			// The script and its result can hold record data, so neither is logged.
			log: ({ moduleName }, result) => ({
				module: moduleName,
				queued: result.run !== undefined,
			}),
		},
	);
