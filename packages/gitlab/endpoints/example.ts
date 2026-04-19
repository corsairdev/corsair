import { logEventFromContext } from 'corsair/core';
import type { GitlabEndpoints } from '..';
import type { GitlabEndpointOutputs } from './types';
import { makeAuthenticatedGitlabRequest } from '../client';

export const get: GitlabEndpoints['exampleGet'] = async (ctx, _input) => {
	const response =
		await makeAuthenticatedGitlabRequest<GitlabEndpointOutputs['exampleGet']>(
			'/user',
			ctx,
			{ method: 'GET', baseUrl: ctx.options.baseUrl },
		);

	await logEventFromContext(ctx, 'gitlab.example.get', {}, 'completed');
	return response;
};
