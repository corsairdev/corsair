import { createCorsair } from 'corsair';

import { getCorsairInternal } from '../core/utils/corsair-instance';
import {
	getHubConfig,
	HubCredentialsMissingError,
	normalizeHubConfig,
	resolveHubConfigInput,
} from '../hub/config';

describe('resolveHubConfigInput', () => {
	it('trims hub credential strings (not used as scrypt password material)', () => {
		expect(
			resolveHubConfigInput({
				projectApiKey: ' ck_dev_test ',
				signingSecret: ' signing-secret ',
			}),
		).toEqual(
			normalizeHubConfig({
				projectApiKey: 'ck_dev_test',
				signingSecret: 'signing-secret',
			}),
		);
	});

	it('throws HubCredentialsMissingError when hub is enabled but credentials are undefined', () => {
		// Simulates env vars typed as string but undefined at runtime.
		const missing = undefined as unknown as string;
		expect(() =>
			resolveHubConfigInput({
				projectApiKey: missing,
				signingSecret: missing,
			}),
		).toThrow(HubCredentialsMissingError);
	});

	it('throws HubCredentialsMissingError for blank credentials after trim', () => {
		expect(() =>
			resolveHubConfigInput({
				projectApiKey: '  ',
				signingSecret: '',
			}),
		).toThrow(HubCredentialsMissingError);
	});
});

describe('createCorsair — hub validation', () => {
	it('leaves hub unset when the hub block is omitted', () => {
		const corsair = createCorsair({
			plugins: [],
			kek: 'test-kek',
		});

		expect(getCorsairInternal(corsair).hub).toBeUndefined();
		expect(() => getHubConfig(corsair)).toThrow(/Hub is not configured/);
	});

	it('throws HubCredentialsMissingError at init when hub is enabled without credentials', () => {
		const missing = undefined as unknown as string;
		expect(() =>
			createCorsair({
				plugins: [],
				kek: 'test-kek',
				hub: {
					projectApiKey: missing,
					signingSecret: missing,
				},
			}),
		).toThrow(HubCredentialsMissingError);
	});

	it('registers normalized hub credentials when hub is enabled', () => {
		const corsair = createCorsair({
			plugins: [],
			kek: 'test-kek',
			hub: {
				projectApiKey: 'ck_dev_test',
				signingSecret: 'signing-secret',
			},
		});

		expect(getHubConfig(corsair)).toEqual(
			expect.objectContaining({
				projectApiKey: 'ck_dev_test',
				signingSecret: 'signing-secret',
			}),
		);
	});

	it('accepts a ck_cloud_ key without a signingSecret (hosted runtime)', () => {
		const corsair = createCorsair({
			plugins: [],
			kek: 'test-kek',
			hub: {
				projectApiKey: 'ck_cloud_test',
			},
		});

		// The runtime does Hub ops (connect, connection reporting, announce) with a
		// ck_cloud_ key and no signingSecret — getHubConfig must not reject it, or
		// those ops throw HubNotConfiguredError at runtime.
		expect(() => getHubConfig(corsair)).not.toThrow();
		expect(getHubConfig(corsair)).toEqual(
			expect.objectContaining({ projectApiKey: 'ck_cloud_test' }),
		);
	});
});

describe('normalizeHubConfig', () => {
	it('throws HubCredentialsMissingError when only one credential is present', () => {
		const missing = undefined as unknown as string;
		expect(() =>
			normalizeHubConfig({
				projectApiKey: missing,
				signingSecret: 'secret',
			}),
		).toThrow(HubCredentialsMissingError);
	});
});
