import { z } from 'zod';
import {
	ClickSendEndpointInputSchemas,
	ClickSendEndpointOutputSchemas,
} from './endpoints/types';
import { clickSendEndpointSchemas } from './index';
import { ClickSendSchema } from './schema';

const EXPECTED_ENDPOINT_COUNT = 164;

describe('ClickSend schema', () => {
	it('declares a semver version', () => {
		expect(ClickSendSchema.version).toBeDefined();
		expect(ClickSendSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares messages and contacts entities', () => {
		expect(ClickSendSchema.entities.messages).toBeDefined();
		expect(ClickSendSchema.entities.contacts).toBeDefined();
	});

	it('registers every implemented endpoint with input and output schemas', () => {
		const entries = Object.entries(clickSendEndpointSchemas);
		expect(entries.length).toBe(EXPECTED_ENDPOINT_COUNT);
		for (const [path, entry] of entries) {
			expect(typeof entry.input.safeParse).toBe('function');
			expect(typeof entry.output.safeParse).toBe('function');
			expect(path.length).toBeGreaterThan(0);
		}
	});

	it('exposes matching input/output schema maps in endpoints/types', () => {
		expect(Object.keys(ClickSendEndpointInputSchemas).length).toBeGreaterThan(
			0,
		);
		expect(Object.keys(ClickSendEndpointOutputSchemas)).toContain('smsSend');
	});

	it('rejects empty SMS send input and accepts a valid one', () => {
		const invalid = ClickSendEndpointInputSchemas.smsSend.safeParse({});
		expect(invalid.success).toBe(false);
		const valid = ClickSendEndpointInputSchemas.smsSend.safeParse({
			messages: [{ to: '+61411111111', body: 'Hello' }],
		});
		expect(valid.success).toBe(true);
	});

	it('rejects unknown input keys on strict schemas', () => {
		const parsed = ClickSendEndpointInputSchemas.smsSend.safeParse({
			messages: [{ to: '+61411111111', body: 'Hello' }],
			bogus: true,
		});
		// Legacy sms schemas strip unknown keys; strict schemas reject them.
		expect(parsed.success).toBe(true);
		const strict = clickSendEndpointSchemas['sms.price'].input.safeParse({
			messages: [{ to: '+61411111111', body: 'Hello' }],
			bogus: true,
		});
		expect(strict.success).toBe(false);
	});

	it('parses a paginated SMS history response', () => {
		const parsed = ClickSendEndpointOutputSchemas.smsHistory.safeParse({
			current_page: 1,
			per_page: 15,
			total: 0,
			last_page: 1,
			data: [],
		});
		expect(parsed.success).toBe(true);
	});

	it('parses an account response and rejects a wrong-typed balance', () => {
		const valid = ClickSendEndpointOutputSchemas.accountGet.safeParse({
			user_id: 123,
			username: 'tester',
			user_email: 'tester@example.com',
			balance: 12.5,
		});
		expect(valid.success).toBe(true);
		const invalid = ClickSendEndpointOutputSchemas.accountGet.safeParse({
			user_id: 123,
			username: 'tester',
			user_email: 'tester@example.com',
			balance: 'rich',
		});
		expect(invalid.success).toBe(false);
	});

	it('requires core contact fields on contact creation input', () => {
		const parsed = ClickSendEndpointInputSchemas.contactsCreate.safeParse({
			list_id: 7,
		});
		expect(parsed.success).toBe(false);
	});

	it('accepts generic zod schemas registered for new domains', () => {
		const schemas = [
			clickSendEndpointSchemas['mms.send'].output,
			clickSendEndpointSchemas['campaigns.sms.send'].input,
			clickSendEndpointSchemas['postLetters.send'].input,
			clickSendEndpointSchemas['numbers.buy'].input,
		];
		for (const schema of schemas) {
			expect(schema instanceof z.ZodType).toBe(true);
		}
	});
});
