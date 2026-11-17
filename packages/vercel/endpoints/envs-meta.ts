import type { EndpointMeta } from './common';

export const vercelEnvsMeta = {
	getEnvVariables: {
		riskLevel: 'read',
		description:
			'List a project’s environment variables: key, type, targets, Git branch and id. Values of encrypted and sensitive variables come back encrypted (plain ones as is); use getEnvVariable to read one decrypted value.',
	},
	getEnvVariable: {
		riskLevel: 'read',
		description:
			'Get one environment variable by id, including its DECRYPTED value (the secret itself) for encrypted and plain variables. Sensitive variables never return a value.',
	},
	createEnvVariable: {
		riskLevel: 'write',
		description:
			'Add one or several environment variables to a project (key, value, type, target environments, optional Git branch). Variables that already exist are listed under failed unless upsert is true. Takes effect on the next deployment.',
	},
	updateEnvVariable: {
		riskLevel: 'write',
		description:
			'Change an environment variable by id: its value, key, type, targets, Git branch or comment. Takes effect on the next deployment.',
	},
	deleteEnvVariable: {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete an environment variable by id. Its value is gone for good; deployments built after this no longer get it.',
	},
} as const satisfies Record<string, EndpointMeta>;
