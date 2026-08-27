import type {
	BindEndpoints,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
	RequiredPluginWebhookSchemas,
} from 'corsair/core';
import { ApiError } from 'corsair/http';

import { Builds, Projects } from './endpoints';

import { EndpointInputSchemas, EndpointOutputSchemas } from './endpoints/types';

import { AppVeyorSchema } from './schema';

import type {
	AppVeyorBuildResponse,
	AppVeyorConfig,
	AppVeyorProject,
} from './types';

export * from './types';

export type AppVeyorPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalAppVeyorPlugin['hooks'];
	webhookHooks?: InternalAppVeyorPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof appveyorEndpointsNested>;
};

export type AppVeyorContext = CorsairPluginContext<
	typeof AppVeyorSchema,
	AppVeyorPluginOptions
>;

export type AppVeyorKeyBuilderContext =
	KeyBuilderContext<AppVeyorPluginOptions>;

export type AppVeyorEndpoint<K extends keyof EndpointOutputs> = CorsairEndpoint<
	AppVeyorContext,
	EndpointInputs[K],
	EndpointOutputs[K]
>;

export type AppVeyorEndpoints = {
	projectsList: AppVeyorEndpoint<'projectsList'>;
	buildsGetLast: AppVeyorEndpoint<'buildsGetLast'>;
};

type EndpointInputs = {
	[K in keyof typeof EndpointInputSchemas]: ReturnType<
		(typeof EndpointInputSchemas)[K]['parse']
	>;
};

type EndpointOutputs = {
	[K in keyof typeof EndpointOutputSchemas]: ReturnType<
		(typeof EndpointOutputSchemas)[K]['parse']
	>;
};

const appveyorEndpointsNested = {
	projects: {
		list: Projects.list,
	},
	builds: {
		getLast: Builds.getLast,
	},
} as const;

const appveyorWebhooksNested = {} as const;

export const appveyorEndpointSchemas = {
	'projects.list': {
		input: EndpointInputSchemas.projectsList,
		output: EndpointOutputSchemas.projectsList,
	},
	'builds.getLast': {
		input: EndpointInputSchemas.buildsGetLast,
		output: EndpointOutputSchemas.buildsGetLast,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof appveyorEndpointsNested
>;

const appveyorWebhookSchemas =
	{} as const satisfies RequiredPluginWebhookSchemas<
		typeof appveyorWebhooksNested
	>;

const appveyorEndpointMeta = {
	'projects.list': {
		riskLevel: 'read',
		description: 'List AppVeyor projects',
	},
	'builds.getLast': {
		riskLevel: 'read',
		description: 'Get the latest build for an AppVeyor project',
	},
} satisfies RequiredPluginEndpointMeta<typeof appveyorEndpointsNested>;

const defaultAuthType = 'api_key' as const;

export const appveyorAuthConfig = {
	api_key: {
		account: [] as const,
	},
} as const satisfies PluginAuthConfig;

export type AppVeyorBoundEndpoints = BindEndpoints<
	typeof appveyorEndpointsNested
>;

export type BaseAppVeyorPlugin<T extends AppVeyorPluginOptions> = CorsairPlugin<
	'appveyor',
	typeof AppVeyorSchema,
	typeof appveyorEndpointsNested,
	typeof appveyorWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalAppVeyorPlugin = BaseAppVeyorPlugin<AppVeyorPluginOptions>;

export type ExternalAppVeyorPlugin<T extends AppVeyorPluginOptions> =
	BaseAppVeyorPlugin<T>;

export class AppVeyorClient {
	private readonly apiKey: string;
	private readonly baseUrl: string;

	constructor(config: AppVeyorConfig) {
		if (!config.apiKey) {
			throw new Error('AppVeyor API key is required.');
		}

		this.apiKey = config.apiKey;
		this.baseUrl = config.baseUrl || 'https://ci.appveyor.com/api';
	}

	async getProjects(): Promise<AppVeyorProject[]> {
		const url = `${this.baseUrl}/projects`;

		const res = await fetch(url, {
			headers: {
				Authorization: `Bearer ${this.apiKey}`,
			},
		});

		if (!res.ok) {
			const text = await res.text();
			const retryAfter = parseRetryAfter(res.headers.get('Retry-After'));

			throw new ApiError(
				{
					method: 'GET',
					url,
				},
				{
					url,
					ok: false,
					status: res.status,
					statusText: res.statusText,
					body: text,
				},
				`AppVeyor API Error [${res.status} ${res.statusText}]: ${text}`,
				{
					retryAfter,
				},
			);
		}

		return (await res.json()) as AppVeyorProject[];
	}

	async getLastBuild(
		accountName: string,
		projectSlug: string,
	): Promise<AppVeyorBuildResponse> {
		const url = `${this.baseUrl}/projects/${accountName}/${projectSlug}`;

		const res = await fetch(url, {
			headers: {
				Authorization: `Bearer ${this.apiKey}`,
			},
		});

		if (!res.ok) {
			const text = await res.text();
			const retryAfter = parseRetryAfter(res.headers.get('Retry-After'));

			throw new ApiError(
				{
					method: 'GET',
					url,
				},
				{
					url,
					ok: false,
					status: res.status,
					statusText: res.statusText,
					body: text,
				},
				`AppVeyor API Error [${res.status} ${res.statusText}]: ${text}`,
				{
					retryAfter,
				},
			);
		}

		return (await res.json()) as AppVeyorBuildResponse;
	}
}

export function parseRetryAfter(header: string | null): number | undefined {
	if (!header) {
		return undefined;
	}

	const seconds = Number(header);

	if (Number.isFinite(seconds)) {
		return Math.max(0, seconds) * 1000;
	}

	const when = Date.parse(header);

	return Number.isNaN(when) ? undefined : Math.max(0, when - Date.now());
}

export function appveyor<const T extends AppVeyorPluginOptions>(
	incomingOptions: AppVeyorPluginOptions & T = {} as AppVeyorPluginOptions & T,
): ExternalAppVeyorPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'appveyor',
		authConfig: appveyorAuthConfig,
		schema: AppVeyorSchema,
		options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: appveyorEndpointsNested,
		webhooks: appveyorWebhooksNested,
		endpointMeta: appveyorEndpointMeta,
		endpointSchemas: appveyorEndpointSchemas,
		webhookSchemas: appveyorWebhookSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: {
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: AppVeyorKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();
				return key ?? '';
			}

			return '';
		},
	} satisfies InternalAppVeyorPlugin;
}
