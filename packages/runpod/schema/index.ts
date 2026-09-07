import {
	RunpodCluster,
	RunpodEndpoint,
	RunpodPod,
	RunpodRegistryAuth,
	RunpodSecret,
	RunpodTemplate,
	RunpodUser,
} from './database';

export const RunpodSchema = {
	version: '1.0.0',
	entities: {
		users: RunpodUser,
		pods: RunpodPod,
		clusters: RunpodCluster,
		templates: RunpodTemplate,
		endpoints: RunpodEndpoint,
		registryAuths: RunpodRegistryAuth,
		secrets: RunpodSecret,
	},
} as const;
