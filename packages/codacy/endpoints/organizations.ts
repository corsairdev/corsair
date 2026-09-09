import { makeCodacyRequest } from '../client';
import type { CodacyContext } from '../index';
import type {
	GetOrganizationsRepositoriesSettingsLanguagesInput,
	GetOrganizationsRepositoriesSettingsLanguagesResponse,
	GetUserOrganizationsInput,
	GetUserOrganizationsResponse,
	ListAnalysisOrganizationsRepositoriesInput,
	ListAnalysisOrganizationsRepositoriesResponse,
} from './types';

export const Organizations = {
	getOrganizationsRepositoriesSettingsLanguages: async (
		ctx: CodacyContext,
		input: GetOrganizationsRepositoriesSettingsLanguagesInput,
	): Promise<GetOrganizationsRepositoriesSettingsLanguagesResponse> => {
		const apiKey = ctx.key ?? '';
		let route =
			'/organizations/{provider}/{organizationName}/repositories/{repositoryName}/settings/languages';
		route = route.replace('{provider}', input.provider);
		route = route.replace('{organizationName}', input.organizationName);
		route = route.replace('{repositoryName}', input.repositoryName);
		return makeCodacyRequest<GetOrganizationsRepositoriesSettingsLanguagesResponse>(
			route,
			apiKey,
			{ method: 'GET' },
		);
	},
	getUserOrganizations: async (
		ctx: CodacyContext,
		input: GetUserOrganizationsInput,
	): Promise<GetUserOrganizationsResponse> => {
		const apiKey = ctx.key ?? '';
		let route = '/user/organizations/{provider}';
		route = route.replace('{provider}', input.provider);
		return makeCodacyRequest<GetUserOrganizationsResponse>(route, apiKey, {
			method: 'GET',
		});
	},
	listAnalysisOrganizationsRepositories: async (
		ctx: CodacyContext,
		input: ListAnalysisOrganizationsRepositoriesInput,
	): Promise<ListAnalysisOrganizationsRepositoriesResponse> => {
		const apiKey = ctx.key ?? '';
		let route = '/organizations/{provider}/{organizationName}/repositories';
		route = route.replace('{provider}', input.provider);
		route = route.replace('{organizationName}', input.organizationName);
		return makeCodacyRequest<ListAnalysisOrganizationsRepositoriesResponse>(
			route,
			apiKey,
			{ method: 'GET' },
		);
	},
};
