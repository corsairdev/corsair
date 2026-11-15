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
} from './types';
import { CreateInputSchema, GetInputSchema } from './types';

function text(value: unknown): string | undefined {
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

function num(value: unknown): number | undefined {
	return typeof value === 'number' && Number.isFinite(value)
		? value
		: undefined;
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
	return { probes };
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
	return { limit };
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
	return { health };
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
			...(parsed.limit === undefined ? {} : { limit: parsed.limit }),
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
	return { measurement: measurement.data };
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
		id: text(row?.id) ?? parsed.id,
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
	return { measurement: measurement.data };
};
