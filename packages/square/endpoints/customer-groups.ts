import type { SquareEndpoints } from '../index';
import { callSquare } from './shared';
import {
	SquareEndpointInputSchemas,
	SquareEndpointOutputSchemas,
} from './types';

/** POST /v2/customers/groups (CreateCustomerGroup). */
export const create: SquareEndpoints['customerGroupsCreate'] = async (
	ctx,
	rawInput,
) => {
	const input = SquareEndpointInputSchemas.customerGroupsCreate.parse(rawInput);
	return callSquare(ctx, '/v2/customers/groups', {
		method: 'POST',
		body: input,
		output: SquareEndpointOutputSchemas.customerGroupsCreate,
		event: 'customerGroups.create',
	});
};

/** DELETE /v2/customers/groups/{group_id} (DeleteCustomerGroup). */
export const remove: SquareEndpoints['customerGroupsDelete'] = async (
	ctx,
	rawInput,
) => {
	const input = SquareEndpointInputSchemas.customerGroupsDelete.parse(rawInput);
	return callSquare(ctx, '/v2/customers/groups/{group_id}', {
		method: 'DELETE',
		path: { group_id: input.group_id },
		output: SquareEndpointOutputSchemas.customerGroupsDelete,
		event: 'customerGroups.delete',
		logged: { group_id: input.group_id },
	});
};

/** GET /v2/customers/groups (ListCustomerGroups). */
export const list: SquareEndpoints['customerGroupsList'] = async (
	ctx,
	rawInput,
) => {
	const input = SquareEndpointInputSchemas.customerGroupsList.parse(
		rawInput ?? {},
	);
	return callSquare(ctx, '/v2/customers/groups', {
		query: input,
		output: SquareEndpointOutputSchemas.customerGroupsList,
		event: 'customerGroups.list',
	});
};

/** GET /v2/customers/groups/{group_id} (RetrieveCustomerGroup). */
export const get: SquareEndpoints['customerGroupsGet'] = async (
	ctx,
	rawInput,
) => {
	const input = SquareEndpointInputSchemas.customerGroupsGet.parse(rawInput);
	return callSquare(ctx, '/v2/customers/groups/{group_id}', {
		path: { group_id: input.group_id },
		output: SquareEndpointOutputSchemas.customerGroupsGet,
		event: 'customerGroups.get',
		logged: { group_id: input.group_id },
	});
};

/** PUT /v2/customers/groups/{group_id} (UpdateCustomerGroup). */
export const update: SquareEndpoints['customerGroupsUpdate'] = async (
	ctx,
	rawInput,
) => {
	const input = SquareEndpointInputSchemas.customerGroupsUpdate.parse(rawInput);
	const { group_id, ...body } = input;
	return callSquare(ctx, '/v2/customers/groups/{group_id}', {
		method: 'PUT',
		body,
		path: { group_id },
		output: SquareEndpointOutputSchemas.customerGroupsUpdate,
		event: 'customerGroups.update',
		logged: { group_id },
	});
};
