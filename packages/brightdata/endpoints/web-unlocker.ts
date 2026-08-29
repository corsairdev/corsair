import { logEventFromContext } from 'corsair/core';
import { makeBrightDataRequest } from '../client';
import type { BrightDataEndpoints } from '../index';
import type {
	WebUnlockerGetAsyncResultOutput,
	WebUnlockerUnlockAsyncOutput,
	WebUnlockerUnlockOutput,
} from './types';

export const unlock: BrightDataEndpoints['webUnlockerUnlock'] = async (
	ctx,
	input,
) => {
	const result = await makeBrightDataRequest<WebUnlockerUnlockOutput>(
		'request',
		ctx.key,
		{
			method: 'POST',
			body: input,
		},
	);

	await logEventFromContext(
		ctx,
		'brightdata.webUnlocker.unlock',
		{ zone: input.zone, url: input.url },
		'completed',
	);

	return result;
};

export const unlockAsync: BrightDataEndpoints['webUnlockerUnlockAsync'] = async (
	ctx,
	input,
) => {
	const result = await makeBrightDataRequest<WebUnlockerUnlockAsyncOutput>(
		'unblocker/req',
		ctx.key,
		{
			method: 'POST',
			body: input,
		},
	);

	await logEventFromContext(
		ctx,
		'brightdata.webUnlocker.unlockAsync',
		{ zone: input.zone, url: input.url, response_id: result.response_id },
		'completed',
	);

	return result;
};

export const getAsyncResult: BrightDataEndpoints['webUnlockerGetAsyncResult'] =
	async (ctx, input) => {
		const result = await makeBrightDataRequest<WebUnlockerGetAsyncResultOutput>(
			'unblocker/get_result',
			ctx.key,
			{
				method: 'GET',
				query: { id: input.id },
			},
		);

		await logEventFromContext(
			ctx,
			'brightdata.webUnlocker.getAsyncResult',
			{ id: input.id },
			'completed',
		);

		return result;
	};
