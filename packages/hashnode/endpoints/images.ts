import { logEventFromContext } from 'corsair/core';
import { makeHashnodeRequest } from '../client';
import { redactEventPayload } from '../event-payload';
import type { HashnodeEndpoints } from '../index';
import {
	CREATE_IMAGE_UPLOAD_URL_MUTATION,
	HashnodeEndpointOutputSchemas,
} from './types';

export const createImageUploadURL: HashnodeEndpoints['createImageUploadURL'] =
	async (ctx, input) => {
		const response = await makeHashnodeRequest(
			CREATE_IMAGE_UPLOAD_URL_MUTATION,
			ctx.key,
			{ input },
			HashnodeEndpointOutputSchemas.createImageUploadURL,
		);

		await logEventFromContext(
			ctx,
			'hashnode.createImageUploadURL',
			redactEventPayload(input as Record<string, unknown>),
			'completed',
		);
		return response;
	};
