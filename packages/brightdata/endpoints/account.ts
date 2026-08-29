import { logEventFromContext } from 'corsair/core';
import { makeBrightDataRequest } from '../client';
import type { BrightDataEndpoints } from '../index';
import type { AccountGetBalanceOutput, AccountListZonesOutput } from './types';

export const getBalance: BrightDataEndpoints['accountGetBalance'] = async (
	ctx,
	_input,
) => {
	const raw = await makeBrightDataRequest<
		| { balance?: number; currency?: string }
		| number
	>('customer/balance', ctx.key, {
		method: 'GET',
	});

	const result: AccountGetBalanceOutput =
		typeof raw === 'number'
			? { balance: raw }
			: typeof raw === 'object' && raw !== null
				? raw
				: {};

	await logEventFromContext(
		ctx,
		'brightdata.account.getBalance',
		{},
		'completed',
	);

	return result;
};

export const listZones: BrightDataEndpoints['accountListZones'] = async (
	ctx,
	_input,
) => {
	const raw = await makeBrightDataRequest<
		| Array<{ name: string; type?: string; plan?: string }>
		| { zones: Array<{ name: string; type?: string; plan?: string }> }
	>('zone', ctx.key, {
		method: 'GET',
	});

	const zones = Array.isArray(raw)
		? raw
		: Array.isArray(raw?.zones)
			? raw.zones
			: [];

	const result: AccountListZonesOutput = { zones };

	await logEventFromContext(
		ctx,
		'brightdata.account.listZones',
		{ count: zones.length },
		'completed',
	);

	return result;
};
