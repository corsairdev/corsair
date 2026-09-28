import { AuthMissingError } from 'corsair/core';

type CoinbaseEndpointCtx = {
	key?: string;
	authType?: 'api_key' | 'oauth_2';
};

export function requireCoinbaseEndpointKey(ctx: CoinbaseEndpointCtx): string {
	if (ctx.key) {
		return ctx.key;
	}

	throw new AuthMissingError('coinbase', ctx.authType ?? 'api_key');
}
