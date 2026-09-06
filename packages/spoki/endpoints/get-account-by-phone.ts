import { SpokiClient } from '../client';
import type { SpokiContext } from '../index';
import type { GetAccountByPhoneResponse } from './types';
import { EndpointInputSchemas } from './types';

export const getAccountByPhone = async (
	ctx: SpokiContext & { key: string },
	input: { phone: string },
): Promise<GetAccountByPhoneResponse> => {
	const parsed = EndpointInputSchemas.getAccountByPhone.parse(input);

	const client = new SpokiClient({ apiKey: ctx.key });

	return client.get<GetAccountByPhoneResponse>(
		`/accounts/phone/${encodeURIComponent(parsed.phone)}/`,
	);
};
