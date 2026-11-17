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
	AstronomyInput,
	AstronomyResponse,
	BoxInput,
	EmptyInput,
	ExtremeListResponse,
	HistoricalInput,
	PointInput,
	PointResponse,
	SeaLevelResponse,
	SeriesInput,
	SeriesResponse,
	StationListResponse,
	TideInput,
} from './types';
import {
	AstronomyDaySchema,
	AstronomyInputSchema,
	BoxInputSchema,
	HistoricalInputSchema,
	PointInputSchema,
	SeriesInputSchema,
	TideInputSchema,
	TideStationSchema,
} from './types';

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

/** meta.station on tide responses: the station whose data answered. */
function tideStationOf(body: unknown) {
	const station = asRecord(asRecord(asRecord(body)?.meta)?.station);
	if (!station) return undefined;
	return TideStationSchema.parse({
		name: text(station.name),
		source: text(station.source),
		distance: num(station.distance),
		lat: num(station.lat),
		lng: num(station.lng),
	});
}

/** Source values of one hourly parameter object, e.g. { sg: 10.3, noaa: 10.1 }. */
function sourceValues(value: unknown): Record<string, number> {
	const out: Record<string, number> = {};
	for (const [source, raw] of Object.entries(asRecord(value) ?? {})) {
		const n = num(raw);
		if (n !== undefined) out[source] = n;
	}
	return out;
}

/** The value `values` reports: the first requested source, else sg, else the first one there. */
function preferred(
	bySource: Record<string, number>,
	sources: string[],
): number | undefined {
	for (const source of sources) {
		if (bySource[source] !== undefined) return bySource[source];
	}
	if (sources.length === 0) {
		if (bySource.sg !== undefined) return bySource.sg;
		return Object.values(bySource)[0];
	}
	return undefined;
}

function splitList(value: string | undefined) {
	return (value ?? '')
		.split(',')
		.map((part) => part.trim())
		.filter(Boolean);
}

function hoursOf(body: unknown, params: string[], sources: string[]) {
	const hours = asRecord(body)?.hours;
	if (!Array.isArray(hours))
		throw new Error('Stormglass response was missing hours');
	return hours.flatMap((item) => {
		const row = asRecord(item);
		const time = text(row?.time);
		if (!row || !time) return [];
		const values: Record<string, number> = {};
		const bySource: Record<string, Record<string, number>> = {};
		for (const param of params) {
			const all = sourceValues(row[param]);
			if (Object.keys(all).length === 0) continue;
			bySource[param] = all;
			const value = preferred(all, sources);
			if (value !== undefined) values[param] = value;
		}
		return [{ time, values, sources: bySource }];
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

function tideQuery(parsed: TideInput) {
	return {
		lat: parsed.lat,
		lng: parsed.lng,
		start: parsed.start,
		end: parsed.end,
		datum: parsed.datum,
	};
}

export const getExtremes: CorsairEndpoint<
	StormglassContext,
	TideInput,
	ExtremeListResponse
> = async (ctx, input) => {
	const parsed = TideInputSchema.parse(input ?? {});
	const body = await stormglassGet<unknown>(
		ctx.key,
		'/v2/tide/extremes/point',
		tideQuery(parsed),
	);
	const data = asRecord(body)?.data;
	if (!Array.isArray(data))
		throw new Error('Stormglass extremes response was not a list');
	const station = tideStationOf(body);
	// Nearby points share a station, and different stations can have a tide at
	// the same minute, so the station is part of the id.
	const stationId = station?.name
		? station.source
			? `${station.source}:${station.name}`
			: station.name
		: `${parsed.lat},${parsed.lng}`;
	const datum = parsed.datum ?? 'MSL';
	const extremes = data.flatMap((item) => {
		const row = asRecord(item);
		const time = text(row?.time);
		const type = text(row?.type);
		const extreme = StormglassExtremeEntity.safeParse({
			id: time && type ? `${stationId}:${datum}:${time}:${type}` : undefined,
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
	return { extremes, station, quota };
};

export const getSeaLevel: CorsairEndpoint<
	StormglassContext,
	TideInput,
	SeaLevelResponse
> = async (ctx, input) => {
	const parsed = TideInputSchema.parse(input ?? {});
	const body = await stormglassGet<unknown>(
		ctx.key,
		'/v2/tide/sea-level/point',
		tideQuery(parsed),
	);
	const data = asRecord(body)?.data;
	if (!Array.isArray(data))
		throw new Error('Stormglass sea-level response was not a list');
	const levels = data.flatMap((item) => {
		const row = asRecord(item);
		const time = text(row?.time);
		if (!row || !time) return [];
		const { time: _time, ...rest } = row;
		const sources = sourceValues(rest);
		return [{ time, height: preferred(sources, []), sources }];
	});
	const quota = quotaOf(body, 'seaLevel');
	await save(ctx.db?.quotas, quota, 'quota');
	await logEventFromContext(
		ctx,
		'stormglass.tides.seaLevel',
		{ count: levels.length },
		'completed',
	);
	return { levels, station: tideStationOf(body), quota };
};

export const getAstronomy: CorsairEndpoint<
	StormglassContext,
	AstronomyInput,
	AstronomyResponse
> = async (ctx, input) => {
	const parsed = AstronomyInputSchema.parse(input ?? {});
	const body = await stormglassGet<unknown>(ctx.key, '/v2/astronomy/point', {
		lat: parsed.lat,
		lng: parsed.lng,
		start: parsed.start,
		end: parsed.end,
	});
	const data = asRecord(body)?.data;
	if (!Array.isArray(data))
		throw new Error('Stormglass astronomy response was not a list');
	const days = data.flatMap((item) => {
		const day = AstronomyDaySchema.safeParse(item);
		return day.success ? [day.data] : [];
	});
	const quota = quotaOf(body, 'astronomy');
	await save(ctx.db?.quotas, quota, 'quota');
	await logEventFromContext(
		ctx,
		'stormglass.astronomy.get',
		{ count: days.length },
		'completed',
	);
	return { days, quota };
};

type SeriesUrl =
	| '/v2/solar/point'
	| '/v2/bio/point'
	| '/v2/weather/point'
	| '/v2/historical/point';

async function series(
	ctx: StormglassContext,
	parsed: SeriesInput,
	url: SeriesUrl,
	quotaId: string,
	event: string,
): Promise<SeriesResponse> {
	const params = splitList(parsed.params);
	if (params.length === 0) throw new Error('Stormglass params were empty');
	const sources = splitList(parsed.source);
	const body = await stormglassGet<unknown>(ctx.key, url, {
		lat: parsed.lat,
		lng: parsed.lng,
		params: params.join(','),
		start: parsed.start,
		end: parsed.end,
		source: sources.length > 0 ? sources.join(',') : undefined,
	});
	const hours = hoursOf(body, params, sources);
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
	series(
		ctx,
		SeriesInputSchema.parse(input ?? {}),
		'/v2/solar/point',
		'solar',
		'stormglass.solar.get',
	);

export const getBio: CorsairEndpoint<
	StormglassContext,
	SeriesInput,
	SeriesResponse
> = async (ctx, input) =>
	series(
		ctx,
		SeriesInputSchema.parse(input ?? {}),
		'/v2/bio/point',
		'bio',
		'stormglass.bio.get',
	);

export const getWeather: CorsairEndpoint<
	StormglassContext,
	SeriesInput,
	SeriesResponse
> = async (ctx, input) =>
	series(
		ctx,
		SeriesInputSchema.parse(input ?? {}),
		'/v2/weather/point',
		'weather',
		'stormglass.weather.get',
	);

export const getHistoricalWeather: CorsairEndpoint<
	StormglassContext,
	HistoricalInput,
	SeriesResponse
> = async (ctx, input) =>
	series(
		ctx,
		HistoricalInputSchema.parse(input ?? {}),
		'/v2/historical/point',
		'historical',
		'stormglass.weather.historical',
	);
