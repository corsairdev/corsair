import type { SpokiClient } from '../client';
import type { ListAccountsResponse } from './types';

export async function listAccounts(
	client: SpokiClient,
): Promise<ListAccountsResponse> {
	return client.get<ListAccountsResponse>('/accounts');
}
