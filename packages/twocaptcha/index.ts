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
import { AccountEndpoints, TasksEndpoints } from './endpoints';
import type {
	TwoCaptchaEndpointInputs,
	TwoCaptchaEndpointOutputs,
} from './endpoints/types';
import {
	TwoCaptchaEndpointInputSchemas,
	TwoCaptchaEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { TwoCaptchaSchema } from './schema';

export type TwoCaptchaPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalTwoCaptchaPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof twocaptchaEndpointsNested>;
};

export type TwoCaptchaContext = CorsairPluginContext<
	typeof TwoCaptchaSchema,
	TwoCaptchaPluginOptions
>;

export type TwoCaptchaKeyBuilderContext =
	KeyBuilderContext<TwoCaptchaPluginOptions>;

export type TwoCaptchaBoundEndpoints = BindEndpoints<
	typeof twocaptchaEndpointsNested
>;

type TwoCaptchaEndpoint<K extends keyof TwoCaptchaEndpointOutputs> =
	CorsairEndpoint<
		TwoCaptchaContext,
		TwoCaptchaEndpointInputs[K],
		TwoCaptchaEndpointOutputs[K]
	>;

export type TwoCaptchaEndpoints = {
	tasksCreate: TwoCaptchaEndpoint<'createTask'>;
	tasksResult: TwoCaptchaEndpoint<'getTaskResult'>;
	accountBalance: TwoCaptchaEndpoint<'getBalance'>;
	accountReportCorrect: TwoCaptchaEndpoint<'reportCorrect'>;
	accountReportIncorrect: TwoCaptchaEndpoint<'reportIncorrect'>;
};

const twocaptchaEndpointsNested = {
	tasks: {
		create: TasksEndpoints.create,
		result: TasksEndpoints.result,
	},
	account: {
		balance: AccountEndpoints.balance,
		reportCorrect: AccountEndpoints.reportCorrect,
		reportIncorrect: AccountEndpoints.reportIncorrect,
	},
} as const;

export const twocaptchaEndpointSchemas = {
	'tasks.create': {
		input: TwoCaptchaEndpointInputSchemas.createTask,
		output: TwoCaptchaEndpointOutputSchemas.createTask,
	},
	'tasks.result': {
		input: TwoCaptchaEndpointInputSchemas.getTaskResult,
		output: TwoCaptchaEndpointOutputSchemas.getTaskResult,
	},
	'account.balance': {
		input: TwoCaptchaEndpointInputSchemas.getBalance,
		output: TwoCaptchaEndpointOutputSchemas.getBalance,
	},
	'account.reportCorrect': {
		input: TwoCaptchaEndpointInputSchemas.reportCorrect,
		output: TwoCaptchaEndpointOutputSchemas.reportCorrect,
	},
	'account.reportIncorrect': {
		input: TwoCaptchaEndpointInputSchemas.reportIncorrect,
		output: TwoCaptchaEndpointOutputSchemas.reportIncorrect,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof twocaptchaEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const twocaptchaEndpointMeta = {
	'tasks.create': {
		riskLevel: 'destructive',
		description:
			'Create a captcha-solving task, which the account pays for; returns the task id to poll',
	},
	'tasks.result': {
		riskLevel: 'read',
		description:
			'Read a task result: processing while workers solve it, then ready with the solution and cost',
	},
	'account.balance': {
		riskLevel: 'read',
		description: 'Read the account balance in USD',
	},
	'account.reportCorrect': {
		riskLevel: 'write',
		description: 'Report that the site accepted a task answer',
	},
	'account.reportIncorrect': {
		riskLevel: 'destructive',
		description:
			'Report that the site rejected a task answer; 2Captcha reviews it and may refund the task',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof twocaptchaEndpointsNested
>;

export type BaseTwoCaptchaPlugin<T extends TwoCaptchaPluginOptions> =
	CorsairPlugin<
		'twocaptcha',
		typeof TwoCaptchaSchema,
		typeof twocaptchaEndpointsNested,
		{},
		T,
		typeof defaultAuthType
	>;

export type InternalTwoCaptchaPlugin =
	BaseTwoCaptchaPlugin<TwoCaptchaPluginOptions>;

export type ExternalTwoCaptchaPlugin<T extends TwoCaptchaPluginOptions> =
	BaseTwoCaptchaPlugin<T>;

export function twocaptcha<const T extends TwoCaptchaPluginOptions>(
	incomingOptions: TwoCaptchaPluginOptions & T = {} as TwoCaptchaPluginOptions &
		T,
): ExternalTwoCaptchaPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'twocaptcha',
		schema: TwoCaptchaSchema,
		options: options,
		hooks: options.hooks,
		endpoints: twocaptchaEndpointsNested,
		webhooks: {},
		endpointMeta: twocaptchaEndpointMeta,
		endpointSchemas: twocaptchaEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: TwoCaptchaKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('twocaptcha', ctx.authType ?? 'api_key');
		},
	} satisfies InternalTwoCaptchaPlugin;
}

export { assertSucceeded, TwoCaptchaAPIError } from './client';

export type {
	CreateTaskInput,
	GetTaskResultInput,
	TaskCreatedOutput,
	TaskResultOutput,
	TaskState,
	TwoCaptchaEndpointInputs,
	TwoCaptchaEndpointOutputs,
} from './endpoints/types';
