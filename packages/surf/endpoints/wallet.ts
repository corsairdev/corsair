import type { SurfContext } from '../index';
import { callSurf } from './call';
import type { SurfEndpointInputs } from './types';
import {
	SurfResponse,
	WalletDetailInput,
	WalletHistoryInput,
	WalletLabelsBatchInput,
	WalletNetWorthInput,
	WalletProtocolsInput,
	WalletTransfersInput,
} from './types';

export const Wallet = {
	detail: (ctx: SurfContext, input: SurfEndpointInputs['walletDetail']) =>
		callSurf(
			ctx,
			'wallet.detail',
			WalletDetailInput,
			SurfResponse,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/wallet/detail',
				query: omitEmpty({
					address: validated.address,
					chain: validated.chain,
					fields: validated.fields,
				}),
			}),
			(validated) => ({ address: String(validated.address ?? '') }),
		),
	history: (ctx: SurfContext, input: SurfEndpointInputs['walletHistory']) =>
		callSurf(
			ctx,
			'wallet.history',
			WalletHistoryInput,
			SurfResponse,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/wallet/history',
				query: omitEmpty({
					address: validated.address,
					chain: validated.chain,
					limit: validated.limit,
					offset: validated.offset,
					before: validated.before,
					sort_by: validated.sort_by,
					order: validated.order,
					include: validated.include,
				}),
			}),
			(validated) => ({ address: String(validated.address ?? '') }),
		),
	labelsBatch: (
		ctx: SurfContext,
		input: SurfEndpointInputs['walletLabelsBatch'],
	) =>
		callSurf(
			ctx,
			'wallet.labelsBatch',
			WalletLabelsBatchInput,
			SurfResponse,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/wallet/labels/batch',
				query: omitEmpty({ addresses: validated.addresses }),
			}),
			(validated) => ({ addresses: String(validated.addresses ?? '') }),
		),
	netWorth: (ctx: SurfContext, input: SurfEndpointInputs['walletNetWorth']) =>
		callSurf(
			ctx,
			'wallet.netWorth',
			WalletNetWorthInput,
			SurfResponse,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/wallet/net-worth',
				query: omitEmpty({ address: validated.address }),
			}),
			(validated) => ({ address: String(validated.address ?? '') }),
		),
	protocols: (ctx: SurfContext, input: SurfEndpointInputs['walletProtocols']) =>
		callSurf(
			ctx,
			'wallet.protocols',
			WalletProtocolsInput,
			SurfResponse,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/wallet/protocols',
				query: omitEmpty({
					address: validated.address,
					limit: validated.limit,
					offset: validated.offset,
				}),
			}),
			(validated) => ({ address: String(validated.address ?? '') }),
		),
	transfers: (ctx: SurfContext, input: SurfEndpointInputs['walletTransfers']) =>
		callSurf(
			ctx,
			'wallet.transfers',
			WalletTransfersInput,
			SurfResponse,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/wallet/transfers',
				query: omitEmpty({
					address: validated.address,
					chain: validated.chain,
					flow: validated.flow,
					token: validated.token,
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
