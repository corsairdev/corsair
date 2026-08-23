import { CloudflareBrowserRenderingClient } from '../client';
import type { CloudflareBrowserRenderingContext } from '../index';
import type { ListAccountsGetResponse } from './types';

export const ListAccounts = {
	get: async (
		ctx: CloudflareBrowserRenderingContext,
	): Promise<ListAccountsGetResponse> => {
		const client = new CloudflareBrowserRenderingClient(ctx);
		return client.listAccounts();
	},
};
