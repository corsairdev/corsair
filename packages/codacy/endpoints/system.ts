import { makeCodacyRequest } from '../client';
import type { CodacyContext } from '../index';
import type {
	GetConfigurationStatusInput,
	GetConfigurationStatusResponse,
	GetHealthInput,
	GetHealthResponse,
	GetVersionInput,
	GetVersionResponse,
} from './types';

export const System = {
	getConfigurationStatus: async (
		ctx: CodacyContext,
		input: GetConfigurationStatusInput,
	): Promise<GetConfigurationStatusResponse> => {
		const apiKey = ctx.key ?? '';
		let route = '/configuration/status';

		return makeCodacyRequest<GetConfigurationStatusResponse>(route, apiKey, {
			method: 'GET',
		});
	},
	getHealth: async (
		ctx: CodacyContext,
		input: GetHealthInput,
	): Promise<GetHealthResponse> => {
		const apiKey = ctx.key ?? '';
		let route = '/health';

		return makeCodacyRequest<GetHealthResponse>(route, apiKey, {
			method: 'GET',
		});
	},
	getVersion: async (
		ctx: CodacyContext,
		input: GetVersionInput,
	): Promise<GetVersionResponse> => {
		const apiKey = ctx.key ?? '';
		let route = '/version';

		return makeCodacyRequest<GetVersionResponse>(route, apiKey, {
			method: 'GET',
		});
	},
};
