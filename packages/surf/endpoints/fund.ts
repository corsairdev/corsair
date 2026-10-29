import type { SurfContext } from '../index';
import { callSurf } from './call';
import type { SurfEndpointInputs } from './types';
import {
	FundDetailInput,
	FundDetailOutput,
	FundPortfolioInput,
	FundPortfolioOutput,
	FundRankingInput,
	FundRankingOutput,
} from './types';

export const Fund = {
	detail: (ctx: SurfContext, input: SurfEndpointInputs['fundDetail']) =>
		callSurf(
			ctx,
			'fund.detail',
			FundDetailInput,
			FundDetailOutput,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/fund/detail',
				query: omitEmpty({ id: validated.id, q: validated.q }),
			}),
			(validated) => ({ id: String(validated.id ?? '') }),
		),
	portfolio: (ctx: SurfContext, input: SurfEndpointInputs['fundPortfolio']) =>
		callSurf(
			ctx,
			'fund.portfolio',
			FundPortfolioInput,
			FundPortfolioOutput,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/fund/portfolio',
				query: omitEmpty({
					id: validated.id,
					q: validated.q,
					limit: validated.limit,
					offset: validated.offset,
					is_lead: validated.is_lead,
					invested_after: validated.invested_after,
					invested_before: validated.invested_before,
					sort_by: validated.sort_by,
					order: validated.order,
				}),
			}),
			(validated) => ({ id: String(validated.id ?? '') }),
		),
	ranking: (ctx: SurfContext, input: SurfEndpointInputs['fundRanking']) =>
		callSurf(
			ctx,
			'fund.ranking',
			FundRankingInput,
			FundRankingOutput,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/fund/ranking',
				query: omitEmpty({
					metric: validated.metric,
					limit: validated.limit,
					offset: validated.offset,
				}),
			}),
			(validated) => ({ metric: String(validated.metric ?? '') }),
		),
};

function omitEmpty<T extends Record<string, unknown>>(value: T): T {
	// Optional query and body fields are omitted. The helper is generic over that object.
	const next = { ...value };
	for (const key of Object.keys(next)) {
		if (next[key] === undefined) delete next[key];
	}
	return next;
}
