import { logEventFromContext } from 'corsair/core';
import type { BetterstackEndpoints } from '../index';

/**
 * Better Stack exposes no endpoint that returns the configured token - nine
 * candidate paths were probed live on 2026-08-16 and every one answered 404.
 *
 * This reports that a token is configured, without disclosing it. Returning the
 * secret would place a live credential in tool output, audit rows and model
 * context.
 */
export const describe_: BetterstackEndpoints['tokenDescribe'] = async (ctx) => {
	const token = ctx.key ?? '';
	const result = {
		configured: token.length > 0,
		token_length: token.length,
		token_suffix: token.length >= 4 ? `...${token.slice(-4)}` : '',
		scope: 'uptime',
	};

	await logEventFromContext(
		ctx,
		'betterstack.token.describe',
		{ configured: result.configured },
		'completed',
	);
	return result;
};
