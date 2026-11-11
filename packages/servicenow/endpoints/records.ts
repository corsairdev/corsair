import type { ServicenowEndpoints } from '..';
import { call, queryOf, unwrapResult } from './call';
import {
	ServicenowEndpointInputSchemas as Inputs,
	ServicenowEndpointOutputSchemas as Outputs,
} from './types';

export const list: ServicenowEndpoints['recordsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'records.list',
			input: Inputs.recordsList,
			output: Outputs.recordsList,
		},
		input,
		({
			table,
			sysparm_query,
			sysparm_fields,
			sysparm_display_value,
			sysparm_exclude_reference_link,
			sysparm_no_count,
			sysparm_limit,
			sysparm_offset,
		}) => ({
			method: 'GET',
			path: `/table/${encodeURIComponent(table)}`,
			query: queryOf({
				sysparm_query,
				sysparm_fields,
				sysparm_display_value,
				sysparm_exclude_reference_link,
				sysparm_no_count,
				sysparm_limit,
				sysparm_offset,
			}),
		}),
		{
			shape: (raw) => {
				const result = unwrapResult(raw, 'record list');
				if (!Array.isArray(result)) {
					throw new Error('ServiceNow returned a non-array record list');
				}
				return { records: result };
			},
			log: (parsed, result) => ({
				table: parsed.table,
				count: result.records.length,
			}),
		},
	);

export const get: ServicenowEndpoints['recordsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'records.get',
			input: Inputs.recordsGet,
			output: Outputs.recordsGet,
		},
		input,
		({
			table,
			sys_id,
			sysparm_fields,
			sysparm_display_value,
			sysparm_exclude_reference_link,
		}) => ({
			method: 'GET',
			path: `/table/${encodeURIComponent(table)}/${encodeURIComponent(sys_id)}`,
			query: queryOf({
				sysparm_fields,
				sysparm_display_value,
				sysparm_exclude_reference_link,
			}),
		}),
		{
			shape: (raw) => unwrapResult(raw, 'record'),
			log: (parsed, result) => ({
				table: parsed.table,
				number: typeof result.number === 'string' ? result.number : undefined,
			}),
		},
	);

export const create: ServicenowEndpoints['recordsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'records.create',
			input: Inputs.recordsCreate,
			output: Outputs.recordsCreate,
		},
		input,
		({
			table,
			fields,
			sysparm_input_display_value,
			sysparm_display_value,
		}) => ({
			method: 'POST',
			path: `/table/${encodeURIComponent(table)}`,
			query: queryOf({ sysparm_input_display_value, sysparm_display_value }),
			body: fields,
		}),
		{
			shape: (raw) => unwrapResult(raw, 'created record'),
			log: (parsed, result) => ({
				table: parsed.table,
				sysId: typeof result.sys_id === 'string' ? result.sys_id : undefined,
			}),
		},
	);

export const update: ServicenowEndpoints['recordsUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'records.update',
			input: Inputs.recordsUpdate,
			output: Outputs.recordsUpdate,
		},
		input,
		({ table, sys_id, fields, sysparm_input_display_value }) => ({
			method: 'PATCH',
			path: `/table/${encodeURIComponent(table)}/${encodeURIComponent(sys_id)}`,
			query: queryOf({ sysparm_input_display_value }),
			body: fields,
		}),
		{
			shape: (raw) => unwrapResult(raw, 'updated record'),
			log: (parsed, result) => ({
				table: parsed.table,
				sysId: typeof result.sys_id === 'string' ? result.sys_id : undefined,
			}),
		},
	);

export const remove: ServicenowEndpoints['recordsDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'records.delete',
			input: Inputs.recordsDelete,
			output: Outputs.recordsDelete,
		},
		input,
		({ table, sys_id }) => ({
			method: 'DELETE',
			path: `/table/${encodeURIComponent(table)}/${encodeURIComponent(sys_id)}`,
		}),
		{
			// A DELETE answers 204 with no body, so the identifier is echoed back
			// rather than parsed from one.
			shape: (_, { table, sys_id }) => ({
				deleted: true as const,
				table,
				sys_id,
			}),
			log: ({ table, sys_id }) => ({ table, sysId: sys_id }),
		},
	);
