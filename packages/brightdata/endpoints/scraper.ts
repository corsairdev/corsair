import { logEventFromContext } from 'corsair/core';
import { makeBrightDataRequest } from '../client';
import type { BrightDataEndpoints } from '../index';
import type {
	ScraperDeliverSnapshotOutput,
	ScraperGetProgressOutput,
	ScraperGetSnapshotMetadataOutput,
	ScraperGetSnapshotOutput,
	ScraperListDatasetsOutput,
	ScraperTriggerOutput,
} from './types';

export const trigger: BrightDataEndpoints['scraperTrigger'] = async (
	ctx,
	input,
) => {
	const queryParams: Record<string, string | number | boolean | undefined> = {
		dataset_id: input.dataset_id,
		include_errors: input.include_errors,
		format: input.format,
		endpoint: input.endpoint,
		uncompressed_webhook: input.uncompressed_webhook,
		download_fields: input.download_fields,
		custom_output_fields: input.custom_output_fields,
	};

	const result = await makeBrightDataRequest<ScraperTriggerOutput>(
		'datasets/v3/trigger',
		ctx.key,
		{
			method: 'POST',
			query: queryParams,
			body: input.inputs,
		},
	);

	await logEventFromContext(
		ctx,
		'brightdata.scraper.trigger',
		{ dataset_id: input.dataset_id, snapshot_id: result.snapshot_id },
		'completed',
	);

	return result;
};

export const getProgress: BrightDataEndpoints['scraperGetProgress'] = async (
	ctx,
	input,
) => {
	const result = await makeBrightDataRequest<ScraperGetProgressOutput>(
		`datasets/v3/progress/${encodeURIComponent(input.snapshot_id)}`,
		ctx.key,
		{
			method: 'GET',
		},
	);

	await logEventFromContext(
		ctx,
		'brightdata.scraper.getProgress',
		{ snapshot_id: input.snapshot_id, status: result.status },
		'completed',
	);

	return result;
};

export const getSnapshot: BrightDataEndpoints['scraperGetSnapshot'] = async (
	ctx,
	input,
) => {
	const queryParams: Record<string, string | number | boolean | undefined> = {
		format: input.format,
		compress: input.compress,
	};

	const rawData = await makeBrightDataRequest<
		Array<Record<string, unknown>> | Record<string, unknown> | string
	>(`datasets/v3/snapshot/${encodeURIComponent(input.snapshot_id)}`, ctx.key, {
		method: 'GET',
		query: queryParams,
	});

	await logEventFromContext(
		ctx,
		'brightdata.scraper.getSnapshot',
		{ snapshot_id: input.snapshot_id },
		'completed',
	);

	return { data: rawData };
};

export const getSnapshotMetadata: BrightDataEndpoints['scraperGetSnapshotMetadata'] =
	async (ctx, input) => {
		const result =
			await makeBrightDataRequest<ScraperGetSnapshotMetadataOutput>(
				`datasets/snapshots/${encodeURIComponent(input.snapshot_id)}`,
				ctx.key,
				{
					method: 'GET',
				},
			);

		await logEventFromContext(
			ctx,
			'brightdata.scraper.getSnapshotMetadata',
			{ snapshot_id: input.snapshot_id },
			'completed',
		);

		return result;
	};

export const deliverSnapshot: BrightDataEndpoints['scraperDeliverSnapshot'] =
	async (ctx, input) => {
		const result = await makeBrightDataRequest<ScraperDeliverSnapshotOutput>(
			`datasets/snapshots/${encodeURIComponent(input.snapshot_id)}/deliver`,
			ctx.key,
			{
				method: 'POST',
				body: input.deliver,
			},
		);

		await logEventFromContext(
			ctx,
			'brightdata.scraper.deliverSnapshot',
			{ snapshot_id: input.snapshot_id },
			'completed',
		);

		return result;
	};

export const listDatasets: BrightDataEndpoints['scraperListDatasets'] = async (
	ctx,
	input,
) => {
	const queryParams: Record<string, string | number | boolean | undefined> = {
		limit: input.limit,
		offset: input.offset,
	};

	const raw = await makeBrightDataRequest<
		| Array<{ id: string; name?: string; description?: string }>
		| { datasets: Array<{ id: string; name?: string; description?: string }> }
	>('datasets/v3/datasets', ctx.key, {
		method: 'GET',
		query: queryParams,
	});

	const datasets = Array.isArray(raw)
		? raw
		: Array.isArray(raw?.datasets)
			? raw.datasets
			: [];

	await logEventFromContext(
		ctx,
		'brightdata.scraper.listDatasets',
		{ count: datasets.length },
		'completed',
	);

	return { datasets };
};
