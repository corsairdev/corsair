import { AuthMissingError } from 'corsair/core';
import { parseMixpanelKey, parseProjectId, parseRegion } from './client';
import { mixpanel, mixpanelAuthConfig, mixpanelEndpointSchemas } from './index';

// unknown: the endpoint tree is walked structurally.
function paths(tree: unknown, prefix = ''): string[] {
	return Object.entries(tree as Record<string, unknown>).flatMap(
		([key, value]) =>
			typeof value === 'function'
				? [`${prefix}${key}`]
				: paths(value, `${prefix}${key}.`),
	);
}

function keyContext(stored: Record<string, string | null>) {
	const get = (name: string) =>
		jest.fn().mockResolvedValue(stored[name] ?? null);
	return {
		authType: 'api_key' as const,
		options: {},
		tenantId: 'default',
		keys: {
			get_api_key: get('api_key'),
			get_service_account_username: get('service_account_username'),
			get_project_id: get('project_id'),
			get_region: get('region'),
			get_project_token: get('project_token'),
			get_gdpr_token: get('gdpr_token'),
		},
	};
}

const complete = {
	api_key: 'secret-123456',
	service_account_username: 'corsair.abc.mp-service-account',
	project_id: '4086621',
};

describe('mixpanel plugin definition', () => {
	const plugin = mixpanel();

	it('registers every operation once with schemas and metadata', () => {
		const nested = paths(plugin.endpoints).sort();
		expect(nested.length).toBe(119);
		expect(Object.keys(mixpanelEndpointSchemas).sort()).toEqual(nested);
		expect(Object.keys(plugin.endpointMeta ?? {}).sort()).toEqual(nested);
		for (const entry of Object.values(plugin.endpointMeta ?? {})) {
			expect(entry.description?.length).toBeGreaterThan(15);
		}
	});

	it('keeps the seven original operation names', () => {
		const nested = paths(plugin.endpoints);
		for (const name of [
			'events.import',
			'profiles.query',
			'cohorts.list',
			'insights.query',
			'funnels.list',
			'retention.query',
			'export.events',
		]) {
			expect(nested).toContain(name);
		}
	});

	it('marks deletes, merges, replacements and credential minting destructive', () => {
		const meta = plugin.endpointMeta ?? {};
		const destructive = Object.entries(meta)
			.filter(([, entry]) => entry.riskLevel === 'destructive')
			.map(([name]) => name);
		for (const name of Object.keys(meta)) {
			if (
				/\.(delete\w*|cancel)$/.test(name) &&
				name !== 'gdpr.cancelDeletion'
			) {
				expect(destructive).toContain(name);
			}
		}
		for (const name of [
			'identity.merge',
			'lookupTables.replace',
			'lexicon.upsertMany',
			'serviceAccounts.create',
			'gdpr.createDeletion',
			'profiles.unset',
			'profiles.batchUpdate',
			'experiments.launch',
			'pipelines.create',
		]) {
			expect(destructive).toContain(name);
		}
	});

	it('marks every list, get and query read', () => {
		for (const [name, entry] of Object.entries(plugin.endpointMeta ?? {})) {
			if (
				/\.(list\w*|get\w*|query|definitions|history|status|timeline)$/.test(
					name,
				)
			) {
				expect([name, entry.riskLevel]).toEqual([name, 'read']);
			}
		}
	});

	it('declares the account fields beside the api_key secret', () => {
		expect(mixpanelAuthConfig.api_key.account).toEqual([
			'service_account_username',
			'project_id',
			'region',
			'project_token',
			'gdpr_token',
		]);
	});
});

describe('keyBuilder', () => {
	const build = (stored: Record<string, string | null>, options = {}) =>
		mixpanel(options).keyBuilder?.(keyContext(stored) as never, 'endpoint');

	it('packs the stored account into the key', async () => {
		const key = await build({
			...complete,
			region: 'EU',
			project_token: 'tok-123456',
		});
		expect(parseMixpanelKey(key as string)).toEqual({
			username: complete.service_account_username,
			secret: complete.api_key,
			projectId: 4086621,
			region: 'eu',
			projectToken: 'tok-123456',
			gdprToken: undefined,
		});
	});

	it('defaults the region to us', async () => {
		const key = await build(complete);
		expect(parseMixpanelKey(key as string).region).toBe('us');
	});

	it.each(['api_key', 'service_account_username', 'project_id'])(
		'asks for a connection when %s is missing',
		async (field) => {
			await expect(
				build({ ...complete, [field]: null }),
			).rejects.toBeInstanceOf(AuthMissingError);
		},
	);

	it('rejects a non-endpoint source', async () => {
		await expect(
			mixpanel().keyBuilder?.(keyContext(complete) as never, 'webhook'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});

describe('stored value parsing', () => {
	it.each(['42.5', '42oops', '0', '-3', 'abc', '1e3'])(
		'rejects project id %s',
		(value) => {
			expect(() => parseProjectId(value)).toThrow(/positive integer/);
		},
	);

	it('accepts whole positive integers', () => {
		expect(parseProjectId('42')).toBe(42);
		expect(parseProjectId(' 4086621 ')).toBe(4086621);
		expect(parseProjectId(7)).toBe(7);
		expect(parseProjectId(null)).toBeUndefined();
	});

	it('accepts the three regions in any case and rejects others', () => {
		expect(parseRegion('IN')).toBe('in');
		expect(parseRegion('')).toBeUndefined();
		expect(() => parseRegion('asia')).toThrow(/us, eu or in/);
	});

	it('refuses an unpacked key', () => {
		expect(() => parseMixpanelKey('user:secret')).toThrow(/missing/);
	});
});
