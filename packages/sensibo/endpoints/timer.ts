import type { CorsairEndpoint } from 'corsair/core';
import { pathPart } from '../client';
import type { SensiboContext } from '../context';
import { callSensibo, requireKey } from './shared';
import type {
	DeleteTimerInput,
	DeleteTimerResponse,
	GetTimerInput,
	GetTimerResponse,
	SetTimerInput,
	SetTimerResponse,
} from './types';
import {
	DeleteTimerInputSchema,
	DeleteTimerResponseSchema,
	GetTimerInputSchema,
	GetTimerResponseSchema,
	SetTimerInputSchema,
	SetTimerResponseSchema,
} from './types';

const timerPath = (deviceId: string) => `/pods/${pathPart(deviceId)}/timer/`;

export const getTimer: CorsairEndpoint<
	SensiboContext,
	GetTimerInput,
	GetTimerResponse
> = async (ctx, input) => {
	requireKey(ctx);
	const parsed = GetTimerInputSchema.parse(input);
	return callSensibo(
		ctx,
		'timer.get',
		{ version: 'v1', path: timerPath(parsed.deviceId) },
		GetTimerResponseSchema,
		{ deviceId: parsed.deviceId },
	);
};

export const setTimer: CorsairEndpoint<
	SensiboContext,
	SetTimerInput,
	SetTimerResponse
> = async (ctx, input) => {
	requireKey(ctx);
	const parsed = SetTimerInputSchema.parse(input);
	return callSensibo(
		ctx,
		'timer.set',
		{
			method: 'PUT',
			version: 'v1',
			path: timerPath(parsed.deviceId),
			body: { minutesFromNow: parsed.minutesFromNow, acState: parsed.acState },
		},
		SetTimerResponseSchema,
		{ deviceId: parsed.deviceId },
	);
};

export const deleteTimer: CorsairEndpoint<
	SensiboContext,
	DeleteTimerInput,
	DeleteTimerResponse
> = async (ctx, input) => {
	requireKey(ctx);
	const parsed = DeleteTimerInputSchema.parse(input);
	return callSensibo(
		ctx,
		'timer.delete',
		{ method: 'DELETE', version: 'v1', path: timerPath(parsed.deviceId) },
		DeleteTimerResponseSchema,
		{ deviceId: parsed.deviceId },
	);
};

export const Timer = { get: getTimer, set: setTimer, delete: deleteTimer };
