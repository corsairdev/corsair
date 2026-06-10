import { zohoApiBase, zohoOAuthAuthUrl, zohoOAuthTokenUrl } from './client';
import { zohomail } from './index';

describe('zohomail plugin', () => {
	it('builds with default (US) region and core wiring', () => {
		const plugin = zohomail();
		expect(plugin.id).toBe('zohomail');
		expect(plugin.options?.authType).toBe('oauth_2');
		expect(plugin.oauthConfig?.providerName).toBe('Zoho');
		expect(plugin.oauthConfig?.authUrl).toBe(
			'https://accounts.zoho.com/oauth/v2/auth',
		);
		expect(plugin.oauthConfig?.tokenUrl).toBe(
			'https://accounts.zoho.com/oauth/v2/token',
		);
		expect(plugin.oauthConfig?.scopes).toContain('ZohoMail.messages.ALL');
	});

	it('exposes the expected message and folder endpoints', () => {
		const plugin = zohomail();
		expect(Object.keys(plugin.endpoints!.messages)).toEqual(
			expect.arrayContaining([
				'list',
				'get',
				'send',
				'delete',
				'move',
				'markRead',
				'markUnread',
			]),
		);
		expect(Object.keys(plugin.endpoints!.folders)).toEqual(
			expect.arrayContaining(['list', 'get', 'create', 'update', 'delete']),
		);
	});

	it('flags destructive endpoints in metadata', () => {
		const plugin = zohomail();
		expect(plugin.endpointMeta!['messages.delete']?.riskLevel).toBe(
			'destructive',
		);
		expect(plugin.endpointMeta!['folders.delete']?.riskLevel).toBe(
			'destructive',
		);
		expect(plugin.endpointMeta!['messages.list']?.riskLevel).toBe('read');
	});
});

describe('zoho region datacenter mapping', () => {
	it('maps each region to the correct hosts', () => {
		expect(zohoApiBase('us')).toBe('https://mail.zoho.com/api');
		expect(zohoApiBase('eu')).toBe('https://mail.zoho.eu/api');
		expect(zohoApiBase('in')).toBe('https://mail.zoho.in/api');
		expect(zohoApiBase('au')).toBe('https://mail.zoho.com.au/api');
		expect(zohoApiBase('jp')).toBe('https://mail.zoho.jp/api');
		expect(zohoApiBase('cn')).toBe('https://mail.zoho.com.cn/api');
	});

	it('defaults to US when region is undefined', () => {
		expect(zohoApiBase()).toBe('https://mail.zoho.com/api');
		expect(zohoOAuthAuthUrl()).toBe('https://accounts.zoho.com/oauth/v2/auth');
		expect(zohoOAuthTokenUrl()).toBe(
			'https://accounts.zoho.com/oauth/v2/token',
		);
	});

	it('threads the EU region into the oauth config', () => {
		const plugin = zohomail({ region: 'eu' });
		expect(plugin.oauthConfig?.tokenUrl).toBe(
			'https://accounts.zoho.eu/oauth/v2/token',
		);
	});

	it('exposes handshake and message webhooks', () => {
		const plugin = zohomail();
		expect(plugin.webhooks?.challenge.handshake).toBeDefined();
		expect(plugin.webhooks?.messages.received).toBeDefined();
	});
});
