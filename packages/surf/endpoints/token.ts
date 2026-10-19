import type { SurfContext } from '../index';
import { callSurf } from './call';
import type { SurfEndpointInputs } from './types';
import {
	SurfResponse,
	TokenDexTradesInput,
	TokenHoldersInput,
	TokenTokenomicsInput,
	TokenTransferCounterpartiesInput,
	TokenTransferStatsInput,
	TokenTransfersInput,
} from './types';

export const Token = {
	dexTrades: (ctx: SurfContext, input: SurfEndpointInputs['tokenDexTrades']) =>
		callSurf(
			ctx,
			'token.dexTrades',
			TokenDexTradesInput,
			SurfResponse,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/token/dex-trades',
				query: omitEmpty({
					address: validated.address,
					chain: validated.chain,
					limit: validated.limit,
					offset: validated.offset,
					include: validated.include,
				}),
			}),
			(validated) => ({ address: String(validated.address ?? '') }),
		),
	holders: (ctx: SurfContext, input: SurfEndpointInputs['tokenHolders']) =>
		callSurf(
			ctx,
			'token.holders',
			TokenHoldersInput,
			SurfResponse,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/token/holders',
				query: omitEmpty({
					address: validated.address,
					chain: validated.chain,
					limit: validated.limit,
					offset: validated.offset,
					include: validated.include,
				}),
			}),
			(validated) => ({ address: String(validated.address ?? '') }),
		),
	tokenomics: (
		ctx: SurfContext,
		input: SurfEndpointInputs['tokenTokenomics'],
	) =>
		callSurf(
			ctx,
			'token.tokenomics',
			TokenTokenomicsInput,
			SurfResponse,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/token/tokenomics',
				query: omitEmpty({
					id: validated.id,
					symbol: validated.symbol,
					from: validated.from,
					to: validated.to,
				}),
			}),
			(validated) => ({ id: String(validated.id ?? '') }),
		),
	transferCounterparties: (
		ctx: SurfContext,
		input: SurfEndpointInputs['tokenTransferCounterparties'],
	) =>
		callSurf(
			ctx,
			'token.transferCounterparties',
			TokenTransferCounterpartiesInput,
			SurfResponse,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/token/transfer-counterparties',
				query: omitEmpty({
					address: validated.address,
					chain: validated.chain,
					direction: validated.direction,
					metric: validated.metric,
					time_range: validated.time_range,
					limit: validated.limit,
					offset: validated.offset,
					include: validated.include,
					exclude_labels: validated.exclude_labels,
				}),
			}),
			(validated) => ({ address: String(validated.address ?? '') }),
		),
	transferStats: (
		ctx: SurfContext,
		input: SurfEndpointInputs['tokenTransferStats'],
	) =>
		callSurf(
			ctx,
			'token.transferStats',
			TokenTransferStatsInput,
			SurfResponse,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/token/transfer-stats',
				query: omitEmpty({
					address: validated.address,
					chain: validated.chain,
					time_range: validated.time_range,
					include: validated.include,
				}),
			}),
			(validated) => ({ address: String(validated.address ?? '') }),
		),
	transfers: (ctx: SurfContext, input: SurfEndpointInputs['tokenTransfers']) =>
		callSurf(
			ctx,
			'token.transfers',
			TokenTransfersInput,
			SurfResponse,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/token/transfers',
				query: omitEmpty({
					address: validated.address,
					chain: validated.chain,
					from: validated.from,
					to: validated.to,
					limit: validated.limit,
					offset: validated.offset,
					include: validated.include,
				}),
			}),
			(validated) => ({ address: String(validated.address ?? '') }),
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
