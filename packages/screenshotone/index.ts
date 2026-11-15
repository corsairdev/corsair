import type {
	AuthTypes,
	CorsairErrorHandler,
	CorsairPlugin,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import type { ScreenshotOneContext } from './context';
import {
	getUsage,
	listDevices,
	takeAnimation,
	takeBulk,
	takeScreenshot,
} from './endpoints';
import {
	BulkInputSchema,
	BulkResponseSchema,
	DeviceListResponseSchema,
	EmptyInputSchema,
	ShotResponseSchema,
	UrlInputSchema,
	UsageResponseSchema,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { ScreenshotOneSchema } from './schema';

export type { ScreenshotOneContext };

export type ScreenshotOnePluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalScreenshotOnePlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof screenshotoneEndpointsNested>;
};

export type ScreenshotOneKeyBuilderContext =
	KeyBuilderContext<ScreenshotOnePluginOptions>;

const screenshotoneEndpointsNested = {
	usage: { get: getUsage },
	devices: { list: listDevices },
	shots: { take: takeScreenshot, animate: takeAnimation, bulk: takeBulk },
} as const;

const screenshotoneWebhooksNested = {} as const;

export const screenshotoneEndpointSchemas = {
	'usage.get': { input: EmptyInputSchema, output: UsageResponseSchema },
	'devices.list': {
		input: EmptyInputSchema,
		output: DeviceListResponseSchema,
	},
	'shots.take': { input: UrlInputSchema, output: ShotResponseSchema },
	'shots.animate': { input: UrlInputSchema, output: ShotResponseSchema },
	'shots.bulk': { input: BulkInputSchema, output: BulkResponseSchema },
} as const satisfies RequiredPluginEndpointSchemas<
	typeof screenshotoneEndpointsNested
>;

const read = (description: string) =>
	({ riskLevel: 'read', description }) as const;

const screenshotoneEndpointMeta = {
	'usage.get': read('Read the current plan usage and request bucket.'),
	'devices.list': read(
		'List device presets. User agent strings are not stored.',
	),
	'shots.take': {
		riskLevel: 'write',
		description: 'Take a screenshot. This spends a request from the plan.',
	},
	'shots.animate': {
		riskLevel: 'write',
		description:
			'Take an animated screenshot. This spends a request from the plan.',
	},
	'shots.bulk': {
		riskLevel: 'write',
		description:
			'Build bulk screenshot URLs. execute true spends requests immediately.',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof screenshotoneEndpointsNested
>;

const defaultAuthType = 'api_key' as const satisfies AuthTypes;

export const screenshotoneAuthConfig = {
	api_key: { account: [] as const },
} as const satisfies PluginAuthConfig;

export type BaseScreenshotOnePlugin<T extends ScreenshotOnePluginOptions> =
	CorsairPlugin<
		'screenshotone',
		typeof ScreenshotOneSchema,
		typeof screenshotoneEndpointsNested,
		typeof screenshotoneWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalScreenshotOnePlugin =
	BaseScreenshotOnePlugin<ScreenshotOnePluginOptions>;
export type ExternalScreenshotOnePlugin<T extends ScreenshotOnePluginOptions> =
	BaseScreenshotOnePlugin<T>;

export function screenshotone<const T extends ScreenshotOnePluginOptions>(
	incomingOptions: ScreenshotOnePluginOptions &
		T = {} as ScreenshotOnePluginOptions & T,
): ExternalScreenshotOnePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'screenshotone',
		authConfig: screenshotoneAuthConfig,
		schema: ScreenshotOneSchema,
		options,
		hooks: options.hooks,
		endpoints: screenshotoneEndpointsNested,
		webhooks: screenshotoneWebhooksNested,
		endpointMeta: screenshotoneEndpointMeta,
		endpointSchemas: screenshotoneEndpointSchemas,
		errorHandlers: { ...errorHandlers, ...options.errorHandlers },
		keyBuilder: async (ctx: ScreenshotOneKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) return options.key;
			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();
				return key ?? '';
			}
			return '';
		},
	} satisfies InternalScreenshotOnePlugin;
}
