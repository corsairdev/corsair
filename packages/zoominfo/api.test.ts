import type { ZoominfoCredentials } from './client';
import { authenticateZoominfo } from './client';
import {
	enrichCompany,
	enrichContact,
	enrichIntent,
	enrichLocation,
	enrichNews,
	enrichScoop,
	enrichTechnology,
} from './endpoints/enrichments';
import {
	getCompanySearchInputFields,
	getContactSearchInputFields,
	getIntentSearchInputFields,
	getNewsSearchInputFields,
	getScoopSearchInputFields,
} from './endpoints/input-fields';
import {
	searchCompanies,
	searchContacts,
	searchIntent,
	searchNews,
	searchScoops,
} from './endpoints/searches';
import type { ZoominfoContext } from './index';

// Hits the real ZoomInfo API and needs credentials. CI skips this file by name
// (--testPathIgnorePatterns="api\.test\.ts"); run it with `pnpm test:live`.
//
//   ZOOMINFO_USERNAME=... ZOOMINFO_PASSWORD=... pnpm test:live
//   ZOOMINFO_USERNAME=... ZOOMINFO_CLIENT_ID=... ZOOMINFO_PRIVATE_KEY="$(cat key.pem)" pnpm test:live

const username = process.env.ZOOMINFO_USERNAME;
const password = process.env.ZOOMINFO_PASSWORD;
const clientId = process.env.ZOOMINFO_CLIENT_ID;
const privateKey = process.env.ZOOMINFO_PRIVATE_KEY;

function credentials(): ZoominfoCredentials | null {
	if (!username) return null;
	if (clientId && privateKey)
		return { kind: 'pki', username, clientId, privateKey };
	if (password) return { kind: 'basic', username, password };
	return null;
}

const selected = credentials();
const describeLive = selected ? describe : describe.skip;

// ZoomInfo's own company id, used as a known-good enrichment target.
const ZOOMINFO_COMPANY_ID = '344589814';

describeLive('ZoomInfo API', () => {
	let ctx: ZoominfoContext;

	beforeAll(async () => {
		const token = await authenticateZoominfo(selected as ZoominfoCredentials);
		expect(token.accessToken).toEqual(expect.any(String));
		expect(token.expiresAt).toBeGreaterThan(Date.now());
		ctx = { key: token.accessToken } as unknown as ZoominfoContext;
	}, 30_000);

	describe('input-field lookups', () => {
		it.each([
			['company', getCompanySearchInputFields],
			['contact', getContactSearchInputFields],
			['intent', getIntentSearchInputFields],
			['news', getNewsSearchInputFields],
			['scoop', getScoopSearchInputFields],
		])('%s search reports its filters', async (_resource, endpoint) => {
			const fields = await endpoint(ctx, {});

			expect(fields.length).toBeGreaterThan(0);
			expect(fields[0]).toHaveProperty('fieldName');
		});

		// The schemas in endpoints/types.ts were written from ZoomInfo's published
		// field lists. This checks those lists still describe the live account.
		it('company search accepts every filter the schema declares', async () => {
			const fields = await getCompanySearchInputFields(ctx, {});
			const live = new Set(fields.map((f) => f.fieldName));

			for (const declared of ['companyName', 'industryCodes', 'rpp', 'page']) {
				expect(live).toContain(declared);
			}
		});
	});

	describe('searches', () => {
		it('finds companies by name', async () => {
			const result = await searchCompanies(ctx, {
				companyName: 'ZoomInfo',
				rpp: 5,
			});

			expect(result.data.length).toBeGreaterThan(0);
			expect(result.data[0]).toHaveProperty('id');
		});

		it('pages through company results', async () => {
			const [first, second] = await Promise.all([
				searchCompanies(ctx, { companyName: 'Software', rpp: 1, page: 1 }),
				searchCompanies(ctx, { companyName: 'Software', rpp: 1, page: 2 }),
			]);

			expect(first.data).toHaveLength(1);
			expect(second.data).toHaveLength(1);
			expect(first.data[0]?.id).not.toBe(second.data[0]?.id);
		});

		it('finds contacts at a company', async () => {
			const result = await searchContacts(ctx, {
				companyId: ZOOMINFO_COMPANY_ID,
				rpp: 5,
			});

			expect(result.data.length).toBeGreaterThan(0);
		});

		it('searches intent signals', async () => {
			await expect(
				searchIntent(ctx, { signalScoreMin: 80, rpp: 5 }),
			).resolves.toHaveProperty('data');
		});

		it('searches news', async () => {
			await expect(searchNews(ctx, { rpp: 5 })).resolves.toHaveProperty('data');
		});

		it('searches scoops', async () => {
			await expect(
				searchScoops(ctx, { companyId: ZOOMINFO_COMPANY_ID, rpp: 5 }),
			).resolves.toHaveProperty('data');
		});
	});

	describe('enrichments', () => {
		it('enriches a company by id', async () => {
			const result = await enrichCompany(ctx, {
				matchCompanyInput: [{ companyId: ZOOMINFO_COMPANY_ID }],
				outputFields: ['id', 'name', 'website'],
			});

			expect(result.data.result.length).toBeGreaterThan(0);
			expect(result.data.result[0]?.data[0]).toHaveProperty('name');
		});

		// Contact enrich charges a credit, so this redeems one contact the search
		// already found rather than guessing at an id.
		it('enriches a contact found by search', async () => {
			const found = await searchContacts(ctx, {
				companyId: ZOOMINFO_COMPANY_ID,
				rpp: 1,
			});
			const personId = found.data[0]?.id;
			expect(personId).toEqual(expect.any(Number));

			const result = await enrichContact(ctx, {
				matchPersonInput: [{ personId }],
				outputFields: ['id', 'firstName', 'lastName', 'jobTitle'],
			});

			expect(result.data.result.length).toBeGreaterThan(0);
			expect(result.data.result[0]?.data[0]).toHaveProperty('id');
		});

		it.each([
			['intent signals', enrichIntent],
			['locations', enrichLocation],
			['news', enrichNews],
			['scoops', enrichScoop],
			['technologies', enrichTechnology],
		])('enriches %s for a company', async (_name, endpoint) => {
			await expect(
				endpoint(ctx, { companyId: ZOOMINFO_COMPANY_ID }),
			).resolves.toHaveProperty('data');
		});
	});

	describe('failure modes', () => {
		it('rejects a bad password with the documented message', async () => {
			await expect(
				authenticateZoominfo({
					kind: 'basic',
					username: username as string,
					password: 'definitely-not-the-password',
				}),
			).rejects.toThrow(/authentication failed/i);
		});

		it('rejects an invalid JWT', async () => {
			const bad = { key: 'not-a-real-jwt' } as unknown as ZoominfoContext;

			await expect(
				searchCompanies(bad, { companyName: 'x' }),
			).rejects.toThrow();
		});
	});
});

if (!selected) {
	it('skips the live suite without ZOOMINFO_USERNAME and a secret', () => {
		expect(selected).toBeNull();
	});
}
