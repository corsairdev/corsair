import {
	AccountGetOutputSchema,
	EmailVerifierVerifyInputSchema,
	LeadsCreateInputSchema,
	LeadsListInputSchema,
	MessagesSendInputSchema,
	SequencesCreateInputSchema,
	SequencesDeleteOutputSchema,
	WebhooksCreateInputSchema,
} from './endpoints/types';
import { HunterioSchema } from './schema';
import { hunterioEntities } from './schema/database';

describe('Hunterio schema', () => {
	it('declares a semver version', () => {
		expect(HunterioSchema.version).toBeDefined();
		expect(HunterioSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an empty entities map', () => {
		expect(HunterioSchema.entities).toBe(hunterioEntities);
		expect(HunterioSchema.entities).toEqual({});
	});
});

describe('Hunterio shared envelopes', () => {
	it('accepts both the legacy and status-prefixed response envelopes', () => {
		expect(
			AccountGetOutputSchema.safeParse({ data: { plan_name: 'Starter' } })
				.success,
		).toBe(true);
		expect(
			AccountGetOutputSchema.safeParse({
				status: 'success',
				data: {},
				meta: { total: 1 },
			}).success,
		).toBe(true);
	});

	it('requires a data key on enveloped responses', () => {
		expect(AccountGetOutputSchema.safeParse({}).success).toBe(false);
	});

	it('parses 204 deletes as undefined', () => {
		expect(SequencesDeleteOutputSchema.safeParse(undefined).success).toBe(true);
		expect(SequencesDeleteOutputSchema.safeParse({}).success).toBe(false);
	});
});

describe('Hunterio endpoint schemas', () => {
	it('validates lead create inputs and bounds', () => {
		expect(
			LeadsCreateInputSchema.safeParse({
				email: 'jane@example.com',
				confidence_score: 60,
				company_type: 'Private',
			}).success,
		).toBe(true);
		expect(
			LeadsCreateInputSchema.safeParse({ confidence_score: 150 }).success,
		).toBe(false);
	});

	it('validates nested lead list filters', () => {
		expect(
			LeadsListInputSchema.safeParse({
				location: { country: { include: ['US'] } },
				sending_status: ['sent'],
				position: ['cto', 'founder'],
			}).success,
		).toBe(true);
		expect(
			LeadsListInputSchema.safeParse({ sending_status: ['bogus'] }).success,
		).toBe(false);
	});

	it('validates email verifier input', () => {
		expect(
			EmailVerifierVerifyInputSchema.safeParse({ email: 'a@b.com' }).success,
		).toBe(true);
		expect(EmailVerifierVerifyInputSchema.safeParse({}).success).toBe(false);
	});

	it('requires a message recipient and bounds the subject', () => {
		const base = {
			email_account_id: 1,
			subject: 'Intro',
			body: 'Hello',
		};
		expect(MessagesSendInputSchema.safeParse(base).success).toBe(false);
		expect(
			MessagesSendInputSchema.safeParse({ ...base, to: 'a@b.com' }).success,
		).toBe(true);
		expect(
			MessagesSendInputSchema.safeParse({
				...base,
				lead_id: 2,
				subject: 'x'.repeat(251),
			}).success,
		).toBe(false);
	});

	it('accepts string or number ids alike', () => {
		expect(
			MessagesSendInputSchema.safeParse({
				email_account_id: '1',
				lead_id: 2,
				subject: 'Hi',
				body: 'There',
			}).success,
		).toBe(true);
	});

	it('requires a sequence name', () => {
		expect(SequencesCreateInputSchema.safeParse({ name: 'Q4' }).success).toBe(
			true,
		);
		expect(SequencesCreateInputSchema.safeParse({}).success).toBe(false);
	});

	it('validates webhook creation', () => {
		expect(
			WebhooksCreateInputSchema.safeParse({
				target_url: 'https://example.com/hooks/hunter',
				event: 'lead.created',
			}).success,
		).toBe(true);
		expect(
			WebhooksCreateInputSchema.safeParse({
				target_url: 'short',
				event: 'lead.created',
			}).success,
		).toBe(false);
		expect(
			WebhooksCreateInputSchema.safeParse({
				target_url: 'https://example.com/hooks/hunter',
				event: 'not.an.event',
			}).success,
		).toBe(false);
	});
});
