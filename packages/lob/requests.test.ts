import {
	addressDeleted,
	addressListOk,
	addressOk,
	autocompleteOk,
	balanceOk,
	certifiedLetterOk,
	intlVerificationOk,
	letterOk,
	postcardOk,
	usVerificationOk,
	zipLookupOk,
} from './test-fixtures';
import {
	API_KEY,
	BASE,
	endpoints,
	installFetchMock,
	lastCall,
	makeCtx,
	mockFetch,
	ok,
	queryOf,
	restoreFetchMock,
	sentBody,
	sentHeader,
} from './test-helpers';

// One test per operation: the URL, the method, where the auth went, and every
// query or body field the endpoint sends.
beforeEach(installFetchMock);
afterEach(restoreFetchMock);

describe('Lob request shapes', () => {
	it('authenticates every request with Basic key-plus-empty-password', async () => {
		mockFetch(ok(usVerificationOk));

		await endpoints.usVerifications.verify(makeCtx(), {
			address: '210 King Street',
		});

		expect(sentHeader('Authorization')).toBe(
			`Basic ${Buffer.from(`${API_KEY}:`).toString('base64')}`,
		);
	});

	it('verifies one US address with POST /us_verifications', async () => {
		mockFetch(ok(usVerificationOk));

		const result = await endpoints.usVerifications.verify(makeCtx(), {
			primary_line: '210 King Street',
			city: 'San Francisco',
			state: 'CA',
			zip_code: '94107-2282',
			case: 'proper',
		});

		expect(lastCall().url).toBe(`${BASE}/us_verifications?case=proper`);
		expect(lastCall().init.method).toBe('POST');
		expect(sentBody()).toEqual({
			address: undefined,
			primary_line: '210 King Street',
			secondary_line: undefined,
			urbanization: undefined,
			recipient: undefined,
			city: 'San Francisco',
			state: 'CA',
			zip_code: '94107-2282',
		});
		expect(result.deliverability).toBe('deliverable');
	});

	it('bulk-verifies addresses with POST /bulk/us_verifications', async () => {
		mockFetch(
			ok({ addresses: [usVerificationOk, usVerificationOk], errors: false }),
		);

		const result = await endpoints.usVerifications.bulk(makeCtx(), {
			addresses: [
				{ primary_line: '210 King Street', zip_code: '94107' },
				{ primary_line: '1 Nowhere Rd', city: 'Delulu', state: 'CA' },
			],
		});

		expect(lastCall().url).toBe(`${BASE}/bulk/us_verifications`);
		expect(lastCall().init.method).toBe('POST');
		expect(sentBody().addresses).toHaveLength(2);
		expect(result.addresses).toHaveLength(2);
		expect(result.errors).toBe(false);
	});

	it('verifies one international address with POST /intl_verifications', async () => {
		mockFetch(ok(intlVerificationOk));

		const result = await endpoints.intlVerifications.verify(makeCtx(), {
			primary_line: '123 Paramount Rd',
			city: 'Toronto',
			state: 'ON',
			postal_code: 'M5V 2T6',
			country: 'CA',
		});

		expect(lastCall().url).toBe(`${BASE}/intl_verifications`);
		expect(sentBody()).toEqual({
			address: undefined,
			recipient: undefined,
			primary_line: '123 Paramount Rd',
			secondary_line: undefined,
			city: 'Toronto',
			state: 'ON',
			postal_code: 'M5V 2T6',
			country: 'CA',
		});
		expect(result.deliverability).toBe('deliverable');
	});

	it('autocompletes a US address with POST /us_autocompletions', async () => {
		mockFetch(ok(autocompleteOk));

		const result = await endpoints.autocomplete.usAutocomplete(makeCtx(), {
			address_prefix: '185 Industrial P',
			valid_addresses: true,
			case: 'proper',
		});

		expect(lastCall().url).toBe(
			`${BASE}/us_autocompletions?case=proper&valid_addresses=true`,
		);
		expect(sentBody()).toEqual({
			address_prefix: '185 Industrial P',
			city: undefined,
			state: undefined,
			zip_code: undefined,
			geo_ip_sort: undefined,
		});
		expect(result.suggestions[0]?.primary_line).toContain('INDUSTRIAL');
	});

	it('looks up a ZIP code with POST /us_zip_lookups', async () => {
		mockFetch(ok(zipLookupOk));

		const result = await endpoints.zip.usZipLookup(makeCtx(), {
			zip_code: '94107',
		});

		expect(lastCall().url).toBe(`${BASE}/us_zip_lookups`);
		expect(sentBody()).toEqual({ zip_code: '94107' });
		expect(result.cities[0]?.preferred).toBe(true);
	});

	it('creates an address book entry with POST /addresses', async () => {
		mockFetch(ok(addressOk));

		const result = await endpoints.addresses.create(makeCtx(), {
			name: 'Jordan Lee',
			address_line1: '210 King St Ste 6100',
			address_city: 'San Francisco',
			address_state: 'CA',
			address_zip: '94107-1741',
			metadata: { team: 'ops' },
		});

		expect(lastCall().url).toBe(`${BASE}/addresses`);
		expect(lastCall().init.method).toBe('POST');
		expect(sentBody()).toMatchObject({
			name: 'Jordan Lee',
			address_line1: '210 King St Ste 6100',
			address_city: 'San Francisco',
			address_state: 'CA',
			address_zip: '94107-1741',
			metadata: { team: 'ops' },
		});
		expect(result.id).toBe('adr_d0c7d5ac3f7e6b4');
	});

	it('reads an address book entry with GET /addresses/{adr_id}', async () => {
		mockFetch(ok(addressOk));

		const result = await endpoints.addresses.get(makeCtx(), {
			id: 'adr_d0c7d5ac3f7e6b4',
		});

		expect(lastCall().url).toBe(`${BASE}/addresses/adr_d0c7d5ac3f7e6b4`);
		expect(lastCall().init.method).toBe('GET');
		expect(result.address_city).toBe('SAN FRANCISCO');
	});

	it('lists the address book with limit, cursors and deepObject filters', async () => {
		mockFetch(ok(addressListOk));

		const result = await endpoints.addresses.list(makeCtx(), {
			limit: 2,
			after: 'adr_d0c7d5ac3f7e6b4',
			include: ['total_count'],
			date_created: { gt: '2026-01-01T00:00:00Z' },
			metadata: { team: 'ops' },
		});

		const query = queryOf(lastCall().url);
		expect(lastCall().url.startsWith(`${BASE}/addresses?`)).toBe(true);
		expect(query.get('limit')).toBe('2');
		expect(query.get('after')).toBe('adr_d0c7d5ac3f7e6b4');
		expect(query.get('include')).toBe('total_count');
		expect(query.get('date_created[gt]')).toBe('2026-01-01T00:00:00Z');
		expect(query.get('metadata[team]')).toBe('ops');
		expect(result.data).toHaveLength(1);
		expect(result.next_url).toContain('after=');
	});

	it('deletes an address book entry with DELETE /addresses/{adr_id}', async () => {
		mockFetch(ok(addressDeleted));

		const result = await endpoints.addresses.delete(makeCtx(), {
			id: 'adr_d0c7d5ac3f7e6b4',
		});

		expect(lastCall().url).toBe(`${BASE}/addresses/adr_d0c7d5ac3f7e6b4`);
		expect(lastCall().init.method).toBe('DELETE');
		expect(result.deleted).toBe(true);
	});

	it('sends a postcard with POST /postcards and the use type', async () => {
		mockFetch(ok(postcardOk));

		const result = await endpoints.postcards.send(makeCtx(), {
			to: 'adr_210a8d4b0b76d77b',
			front: '<html>Front</html>',
			back: '<html>Back</html>',
			use_type: 'marketing',
			size: '6x9',
			mail_type: 'usps_standard',
		});

		expect(lastCall().url).toBe(`${BASE}/postcards`);
		expect(lastCall().init.method).toBe('POST');
		expect(sentBody()).toMatchObject({
			to: 'adr_210a8d4b0b76d77b',
			front: '<html>Front</html>',
			back: '<html>Back</html>',
			use_type: 'marketing',
			size: '6x9',
			mail_type: 'usps_standard',
		});
		expect(sentHeader('Idempotency-Key')).toBeNull();
		expect(result.carrier).toBe('USPS');
	});

	it('passes the idempotency key of a postcard send as a header', async () => {
		mockFetch(ok(postcardOk));

		await endpoints.postcards.send(makeCtx(), {
			to: 'adr_210a8d4b0b76d77b',
			front: '<html>Front</html>',
			back: '<html>Back</html>',
			use_type: null,
			idempotency_key: 'send-42',
		});

		expect(sentHeader('Idempotency-Key')).toBe('send-42');
	});

	it('sends service_request_number at the top level of postcards and letters', async () => {
		mockFetch(ok(postcardOk));
		await endpoints.postcards.send(makeCtx(), {
			to: 'adr_210a8d4b0b76d77b',
			front: '<html>Front</html>',
			back: '<html>Back</html>',
			use_type: 'marketing',
			service_request_number: '12345678',
		});
		expect(sentBody()).toMatchObject({ service_request_number: '12345678' });

		mockFetch(ok(letterOk));
		await endpoints.letters.send(makeCtx(), {
			to: 'adr_210a8d4b0b76d77b',
			from: 'adr_fa64eaa6b3f335',
			file: '<html>Letter</html>',
			color: false,
			use_type: 'operational',
			service_request_number: '12345678',
		});
		expect(sentBody()).toMatchObject({ service_request_number: '12345678' });
	});

	it('leaves service_request_number out when the caller omits it', async () => {
		mockFetch(ok(postcardOk));
		await endpoints.postcards.send(makeCtx(), {
			to: 'adr_210a8d4b0b76d77b',
			front: '<html>Front</html>',
			back: '<html>Back</html>',
			use_type: 'marketing',
		});
		expect(sentBody()).not.toHaveProperty('service_request_number');
	});

	it('reads a postcard with GET /postcards/{psc_id}', async () => {
		mockFetch(ok(postcardOk));

		const result = await endpoints.postcards.get(makeCtx(), {
			id: 'psc_208e45e48d271294',
		});

		expect(lastCall().url).toBe(`${BASE}/postcards/psc_208e45e48d271294`);
		expect(result.status).toBe('rendered');
	});

	it('sends a letter with POST /letters, file and color', async () => {
		mockFetch(ok(letterOk));

		const result = await endpoints.letters.send(makeCtx(), {
			to: 'adr_210a8d4b0b76d77b',
			from: 'adr_fa64eaa6b3f335',
			file: '<html>Letter</html>',
			color: true,
			use_type: 'operational',
			extra_service: 'certified',
			double_sided: false,
		});

		expect(lastCall().url).toBe(`${BASE}/letters`);
		expect(sentBody()).toMatchObject({
			to: 'adr_210a8d4b0b76d77b',
			from: 'adr_fa64eaa6b3f335',
			file: '<html>Letter</html>',
			color: true,
			use_type: 'operational',
			extra_service: 'certified',
			double_sided: false,
		});
		expect(result.id).toBe('ltr_489a2ce9d621bde');
	});

	it('reads a certified letter with its tracking number', async () => {
		mockFetch(ok(certifiedLetterOk));

		const result = await endpoints.letters.get(makeCtx(), {
			id: 'ltr_certified9aa1',
		});

		expect(lastCall().url).toBe(`${BASE}/letters/ltr_certified9aa1`);
		expect(lastCall().init.method).toBe('GET');
		expect(result.tracking_number).toBe('9407100000000000000000');
		expect(result.tracking_events).toHaveLength(1);
	});

	it('reads the Lob Credits balance with GET /accounts', async () => {
		mockFetch(ok(balanceOk));

		const result = await endpoints.account.getBalance(makeCtx(), {});

		expect(lastCall().url).toBe(`${BASE}/accounts`);
		expect(lastCall().init.method).toBe('GET');
		expect(result.balance).toBe(42.5);
	});
});
