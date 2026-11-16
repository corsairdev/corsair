import type { NasdaqEndpoints } from '..';
import { call } from './call';
import {
	NasdaqEndpointInputSchemas as Inputs,
	NasdaqEndpointOutputSchemas as Outputs,
} from './types';

/**
 * Lists the database catalogue, paged by number. Each entry carries the
 * `database_code` a caller needs before querying one of its tables.
 */
export const list: NasdaqEndpoints['databasesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'databases.list',
			input: Inputs.databasesList,
			output: Outputs.databasesList,
		},
		input,
		({ query, per_page, page }) => ({
			method: 'GET',
			path: '/databases',
			query: { query, per_page, page },
		}),
		{ log: (_, result) => ({ count: result.databases.length }) },
	);
