import type {
	BindEndpoints,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import { ParmaOperations as ops } from './endpoints';
import {
	ParmaEndpointInputSchemas as inputs,
	ParmaEndpointOutputSchemas as outputs,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { ParmaSchema } from './schema';

export type ParmaPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	hooks?: InternalParmaPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof parmaEndpointsNested>;
};
export type ParmaContext = CorsairPluginContext<
	typeof ParmaSchema,
	ParmaPluginOptions
>;
export type ParmaKeyBuilderContext = KeyBuilderContext<ParmaPluginOptions>;
export type ParmaBoundEndpoints = BindEndpoints<typeof parmaEndpointsNested>;

const parmaEndpointsNested = {
	deals: { list: ops.listDeals, get: ops.getDeal },
	groups: { list: ops.listGroups },
	notes: {
		list: ops.listNotes,
		create: ops.createNote,
		update: ops.updateNote,
	},
	pipelines: { list: ops.listPipelines, get: ops.getPipeline },
	relationships: {
		list: ops.listRelationships,
		create: ops.createRelationship,
		get: ops.getRelationship,
		update: ops.updateRelationship,
		delete: ops.deleteRelationship,
		listGroups: ops.listRelationshipGroups,
		addGroup: ops.addRelationshipGroup,
		removeGroup: ops.removeRelationshipGroup,
		listNotes: ops.listRelationshipNotes,
	},
	stages: { list: ops.listStages, get: ops.getStage },
	users: { list: ops.listUsers, get: ops.getUser, me: ops.getCurrentUser },
} as const;
const webhooks = {} as const;
const schema = <K extends keyof typeof inputs>(key: K) => ({
	input: inputs[key],
	output: outputs[key],
});
export const parmaEndpointSchemas = {
	'deals.list': schema('listDeals'),
	'deals.get': schema('getDeal'),
	'groups.list': schema('listGroups'),
	'notes.list': schema('listNotes'),
	'notes.create': schema('createNote'),
	'notes.update': schema('updateNote'),
	'pipelines.list': schema('listPipelines'),
	'pipelines.get': schema('getPipeline'),
	'relationships.list': schema('listRelationships'),
	'relationships.create': schema('createRelationship'),
	'relationships.get': schema('getRelationship'),
	'relationships.update': schema('updateRelationship'),
	'relationships.delete': schema('deleteRelationship'),
	'relationships.listGroups': schema('listRelationshipGroups'),
	'relationships.addGroup': schema('addRelationshipGroup'),
	'relationships.removeGroup': schema('removeRelationshipGroup'),
	'relationships.listNotes': schema('listRelationshipNotes'),
	'stages.list': schema('listStages'),
	'stages.get': schema('getStage'),
	'users.list': schema('listUsers'),
	'users.get': schema('getUser'),
	'users.me': schema('getCurrentUser'),
} as const satisfies RequiredPluginEndpointSchemas<typeof parmaEndpointsNested>;
const parmaEndpointMeta = {
	'deals.list': { riskLevel: 'read', description: 'List deals' },
	'deals.get': { riskLevel: 'read', description: 'Get a deal' },
	'groups.list': { riskLevel: 'read', description: 'List groups' },
	'notes.list': { riskLevel: 'read', description: 'List notes' },
	'notes.create': { riskLevel: 'write', description: 'Create a note' },
	'notes.update': { riskLevel: 'write', description: 'Update a note' },
	'pipelines.list': { riskLevel: 'read', description: 'List pipelines' },
	'pipelines.get': { riskLevel: 'read', description: 'Get a pipeline' },
	'relationships.list': {
		riskLevel: 'read',
		description: 'List relationships',
	},
	'relationships.create': {
		riskLevel: 'write',
		description: 'Create a relationship',
	},
	'relationships.get': { riskLevel: 'read', description: 'Get a relationship' },
	'relationships.update': {
		riskLevel: 'write',
		description: 'Update a relationship',
	},
	'relationships.delete': {
		riskLevel: 'destructive',
		description: 'Delete a relationship',
	},
	'relationships.listGroups': {
		riskLevel: 'read',
		description: 'List relationship groups',
	},
	'relationships.addGroup': {
		riskLevel: 'write',
		description: 'Add a relationship to a group',
	},
	'relationships.removeGroup': {
		riskLevel: 'destructive',
		description: 'Remove a relationship from a group',
	},
	'relationships.listNotes': {
		riskLevel: 'read',
		description: 'List relationship notes',
	},
	'stages.list': { riskLevel: 'read', description: 'List stages' },
	'stages.get': { riskLevel: 'read', description: 'Get a stage' },
	'users.list': { riskLevel: 'read', description: 'List users' },
	'users.get': { riskLevel: 'read', description: 'Get a user' },
	'users.me': {
		riskLevel: 'read',
		description: 'Get the current user and account',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof parmaEndpointsNested>;
export const parmaAuthConfig = {
	api_key: { account: ['tenant_external_id'] },
	oauth_2: { account: ['tenant_external_id'] },
} as const satisfies PluginAuthConfig;
const defaultAuthType = 'api_key' as const;
export type BaseParmaPlugin<T extends ParmaPluginOptions> = CorsairPlugin<
	'parma',
	typeof ParmaSchema,
	typeof parmaEndpointsNested,
	typeof webhooks,
	T,
	typeof defaultAuthType
>;
export type InternalParmaPlugin = BaseParmaPlugin<ParmaPluginOptions>;
export type ExternalParmaPlugin<T extends ParmaPluginOptions> =
	BaseParmaPlugin<T>;

export function parma<const T extends ParmaPluginOptions>(
	incomingOptions: ParmaPluginOptions & T = {} as ParmaPluginOptions & T,
): ExternalParmaPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'parma',
		authConfig: parmaAuthConfig,
		schema: ParmaSchema,
		options,
		hooks: options.hooks,
		endpoints: parmaEndpointsNested,
		webhooks,
		endpointMeta: parmaEndpointMeta,
		endpointSchemas: parmaEndpointSchemas,
		webhookSchemas: {},
		errorHandlers: { ...errorHandlers, ...options.errorHandlers },
		keyBuilder: async (ctx: ParmaKeyBuilderContext, source) => {
			if (source === 'endpoint') {
				if (options.key?.trim()) return options.key;
				if (ctx.authType === 'oauth_2') {
					const key = await ctx.keys.get_access_token();
					if (key?.trim()) return key;
				}
				if (ctx.authType === 'api_key') {
					const key = await ctx.keys.get_api_key();
					if (key?.trim()) return key;
				}
			}
			throw new AuthMissingError('parma', ctx.authType);
		},
	} satisfies InternalParmaPlugin;
}
export type {
	ParmaEndpointInputs,
	ParmaEndpointOutputs,
} from './endpoints/types';
