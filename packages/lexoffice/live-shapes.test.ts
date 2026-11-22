// Response shapes from a live Lexware Office trial (11-21), trimmed. The voucher id is from the test account.
import { ApiError } from 'corsair/http';
import { sanitizeApiError } from './client';
import type { ContactCreateInput } from './endpoints/types';
import {
	ProfileGetResponseSchema,
	VoucherListResponseSchema,
} from './endpoints/types';

describe('Lexware live response shapes', () => {
	it('lists an unchecked uploaded voucher that has no voucherDate or number yet', () => {
		const parsed = VoucherListResponseSchema.parse({
			content: [
				{
					id: '8d8bfe46-659e-4114-af93-ad177e9f9180',
					voucherType: 'purchaseinvoice',
					voucherStatus: 'unchecked',
					createdDate: '2026-11-21T15:46:00.000+01:00',
					updatedDate: '2026-11-21T15:46:01.000+01:00',
					currency: 'EUR',
					archived: false,
				},
			],
			first: true,
			last: true,
			totalPages: 1,
			totalElements: 1,
			numberOfElements: 1,
			size: 1,
			number: 0,
		});
		expect(parsed.content[0]?.voucherDate).toBeUndefined();
	});

	it('keeps the documented subscriptionStatus and features on profile.get', () => {
		const parsed = ProfileGetResponseSchema.parse({
			organizationId: 'org-1',
			subscriptionStatus: 'active',
			features: ['cashbox'],
			businessFeatures: [],
		});
		expect(parsed.subscriptionStatus).toBe('active');
		expect(parsed.features).toEqual(['cashbox']);
	});

	it('keeps long Lexware issue identifiers on sanitized errors', () => {
		const error = new ApiError(
			{ method: 'POST', url: '/contacts' },
			{
				url: 'https://api.lexware.io/v1/contacts',
				ok: false,
				status: 400,
				statusText: 'Bad Request',
				body: {
					IssueList: [
						{
							i18nKey: 'invalid_value',
							source: 'contact_has_not_mappable_phone_number',
							type: 'validation_failure',
						},
					],
				},
			},
			'Bad Request',
		);
		sanitizeApiError(error);
		expect(error.body).toEqual({
			message: 'Lexware API request failed',
			IssueList: [
				{
					i18nKey: 'invalid_value',
					source: 'contact_has_not_mappable_phone_number',
					type: 'validation_failure',
				},
			],
		});
	});

	it('lets typed callers leave out version on contacts.create', () => {
		const input: ContactCreateInput = {
			roles: { customer: {} },
			company: { name: 'corsair-plugin-test GmbH' },
		};
		expect(input.version).toBeUndefined();
	});

	it('still drops token-like text in issue fields and messages', () => {
		const error = new ApiError(
			{ method: 'GET', url: '/profile' },
			{
				url: 'https://api.lexware.io/v1/profile',
				ok: false,
				status: 401,
				statusText: 'Unauthorized',
				body: {
					message: 'bearer_abcdefghijklmnopqrstuvwxyz',
					IssueList: [
						{ i18nKey: 'bearer_abcdefghijklmnopqrstuvwxyz' },
						{ source: 'abcdefghijklmnopqrstuvwxyzabcd' },
						{ source: 'secret_value_here' },
					],
				},
			},
			'Unauthorized',
		);
		sanitizeApiError(error);
		expect(error.body).toEqual({ message: 'Lexware API request failed' });
		expect(error.message).toBe('Lexware API request failed');
		expect(String(error.stack)).not.toContain('abcdefghij');
	});
});
