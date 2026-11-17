import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import { asRecord, screenshotoneRequest, withoutAccessKey } from '../client';
import type { ScreenshotOneContext } from '../context';
import {
	ScreenshotOneDeviceEntity,
	ScreenshotOneUsageEntity,
} from '../schema/database';
import type {
	AnimateInput,
	BulkInput,
	BulkResponse,
	DeviceListResponse,
	EmptyInput,
	ShotResponse,
	TakeInput,
	UsageResponse,
} from './types';
import {
	AnimateInputSchema,
	BulkInputSchema,
	BulkResponseSchema,
	DeviceListResponseSchema,
	EmptyInputSchema,
	ShotResponseSchema,
	TakeInputSchema,
	UsageResponseSchema,
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

// unknown: the raw JSON body of /take or /animate with response_type=json.
function shotResult(body: unknown): ShotResponse {
	const row = asRecord(body);
	const url = withoutAccessKey(text(row?.screenshot_url) ?? '');
	if (!url)
		throw new Error('ScreenshotOne response was missing screenshot_url');
	const cache = text(row?.cache_url);
	const cacheUrl = cache ? withoutAccessKey(cache) : undefined;
	return ShotResponseSchema.parse({
		screenshotUrl: url,
		...(cacheUrl ? { cacheUrl } : {}),
	});
}

export const getUsage: CorsairEndpoint<
	ScreenshotOneContext,
	EmptyInput,
	UsageResponse
> = async (ctx, input) => {
	EmptyInputSchema.parse(input ?? {});
	const body = await screenshotoneRequest<unknown>(ctx.key, 'GET', '/usage');
	const row = asRecord(body);
	const concurrency = asRecord(row?.concurrency);
	if (!row || num(row.total) === undefined) {
		throw new Error('ScreenshotOne usage response was missing total');
	}
	const usage = ScreenshotOneUsageEntity.parse({
		id: 'plan',
		total: num(row.total),
		available: num(row.available),
		used: num(row.used),
		concurrencyLimit: num(concurrency?.limit),
		concurrencyRemaining: num(concurrency?.remaining),
		concurrencyReset: num(concurrency?.reset),
	});
	if (ctx.db?.usage) {
		try {
			await ctx.db.usage.upsertByEntityId(usage.id, usage);
		} catch {
			console.warn('Failed to save ScreenshotOne usage');
		}
	}
	await logEventFromContext(
		ctx,
		'screenshotone.usage.get',
		{ count: 1 },
		'completed',
	);
	return UsageResponseSchema.parse({ usage });
};

export const listDevices: CorsairEndpoint<
	ScreenshotOneContext,
	EmptyInput,
	DeviceListResponse
> = async (ctx, input) => {
	EmptyInputSchema.parse(input ?? {});
	const body = await screenshotoneRequest<unknown>(ctx.key, 'GET', '/devices');
	if (!Array.isArray(body)) {
		throw new Error('ScreenshotOne devices response was not an array');
	}
	const devices = body.flatMap((item) => {
		const row = asRecord(item);
		const viewport = asRecord(row?.viewport);
		const device = ScreenshotOneDeviceEntity.safeParse({
			id: text(row?.id),
			name: text(row?.name),
			width: num(viewport?.width),
			height: num(viewport?.height),
		});
		return device.success ? [device.data] : [];
	});
	if (ctx.db?.devices) {
		for (const device of devices) {
			try {
				await ctx.db.devices.upsertByEntityId(device.id, device);
			} catch {
				console.warn('Failed to save ScreenshotOne device');
			}
		}
	}
	await logEventFromContext(
		ctx,
		'screenshotone.devices.list',
		{ count: devices.length },
		'completed',
	);
	return DeviceListResponseSchema.parse({ devices });
};

export const takeScreenshot: CorsairEndpoint<
	ScreenshotOneContext,
	TakeInput,
	ShotResponse
> = async (ctx, input) => {
	const parsed = TakeInputSchema.parse(input ?? {});
	// POST with a JSON body, so long html or markdown doesn't hit URL length limits.
	const body = await screenshotoneRequest<unknown>(
		ctx.key,
		'POST',
		'/take',
		undefined,
		{ ...parsed, response_type: 'json' },
	);
	const result = shotResult(body);
	await logEventFromContext(
		ctx,
		'screenshotone.shots.take',
		{ count: 1 },
		'completed',
	);
	return result;
};

export const takeAnimation: CorsairEndpoint<
	ScreenshotOneContext,
	AnimateInput,
	ShotResponse
> = async (ctx, input) => {
	const parsed = AnimateInputSchema.parse(input ?? {});
	const { wait_until, ...rest } = parsed;
	const body = await screenshotoneRequest<unknown>(ctx.key, 'GET', '/animate', {
		...rest,
		...(wait_until ? { wait_until: wait_until.join(',') } : {}),
		response_type: 'json',
	});
	const result = shotResult(body);
	await logEventFromContext(
		ctx,
		'screenshotone.shots.animate',
		{ count: 1 },
		'completed',
	);
	return result;
};

export const takeBulk: CorsairEndpoint<
	ScreenshotOneContext,
	BulkInput,
	BulkResponse
> = async (ctx, input) => {
	const parsed = BulkInputSchema.parse(input ?? {});
	const body = await screenshotoneRequest<unknown>(
		ctx.key,
		'POST',
		'/bulk',
		undefined,
		{
			execute: parsed.execute ?? false,
			...(parsed.options ? { options: parsed.options } : {}),
			requests: parsed.urls.map((url) => ({ url })),
		},
	);
	// The live API answers a bare array; older docs show { responses: [...] }.
	const items = Array.isArray(body) ? body : asRecord(body)?.responses;
	if (!Array.isArray(items)) {
		throw new Error('ScreenshotOne bulk response was not a list');
	}
	const results = items.flatMap((item) => {
		const row = asRecord(item);
		const url = withoutAccessKey(text(row?.url) ?? '');
		if (!url) return [];
		const response = asRecord(row?.response);
		return [
			{
				url,
				isSuccessful:
					typeof response?.is_successful === 'boolean'
						? response.is_successful
						: undefined,
				status: num(response?.status),
			},
		];
	});
	await logEventFromContext(
		ctx,
		'screenshotone.shots.bulk',
		{ count: results.length },
		'completed',
	);
	return BulkResponseSchema.parse({
		urls: results.map((row) => row.url),
		...(parsed.execute ? { results } : {}),
	});
};
