import { parseCsvRecords, redactCredentialSecrets } from './utils';

describe('Databricks utils', () => {
	it('keeps embedded newlines inside quoted CSV fields', () => {
		const csv = 'name,note\nalpha,"first\nsecond"\nbeta,plain';
		expect(parseCsvRecords(csv)).toEqual([
			{ name: 'alpha', note: 'first\nsecond' },
			{ name: 'beta', note: 'plain' },
		]);
	});

	it('redacts Azure client_secret and GCP private_key', () => {
		const input = {
			name: 'cred',
			azure_service_principal: {
				directory_id: 'dir',
				application_id: 'app',
				client_secret: 'live-azure-secret',
			},
			gcp_service_account_key: {
				email: 'sa@project.iam.gserviceaccount.com',
				private_key: '-----BEGIN PRIVATE KEY-----\nlive\n',
			},
		};

		expect(redactCredentialSecrets(input)).toEqual({
			name: 'cred',
			azure_service_principal: {
				directory_id: 'dir',
				application_id: 'app',
				client_secret: '[redacted]',
			},
			gcp_service_account_key: {
				email: 'sa@project.iam.gserviceaccount.com',
				private_key: '[redacted]',
			},
		});
	});
});
