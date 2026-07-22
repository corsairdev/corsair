import { logEventFromContext } from 'corsair/core';
import { makeHashnodeRequest } from '../client';
import { redactEventPayload } from '../event-payload';
import type { HashnodeEndpoints } from '../index';
import type { HashnodeEndpointOutputs } from './types';
import { CREATE_IMAGE_UPLOAD_URL_MUTATION } from './types';

export const createImageUploadURL: HashnodeEndpoints['createImageUploadURL'] =
	async (ctx, input) => {
		const response = await makeHashnodeRequest<
			HashnodeEndpointOutputs['createImageUploadURL']
		>(CREATE_IMAGE_UPLOAD_URL_MUTATION, ctx.key, { input });

		await logEventFromContext(
			ctx,
			'hashnode.createImageUploadURL',
			redactEventPayload(input as Record<string, unknown>),
			'completed',
		);
		return response;
	};
