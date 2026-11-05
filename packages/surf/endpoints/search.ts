import type { SurfContext } from '../index';
import { callSurf } from './call';
import type { SurfEndpointInputs } from './types';
import {
	SearchAirdropActivitiesInput,
	SearchAirdropActivitiesOutput,
	SearchAirdropInput,
	SearchAirdropOutput,
	SearchEventsInput,
	SearchEventsOutput,
	SearchFundInput,
	SearchFundOutput,
	SearchFundraisingInput,
	SearchFundraisingOutput,
	SearchNewsInput,
	SearchNewsOutput,
	SearchPredictionMarketInput,
	SearchPredictionMarketOutput,
	SearchProjectInput,
	SearchProjectOutput,
	SearchTokenInput,
	SearchTokenOutput,
	SearchWalletInput,
	SearchWalletOutput,
	SearchWebInput,
	SearchWebOutput,
} from './types';

export const Search = {
	airdrop: (ctx: SurfContext, input: SurfEndpointInputs['searchAirdrop']) =>
		callSurf(
			ctx,
			'search.airdrop',
			SearchAirdropInput,
			SearchAirdropOutput,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/search/airdrop',
				query: omitEmpty({
					q: validated.q,
					phase: validated.phase,
					reward_type: validated.reward_type,
					task_type: validated.task_type,
					has_open: validated.has_open,
					sort_by: validated.sort_by,
					order: validated.order,
					limit: validated.limit,
					offset: validated.offset,
					include_tasks: validated.include_tasks,
				}),
			}),
			(validated) => ({ q: String(validated.q ?? '') }),
		),
	airdropActivities: (
		ctx: SurfContext,
		input: SurfEndpointInputs['searchAirdropActivities'],
	) =>
		callSurf(
			ctx,
			'search.airdropActivities',
			SearchAirdropActivitiesInput,
			SearchAirdropActivitiesOutput,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/search/airdrop/activities',
				query: omitEmpty({ limit: validated.limit, offset: validated.offset }),
			}),
			(validated) => ({ limit: String(validated.limit ?? '') }),
		),
	events: (ctx: SurfContext, input: SurfEndpointInputs['searchEvents']) =>
		callSurf(
			ctx,
			'search.events',
			SearchEventsInput,
			SearchEventsOutput,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/search/events',
				query: omitEmpty({
					id: validated.id,
					q: validated.q,
					type: validated.type,
					limit: validated.limit,
					offset: validated.offset,
				}),
			}),
			(validated) => ({ id: String(validated.id ?? '') }),
		),
	fund: (ctx: SurfContext, input: SurfEndpointInputs['searchFund']) =>
		callSurf(
			ctx,
			'search.fund',
			SearchFundInput,
			SearchFundOutput,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/search/fund',
				query: omitEmpty({
					q: validated.q,
					limit: validated.limit,
					offset: validated.offset,
				}),
			}),
			(validated) => ({ q: String(validated.q ?? '') }),
		),
	fundraising: (
		ctx: SurfContext,
		input: SurfEndpointInputs['searchFundraising'],
	) =>
		callSurf(
			ctx,
			'search.fundraising',
			SearchFundraisingInput,
			SearchFundraisingOutput,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/search/fundraising',
				query: omitEmpty({
					q: validated.q,
					from: validated.from,
					to: validated.to,
					source: validated.source,
					lang: validated.lang,
					min_importance: validated.min_importance,
					sort_by: validated.sort_by,
					order: validated.order,
					limit: validated.limit,
					offset: validated.offset,
				}),
			}),
			(validated) => ({ q: String(validated.q ?? '') }),
		),
	news: (ctx: SurfContext, input: SurfEndpointInputs['searchNews']) =>
		callSurf(
			ctx,
			'search.news',
			SearchNewsInput,
			SearchNewsOutput,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/search/news',
				query: omitEmpty({
					q: validated.q,
					limit: validated.limit,
					offset: validated.offset,
				}),
			}),
			(validated) => ({ q: String(validated.q ?? '') }),
		),
	predictionMarket: (
		ctx: SurfContext,
		input: SurfEndpointInputs['searchPredictionMarket'],
	) =>
		callSurf(
			ctx,
			'search.predictionMarket',
			SearchPredictionMarketInput,
			SearchPredictionMarketOutput,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/search/prediction-market',
				query: omitEmpty({
					condition_id: validated.condition_id,
					market_ticker: validated.market_ticker,
					platform: validated.platform,
					category: validated.category,
					status: validated.status,
					sort_by: validated.sort_by,
					order: validated.order,
					smart_money: validated.smart_money,
					q: validated.q,
					limit: validated.limit,
					offset: validated.offset,
				}),
			}),
			(validated) => ({ condition_id: String(validated.condition_id ?? '') }),
		),
	project: (ctx: SurfContext, input: SurfEndpointInputs['searchProject']) =>
		callSurf(
			ctx,
			'search.project',
			SearchProjectInput,
			SearchProjectOutput,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/search/project',
				query: omitEmpty({
					q: validated.q,
					limit: validated.limit,
					offset: validated.offset,
				}),
			}),
			(validated) => ({ q: String(validated.q ?? '') }),
		),
	token: (ctx: SurfContext, input: SurfEndpointInputs['searchToken']) =>
		callSurf(
			ctx,
			'search.token',
			SearchTokenInput,
			SearchTokenOutput,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/search/token',
				query: omitEmpty({
					q: validated.q,
					chain: validated.chain,
					limit: validated.limit,
					offset: validated.offset,
				}),
			}),
			(validated) => ({ q: String(validated.q ?? '') }),
		),
	wallet: (ctx: SurfContext, input: SurfEndpointInputs['searchWallet']) =>
		callSurf(
			ctx,
			'search.wallet',
			SearchWalletInput,
			SearchWalletOutput,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/search/wallet',
				query: omitEmpty({
					q: validated.q,
					limit: validated.limit,
					offset: validated.offset,
				}),
			}),
			(validated) => ({ q: String(validated.q ?? '') }),
		),
	web: (ctx: SurfContext, input: SurfEndpointInputs['searchWeb']) =>
		callSurf(
			ctx,
			'search.web',
			SearchWebInput,
			SearchWebOutput,
			input,
			(validated) => ({
				method: 'GET',
				url: '/gateway/v1/search/web',
				query: omitEmpty({
					q: validated.q,
					limit: validated.limit,
					offset: validated.offset,
					site: validated.site,
					include_content: validated.include_content,
				}),
			}),
			(validated) => ({ q: String(validated.q ?? '') }),
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
