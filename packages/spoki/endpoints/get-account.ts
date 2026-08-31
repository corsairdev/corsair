import type { SpokiClient } from '../client';
import type { GetAccountResponse } from './types';

export async function getAccount(
	client: SpokiClient,
	accountId: number,
): Promise<GetAccountResponse> {
	return client.get<GetAccountResponse>(`/accounts/${accountId}`);
}
