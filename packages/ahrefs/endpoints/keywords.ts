import { logEventFromContext } from 'corsair/core';
import type { AhrefsEndpoints } from '..';
import { makeAhrefsRequest } from '../client';
import type { AhrefsEndpointOutputs } from './types';

export const getOverview: AhrefsEndpoints['keywordsExplorerOverview'] = async (
	ctx,
	input,
) => {
	const result = await makeAhrefsRequest<
		AhrefsEndpointOutputs['keywordsExplorerOverview']
	>('/v3/keywords-explorer/overview', ctx.key, { query: { ...input } });

	if (result.successful && result.data?.data && ctx.db.keywords) {
		try {
			for (const item of result.data.data) {
				// item is Record<string, unknown>; keyword field is the identifier
				const keyword = item['keyword'] as string | undefined;
				const volume = item['volume'] as number | undefined;
				const difficulty = item['kd'] as number | undefined;
				const cpc = item['cpc'] as number | undefined;
				if (keyword) {
					await ctx.db.keywords.upsertByEntityId(`overview:${keyword}:${input.country}`, {
						id: `overview:${keyword}:${input.country}`,
						keyword,
						country: input.country,
						...(volume !== undefined ? { volume } : {}),
						...(difficulty !== undefined ? { difficulty } : {}),
						...(cpc !== undefined ? { cpc } : {}),
						fetchedAt: new Date(),
					});
				}
			}
		} catch (error) {
			console.warn('[ahrefs] Failed to save keywords overview:', error);
		}
	}

	await logEventFromContext(ctx, 'ahrefs.keywords.getOverview', { ...input }, 'completed');
	return result;
};

export const getVolumeByCountry: AhrefsEndpoints['keywordsExplorerVolumeByCountry'] =
	async (ctx, input) => {
		const result = await makeAhrefsRequest<
			AhrefsEndpointOutputs['keywordsExplorerVolumeByCountry']
		>('/v3/keywords-explorer/volume-by-country', ctx.key, { query: { ...input } });

		if (result.successful && result.data?.keyword && ctx.db.keywords) {
			try {
				// Store the global-volume record; per-country breakdown is in result.data.countries
				await ctx.db.keywords.upsertByEntityId(`volume:${result.data.keyword}:global`, {
					id: `volume:${result.data.keyword}:global`,
					keyword: result.data.keyword,
					volume: result.data.globalVolume,
					fetchedAt: new Date(),
				});

				// Also persist each country-level volume entry
				for (const countryItem of result.data.countries ?? []) {
					// countryItem is Record<string, unknown>
					const country = countryItem['country'] as string | undefined;
					const countryVolume = countryItem['volume'] as number | undefined;
					if (country) {
						await ctx.db.keywords.upsertByEntityId(
							`volume:${result.data.keyword}:${country}`,
							{
								id: `volume:${result.data.keyword}:${country}`,
								keyword: result.data.keyword,
								country,
								...(countryVolume !== undefined ? { volume: countryVolume } : {}),
								fetchedAt: new Date(),
							},
						);
					}
				}
			} catch (error) {
				console.warn('[ahrefs] Failed to save keyword volume by country:', error);
			}
		}

		await logEventFromContext(ctx, 'ahrefs.keywords.getVolumeByCountry', { ...input }, 'completed');
		return result;
	};

export const getMatchingTerms: AhrefsEndpoints['keywordsExplorerMatchingTerms'] = async (
	ctx,
	input,
) => {
	const result = await makeAhrefsRequest<
		AhrefsEndpointOutputs['keywordsExplorerMatchingTerms']
	>('/v3/keywords-explorer/matching-terms', ctx.key, { query: { ...input } });

	if (result.successful && result.data?.keywords && ctx.db.keywords) {
		try {
			for (const kw of result.data.keywords) {
				// kw is Record<string, unknown>; shape depends on the `select` param
				const keyword = kw['keyword'] as string | undefined;
				const volume = kw['volume'] as number | undefined;
				const difficulty = kw['kd'] as number | undefined;
				const cpc = kw['cpc'] as number | undefined;
				if (keyword) {
					await ctx.db.keywords.upsertByEntityId(
						`matching:${keyword}:${input.country}`,
						{
							id: `matching:${keyword}:${input.country}`,
							keyword,
							country: input.country,
							...(volume !== undefined ? { volume } : {}),
							...(difficulty !== undefined ? { difficulty } : {}),
							...(cpc !== undefined ? { cpc } : {}),
							fetchedAt: new Date(),
						},
					);
				}
			}
		} catch (error) {
			console.warn('[ahrefs] Failed to save matching terms:', error);
		}
	}

	await logEventFromContext(ctx, 'ahrefs.keywords.getMatchingTerms', { ...input }, 'completed');
	return result;
};

export const getTotalSearchVolumeHistory: AhrefsEndpoints['keywordsExplorerTotalSearchVolumeHistory'] =
	async (ctx, input) => {
		const result = await makeAhrefsRequest<
			AhrefsEndpointOutputs['keywordsExplorerTotalSearchVolumeHistory']
		>('/v3/site-explorer/volume-history', ctx.key, { query: { ...input } });

		if (result.successful && result.data?.history?.length && ctx.db.keywords) {
			try {
				// Store the latest volume snapshot for this target
				const latest = result.data.history[result.data.history.length - 1];
				// latest is Record<string, unknown>; date identifies the snapshot
				const snapshotDate = latest?.['date'] as string | undefined;
				const volume = latest?.['volume'] as number | undefined;
				if (snapshotDate) {
					await ctx.db.keywords.upsertByEntityId(
						`volumeHistory:${result.data.target ?? input.target}:${snapshotDate}`,
						{
							id: `volumeHistory:${result.data.target ?? input.target}:${snapshotDate}`,
							keyword: result.data.target ?? input.target,
							country: input.country,
							...(volume !== undefined ? { volume } : {}),
							fetchedAt: new Date(),
						},
					);
				}
			} catch (error) {
				console.warn('[ahrefs] Failed to save total search volume history:', error);
			}
		}

		await logEventFromContext(ctx, 'ahrefs.keywords.getTotalSearchVolumeHistory', { ...input }, 'completed');
		return result;
	};

export const getRelatedTerms: AhrefsEndpoints['keywordsExplorerRelatedTerms'] = async (
	ctx,
	input,
) => {
	const result = await makeAhrefsRequest<
		AhrefsEndpointOutputs['keywordsExplorerRelatedTerms']
	>('/v3/keywords-explorer/related-terms', ctx.key, { query: { ...input } });

	if (result.successful && result.data?.terms && ctx.db.keywords) {
		try {
			for (const term of result.data.terms) {
				// term is Record<string, unknown>; keyword field is the identifier
				const keyword = term['keyword'] as string | undefined;
				const volume = term['volume'] as number | undefined;
				const difficulty = term['kd'] as number | undefined;
				if (keyword) {
					await ctx.db.keywords.upsertByEntityId(
						`related:${keyword}:${input.country}`,
						{
							id: `related:${keyword}:${input.country}`,
							keyword,
							country: input.country,
							...(volume !== undefined ? { volume } : {}),
							...(difficulty !== undefined ? { difficulty } : {}),
							fetchedAt: new Date(),
						},
					);
				}
			}
		} catch (error) {
			console.warn('[ahrefs] Failed to save related terms:', error);
		}
	}

	await logEventFromContext(ctx, 'ahrefs.keywords.getRelatedTerms', { ...input }, 'completed');
	return result;
};

export const getVolumeHistory: AhrefsEndpoints['keywordsExplorerVolumeHistory'] = async (
	ctx,
	input,
) => {
	const result = await makeAhrefsRequest<
		AhrefsEndpointOutputs['keywordsExplorerVolumeHistory']
	>('/v3/keywords-explorer/volume-history', ctx.key, { query: { ...input } });

	if (result.successful && result.data && ctx.db.keywords) {
		try {
			const keyword = result.data.keyword ?? input.keyword;
			const country = result.data.country ?? input.country;

			// Store the overall record; volume_history entries capture month-by-month data
			await ctx.db.keywords.upsertByEntityId(`history:${keyword}:${country}`, {
				id: `history:${keyword}:${country}`,
				keyword,
				country,
				fetchedAt: new Date(),
			});

			// Also persist each monthly volume snapshot
			for (const entry of result.data.volume_history ?? []) {
				// entry is Record<string, unknown>; month identifies the snapshot
				const month = entry['month'] as string | undefined;
				const volume = entry['volume'] as number | undefined;
				if (month) {
					await ctx.db.keywords.upsertByEntityId(`history:${keyword}:${country}:${month}`, {
						id: `history:${keyword}:${country}:${month}`,
						keyword,
						country,
						...(volume !== undefined ? { volume } : {}),
						fetchedAt: new Date(),
					});
				}
			}
		} catch (error) {
			console.warn('[ahrefs] Failed to save keyword volume history:', error);
		}
	}

	await logEventFromContext(ctx, 'ahrefs.keywords.getVolumeHistory', { ...input }, 'completed');
	return result;
};

export const getSearchSuggestions: AhrefsEndpoints['keywordsExplorerSearchSuggestions'] =
	async (ctx, input) => {
		const result = await makeAhrefsRequest<
			AhrefsEndpointOutputs['keywordsExplorerSearchSuggestions']
		>('/v3/keywords-explorer/search-suggestions', ctx.key, { query: { ...input } });

		if (result.successful && result.data?.suggestions && ctx.db.keywords) {
			try {
				for (const suggestion of result.data.suggestions) {
					// suggestion is Record<string, unknown>; keyword field is the identifier
					const keyword = suggestion['keyword'] as string | undefined;
					const volume = suggestion['volume'] as number | undefined;
					const difficulty = suggestion['kd'] as number | undefined;
					if (keyword) {
						await ctx.db.keywords.upsertByEntityId(
							`suggestion:${keyword}:${input.country}`,
							{
								id: `suggestion:${keyword}:${input.country}`,
								keyword,
								country: input.country,
								...(volume !== undefined ? { volume } : {}),
								...(difficulty !== undefined ? { difficulty } : {}),
								fetchedAt: new Date(),
							},
						);
					}
				}
			} catch (error) {
				console.warn('[ahrefs] Failed to save search suggestions:', error);
			}
		}

		await logEventFromContext(ctx, 'ahrefs.keywords.getSearchSuggestions', { ...input }, 'completed');
		return result;
	};
