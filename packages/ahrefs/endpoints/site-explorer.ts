import { logEventFromContext } from 'corsair/core';
import type { AhrefsEndpoints } from '..';
import { makeAhrefsRequest } from '../client';
import type { AhrefsEndpointOutputs } from './types';

export const backlinksStats: AhrefsEndpoints['siteExplorerBacklinksStats'] = async (
	ctx,
	input,
) => {
	const result = await makeAhrefsRequest<
		AhrefsEndpointOutputs['siteExplorerBacklinksStats']
	>('/v3/site-explorer/backlinks-stats', ctx.key, { query: { ...input } });

	if (result.successful && ctx.db.backlinksStats) {
		try {
			await ctx.db.backlinksStats.upsertByEntityId(`${input.target}:${input.date}`, {
				id: `${input.target}:${input.date}`,
				target: input.target,
				date: input.date,
				// Spread all metrics fields (edu, gov, backlinks, refdomains, etc.)
				...(result.data?.metrics ?? {}),
				fetchedAt: new Date(),
			});
		} catch (error) {
			console.warn('[ahrefs] Failed to save backlinks stats:', error);
		}
	}

	await logEventFromContext(ctx, 'ahrefs.siteExplorer.backlinksStats', { ...input }, 'completed');
	return result;
};

export const batchUrlAnalysis: AhrefsEndpoints['siteExplorerBatchUrlAnalysis'] = async (
	ctx,
	input,
) => {
	// Arrays need explicit conversion to comma-separated strings for the Ahrefs API
	const { targets, select, ...rest } = input;
	const result = await makeAhrefsRequest<
		AhrefsEndpointOutputs['siteExplorerBatchUrlAnalysis']
	>('/v3/batch-analysis', ctx.key, {
		query: { ...rest, targets: targets.join(','), select: select.join(',') },
	});

	if (result.successful && result.data?.results && ctx.db.domainRatings) {
		try {
			for (const item of result.data.results) {
				// item is Record<string, unknown>; url is the identifier for the batch result
				const url = item['url'] as string | undefined;
				// domain_rating and ahrefs_rank come back when requested via select
				const domain_rating = item['domain_rating'] as number | undefined;
				const ahrefs_rank = item['ahrefs_rank'] as number | undefined;
				if (url) {
					await ctx.db.domainRatings.upsertByEntityId(`batch:${url}`, {
						id: `batch:${url}`,
						target: url,
						date: new Date().toISOString().split('T')[0]!,
						...(domain_rating !== undefined ? { domain_rating } : {}),
						...(ahrefs_rank !== undefined ? { ahrefs_rank } : {}),
						fetchedAt: new Date(),
					});
				}
			}
		} catch (error) {
			console.warn('[ahrefs] Failed to save batch URL analysis results:', error);
		}
	}

	await logEventFromContext(ctx, 'ahrefs.siteExplorer.batchUrlAnalysis', { ...input }, 'completed');
	return result;
};

export const getDomainRating: AhrefsEndpoints['siteExplorerDomainRating'] = async (
	ctx,
	input,
) => {
	const result = await makeAhrefsRequest<
		AhrefsEndpointOutputs['siteExplorerDomainRating']
	>('/v3/site-explorer/domain-rating', ctx.key, { query: { ...input } });

	if (result.successful && result.data && ctx.db.domainRatings) {
		try {
			await ctx.db.domainRatings.upsertByEntityId(`${input.target}:${input.date}`, {
				id: `${input.target}:${input.date}`,
				target: input.target,
				date: input.date,
				// Spread all returned fields (domain_rating, ahrefs_rank, etc.)
				...result.data,
				fetchedAt: new Date(),
			});
		} catch (error) {
			console.warn('[ahrefs] Failed to save domain rating:', error);
		}
	}

	await logEventFromContext(ctx, 'ahrefs.siteExplorer.getDomainRating', { ...input }, 'completed');
	return result;
};

export const getDomainRatingHistory: AhrefsEndpoints['siteExplorerDomainRatingHistory'] =
	async (ctx, input) => {
		const result = await makeAhrefsRequest<
			AhrefsEndpointOutputs['siteExplorerDomainRatingHistory']
		>('/v3/site-explorer/domain-rating-history', ctx.key, { query: { ...input } });

		if (result.successful && result.data?.history?.length && ctx.db.domainRatings) {
			try {
				// Persist the latest history entry for the target
				const latest = result.data.history[result.data.history.length - 1];
				// latest is Record<string, unknown>; date field identifies the snapshot
				const snapshotDate = latest?.['date'] as string | undefined;
				const domain_rating = latest?.['domain_rating'] as number | undefined;
				if (snapshotDate) {
					await ctx.db.domainRatings.upsertByEntityId(`${input.target}:${snapshotDate}`, {
						id: `${input.target}:${snapshotDate}`,
						target: input.target,
						date: snapshotDate,
						...(domain_rating !== undefined ? { domain_rating } : {}),
						fetchedAt: new Date(),
					});
				}
			} catch (error) {
				console.warn('[ahrefs] Failed to save domain rating history:', error);
			}
		}

		await logEventFromContext(ctx, 'ahrefs.siteExplorer.getDomainRatingHistory', { ...input }, 'completed');
		return result;
	};

export const getAllBacklinks: AhrefsEndpoints['siteExplorerAllBacklinks'] = async (
	ctx,
	input,
) => {
	const result = await makeAhrefsRequest<
		AhrefsEndpointOutputs['siteExplorerAllBacklinks']
	>('/v3/site-explorer/all-backlinks', ctx.key, { query: { ...input } });

	if (result.successful && ctx.db.backlinksStats) {
		try {
			await ctx.db.backlinksStats.upsertByEntityId(`allBacklinks:${input.target}`, {
				id: `allBacklinks:${input.target}`,
				target: input.target,
				date: new Date().toISOString().split('T')[0]!,
				backlinks: result.data?.refpages?.length,
				fetchedAt: new Date(),
			});
		} catch (error) {
			console.warn('[ahrefs] Failed to save all backlinks summary:', error);
		}
	}

	await logEventFromContext(ctx, 'ahrefs.siteExplorer.getAllBacklinks', { ...input }, 'completed');
	return result;
};

export const getBrokenBacklinks: AhrefsEndpoints['siteExplorerBrokenBacklinks'] = async (
	ctx,
	input,
) => {
	const result = await makeAhrefsRequest<
		AhrefsEndpointOutputs['siteExplorerBrokenBacklinks']
	>('/v3/site-explorer/broken-backlinks', ctx.key, { query: { ...input } });

	if (result.successful && ctx.db.backlinksStats) {
		try {
			await ctx.db.backlinksStats.upsertByEntityId(`brokenBacklinks:${input.target}`, {
				id: `brokenBacklinks:${input.target}`,
				target: input.target,
				date: new Date().toISOString().split('T')[0]!,
				// Store count of broken backlinks for this target
				refpages: result.data?.refpages?.length,
				fetchedAt: new Date(),
			});
		} catch (error) {
			console.warn('[ahrefs] Failed to save broken backlinks summary:', error);
		}
	}

	await logEventFromContext(ctx, 'ahrefs.siteExplorer.getBrokenBacklinks', { ...input }, 'completed');
	return result;
};

export const getReferringDomains: AhrefsEndpoints['siteExplorerReferringDomains'] = async (
	ctx,
	input,
) => {
	const result = await makeAhrefsRequest<
		AhrefsEndpointOutputs['siteExplorerReferringDomains']
	>('/v3/site-explorer/refdomains', ctx.key, { query: { ...input } });

	if (result.successful && ctx.db.backlinksStats) {
		try {
			await ctx.db.backlinksStats.upsertByEntityId(`refdomains:${input.target}`, {
				id: `refdomains:${input.target}`,
				target: input.target,
				date: new Date().toISOString().split('T')[0]!,
				refdomains: result.data?.refdomains?.length,
				// Spread any scalar stats fields from the summary object
				...(typeof result.data?.stats === 'object' && result.data.stats !== null
					? result.data.stats
					: {}),
				fetchedAt: new Date(),
			});
		} catch (error) {
			console.warn('[ahrefs] Failed to save referring domains summary:', error);
		}
	}

	await logEventFromContext(ctx, 'ahrefs.siteExplorer.getReferringDomains', { ...input }, 'completed');
	return result;
};

export const getCountryMetrics: AhrefsEndpoints['siteExplorerCountryMetrics'] = async (
	ctx,
	input,
) => {
	const result = await makeAhrefsRequest<
		AhrefsEndpointOutputs['siteExplorerCountryMetrics']
	>('/v3/site-explorer/metrics-by-country', ctx.key, { query: { ...input } });

	if (result.successful && ctx.db.backlinksStats) {
		try {
			await ctx.db.backlinksStats.upsertByEntityId(`countryMetrics:${input.target}:${input.date}`, {
				id: `countryMetrics:${input.target}:${input.date}`,
				target: input.target,
				date: input.date,
				fetchedAt: new Date(),
			});
		} catch (error) {
			console.warn('[ahrefs] Failed to save country metrics:', error);
		}
	}

	await logEventFromContext(ctx, 'ahrefs.siteExplorer.getCountryMetrics', { ...input }, 'completed');
	return result;
};

export const getLinkedAnchorsExternal: AhrefsEndpoints['siteExplorerLinkedAnchorsExternal'] =
	async (ctx, input) => {
		const result = await makeAhrefsRequest<
			AhrefsEndpointOutputs['siteExplorerLinkedAnchorsExternal']
		>('/v3/site-explorer/linked-anchors-external', ctx.key, { query: { ...input } });

		if (result.successful && ctx.db.backlinksStats) {
			try {
				await ctx.db.backlinksStats.upsertByEntityId(
					`linkedAnchorsExternal:${input.target}`,
					{
						id: `linkedAnchorsExternal:${input.target}`,
						target: input.target,
						date: new Date().toISOString().split('T')[0]!,
						backlinks: result.data?.anchors?.length,
						fetchedAt: new Date(),
					},
				);
			} catch (error) {
				console.warn('[ahrefs] Failed to save linked anchors external summary:', error);
			}
		}

		await logEventFromContext(ctx, 'ahrefs.siteExplorer.getLinkedAnchorsExternal', { ...input }, 'completed');
		return result;
	};

export const getUrlRatingHistory: AhrefsEndpoints['siteExplorerUrlRatingHistory'] = async (
	ctx,
	input,
) => {
	const result = await makeAhrefsRequest<
		AhrefsEndpointOutputs['siteExplorerUrlRatingHistory']
	>('/v3/site-explorer/url-rating-history', ctx.key, { query: { ...input } });

	if (result.successful && result.data?.history?.length && ctx.db.domainRatings) {
		try {
			const latest = result.data.history[result.data.history.length - 1];
			// latest is Record<string, unknown>; url_rating is the primary metric
			const snapshotDate = latest?.['date'] as string | undefined;
			const url_rating = latest?.['url_rating'] as number | undefined;
			if (snapshotDate) {
				await ctx.db.domainRatings.upsertByEntityId(`urlRating:${input.target}:${snapshotDate}`, {
					id: `urlRating:${input.target}:${snapshotDate}`,
					target: input.target,
					date: snapshotDate,
					...(url_rating !== undefined ? { domain_rating: url_rating } : {}),
					fetchedAt: new Date(),
				});
			}
		} catch (error) {
			console.warn('[ahrefs] Failed to save URL rating history:', error);
		}
	}

	await logEventFromContext(ctx, 'ahrefs.siteExplorer.getUrlRatingHistory', { ...input }, 'completed');
	return result;
};

export const getLinkedAnchors: AhrefsEndpoints['siteExplorerLinkedAnchors'] = async (
	ctx,
	input,
) => {
	const result = await makeAhrefsRequest<
		AhrefsEndpointOutputs['siteExplorerLinkedAnchors']
	>('/v3/site-explorer/linked-anchors', ctx.key, { query: { ...input } });

	if (result.successful && ctx.db.backlinksStats) {
		try {
			await ctx.db.backlinksStats.upsertByEntityId(`linkedAnchors:${input.target}`, {
				id: `linkedAnchors:${input.target}`,
				target: input.target,
				date: new Date().toISOString().split('T')[0]!,
				backlinks: result.data?.anchors?.length,
				fetchedAt: new Date(),
			});
		} catch (error) {
			console.warn('[ahrefs] Failed to save linked anchors summary:', error);
		}
	}

	await logEventFromContext(ctx, 'ahrefs.siteExplorer.getLinkedAnchors', { ...input }, 'completed');
	return result;
};

export const getBestByExternalLinks: AhrefsEndpoints['siteExplorerBestByExternalLinks'] =
	async (ctx, input) => {
		const result = await makeAhrefsRequest<
			AhrefsEndpointOutputs['siteExplorerBestByExternalLinks']
		>('/v3/site-explorer/best-by-links', ctx.key, { query: { ...input } });

		if (result.successful && ctx.db.backlinksStats) {
			try {
				await ctx.db.backlinksStats.upsertByEntityId(`bestByExternalLinks:${input.target}`, {
					id: `bestByExternalLinks:${input.target}`,
					target: input.target,
					date: new Date().toISOString().split('T')[0]!,
					pages: result.data?.pages?.length,
					fetchedAt: new Date(),
				});
			} catch (error) {
				console.warn('[ahrefs] Failed to save best-by-external-links summary:', error);
			}
		}

		await logEventFromContext(ctx, 'ahrefs.siteExplorer.getBestByExternalLinks', { ...input }, 'completed');
		return result;
	};

export const getPagesByTraffic: AhrefsEndpoints['siteExplorerPagesByTraffic'] = async (
	ctx,
	input,
) => {
	const result = await makeAhrefsRequest<
		AhrefsEndpointOutputs['siteExplorerPagesByTraffic']
	>('/v3/site-explorer/pages-by-traffic', ctx.key, { query: { ...input } });

	if (result.successful && ctx.db.backlinksStats) {
		try {
			await ctx.db.backlinksStats.upsertByEntityId(`pagesByTraffic:${input.target}`, {
				id: `pagesByTraffic:${input.target}`,
				target: input.target,
				date: new Date().toISOString().split('T')[0]!,
				pages: result.data?.pages?.length,
				fetchedAt: new Date(),
			});
		} catch (error) {
			console.warn('[ahrefs] Failed to save pages-by-traffic summary:', error);
		}
	}

	await logEventFromContext(ctx, 'ahrefs.siteExplorer.getPagesByTraffic', { ...input }, 'completed');
	return result;
};

export const getAnchorData: AhrefsEndpoints['siteExplorerAnchorData'] = async (
	ctx,
	input,
) => {
	const result = await makeAhrefsRequest<
		AhrefsEndpointOutputs['siteExplorerAnchorData']
	>('/v3/site-explorer/anchors', ctx.key, { query: { ...input } });

	if (result.successful && ctx.db.backlinksStats) {
		try {
			await ctx.db.backlinksStats.upsertByEntityId(`anchorData:${input.target}`, {
				id: `anchorData:${input.target}`,
				target: input.target,
				date: new Date().toISOString().split('T')[0]!,
				backlinks: result.data?.anchors?.length,
				// Spread any scalar stats fields from the summary object
				...(typeof result.data?.stats === 'object' && result.data.stats !== null
					? result.data.stats
					: {}),
				fetchedAt: new Date(),
			});
		} catch (error) {
			console.warn('[ahrefs] Failed to save anchor data summary:', error);
		}
	}

	await logEventFromContext(ctx, 'ahrefs.siteExplorer.getAnchorData', { ...input }, 'completed');
	return result;
};

export const getBestByInternalLinks: AhrefsEndpoints['siteExplorerBestByInternalLinks'] =
	async (ctx, input) => {
		const result = await makeAhrefsRequest<
			AhrefsEndpointOutputs['siteExplorerBestByInternalLinks']
		>('/v3/site-explorer/best-by-links-internal', ctx.key, { query: { ...input } });

		if (result.successful && ctx.db.backlinksStats) {
			try {
				await ctx.db.backlinksStats.upsertByEntityId(`bestByInternalLinks:${input.target}`, {
					id: `bestByInternalLinks:${input.target}`,
					target: input.target,
					date: new Date().toISOString().split('T')[0]!,
					pages: result.data?.pages?.length,
					fetchedAt: new Date(),
				});
			} catch (error) {
				console.warn('[ahrefs] Failed to save best-by-internal-links summary:', error);
			}
		}

		await logEventFromContext(ctx, 'ahrefs.siteExplorer.getBestByInternalLinks', { ...input }, 'completed');
		return result;
	};

export const getOrganicCompetitors: AhrefsEndpoints['siteExplorerOrganicCompetitors'] =
	async (ctx, input) => {
		const result = await makeAhrefsRequest<
			AhrefsEndpointOutputs['siteExplorerOrganicCompetitors']
		>('/v3/site-explorer/organic-competitors', ctx.key, { query: { ...input } });

		if (result.successful && result.data?.competitors && ctx.db.domainRatings) {
			try {
				for (const competitor of result.data.competitors) {
					// competitor is Record<string, unknown>; domain identifies the competing site
					const domain = competitor['competitor'] as string | undefined;
					const domain_rating = competitor['domain_rating'] as number | undefined;
					if (domain) {
						await ctx.db.domainRatings.upsertByEntityId(
							`competitor:${domain}:${input.date}`,
							{
								id: `competitor:${domain}:${input.date}`,
								target: domain,
								date: input.date,
								...(domain_rating !== undefined ? { domain_rating } : {}),
								fetchedAt: new Date(),
							},
						);
					}
				}
			} catch (error) {
				console.warn('[ahrefs] Failed to save organic competitors:', error);
			}
		}

		await logEventFromContext(ctx, 'ahrefs.siteExplorer.getOrganicCompetitors', { ...input }, 'completed');
		return result;
	};

export const getOrganicKeywords: AhrefsEndpoints['siteExplorerOrganicKeywords'] = async (
	ctx,
	input,
) => {
	const result = await makeAhrefsRequest<
		AhrefsEndpointOutputs['siteExplorerOrganicKeywords']
	>('/v3/site-explorer/organic-keywords', ctx.key, { query: { ...input } });

	if (result.successful && result.data?.keywords && ctx.db.keywords) {
		try {
			for (const kw of result.data.keywords) {
				// kw is Record<string, unknown>; shape depends on the `select` param
				const keyword = kw['keyword'] as string | undefined;
				const volume = kw['volume'] as number | undefined;
				// Ahrefs uses `kd` for keyword difficulty
				const difficulty = kw['kd'] as number | undefined;
				const cpc = kw['cpc'] as number | undefined;
				if (keyword) {
					await ctx.db.keywords.upsertByEntityId(
						`${input.target}:${keyword}:${input.country}`,
						{
							id: `${input.target}:${keyword}:${input.country}`,
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
			console.warn('[ahrefs] Failed to save organic keywords:', error);
		}
	}

	await logEventFromContext(ctx, 'ahrefs.siteExplorer.getOrganicKeywords', { ...input }, 'completed');
	return result;
};

export const getOutlinksStats: AhrefsEndpoints['siteExplorerOutlinksStats'] = async (
	ctx,
	input,
) => {
	const result = await makeAhrefsRequest<
		AhrefsEndpointOutputs['siteExplorerOutlinksStats']
	>('/v3/site-explorer/outlinks-stats', ctx.key, { query: { ...input } });

	if (result.successful && result.data?.outlinks && ctx.db.backlinksStats) {
		try {
			await ctx.db.backlinksStats.upsertByEntityId(`outlinksStats:${input.target}`, {
				id: `outlinksStats:${input.target}`,
				target: input.target,
				date: new Date().toISOString().split('T')[0]!,
				// Spread the outlinks stats object (links_external, links_internal, etc.)
				...(typeof result.data.outlinks === 'object' ? result.data.outlinks : {}),
				fetchedAt: new Date(),
			});
		} catch (error) {
			console.warn('[ahrefs] Failed to save outlinks stats:', error);
		}
	}

	await logEventFromContext(ctx, 'ahrefs.siteExplorer.getOutlinksStats', { ...input }, 'completed');
	return result;
};

export const getPaidPages: AhrefsEndpoints['siteExplorerPaidPages'] = async (
	ctx,
	input,
) => {
	const result = await makeAhrefsRequest<
		AhrefsEndpointOutputs['siteExplorerPaidPages']
	>('/v3/site-explorer/paid-pages', ctx.key, { query: { ...input } });

	if (result.successful && result.data?.pages && ctx.db.keywords) {
		try {
			for (const page of result.data.pages) {
				// page is Record<string, unknown>; url identifies the paid page
				const url = page['url'] as string | undefined;
				const keyword = page['keyword'] as string | undefined;
				const volume = page['volume'] as number | undefined;
				const cpc = page['cpc'] as number | undefined;
				const dbKey = keyword ?? url;
				if (dbKey) {
					await ctx.db.keywords.upsertByEntityId(`paid:${input.target}:${dbKey}`, {
						id: `paid:${input.target}:${dbKey}`,
						keyword: keyword ?? url ?? dbKey,
						country: input.country,
						...(volume !== undefined ? { volume } : {}),
						...(cpc !== undefined ? { cpc } : {}),
						fetchedAt: new Date(),
					});
				}
			}
		} catch (error) {
			console.warn('[ahrefs] Failed to save paid pages:', error);
		}
	}

	await logEventFromContext(ctx, 'ahrefs.siteExplorer.getPaidPages', { ...input }, 'completed');
	return result;
};

export const getKeywordsHistory: AhrefsEndpoints['siteExplorerKeywordsHistory'] = async (
	ctx,
	input,
) => {
	const result = await makeAhrefsRequest<
		AhrefsEndpointOutputs['siteExplorerKeywordsHistory']
	>('/v3/site-explorer/keywords-history', ctx.key, { query: { ...input } });

	if (result.successful && result.data?.keywords && ctx.db.keywords) {
		try {
			// Store the latest snapshot entry for this target
			const latest = result.data.keywords[result.data.keywords.length - 1];
			// latest is Record<string, unknown>; date identifies the snapshot
			const snapshotDate = latest?.['date'] as string | undefined;
			if (snapshotDate) {
				await ctx.db.keywords.upsertByEntityId(
					`kwHistory:${input.target}:${snapshotDate}`,
					{
						id: `kwHistory:${input.target}:${snapshotDate}`,
						keyword: input.target,
						country: input.country,
						fetchedAt: new Date(),
					},
				);
			}
		} catch (error) {
			console.warn('[ahrefs] Failed to save keywords history:', error);
		}
	}

	await logEventFromContext(ctx, 'ahrefs.siteExplorer.getKeywordsHistory', { ...input }, 'completed');
	return result;
};

export const getMetrics: AhrefsEndpoints['siteExplorerMetrics'] = async (
	ctx,
	input,
) => {
	const result = await makeAhrefsRequest<
		AhrefsEndpointOutputs['siteExplorerMetrics']
	>('/v3/site-explorer/metrics', ctx.key, { query: { ...input } });

	if (result.successful && result.data && ctx.db.backlinksStats) {
		try {
			await ctx.db.backlinksStats.upsertByEntityId(`metrics:${input.target}:${input.date}`, {
				id: `metrics:${input.target}:${input.date}`,
				target: input.target,
				date: input.date,
				// Spread all metrics fields returned (backlinks, refdomains, refpages, etc.)
				...result.data,
				fetchedAt: new Date(),
			});
		} catch (error) {
			console.warn('[ahrefs] Failed to save site explorer metrics:', error);
		}
	}

	await logEventFromContext(ctx, 'ahrefs.siteExplorer.getMetrics', { ...input }, 'completed');
	return result;
};

export const getMetricsHistory: AhrefsEndpoints['siteExplorerMetricsHistory'] = async (
	ctx,
	input,
) => {
	const result = await makeAhrefsRequest<
		AhrefsEndpointOutputs['siteExplorerMetricsHistory']
	>('/v3/site-explorer/metrics-history', ctx.key, { query: { ...input } });

	if (result.successful && result.data?.metrics?.length && ctx.db.backlinksStats) {
		try {
			// Store the latest snapshot of historical metrics
			const latest = result.data.metrics[result.data.metrics.length - 1];
			// latest is Record<string, unknown>; date identifies the snapshot
			const snapshotDate = latest?.['date'] as string | undefined;
			if (snapshotDate) {
				await ctx.db.backlinksStats.upsertByEntityId(
					`metricsHistory:${input.target}:${snapshotDate}`,
					{
						id: `metricsHistory:${input.target}:${snapshotDate}`,
						target: input.target,
						date: snapshotDate,
						// Spread all snapshot metric fields
						...(typeof latest === 'object' && latest !== null ? latest : {}),
						fetchedAt: new Date(),
					},
				);
			}
		} catch (error) {
			console.warn('[ahrefs] Failed to save metrics history:', error);
		}
	}

	await logEventFromContext(ctx, 'ahrefs.siteExplorer.getMetricsHistory', { ...input }, 'completed');
	return result;
};

export const getPagesHistory: AhrefsEndpoints['siteExplorerPagesHistory'] = async (
	ctx,
	input,
) => {
	const result = await makeAhrefsRequest<
		AhrefsEndpointOutputs['siteExplorerPagesHistory']
	>('/v3/site-explorer/pages-history', ctx.key, { query: { ...input } });

	if (result.successful && result.data?.history?.length && ctx.db.backlinksStats) {
		try {
			const latest = result.data.history[result.data.history.length - 1];
			// latest is Record<string, unknown>; date identifies the snapshot
			const snapshotDate = latest?.['date'] as string | undefined;
			if (snapshotDate) {
				await ctx.db.backlinksStats.upsertByEntityId(
					`pagesHistory:${input.target}:${snapshotDate}`,
					{
						id: `pagesHistory:${input.target}:${snapshotDate}`,
						target: result.data.target ?? input.target,
						date: snapshotDate,
						// Spread all snapshot fields (pages, crawled_pages, etc.)
						...(typeof latest === 'object' && latest !== null ? latest : {}),
						fetchedAt: new Date(),
					},
				);
			}
		} catch (error) {
			console.warn('[ahrefs] Failed to save pages history:', error);
		}
	}

	await logEventFromContext(ctx, 'ahrefs.siteExplorer.getPagesHistory', { ...input }, 'completed');
	return result;
};

export const getReferringDomainsHistory: AhrefsEndpoints['siteExplorerReferringDomainsHistory'] =
	async (ctx, input) => {
		const result = await makeAhrefsRequest<
			AhrefsEndpointOutputs['siteExplorerReferringDomainsHistory']
		>('/v3/site-explorer/refdomains-history', ctx.key, { query: { ...input } });

		if (result.successful && result.data?.history?.length && ctx.db.backlinksStats) {
			try {
				const latest = result.data.history[result.data.history.length - 1];
				// latest is Record<string, unknown>; date identifies the snapshot
				const snapshotDate = latest?.['date'] as string | undefined;
				const refdomains = latest?.['refdomains'] as number | undefined;
				if (snapshotDate) {
					await ctx.db.backlinksStats.upsertByEntityId(
						`refdomainsHistory:${input.target}:${snapshotDate}`,
						{
							id: `refdomainsHistory:${input.target}:${snapshotDate}`,
							target: input.target,
							date: snapshotDate,
							...(refdomains !== undefined ? { refdomains } : {}),
							fetchedAt: new Date(),
						},
					);
				}
			} catch (error) {
				console.warn('[ahrefs] Failed to save referring domains history:', error);
			}
		}

		await logEventFromContext(ctx, 'ahrefs.siteExplorer.getReferringDomainsHistory', { ...input }, 'completed');
		return result;
	};

export const getTopPages: AhrefsEndpoints['siteExplorerTopPages'] = async (
	ctx,
	input,
) => {
	const result = await makeAhrefsRequest<
		AhrefsEndpointOutputs['siteExplorerTopPages']
	>('/v3/site-explorer/top-pages', ctx.key, { query: { ...input } });

	if (result.successful && result.data?.pages && ctx.db.keywords) {
		try {
			for (const page of result.data.pages) {
				// page is Record<string, unknown>; url identifies the page
				const url = page['url'] as string | undefined;
				const traffic = page['traffic'] as number | undefined;
				if (url) {
					await ctx.db.keywords.upsertByEntityId(`topPage:${input.target}:${url}`, {
						id: `topPage:${input.target}:${url}`,
						keyword: url,
						country: input.country,
						...(traffic !== undefined ? { volume: traffic } : {}),
						fetchedAt: new Date(),
					});
				}
			}
		} catch (error) {
			console.warn('[ahrefs] Failed to save top pages:', error);
		}
	}

	await logEventFromContext(ctx, 'ahrefs.siteExplorer.getTopPages', { ...input }, 'completed');
	return result;
};

export const getLinkedDomains: AhrefsEndpoints['siteExplorerLinkedDomains'] = async (
	ctx,
	input,
) => {
	const result = await makeAhrefsRequest<
		AhrefsEndpointOutputs['siteExplorerLinkedDomains']
	>('/v3/site-explorer/linked-domains', ctx.key, { query: { ...input } });

	if (result.successful && result.data?.domains && ctx.db.domainRatings) {
		try {
			for (const domain of result.data.domains) {
				// domain is Record<string, unknown>; domain field identifies the linked domain
				const domainName = domain['domain'] as string | undefined;
				const domain_rating = domain['domain_rating'] as number | undefined;
				if (domainName) {
					await ctx.db.domainRatings.upsertByEntityId(
						`linkedDomain:${input.target}:${domainName}`,
						{
							id: `linkedDomain:${input.target}:${domainName}`,
							target: domainName,
							date: new Date().toISOString().split('T')[0]!,
							...(domain_rating !== undefined ? { domain_rating } : {}),
							fetchedAt: new Date(),
						},
					);
				}
			}
		} catch (error) {
			console.warn('[ahrefs] Failed to save linked domains:', error);
		}
	}

	await logEventFromContext(ctx, 'ahrefs.siteExplorer.getLinkedDomains', { ...input }, 'completed');
	return result;
};
