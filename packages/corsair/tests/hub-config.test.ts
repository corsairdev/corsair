import { createCorsair } from 'corsair';

import {
	HubCredentialsMissingError,
	normalizeHubConfig,
	resolveHubConfigInput,
} from '../hub/config';

describe('resolveHubConfigInput', () => {
	it('normalizes complete credentials', () => {
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

	it('throws when hub is enabled but credentials are missing', () => {
		expect(() =>
			resolveHubConfigInput({
				projectApiKey: undefined as unknown as string,
				signingSecret: undefined as unknown as string,
			}),
		).toThrow(HubCredentialsMissingError);
	});

	it('throws for blank credentials', () => {
		expect(() =>
			resolveHubConfigInput({
				projectApiKey: '  ',
				signingSecret: '',
			}),
		).toThrow(/Hub credentials are missing/);
	});
});

describe('createCorsair — hub validation', () => {
	it('initializes without hub when hub is omitted', () => {
		expect(() =>
			createCorsair({
				plugins: [],
				kek: 'test-kek',
			}),
		).not.toThrow();
	});

	it('throws at init when hub is enabled without credentials', () => {
		expect(() =>
			createCorsair({
				plugins: [],
				kek: 'test-kek',
				hub: {
					projectApiKey: undefined as unknown as string,
					signingSecret: undefined as unknown as string,
				},
			}),
		).toThrow(HubCredentialsMissingError);
	});

	it('initializes when hub credentials are provided', () => {
		expect(() =>
			createCorsair({
				plugins: [],
				kek: 'test-kek',
				hub: {
					projectApiKey: 'ck_dev_test',
					signingSecret: 'signing-secret',
				},
			}),
		).not.toThrow();
	});
});

describe('normalizeHubConfig', () => {
	it('throws HubCredentialsMissingError for incomplete credentials', () => {
		expect(() =>
			normalizeHubConfig({
				projectApiKey: undefined as unknown as string,
				signingSecret: 'secret',
			}),
		).toThrow(HubCredentialsMissingError);
	});
});
