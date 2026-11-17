import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import { asRecord, stormglassGet } from '../client';
import type { StormglassContext } from '../context';
import {
	StormglassExtremeEntity,
	StormglassPointEntity,
	StormglassQuotaEntity,
	StormglassStationEntity,
} from '../schema/database';
import type {
	BoxInput,
	EmptyInput,
	ExtremeListResponse,
	PointInput,
	PointResponse,
	SeriesInput,
	SeriesResponse,
	StationListResponse,
} from './types';
import { BoxInputSchema, PointInputSchema, SeriesInputSchema } from './types';

function text(value: unknown): string | undefined {
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

function num(value: unknown): number | undefined {
	return typeof value === 'number' && Number.isFinite(value)
		? value
		: undefined;
}

async function save<T extends { id: string }>(
	table:
		| { upsertByEntityId: (id: string, row: T) => Promise<unknown> }
		| undefined,
	row: T,
	label: string,
) {
	if (!table) return;
	try {
		await table.upsertByEntityId(row.id, row);
	} catch {
		console.warn(`Failed to save Stormglass ${label}`);
	}
}

function stationsOf(body: unknown) {
	const data = asRecord(body)?.data;
	if (!Array.isArray(data)) {
		throw new Error('Stormglass stations response was not a list');
	}
	return data.flatMap((item) => {
		const row = asRecord(item);
		const name = text(row?.name);
		const source = text(row?.source);
		const station = StormglassStationEntity.safeParse({
			id: name ? (source ? `${source}:${name}` : name) : undefined,
			name,
			lat: num(row?.lat),
			lng: num(row?.lng),
			source,
		});
		return station.success ? [station.data] : [];
	});
}

function quotaOf(body: unknown, id: string) {
	const meta = asRecord(asRecord(body)?.meta);
	return StormglassQuotaEntity.parse({
		id,
		dailyQuota: num(meta?.dailyQuota),
		requestCount: num(meta?.requestCount),
	});
}

function hoursOf(body: unknown, params: string[]) {
	const hours = asRecord(body)?.hours;
	if (!Array.isArray(hours))
		throw new Error('Stormglass response was missing hours');
	return hours.flatMap((item) => {
		const row = asRecord(item);
		const time = text(row?.time);
		if (!row || !time) return [];
		const values: Record<string, number> = {};
		for (const param of params) {
			const value = num(asRecord(row[param])?.sg);
			if (value !== undefined) values[param] = value;
		}
		return [{ time, values }];
	});
}

export const listStations: CorsairEndpoint<
	StormglassContext,
	EmptyInput,
	StationListResponse
> = async (ctx) => {
	const body = await stormglassGet<unknown>(ctx.key, '/v2/tide/stations');
	const stations = stationsOf(body);
	for (const station of stations)
		await save(ctx.db?.stations, station, 'station');
	await logEventFromContext(
		ctx,
		'stormglass.stations.list',
		{ count: stations.length },
		'completed',
	);
	return { stations };
};

export const listStationsInArea: CorsairEndpoint<
	StormglassContext,
	BoxInput,
	StationListResponse
> = async (ctx, input) => {
	const parsed = BoxInputSchema.parse(input ?? {});
	const body = await stormglassGet<unknown>(ctx.key, '/v2/tide/stations/area', {
		box: parsed.box,
	});
	const stations = stationsOf(body);
	for (const station of stations)
		await save(ctx.db?.stations, station, 'station');
	await logEventFromContext(
		ctx,
		'stormglass.stations.area',
		{ count: stations.length },
		'completed',
	);
	return { stations };
};

export const getElevation: CorsairEndpoint<
	StormglassContext,
	PointInput,
	PointResponse
> = async (ctx, input) => {
	const parsed = PointInputSchema.parse(input ?? {});
	const body = await stormglassGet<unknown>(ctx.key, '/v2/elevation/point', {
		lat: parsed.lat,
		lng: parsed.lng,
	});
	const point = StormglassPointEntity.parse({
		id: `${parsed.lat},${parsed.lng}`,
		elevation: num(asRecord(asRecord(body)?.data)?.elevation),
	});
	if (point.elevation === undefined) {
		throw new Error('Stormglass elevation response was missing elevation');
	}
	const quota = quotaOf(body, 'elevation');
	await save(ctx.db?.points, point, 'point');
	await save(ctx.db?.quotas, quota, 'quota');
	await logEventFromContext(
		ctx,
		'stormglass.elevation.get',
		{ count: 1 },
		'completed',
	);
	return { point, quota };
};

export const getExtremes: CorsairEndpoint<
	StormglassContext,
	PointInput,
	ExtremeListResponse
> = async (ctx, input) => {
	const parsed = PointInputSchema.parse(input ?? {});
	const body = await stormglassGet<unknown>(
		ctx.key,
		'/v2/tide/extremes/point',
		{
			lat: parsed.lat,
			lng: parsed.lng,
		},
	);
	const data = asRecord(body)?.data;
	if (!Array.isArray(data))
		throw new Error('Stormglass extremes response was not a list');
	const extremes = data.flatMap((item) => {
		const row = asRecord(item);
		const time = text(row?.time);
		const type = text(row?.type);
		const extreme = StormglassExtremeEntity.safeParse({
			id: time && type ? `${time}:${type}` : undefined,
			time,
			type,
			height: num(row?.height),
		});
		return extreme.success ? [extreme.data] : [];
	});
	for (const extreme of extremes)
		await save(ctx.db?.extremes, extreme, 'extreme');
	const quota = quotaOf(body, 'extremes');
	await save(ctx.db?.quotas, quota, 'quota');
	await logEventFromContext(
		ctx,
		'stormglass.tides.extremes',
		{ count: extremes.length },
		'completed',
	);
	return { extremes, quota };
};

async function series(
	ctx: StormglassContext,
	input: SeriesInput,
	url: '/v2/solar/point' | '/v2/weather/point',
	quotaId: string,
	event: string,
): Promise<SeriesResponse> {
	const parsed = SeriesInputSchema.parse(input ?? {});
	const params = parsed.params
		.split(',')
		.map((part) => part.trim())
		.filter(Boolean);
	if (params.length === 0) throw new Error('Stormglass params were empty');
	const body = await stormglassGet<unknown>(ctx.key, url, {
		lat: parsed.lat,
		lng: parsed.lng,
		params: params.join(','),
	});
	const hours = hoursOf(body, params);
	const quota = quotaOf(body, quotaId);
	await save(ctx.db?.quotas, quota, 'quota');
	await logEventFromContext(ctx, event, { count: hours.length }, 'completed');
	return { hours, quota };
}

export const getSolar: CorsairEndpoint<
	StormglassContext,
	SeriesInput,
	SeriesResponse
> = async (ctx, input) =>
	series(ctx, input, '/v2/solar/point', 'solar', 'stormglass.solar.get');

export const getWeather: CorsairEndpoint<
	StormglassContext,
	SeriesInput,
	SeriesResponse
> = async (ctx, input) =>
	series(ctx, input, '/v2/weather/point', 'weather', 'stormglass.weather.get');
