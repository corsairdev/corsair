import { AuthMissingError } from 'corsair/core';
import { stormboard, stormboardEndpointSchemas } from './index';

// The key builder only reads authType and keys.
function keyContext(apiKey: string | null) {
	return {
		authType: 'api_key' as const,
		options: {},
		tenantId: 'default',
		keys: {
			get_api_key: jest.fn().mockResolvedValue(apiKey),
		},
	};
}

function buildKey(
	plugin: ReturnType<typeof stormboard>,
	ctx: ReturnType<typeof keyContext>,
	// unknown: the fake context is not a full KeyBuilderContext.
	source: 'endpoint' | 'webhook' = 'endpoint',
) {
	return plugin.keyBuilder?.(ctx as never, source);
}

const operations = [
	'chat.create',
	'chat.list',
	'chat.listUnread',
	'chat.markAllRead',
	'folders.list',
	'ideas.addVote',
	'ideas.create',
	'ideas.createComment',
	'ideas.createConnector',
	'ideas.delete',
	'ideas.deleteComment',
	'ideas.deleteConnector',
	'ideas.deleteConnectorBetween',
	'ideas.get',
	'ideas.listComments',
	'ideas.removeVote',
	'ideas.update',
	'ideas.updateComment',
	'ideas.updateConnector',
	'ideas.updateTask',
	'storms.acceptInvite',
	'storms.close',
	'storms.create',
	'storms.declineInvite',
	'storms.duplicate',
	'storms.favorite',
	'storms.get',
	'storms.getAccess',
	'storms.getTemplate',
	'storms.invite',
	'storms.join',
	'storms.leave',
	'storms.list',
	'storms.listConnectors',
	'storms.listIdeas',
	'storms.listInvites',
	'storms.listUsers',
	'storms.reopen',
	'storms.unfavorite',
	'storms.update',
	'storms.updateLegend',
	'storms.updateSection',
	'tags.createForIdea',
	'tags.createForStorm',
	'tags.getForIdea',
	'tags.listForStorm',
	'users.create',
	'users.getAuth',
	'users.getProfile',
	'users.test',
	'users.updateNotifications',
	'users.updateProfile',
	'users.verify',
];

const riskLevels: Record<string, string> = {
	...Object.fromEntries(operations.map((op) => [op, 'read'])),
	'users.create': 'destructive',
	'users.verify': 'write',
	'users.updateProfile': 'write',
	'users.updateNotifications': 'write',
	'storms.create': 'write',
	'storms.update': 'write',
	'storms.updateLegend': 'write',
	'storms.updateSection': 'write',
	'storms.close': 'write',
	'storms.reopen': 'write',
	'storms.invite': 'destructive',
	'storms.acceptInvite': 'write',
	'storms.declineInvite': 'write',
	'storms.join': 'write',
	'storms.leave': 'write',
	'storms.duplicate': 'write',
	'storms.favorite': 'write',
	'storms.unfavorite': 'write',
	'ideas.create': 'write',
	'ideas.update': 'write',
	'ideas.delete': 'destructive',
	'ideas.addVote': 'write',
	'ideas.removeVote': 'write',
	'ideas.createComment': 'write',
	'ideas.updateComment': 'write',
	'ideas.deleteComment': 'destructive',
	'ideas.createConnector': 'write',
	'ideas.updateConnector': 'write',
	'ideas.deleteConnector': 'destructive',
	'ideas.deleteConnectorBetween': 'destructive',
	'ideas.updateTask': 'write',
	'tags.createForStorm': 'write',
	'tags.createForIdea': 'write',
	'chat.create': 'write',
	'chat.markAllRead': 'write',
};

describe('stormboard plugin definition', () => {
	const plugin = stormboard();

	it('registers as stormboard with api_key auth', () => {
		expect(plugin.id).toBe('stormboard');
		expect(plugin.options?.authType).toBe('api_key');
	});

	it('exposes exactly the 53 documented operations across 6 groups', () => {
		const nested = Object.entries(plugin.endpoints ?? {}).flatMap(
			([group, fns]) => Object.keys(fns).map((name) => `${group}.${name}`),
		);
		expect(nested.sort()).toEqual(operations);
	});

	it('declares every operation in endpointSchemas', () => {
		expect(Object.keys(stormboardEndpointSchemas).sort()).toEqual(operations);
	});

	it('declares risk levels matching the real side effects', () => {
		const meta = plugin.endpointMeta ?? {};
		const declared = Object.fromEntries(
			operations.map((op) => [
				op,
				(meta as Record<string, { riskLevel: string }>)[op]?.riskLevel,
			]),
		);
		expect(declared).toEqual(riskLevels);
	});

	it('marks only the truly irreversible deletes destructive', () => {
		const meta = plugin.endpointMeta as Record<
			string,
			{ riskLevel: string; irreversible?: boolean } | undefined
		>;
		// Closing a Storm is reversible (reopen), so it is a write.
		expect(meta['storms.close']?.riskLevel).toBe('write');
		expect(meta['storms.close']?.irreversible).toBeUndefined();
		expect(meta['ideas.delete']?.irreversible).toBe(true);
		expect(meta['ideas.deleteConnector']?.irreversible).toBe(true);
		expect(meta['ideas.deleteConnectorBetween']?.irreversible).toBe(true);
	});

	it('registers no webhooks, because Stormboard documents none', () => {
		expect(plugin.webhooks).toEqual({});
		expect(plugin.pluginWebhookMatcher?.({ headers: {}, body: {} })).toBe(
			false,
		);
	});
});

describe('stormboard keyBuilder', () => {
	const plugin = stormboard();

	it('prefers the inline key', async () => {
		const inline = stormboard({ key: 'inline-key' });
		await expect(buildKey(inline, keyContext('stored-key'))).resolves.toBe(
			'inline-key',
		);
	});

	it('falls back to the stored key', async () => {
		await expect(buildKey(plugin, keyContext('stored-key'))).resolves.toBe(
			'stored-key',
		);
	});

	it('throws AuthMissingError when neither exists', async () => {
		await expect(buildKey(plugin, keyContext(null))).rejects.toThrow(
			AuthMissingError,
		);
	});
});
