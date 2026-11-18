import type { CorsairPlugin } from '../core/plugins';
import type { CorsairDatabase } from '../db/kysely/database';
import type { HubConfig } from '../hub/types';

const authStatus = {
	authType: 'oauth_2',
	status: 'ready' as 'ready' | 'not_started',
	connected: true,
	missingRequiredFields: [] as string[],
};

jest.mock('../hub/client/http', () => ({
	hubApiPost: jest.fn().mockResolvedValue({ ok: true }),
}));
jest.mock('../core/auth/plugin-auth-status', () => ({
	getPluginAuthStatus: jest.fn(async () => ({ ...authStatus })),
}));

import { getPluginAuthStatus } from '../core/auth/plugin-auth-status';
import { hubApiPost } from '../hub/client/http';
import {
	REPORT_REFRESH_MS,
	reportConnectionStatusForHub,
	reportPluginConnectionStatusFromBinding,
	resetConnectionReportMemory,
} from '../hub/report-connection-status';

const post = hubApiPost as jest.Mock;
const readStatus = getPluginAuthStatus as jest.Mock;

const hub: HubConfig = {
	apiUrl: 'https://hub.test',
	projectApiKey: 'ck_cloud_test',
	signingSecret: '',
	instanceKey: 'env_1',
};
const database = {} as CorsairDatabase;
const github: CorsairPlugin = {
	id: 'github',
	options: { authType: 'oauth_2' },
};

// Fire-and-forget: let the async report path settle before asserting.
const settle = () => new Promise((resolve) => setImmediate(resolve));

function startCall(
	verified: boolean,
	extra: { tenantId?: string; hub?: HubConfig } = {},
) {
	reportPluginConnectionStatusFromBinding({
		hub: extra.hub ?? hub,
		database,
		kek: 'kek',
		plugins: [github],
		plugin: github,
		tenantId: extra.tenantId ?? 'tenant_1',
		verified,
	});
}

async function afterCall(
	verified: boolean,
	extra: { tenantId?: string; hub?: HubConfig } = {},
) {
	startCall(verified, extra);
	await settle();
}

describe('per-call connection reports', () => {
	beforeEach(() => {
		jest.useFakeTimers({ doNotFake: ['setImmediate', 'nextTick'] });
		jest.setSystemTime(new Date('2026-11-15T00:00:00Z'));
		post.mockReset().mockResolvedValue({ ok: true });
		readStatus.mockClear();
		authStatus.status = 'ready';
		authStatus.connected = true;
		resetConnectionReportMemory();
	});
	afterEach(() => jest.useRealTimers());

	it('sends the first report, then skips identical ones', async () => {
		await afterCall(true);
		await afterCall(true);
		await afterCall(true);
		expect(post).toHaveBeenCalledTimes(1);
		expect(post.mock.calls[0][0].body).toMatchObject({
			tenantId: 'tenant_1',
			plugin: 'github',
			status: 'ready',
			verified: true,
		});
	});

	it('sends one report when overlapping calls finish together', async () => {
		startCall(true);
		startCall(true);
		startCall(true);
		await settle();
		expect(readStatus).toHaveBeenCalledTimes(1);
		expect(post).toHaveBeenCalledTimes(1);
	});

	it('reports a disconnect that follows a refused refresh, though verified stays false', async () => {
		await afterCall(false);
		authStatus.status = 'not_started';
		authStatus.connected = false;
		await afterCall(false);
		expect(post.mock.calls.map((c) => c[0].body.connected)).toEqual([
			true,
			false,
		]);
	});

	it('reports a change at once: a call that needs auth, then one that works again', async () => {
		await afterCall(true);
		await afterCall(false);
		await afterCall(false);
		await afterCall(true);
		expect(post.mock.calls.map((c) => c[0].body.verified)).toEqual([
			true,
			false,
			true,
		]);
	});

	it('re-sends an unchanged status once the refresh interval passes', async () => {
		await afterCall(true);
		jest.setSystemTime(Date.now() + REPORT_REFRESH_MS - 1);
		await afterCall(true);
		expect(post).toHaveBeenCalledTimes(1);
		jest.setSystemTime(Date.now() + 2);
		await afterCall(true);
		expect(post).toHaveBeenCalledTimes(2);
	});

	it('keeps tenants, plugins, and instances apart', async () => {
		await afterCall(true, { tenantId: 'tenant_1' });
		await afterCall(true, { tenantId: 'tenant_2' });
		await afterCall(true, { hub: { ...hub, instanceKey: 'env_2' } });
		expect(post).toHaveBeenCalledTimes(3);
	});

	it('retries on the next call when Hub did not take the report', async () => {
		post.mockRejectedValueOnce(new Error('hub down'));
		await afterCall(true);
		await afterCall(true);
		expect(post).toHaveBeenCalledTimes(2);
	});

	it('counts an explicit report as the last one sent, and always sends explicit reports', async () => {
		const ready = {
			tenantId: 'tenant_1',
			plugin: 'github',
			authType: 'oauth_2' as const,
			status: 'ready' as const,
			connected: true,
			verified: true,
		};
		reportConnectionStatusForHub(hub, ready);
		reportConnectionStatusForHub(hub, ready);
		await settle();
		await afterCall(true);
		expect(post).toHaveBeenCalledTimes(2);
	});
});

describe('overlapping per-call reads', () => {
	beforeEach(() => {
		post.mockReset().mockResolvedValue({ ok: true });
		readStatus.mockClear();
		resetConnectionReportMemory();
	});

	it('share one status read, and a later call reads again', async () => {
		startCall(true);
		startCall(true);
		startCall(true);
		await settle();
		expect(readStatus).toHaveBeenCalledTimes(1);
		await afterCall(true);
		expect(readStatus).toHaveBeenCalledTimes(2);
	});

	it('different tenants do not share a read', async () => {
		startCall(true, { tenantId: 'a' });
		startCall(true, { tenantId: 'b' });
		await settle();
		expect(readStatus).toHaveBeenCalledTimes(2);
	});
});
