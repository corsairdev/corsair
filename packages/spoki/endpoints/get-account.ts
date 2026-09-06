import { SpokiClient } from '../client';
import type { SpokiContext } from '../index';
import type { GetAccountResponse } from './types';
import { EndpointInputSchemas } from './types';

export const getAccount = async (
	ctx: SpokiContext & { key: string },
	input: { accountId: number },
): Promise<GetAccountResponse> => {
	const parsed = EndpointInputSchemas.getAccount.parse(input);

	const client = new SpokiClient({ apiKey: ctx.key });

	return client.get<GetAccountResponse>(`/accounts/${parsed.accountId}/`);
};
