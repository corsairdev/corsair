import {
	CreateConnectionInputSchema,
	CreateCustomVoiceInputSchema,
	EmptyInputSchema,
	MintKeyInputSchema,
	ProvisionNumberInputSchema,
	SendMessageInputSchema,
	SetCallerIdInputSchema,
	SetSmsSenderInputSchema,
	TranscriptSchema,
} from './endpoints/types';

describe('saperly input bounds', () => {
	it('accepts a 1600 character SMS and rejects 1601', () => {
		const base = { fromNumberId: 'num_1', to: '+14155550123' };
		expect(
			SendMessageInputSchema.safeParse({ ...base, body: 'x'.repeat(1600) })
				.success,
		).toBe(true);
		expect(
			SendMessageInputSchema.safeParse({ ...base, body: 'x'.repeat(1601) })
				.success,
		).toBe(false);
		expect(
			SendMessageInputSchema.safeParse({ ...base, body: '' }).success,
		).toBe(false);
	});

	it('accepts an 11 character sender id and rejects 12', () => {
		expect(
			SetSmsSenderInputSchema.safeParse({
				id: 'num_1',
				smsSenderId: 'A'.repeat(11),
			}).success,
		).toBe(true);
		expect(
			SetSmsSenderInputSchema.safeParse({
				id: 'num_1',
				smsSenderId: 'A'.repeat(12),
			}).success,
		).toBe(false);
		expect(
			SetSmsSenderInputSchema.safeParse({ id: 'num_1', smsSenderId: null })
				.success,
		).toBe(true);
	});

	it('accepts a 15 character caller id and rejects 16', () => {
		expect(
			SetCallerIdInputSchema.safeParse({
				id: 'num_1',
				callerIdName: 'A'.repeat(15),
			}).success,
		).toBe(true);
		expect(
			SetCallerIdInputSchema.safeParse({
				id: 'num_1',
				callerIdName: 'A'.repeat(16),
			}).success,
		).toBe(false);
	});

	it('accepts a 120 character connection name and rejects 121', () => {
		expect(
			CreateConnectionInputSchema.safeParse({ name: 'n'.repeat(120) }).success,
		).toBe(true);
		expect(
			CreateConnectionInputSchema.safeParse({ name: 'n'.repeat(121) }).success,
		).toBe(false);
	});

	it('accepts three scopes and rejects four', () => {
		expect(
			MintKeyInputSchema.safeParse({
				name: 'agent',
				scopes: ['read', 'write', 'admin'],
			}).success,
		).toBe(true);
		expect(
			MintKeyInputSchema.safeParse({
				name: 'agent',
				scopes: ['read', 'write', 'admin', 'read'],
			}).success,
		).toBe(false);
		expect(
			MintKeyInputSchema.safeParse({ name: 'agent', scopes: [] }).success,
		).toBe(false);
		expect(
			MintKeyInputSchema.safeParse({
				name: 'agent',
				scopes: ['read'],
				spendLimitCents: 1,
			}).success,
		).toBe(true);
		expect(
			MintKeyInputSchema.safeParse({
				name: 'agent',
				scopes: ['read'],
				spendLimitCents: 0,
			}).success,
		).toBe(false);
	});

	it('rejects extra keys on a provision body and keeps openai_realtime selectable', () => {
		expect(
			ProvisionNumberInputSchema.safeParse({ refresh: true }).success,
		).toBe(false);
		expect(ProvisionNumberInputSchema.safeParse({}).success).toBe(true);
		expect(
			CreateConnectionInputSchema.safeParse({
				name: 'Desk',
				backend: 'openai_realtime',
			}).success,
		).toBe(true);
	});

	it('requires an idempotency key on custom voice upload', () => {
		const audio = new Blob(['a']);
		expect(
			CreateCustomVoiceInputSchema.safeParse({
				name: 'Mine',
				language: 'en',
				gender: 'neutral',
				audio,
			}).success,
		).toBe(false);
		expect(
			CreateCustomVoiceInputSchema.safeParse({
				name: 'Mine',
				language: 'en',
				gender: 'other',
				audio,
				idempotencyKey: 'k',
			}).success,
		).toBe(false);
	});

	it('strips extra keys on no-arg inputs', () => {
		expect(EmptyInputSchema.safeParse({ refresh: true }).success).toBe(true);
		expect(EmptyInputSchema.parse({ refresh: true })).toEqual({});
	});

	it('parses an empty call list shape and a transcript array', () => {
		expect(TranscriptSchema.safeParse([]).success).toBe(true);
		expect(TranscriptSchema.safeParse({ turns: [] }).success).toBe(true);
		expect(TranscriptSchema.safeParse([{ text: 'hi' }]).success).toBe(true);
	});
});
