import type { OrbitContext } from '../index';
import { readBilling } from '../schema/database';
import { callOrbit, omitUndefined } from './call';
import { rememberOperation } from './persist';
import type { OrbitEndpointInputs } from './types';
import {
	GetSearchInput,
	PopulationQuote,
	QuotePopulationInput,
	SearchSnapshot,
	StartPopulationInput,
	StartSearchInput,
} from './types';

async function rememberSearch(
	ctx: OrbitContext,
	response: {
		search_id: string;
		status: 'running' | 'completed' | 'completed_with_errors' | 'failed';
		request_id?: string;
		updated_at?: string;
		// Snapshot billing is an open object until readBilling keeps the credit fields.
		billing?: unknown;
	},
) {
	await rememberOperation(ctx, 'searches', {
		searchId: response.search_id,
		status: response.status,
		requestId: response.request_id,
		updatedAt: response.updated_at,
		billing: readBilling(response.billing),
	});
}

export const Search = {
	start: async (
		ctx: OrbitContext,
		input: OrbitEndpointInputs['startSearch'],
	) => {
		const response = await callOrbit(
			ctx,
			'search.start',
			StartSearchInput,
			SearchSnapshot,
			input,
			(validated) => ({
				method: 'POST',
				url: '/v3/search',
				body: omitUndefined(validated),
				idempotencyKey: validated.request_id,
			}),
			(_validated, result) => ({ searchId: result.search_id }),
		);
		await rememberSearch(ctx, response);
		return response;
	},
	get: async (ctx: OrbitContext, input: OrbitEndpointInputs['getSearch']) => {
		const response = await callOrbit(
			ctx,
			'search.get',
			GetSearchInput,
			SearchSnapshot,
			input,
			(validated) => ({
				method: 'GET',
				url: '/v3/search/{search_id}',
				path: { search_id: validated.search_id },
			}),
			(validated, result) => ({
				searchId: result.search_id || validated.search_id,
			}),
		);
		await rememberSearch(ctx, response);
		return response;
	},
	quotePopulation: (
		ctx: OrbitContext,
		input: OrbitEndpointInputs['quotePopulation'],
	) =>
		callOrbit(
			ctx,
			'search.quotePopulation',
			QuotePopulationInput,
			PopulationQuote,
			input,
			(validated) => ({
				method: 'POST',
				url: '/v3/search/populations/quote',
				body: omitUndefined(validated),
			}),
			(validated) => ({ kind: validated.population.kind }),
		),
	startPopulation: async (
		ctx: OrbitContext,
		input: OrbitEndpointInputs['startPopulation'],
	) => {
		const response = await callOrbit(
			ctx,
			'search.startPopulation',
			StartPopulationInput,
			SearchSnapshot,
			input,
			(validated) => ({
				method: 'POST',
				url: '/v3/search/populations',
				body: omitUndefined(validated),
				idempotencyKey: validated.request_id,
			}),
			(_validated, result) => ({ searchId: result.search_id }),
		);
		await rememberSearch(ctx, response);
		return response;
	},
};
