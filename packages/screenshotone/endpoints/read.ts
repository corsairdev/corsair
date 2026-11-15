import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import { asRecord, screenshotoneRequest, withoutAccessKey } from '../client';
import type { ScreenshotOneContext } from '../context';
import {
	ScreenshotOneDeviceEntity,
	ScreenshotOneUsageEntity,
} from '../schema/database';
import type {
	BulkInput,
	BulkResponse,
	DeviceListResponse,
	EmptyInput,
	ShotResponse,
	UrlInput,
	UsageResponse,
} from './types';
import { BulkInputSchema, UrlInputSchema } from './types';

function text(value: unknown): string | undefined {
	return typeof value === 'string' && value.length > 0 ? value : undefined;
}

function num(value: unknown): number | undefined {
	return typeof value === 'number' && Number.isFinite(value)
		? value
		: undefined;
}

function shotUrl(body: unknown): string {
	const url = withoutAccessKey(text(asRecord(body)?.screenshot_url) ?? '');
	if (!url)
		throw new Error('ScreenshotOne response was missing screenshot_url');
	return url;
}

export const getUsage: CorsairEndpoint<
	ScreenshotOneContext,
	EmptyInput,
	UsageResponse
> = async (ctx) => {
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
	return { usage };
};

export const listDevices: CorsairEndpoint<
	ScreenshotOneContext,
	EmptyInput,
	DeviceListResponse
> = async (ctx) => {
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
	return { devices };
};

export const takeScreenshot: CorsairEndpoint<
	ScreenshotOneContext,
	UrlInput,
	ShotResponse
> = async (ctx, input) => {
	const parsed = UrlInputSchema.parse(input ?? {});
	const body = await screenshotoneRequest<unknown>(ctx.key, 'GET', '/take', {
		url: parsed.url,
		response_type: 'json',
	});
	const screenshotUrl = shotUrl(body);
	await logEventFromContext(
		ctx,
		'screenshotone.shots.take',
		{ count: 1 },
		'completed',
	);
	return { screenshotUrl };
};

export const takeAnimation: CorsairEndpoint<
	ScreenshotOneContext,
	UrlInput,
	ShotResponse
> = async (ctx, input) => {
	const parsed = UrlInputSchema.parse(input ?? {});
	const body = await screenshotoneRequest<unknown>(ctx.key, 'GET', '/animate', {
		url: parsed.url,
		response_type: 'json',
		scenario: parsed.scenario,
		duration: parsed.duration,
		format: parsed.format,
	});
	const screenshotUrl = shotUrl(body);
	await logEventFromContext(
		ctx,
		'screenshotone.shots.animate',
		{ count: 1 },
		'completed',
	);
	return { screenshotUrl };
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
			requests: parsed.urls.map((url) => ({ url })),
		},
	);
	const responses = asRecord(body)?.responses;
	if (!Array.isArray(responses)) {
		throw new Error('ScreenshotOne bulk response was missing responses');
	}
	const urls = responses.flatMap((item) => {
		const url = withoutAccessKey(text(asRecord(item)?.url) ?? '');
		return url ? [url] : [];
	});
	await logEventFromContext(
		ctx,
		'screenshotone.shots.bulk',
		{ count: urls.length },
		'completed',
	);
	return { urls };
};
