import { mapEmailReputationToValidation } from './email-validation';
import type { EmailReputationResponse } from './types';

// Fixture captured from a real GET emailreputation.abstractapi.com/v1
// response for support@abstractapi.com.
const DELIVERABLE_REPUTATION: EmailReputationResponse = {
	email_address: 'support@abstractapi.com',
	suggested_correction: null,
	email_deliverability: {
		status: 'deliverable',
		status_detail: 'valid_email',
		is_format_valid: true,
		is_smtp_valid: true,
		is_mx_valid: true,
		mx_records: ['aspmx.l.google.com'],
	},
	email_sender: {
		first_name: 'Support',
		last_name: null,
		email_provider_name: 'Google',
		organization_name: 'Abstract API',
		organization_type: 'commercial',
	},
	email_domain: {
		domain: 'abstractapi.com',
		domain_age: 2269,
		is_live_site: true,
		registrar: 'NAMECHEAP INC',
		registrar_url: 'https://namecheap.com',
		date_registered: '2020-05-13',
		date_last_renewed: '2026-04-13',
		date_expires: '2027-05-13',
		is_risky_tld: false,
	},
	email_quality: {
		score: 0.6,
		is_free_email: false,
		is_username_suspicious: false,
		is_disposable: false,
		is_catchall: true,
		is_subaddress: false,
		is_role: true,
		is_dmarc_enforced: false,
		is_spf_strict: false,
		minimum_age: null,
	},
	email_risk: {
		address_risk_status: 'low',
		domain_risk_status: 'medium',
	},
	email_breaches: {
		total_breaches: 0,
		date_first_breached: null,
		date_last_breached: null,
		breached_domains: [],
	},
};

describe('mapEmailReputationToValidation', () => {
	it('maps a deliverable, catch-all, role-based address', () => {
		const result = mapEmailReputationToValidation(DELIVERABLE_REPUTATION);

		expect(result).toEqual({
			email: 'support@abstractapi.com',
			autocorrect: '',
			deliverability: 'deliverable',
			quality_score: 0.6,
			is_valid_format: true,
			is_free_email: false,
			is_disposable_email: false,
			is_role_email: true,
			is_catchall_email: true,
			is_mx_found: true,
			is_smtp_valid: true,
		});
	});

	it('surfaces a suggested correction when Abstract detects a likely typo', () => {
		const result = mapEmailReputationToValidation({
			...DELIVERABLE_REPUTATION,
			suggested_correction: 'support@abstractapi.com',
		});

		expect(result.autocorrect).toBe('support@abstractapi.com');
	});

	it('defaults is_role_email to false when Abstract omits is_role', () => {
		const { is_role, ...qualityWithoutRole } =
			DELIVERABLE_REPUTATION.email_quality;

		const result = mapEmailReputationToValidation({
			...DELIVERABLE_REPUTATION,
			email_quality: qualityWithoutRole,
		});

		expect(result.is_role_email).toBe(false);
	});

	it('maps an undeliverable, non-catchall, free-provider address', () => {
		const result = mapEmailReputationToValidation({
			...DELIVERABLE_REPUTATION,
			email_address: 'someone@gmail.com',
			email_deliverability: {
				...DELIVERABLE_REPUTATION.email_deliverability,
				status: 'undeliverable',
				is_smtp_valid: false,
				is_mx_valid: true,
			},
			email_quality: {
				...DELIVERABLE_REPUTATION.email_quality,
				is_free_email: true,
				is_catchall: false,
				is_role: false,
			},
		});

		expect(result.email).toBe('someone@gmail.com');
		expect(result.deliverability).toBe('undeliverable');
		expect(result.is_free_email).toBe(true);
		expect(result.is_catchall_email).toBe(false);
		expect(result.is_smtp_valid).toBe(false);
	});
});
