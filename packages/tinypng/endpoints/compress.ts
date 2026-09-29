import { logEventFromContext } from 'corsair/core';

import type { TinypngContext } from '..';
import { compressImageFromUrl } from '../client';
import type { CompressInput, CompressResponse } from './types';

export const compress = async (
	ctx: TinypngContext,
	input: CompressInput,
): Promise<CompressResponse> => {
	const response = await compressImageFromUrl(input.url, ctx.key);

	const result: CompressResponse = {
		originalUrl: input.url,
		optimizedUrl: response.url,
	};

	await logEventFromContext(ctx, 'tinypng.image.compress', result, 'completed');

	return result;
};
