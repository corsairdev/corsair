import type { AnthropicAdminContext } from '../index';
import type { ListWorkspacesInput, ListWorkspacesResponse } from './types';
import { makeAnthropicAdminRequest } from '../client';

export const Workspaces = {
	list: async (
		ctx: AnthropicAdminContext,
		input: ListWorkspacesInput,
	): Promise<ListWorkspacesResponse> => {
		const apiKey = ctx.key;

		return makeAnthropicAdminRequest<ListWorkspacesResponse>(
			'/v1/workspaces',
			apiKey,
			{
				method: 'GET',
				query: input as Record<string, string | number | boolean | undefined>,
			},
		);
	},
};
