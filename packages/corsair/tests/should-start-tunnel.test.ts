import { shouldStartTunnel } from '../core';
import type { HubConfig } from '../hub';
import { normalizeHubConfig } from '../hub/config';

const devHub = (overrides?: Partial<HubConfig>): HubConfig => ({
	apiUrl: 'https://hub.test',
	projectApiKey: 'ck_dev_abc',
	signingSecret: 's',
	...overrides,
});

describe('shouldStartTunnel', () => {
	const origEnv = process.env.CORSAIR_TUNNEL;

	afterEach(() => {
		process.env.CORSAIR_TUNNEL = origEnv;
	});

	it('returns false for a non-dev key', () => {
		process.env.CORSAIR_TUNNEL = undefined;
		expect(
			shouldStartTunnel({ ...devHub(), projectApiKey: 'ck_prod_xyz' }),
		).toBe(false);
	});

	it('returns true for a dev key by default — no config needed', () => {
		process.env.CORSAIR_TUNNEL = undefined;
		expect(shouldStartTunnel(devHub())).toBe(true);
	});

	it('opts out with tunnel: false', () => {
		process.env.CORSAIR_TUNNEL = undefined;
		expect(shouldStartTunnel(devHub({ tunnel: false }))).toBe(false);
	});

	it('opts out with CORSAIR_TUNNEL=0', () => {
		process.env.CORSAIR_TUNNEL = '0';
		expect(shouldStartTunnel(devHub())).toBe(false);
	});

	it('returns false when hub is undefined', () => {
		expect(shouldStartTunnel(undefined)).toBe(false);
	});

	it('is on by default when routed through normalizeHubConfig', () => {
		process.env.CORSAIR_TUNNEL = undefined;
		expect(
			shouldStartTunnel(
				normalizeHubConfig({
					apiUrl: 'https://hub.test',
					projectApiKey: 'ck_dev_x',
					signingSecret: 's',
				}),
			),
		).toBe(true);
	});

	it('honors a tunnel: false opt-out through normalizeHubConfig', () => {
		process.env.CORSAIR_TUNNEL = undefined;
		expect(
			shouldStartTunnel(
				normalizeHubConfig({
					apiUrl: 'https://hub.test',
					projectApiKey: 'ck_dev_x',
					signingSecret: 's',
					tunnel: false,
				}),
			),
		).toBe(false);
	});
});
