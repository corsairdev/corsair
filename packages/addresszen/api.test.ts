import 'dotenv/config';
import { makeAddresszenRequest } from './client';
import type {
	AutocompleteAddressesResponse,
	KeyAvailabilityResponse,
	ResolveAddressUsaResponse,
	VerifyAddressResponse,
} from './endpoints/types';
import { AddresszenEndpointOutputSchemas } from './endpoints/types';

const TEST_API_KEY = process.env.ADDRESSZEN_API_KEY;
const describeIfApiKey = TEST_API_KEY ? describe : describe.skip;

describeIfApiKey('Addresszen API Type Tests', () => {
	describe('key', () => {
		it('keyAvailability returns correct type', async () => {
			const response = await makeAddresszenRequest<KeyAvailabilityResponse>(
				`keys/${encodeURIComponent(TEST_API_KEY!)}`,
				TEST_API_KEY!,
				{ method: 'GET', auth: false },
			);

			AddresszenEndpointOutputSchemas.keyAvailability.parse(response);
			expect(response.code).toBe(2000);
			expect(typeof response.result.available).toBe('boolean');
		});
	});

	describe('autocomplete', () => {
		it('autocompleteAddresses returns correct type', async () => {
			const response =
				await makeAddresszenRequest<AutocompleteAddressesResponse>(
					'autocomplete/addresses',
					TEST_API_KEY!,
					{
						method: 'GET',
						query: {
							q: '10 downing',
						},
					},
				);

			AddresszenEndpointOutputSchemas.autocompleteAddresses.parse(response);
			expect(response.code).toBe(2000);
		});
	});

	describe('resolve', () => {
		it('resolveAddressUsa returns correct type', async () => {
			const suggestions =
				await makeAddresszenRequest<AutocompleteAddressesResponse>(
					'autocomplete/addresses',
					TEST_API_KEY!,
					{
						method: 'GET',
						query: { q: '1600 Garfield Aliquippa' },
					},
				);

			const addressId = suggestions.result.hits[0]?.id;
			expect(addressId).toBeTruthy();

			const response = await makeAddresszenRequest<ResolveAddressUsaResponse>(
				`autocomplete/addresses/${encodeURIComponent(addressId!)}/usa`,
				TEST_API_KEY!,
				{ method: 'GET' },
			);

			AddresszenEndpointOutputSchemas.resolveAddressUsa.parse(response);
			expect(response.code).toBe(2000);
			expect(response.result.line_1).toBeTruthy();
		});
	});

	describe('verify', () => {
		it('verifyAddress returns correct type', async () => {
			const response = await makeAddresszenRequest<VerifyAddressResponse>(
				'verify/addresses',
				TEST_API_KEY!,
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
				TEST_API_KEY!,
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
