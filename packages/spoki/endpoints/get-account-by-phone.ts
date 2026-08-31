import type { SpokiClient } from '../client';
import type { GetAccountByPhoneResponse } from './types';

export async function getAccountByPhone(
	client: SpokiClient,
	phone: string,
): Promise<GetAccountByPhoneResponse> {
	const encodedPhone = encodeURIComponent(phone);

	return client.get<GetAccountByPhoneResponse>(
		`/accounts/phone/${encodedPhone}`,
	);
}
