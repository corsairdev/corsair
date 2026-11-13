import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { FireberryEndpoints } from '..';
import { makeFireberryRequest } from '../client';
import { FireberryEndpointOutputSchemas } from './types';

const recordPath = (object: string, id?: string): string =>
	`/api/record/${encodeURIComponent(object)}${id === undefined ? '' : `/${encodeURIComponent(id)}`}`;

async function validatedRequest<S extends z.ZodType>(
	schema: S,
	path: string,
	key: string,
	options: Parameters<typeof makeFireberryRequest>[2] = {},
): Promise<z.output<S>> {
	// `unknown` because provider response JSON is untrusted until parsed by the operation schema.
	const response: unknown = await makeFireberryRequest<unknown>(
		path,
		key,
		options,
	);
	return schema.parse(response);
}

export const list: FireberryEndpoints['list'] = async (ctx, input) => {
	const result = await validatedRequest(
		FireberryEndpointOutputSchemas.list,
		recordPath(input.object),
		ctx.key,
		{
			query: { pagesize: input.pageSize, pagenumber: input.pageNumber },
		},
	);
	await logEventFromContext(
		ctx,
		'fireberry.records.list',
		{ completed: true },
		'completed',
	);
	return result;
};

export const get: FireberryEndpoints['get'] = async (ctx, input) => {
	const result = await validatedRequest(
		FireberryEndpointOutputSchemas.get,
		recordPath(input.object, input.id),
		ctx.key,
	);
	await logEventFromContext(
		ctx,
		'fireberry.records.get',
		{ completed: true },
		'completed',
	);
	return result;
};

export const create: FireberryEndpoints['create'] = async (ctx, input) => {
	const result = await validatedRequest(
		FireberryEndpointOutputSchemas.create,
		recordPath(input.object),
		ctx.key,
		{
			method: 'POST',
			body: input.data,
		},
	);
	await logEventFromContext(
		ctx,
		'fireberry.records.create',
		{ completed: true },
		'completed',
	);
	return result;
};

export const update: FireberryEndpoints['update'] = async (ctx, input) => {
	const result = await validatedRequest(
		FireberryEndpointOutputSchemas.update,
		recordPath(input.object, input.id),
		ctx.key,
		{
			method: 'PUT',
			body: input.data,
		},
	);
	await logEventFromContext(
		ctx,
		'fireberry.records.update',
		{ completed: true },
		'completed',
	);
	return result;
};

export const remove: FireberryEndpoints['delete'] = async (ctx, input) => {
	const result = await validatedRequest(
		FireberryEndpointOutputSchemas.delete,
		recordPath(input.object, input.id),
		ctx.key,
		{
			method: 'DELETE',
		},
	);
	await logEventFromContext(
		ctx,
		'fireberry.records.delete',
		{ completed: true },
		'completed',
	);
	return result;
};

export const query: FireberryEndpoints['query'] = async (ctx, input) => {
	const result = await validatedRequest(
		FireberryEndpointOutputSchemas.query,
		'/api/v3/query',
		ctx.key,
		{
			method: 'POST',
			body: { ...input },
		},
	);
	await logEventFromContext(
		ctx,
		'fireberry.query.search',
		{ completed: true },
		'completed',
	);
	return result;
};

export const objects: FireberryEndpoints['objects'] = async (ctx) => {
	const result = await validatedRequest(
		FireberryEndpointOutputSchemas.objects,
		'/metadata/records',
		ctx.key,
		{
			metadata: true,
		},
	);
	await logEventFromContext(
		ctx,
		'fireberry.metadata.objects',
		{ completed: true },
		'completed',
	);
	return result;
};

export const object: FireberryEndpoints['object'] = async (ctx, input) => {
	const result = await validatedRequest(
		FireberryEndpointOutputSchemas.object,
		`/metadata/records/${input.id}`,
		ctx.key,
		{
			metadata: true,
		},
	);
	await logEventFromContext(
		ctx,
		'fireberry.metadata.object',
		{ completed: true },
		'completed',
	);
	return result;
};

export const fields: FireberryEndpoints['fields'] = async (ctx, input) => {
	const result = await validatedRequest(
		FireberryEndpointOutputSchemas.fields,
		`/metadata/records/${input.id}/fields`,
		ctx.key,
		{
			metadata: true,
		},
	);
	await logEventFromContext(
		ctx,
		'fireberry.metadata.fields',
		{ completed: true },
		'completed',
	);
	return result;
};

export const field: FireberryEndpoints['field'] = async (ctx, input) => {
	const path = `/metadata/records/${input.id}/fields/${encodeURIComponent(input.fieldName)}`;
	const result = await validatedRequest(
		FireberryEndpointOutputSchemas.field,
		path,
		ctx.key,
		{ metadata: true },
	);
	await logEventFromContext(
		ctx,
		'fireberry.metadata.field',
		{ completed: true },
		'completed',
	);
	return result;
};

export const picklist: FireberryEndpoints['picklist'] = async (ctx, input) => {
	const path = `/metadata/records/${input.id}/fields/${encodeURIComponent(input.fieldName)}/values`;
	const result = await validatedRequest(
		FireberryEndpointOutputSchemas.picklist,
		path,
		ctx.key,
		{ metadata: true },
	);
	await logEventFromContext(
		ctx,
		'fireberry.metadata.picklist',
		{ completed: true },
		'completed',
	);
	return result;
};

export const batchCreate: FireberryEndpoints['batchCreate'] = async (
	ctx,
	input,
) => {
	const path = `/api/v3/record/${encodeURIComponent(input.objectCode)}/batch/create`;
	const result = await validatedRequest(
		FireberryEndpointOutputSchemas.batchCreate,
		path,
		ctx.key,
		{
			method: 'POST',
			body: { data: input.data },
		},
	);
	await logEventFromContext(
		ctx,
		'fireberry.batch.create',
		{ count: input.data.length },
		'completed',
	);
	return result;
};

export const batchUpdate: FireberryEndpoints['batchUpdate'] = async (
	ctx,
	input,
) => {
	const path = `/api/v3/record/${encodeURIComponent(input.objectCode)}/batch/update`;
	const result = await validatedRequest(
		FireberryEndpointOutputSchemas.batchUpdate,
		path,
		ctx.key,
		{
			method: 'POST',
			body: { data: input.data },
		},
	);
	await logEventFromContext(
		ctx,
		'fireberry.batch.update',
		{ count: input.data.length },
		'completed',
	);
	return result;
};

export const batchDelete: FireberryEndpoints['batchDelete'] = async (
	ctx,
	input,
) => {
	const path = `/api/v3/record/${encodeURIComponent(input.objectCode)}/batch/delete`;
	const result = await validatedRequest(
		FireberryEndpointOutputSchemas.batchDelete,
		path,
		ctx.key,
		{
			method: 'POST',
			body: { data: input.ids },
		},
	);
	await logEventFromContext(
		ctx,
		'fireberry.batch.delete',
		{ count: input.ids.length },
		'completed',
	);
	return result;
};

export const Records = { list, get, create, update, delete: remove, query };
export const Metadata = { objects, object, fields, field, picklist };
export const Batch = {
	create: batchCreate,
	update: batchUpdate,
	delete: batchDelete,
};

export * from './types';
