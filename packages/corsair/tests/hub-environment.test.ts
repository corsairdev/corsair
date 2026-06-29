import {
	normalizeHubConfig,
	resolveHubOAuthCallbackUrl,
} from '../hub/config';
import type { HubConfig } from '../hub/types';
import {
	isLoopbackUrl,
	resolveDeliveryTransport,
	usesBrowserDelivery,
	validateProductionDeliveryUrl,
} from '../hub/contracts/environment';
import { resolveHubDeliveryUrl } from '../hub/resolve-delivery-url';

function withEnv(
	values: Record<string, string | undefined>,
	run: () => void,
): void {
	const previous = new Map<string, string | undefined>();
	for (const [key, value] of Object.entries(values)) {
		previous.set(key, process.env[key]);
		if (value === undefined) {
			delete process.env[key];
		} else {
			process.env[key] = value;
		}
	}

	try {
		run();
	} finally {
		for (const [key, value] of previous) {
			if (value === undefined) {
				delete process.env[key];
			} else {
				process.env[key] = value;
			}
		}
	}
}

describe('hub environment delivery', () => {
	it('resolves transport from environment slug', () => {
		expect(resolveDeliveryTransport('development')).toBe('browser');
		expect(resolveDeliveryTransport('production')).toBe('server');
		expect(usesBrowserDelivery('development')).toBe(true);
		expect(usesBrowserDelivery('production')).toBe(false);
	});

	it('detects loopback URLs', () => {
		expect(isLoopbackUrl('http://localhost:3000/api/corsair')).toBe(true);
		expect(isLoopbackUrl('http://127.0.0.1:3001/api/corsair')).toBe(true);
		expect(isLoopbackUrl('https://app.example.com/api/corsair')).toBe(false);
	});

	it('rejects loopback production delivery URLs', () => {
		expect(
			validateProductionDeliveryUrl('http://localhost:3000/api/corsair'),
		).toMatch(/public URL/);
		expect(
			validateProductionDeliveryUrl('https://app.example.com/api/corsair'),
		).toBeNull();
	});

	it('auto-detects localhost delivery URL from PORT', () => {
		withEnv(
			{
				PORT: '3001',
				CORSAIR_DELIVERY_URL: undefined,
				APP_URL: undefined,
			},
			() => {
				expect(resolveHubDeliveryUrl()).toBe(
					'http://localhost:3001/api/corsair',
				);
			},
		);
	});

	it('uses CORSAIR_DELIVERY_URL as a full endpoint without appending the path', () => {
		withEnv(
			{
				CORSAIR_DELIVERY_URL: 'http://localhost:3001/api/corsair',
				APP_URL: 'http://localhost:9999',
			},
			() => {
				expect(resolveHubDeliveryUrl()).toBe(
					'http://localhost:3001/api/corsair',
				);
			},
		);
	});

	it('strips trailing slash from CORSAIR_DELIVERY_URL', () => {
		withEnv(
			{
				CORSAIR_DELIVERY_URL: 'http://localhost:3001/api/corsair/',
				APP_URL: undefined,
			},
			() => {
				expect(resolveHubDeliveryUrl()).toBe(
					'http://localhost:3001/api/corsair',
				);
			},
		);
	});

	it('appends delivery path for APP_URL base URLs', () => {
		withEnv(
			{
				CORSAIR_DELIVERY_URL: undefined,
				APP_URL: 'http://localhost:3000',
			},
			() => {
				expect(resolveHubDeliveryUrl()).toBe(
					'http://localhost:3000/api/corsair',
				);
			},
		);
	});

	it('handles APP_URL with a trailing slash', () => {
		withEnv(
			{
				CORSAIR_DELIVERY_URL: undefined,
				APP_URL: 'http://localhost:3000/',
			},
			() => {
				expect(resolveHubDeliveryUrl()).toBe(
					'http://localhost:3000/api/corsair',
				);
			},
		);
	});

	it('strips trailing slash from explicit oauthCallbackUrl', () => {
		const config = normalizeHubConfig({
			projectApiKey: 'ck_dev_test',
			signingSecret: 'signing-secret',
			oauthCallbackUrl: 'https://auth.corsair.dev/oauth/callback/',
		});

		expect(resolveHubOAuthCallbackUrl(config)).toBe(
			'https://auth.corsair.dev/oauth/callback',
		);
	});

	it('does not double-slash default oauth callback when apiUrl has trailing slash', () => {
		const config = normalizeHubConfig({
			projectApiKey: 'ck_dev_test',
			signingSecret: 'signing-secret',
			apiUrl: 'https://auth.corsair.dev/',
		});

		expect(resolveHubOAuthCallbackUrl(config)).toBe(
			'https://auth.corsair.dev/oauth/callback',
		);
	});

	it('normalizes callback URLs when resolveHubOAuthCallbackUrl is called directly', () => {
		const unnormalizedConfig: HubConfig = {
			apiUrl: 'https://auth.corsair.dev/',
			projectApiKey: 'ck_dev_test',
			signingSecret: 'signing-secret',
			oauthCallbackUrl: 'https://auth.corsair.dev/oauth/callback/',
		};

		expect(resolveHubOAuthCallbackUrl(unnormalizedConfig)).toBe(
			'https://auth.corsair.dev/oauth/callback',
		);
	});

	it('normalizes default callback path when apiUrl is unnormalized', () => {
		const unnormalizedConfig: HubConfig = {
			apiUrl: 'https://auth.corsair.dev/',
			projectApiKey: 'ck_dev_test',
			signingSecret: 'signing-secret',
		};

		expect(resolveHubOAuthCallbackUrl(unnormalizedConfig)).toBe(
			'https://auth.corsair.dev/oauth/callback',
		);
	});
});
