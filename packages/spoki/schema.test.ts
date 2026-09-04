import type {
	SendMessageInput,
	SpokiAccount,
	SpokiChannel,
	StartAutomationInput,
} from './endpoints/types';

import { SpokiSchema } from './schema';

describe('Spoki schema', () => {
	it('declares a semver version', () => {
		expect(SpokiSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares account and channel entities', () => {
		expect(Object.keys(SpokiSchema.entities).sort()).toEqual([
			'accounts',
			'channels',
		]);
	});

	it('supports Spoki accounts', () => {
		const account: SpokiAccount = {
			id: 1,
			name: 'Test Account',
			current_credit: 100,
			status: 'active',
			default_language: 'en',
			phone: '+919999999999',
			has_official_verification: false,
			daily_limit: 1000,
			phone_status: 'active',
			quality_score: 100,
			quality_reasons: null,
			is_active: true,
			country_code: 'IN',
			estimated_available_conversations: 100,
			account_type: 1,
			default_pricing_delta: 0,
			low_credit_threshold: 10,
			has_low_credit_alert: false,
			default_prefix: '+91',
			default_country_code: 'IN',
			timezone: 'Asia/Kolkata',
			contacted_in_24h: 1,
			contacted_in_7d: 5,
		};

		expect(account.id).toBe(1);
	});

	it('supports channels', () => {
		const channel: SpokiChannel = {
			id: 1,
			name: 'Main',
			phone: '+919999999999',
			phone_status: 'active',
			quality_score: 100,
			has_official_verification: true,
			daily_limit: 1000,
			account_type: 1,
			is_active: true,
		};

		expect(channel.name).toBe('Main');
	});

	it('supports automation input', () => {
		const input: StartAutomationInput = {
			secret: 'secret',
			phone: '+919999999999',
			first_name: 'John',
			last_name: 'Doe',
		};

		expect(input.phone).toBe('+919999999999');
	});

	it('supports message input', () => {
		const input: SendMessageInput = {
			phone: '+919999999999',
			message: 'Hello',
		};

		expect(input.message).toBe('Hello');
	});
});
