import { FILLOUT_INVALIDATE_URL, makeFilloutRequest } from '../client';
import type { FilloutFormsEndpoints } from '../index';

export const invalidateAccessToken: FilloutFormsEndpoints['invalidateAccessToken'] =
	async (_ctx, input) => {
		await makeFilloutRequest<Record<string, unknown>>('', input.token, {
			method: 'DELETE',
			baseUrl: FILLOUT_INVALIDATE_URL,
		});
		return {};
	};
