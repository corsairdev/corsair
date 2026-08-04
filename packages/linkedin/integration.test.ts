import { linkedin } from './index';

describe('LinkedIn plugin', () => {
	const plugin = linkedin();

	it('exposes the linkedin provider id and oauth config', () => {
		expect(plugin.id).toBe('linkedin');
		expect(plugin.oauthConfig?.providerName).toBe('LinkedIn');
		expect(plugin.oauthConfig?.authUrl).toBe(
			'https://www.linkedin.com/oauth/v2/authorization',
		);
		expect(plugin.oauthConfig?.tokenUrl).toBe(
			'https://www.linkedin.com/oauth/v2/accessToken',
		);
		expect(plugin.oauthConfig?.tokenAuthMethod).toBe('body');
	});

	it('requests the oauth scopes required by the operations', () => {
		const scopes = plugin.oauthConfig?.scopes ?? [];
		const required = [
			'openid',
			'profile',
			'w_member_social',
			'w_organization_social',
			'r_organization_social',
			'rw_organization_admin',
			'r_ads',
		];
		for (const scope of required) {
			expect(scopes).toContain(scope);
		}
	});

	it('defaults to oauth_2 auth', () => {
		expect(plugin.options?.authType).toBe('oauth_2');
	});

	const collectPaths = (node: unknown, prefix = ''): string[] => {
		const paths: string[] = [];
		if (!node || typeof node !== 'object') return paths;
		for (const [key, value] of Object.entries(
			node as Record<string, unknown>,
		)) {
			const path = prefix ? `${prefix}.${key}` : key;
			if (typeof value === 'function') {
				paths.push(path);
			} else if (typeof value === 'object' && value !== null) {
				paths.push(...collectPaths(value, path));
			}
		}
		return paths;
	};

	it('exposes all 22 operations across the endpoint tree', () => {
		const paths = collectPaths(plugin.endpoints);
		expect(paths).toHaveLength(22);
		expect(paths).toEqual(
			expect.arrayContaining([
				'profile.getMyInfo',
				'profile.getPerson',
				'posts.create',
				'posts.createArticleShare',
				'posts.getContent',
				'posts.delete',
				'posts.deleteShare',
				'posts.deleteUgc',
				'comments.create',
				'reactions.list',
				'images.get',
				'images.list',
				'images.initializeUpload',
				'images.registerUpload',
				'videos.list',
				'organizations.getCompanyInfo',
				'organizations.getNetworkSize',
				'organizations.getPageStats',
				'organizations.getShareStats',
				'ads.getTargetingFacets',
				'ads.getAudienceCounts',
				'ads.searchTargetingEntities',
			]),
		);
	});

	it('declares endpoint metadata for every operation', () => {
		const meta = plugin.endpointMeta ?? {};
		const entries = Object.entries(meta);
		expect(entries).toHaveLength(22);
		for (const [, entry] of entries) {
			expect(['read', 'write', 'destructive']).toContain(entry.riskLevel);
		}
	});

	it('marks irreversible destructive operations', () => {
		const meta = plugin.endpointMeta ?? {};
		for (const path of [
			'posts.delete',
			'posts.deleteShare',
			'posts.deleteUgc',
		] as const) {
			expect(meta[path]?.irreversible).toBe(true);
			expect(meta[path]?.riskLevel).toBe('destructive');
		}
	});
});
