import type { TextCortexEndpoints } from '..';
import { call } from './call';
import {
	BalanceInputSchema,
	BalanceResponseSchema,
	CapabilitiesInputSchema,
	CapabilitiesResponseSchema,
	ModelsListInputSchema,
	ModelsListResponseSchema,
} from './types';

export const modelsList: TextCortexEndpoints['modelsList'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'models.list',
			input: ModelsListInputSchema,
			output: ModelsListResponseSchema,
		},
		input,
		() => ({ method: 'GET', path: '/models' }),
	);
};

export const balanceGet: TextCortexEndpoints['balanceGet'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'balance.get',
			input: BalanceInputSchema,
			output: BalanceResponseSchema,
		},
		input,
		() => ({ method: 'GET', path: '/balance' }),
	);
};

export const capabilitiesGet: TextCortexEndpoints['capabilitiesGet'] = async (
	ctx,
	input,
) => {
	return call(
		ctx,
		{
			event: 'capabilities.get',
			input: CapabilitiesInputSchema,
			output: CapabilitiesResponseSchema,
		},
		input,
		() => ({ method: 'GET', path: '/capabilities' }),
	);
};
