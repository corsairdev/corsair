import { FILLOUT_INVALIDATE_URL, makeFilloutRequest } from '../client';
import type { FilloutFormsEndpoints } from '../index';

export const invalidateAccessToken: FilloutFormsEndpoints['invalidateAccessToken'] =
	async (ctx, input) => {
		await makeFilloutRequest<Record<string, unknown>>('', input.accessToken, {
			method: 'DELETE',
			baseUrl: FILLOUT_INVALIDATE_URL,
			body: {},
		});

		return {};
	};
