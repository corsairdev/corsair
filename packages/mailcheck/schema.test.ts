import { mailcheck } from './index';
import { MailcheckSchema } from './schema';

describe('Mailcheck schema and plugin', () => {
	it('declares a semver version', () => {
		expect(MailcheckSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an empty entities map', () => {
		expect(MailcheckSchema.entities).toEqual({});
	});

	it('instantiates with an api key and both endpoints', () => {
		const plugin = mailcheck({ key: 'test-key' });
		expect(plugin.id).toBe('mailcheck');
		expect(typeof plugin.endpoints?.email.verify).toBe('function');
		expect(typeof plugin.endpoints?.domain.validate).toBe('function');
	});
});
