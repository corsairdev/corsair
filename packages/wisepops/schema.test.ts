import {
	DataPrivacyDeleteInputSchema,
	DataPrivacyDeleteResponseSchema,
	WebhookDeleteInputSchema,
	WebhookDeleteResponseSchema,
} from './endpoints/types';
import { WisepopsSchema } from './schema';

describe('Wisepops schema', () => {
	it('declares a semver version', () => {
		expect(WisepopsSchema.version).toBeDefined();
		expect(WisepopsSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof WisepopsSchema.entities).toBe('object');
		expect(WisepopsSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(WisepopsSchema.entities))).toBe(true);
		for (const entity of Object.values(WisepopsSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});

	describe('Destructive operations schema validation', () => {
		it('rejects empty data privacy deletion input', () => {
			const result = DataPrivacyDeleteInputSchema.safeParse({});
			expect(result.success).toBe(false);
		});

		it('rejects whitespace-only data privacy deletion input', () => {
			const result = DataPrivacyDeleteInputSchema.safeParse({ email: '   ' });
			expect(result.success).toBe(false);
		});

		it('rejects invalid email for data privacy deletion', () => {
			const result = DataPrivacyDeleteInputSchema.safeParse({
				email: 'not-an-email',
			});
			expect(result.success).toBe(false);
		});

		it('rejects non-E.164 phone numbers for data privacy deletion', () => {
			expect(
				DataPrivacyDeleteInputSchema.safeParse({ phone: '1234567890' }).success,
			).toBe(false);
			expect(
				DataPrivacyDeleteInputSchema.safeParse({ phone: '+1 234 567 890' })
					.success,
			).toBe(false);
			expect(
				DataPrivacyDeleteInputSchema.safeParse({ phone: 'invalid' }).success,
			).toBe(false);
		});

		it('accepts valid email for data privacy deletion', () => {
			const result = DataPrivacyDeleteInputSchema.safeParse({
				email: 'user@example.com',
			});
			expect(result.success).toBe(true);
		});

		it('accepts valid E.164 phone for data privacy deletion', () => {
			const result = DataPrivacyDeleteInputSchema.safeParse({
				phone: '+14155552671',
			});
			expect(result.success).toBe(true);
		});

		it('accepts both valid email and phone for data privacy deletion', () => {
			const result = DataPrivacyDeleteInputSchema.safeParse({
				email: 'user@example.com',
				phone: '+14155552671',
			});
			expect(result.success).toBe(true);
		});

		it('validates data privacy delete response', () => {
			expect(
				DataPrivacyDeleteResponseSchema.safeParse({ deleted: 1 }).success,
			).toBe(true);
			expect(
				DataPrivacyDeleteResponseSchema.safeParse({ deleted: 'not-a-number' })
					.success,
			).toBe(false);
		});

		it('rejects non-positive and non-integer hook_id for webhook deletion', () => {
			expect(WebhookDeleteInputSchema.safeParse({}).success).toBe(false);
			expect(WebhookDeleteInputSchema.safeParse({ hook_id: 0 }).success).toBe(
				false,
			);
			expect(WebhookDeleteInputSchema.safeParse({ hook_id: -5 }).success).toBe(
				false,
			);
			expect(WebhookDeleteInputSchema.safeParse({ hook_id: 1.5 }).success).toBe(
				false,
			);
			expect(WebhookDeleteInputSchema.safeParse({ hook_id: 42 }).success).toBe(
				true,
			);
		});

		it('validates webhook delete responses with typed schema', () => {
			expect(WebhookDeleteResponseSchema.safeParse(undefined).success).toBe(
				true,
			);
			expect(WebhookDeleteResponseSchema.safeParse(null).success).toBe(true);
			expect(
				WebhookDeleteResponseSchema.safeParse({ success: true }).success,
			).toBe(true);
			expect(
				WebhookDeleteResponseSchema.safeParse({ message: 'deleted' }).success,
			).toBe(true);
		});
	});
});
