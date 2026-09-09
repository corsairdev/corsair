import { makeCodacyRequest } from '../client';
import type { CodacyContext } from '../index';
import type {
	ListLoginIntegrationsInput,
	ListLoginIntegrationsResponse,
	ListProviderIntegrationsInput,
	ListProviderIntegrationsResponse,
} from './types';

export const Integrations = {
	listLoginIntegrations: async (
		ctx: CodacyContext,
		input: ListLoginIntegrationsInput,
	): Promise<ListLoginIntegrationsResponse> => {
		const apiKey = ctx.key ?? '';
		let route = '/integrations/login';

		return makeCodacyRequest<ListLoginIntegrationsResponse>(route, apiKey, {
			method: 'GET',
		});
	},
	listProviderIntegrations: async (
		ctx: CodacyContext,
		input: ListProviderIntegrationsInput,
	): Promise<ListProviderIntegrationsResponse> => {
		const apiKey = ctx.key ?? '';
		let route = '/integrations/provider';

		return makeCodacyRequest<ListProviderIntegrationsResponse>(route, apiKey, {
			method: 'GET',
		});
	},
};
