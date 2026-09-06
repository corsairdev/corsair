import { SpokiClient } from '../client';
import type { SpokiContext } from '../index';
import type { ListAccountsResponse } from './types';
import { EndpointInputSchemas } from './types';

export const listAccounts = async (
	ctx: SpokiContext & { key: string },
	input: Record<string, never>,
): Promise<ListAccountsResponse> => {
	EndpointInputSchemas.listAccounts.parse(input ?? {});

	const client = new SpokiClient({ apiKey: ctx.key });

	return client.get<ListAccountsResponse>('/accounts/');
};
