import 'dotenv/config';
import { makeAbstractRequest } from './client';
import { mapEmailReputationToValidation } from './endpoints/email-validation';
import type {
	EmailReputationResponse,
	IbanValidateResponse,
	VatGetCategoriesResponse,
} from './endpoints/types';
import { AbstractEndpointOutputSchemas } from './endpoints/types';

// Abstract API keys are scoped per-product; a single test key from the
// dashboard only unlocks the product it was created for, so each product
// reads its own env var (falls back to a shared key if that's all you have).
// Email Validation has no standalone product/key of its own — it's derived
// from the Email Reputation response (see endpoints/email-validation.ts),
// so it reads the same key as email reputation.
const EMAIL_REPUTATION_KEY =
	process.env.ABSTRACT_EMAIL_REPUTATION_API_KEY ??
	process.env.ABSTRACT_API_KEY!;
const VAT_KEY =
	process.env.ABSTRACT_VAT_API_KEY ?? process.env.ABSTRACT_API_KEY!;
const IBAN_KEY =
	process.env.ABSTRACT_IBAN_VALIDATION_API_KEY ?? process.env.ABSTRACT_API_KEY!;

describe('Abstract API Type Tests', () => {
	describe('email validation', () => {
		it('validate returns correct type for a deliverable address', async () => {
			const reputationResponse =
				await makeAbstractRequest<EmailReputationResponse>(
					'emailReputation',
					'',
					EMAIL_REPUTATION_KEY,
					{ query: { email: 'support@abstractapi.com' } },
				);

			const response = mapEmailReputationToValidation(reputationResponse);

			AbstractEndpointOutputSchemas.emailValidate.parse(response);
			expect(response.email).toBe('support@abstractapi.com');
			expect(typeof response.deliverability).toBe('string');
			expect(typeof response.is_valid_format).toBe('boolean');
		});

		it('validate returns correct type for a free-provider address', async () => {
			const reputationResponse =
				await makeAbstractRequest<EmailReputationResponse>(
					'emailReputation',
					'',
					EMAIL_REPUTATION_KEY,
					{ query: { email: 'someone@gmail.com' } },
				);

			const response = mapEmailReputationToValidation(reputationResponse);

			AbstractEndpointOutputSchemas.emailValidate.parse(response);
			expect(response.email).toBe('someone@gmail.com');
			expect(response.is_free_email).toBe(true);
		});
	});

	describe('email reputation', () => {
		it('get returns correct type', async () => {
			const response = await makeAbstractRequest<EmailReputationResponse>(
				'emailReputation',
				'',
				EMAIL_REPUTATION_KEY,
				{ query: { email: 'support@abstractapi.com' } },
			);

			AbstractEndpointOutputSchemas.emailReputation.parse(response);
			expect(response.email_address).toBe('support@abstractapi.com');
			expect(typeof response.email_quality.score).toBe('number');
		});

		it('get returns correct type for an invalid address (null domain/risk/breach fields)', async () => {
			const response = await makeAbstractRequest<EmailReputationResponse>(
				'emailReputation',
				'',
				EMAIL_REPUTATION_KEY,
				{ query: { email: 'not-a-valid-email' } },
			);

			const parsed =
				AbstractEndpointOutputSchemas.emailReputation.parse(response);
			expect(parsed.email_domain.domain).toBeNull();
			expect(parsed.email_risk.address_risk_status).toBeNull();
			expect(parsed.email_breaches?.total_breaches).toBeNull();
		});

		it('get returns correct type for a heavily-breached address', async () => {
			const response = await makeAbstractRequest<EmailReputationResponse>(
				'emailReputation',
				'',
				EMAIL_REPUTATION_KEY,
				{ query: { email: 'test@test.com' } },
			);

			const parsed =
				AbstractEndpointOutputSchemas.emailReputation.parse(response);
			expect(parsed.email_breaches?.total_breaches ?? 0).toBeGreaterThan(0);
			const firstBreach = parsed.email_breaches?.breached_domains?.[0];
			expect(typeof firstBreach?.domain).toBe('string');
		});
	});

	describe('vat categories', () => {
		it('getCategories returns correct type for DE', async () => {
			const response = await makeAbstractRequest<VatGetCategoriesResponse>(
				'vat',
				'categories',
				VAT_KEY,
				{ query: { country_code: 'DE' } },
			);

			AbstractEndpointOutputSchemas.vatGetCategories.parse(response);
			expect(Array.isArray(response)).toBe(true);
			expect(response.length).toBeGreaterThan(0);
			expect(response[0]?.country_code).toBe('DE');
		});

		it('getCategories returns correct type for a different country', async () => {
			const response = await makeAbstractRequest<VatGetCategoriesResponse>(
				'vat',
				'categories',
				VAT_KEY,
				{ query: { country_code: 'FR' } },
			);

			AbstractEndpointOutputSchemas.vatGetCategories.parse(response);
			expect(response.length).toBeGreaterThan(0);
		});
	});

	describe('iban validation', () => {
		it('validate returns correct type for a valid IBAN', async () => {
			const response = await makeAbstractRequest<IbanValidateResponse>(
				'ibanValidation',
				'',
				IBAN_KEY,
				{ query: { iban: 'DE89370400440532013000' } },
			);

			AbstractEndpointOutputSchemas.ibanValidate.parse(response);
			expect(response.iban).toBeTruthy();
			expect(response.is_valid).toBe(true);
		});

		it('validate returns correct type for an invalid IBAN', async () => {
			const response = await makeAbstractRequest<IbanValidateResponse>(
				'ibanValidation',
				'',
				IBAN_KEY,
				{ query: { iban: 'NOTANIBAN123' } },
			);

			AbstractEndpointOutputSchemas.ibanValidate.parse(response);
			expect(response.is_valid).toBe(false);
		});
	});
});
