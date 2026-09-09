import { makeCodacyRequest } from '../client';
import type { CodacyContext } from '../index';
import type {
	CreateApiTokenInput,
	CreateApiTokenResponse,
	DeleteApiTokenInput,
	DeleteApiTokenResponse,
	GetAccountDetailsInput,
	GetAccountDetailsResponse,
} from './types';

export const Account = {
	createApiToken: async (
		ctx: CodacyContext,
		input: CreateApiTokenInput,
	): Promise<CreateApiTokenResponse> => {
		const apiKey = ctx.key ?? '';
		let route = '/account/api-tokens';

		return makeCodacyRequest<CreateApiTokenResponse>(route, apiKey, {
			method: 'POST',
		});
	},
	deleteApiToken: async (
		ctx: CodacyContext,
		input: DeleteApiTokenInput,
	): Promise<DeleteApiTokenResponse> => {
		const apiKey = ctx.key ?? '';
		let route = '/account/api-tokens/{tokenId}';
		route = route.replace('{tokenId}', input.tokenId);
		return makeCodacyRequest<DeleteApiTokenResponse>(route, apiKey, {
			method: 'DELETE',
		});
	},
	getAccountDetails: async (
		ctx: CodacyContext,
		input: GetAccountDetailsInput,
	): Promise<GetAccountDetailsResponse> => {
		const apiKey = ctx.key ?? '';
		let route = '/account';

		return makeCodacyRequest<GetAccountDetailsResponse>(route, apiKey, {
			method: 'GET',
		});
	},
};
