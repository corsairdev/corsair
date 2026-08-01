import {
	EmailReputationResponseSchema,
	IbanValidateResponseSchema,
	VatGetCategoriesResponseSchema,
} from './types';

// Endpoints call these schemas on the raw provider response at runtime
// (see the `.parse(rawResponse)` calls in email-reputation.ts, vat.ts, and
// iban.ts) — this proves that call has real teeth: a shape Abstract's API
// was never observed to return gets rejected instead of silently trusted.
describe('runtime output validation rejects malformed provider responses', () => {
	it('rejects an Email Reputation response missing required nested fields', () => {
		const malformed = {
			email_address: 'support@abstractapi.com',
			// email_deliverability, email_quality, email_sender, email_domain,
			// email_risk are all missing — a provider error page or a
			// differently-shaped response would look like this.
		};

		expect(() => EmailReputationResponseSchema.parse(malformed)).toThrow();
	});

	it('rejects a VAT categories response with the wrong (nested) shape', () => {
		// The shape we originally guessed from docs before verifying against
		// the real API — kept here as a regression case for exactly the bug
		// that was caught by testing against the live endpoint.
		const wronglyNestedShape = [
			{
				category_id: 'water',
				category_name: 'Water',
				category_description: 'Supply of water.',
				vat_category_rate: {
					country_code: 'DE',
					category: 'water',
					rate: 0.07,
				},
			},
		];

		expect(() =>
			VatGetCategoriesResponseSchema.parse(wronglyNestedShape),
		).toThrow();
	});

	it('rejects an IBAN response with the wrong (nested details) shape', () => {
		// Also the originally-guessed shape, superseded once the real
		// response ({ iban, is_valid }) was confirmed against the live API.
		const wrongShape = {
			iban: 'DE89370400440532013000',
			valid: true,
			details: { country: 'Germany', bank_code: '37040044' },
		};

		expect(() => IbanValidateResponseSchema.parse(wrongShape)).toThrow();
	});

	it('accepts the real Abstract IBAN response shape', () => {
		const real = { iban: 'DE89370400440532013000', is_valid: true };
		expect(() => IbanValidateResponseSchema.parse(real)).not.toThrow();
	});

	it('accepts email_deliverability.mx_records as null (not just an empty array)', () => {
		// Observed on a real heavily-breached test address — mx_records can be
		// null rather than [].
		const withNullMxRecords = {
			status: 'deliverable',
			status_detail: 'valid_email',
			is_format_valid: true,
			is_smtp_valid: true,
			is_mx_valid: true,
			mx_records: null,
		};

		expect(() =>
			EmailReputationResponseSchema.shape.email_deliverability.parse(
				withNullMxRecords,
			),
		).not.toThrow();
	});

	it('accepts a real Email Reputation response for an invalid address', () => {
		// Captured from a live GET emailreputation.abstractapi.com/v1 call for
		// "not-a-valid-email" — Abstract returns 200 with null domain/risk/
		// breach fields rather than an error, since there's nothing to look up.
		const invalidAddressResponse = {
			email_address: 'not-a-valid-email',
			suggested_correction: null,
			email_deliverability: {
				status: 'undeliverable',
				status_detail: 'Invalid format',
				is_format_valid: false,
				is_smtp_valid: false,
				is_mx_valid: false,
				mx_records: [],
			},
			email_sender: {
				first_name: null,
				last_name: null,
				email_provider_name: null,
				organization_name: null,
				organization_type: null,
			},
			email_domain: {
				domain: null,
				domain_age: null,
				is_live_site: null,
				registrar: null,
				registrar_url: null,
				date_registered: null,
				date_last_renewed: null,
				date_expires: null,
				is_risky_tld: null,
			},
			email_quality: {
				score: 0,
				is_free_email: false,
				is_username_suspicious: false,
				is_disposable: false,
				is_catchall: false,
				is_subaddress: false,
				is_role: false,
				is_dmarc_enforced: false,
				is_spf_strict: false,
				minimum_age: null,
			},
			email_risk: {
				address_risk_status: null,
				domain_risk_status: null,
			},
			email_breaches: {
				total_breaches: null,
				date_first_breached: null,
				date_last_breached: null,
				breached_domains: [],
			},
		};

		expect(() =>
			EmailReputationResponseSchema.parse(invalidAddressResponse),
		).not.toThrow();
	});

	it('accepts real breached_domains objects ({ domain, breach_date }), not plain strings', () => {
		// Captured (trimmed) from a live call for a widely-breached test
		// address — breached_domains is an array of objects, not string[] as
		// originally assumed.
		const breachedEmailBreaches = {
			total_breaches: 642,
			date_first_breached: '2007-07-12',
			date_last_breached: '2026-07-01',
			breached_domains: [
				{ domain: 'adobe.com', breach_date: '2013-10-04' },
				{ domain: 'yahoo.com', breach_date: '2012-07-11' },
				{ domain: 'mail.ru', breach_date: '2014-09-10' },
			],
		};

		expect(() =>
			EmailReputationResponseSchema.shape.email_breaches.parse(
				breachedEmailBreaches,
			),
		).not.toThrow();
	});

	it('rejects the originally-assumed string[] shape for breached_domains', () => {
		const wronglyAssumedShape = {
			total_breaches: 2,
			date_first_breached: '2013-10-04',
			date_last_breached: '2014-09-10',
			breached_domains: ['adobe.com', 'mail.ru'],
		};

		expect(() =>
			EmailReputationResponseSchema.shape.email_breaches.parse(
				wronglyAssumedShape,
			),
		).toThrow();
	});
});
