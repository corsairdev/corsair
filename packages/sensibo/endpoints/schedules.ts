import type { CorsairEndpoint } from 'corsair/core';
import { pathPart } from '../client';
import type { SensiboContext } from '../context';
import { callSensibo, requireKey } from './shared';
import type {
	CreateScheduleInput,
	CreateScheduleResponse,
	DeleteScheduleInput,
	DeleteScheduleResponse,
	GetScheduleInput,
	GetScheduleResponse,
	ListSchedulesInput,
	ListSchedulesResponse,
	SetScheduleEnabledInput,
	SetScheduleEnabledResponse,
} from './types';
import {
	CreateScheduleInputSchema,
	CreateScheduleResponseSchema,
	DeleteScheduleInputSchema,
	DeleteScheduleResponseSchema,
	GetScheduleInputSchema,
	GetScheduleResponseSchema,
	ListSchedulesInputSchema,
	ListSchedulesResponseSchema,
	SetScheduleEnabledInputSchema,
	SetScheduleEnabledResponseSchema,
} from './types';

const schedulesPath = (deviceId: string) =>
	`/pods/${pathPart(deviceId)}/schedules/`;
const schedulePath = (deviceId: string, scheduleId: string) =>
	`${schedulesPath(deviceId)}${pathPart(scheduleId)}/`;

export const listSchedules: CorsairEndpoint<
	SensiboContext,
	ListSchedulesInput,
	ListSchedulesResponse
> = async (ctx, input) => {
	requireKey(ctx);
	const parsed = ListSchedulesInputSchema.parse(input);
	return callSensibo(
		ctx,
		'schedules.list',
		{ version: 'v1', path: schedulesPath(parsed.deviceId) },
		ListSchedulesResponseSchema,
		{ deviceId: parsed.deviceId },
	);
};

export const getSchedule: CorsairEndpoint<
	SensiboContext,
	GetScheduleInput,
	GetScheduleResponse
> = async (ctx, input) => {
	requireKey(ctx);
	const parsed = GetScheduleInputSchema.parse(input);
	return callSensibo(
		ctx,
		'schedules.get',
		{ version: 'v1', path: schedulePath(parsed.deviceId, parsed.scheduleId) },
		GetScheduleResponseSchema,
		{ deviceId: parsed.deviceId, scheduleId: parsed.scheduleId },
	);
};

export const createSchedule: CorsairEndpoint<
	SensiboContext,
	CreateScheduleInput,
	CreateScheduleResponse
> = async (ctx, input) => {
	requireKey(ctx);
	const { deviceId, ...schedule } = CreateScheduleInputSchema.parse(input);
	return callSensibo(
		ctx,
		'schedules.create',
		{
			method: 'POST',
			version: 'v1',
			path: schedulesPath(deviceId),
			body: schedule,
		},
		CreateScheduleResponseSchema,
		{ deviceId },
	);
};

export const setScheduleEnabled: CorsairEndpoint<
	SensiboContext,
	SetScheduleEnabledInput,
	SetScheduleEnabledResponse
> = async (ctx, input) => {
	requireKey(ctx);
	const parsed = SetScheduleEnabledInputSchema.parse(input);
	return callSensibo(
		ctx,
		'schedules.setEnabled',
		{
			method: 'PUT',
			version: 'v1',
			path: schedulePath(parsed.deviceId, parsed.scheduleId),
			body: { isEnabled: parsed.isEnabled },
		},
		SetScheduleEnabledResponseSchema,
		{ deviceId: parsed.deviceId, scheduleId: parsed.scheduleId },
	);
};

export const deleteSchedule: CorsairEndpoint<
	SensiboContext,
	DeleteScheduleInput,
	DeleteScheduleResponse
> = async (ctx, input) => {
	requireKey(ctx);
	const parsed = DeleteScheduleInputSchema.parse(input);
	return callSensibo(
		ctx,
		'schedules.delete',
		{
			method: 'DELETE',
			version: 'v1',
			path: schedulePath(parsed.deviceId, parsed.scheduleId),
		},
		DeleteScheduleResponseSchema,
		{ deviceId: parsed.deviceId, scheduleId: parsed.scheduleId },
	);
};

export const Schedules = {
	list: listSchedules,
	get: getSchedule,
	create: createSchedule,
	setEnabled: setScheduleEnabled,
	delete: deleteSchedule,
};
