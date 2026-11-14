import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import {
	FireberryAPIError,
	makeFireberryRequest,
	makeFireberryUploadRequest,
} from '../client';
import type { FireberryEndpoints } from '../index';
import { getFireberryRecordPath } from './record-routes';
import {
	FireberryEndpointInputSchemas,
	FireberryEndpointOutputSchemas,
} from './types';

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
	FireberryEndpointInputSchemas.list.parse(input);
	const result = await validatedRequest(
		FireberryEndpointOutputSchemas.list,
		getFireberryRecordPath(input.object, 'list'),
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
	FireberryEndpointInputSchemas.get.parse(input);
	const result = await validatedRequest(
		FireberryEndpointOutputSchemas.get,
		getFireberryRecordPath(input.object, 'get', input.id),
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
	FireberryEndpointInputSchemas.create.parse(input);
	const result = await validatedRequest(
		FireberryEndpointOutputSchemas.create,
		getFireberryRecordPath(input.object, 'create'),
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
	FireberryEndpointInputSchemas.update.parse(input);
	const result = await validatedRequest(
		FireberryEndpointOutputSchemas.update,
		getFireberryRecordPath(input.object, 'update', input.id),
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
	FireberryEndpointInputSchemas.delete.parse(input);
	const result = await validatedRequest(
		FireberryEndpointOutputSchemas.delete,
		getFireberryRecordPath(input.object, 'delete', input.id),
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
	FireberryEndpointInputSchemas.query.parse(input);
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

export const legacyQuery: FireberryEndpoints['legacyQuery'] = async (
	ctx,
	input,
) => {
	FireberryEndpointInputSchemas.legacyQuery.parse(input);
	const result = await validatedRequest(
		FireberryEndpointOutputSchemas.legacyQuery,
		'/api/query',
		ctx.key,
		{ method: 'POST', body: { ...input } },
	);
	await logEventFromContext(
		ctx,
		'fireberry.query.legacy',
		{ completed: true },
		'completed',
	);
	return result;
};

export const related: FireberryEndpoints['related'] = async (ctx, input) => {
	FireberryEndpointInputSchemas.related.parse(input);
	const path = `/api/record/${input.objectType}/${encodeURIComponent(input.id)}/${input.relatedObjectType}`;
	const result = await validatedRequest(
		FireberryEndpointOutputSchemas.related,
		path,
		ctx.key,
		{
			query: { pagesize: input.pageSize, pagenumber: input.pageNumber },
		},
	);
	await logEventFromContext(
		ctx,
		'fireberry.records.related',
		{ completed: true },
		'completed',
	);
	return result;
};

export const items: FireberryEndpoints['items'] = async (ctx, input) => {
	FireberryEndpointInputSchemas.items.parse(input);
	const objectType =
		input.itemType === 'creditInvoice'
			? '85'
			: input.itemType === 'invoice'
				? '81'
				: input.itemType === 'order'
					? '13'
					: input.itemType === 'receipt'
						? '83'
						: '84';
	const collection =
		input.itemType === 'invoiceReceiptReceipts' || input.itemType === 'receipt'
			? 'receiptitems'
			: 'items';
	const path = `/api/v2/record/${objectType}/${encodeURIComponent(input.id)}/${collection}`;
	const result = await validatedRequest(
		FireberryEndpointOutputSchemas.items,
		path,
		ctx.key,
	);
	await logEventFromContext(
		ctx,
		'fireberry.records.items',
		{ completed: true },
		'completed',
	);
	return result;
};

export const objects: FireberryEndpoints['objects'] = async (ctx, input) => {
	FireberryEndpointInputSchemas.objects.parse(input);
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
	FireberryEndpointInputSchemas.object.parse(input);
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
	FireberryEndpointInputSchemas.fields.parse(input);
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
	FireberryEndpointInputSchemas.field.parse(input);
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
	FireberryEndpointInputSchemas.picklist.parse(input);
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

export const customFieldCreate: FireberryEndpoints['customFieldCreate'] =
	async (ctx, input) => {
		FireberryEndpointInputSchemas.customFieldCreate.parse(input);
		const path = `/api/v2/system-field/${input.objectType}/${input.fieldType}`;
		const result = await validatedRequest(
			FireberryEndpointOutputSchemas.customFieldCreate,
			path,
			ctx.key,
			{
				method: 'POST',
				body: { ...input.data },
			},
		);
		await logEventFromContext(
			ctx,
			'fireberry.customFields.create',
			{ fieldType: input.fieldType },
			'completed',
		);
		return result;
	};

export const customFieldUpdate: FireberryEndpoints['customFieldUpdate'] =
	async (ctx, input) => {
		FireberryEndpointInputSchemas.customFieldUpdate.parse(input);
		const fieldPath = encodeURIComponent(input.fieldName);
		const path = `/api/v2/system-field/${input.objectType}/${input.fieldType}/${fieldPath}`;
		const result = await validatedRequest(
			FireberryEndpointOutputSchemas.customFieldUpdate,
			path,
			ctx.key,
			{
				method: 'PUT',
				body: { ...input.data },
			},
		);
		await logEventFromContext(
			ctx,
			'fireberry.customFields.update',
			{ fieldType: input.fieldType },
			'completed',
		);
		return result;
	};

export const customFieldDelete: FireberryEndpoints['customFieldDelete'] =
	async (ctx, input) => {
		FireberryEndpointInputSchemas.customFieldDelete.parse(input);
		const path = `/api/v2/system-field/${input.objectType}/${input.fieldType}/${encodeURIComponent(input.fieldName)}`;
		const result = await validatedRequest(
			FireberryEndpointOutputSchemas.customFieldDelete,
			path,
			ctx.key,
			{
				method: 'DELETE',
			},
		);
		// Fireberry can answer 200 with { success: false } when the field was not removed.
		if (result.success === false) {
			throw new FireberryAPIError('Fireberry did not delete the field');
		}
		await logEventFromContext(
			ctx,
			'fireberry.customFields.delete',
			{ fieldType: input.fieldType },
			'completed',
		);
		return result;
	};

export const customObjectCreate: FireberryEndpoints['customObjectCreate'] =
	async (ctx, input) => {
		FireberryEndpointInputSchemas.customObjectCreate.parse(input);
		const result = await validatedRequest(
			FireberryEndpointOutputSchemas.customObjectCreate,
			'/api/v2/record/58',
			ctx.key,
			{
				method: 'POST',
				body: { name: input.name, collectionname: input.collectionname },
			},
		);
		await logEventFromContext(
			ctx,
			'fireberry.customObjects.create',
			{ completed: true },
			'completed',
		);
		return result;
	};

export const customObjectUpdate: FireberryEndpoints['customObjectUpdate'] =
	async (ctx, input) => {
		FireberryEndpointInputSchemas.customObjectUpdate.parse(input);
		const { id, ...data } = input;
		const result = await validatedRequest(
			FireberryEndpointOutputSchemas.customObjectUpdate,
			`/api/v2/record/58/${encodeURIComponent(id)}`,
			ctx.key,
			{
				method: 'PUT',
				body: data,
			},
		);
		await logEventFromContext(
			ctx,
			'fireberry.customObjects.update',
			{ completed: true },
			'completed',
		);
		return result;
	};

export const customObjectDelete: FireberryEndpoints['customObjectDelete'] =
	async (ctx, input) => {
		FireberryEndpointInputSchemas.customObjectDelete.parse(input);
		const result = await validatedRequest(
			FireberryEndpointOutputSchemas.customObjectDelete,
			`/api/record/58/${encodeURIComponent(input.id)}`,
			ctx.key,
			{
				method: 'DELETE',
			},
		);
		await logEventFromContext(
			ctx,
			'fireberry.customObjects.delete',
			{ completed: true },
			'completed',
		);
		return result;
	};

export const fileUpload: FireberryEndpoints['fileUpload'] = async (
	ctx,
	input,
) => {
	FireberryEndpointInputSchemas.fileUpload.parse(input);
	const result = FireberryEndpointOutputSchemas.fileUpload.parse(
		await makeFireberryUploadRequest(
			input.objectId,
			input.recordId,
			input.fileName,
			input.fileBase64,
			ctx.key,
		),
	);
	await logEventFromContext(
		ctx,
		'fireberry.files.create',
		{ completed: true },
		'completed',
	);
	return result;
};

export const batchCreate: FireberryEndpoints['batchCreate'] = async (
	ctx,
	input,
) => {
	FireberryEndpointInputSchemas.batchCreate.parse(input);
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
	FireberryEndpointInputSchemas.batchUpdate.parse(input);
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
	FireberryEndpointInputSchemas.batchDelete.parse(input);
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

export const Records = {
	list,
	get,
	create,
	update,
	delete: remove,
	query,
	legacyQuery,
	related,
	items,
};
export const Metadata = { objects, object, fields, field, picklist };
export const CustomFields = {
	create: customFieldCreate,
	update: customFieldUpdate,
	delete: customFieldDelete,
};
export const CustomObjects = {
	create: customObjectCreate,
	update: customObjectUpdate,
	delete: customObjectDelete,
};
export const Files = { create: fileUpload };
export const Batch = {
	create: batchCreate,
	update: batchUpdate,
	delete: batchDelete,
};

export * from './types';
