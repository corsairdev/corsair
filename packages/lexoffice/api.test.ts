// Live Lexoffice API tests. Excluded from the default run by
// `testPathIgnorePatterns` in `jest.config.cjs`
// (--testPathIgnorePatterns="api\.test\.ts"); run it with:
//
//   LEXOFFICE_API_KEY=... pnpm test:live
//
import { makeLexofficeRequest } from './client';
import type {
	ContactsListResponse,
	CreditNotesListResponse,
	InvoicesListResponse,
	ProfileGetResponse,
	VouchersListResponse,
} from './endpoints/types';
import {
	ContactsListResponseSchema,
	CreditNotesListResponseSchema,
	InvoicesListResponseSchema,
	ProfileGetResponseSchema,
	VouchersListResponseSchema,
} from './endpoints/types';

const LIVE_KEY = process.env.LEXOFFICE_API_KEY ?? '';
if (LIVE_KEY.length === 0) {
	console.warn(
		'Skipping live Lexoffice API tests because LEXOFFICE_API_KEY is not set. Set LEXOFFICE_API_KEY to run live tests.',
	);
}
const describeLive = LIVE_KEY.length > 0 ? describe : describe.skip;

describeLive('lexoffice live API (env-gated)', () => {
	it('GET /profile returns organization info for the live key', async () => {
		const res = await makeLexofficeRequest<ProfileGetResponse>(
			'/profile',
			LIVE_KEY,
			{ method: 'GET' },
		);

		const parsed = ProfileGetResponseSchema.parse(res);
		expect(typeof parsed.organizationId).toBe('string');
	});

	it('GET /contacts returns paginated contacts list', async () => {
		const res = await makeLexofficeRequest<ContactsListResponse>(
			'/contacts',
			LIVE_KEY,
			{
				method: 'GET',
				query: { page: 0, size: 5 },
			},
		);

		const parsed = ContactsListResponseSchema.parse(res);
		expect(typeof parsed.totalPages).toBe('number');
		expect(typeof parsed.totalElements).toBe('number');
		expect(Array.isArray(parsed.content)).toBe(true);
	});

	it('GET /invoices returns paginated invoices list', async () => {
		const res = await makeLexofficeRequest<InvoicesListResponse>(
			'/invoices',
			LIVE_KEY,
			{
				method: 'GET',
				query: { page: 0, size: 5 },
			},
		);

		const parsed = InvoicesListResponseSchema.parse(res);
		expect(typeof parsed.totalPages).toBe('number');
		expect(typeof parsed.totalElements).toBe('number');
		expect(Array.isArray(parsed.content)).toBe(true);
	});

	it('GET /vouchers returns paginated vouchers list', async () => {
		const res = await makeLexofficeRequest<VouchersListResponse>(
			'/vouchers',
			LIVE_KEY,
			{
				method: 'GET',
				query: { page: 0, size: 5 },
			},
		);

		const parsed = VouchersListResponseSchema.parse(res);
		expect(typeof parsed.totalPages).toBe('number');
		expect(typeof parsed.totalElements).toBe('number');
		expect(Array.isArray(parsed.content)).toBe(true);
	});

	it('GET /credit-notes returns paginated credit notes list', async () => {
		const res = await makeLexofficeRequest<CreditNotesListResponse>(
			'/credit-notes',
			LIVE_KEY,
			{
				method: 'GET',
				query: { page: 0, size: 5 },
			},
		);

		const parsed = CreditNotesListResponseSchema.parse(res);
		expect(typeof parsed.totalPages).toBe('number');
		expect(typeof parsed.totalElements).toBe('number');
		expect(Array.isArray(parsed.content)).toBe(true);
	});
});
