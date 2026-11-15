import { z } from 'zod';
import { TombaEndpointOutputSchemas } from './endpoints/types';
import {
	account,
	company,
	emailCount,
	person,
	personNotFound,
	phoneValidation,
	suggestion,
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
			data: { organization: company, emails: [person] },
			meta: { total: 681, current_page: 1, last_page: 14, per_page: 50 },
		});
		expect(parsed.data.organization?.name).toBe('Stripe');
		expect(parsed.data.emails).toHaveLength(1);
		expect(parsed.meta?.last_page).toBe(14);
	});

	it('parses an empty domain search', () => {
		const parsed = TombaEndpointOutputSchemas.domainSearch.parse({
			data: { organization: company, emails: [] },
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
		expect(parsed.data.valid).toBe(true);
		expect(parsed.data.line_type).toBe('MOBILE');
	});

	it('parses the account with its credit counters', () => {
		const parsed = TombaEndpointOutputSchemas.getAccount.parse({
			data: account,
		});
		expect(parsed.data.requests?.domains?.available).toBe(100);
		expect(parsed.data.requests?.domains?.used).toBe(12);
		// The account body also carries secret_token; it is not in the schema, so
		// it never reaches a caller that parses through it.
		expect(parsed.data).not.toHaveProperty('secret_token');
	});

	it('parses a company profile', () => {
		const parsed = TombaEndpointOutputSchemas.companyFind.parse({
			data: company,
		});
		expect(parsed.data.name).toBe('Stripe');
		expect(parsed.data.facebook).toBeNull();
	});

	it('parses the combined answer with both objects', () => {
		const parsed = TombaEndpointOutputSchemas.combinedFind.parse({
			data: { person, company },
		});
		expect(parsed.data.person?.full_name).toBe('Jane Doe');
		expect(parsed.data.company?.industry).toBe('Financial Services');
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
				data: { organization: company, emails: {} },
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
