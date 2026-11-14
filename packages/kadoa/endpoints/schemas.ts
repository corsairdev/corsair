import type { KadoaEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	KadoaEndpointInputSchemas as Inputs,
	KadoaEndpointOutputSchemas as Outputs,
} from './types';

export const list: KadoaEndpoints['schemasList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'schemas.list',
			input: Inputs.schemasList,
			output: Outputs.schemasList,
		},
		input,
		() => ({ method: 'GET', path: '/v4/schemas/' }),
		{ log: (_, result) => ({ count: result.data.length }) },
	);

export const get: KadoaEndpoints['schemasGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'schemas.get',
			input: Inputs.schemasGet,
			output: Outputs.schemasGet,
		},
		input,
		({ schemaId }) => ({
			method: 'GET',
			path: `/v4/schemas/${segment(schemaId)}`,
		}),
		{ log: (_, result) => ({ schemaId: result.data.id }) },
	);

// A field reaches Kadoa in one of its two documented shapes, so only the keys
// that shape defines are sent: a SCHEMA field with a dataType, a
// CLASSIFICATION field with its categories. The input schema has already
// rejected the combinations the API refuses.
function fieldBody(field: {
	name: string;
	fieldType: 'SCHEMA' | 'CLASSIFICATION';
	description?: string | undefined;
	dataType?: string | undefined;
	isKey?: boolean | undefined;
	categories?: { title: string; definition: string }[] | undefined;
	mapper?: string | undefined;
	// unknown: mapperConfig is defined per mapper, with no closed shape.
	mapperConfig?: Record<string, unknown> | undefined;
}) {
	const common = {
		name: field.name,
		fieldType: field.fieldType,
		description: field.description,
	};
	if (field.fieldType === 'CLASSIFICATION') {
		return { ...common, categories: field.categories };
	}
	return {
		...common,
		dataType: field.dataType,
		isKey: field.isKey,
		mapper: field.mapper,
		mapperConfig: field.mapperConfig,
	};
}

// unknown: the body is built field by field from typed inputs, and the keys
// differ per shape; the output side is untyped until the request serializes it.
function dropUndefined(value: Record<string, unknown>) {
	return Object.fromEntries(
		Object.entries(value).filter(([, entry]) => entry !== undefined),
	);
}

export const create: KadoaEndpoints['schemasCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'schemas.create',
			input: Inputs.schemasCreate,
			output: Outputs.schemasCreate,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/v4/schemas/',
			body: dropUndefined({
				name: parsed.name,
				entity: parsed.entity,
				fields: parsed.fields.map((field) => dropUndefined(fieldBody(field))),
			}),
		}),
		{ log: (_, result) => ({ schemaId: result.schemaId }) },
	);

export const update: KadoaEndpoints['schemasUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'schemas.update',
			input: Inputs.schemasUpdate,
			output: Outputs.schemasUpdate,
		},
		input,
		({ schemaId, ...changes }) => ({
			method: 'PUT',
			path: `/v4/schemas/${segment(schemaId)}`,
			body: dropUndefined({
				name: changes.name,
				entity: changes.entity,
				fields: changes.fields?.map((field) => dropUndefined(fieldBody(field))),
			}),
		}),
		{ log: ({ schemaId }) => ({ schemaId }) },
	);

export const remove: KadoaEndpoints['schemasRemove'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'schemas.remove',
			input: Inputs.schemasRemove,
			output: Outputs.schemasRemove,
		},
		input,
		({ schemaId }) => ({
			method: 'DELETE',
			path: `/v4/schemas/${segment(schemaId)}`,
		}),
		{ log: ({ schemaId }) => ({ schemaId }) },
	);
