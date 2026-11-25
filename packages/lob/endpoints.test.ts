import {
	addressDeleted,
	addressListOk,
	addressOk,
	autocompleteOk,
	balanceOk,
	intlVerificationOk,
	letterOk,
	postcardOk,
	rateLimited,
	usRowError,
	usVerificationOk,
	zipLookupOk,
} from './test-fixtures';
import {
	endpoints,
	installFetchMock,
	jsonResponse,
	makeCtx,
	mockFetch,
	restoreFetchMock,
} from './test-helpers';

// Output parsing per operation: a body Lob would not send must fail the parse
// rather than come back looking like data.
beforeEach(installFetchMock);
afterEach(restoreFetchMock);

import { z } from 'zod';

// The mocked fetch throws on any unmocked call, so a ZodError rejection also
// proves the request never left.
// unknown: a promise can reject with any value; the test asserts the type.
async function expectParseFailure(promise: Promise<unknown>) {
	await expect(promise).rejects.toThrow(z.ZodError);
}

describe('output parsing', () => {
	it('parses a us verification', async () => {
		mockFetch(jsonResponse(usVerificationOk));
		const result = await endpoints.usVerifications.verify(makeCtx(), {
			address: '210 King Street',
		});
		expect(result.id).toBe('us_ver_c7cb63d68f8d6');
		expect(result.components).toMatchObject({ street_name: 'KING' });
	});

	it('rejects an unknown deliverability value on a us verification', async () => {
		mockFetch(
			jsonResponse({ ...usVerificationOk, deliverability: 'sort_of_ok' }),
		);
		await expectParseFailure(
			endpoints.usVerifications.verify(makeCtx(), { address: 'x' }),
		);
	});

	it('parses a bulk verification whose rows mix successes and row errors', async () => {
		mockFetch(
			jsonResponse({
				addresses: [usVerificationOk, usRowError],
				errors: true,
			}),
		);
		const result = await endpoints.usVerifications.bulk(makeCtx(), {
			addresses: [{ primary_line: '210 King Street', zip_code: '94107' }],
		});
		expect(result.errors).toBe(true);
		const second = result.addresses[1];
		if (!second || !('error' in second)) {
			throw new Error('expected a row error in position 2');
		}
		expect(second.error).toMatchObject({ code: 'bad_request' });
	});

	it('rejects a bulk response without the errors flag', async () => {
		mockFetch(jsonResponse({ addresses: [] }));
		await expectParseFailure(
			endpoints.usVerifications.bulk(makeCtx(), {
				addresses: [{ primary_line: 'x', zip_code: '94107' }],
			}),
		);
	});

	it('parses an intl verification', async () => {
		mockFetch(jsonResponse(intlVerificationOk));
		const result = await endpoints.intlVerifications.verify(makeCtx(), {
			primary_line: '123 Paramount Rd',
			country: 'CA',
		});
		expect(result.coverage).toBe('STREET');
	});

	it('parses autocomplete suggestions', async () => {
		mockFetch(jsonResponse(autocompleteOk));
		const result = await endpoints.autocomplete.usAutocomplete(makeCtx(), {
			address_prefix: '185 Industrial P',
		});
		expect(result.suggestions[0]?.zip_code).toBe('55070');
	});

	it('rejects a suggestion row missing its city', async () => {
		mockFetch(
			jsonResponse({
				id: 'us_auto_6dc3c810e7f9',
				suggestions: [{ primary_line: '185 INDUSTRIAL PKWY' }],
				object: 'us_autocompletion',
			}),
		);
		await expectParseFailure(
			endpoints.autocomplete.usAutocomplete(makeCtx(), {
				address_prefix: '185 Industrial P',
			}),
		);
	});

	it('parses a zip lookup', async () => {
		mockFetch(jsonResponse(zipLookupOk));
		const result = await endpoints.zip.usZipLookup(makeCtx(), {
			zip_code: '94107',
		});
		expect(result.zip_code_type).toBe('standard');
	});

	it('parses an address book row', async () => {
		mockFetch(jsonResponse(addressOk));
		const result = await endpoints.addresses.get(makeCtx(), {
			id: 'adr_d0c7d5ac3f7e6b4',
		});
		expect(result.address_country).toBe('UNITED STATES');
	});

	it('parses an address list page', async () => {
		mockFetch(jsonResponse({ ...addressListOk, total_count: null }));
		const result = await endpoints.addresses.list(makeCtx(), { limit: 10 });
		expect(result.count).toBe(1);
		expect(result.total_count).toBeNull();
	});

	it('rejects an address page missing its data array', async () => {
		mockFetch(jsonResponse({ object: 'list', count: 0 }));
		await expectParseFailure(endpoints.addresses.list(makeCtx(), {}));
	});

	it('parses an address deletion', async () => {
		mockFetch(jsonResponse(addressDeleted));
		const result = await endpoints.addresses.delete(makeCtx(), {
			id: 'adr_d0c7d5ac3f7e6b4',
		});
		expect(result.deleted).toBe(true);
	});

	it('parses a postcard', async () => {
		mockFetch(jsonResponse(postcardOk));
		const result = await endpoints.postcards.send(makeCtx(), {
			to: 'adr_210a8d4b0b76d77b',
			front: '<html>x</html>',
			back: '<html>y</html>',
			use_type: null,
		});
		expect(result.to).toMatchObject({ company: 'LOB' });
	});

	it('rejects a postcard whose to is a bare string', async () => {
		mockFetch(jsonResponse({ ...postcardOk, to: 'adr_210a8d4b0b76d77b' }));
		await expectParseFailure(
			endpoints.postcards.send(makeCtx(), {
				to: 'adr_210a8d4b0b76d77b',
				front: '<html>x</html>',
				back: '<html>y</html>',
				use_type: null,
			}),
		);
	});

	it('parses a letter', async () => {
		mockFetch(jsonResponse(letterOk));
		const result = await endpoints.letters.send(makeCtx(), {
			to: 'adr_210a8d4b0b76d77b',
			from: 'adr_fa64eaa6b3f335',
			file: '<html>x</html>',
			color: false,
			use_type: 'operational',
		});
		expect(result.address_placement).toBe('top_first_page');
	});

	it('parses the credit balance', async () => {
		mockFetch(jsonResponse(balanceOk));
		const result = await endpoints.account.getBalance(makeCtx(), {});
		expect(result.balance).toBe(42.5);
	});

	it('rejects a balance body without a number', async () => {
		mockFetch(jsonResponse({ balance: 'lots' }));
		await expectParseFailure(endpoints.account.getBalance(makeCtx(), {}));
	});
});

describe('input rejection before a request is sent', () => {
	it('rejects a zip lookup that is not five digits', async () => {
		await expect(
			endpoints.zip.usZipLookup(makeCtx(), { zip_code: '94Y07' }),
		).rejects.toThrow(z.ZodError);
	});

	it('rejects a bulk verify with more than 20 addresses', async () => {
		await expect(
			endpoints.usVerifications.bulk(makeCtx(), {
				addresses: Array.from({ length: 21 }, () => ({
					primary_line: 'x',
					zip_code: '94107',
				})),
			}),
		).rejects.toThrow(z.ZodError);
	});

	it('rejects a us verification with neither city/state nor zip', async () => {
		await expect(
			endpoints.usVerifications.verify(makeCtx(), {
				primary_line: '210 King Street',
			}),
		).rejects.toThrow(/city/);
	});

	it('rejects a single-line us verification that also carries components', async () => {
		await expect(
			endpoints.usVerifications.verify(makeCtx(), {
				address: '210 King Street',
				city: 'San Francisco',
			}),
		).rejects.toThrow(/Single-line/);
	});

	it('rejects an address create with neither name nor company', async () => {
		await expect(
			endpoints.addresses.create(makeCtx(), {
				address_line1: '210 King St',
				address_city: 'San Francisco',
				address_state: 'CA',
				address_zip: '94107',
			}),
		).rejects.toThrow(/name or company/);
	});

	it('rejects an invalid use_type on a postcard send', async () => {
		// unknown: deliberately invalid, so the schema rejection can be tested
		// at runtime rather than at compile time.
		const badUseType: unknown = 'transactional';
		await expect(
			endpoints.postcards.send(makeCtx(), {
				to: 'adr_210a8d4b0b76d77b',
				front: '<html>x</html>',
				back: '<html>y</html>',
				use_type: badUseType as 'marketing',
			}),
		).rejects.toThrow(z.ZodError);
	});

	it('rejects a letter send with an invalid extra_service', async () => {
		// unknown: deliberately invalid, so the schema rejection can be tested
		// at runtime rather than at compile time.
		const badExtraService: unknown = 'priority';
		await expect(
			endpoints.letters.send(makeCtx(), {
				to: 'adr_210a8d4b0b76d77b',
				from: 'adr_fa64eaa6b3f335',
				file: '<html>x</html>',
				color: false,
				use_type: 'operational',
				extra_service: badExtraService as 'certified',
			}),
		).rejects.toThrow(z.ZodError);
	});

	it('rejects an address list asking for before and after together', async () => {
		await expect(
			endpoints.addresses.list(makeCtx(), {
				before: 'adr_a',
				after: 'adr_b',
			}),
		).rejects.toThrow(/before or after/);
	});

	it('rejects metadata values with double quotes', async () => {
		await expect(
			endpoints.addresses.create(makeCtx(), {
				name: 'x',
				address_line1: '210 King St',
				address_city: 'San Francisco',
				address_state: 'CA',
				address_zip: '94107',
				metadata: { note: 'a "quoted" value' },
			}),
		).rejects.toThrow(/double quotes/);
	});

	it('rejects an oversized merge_variables map on a letter', async () => {
		await expect(
			endpoints.letters.send(makeCtx(), {
				to: 'adr_210a8d4b0b76d77b',
				from: 'adr_fa64eaa6b3f335',
				file: '<html>x</html>',
				color: false,
				use_type: 'operational',
				merge_variables: { big: 'x'.repeat(26_000) },
			}),
		).rejects.toThrow(/25000/);
	});

	it('rejects a US inline mail address missing its state', async () => {
		await expect(
			endpoints.postcards.send(makeCtx(), {
				to: {
					name: 'Jordan',
					address_line1: '210 King St',
					address_city: 'San Francisco',
					address_zip: '94107',
				},
				front: '<html>x</html>',
				back: '<html>y</html>',
				use_type: 'operational',
			}),
		).rejects.toThrow(/address_state/);
	});

	it('rejects an idempotency key longer than 256 characters', async () => {
		await expect(
			endpoints.postcards.send(makeCtx(), {
				to: 'adr_210a8d4b0b76d77b',
				front: '<html>x</html>',
				back: '<html>y</html>',
				use_type: 'operational',
				idempotency_key: 'k'.repeat(257),
			}),
		).rejects.toThrow(z.ZodError);
	});

	it('rejects an absent use_type on a send, though null passes', async () => {
		// Lob marks use_type required but allows null, so the schema keeps it
		// required-nullable: null is a value, absence is not.
		const input = {
			to: 'adr_210a8d4b0b76d77b',
			front: '<html>x</html>',
			back: '<html>y</html>',
		};
		await expect(
			endpoints.postcards.send(
				makeCtx(),
				// unknown: the absent use_type is exactly what the rejection pins.
				input as typeof input & { use_type: null },
			),
		).rejects.toThrow(z.ZodError);

		mockFetch(jsonResponse(postcardOk));
		await expect(
			endpoints.postcards.send(makeCtx(), { ...input, use_type: null }),
		).resolves.toMatchObject({ id: 'psc_208e45e48d271294' });
	});

	it('rejects an address list limit above 100', async () => {
		await expect(
			endpoints.addresses.list(makeCtx(), { limit: 101 }),
		).rejects.toThrow(z.ZodError);
	});
});

describe('error mapping through an endpoint', () => {
	it('surfaces the Lob code and status on a rate limit', async () => {
		mockFetch(jsonResponse(rateLimited, { status: 429 }));
		await expect(
			endpoints.account.getBalance(makeCtx(), {}),
		).rejects.toMatchObject({
			status: 429,
			code: 'rate_limit_exceeded',
		});
	});
});
