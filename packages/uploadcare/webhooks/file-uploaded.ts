import { logEventFromContext } from 'corsair/core';
import type { UploadcareWebhooks } from '..';
import {
	createUploadcareMatch,
	verifyUploadcareWebhookSignature,
} from './types';

export const fileUploaded: UploadcareWebhooks['fileUploaded'] = {
	match: createUploadcareMatch('file.uploaded'),

	handler: async (ctx, request) => {
		const verification = verifyUploadcareWebhookSignature(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload;
		if (event.event !== 'file.uploaded') {
			return { success: true, data: undefined };
		}

		await logEventFromContext(
			ctx,
			'uploadcare.webhook.file_uploaded',
			{ ...event },
			'completed',
		);

		return { success: true, data: event };
	},
};
