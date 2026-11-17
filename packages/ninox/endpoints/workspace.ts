import type { NinoxEndpoints } from '..';
import { segment, workspacePath } from '../client';
import { call, dataList, dataObject } from './call';
import {
	NinoxEndpointInputSchemas as Inputs,
	NinoxEndpointOutputSchemas as Outputs,
} from './types';

/** Reads the workspace and its module summaries in one call. */
export const get: NinoxEndpoints['workspaceGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'workspace.get',
			input: Inputs.workspaceGet,
			output: Outputs.workspaceGet,
		},
		input,
		({ workspaceId }) => ({
			method: 'GET',
			path: workspacePath(workspaceId),
		}),
		{
			shape: (raw) => {
				// Passed through as sent: the output schema requires an array, so a
				// malformed `modules` fails instead of reading as an empty workspace.
				return { modules: dataObject(raw).modules };
			},
			log: (_, result) => ({ modules: result.modules.length }),
		},
	);

/** Lists modules in the workspace, paged by limit and offset. */
export const modules: NinoxEndpoints['modulesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'modules.list',
			input: Inputs.modulesList,
			output: Outputs.modulesList,
		},
		input,
		({ workspaceId, limit, offset }) => ({
			method: 'GET',
			path: `${workspacePath(workspaceId)}/modules`,
			query: { limit, offset },
		}),
		{
			shape: (raw) => {
				const { items, pageInfo } = dataList(raw, 'module');
				return { modules: items, page_info: pageInfo };
			},
			log: (_, result) => ({ count: result.modules.length }),
		},
	);

/** Lists the tables inside one module. */
export const tables: NinoxEndpoints['tablesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'tables.list',
			input: Inputs.tablesList,
			output: Outputs.tablesList,
		},
		input,
		({ workspaceId, moduleName, limit, offset }) => ({
			method: 'GET',
			path: `${workspacePath(workspaceId)}/modules/${segment(moduleName)}/tables`,
			query: { limit, offset },
		}),
		{
			shape: (raw) => {
				const { items, pageInfo } = dataList(raw, 'table');
				return { tables: items, page_info: pageInfo };
			},
			log: ({ moduleName }, result) => ({
				module: moduleName,
				count: result.tables.length,
			}),
		},
	);

/**
 * Lists a table's fields. The names and types decide what a record write may set,
 * so this is the call to make before building a record body.
 */
export const fields: NinoxEndpoints['fieldsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'fields.list',
			input: Inputs.fieldsList,
			output: Outputs.fieldsList,
		},
		input,
		({ workspaceId, moduleName, tableName, limit, offset }) => ({
			method: 'GET',
			path: `${workspacePath(workspaceId)}/modules/${segment(moduleName)}/tables/${segment(tableName)}/fields`,
			query: { limit, offset },
		}),
		{
			shape: (raw) => {
				const { items, pageInfo } = dataList(raw, 'field');
				return { fields: items, page_info: pageInfo };
			},
			log: ({ tableName }, result) => ({
				table: tableName,
				count: result.fields.length,
			}),
		},
	);
