import { logEventFromContext } from 'corsair/core';
import type { WitAiEndpoints } from '..';
import { makeWitAiRequest } from '../client';
import type { WitAiEndpointOutputs } from './types';

export const listTraits: WitAiEndpoints['traitsListTraits'] = async (
	ctx,
	_input,
) => {
	const result = await makeWitAiRequest<
		WitAiEndpointOutputs['traitsListTraits']
	>('traits', ctx.key, { method: 'GET' });
	await logEventFromContext(ctx, 'witai.traits.listTraits', {}, 'completed');
	return result;
};

export const getTrait: WitAiEndpoints['traitsGetTrait'] = async (
	ctx,
	input,
) => {
	const result = await makeWitAiRequest<WitAiEndpointOutputs['traitsGetTrait']>(
		`traits/${input.trait}`,
		ctx.key,
		{ method: 'GET' },
	);
	await logEventFromContext(
		ctx,
		'witai.traits.getTrait',
		{ trait: input.trait },
		'completed',
	);
	return result;
};

export const createTrait: WitAiEndpoints['traitsCreateTrait'] = async (
	ctx,
	input,
) => {
	const { name, values } = input;
	const body: Record<string, unknown> = {
		name,
		...(values !== undefined ? { values } : {}),
	};
	const result = await makeWitAiRequest<
		WitAiEndpointOutputs['traitsCreateTrait']
	>('traits', ctx.key, {
		method: 'POST',
		body,
	});
	await logEventFromContext(
		ctx,
		'witai.traits.createTrait',
		{ name },
		'completed',
	);
	return result;
};

export const deleteTrait: WitAiEndpoints['traitsDeleteTrait'] = async (
	ctx,
	input,
) => {
	const result = await makeWitAiRequest<
		WitAiEndpointOutputs['traitsDeleteTrait']
	>(`traits/${input.trait}`, ctx.key, { method: 'DELETE' });
	await logEventFromContext(
		ctx,
		'witai.traits.deleteTrait',
		{ trait: input.trait },
		'completed',
	);
	return result;
};

export const addValue: WitAiEndpoints['traitsAddValue'] = async (
	ctx,
	input,
) => {
	const { trait, value } = input;
	const result = await makeWitAiRequest<WitAiEndpointOutputs['traitsAddValue']>(
		`traits/${trait}/values`,
		ctx.key,
		{
			method: 'POST',
			body: { value },
		},
	);
	await logEventFromContext(
		ctx,
		'witai.traits.addValue',
		{ trait, value },
		'completed',
	);
	return result;
};
