import type { OutlookWebhooks } from '..';
import type { SubscriptionValidationPayload } from './types';

export const subscriptionValidation: OutlookWebhooks['subscriptionValidation'] =
	{
		match: (request) => {
			const body =
				typeof request.body === 'string'
					? (JSON.parse(request.body) as unknown)
					: request.body;
			// Match when body has validationToken (injected by route from query param)
			if (
				body !== null &&
				typeof body === 'object' &&
				'validationToken' in body &&
				typeof (body as Record<string, unknown>).validationToken === 'string'
			) {
				return true;
			}
			// Also match when body is empty and content-type is text/plain
			// (Microsoft sends an empty POST body; validationToken is only in the query string)
			const isEmpty =
				body === null ||
				body === undefined ||
				(typeof body === 'object' && Object.keys(body as object).length === 0);
			const contentType = request.headers['content-type'];
			return (
				isEmpty &&
				typeof contentType === 'string' &&
				contentType.includes('text/plain')
			);
		},

		handler: async (_ctx, request) => {
			const { validationToken } =
				request.payload as SubscriptionValidationPayload;

			if (!validationToken) {
				return { success: false, data: undefined };
			}

			return {
				success: true,
				returnToSender: { validationToken },
				data: { validationToken },
			};
		},
	};
