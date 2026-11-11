import type { ServicenowEndpoints } from '..';
import { call, fieldsWith, queryOf, unwrapResult } from './call';
import {
	ServicenowEndpointInputSchemas as Inputs,
	ServicenowEndpointOutputSchemas as Outputs,
} from './types';

/**
 * `sys_db_object` is the table that describes every table, so discovering a
 * table name needs no special endpoint. Filtering to tables that are not
 * extensions of another one keeps the useful ones near the top.
 */
export const list: ServicenowEndpoints['tablesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'tables.list',
			input: Inputs.tablesList,
			output: Outputs.tablesList,
		},
		input,
		({
			sysparm_query,
			sysparm_fields,
			sysparm_exclude_reference_link,
			sysparm_limit,
			sysparm_offset,
		}) => ({
			method: 'GET',
			path: '/table/sys_db_object',
			query: queryOf({
				sysparm_query,
				// Without a selection this table returns dozens of columns per row.
				// `name` is what a caller passes as `table`, so it is kept in any
				// selection: ServiceNow returns only the fields asked for.
				sysparm_fields:
					sysparm_fields === undefined
						? 'name,label,super_class,sys_id'
						: fieldsWith(sysparm_fields, ['name']),
				sysparm_exclude_reference_link,
				sysparm_limit,
				sysparm_offset,
			}),
		}),
		{
			shape: (raw) => {
				const result = unwrapResult(raw, 'table list');
				if (!Array.isArray(result)) {
					throw new Error('ServiceNow returned a non-array table list');
				}
				return { tables: result };
			},
			log: (_, result) => ({ count: result.tables.length }),
		},
	);
