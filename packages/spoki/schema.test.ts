import { describe, expect, it } from '@jest/globals';
import { EndpointInputSchemas, EndpointOutputSchemas } from './endpoints/types';
import { SpokiSchema } from './schema';

const validAccount = {
	id: 13128334,
	name: 'MyShop',
	current_credit: 8556300,
	status: 'Active',
	default_language: 'it',
	phone: '3933312345678',
	has_official_verification: false,
	daily_limit: 100000,
	phone_status: 'Connected',
	quality_score: 1,
	quality_reasons: null,
	is_active: true,
	country_code: '',
	estimated_available_conversations: 85563,
	account_type: 2,
	default_pricing_delta: 0,
	low_credit_threshold: 15000,
	has_low_credit_alert: false,
	default_prefix: '+39',
	default_country_code: 'IT',
	timezone: 'Europe/Rome',
	contacted_in_24h: 150,
	contacted_in_7d: 602,
};

describe('Spoki schema', () => {
	it('parses a documented account payload', () => {
		const parsed = SpokiSchema.entities.accounts.parse(validAccount);
		expect(parsed.name).toBe('MyShop');
		expect(parsed.id).toBe(13128334);
	});

	it('parses an account with documented channels', () => {
		const parsed = SpokiSchema.entities.accounts.parse({
			...validAccount,
			channels: [
				{
					name: 'Main WhatsApp',
					identifier: '3933312345678',
					platform: 'WhatsApp',
					status: 'Active',
					phone_status: '🟢 Connected',
					quality_score: '🟢 Green',
					is_primary: true,
				},
			],
		});
		expect(parsed.channels).toHaveLength(1);
		expect(parsed.channels?.[0]?.identifier).toBe('3933312345678');
	});

	it('parses a live account with null phone', () => {
		const parsed = SpokiSchema.entities.accounts.parse({
			...validAccount,
			phone: null,
		});
		expect(parsed.phone).toBeNull();
	});

	it('parses an account without quality_reasons', () => {
		const { quality_reasons: _omitted, ...withoutReasons } = validAccount;
		const parsed = SpokiSchema.entities.accounts.parse(withoutReasons);
		expect(parsed.id).toBe(13128334);
		expect(parsed.quality_reasons).toBeUndefined();
	});

	it('rejects an account missing required fields', () => {
		expect(() =>
			SpokiSchema.entities.accounts.parse({ id: 1, name: 'Incomplete' }),
		).toThrow();
	});

	it('rejects an account with a wrong-typed field', () => {
		expect(() =>
			SpokiSchema.entities.accounts.parse({
				...validAccount,
				current_credit: 'many',
			}),
		).toThrow();
	});

	it('parses a documented channel payload', () => {
		const parsed = SpokiSchema.entities.channels.parse({
			name: 'SMS Sender',
			identifier: 'MyShop',
			platform: 'SMS',
			status: 'Active',
			phone_status: '❔ Undefined',
			quality_score: '❔ Undefined',
			is_primary: true,
		});
		expect(parsed.platform).toBe('SMS');
	});
});

describe('Spoki endpoint schemas', () => {
	it('parses listAccounts output as a bare array of accounts', () => {
		const parsed = EndpointOutputSchemas.listAccounts.parse([validAccount]);
		expect(parsed).toHaveLength(1);
	});

	it('rejects listAccounts output wrapped in an object', () => {
		expect(() =>
			EndpointOutputSchemas.listAccounts.parse({ accounts: [] }),
		).toThrow();
	});

	it('parses getAccount output', () => {
		const parsed = EndpointOutputSchemas.getAccount.parse(validAccount);
		expect(parsed.phone).toBe('3933312345678');
	});

	it('parses sendMessage input with optional fields', () => {
		const parsed = EndpointInputSchemas.sendMessage.parse({
			phone: '+3933312345678',
			text: 'Hello',
			metadata: { order_id: '1234' },
		});
		expect(parsed.text).toBe('Hello');
	});

	it('rejects sendMessage input missing text', () => {
		expect(() =>
			EndpointInputSchemas.sendMessage.parse({ phone: '+3933312345678' }),
		).toThrow();
	});

	it('parses triggerAutomation input with the automation uuid', () => {
		const parsed = EndpointInputSchemas.triggerAutomation.parse({
			uuid: 'auto-uuid',
			secret: 'whsec-secret',
			phone: '+3933312345678',
		});
		expect(parsed.uuid).toBe('auto-uuid');
	});

	it('rejects triggerAutomation input missing uuid or secret', () => {
		expect(() =>
			EndpointInputSchemas.triggerAutomation.parse({
				secret: 'whsec-secret',
				phone: '+3933312345678',
			}),
		).toThrow();
		expect(() =>
			EndpointInputSchemas.triggerAutomation.parse({
				uuid: 'auto-uuid',
				phone: '+3933312345678',
			}),
		).toThrow();
	});

	it('rejects triggerAutomation input with an invalid email', () => {
		expect(() =>
			EndpointInputSchemas.triggerAutomation.parse({
				uuid: 'auto-uuid',
				secret: 'whsec-secret',
				phone: '+3933312345678',
				email: 'not-an-email',
			}),
		).toThrow();
	});
});
