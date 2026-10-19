import type { SurfContext } from '../index';
import { callSurf } from './call';
import type { SurfEndpointInputs } from './types';
import { PortfolioWalletsInput, SurfResponse } from './types';

export const Portfolio = {
	wallets: (ctx: SurfContext, input: SurfEndpointInputs['portfolioWallets']) =>
		callSurf(
			ctx,
			'portfolio.wallets',
			PortfolioWalletsInput,
			SurfResponse,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/portfolio/wallets',
			}),
			() => ({ call: 'ok' }),
		),
};

function omitEmpty<T extends Record<string, unknown>>(value: T): T {
	// Optional query and body fields are omitted. The helper is generic over that object.
	const next = { ...value };
	for (const key of Object.keys(next)) {
		if (next[key] === undefined) delete next[key];
	}
	return next;
}
