import type { TruveraEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	TruveraEndpointInputSchemas,
	TruveraEndpointOutputSchemas,
} from './types';

export const create: TruveraEndpoints['schemasCreate'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'schemas.create',
			input: TruveraEndpointInputSchemas.createSchema,
			output: TruveraEndpointOutputSchemas.createSchema,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: 'schemas',
			body: {
				name: parsed.name,
				...(parsed.description === undefined
					? {}
					: { description: parsed.description }),
				...(parsed.type === undefined ? {} : { type: parsed.type }),
				properties: parsed.properties,
				...(parsed.required === undefined ? {} : { required: parsed.required }),
				...(parsed.additional_properties === undefined
					? {}
					: { additionalProperties: parsed.additional_properties }),
			},
		}),
		{
			log: (parsed, result) => ({
				name: parsed.name,
				id: result.id ?? undefined,
			}),
		},
	);

export const list: TruveraEndpoints['schemasList'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'schemas.list',
			input: TruveraEndpointInputSchemas.listSchemas,
			output: TruveraEndpointOutputSchemas.listSchemas,
		},
		input,
		() => ({ method: 'GET', path: 'schemas' }),
		{ log: (_parsed, result) => ({ schemas: result.length }) },
	);

export const get: TruveraEndpoints['schemasGet'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'schemas.get',
			input: TruveraEndpointInputSchemas.getSchema,
			output: TruveraEndpointOutputSchemas.getSchema,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `schemas/${segment(parsed.schema_id)}`,
		}),
		{ log: (parsed) => ({ schema_id: parsed.schema_id }) },
	);

export const remove: TruveraEndpoints['schemasDelete'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'schemas.delete',
			input: TruveraEndpointInputSchemas.deleteSchema,
			output: TruveraEndpointOutputSchemas.deleteSchema,
		},
		input,
		(parsed) => ({
			method: 'DELETE',
			path: `schemas/${segment(parsed.schema_id)}`,
		}),
		{ log: (parsed) => ({ schema_id: parsed.schema_id }) },
	);
