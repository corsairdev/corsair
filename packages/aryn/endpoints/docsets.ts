import { logEventFromContext } from 'corsair/core';
import type { ArynEndpoints } from '..';
import { makeArynRequest } from '../client';
import type { ArynEndpointOutputs } from './types';

export const docsetCreate: ArynEndpoints['docsetCreate'] = async (
	ctx,
	input,
) => {
	const response = await makeArynRequest<ArynEndpointOutputs['docsetCreate']>(
		'/v1/storage/docsets',
		ctx.key,
		{
			method: 'POST',
			body: {
				name: input.name,
				schema: input.schema,
				properties: input.properties,
				prompts: input.prompts,
			},
		},
	);

	await logEventFromContext(
		ctx,
		'aryn.docset.create',
		{ ...input },
		'completed',
	);
	return response;
};

export const docsetGet: ArynEndpoints['docsetGet'] = async (ctx, input) => {
	const response = await makeArynRequest<ArynEndpointOutputs['docsetGet']>(
		`/v1/storage/docsets/${input.docset_id}`,
		ctx.key,
		{
			method: 'GET',
		},
	);

	await logEventFromContext(ctx, 'aryn.docset.get', { ...input }, 'completed');
	return response;
};

export const docsetDelete: ArynEndpoints['docsetDelete'] = async (
	ctx,
	input,
) => {
	const response = await makeArynRequest<ArynEndpointOutputs['docsetDelete']>(
		`/v1/storage/docsets/${input.docset_id}`,
		ctx.key,
		{
			method: 'DELETE',
		},
	);

	await logEventFromContext(
		ctx,
		'aryn.docset.delete',
		{ ...input },
		'completed',
	);
	return response;
};
