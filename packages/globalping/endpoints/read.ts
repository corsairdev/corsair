import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import { asRecord, globalpingRequest } from '../client';
import type { GlobalpingContext } from '../context';
import {
	GlobalpingHealthEntity,
	GlobalpingLimitEntity,
	GlobalpingMeasurementEntity,
} from '../schema/database';
import type {
	CreateInput,
	EmptyInput,
	GetInput,
	HealthResponse,
	LimitResponse,
	MeasurementResponse,
	ProbeListResponse,
	ProbeResult,
} from './types';
import {
	CreateInputSchema,
	GetInputSchema,
	HealthResponseSchema,
	LimitResponseSchema,
	MeasurementResponseSchema,
	ProbeListResponseSchema,
	ProbeResultSchema,
} from './types';

// unknown: a raw JSON field; this narrows it to a non-empty string.
function text(value: unknown): string | undefined {
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

// unknown: a raw JSON field; this keeps finite numbers only.
function num(value: unknown): number | undefined {
	return typeof value === 'number' && Number.isFinite(value)
		? value
		: undefined;
}

// unknown: the raw results array; each probe and result is read field by field.
function resultsFrom(value: unknown): ProbeResult[] {
	if (!Array.isArray(value)) return [];
	return value.flatMap((item) => {
		const row = asRecord(item);
		const probe = asRecord(row?.probe);
		const result = asRecord(row?.result);
		const status = text(result?.status);
		if (!probe || !result || !status) return [];
		const { resolvers: _resolvers, ...probeFields } = probe;
		const parsed = ProbeResultSchema.safeParse({
			probe: {
				continent: text(probeFields.continent),
				region: text(probeFields.region),
				country: text(probeFields.country),
				state: probeFields.state === null ? null : text(probeFields.state),
				city: text(probeFields.city),
				asn: num(probeFields.asn),
				network: text(probeFields.network),
				latitude: num(probeFields.latitude),
				longitude: num(probeFields.longitude),
				tags: Array.isArray(probeFields.tags)
					? probeFields.tags.filter(
							(tag): tag is string => typeof tag === 'string',
						)
					: undefined,
			},
			result: { ...result, status },
		});
		return parsed.success ? [parsed.data] : [];
	});
}

export const listProbes: CorsairEndpoint<
	GlobalpingContext,
	EmptyInput,
	ProbeListResponse
> = async (ctx) => {
	const body = await globalpingRequest<unknown>(ctx.key, 'GET', '/v1/probes');
	if (!Array.isArray(body))
		throw new Error('Globalping probes response was not an array');
	const probes = body.flatMap((item) => {
		const row = asRecord(item);
		const location = asRecord(row?.location);
		if (!location) return [];
		return [
			{
				version: text(row?.version),
				continent: text(location.continent),
				region: text(location.region),
				country: text(location.country),
				city: text(location.city),
				network: text(location.network),
				asn: num(location.asn),
			},
		];
	});
	await logEventFromContext(
		ctx,
		'globalping.probes.list',
		{ count: probes.length },
		'completed',
	);
	return ProbeListResponseSchema.parse({ probes });
};

export const getLimits: CorsairEndpoint<
	GlobalpingContext,
	EmptyInput,
	LimitResponse
> = async (ctx) => {
	const body = await globalpingRequest<unknown>(ctx.key, 'GET', '/v1/limits');
	const create = asRecord(
		asRecord(asRecord(asRecord(body)?.rateLimit)?.measurements)?.create,
	);
	if (!create) throw new Error('Globalping limits response was missing create');
	const limit = GlobalpingLimitEntity.parse({
		id: 'measurements.create',
		type: text(create.type),
		limit: num(create.limit),
		remaining: num(create.remaining),
		reset: num(create.reset),
	});
	if (ctx.db?.limits) {
		try {
			await ctx.db.limits.upsertByEntityId(limit.id, limit);
		} catch {
			console.warn('Failed to save Globalping limit');
		}
	}
	await logEventFromContext(
		ctx,
		'globalping.limits.get',
		{ count: 1 },
		'completed',
	);
	return LimitResponseSchema.parse({ limit });
};

export const getHealth: CorsairEndpoint<
	GlobalpingContext,
	EmptyInput,
	HealthResponse
> = async (ctx) => {
	const body = await globalpingRequest<unknown>(ctx.key, 'GET', '/health');
	const status =
		typeof body === 'string' ? body.trim() : text(asRecord(body)?.status);
	if (!status) throw new Error('Globalping health response was empty');
	const health = GlobalpingHealthEntity.parse({ id: 'api', status });
	if (ctx.db?.health) {
		try {
			await ctx.db.health.upsertByEntityId(health.id, health);
		} catch {
			console.warn('Failed to save Globalping health');
		}
	}
	await logEventFromContext(
		ctx,
		'globalping.health.get',
		{ count: 1 },
		'completed',
	);
	return HealthResponseSchema.parse({ health });
};

export const createMeasurement: CorsairEndpoint<
	GlobalpingContext,
	CreateInput,
	MeasurementResponse
> = async (ctx, input) => {
	const parsed = CreateInputSchema.parse(input ?? {});
	const body = await globalpingRequest<unknown>(
		ctx.key,
		'POST',
		'/v1/measurements',
		{
			type: parsed.type,
			target: parsed.target,
			...(parsed.locations === undefined
				? {}
				: { locations: parsed.locations }),
			...(parsed.limit === undefined ? {} : { limit: parsed.limit }),
			...(parsed.timeout === undefined ? {} : { timeout: parsed.timeout }),
			...(parsed.measurementOptions === undefined
				? {}
				: { measurementOptions: parsed.measurementOptions }),
		},
	);
	const row = asRecord(body);
	const measurement = GlobalpingMeasurementEntity.safeParse({
		id: text(row?.id),
		probesCount: num(row?.probesCount),
		type: parsed.type,
	});
	if (!measurement.success) {
		throw new Error('Globalping create response was missing an id');
	}
	if (ctx.db?.measurements) {
		try {
			await ctx.db.measurements.upsertByEntityId(
				measurement.data.id,
				measurement.data,
			);
		} catch {
			console.warn('Failed to save Globalping measurement');
		}
	}
	await logEventFromContext(
		ctx,
		'globalping.measurements.create',
		{ count: 1 },
		'completed',
	);
	return MeasurementResponseSchema.parse({ measurement: measurement.data });
};

export const getMeasurement: CorsairEndpoint<
	GlobalpingContext,
	GetInput,
	MeasurementResponse
> = async (ctx, input) => {
	const parsed = GetInputSchema.parse(input ?? {});
	const body = await globalpingRequest<unknown>(
		ctx.key,
		'GET',
		`/v1/measurements/${encodeURIComponent(parsed.id)}`,
	);
	const row = asRecord(body);
	const measurement = GlobalpingMeasurementEntity.safeParse({
		id: text(row?.id),
		probesCount: num(row?.probesCount),
		type: text(row?.type),
		status: text(row?.status),
	});
	if (!measurement.success) {
		throw new Error('Globalping measurement response was missing an id');
	}
	if (ctx.db?.measurements) {
		try {
			await ctx.db.measurements.upsertByEntityId(
				measurement.data.id,
				measurement.data,
			);
		} catch {
			console.warn('Failed to save Globalping measurement');
		}
	}
	await logEventFromContext(
		ctx,
		'globalping.measurements.get',
		{ count: 1 },
		'completed',
	);
	return MeasurementResponseSchema.parse({
		measurement: measurement.data,
		target: text(row?.target),
		createdAt: text(row?.createdAt),
		updatedAt: text(row?.updatedAt),
		results: resultsFrom(row?.results),
	});
};
