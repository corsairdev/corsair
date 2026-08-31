import { BetterProposalsAPIError, makeBetterProposalsRequest } from './client';
import {
	CompaniesGetResponseSchema,
	CompaniesListResponseSchema,
	CurrenciesGetResponseSchema,
	CurrenciesListResponseSchema,
	DocumentTypesListResponseSchema,
	ProposalsGetCountResponseSchema,
	ProposalsListResponseSchema,
	QuotesListResponseSchema,
	SettingsGetBrandResponseSchema,
	SettingsGetResponseSchema,
	SettingsListMergeTagsResponseSchema,
	TemplatesListResponseSchema,
} from './endpoints/types';
import {
	BetterProposalsCompany,
	BetterProposalsCurrency,
	BetterProposalsDocumentType,
	BetterProposalsSettings,
} from './schema';

const LIVE_KEY = process.env.BETTER_PROPOSALS_API_KEY;
const describeIfKey = LIVE_KEY ? describe : describe.skip;

describe('Better Proposals live API', () => {
	it('rejects an invalid Bptoken on GET /settings', async () => {
		const err = await makeBetterProposalsRequest(
			'/settings',
			'invalid-bptoken',
		).catch((error: unknown) => error);
		expect(err).toBeInstanceOf(BetterProposalsAPIError);
	});
});

describeIfKey('Better Proposals live API (authenticated)', () => {
	const key = LIVE_KEY as string;

	it('GET /settings matches official envelope', async () => {
		const raw = await makeBetterProposalsRequest('/settings', key);
		const parsed = SettingsGetResponseSchema.parse(raw);
		expect(parsed.status).toBe('success');
		BetterProposalsSettings.parse(parsed.data);
		expect(parsed.data.TimeZone).toBeTruthy();
	});

	it('GET /settings/brand matches official envelope', async () => {
		const raw = await makeBetterProposalsRequest('/settings/brand', key);
		const parsed = SettingsGetBrandResponseSchema.parse(raw);
		expect(parsed.status).toBe('success');
	});

	it('GET /settings/merge_tag matches official envelope', async () => {
		const raw = await makeBetterProposalsRequest('/settings/merge_tag', key, {
			query: { page: 1, per_page: 5 },
		});
		expect(SettingsListMergeTagsResponseSchema.parse(raw).status).toBe(
			'success',
		);
	});

	it('GET /currency lists official currency fields', async () => {
		const raw = await makeBetterProposalsRequest('/currency', key, {
			query: { page: 1, per_page: 3 },
		});
		const parsed = CurrenciesListResponseSchema.parse(raw);
		expect(parsed.data.length).toBeGreaterThan(0);
		const currency = BetterProposalsCurrency.parse(parsed.data[0]);
		expect(currency.CurrencyCode).toBeTruthy();

		const one = await makeBetterProposalsRequest(
			`/currency/${currency.ID}`,
			key,
		);
		expect(CurrenciesGetResponseSchema.parse(one).data.ID).toEqual(currency.ID);
	});

	it('GET /company lists official company fields', async () => {
		const raw = await makeBetterProposalsRequest('/company', key, {
			query: { page: 1, per_page: 3 },
		});
		const parsed = CompaniesListResponseSchema.parse(raw);
		expect(parsed.data.length).toBeGreaterThan(0);
		const company = BetterProposalsCompany.parse(parsed.data[0]);
		expect(company.CompanyName.length).toBeGreaterThan(0);

		const one = await makeBetterProposalsRequest(`/company/${company.ID}`, key);
		expect(CompaniesGetResponseSchema.parse(one).data.ID).toEqual(company.ID);
	});

	it('GET /doctype lists official document types', async () => {
		const raw = await makeBetterProposalsRequest('/doctype', key);
		const parsed = DocumentTypesListResponseSchema.parse(raw);
		expect(parsed.data.length).toBeGreaterThan(0);
		BetterProposalsDocumentType.parse(parsed.data[0]);
	});

	it('GET /template, /quote, /proposal list official envelopes', async () => {
		const templates = TemplatesListResponseSchema.parse(
			await makeBetterProposalsRequest('/template', key, {
				query: { page: 1, per_page: 2 },
			}),
		);
		const quotes = QuotesListResponseSchema.parse(
			await makeBetterProposalsRequest('/quote', key, {
				query: { page: 1, per_page: 2 },
			}),
		);
		const proposals = ProposalsListResponseSchema.parse(
			await makeBetterProposalsRequest('/proposal', key, {
				query: { page: 1, per_page: 2 },
			}),
		);
		expect(templates.status).toBe('success');
		expect(quotes.status).toBe('success');
		expect(proposals.status).toBe('success');
	});

	it('GET /proposal/count returns official count envelope', async () => {
		const parsed = ProposalsGetCountResponseSchema.parse(
			await makeBetterProposalsRequest('/proposal/count', key),
		);
		expect(parsed.status).toBe('success');
		expect(typeof parsed.count).toBe('number');
	});

	it('GET proposal status filters return official envelopes', async () => {
		for (const path of [
			'/proposal/new',
			'/proposal/opened',
			'/proposal/sent',
			'/proposal/signed',
			'/proposal/paid',
		]) {
			const parsed = ProposalsListResponseSchema.parse(
				await makeBetterProposalsRequest(path, key, {
					query: { page: 1, per_page: 2 },
				}),
			);
			expect(parsed.status).toBe('success');
		}
	});
});
