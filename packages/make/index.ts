import type {
	BindEndpoints,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import * as scenarios from './endpoints/scenarios';
import * as schemas from './endpoints/types';
import { mergeErrorHandlers } from './error-handlers';
import { MakeSchema } from './schema';

export type MakePluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	zone?: 'eu1' | 'eu2' | 'us1' | 'us2' | 'celonis-eu1' | 'celonis-us1';
	hooks?: InternalMakePlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof makeEndpointsNested>;
};
export type MakeContext = CorsairPluginContext<
	typeof MakeSchema,
	MakePluginOptions
>;
export type MakeKeyBuilderContext = KeyBuilderContext<MakePluginOptions>;
export type MakeBoundEndpoints = BindEndpoints<typeof makeEndpointsNested>;
const makeEndpointsNested = {
	scenarios: {
		list: scenarios.list,
		create: scenarios.create,
		countTrash: scenarios.countTrash,
		moveToTrash: scenarios.moveToTrash,
		get: scenarios.get,
		delete: scenarios.deleteScenario,
		update: scenarios.update,
		getTriggers: scenarios.getTriggers,
		clone: scenarios.clone,
		restore: scenarios.restore,
		getModuleData: scenarios.getModuleData,
		activate: scenarios.activate,
		deactivate: scenarios.deactivate,
		run: scenarios.run,
		replay: scenarios.replay,
		getInterface: scenarios.getInterface,
		updateInterface: scenarios.updateInterface,
		getUsage: scenarios.getUsage,
		listBuildVariables: scenarios.listBuildVariables,
		addBuildVariables: scenarios.addBuildVariables,
		updateBuildVariables: scenarios.updateBuildVariables,
		deleteBuildVariable: scenarios.deleteBuildVariable,
		listAiAgents: scenarios.listAiAgents,
		getAiAgentModules: scenarios.getAiAgentModules,
	},
} as const;
export const makeEndpointSchemas = {
	'scenarios.list': { input: schemas.listInput, output: schemas.listOutput },
	'scenarios.create': {
		input: schemas.createInput,
		output: schemas.createOutput,
	},
	'scenarios.countTrash': {
		input: schemas.countTrashInput,
		output: schemas.countTrashOutput,
	},
	'scenarios.moveToTrash': {
		input: schemas.moveToTrashInput,
		output: schemas.moveToTrashOutput,
	},
	'scenarios.get': { input: schemas.getInput, output: schemas.getOutput },
	'scenarios.delete': {
		input: schemas.deleteInput,
		output: schemas.deleteOutput,
	},
	'scenarios.update': {
		input: schemas.updateInput,
		output: schemas.updateOutput,
	},
	'scenarios.getTriggers': {
		input: schemas.getTriggersInput,
		output: schemas.getTriggersOutput,
	},
	'scenarios.clone': { input: schemas.cloneInput, output: schemas.cloneOutput },
	'scenarios.restore': {
		input: schemas.restoreInput,
		output: schemas.restoreOutput,
	},
	'scenarios.getModuleData': {
		input: schemas.getModuleDataInput,
		output: schemas.getModuleDataOutput,
	},
	'scenarios.activate': {
		input: schemas.activateInput,
		output: schemas.activateOutput,
	},
	'scenarios.deactivate': {
		input: schemas.deactivateInput,
		output: schemas.deactivateOutput,
	},
	'scenarios.run': { input: schemas.runInput, output: schemas.runOutput },
	'scenarios.replay': {
		input: schemas.replayInput,
		output: schemas.replayOutput,
	},
	'scenarios.getInterface': {
		input: schemas.getInterfaceInput,
		output: schemas.getInterfaceOutput,
	},
	'scenarios.updateInterface': {
		input: schemas.updateInterfaceInput,
		output: schemas.updateInterfaceOutput,
	},
	'scenarios.getUsage': {
		input: schemas.getUsageInput,
		output: schemas.getUsageOutput,
	},
	'scenarios.listBuildVariables': {
		input: schemas.listBuildVariablesInput,
		output: schemas.listBuildVariablesOutput,
	},
	'scenarios.addBuildVariables': {
		input: schemas.addBuildVariablesInput,
		output: schemas.addBuildVariablesOutput,
	},
	'scenarios.updateBuildVariables': {
		input: schemas.updateBuildVariablesInput,
		output: schemas.updateBuildVariablesOutput,
	},
	'scenarios.deleteBuildVariable': {
		input: schemas.deleteBuildVariableInput,
		output: schemas.deleteBuildVariableOutput,
	},
	'scenarios.listAiAgents': {
		input: schemas.listAiAgentsInput,
		output: schemas.listAiAgentsOutput,
	},
	'scenarios.getAiAgentModules': {
		input: schemas.getAiAgentModulesInput,
		output: schemas.getAiAgentModulesOutput,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof makeEndpointsNested>;
const makeEndpointMeta = {
	'scenarios.list': { riskLevel: 'read', description: 'List scenarios' },
	'scenarios.create': { riskLevel: 'write', description: 'Create scenario' },
	'scenarios.countTrash': {
		riskLevel: 'read',
		description: 'Count scenarios in trash',
	},
	'scenarios.moveToTrash': {
		riskLevel: 'destructive',
		description: 'Move scenarios to trash',
	},
	'scenarios.get': { riskLevel: 'read', description: 'Get scenario details' },
	'scenarios.delete': {
		riskLevel: 'destructive',
		description: 'Delete scenario',
	},
	'scenarios.update': { riskLevel: 'write', description: 'Update scenario' },
	'scenarios.getTriggers': {
		riskLevel: 'read',
		description: 'Get trigger details',
	},
	'scenarios.clone': { riskLevel: 'write', description: 'Clone scenario' },
	'scenarios.restore': {
		riskLevel: 'write',
		description: 'Restore scenario from trash',
	},
	'scenarios.getModuleData': {
		riskLevel: 'read',
		description: 'Check module data',
	},
	'scenarios.activate': {
		riskLevel: 'destructive',
		description: 'Activate scenario',
	},
	'scenarios.deactivate': {
		riskLevel: 'write',
		description: 'Deactivate scenario',
	},
	'scenarios.run': { riskLevel: 'destructive', description: 'Run a scenario' },
	'scenarios.replay': {
		riskLevel: 'destructive',
		description: 'Replay scenario executions',
	},
	'scenarios.getInterface': {
		riskLevel: 'read',
		description: 'Get scenario interface',
	},
	'scenarios.updateInterface': {
		riskLevel: 'write',
		description: 'Update scenario interface',
	},
	'scenarios.getUsage': {
		riskLevel: 'read',
		description: 'Get scenario usage',
	},
	'scenarios.listBuildVariables': {
		riskLevel: 'read',
		description: 'List buildtime variables',
	},
	'scenarios.addBuildVariables': {
		riskLevel: 'write',
		description: 'Add new buildtime variables to scenario metadata',
	},
	'scenarios.updateBuildVariables': {
		riskLevel: 'write',
		description: 'Update buildtime variables in scenario metadata',
	},
	'scenarios.deleteBuildVariable': {
		riskLevel: 'write',
		description: 'Delete buildtime variable',
	},
	'scenarios.listAiAgents': {
		riskLevel: 'read',
		description: 'List AI agent scenarios',
	},
	'scenarios.getAiAgentModules': {
		riskLevel: 'read',
		description: 'Get AI agent module details for scenarios',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof makeEndpointsNested>;
const defaultAuthType = 'api_key' as const;
export type BaseMakePlugin<T extends MakePluginOptions> = CorsairPlugin<
	'make',
	typeof MakeSchema,
	typeof makeEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;
export type InternalMakePlugin = BaseMakePlugin<MakePluginOptions>;
export type ExternalMakePlugin<T extends MakePluginOptions> = BaseMakePlugin<T>;
export function make<const T extends MakePluginOptions>(
	incomingOptions: MakePluginOptions & T = {} as MakePluginOptions & T,
): ExternalMakePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'make',
		schema: MakeSchema,
		options,
		hooks: options.hooks,
		endpoints: makeEndpointsNested,
		webhooks: {},
		endpointMeta: makeEndpointMeta,
		endpointSchemas: makeEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(options.errorHandlers),
		keyBuilder: async (ctx: MakeKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) return options.key;
			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();
				if (key) return key;
			}
			throw new AuthMissingError('make', ctx.authType ?? 'api_key');
		},
	} satisfies InternalMakePlugin;
}
export * from './endpoints/types';
