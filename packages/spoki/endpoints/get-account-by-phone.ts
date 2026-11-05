import { SpokiClient } from '../client';
import type { SpokiContext } from '../index';
import type { GetAccountByPhoneResponse } from './types';
import { EndpointInputSchemas, EndpointOutputSchemas } from './types';

export const getAccountByPhone = async (
	ctx: SpokiContext & { key: string },
	input: { phone: string },
): Promise<GetAccountByPhoneResponse> => {
	const parsed = EndpointInputSchemas.getAccountByPhone.parse(input);

	const client = new SpokiClient({ apiKey: ctx.key });

	const result = await client.get<unknown>(
		`/accounts/phone/${encodeURIComponent(parsed.phone)}/`,
	);

	return EndpointOutputSchemas.getAccountByPhone.parse(result);
};
