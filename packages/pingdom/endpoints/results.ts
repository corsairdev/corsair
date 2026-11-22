import type { PingdomEndpoints } from '..';
import { call } from './call';
import {
	PingdomEndpointInputSchemas as Inputs,
	PingdomEndpointOutputSchemas as Outputs,
} from './types';

const V31 = '/api/3.1';

export const listAnalysis: PingdomEndpoints['analysisList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'analysis.list',
			input: Inputs.analysisList,
			output: Outputs.analysisList,
		},
		input,
		({ checkId, limit, offset }) => ({
			method: 'GET',
			path: `${V31}/analysis/${checkId}`,
			query: { limit, offset },
		}),
		{ log: (_, page) => ({ count: page.analysis.length }) },
	);

export const getAnalysis: PingdomEndpoints['analysisGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'analysis.get',
			input: Inputs.analysisGet,
			output: Outputs.analysisGet,
		},
		input,
		({ checkId, analysisId }) => ({
			method: 'GET',
			path: `${V31}/analysis/${checkId}/${analysisId}`,
		}),
		{ log: ({ checkId, analysisId }) => ({ checkId, analysisId }) },
	);

export const listResults: PingdomEndpoints['resultsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'results.list',
			input: Inputs.resultsList,
			output: Outputs.resultsList,
		},
		input,
		({
			checkId,
			from,
			to,
			probes,
			status,
			limit,
			offset,
			includeAnalysis,
			maxResponse,
			minResponse,
		}) => ({
			method: 'GET',
			path: `${V31}/results/${checkId}`,
			query: {
				from,
				to,
				probes,
				status,
				limit,
				offset,
				includeanalysis: includeAnalysis,
				maxresponse: maxResponse,
				minresponse: minResponse,
			},
		}),
		{ log: (_, page) => ({ count: page.results.length }) },
	);
