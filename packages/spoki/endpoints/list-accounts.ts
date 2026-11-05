import { SpokiClient } from '../client';
import type { SpokiContext } from '../index';
import type { ListAccountsResponse } from './types';
import { EndpointInputSchemas, EndpointOutputSchemas } from './types';

export const listAccounts = async (
	ctx: SpokiContext & { key: string },
	input: Record<string, never>,
): Promise<ListAccountsResponse> => {
	EndpointInputSchemas.listAccounts.parse(input ?? {});

	const client = new SpokiClient({ apiKey: ctx.key });

	const result = await client.get<unknown>('/accounts/');

	return EndpointOutputSchemas.listAccounts.parse(result);
};
