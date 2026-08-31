import { anthropicadministrator } from './index';
import { anthropicAdministratorEndpointSchemas } from './meta';
import { AnthropicAdministratorSchema } from './schema';

function endpointPaths(tree: Record<string, unknown>, prefix = ''): string[] {
	return Object.entries(tree).flatMap(([key, value]) => {
		const path = prefix ? `${prefix}.${key}` : key;
		if (typeof value === 'function') return [path];
		if (value && typeof value === 'object') {
			// Test-only: walk the nested endpoint groups as a plain tree.
			return endpointPaths(value as Record<string, unknown>, path);
		}
		return [];
	});
}

const EXPECTED_OPERATIONS = [
	'apiKeys.getApiKey',
	'apiKeys.listApiKeys',
	'apiKeys.updateApiKey',
	'invites.createInvite',
	'invites.deleteInvite',
	'invites.getInvite',
	'invites.listInvites',
	'messages.createMessage',
	'models.getModel',
	'models.listModels',
	'organization.getOrganization',
	'users.getUser',
	'users.listUsers',
	'users.removeUser',
	'users.updateUser',
	'workspaceMembers.createWorkspaceMember',
	'workspaceMembers.deleteWorkspaceMember',
	'workspaceMembers.getWorkspaceMember',
	'workspaceMembers.listWorkspaceMembers',
	'workspaceMembers.updateWorkspaceMember',
	'workspaces.archiveWorkspace',
	'workspaces.createWorkspace',
	'workspaces.getWorkspace',
	'workspaces.listWorkspaces',
	'workspaces.updateWorkspace',
];

/** `keyBuilder` is optional on the shared plugin type; assert it is wired. */
function keyBuilderOf(plugin: { keyBuilder?: unknown }) {
	const keyBuilder = plugin.keyBuilder;
	if (typeof keyBuilder !== 'function') {
		throw new Error('keyBuilder is not registered');
	}
	return keyBuilder as (ctx: unknown, source: string) => Promise<string>;
}

describe('anthropicadministrator plugin shape', () => {
	const plugin = anthropicadministrator();

	it('exposes exactly the 25 Admin API operations', () => {
		expect(
			endpointPaths(plugin.endpoints as Record<string, unknown>).sort(),
		).toEqual(EXPECTED_OPERATIONS);
	});

	it('keeps endpoints, schemas and metadata in lockstep', () => {
		const paths = endpointPaths(
			plugin.endpoints as Record<string, unknown>,
		).sort();
		expect(Object.keys(anthropicAdministratorEndpointSchemas).sort()).toEqual(
			paths,
		);
		expect(Object.keys(plugin.endpointMeta ?? {}).sort()).toEqual(paths);
	});

	it('registers no webhooks', () => {
		// The Anthropic Admin API publishes no webhooks; the generator's example
		// webhook (which accepted any signature) was removed.
		expect(plugin.webhooks).toEqual({});
		expect(plugin.pluginWebhookMatcher).toBeUndefined();
	});

	it('gives every operation a risk level and description', () => {
		const meta = plugin.endpointMeta as unknown as Record<
			string,
			{ riskLevel: string; description?: string; irreversible?: boolean }
		>;
		for (const entry of Object.values(meta)) {
			expect(['read', 'write', 'destructive']).toContain(entry.riskLevel);
			expect((entry.description ?? '').length).toBeGreaterThan(0);
		}
	});

	it('marks every irreversible operation destructive', () => {
		const meta = plugin.endpointMeta as unknown as Record<
			string,
			{ riskLevel: string; irreversible?: boolean }
		>;
		const irreversible = Object.entries(meta)
			.filter(([, e]) => e.irreversible)
			.map(([name]) => name)
			.sort();

		expect(irreversible).toEqual([
			'invites.deleteInvite',
			'users.removeUser',
			'workspaceMembers.deleteWorkspaceMember',
			'workspaces.archiveWorkspace',
		]);
		for (const name of irreversible) {
			expect(meta[name]?.riskLevel).toBe('destructive');
		}
	});

	it('registers the five cached entities', () => {
		expect(Object.keys(AnthropicAdministratorSchema.entities).sort()).toEqual([
			'apiKeys',
			'invites',
			'users',
			'workspaceMembers',
			'workspaces',
		]);
	});

	it('supports api key and oauth auth', () => {
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.authConfig).toEqual({ api_key: {}, oauth_2: {} });
	});
});

describe('anthropicadministrator key resolution', () => {
	it('prefers a statically configured key', async () => {
		const plugin = anthropicadministrator({ key: 'sk-ant-admin-static' });
		const ctx = {
			authType: 'api_key',
			keys: {
				get_api_key: async () => {
					throw new Error('key store should not be consulted');
				},
			},
		};

		await expect(keyBuilderOf(plugin)(ctx, 'endpoint')).resolves.toBe(
			'sk-ant-admin-static',
		);
	});

	it('fails closed rather than sending an empty x-api-key', async () => {
		const plugin = anthropicadministrator();
		const ctx = {
			authType: 'api_key',
			keys: { get_api_key: async () => undefined },
		};

		await expect(keyBuilderOf(plugin)(ctx, 'endpoint')).rejects.toThrow();
	});

	it('fails closed when an oauth token is missing', async () => {
		const plugin = anthropicadministrator({ authType: 'oauth_2' });
		const ctx = {
			authType: 'oauth_2',
			keys: { get_access_token: async () => undefined },
		};

		await expect(keyBuilderOf(plugin)(ctx, 'endpoint')).rejects.toThrow();
	});
});
