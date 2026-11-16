import { z } from 'zod';
import { withoutAccountSecrets } from './endpoints/account';
import { TombaEndpointOutputSchemas } from './endpoints/types';
import {
	account,
	company,
	companyFindLive,
	domainSearchLive,
	domainStatusLive,
	emailCount,
	emailFormatLive,
	emailSourcesLive,
	locationLive,
	person,
	personFindLive,
	personNotFound,
	phoneFinderEmptyLive,
	phoneValidation,
	rateLimitsLive,
	revealLive,
	similarLive,
	suggestion,
	suggestionsLive,
	technologyLive,
	verification,
} from './test-fixtures';

describe('output schemas keep the provider field names', () => {
	it('parses a person from the finder', () => {
		const parsed = TombaEndpointOutputSchemas.emailFinder.parse({
			data: person,
		});
		expect(parsed.data.email).toBe('jane.doe@stripe.com');
		expect(parsed.data.verification?.status).toBe('valid');
		expect(parsed.data.sources?.[0]?.still_on_page).toBe(true);
	});

	it('keeps snake_case: the field is website_url, not websiteUrl', () => {
		const parsed = TombaEndpointOutputSchemas.emailFinder.parse({
			data: person,
		});
		expect(parsed.data.website_url).toBe('stripe.com');
		expect(parsed.data).not.toHaveProperty('websiteUrl');
	});

	it('parses a finder miss as a success with a null email', () => {
		const parsed = TombaEndpointOutputSchemas.emailFinder.parse({
			data: personNotFound,
		});
		expect(parsed.data.email).toBeNull();
		expect(parsed.data.score).toBe(0);
		expect(parsed.data.sources).toBeNull();
	});

	it('parses a domain search with its organization and meta block', () => {
		const parsed = TombaEndpointOutputSchemas.domainSearch.parse({
			data: { organization: domainSearchLive.organization, emails: [person] },
			meta: { total: 681, pageSize: 10, current: 1, total_pages: 69 },
		});
		expect(parsed.data.organization?.organization).toBe('Stripe');
		expect(parsed.data.organization?.location?.city).toBe('San Francisco');
		expect(parsed.data.emails).toHaveLength(1);
		expect(parsed.meta?.total_pages).toBe(69);
	});

	it('parses an empty domain search', () => {
		const parsed = TombaEndpointOutputSchemas.domainSearch.parse({
			data: { organization: domainSearchLive.organization, emails: [] },
		});
		expect(parsed.data.emails).toEqual([]);
		expect(parsed.meta).toBeUndefined();
	});

	it('parses the verifier result with every check', () => {
		const parsed = TombaEndpointOutputSchemas.emailVerifier.parse({
			data: verification,
		});
		expect(parsed.data.email.result).toBe('deliverable');
		expect(parsed.data.email.mx?.records).toEqual(['aspmx.l.google.com']);
		expect(parsed.data.email.smtp_provider).toBe('Google');
	});

	it('parses a verifier result whose mx records are null', () => {
		const parsed = TombaEndpointOutputSchemas.emailVerifier.parse({
			data: {
				email: {
					...verification.email,
					mx: { records: null },
					smtp_provider: null,
				},
			},
		});
		expect(parsed.data.email.mx?.records).toBeNull();
	});

	it('parses a phone validation', () => {
		const parsed = TombaEndpointOutputSchemas.phoneValidator.parse({
			data: phoneValidation,
		});
		expect(parsed.data).toMatchObject({
			valid: true,
			line_type: 'FIXED_LINE_OR_MOBILE',
		});
	});

	it('parses the account with its credit counters', () => {
		const parsed = TombaEndpointOutputSchemas.getAccount.parse({
			data: account,
		});
		expect(parsed.data.requests?.domains?.available).toBe(100);
		expect(parsed.data.requests?.domains?.used).toBe(12);
	});

	it('drops the account secret_token and intercom_user_jwt before parsing', () => {
		const parsed = TombaEndpointOutputSchemas.getAccount.parse(
			withoutAccountSecrets({
				data: {
					...account,
					secret_token: 'must-not-reach-the-agent',
					intercom_user_jwt: 'must-not-reach-the-agent',
				},
			}),
		);
		// The schema is loose, so without the shape step both would pass through.
		expect(parsed.data).not.toHaveProperty('secret_token');
		expect(parsed.data).not.toHaveProperty('intercom_user_jwt');
		expect(parsed.data.first_name).toBe('Ada');
	});

	it('parses a company profile', () => {
		const parsed = TombaEndpointOutputSchemas.companyFind.parse({
			data: company,
		});
		expect(parsed.data.name).toBe('Stripe');
		// Social profiles arrive as objects with a handle, not as URLs.
		expect(parsed.data.linkedin?.handle).toBe('stripe');
	});

	it('parses the combined answer with both objects', () => {
		const parsed = TombaEndpointOutputSchemas.combinedFind.parse({
			data: { person: personFindLive.data, company },
		});
		expect(parsed.data.person?.name?.fullName).toBe('Jane Doe');
		expect(parsed.data.company?.domain).toBe('stripe.com');
	});

	it('parses an email count with department and seniority maps', () => {
		const parsed = TombaEndpointOutputSchemas.emailCount.parse({
			data: emailCount,
		});
		expect(parsed.data.department?.engineering).toBe(120);
		expect(parsed.data.seniority?.senior).toBe(200);
	});

	it('parses domain suggestions as an array', () => {
		const parsed = TombaEndpointOutputSchemas.domainSuggestions.parse({
			data: [suggestion],
		});
		expect(parsed.data[0]?.domain).toBe('stripe.com');
	});
});

describe('the shapes the live API returned (11-16)', () => {
	it.each([
		['rateLimits', rateLimitsLive],
		['domainStatus', domainStatusLive],
		['emailFormat', emailFormatLive],
		['location', locationLive],
		['technology', technologyLive],
		['similar', similarLive],
		['domainSuggestions', suggestionsLive],
		['emailSources', emailSourcesLive],
		['searchCompanies', revealLive],
		['companyFind', companyFindLive],
		['personFind', personFindLive],
		['phoneFinder', phoneFinderEmptyLive],
		['phoneValidator', { data: [] }],
		[
			'domainSearch',
			{
				data: { organization: domainSearchLive.organization, emails: [person] },
				meta: domainSearchLive.meta,
			},
		],
	] as const)('parses %s', (name, body) => {
		expect(() => TombaEndpointOutputSchemas[name].parse(body)).not.toThrow();
	});

	it('accepts the array a LinkedIn lookup returns with full=true', () => {
		const parsed = TombaEndpointOutputSchemas.linkedinFinder.parse({
			data: [person, { ...person, email: 'j.doe@stripe.com' }],
		});
		expect(Array.isArray(parsed.data) && parsed.data).toHaveLength(2);
	});

	it('accepts technology data of null for a domain with none', () => {
		expect(() =>
			TombaEndpointOutputSchemas.technology.parse({
				domain: 'example.org',
				data: null,
			}),
		).not.toThrow();
	});

	it('reads rate limits as an object keyed by route', () => {
		const parsed = TombaEndpointOutputSchemas.rateLimits.parse(rateLimitsLive);
		expect(parsed.data?.['email-finder']?.limits?.daily).toBe(5);
	});

	it('reads domain status at the top level, with no data envelope', () => {
		const parsed =
			TombaEndpointOutputSchemas.domainStatus.parse(domainStatusLive);
		expect(parsed).toMatchObject({ domain: 'stripe.com', webmail: false });
	});

	it('reads the company search page under data.companies', () => {
		const parsed = TombaEndpointOutputSchemas.searchCompanies.parse(revealLive);
		expect(parsed.data.companies[0]?.name).toBe('Acme Payments');
		expect(parsed.meta?.limit).toBe(50);
	});
});

describe('wrong-shaped bodies fail loudly', () => {
	it('rejects a body with no data key', () => {
		expect(() => TombaEndpointOutputSchemas.emailFinder.parse({})).toThrow(
			z.ZodError,
		);
	});

	it('rejects a person whose score arrived as a string', () => {
		expect(() =>
			TombaEndpointOutputSchemas.emailFinder.parse({
				data: { ...person, score: '100' },
			}),
		).toThrow(z.ZodError);
	});

	it('rejects a domain search whose emails is not an array', () => {
		expect(() =>
			TombaEndpointOutputSchemas.domainSearch.parse({
				data: { organization: domainSearchLive.organization, emails: {} },
			}),
		).toThrow(z.ZodError);
	});

	it('rejects a verifier body missing the checks object', () => {
		expect(() =>
			TombaEndpointOutputSchemas.emailVerifier.parse({ data: {} }),
		).toThrow(z.ZodError);
	});

	it('rejects a suggestions body that is not an array', () => {
		expect(() =>
			TombaEndpointOutputSchemas.domainSuggestions.parse({
				data: { domain: 'stripe.com' },
			}),
		).toThrow(z.ZodError);
	});

	it('rejects an account whose requests block is a string', () => {
		expect(() =>
			TombaEndpointOutputSchemas.getAccount.parse({
				data: { ...account, requests: 'many' },
			}),
		).toThrow(z.ZodError);
	});
});
