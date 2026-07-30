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
});
