import { makeCodacyRequest } from '../client';
import type { CodacyContext } from '../index';
import type {
	GetToolPatternInput,
	GetToolPatternResponse,
	ListDuplicationToolsInput,
	ListDuplicationToolsResponse,
	ListLanguagesAndToolsInput,
	ListLanguagesAndToolsResponse,
	ListMetricsToolsInput,
	ListMetricsToolsResponse,
	ListToolsInput,
	ListToolsPatternsInput,
	ListToolsPatternsResponse,
	ListToolsResponse,
} from './types';

export const Tools = {
	getToolPattern: async (
		ctx: CodacyContext,
		input: GetToolPatternInput,
	): Promise<GetToolPatternResponse> => {
		const apiKey = ctx.key ?? '';
		let route = '/tools/{toolUuid}/patterns/{patternId}';
		route = route.replace('{toolUuid}', input.toolUuid);
		route = route.replace('{patternId}', input.patternId);
		return makeCodacyRequest<GetToolPatternResponse>(route, apiKey, {
			method: 'GET',
		});
	},
	listDuplicationTools: async (
		ctx: CodacyContext,
		input: ListDuplicationToolsInput,
	): Promise<ListDuplicationToolsResponse> => {
		const apiKey = ctx.key ?? '';
		let route = '/tools/duplication';

		return makeCodacyRequest<ListDuplicationToolsResponse>(route, apiKey, {
			method: 'GET',
		});
	},
	listLanguagesAndTools: async (
		ctx: CodacyContext,
		input: ListLanguagesAndToolsInput,
	): Promise<ListLanguagesAndToolsResponse> => {
		const apiKey = ctx.key ?? '';
		let route = '/tools/languages';

		return makeCodacyRequest<ListLanguagesAndToolsResponse>(route, apiKey, {
			method: 'GET',
		});
	},
	listMetricsTools: async (
		ctx: CodacyContext,
		input: ListMetricsToolsInput,
	): Promise<ListMetricsToolsResponse> => {
		const apiKey = ctx.key ?? '';
		let route = '/tools/metrics';

		return makeCodacyRequest<ListMetricsToolsResponse>(route, apiKey, {
			method: 'GET',
		});
	},
	listTools: async (
		ctx: CodacyContext,
		input: ListToolsInput,
	): Promise<ListToolsResponse> => {
		const apiKey = ctx.key ?? '';
		let route = '/tools';

		return makeCodacyRequest<ListToolsResponse>(route, apiKey, {
			method: 'GET',
		});
	},
	listToolsPatterns: async (
		ctx: CodacyContext,
		input: ListToolsPatternsInput,
	): Promise<ListToolsPatternsResponse> => {
		const apiKey = ctx.key ?? '';
		let route = '/tools/{toolUuid}/patterns';
		route = route.replace('{toolUuid}', input.toolUuid);
		return makeCodacyRequest<ListToolsPatternsResponse>(route, apiKey, {
			method: 'GET',
		});
	},
};
