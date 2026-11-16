import type { SpondyrEndpoints } from '..';
import { adminWrites } from './admin';
import { call } from './call';
import {
	SpondyrEndpointInputSchemas,
	SpondyrEndpointOutputSchemas,
} from './types';

/**
 * A Search Filter is not scoped by Transaction Type on its own routes: the
 * documented `GET /Search` and `DELETE /Search` take only the name, while the
 * list route does take a Transaction Type.
 */
export const list: SpondyrEndpoints['searchFiltersList'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'searchFilters.list',
			input: SpondyrEndpointInputSchemas.listSearchFilters,
			output: SpondyrEndpointOutputSchemas.listSearchFilters,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: 'Searches',
			query: { TransactionType: parsed.transaction_type },
		}),
		{
			log: (parsed, result) => ({
				transaction_type: parsed.transaction_type,
				search_filters: result.Data.length,
			}),
		},
	);

export const get: SpondyrEndpoints['searchFiltersGet'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'searchFilters.get',
			input: SpondyrEndpointInputSchemas.getSearchFilter,
			output: SpondyrEndpointOutputSchemas.getSearchFilter,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: 'Search',
			query: { Search: parsed.search },
		}),
		{ log: (parsed) => ({ search: parsed.search }) },
	);

const writes = adminWrites({
	resource: 'Search',
	event: 'searchFilters',
	create: {
		input: SpondyrEndpointInputSchemas.createSearchFilter,
		output: SpondyrEndpointOutputSchemas.createSearchFilter,
	},
	update: {
		input: SpondyrEndpointInputSchemas.updateSearchFilter,
		output: SpondyrEndpointOutputSchemas.updateSearchFilter,
	},
	delete: {
		input: SpondyrEndpointInputSchemas.deleteSearchFilter,
		output: SpondyrEndpointOutputSchemas.deleteSearchFilter,
	},
	body: (parsed) => ({
		TransactionType: parsed.transaction_type,
		Name: parsed.name,
		...(parsed.tag === undefined ? {} : { Tag: parsed.tag }),
		...(parsed.search === undefined ? {} : { Search: parsed.search }),
	}),
	name: (parsed) => String(parsed.search),
	logCreate: (parsed) => ({
		transaction_type: parsed.transaction_type,
		search: parsed.name ?? parsed.search,
	}),
});

export const create: SpondyrEndpoints['searchFiltersCreate'] = writes.create;
export const update: SpondyrEndpoints['searchFiltersUpdate'] = writes.update;
export const remove: SpondyrEndpoints['searchFiltersDelete'] = writes.remove;
