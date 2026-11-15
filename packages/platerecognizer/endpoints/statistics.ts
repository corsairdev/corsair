import type { CorsairEndpoint } from 'corsair/core';
import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { plateGet } from '../client';
import type { PlateRecognizerContext } from '../context';
import { PlateRecognizerUsageEntity } from '../schema/database';
import type { GetStatisticsInput, GetStatisticsResponse } from './types';
import { GetStatisticsInputSchema, GetStatisticsResponseSchema } from './types';

export const getStatistics: CorsairEndpoint<
	PlateRecognizerContext,
	GetStatisticsInput,
	GetStatisticsResponse
> = async (ctx, input) => {
	if (!ctx.key) {
		throw new AuthMissingError('platerecognizer', 'api_key');
	}
	GetStatisticsInputSchema.parse(input ?? {});
	const body = await plateGet<unknown>(ctx.key, '/v1/statistics/');
	const result = GetStatisticsResponseSchema.parse(body);
	await storeUsage(ctx, result);
	await logEventFromContext(ctx, 'platerecognizer.usage.get', {}, 'completed');
	return result;
};

async function storeUsage(
	ctx: PlateRecognizerContext,
	body: GetStatisticsResponse,
): Promise<void> {
	if (!ctx.db?.usage) return;
	const year = body.usage?.year;
	const month = body.usage?.month;
	const calls = body.usage?.calls;
	const resetsOn = body.usage?.resets_on;
	const totalCalls = body.total_calls;
	if (
		year === undefined ||
		month === undefined ||
		calls === undefined ||
		resetsOn === undefined ||
		totalCalls === undefined
	) {
		return;
	}
	const row = PlateRecognizerUsageEntity.safeParse({
		id: `${year}-${String(month).padStart(2, '0')}`,
		year,
		month,
		calls,
		resetsOn,
		totalCalls,
	});
	if (!row.success) return;
	try {
		await ctx.db.usage.upsertByEntityId(row.data.id, row.data);
	} catch {
		console.warn('Failed to save Plate Recognizer usage');
	}
}
