import { logEventFromContext } from 'corsair/core';
import { makeWebvizioRequest } from '../client';
import type { WebvizioEndpoints } from '../index';
import { WebvizioEndpointOutputSchemas } from './types';

export const list: WebvizioEndpoints['projectsList'] = async (ctx, input) => {
	const result = await makeWebvizioRequest<unknown>('/projects', ctx.key);

	const parsed = WebvizioEndpointOutputSchemas.projectsList.parse(result);

	await logEventFromContext(
		ctx,
		'webvizio.projects.list',
		{ ...input },
		'completed',
	);

	return parsed;
};
