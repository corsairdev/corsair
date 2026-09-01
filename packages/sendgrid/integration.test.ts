import { sendgrid } from './index';

describe('SendGrid Plugin Integration', () => {
	it('instantiates plugin with default options', () => {
		const plugin = sendgrid({ key: 'SG.test_key' });
		expect(plugin.id).toBe('sendgrid');
		expect(plugin.options?.key).toBe('SG.test_key');
	});

	it('defines endpoints tree correctly', () => {
		const plugin = sendgrid({ key: 'SG.test_key' });
		expect(plugin.endpoints?.mail?.send).toBeDefined();
		expect(plugin.endpoints?.contacts?.addOrUpdate).toBeDefined();
		expect(plugin.endpoints?.lists?.getAll).toBeDefined();
		expect(plugin.endpoints?.lists?.create).toBeDefined();
		expect(plugin.endpoints?.suppressions?.getBounces).toBeDefined();
		expect(plugin.endpoints?.senders?.getAll).toBeDefined();
	});

	it('registers endpoint metadata correctly', () => {
		const plugin = sendgrid({ key: 'SG.test_key' });
		expect(plugin.endpointMeta?.['mail.send']?.riskLevel).toBe('write');
		expect(plugin.endpointMeta?.['lists.getAll']?.riskLevel).toBe('read');
		expect(plugin.endpointMeta?.['senders.getAll']?.riskLevel).toBe('read');
	});

	it('matches signed SendGrid event webhook headers', () => {
		const plugin = sendgrid({ key: 'SG.test_key' });
		expect(
			plugin.pluginWebhookMatcher?.({
				body: '[]',
				headers: {
					'x-twilio-email-event-webhook-signature': 'sig',
				},
			}),
		).toBe(true);
	});
});
