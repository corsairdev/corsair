import { logEventFromContext } from 'corsair/core';
import {
	makeOcrSpacePostRequest,
	OCRSPACE_MYAPI_BASE,
	OcrSpaceAPIError,
} from '../client';
import type { OcrSpaceEndpoints } from '../index';
import type { ConversionsResponse } from './types';
import { ConversionsInputSchema, ConversionsResponseSchema } from './types';

// Current-month and last-month counters are different data, so each period
// gets its own cached row rather than overwriting a single one.
const CURRENT_PERIOD = 'currentMonth';

/**
 * Conversion counters for the current month, refreshed by the provider once a
 * day, so the figures run to the end of yesterday rather than to now.
 */
export const conversions: OcrSpaceEndpoints['conversions'] = async (
	ctx,
	input,
) => {
	// endpointSchemas are metadata for introspection and are not applied by the
	// framework, so inputs are validated here.
	const validatedInput = ConversionsInputSchema.parse(input);

	const formData: Record<string, unknown> = {};
	if (validatedInput.startDate !== undefined) {
		formData.startDate = validatedInput.startDate;
	}

	// Pinned to the statistics host on purpose, and not routed through
	// `ctx.options.baseUrl`: that option points at a PRO account's dedicated
	// *parse* endpoint, which does not serve /conversions. Statistics are on
	// the same host for free and paid accounts.
	const rawResponse = await makeOcrSpacePostRequest<ConversionsResponse>(
		'/conversions',
		ctx.key,
		{ formData, baseUrl: OCRSPACE_MYAPI_BASE },
	);

	// Validated against the declared output schema so callers never receive a
	// payload that violates the exported contract.
	const response = ConversionsResponseSchema.parse(rawResponse);

	// Every counter is optional and the schema is loose, so a body carrying no
	// statistics at all still parses. Without this guard a rejection returned
	// with HTTP 200 would be cached as a row of nulls and logged as completed.
	const hasCounters = [
		response.count_total,
		response.count_engine1,
		response.count_engine2,
		response.count_engine3,
	].some((counter) => typeof counter === 'number');

	if (!hasCounters) {
		throw new OcrSpaceAPIError(
			'OCR.space returned no conversion counters for this account',
			{ body: response },
		);
	}

	const period = validatedInput.startDate ?? CURRENT_PERIOD;

	try {
		await ctx.db.conversions.upsertByEntityId(period, {
			engine1: response.count_engine1 ?? null,
			engine2: response.count_engine2 ?? null,
			engine3: response.count_engine3 ?? null,
			total: response.count_total ?? null,
			period,
			updatedAt: new Date(),
		});
	} catch (error) {
		console.warn('[ocrspace] Failed to cache conversion statistics:', error);
	}

	await logEventFromContext(
		ctx,
		'ocrspace.account.conversions',
		{
			period,
			total: response.count_total ?? null,
		},
		'completed',
	);

	return response;
};
