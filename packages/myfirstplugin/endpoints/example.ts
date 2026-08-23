import { logEventFromContext } from 'corsair/core';
import type { MyFirstPluginEndpoints } from '..';
import { makeMyFirstPluginRequest } from '../client';
import type { MyFirstPluginEndpointOutputs } from './types';

export const get: MyFirstPluginEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeMyFirstPluginRequest<
		MyFirstPluginEndpointOutputs['exampleGet']
	>(`example/${input.id}`, ctx.key, { method: 'GET' });

	await logEventFromContext(
		ctx,
		'myfirstplugin.example.get',
		{ ...input },
		'completed',
	);
	return response;
};
