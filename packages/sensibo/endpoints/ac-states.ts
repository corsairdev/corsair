import type { CorsairEndpoint } from 'corsair/core';
import { pathPart } from '../client';
import type { SensiboContext } from '../context';
import { callSensibo, requireKey } from './shared';
import type {
	ListAcStatesInput,
	ListAcStatesResponse,
	SetAcStateInput,
	SetAcStatePropertyInput,
	SetAcStatePropertyResponse,
	SetAcStateResponse,
} from './types';
import {
	ListAcStatesInputSchema,
	ListAcStatesResponseSchema,
	SetAcStateInputSchema,
	SetAcStatePropertyInputSchema,
	SetAcStatePropertyResponseSchema,
	SetAcStateResponseSchema,
} from './types';

export const listAcStates: CorsairEndpoint<
	SensiboContext,
	ListAcStatesInput,
	ListAcStatesResponse
> = async (ctx, input) => {
	requireKey(ctx);
	const parsed = ListAcStatesInputSchema.parse(input);
	return callSensibo(
		ctx,
		'acStates.list',
		{
			path: `/pods/${pathPart(parsed.deviceId)}/acStates`,
			query: { limit: parsed.limit },
		},
		ListAcStatesResponseSchema,
		{ deviceId: parsed.deviceId },
	);
};

export const setAcState: CorsairEndpoint<
	SensiboContext,
	SetAcStateInput,
	SetAcStateResponse
> = async (ctx, input) => {
	requireKey(ctx);
	const parsed = SetAcStateInputSchema.parse(input);
	return callSensibo(
		ctx,
		'acStates.set',
		{
			method: 'POST',
			path: `/pods/${pathPart(parsed.deviceId)}/acStates`,
			body: { acState: parsed.acState },
		},
		SetAcStateResponseSchema,
		{ deviceId: parsed.deviceId },
	);
};

export const setAcStateProperty: CorsairEndpoint<
	SensiboContext,
	SetAcStatePropertyInput,
	SetAcStatePropertyResponse
> = async (ctx, input) => {
	requireKey(ctx);
	const parsed = SetAcStatePropertyInputSchema.parse(input);
	return callSensibo(
		ctx,
		'acStates.setProperty',
		{
			method: 'PATCH',
			path: `/pods/${pathPart(parsed.deviceId)}/acStates/${pathPart(parsed.property)}`,
			body: {
				newValue: parsed.newValue,
				...(parsed.currentAcState
					? { currentAcState: parsed.currentAcState }
					: {}),
			},
		},
		SetAcStatePropertyResponseSchema,
		{ deviceId: parsed.deviceId, property: parsed.property },
	);
};

export const AcStates = {
	list: listAcStates,
	set: setAcState,
	setProperty: setAcStateProperty,
};
