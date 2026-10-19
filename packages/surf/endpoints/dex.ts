import type { SurfContext } from '../index';
import { callSurf } from './call';
import type { SurfEndpointInputs } from './types';
import { DexTokenPriceInput, SurfResponse } from './types';

export const Dex = {
	tokenPrice: (ctx: SurfContext, input: SurfEndpointInputs['dexTokenPrice']) =>
		callSurf(
			ctx,
			'dex.tokenPrice',
			DexTokenPriceInput,
			SurfResponse,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/dex/token/price',
				query: omitEmpty({
					chain: validated.chain,
					address: validated.address,
					interval: validated.interval,
					time_range: validated.time_range,
					from: validated.from,
					to: validated.to,
				}),
			}),
			(validated) => ({ chain: String(validated.chain ?? '') }),
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
