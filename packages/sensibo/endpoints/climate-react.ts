import type { CorsairEndpoint } from 'corsair/core';
import { pathPart } from '../client';
import type { SensiboContext } from '../context';
import { callSensibo, requireKey } from './shared';
import type {
	ConfigureClimateReactInput,
	ConfigureClimateReactResponse,
	GetClimateReactInput,
	GetClimateReactResponse,
	SetClimateReactEnabledInput,
	SetClimateReactEnabledResponse,
} from './types';
import {
	ConfigureClimateReactInputSchema,
	ConfigureClimateReactResponseSchema,
	GetClimateReactInputSchema,
	GetClimateReactResponseSchema,
	SetClimateReactEnabledInputSchema,
	SetClimateReactEnabledResponseSchema,
} from './types';

export const getClimateReact: CorsairEndpoint<
	SensiboContext,
	GetClimateReactInput,
	GetClimateReactResponse
> = async (ctx, input) => {
	requireKey(ctx);
	const parsed = GetClimateReactInputSchema.parse(input);
	return callSensibo(
		ctx,
		'climateReact.get',
		{ path: `/pods/${pathPart(parsed.deviceId)}/smartmode` },
		GetClimateReactResponseSchema,
		{ deviceId: parsed.deviceId },
	);
};

export const setClimateReactEnabled: CorsairEndpoint<
	SensiboContext,
	SetClimateReactEnabledInput,
	SetClimateReactEnabledResponse
> = async (ctx, input) => {
	requireKey(ctx);
	const parsed = SetClimateReactEnabledInputSchema.parse(input);
	return callSensibo(
		ctx,
		'climateReact.setEnabled',
		{
			method: 'PUT',
			path: `/pods/${pathPart(parsed.deviceId)}/smartmode`,
			body: { enabled: parsed.enabled },
		},
		SetClimateReactEnabledResponseSchema,
		{ deviceId: parsed.deviceId },
	);
};

export const configureClimateReact: CorsairEndpoint<
	SensiboContext,
	ConfigureClimateReactInput,
	ConfigureClimateReactResponse
> = async (ctx, input) => {
	requireKey(ctx);
	const { deviceId, ...settings } =
		ConfigureClimateReactInputSchema.parse(input);
	return callSensibo(
		ctx,
		'climateReact.configure',
		{
			method: 'POST',
			path: `/pods/${pathPart(deviceId)}/smartmode`,
			body: settings,
		},
		ConfigureClimateReactResponseSchema,
		{ deviceId },
	);
};

export const ClimateReact = {
	get: getClimateReact,
	setEnabled: setClimateReactEnabled,
	configure: configureClimateReact,
};
