import { logEventFromContext } from 'corsair/core';
import type { ScrapeDoContext, ScrapeDoEndpoints } from '..';
import { makeScrapeDoRequest, parseJsonObject } from '../client';
import {
	ScrapeDoEndpointInputSchemas as Inputs,
	ScrapeDoEndpointOutputSchemas as Outputs,
	parseAccountInfo,
	RawAccountInfoSchema,
} from './types';

/**
 * `/info` is the one surface where a 2xx can mean failure: a bad token answers
 * HTTP 200 with `IsActive: false`. `parseAccountInfo` turns that into a throw,
 * and this endpoint runs before the output parse so the error is an account
 * problem rather than a schema mismatch.
 */
export const info: ScrapeDoEndpoints['accountInfo'] = async (ctx, rawInput) => {
	Inputs.accountInfo.parse(rawInput ?? {});
	const answer = await makeScrapeDoRequest(ctx.key, {
		kind: 'info',
		method: 'GET',
		path: '/info',
	});
	const raw = RawAccountInfoSchema.parse(parseJsonObject(answer.body));
	const result = Outputs.accountInfo.parse(parseAccountInfo(raw));
	await logEventFromContext(
		ctx,
		'scrapedo.account.info',
		{
			active: result.is_active,
			remainingMonthly: result.remaining_monthly_request,
		},
		'completed',
	);
	return result;
};

/**
 * The async API's own account view. It is a second account surface with its own
 * concurrency pool, so it is separate from `account.info` rather than merged.
 */
export const asyncInfo: ScrapeDoEndpoints['asyncAccount'] = async (
	ctx,
	rawInput,
) => {
	Inputs.asyncAccount.parse(rawInput ?? {});
	const answer = await makeScrapeDoRequest(ctx.key, {
		kind: 'async',
		method: 'GET',
		path: '/me',
	});
	const body = parseJsonObject(answer.body);
	const result = Outputs.asyncAccount.parse({
		total_concurrency: body.TotalConcurrency,
		free_concurrency: body.FreeConcurrency,
		active_jobs: body.ActiveJobs,
		// The provider spells this `AvaliableCredits`.
		available_credits: body.AvaliableCredits,
	});
	await logEventFromContext(
		ctx,
		'scrapedo.account.asyncInfo',
		{
			freeConcurrency: result.free_concurrency,
			credits: result.available_credits,
		},
		'completed',
	);
	return result;
};

export type { ScrapeDoContext };
