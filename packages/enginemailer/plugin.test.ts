import { errorHandlers } from './error-handlers';
import {
	enginemailer,
	enginemailerAuthConfig,
	enginemailerEndpointSchemas,
} from './index';

describe('Enginemailer plugin contract', () => {
	it('uses API-key authentication without extra account fields', () => {
		const plugin = enginemailer();

		expect(plugin.id).toBe('enginemailer');
		expect(plugin.options?.authType).toBe('api_key');
		expect(enginemailerAuthConfig.api_key.account).toEqual([]);
	});

	it('registers both endpoint batches', () => {
		expect(Object.keys(enginemailerEndpointSchemas)).toHaveLength(38);
		expect(enginemailerEndpointSchemas['subscribers.get']).toBeDefined();
		expect(enginemailerEndpointSchemas['campaigns.sendCampaign']).toBeDefined();
		expect(enginemailerEndpointSchemas['n8n.listForms']).toBeDefined();
	});

	it('classifies destructive subscriber and campaign operations safely', () => {
		const plugin = enginemailer();
		const metadata = plugin.endpointMeta as Record<
			string,
			{ riskLevel: string }
		>;

		expect(metadata['subscribers.deleteSubscriber']?.riskLevel).toBe(
			'destructive',
		);
		expect(metadata['campaigns.deleteCampaign']?.riskLevel).toBe('destructive');
		expect(metadata['campaigns.sendCampaign']?.riskLevel).toBe('write');
		expect(metadata['n8n.deleteN8nSubscriber']?.riskLevel).toBe('destructive');
	});

	it('matches authentication and rate-limit errors', async () => {
		const auth = new Error('Authentication Failed!');
		const rate = new Error('429 rate limited');

		expect(errorHandlers.AUTH_ERROR.match(auth)).toBe(true);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(rate)).toBe(true);
		expect(await errorHandlers.AUTH_ERROR.handler()).toEqual({
			maxRetries: 0,
		});
	});
});
