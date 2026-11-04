import { logEventFromContext } from 'corsair/core';
import { numberHeader, TinypngAPIError, tinifyRequest } from '../client';
import type { TinypngEndpoints } from '../index';
import {
	GetCompressionCountInputSchema,
	GetCompressionCountResponseSchema,
} from './types';

// Tinify has no usage endpoint. Its official clients validate a key with an
// empty POST /shrink, which fails with 400 "Input missing" without compressing,
// and read the month's count from the Compression-Count header. Like those
// clients, a 429 (monthly limit reached) still counts as a valid key.
export const getCompressionCount: TinypngEndpoints['getCompressionCount'] =
	async (ctx, input) => {
		GetCompressionCountInputSchema.parse(input);
		const response = await tinifyRequest(ctx.key, {
			method: 'POST',
			path: '/shrink',
			acceptStatuses: [400, 429],
		});
		const compressionCount = numberHeader(
			response.headers,
			'compression-count',
		);
		if (compressionCount === undefined) {
			throw new TinypngAPIError(
				'Tinify response did not include a Compression-Count header',
				response.status,
			);
		}
		const result = GetCompressionCountResponseSchema.parse({
			compressionCount,
		});
		try {
			const month = new Date().toISOString().slice(0, 7);
			await ctx.db?.usage?.upsertByEntityId(month, {
				id: month,
				compression_count: result.compressionCount,
			});
		} catch (error) {
			console.warn('Failed to save usage to database:', error);
		}
		await logEventFromContext(
			ctx,
			'tinypng.account.getCompressionCount',
			result,
			'completed',
		);
		return result;
	};
