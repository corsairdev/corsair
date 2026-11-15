import type {
	BindEndpoints,
	CorsairEndpoint,
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
import {
	CommandsEndpoints,
	ComputersEndpoints,
	PanelsEndpoints,
} from './endpoints';
import type {
	TriggerCmdEndpointInputs,
	TriggerCmdEndpointOutputs,
} from './endpoints/types';
import {
	TriggerCmdEndpointInputSchemas,
	TriggerCmdEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { TriggerCmdSchema } from './schema';

export type TriggerCmdPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalTriggerCmdPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof triggercmdEndpointsNested>;
};

export type TriggerCmdContext = CorsairPluginContext<
	typeof TriggerCmdSchema,
	TriggerCmdPluginOptions
>;

export type TriggerCmdKeyBuilderContext =
	KeyBuilderContext<TriggerCmdPluginOptions>;

export type TriggerCmdBoundEndpoints = BindEndpoints<
	typeof triggercmdEndpointsNested
>;

type TriggerCmdEndpoint<K extends keyof TriggerCmdEndpointOutputs> =
	CorsairEndpoint<
		TriggerCmdContext,
		TriggerCmdEndpointInputs[K],
		TriggerCmdEndpointOutputs[K]
	>;

export type TriggerCmdEndpoints = {
	commandsList: TriggerCmdEndpoint<'listCommands'>;
	commandsRun: TriggerCmdEndpoint<'runCommand'>;
	commandsHistory: TriggerCmdEndpoint<'runHistory'>;
	computersList: TriggerCmdEndpoint<'listComputers'>;
	panelsList: TriggerCmdEndpoint<'listPanelButtons'>;
	panelsTrigger: TriggerCmdEndpoint<'triggerPanelButton'>;
};

const triggercmdEndpointsNested = {
	commands: {
		list: CommandsEndpoints.list,
		run: CommandsEndpoints.run,
		history: CommandsEndpoints.history,
	},
	computers: {
		list: ComputersEndpoints.list,
	},
	panels: {
		list: PanelsEndpoints.list,
		trigger: PanelsEndpoints.trigger,
	},
} as const;

export const triggercmdEndpointSchemas = {
	'commands.list': {
		input: TriggerCmdEndpointInputSchemas.listCommands,
		output: TriggerCmdEndpointOutputSchemas.listCommands,
	},
	'commands.run': {
		input: TriggerCmdEndpointInputSchemas.runCommand,
		output: TriggerCmdEndpointOutputSchemas.runCommand,
	},
	'commands.history': {
		input: TriggerCmdEndpointInputSchemas.runHistory,
		output: TriggerCmdEndpointOutputSchemas.runHistory,
	},
	'computers.list': {
		input: TriggerCmdEndpointInputSchemas.listComputers,
		output: TriggerCmdEndpointOutputSchemas.listComputers,
	},
	'panels.list': {
		input: TriggerCmdEndpointInputSchemas.listPanelButtons,
		output: TriggerCmdEndpointOutputSchemas.listPanelButtons,
	},
	'panels.trigger': {
		input: TriggerCmdEndpointInputSchemas.triggerPanelButton,
		output: TriggerCmdEndpointOutputSchemas.triggerPanelButton,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof triggercmdEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const triggercmdEndpointMeta = {
	'commands.list': {
		riskLevel: 'read',
		description:
			'List the commands configured on every computer, with the computer each belongs to',
	},
	// Runs a command line on a real computer, which can't be taken back.
	'commands.run': {
		riskLevel: 'destructive',
		description:
			"Run a configured command on one of the account's computers, with optional parameters",
	},
	'commands.history': {
		riskLevel: 'read',
		description: 'Read the run history of one command, newest first',
	},
	'computers.list': {
		riskLevel: 'read',
		description: 'List the computers the agent has registered',
	},
	'panels.list': {
		riskLevel: 'read',
		description:
			'List the dashboard panel buttons and the parameters each carries',
	},
	// Runs the button's command on a real computer, like commands.run.
	'panels.trigger': {
		riskLevel: 'destructive',
		description:
			'Press a panel button, which runs the command it is configured for',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof triggercmdEndpointsNested
>;

export type BaseTriggerCmdPlugin<T extends TriggerCmdPluginOptions> =
	CorsairPlugin<
		'triggercmd',
		typeof TriggerCmdSchema,
		typeof triggercmdEndpointsNested,
		{},
		T,
		typeof defaultAuthType
	>;

export type InternalTriggerCmdPlugin =
	BaseTriggerCmdPlugin<TriggerCmdPluginOptions>;

export type ExternalTriggerCmdPlugin<T extends TriggerCmdPluginOptions> =
	BaseTriggerCmdPlugin<T>;

export function triggercmd<const T extends TriggerCmdPluginOptions>(
	incomingOptions: TriggerCmdPluginOptions & T = {} as TriggerCmdPluginOptions &
		T,
): ExternalTriggerCmdPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'triggercmd',
		schema: TriggerCmdSchema,
		options: options,
		hooks: options.hooks,
		endpoints: triggercmdEndpointsNested,
		webhooks: {},
		endpointMeta: triggercmdEndpointMeta,
		endpointSchemas: triggercmdEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: TriggerCmdKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('triggercmd', ctx.authType ?? 'api_key');
		},
	} satisfies InternalTriggerCmdPlugin;
}

export { triggerCmdErrorMessage } from './client';

export type {
	CommandOutput,
	CommandRunOutput,
	ComputerOutput,
	ListCommandsInput,
	ListPanelButtonsInput,
	PanelButtonOutput,
	RunCommandInput,
	TriggerCmdEndpointInputs,
	TriggerCmdEndpointOutputs,
	TriggerResultOutput,
} from './endpoints/types';
