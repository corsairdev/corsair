import { logEventFromContext } from 'corsair/core';
import type { CollegeFootballDataEndpoints } from '../index';
import { collegeFootballDataCall } from './shared';
import type { CollegeFootballDataUserInfo } from './types';

/**
 * Gets the authenticated user's subscription tier and remaining API calls.
 *
 * Live-captured 2026-08-17: the free tier is a **monthly** call quota
 * (`monthlyLimit`/`remainingCalls`/`usedCalls`/`resetAt`), not a per-minute
 * rate limit - `features` also confirms `scoreboard`/`livePlayByPlay` are
 * paid-tier gated, neither of which this catalog uses.
 * Callers should treat this operation as the way to check remaining budget
 * before a heavy batch of calls, not just a status check.
 */
export const getUserInfo: CollegeFootballDataEndpoints['accountGetUserInfo'] =
	async (ctx) => {
		const result = await collegeFootballDataCall<CollegeFootballDataUserInfo>(
			ctx,
			'/info',
		);

		await logEventFromContext(
			ctx,
			'collegefootballdata.account.getUserInfo',
			{},
			'completed',
		);
		return result;
	};
