import type { EndpointMeta } from './common';

export const vercelEdgeConfigMeta = {
	getEdgeConfigs: {
		riskLevel: 'read',
		description:
			'List the team’s Edge Configs (called Global Config in Vercel’s API): id, slug, item count and size.',
	},
	getEdgeConfig: {
		riskLevel: 'read',
		description:
			'Get one Edge Config (Global Config) by id: slug, item count, size and digest.',
	},
	getEdgeConfigItems: {
		riskLevel: 'read',
		description:
			'List every item (key, JSON value, description) stored in an Edge Config (Global Config).',
	},
	getEdgeConfigItem: {
		riskLevel: 'read',
		description:
			'Read one Edge Config (Global Config) item by key. Returns found: false when the key does not exist.',
	},
	updateEdgeConfigItems: {
		riskLevel: 'write',
		description:
			'Change several Edge Config (Global Config) items in one request: create, update, upsert or delete items by key. A delete removes the item and its value for good.',
	},
} as const satisfies Record<string, EndpointMeta>;
