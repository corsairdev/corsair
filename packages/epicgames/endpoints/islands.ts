import { logEventFromContext } from 'corsair/core';
import { makeEpicGamesRequest } from '../client';
import type { EpicGamesEndpoints } from '../index';
import type { EpicGamesEndpointOutputs } from './types';

/**
 * Fortnite Data API paths (official OpenAPI):
 *   GET /islands
 *   GET /islands/{code}
 *   GET /islands/{code}/metrics
 *   GET /islands/{code}/metrics/{interval}
 *   GET /islands/{code}/metrics/{interval}/{metric}
 *
 * Docs: https://api.fortnite.com/ecosystem/v1/docs
 */

function metricRangeQuery(input: { from?: string; to?: string }) {
	return {
		from: input.from,
		to: input.to,
	};
}

function metricInterval(input: { interval?: string }): string {
	return input.interval ?? 'day';
}

export const list: EpicGamesEndpoints['islandsList'] = async (ctx, input) => {
	const result = await makeEpicGamesRequest<
		EpicGamesEndpointOutputs['islandsList']
	>('/islands', ctx.key, {
		method: 'GET',
		query: {
			size: input.size,
			after: input.after,
			before: input.before,
		},
		bearer: Boolean(ctx.key),
	});

	await logEventFromContext(ctx, 'epicgames.islands.list', {}, 'completed');
	return result;
};

export const get: EpicGamesEndpoints['islandsGet'] = async (ctx, input) => {
	const result = await makeEpicGamesRequest<
		EpicGamesEndpointOutputs['islandsGet']
	>(`/islands/${encodeURIComponent(input.code)}`, ctx.key, {
		method: 'GET',
		bearer: Boolean(ctx.key),
	});

	await logEventFromContext(
		ctx,
		'epicgames.islands.get',
		{ code: input.code },
		'completed',
	);
	return result;
};

export const getMetricsByInterval: EpicGamesEndpoints['islandsGetMetricsByInterval'] =
	async (ctx, input) => {
		const { code, interval, from, to, metrics } = input;
		// /metrics (day default) documents only from/to. metrics filter needs /metrics/{interval}.
		const path =
			interval === undefined
				? `/islands/${encodeURIComponent(code)}/metrics`
				: `/islands/${encodeURIComponent(code)}/metrics/${encodeURIComponent(interval)}`;

		const query: Record<
			string,
			string | number | boolean | undefined | string[]
		> = {
			...metricRangeQuery({ from, to }),
		};
		if (interval !== undefined && metrics !== undefined) {
			// OpenAPI MetricsListQuery: form + explode → metrics=a&metrics=b
			query.metrics = Array.isArray(metrics) ? metrics : [metrics];
		}

		const result = await makeEpicGamesRequest<
			EpicGamesEndpointOutputs['islandsGetMetricsByInterval']
		>(path, ctx.key, {
			method: 'GET',
			query,
			bearer: Boolean(ctx.key),
		});

		await logEventFromContext(
			ctx,
			'epicgames.islands.getMetricsByInterval',
			{ code },
			'completed',
		);
		return result;
	};

/** Shared GET for /islands/{code}/metrics/{interval}/{metric} (all metrics share output shape). */
async function islandMetric(
	ctx: Parameters<EpicGamesEndpoints['islandsGetPlays']>[0],
	input: {
		code: string;
		interval?: 'day' | 'hour' | 'minute';
		from?: string;
		to?: string;
	},
	metric: string,
	event: string,
): Promise<EpicGamesEndpointOutputs['islandsGetPlays']> {
	const interval = metricInterval(input);
	const result = await makeEpicGamesRequest<
		EpicGamesEndpointOutputs['islandsGetPlays']
	>(
		`/islands/${encodeURIComponent(input.code)}/metrics/${encodeURIComponent(interval)}/${metric}`,
		ctx.key,
		{
			method: 'GET',
			query: metricRangeQuery(input),
			bearer: Boolean(ctx.key),
		},
	);
	await logEventFromContext(ctx, event, { code: input.code }, 'completed');
	return result;
}

export const getPlays: EpicGamesEndpoints['islandsGetPlays'] = async (
	ctx,
	input,
) => islandMetric(ctx, input, 'plays', 'epicgames.islands.getPlays');

export const getUniquePlayers: EpicGamesEndpoints['islandsGetUniquePlayers'] =
	async (ctx, input) =>
		islandMetric(
			ctx,
			input,
			'unique-players',
			'epicgames.islands.getUniquePlayers',
		);

export const getMinutesPlayed: EpicGamesEndpoints['islandsGetMinutesPlayed'] =
	async (ctx, input) =>
		islandMetric(
			ctx,
			input,
			'minutes-played',
			'epicgames.islands.getMinutesPlayed',
		);

export const getAvgMinutesPerPlayer: EpicGamesEndpoints['islandsGetAvgMinutesPerPlayer'] =
	async (ctx, input) =>
		islandMetric(
			ctx,
			input,
			// OpenAPI path segment is average-minutes-per-player (not avg-*)
			'average-minutes-per-player',
			'epicgames.islands.getAvgMinutesPerPlayer',
		);

export const getPeakCcu: EpicGamesEndpoints['islandsGetPeakCcu'] = async (
	ctx,
	input,
) => islandMetric(ctx, input, 'peak-ccu', 'epicgames.islands.getPeakCcu');

export const getFavorites: EpicGamesEndpoints['islandsGetFavorites'] = async (
	ctx,
	input,
) => islandMetric(ctx, input, 'favorites', 'epicgames.islands.getFavorites');

export const getRecommendations: EpicGamesEndpoints['islandsGetRecommendations'] =
	async (ctx, input) =>
		islandMetric(
			ctx,
			input,
			'recommendations',
			'epicgames.islands.getRecommendations',
		);

export const getRetention: EpicGamesEndpoints['islandsGetRetention'] = async (
	ctx,
	input,
) => islandMetric(ctx, input, 'retention', 'epicgames.islands.getRetention');
