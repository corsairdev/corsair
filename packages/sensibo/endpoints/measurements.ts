import type { CorsairEndpoint } from 'corsair/core';
import { pathPart } from '../client';
import type { SensiboContext } from '../context';
import { callSensibo, requireKey } from './shared';
import type {
	GetHistoricalMeasurementsInput,
	GetHistoricalMeasurementsResponse,
	ListDeviceEventsInput,
	ListDeviceEventsResponse,
	ListDoorSensorEventsInput,
	ListDoorSensorEventsResponse,
} from './types';
import {
	GetHistoricalMeasurementsInputSchema,
	GetHistoricalMeasurementsResponseSchema,
	ListDeviceEventsInputSchema,
	ListDeviceEventsResponseSchema,
	ListDoorSensorEventsInputSchema,
	ListDoorSensorEventsResponseSchema,
} from './types';

export const getHistoricalMeasurements: CorsairEndpoint<
	SensiboContext,
	GetHistoricalMeasurementsInput,
	GetHistoricalMeasurementsResponse
> = async (ctx, input) => {
	requireKey(ctx);
	const parsed = GetHistoricalMeasurementsInputSchema.parse(input);
	return callSensibo(
		ctx,
		'measurements.history',
		{
			path: `/pods/${pathPart(parsed.deviceId)}/historicalMeasurements`,
			query: { days: parsed.days },
		},
		GetHistoricalMeasurementsResponseSchema,
		{ deviceId: parsed.deviceId },
	);
};

export const listDeviceEvents: CorsairEndpoint<
	SensiboContext,
	ListDeviceEventsInput,
	ListDeviceEventsResponse
> = async (ctx, input) => {
	requireKey(ctx);
	const parsed = ListDeviceEventsInputSchema.parse(input);
	return callSensibo(
		ctx,
		'events.list',
		{
			path: `/pods/${pathPart(parsed.deviceId)}/events`,
			query: { days_backwards: parsed.daysBackwards },
		},
		ListDeviceEventsResponseSchema,
		{ deviceId: parsed.deviceId },
	);
};

export const listDoorSensorEvents: CorsairEndpoint<
	SensiboContext,
	ListDoorSensorEventsInput,
	ListDoorSensorEventsResponse
> = async (ctx, input) => {
	requireKey(ctx);
	const parsed = ListDoorSensorEventsInputSchema.parse(input);
	return callSensibo(
		ctx,
		'doorSensors.listEvents',
		{
			path: `/doorSensors/${pathPart(parsed.sensorId)}/events`,
			query: { days: parsed.days },
		},
		ListDoorSensorEventsResponseSchema,
		{ sensorId: parsed.sensorId },
	);
};

export const Measurements = { history: getHistoricalMeasurements };
export const Events = { list: listDeviceEvents };
export const DoorSensors = { listEvents: listDoorSensorEvents };
