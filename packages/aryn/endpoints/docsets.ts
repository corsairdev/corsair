import { logEventFromContext } from 'corsair/core';
import type { ArynEndpoints } from '..';
import { makeArynRequest } from '../client';
import { ArynEndpointInputSchemas, ArynEndpointOutputSchemas } from './types';

export const docsetCreate: ArynEndpoints['docsetCreate'] = async (
	ctx,
	input,
) => {
	const parsed = ArynEndpointInputSchemas.docsetCreate.parse(input);
	const response = await makeArynRequest<unknown>(
		'/v1/storage/docsets',
		ctx.key,
		{
			method: 'POST',
			body: {
				name: parsed.name,
				schema: parsed.schema,
				properties: parsed.properties,
				prompts: parsed.prompts,
			},
		},
	);
	const output = ArynEndpointOutputSchemas.docsetCreate.parse(response ?? {});
	await logEventFromContext(
		ctx,
		'aryn.docset.create',
		{ name: parsed.name },
		'completed',
	);
	return output;
};

export const docsetGet: ArynEndpoints['docsetGet'] = async (ctx, input) => {
	const parsed = ArynEndpointInputSchemas.docsetGet.parse(input);
	const response = await makeArynRequest<unknown>(
		`/v1/storage/docsets/${encodeURIComponent(parsed.docset_id)}`,
		ctx.key,
		{
			method: 'GET',
		},
	);
	const output = ArynEndpointOutputSchemas.docsetGet.parse(response ?? {});
	await logEventFromContext(
		ctx,
		'aryn.docset.get',
		{ docset_id: parsed.docset_id },
		'completed',
	);
	return output;
};

export const docsetDelete: ArynEndpoints['docsetDelete'] = async (
	ctx,
	input,
) => {
	const parsed = ArynEndpointInputSchemas.docsetDelete.parse(input);
	const response = await makeArynRequest<unknown>(
		`/v1/storage/docsets/${encodeURIComponent(parsed.docset_id)}`,
		ctx.key,
		{
			method: 'DELETE',
		},
	);
	const output = ArynEndpointOutputSchemas.docsetDelete.parse(response ?? {});
	await logEventFromContext(
		ctx,
		'aryn.docset.delete',
		{ docset_id: parsed.docset_id },
		'completed',
	);
	return output;
};
