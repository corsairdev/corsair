import { logEventFromContext } from 'corsair/core';
import type { UploadcareEndpoints } from '..';
import { makeUploadcareRequest } from '../client';
import type { UploadcareProject } from './types';

export const get: UploadcareEndpoints['projectGet'] = async (ctx, input) => {
	const response = await makeUploadcareRequest<UploadcareProject>('project/', ctx.key, {
		method: 'GET',
	});
	await logEventFromContext(ctx, 'uploadcare.project.get', { ...input }, 'completed');
	return response;
};
