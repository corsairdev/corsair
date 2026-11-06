import {
	GmicloudBaremetal,
	GmicloudContainer,
	GmicloudElasticIp,
	GmicloudFirewall,
	GmicloudMediaRequest,
	GmicloudModel,
	GmicloudSandbox,
	GmicloudSandboxTemplate,
} from './database';

export const GmicloudSchema = {
	version: '1.0.0',
	entities: {
		models: GmicloudModel,
		mediaRequests: GmicloudMediaRequest,
		containers: GmicloudContainer,
		baremetals: GmicloudBaremetal,
		elasticIps: GmicloudElasticIp,
		firewalls: GmicloudFirewall,
		sandboxes: GmicloudSandbox,
		sandboxTemplates: GmicloudSandboxTemplate,
	},
} as const;

export type {
	GmicloudBaremetal,
	GmicloudContainer,
	GmicloudElasticIp,
	GmicloudFirewall,
	GmicloudMediaRequest,
	GmicloudModel,
	GmicloudSandbox,
	GmicloudSandboxTemplate,
} from './database';
