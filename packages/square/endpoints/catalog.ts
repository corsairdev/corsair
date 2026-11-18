import type { SquareEndpoints } from '../index';
import { callSquare } from './shared';
import {
	SquareEndpointInputSchemas,
	SquareEndpointOutputSchemas,
} from './types';

/** GET /v2/catalog/list (ListCatalog). */
export const list: SquareEndpoints['catalogList'] = async (ctx, rawInput) => {
	const input = SquareEndpointInputSchemas.catalogList.parse(rawInput ?? {});
	return callSquare(ctx, '/v2/catalog/list', {
		query: input,
		output: SquareEndpointOutputSchemas.catalogList,
		event: 'catalog.list',
	});
};

/** POST /v2/catalog/search (SearchCatalogObjects). */
export const search: SquareEndpoints['catalogSearch'] = async (
	ctx,
	rawInput,
) => {
	const input = SquareEndpointInputSchemas.catalogSearch.parse(rawInput ?? {});
	return callSquare(ctx, '/v2/catalog/search', {
		method: 'POST',
		body: input,
		output: SquareEndpointOutputSchemas.catalogSearch,
		event: 'catalog.search',
	});
};

/** GET /v2/catalog/object/{object_id} (RetrieveCatalogObject). */
export const get: SquareEndpoints['catalogGet'] = async (ctx, rawInput) => {
	const input = SquareEndpointInputSchemas.catalogGet.parse(rawInput);
	const { object_id, ...query } = input;
	return callSquare(ctx, '/v2/catalog/object/{object_id}', {
		query,
		path: { object_id },
		output: SquareEndpointOutputSchemas.catalogGet,
		event: 'catalog.get',
		logged: { object_id },
	});
};

/** POST /v2/catalog/object (UpsertCatalogObject). */
export const upsert: SquareEndpoints['catalogUpsert'] = async (
	ctx,
	rawInput,
) => {
	const input = SquareEndpointInputSchemas.catalogUpsert.parse(rawInput);
	return callSquare(ctx, '/v2/catalog/object', {
		method: 'POST',
		body: input,
		output: SquareEndpointOutputSchemas.catalogUpsert,
		event: 'catalog.upsert',
	});
};

/** DELETE /v2/catalog/object/{object_id} (DeleteCatalogObject). */
export const remove: SquareEndpoints['catalogDelete'] = async (
	ctx,
	rawInput,
) => {
	const input = SquareEndpointInputSchemas.catalogDelete.parse(rawInput);
	return callSquare(ctx, '/v2/catalog/object/{object_id}', {
		method: 'DELETE',
		path: { object_id: input.object_id },
		output: SquareEndpointOutputSchemas.catalogDelete,
		event: 'catalog.delete',
		logged: { object_id: input.object_id },
	});
};
