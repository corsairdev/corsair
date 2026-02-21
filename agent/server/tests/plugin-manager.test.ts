import { afterEach, describe, expect, it, vi } from 'vitest';
import type { PluginStatus } from './plugin-manager';
import {
	getAllPluginsStatus,
	getConfiguredPluginsFromDb,
} from './plugin-manager';

// ─────────────────────────────────────────────────────────────────────────────
// getConfiguredPluginsFromDb (uses db only)
// ─────────────────────────────────────────────────────────────────────────────

const mockFrom = vi.fn();
const mockSelect = vi.fn().mockReturnValue({ from: mockFrom });

vi.mock('./db', () => ({
	db: {
		select: (...args: unknown[]) => mockSelect(...args),
	},
	corsairIntegrations: {},
	corsairAccounts: {},
}));

describe('getConfiguredPluginsFromDb', () => {
	afterEach(() => {
		mockFrom.mockClear();
	});

	it('returns plugin list with hasAccount from account rows', async () => {
		// First Promise.all element: integrations; second: accounts
		mockFrom
			.mockResolvedValueOnce([
				{ id: 'int-1', name: 'slack' },
				{ id: 'int-2', name: 'linear' },
			])
			.mockResolvedValueOnce([{ integrationId: 'int-1' }]); // only slack has an account

		const result = await getConfiguredPluginsFromDb();

		expect(result).toEqual([
			{ name: 'slack', hasAccount: true },
			{ name: 'linear', hasAccount: false },
		]);
		expect(mockFrom).toHaveBeenCalledTimes(2);
	});

	it('returns empty array when no integrations', async () => {
		mockFrom.mockResolvedValueOnce([]).mockResolvedValueOnce([]);

		const result = await getConfiguredPluginsFromDb();

		expect(result).toEqual([]);
	});
});

// ─────────────────────────────────────────────────────────────────────────────
// getAllPluginsStatus (uses corsair for plugin names and key-manager)
// ─────────────────────────────────────────────────────────────────────────────

vi.mock('./corsair', () => ({
	corsair: {
		keys: {},
		slack: {
			keys: {
				get_api_key: () => Promise.resolve('xoxb-fake'),
				get_webhook_signature: () => Promise.resolve(null),
			},
		},
	},
}));

describe('getAllPluginsStatus', () => {
	it('returns status per configured plugin with fields and isReady', async () => {
		const statuses = await getAllPluginsStatus();

		expect(Array.isArray(statuses)).toBe(true);
		expect(statuses.length).toBeGreaterThanOrEqual(1);
		const slackStatus = statuses.find((s) => s.name === 'slack');
		expect(slackStatus).toBeDefined();
		expect(slackStatus?.authType).toBe('api_key');
		expect(slackStatus?.isReady).toBe(true);
		expect(slackStatus?.fields).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					field: 'api_key',
					required: true,
					isSet: true,
				}),
				expect.objectContaining({
					field: 'webhook_signature',
					required: false,
					isSet: false,
				}),
			]),
		);
	});

	it('each status has name, authType, fields, and isReady', async () => {
		const statuses = await getAllPluginsStatus();

		for (const s of statuses) {
			expect(s).toMatchObject({
				name: expect.any(String),
				authType: expect.any(String),
				isReady: expect.any(Boolean),
			});
			expect(Array.isArray((s as PluginStatus).fields)).toBe(true);
		}
	});
});
