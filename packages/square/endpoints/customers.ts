import type { SquareEndpoints } from '../index';
import { callSquare } from './shared';
import {
	SquareEndpointInputSchemas,
	SquareEndpointOutputSchemas,
} from './types';

/** PUT /v2/customers/{customer_id}/groups/{group_id} (AddGroupToCustomer). */
export const addGroup: SquareEndpoints['customersAddGroup'] = async (
	ctx,
	rawInput,
) => {
	const input = SquareEndpointInputSchemas.customersAddGroup.parse(rawInput);
	return callSquare(ctx, '/v2/customers/{customer_id}/groups/{group_id}', {
		method: 'PUT',
		path: { customer_id: input.customer_id, group_id: input.group_id },
		output: SquareEndpointOutputSchemas.customersAddGroup,
		event: 'customers.addGroup',
		logged: { customer_id: input.customer_id, group_id: input.group_id },
	});
};

/** POST /v2/customers/bulk-delete (BulkDeleteCustomers). */
export const bulkDelete: SquareEndpoints['customersBulkDelete'] = async (
	ctx,
	rawInput,
) => {
	const input = SquareEndpointInputSchemas.customersBulkDelete.parse(rawInput);
	return callSquare(ctx, '/v2/customers/bulk-delete', {
		method: 'POST',
		body: input,
		output: SquareEndpointOutputSchemas.customersBulkDelete,
		event: 'customers.bulkDelete',
	});
};

/** POST /v2/customers/bulk-update (BulkUpdateCustomers). */
export const bulkUpdate: SquareEndpoints['customersBulkUpdate'] = async (
	ctx,
	rawInput,
) => {
	const input = SquareEndpointInputSchemas.customersBulkUpdate.parse(rawInput);
	return callSquare(ctx, '/v2/customers/bulk-update', {
		method: 'POST',
		body: input,
		output: SquareEndpointOutputSchemas.customersBulkUpdate,
		event: 'customers.bulkUpdate',
	});
};

/** POST /v2/customers/bulk-create (BulkCreateCustomers). */
export const bulkCreate: SquareEndpoints['customersBulkCreate'] = async (
	ctx,
	rawInput,
) => {
	const input = SquareEndpointInputSchemas.customersBulkCreate.parse(rawInput);
	return callSquare(ctx, '/v2/customers/bulk-create', {
		method: 'POST',
		body: input,
		output: SquareEndpointOutputSchemas.customersBulkCreate,
		event: 'customers.bulkCreate',
	});
};

/** POST /v2/customers (CreateCustomer). */
export const create: SquareEndpoints['customersCreate'] = async (
	ctx,
	rawInput,
) => {
	const input = SquareEndpointInputSchemas.customersCreate.parse(
		rawInput ?? {},
	);
	return callSquare(ctx, '/v2/customers', {
		method: 'POST',
		body: input,
		output: SquareEndpointOutputSchemas.customersCreate,
		event: 'customers.create',
	});
};

/** DELETE /v2/customers/{customer_id} (DeleteCustomer). */
export const remove: SquareEndpoints['customersDelete'] = async (
	ctx,
	rawInput,
) => {
	const input = SquareEndpointInputSchemas.customersDelete.parse(rawInput);
	const { customer_id, ...query } = input;
	return callSquare(ctx, '/v2/customers/{customer_id}', {
		method: 'DELETE',
		query,
		path: { customer_id },
		output: SquareEndpointOutputSchemas.customersDelete,
		event: 'customers.delete',
		logged: { customer_id },
	});
};

/** GET /v2/customers (ListCustomers). */
export const list: SquareEndpoints['customersList'] = async (ctx, rawInput) => {
	const input = SquareEndpointInputSchemas.customersList.parse(rawInput ?? {});
	return callSquare(ctx, '/v2/customers', {
		query: input,
		output: SquareEndpointOutputSchemas.customersList,
		event: 'customers.list',
	});
};

/** DELETE /v2/customers/{customer_id}/groups/{group_id} (RemoveGroupFromCustomer). */
export const removeGroup: SquareEndpoints['customersRemoveGroup'] = async (
	ctx,
	rawInput,
) => {
	// An HTTP DELETE, but classified write: customers.addGroup puts the customer
	// back in the group.
	const input = SquareEndpointInputSchemas.customersRemoveGroup.parse(rawInput);
	return callSquare(ctx, '/v2/customers/{customer_id}/groups/{group_id}', {
		method: 'DELETE',
		path: { customer_id: input.customer_id, group_id: input.group_id },
		output: SquareEndpointOutputSchemas.customersRemoveGroup,
		event: 'customers.removeGroup',
		logged: { customer_id: input.customer_id, group_id: input.group_id },
	});
};

/** POST /v2/customers/bulk-retrieve (BulkRetrieveCustomers). */
export const bulkGet: SquareEndpoints['customersBulkGet'] = async (
	ctx,
	rawInput,
) => {
	const input = SquareEndpointInputSchemas.customersBulkGet.parse(rawInput);
	return callSquare(ctx, '/v2/customers/bulk-retrieve', {
		method: 'POST',
		body: input,
		output: SquareEndpointOutputSchemas.customersBulkGet,
		event: 'customers.bulkGet',
	});
};

/** GET /v2/customers/{customer_id} (RetrieveCustomer). */
export const get: SquareEndpoints['customersGet'] = async (ctx, rawInput) => {
	const input = SquareEndpointInputSchemas.customersGet.parse(rawInput);
	return callSquare(ctx, '/v2/customers/{customer_id}', {
		path: { customer_id: input.customer_id },
		output: SquareEndpointOutputSchemas.customersGet,
		event: 'customers.get',
		logged: { customer_id: input.customer_id },
	});
};

/** POST /v2/customers/search (SearchCustomers). */
export const search: SquareEndpoints['customersSearch'] = async (
	ctx,
	rawInput,
) => {
	const input = SquareEndpointInputSchemas.customersSearch.parse(
		rawInput ?? {},
	);
	return callSquare(ctx, '/v2/customers/search', {
		method: 'POST',
		body: input,
		output: SquareEndpointOutputSchemas.customersSearch,
		event: 'customers.search',
	});
};

/** PUT /v2/customers/{customer_id} (UpdateCustomer). */
export const update: SquareEndpoints['customersUpdate'] = async (
	ctx,
	rawInput,
) => {
	const input = SquareEndpointInputSchemas.customersUpdate.parse(rawInput);
	const { customer_id, ...body } = input;
	return callSquare(ctx, '/v2/customers/{customer_id}', {
		method: 'PUT',
		body,
		path: { customer_id },
		output: SquareEndpointOutputSchemas.customersUpdate,
		event: 'customers.update',
		logged: { customer_id },
	});
};
