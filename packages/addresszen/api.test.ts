import 'dotenv/config';
import { makeAddresszenRequest } from './client';
import type {
	AutocompleteAddressesResponse,
	VerifyAddressResponse,
} from './endpoints/types';
import { AddresszenEndpointOutputSchemas } from './endpoints/types';

const TEST_API_KEY = process.env.ADDRESSZEN_API_KEY!;

describe('Addresszen API Type Tests', () => {
	describe('autocomplete', () => {
		it('autocompleteAddresses returns correct type', async () => {
			const response =
				await makeAddresszenRequest<AutocompleteAddressesResponse>(
					'autocomplete/addresses',
					TEST_API_KEY,
					{
						method: 'GET',
						query: {
							query: '10 downing',
						},
					},
				);

			AddresszenEndpointOutputSchemas.autocompleteAddresses.parse(response);
			expect(response.code).toBe(2000);
		});
	});

	describe('verify', () => {
		it('verifyAddress returns correct type', async () => {
			const response = await makeAddresszenRequest<VerifyAddressResponse>(
				'verify/addresses',
				TEST_API_KEY,
				{
					method: 'POST',
					body: {
						query: '123 Main St, Springfield, CO 81073',
					},
				},
			);

			AddresszenEndpointOutputSchemas.verifyAddress.parse(response);
			expect(response.code).toBe(2000);
		});

		it('verifyAddress with split components returns correct type', async () => {
			const response = await makeAddresszenRequest<VerifyAddressResponse>(
				'verify/addresses',
				TEST_API_KEY,
				{
					method: 'POST',
					body: {
						query: '123 Main St',
						city: 'Springfield',
						state: 'CO',
					},
				},
			);

			AddresszenEndpointOutputSchemas.verifyAddress.parse(response);
		});
	});
});
