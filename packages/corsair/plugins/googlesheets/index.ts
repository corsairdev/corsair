import type {
	BindEndpoints,
	BindWebhooks,
	CorsairEndpoint,
	CorsairPlugin,
	CorsairPluginContext,
	CorsairWebhook,
	KeyBuilderContext,
	RawWebhookRequest,
} from '../../core';
import type { AuthTypes, PickAuth } from '../../core/constants';
import { getValidAccessToken } from './client';
import type {
	GoogleSheetsEndpointInputs,
	GoogleSheetsEndpointOutputs,
} from './endpoints';
import { SheetsEndpoints, SpreadsheetsEndpoints } from './endpoints';
import { GoogleSheetsSchema } from './schema';
import type {
	GoogleSheetsWebhookOutputs,
	GoogleSheetsWebhookPayload,
	RangeUpdatedEvent,
} from './webhooks';
import { RowWebhooks } from './webhooks';

export type GoogleSheetsContext = CorsairPluginContext<
	typeof GoogleSheetsSchema,
	GoogleSheetsPluginOptions
>;

type GoogleSheetsEndpoint<K extends keyof GoogleSheetsEndpointOutputs> =
	CorsairEndpoint<
		GoogleSheetsContext,
		GoogleSheetsEndpointInputs[K],
		GoogleSheetsEndpointOutputs[K]
	>;

export type GoogleSheetsEndpoints = {
	spreadsheetsCreate: GoogleSheetsEndpoint<'spreadsheetsCreate'>;
	spreadsheetsDelete: GoogleSheetsEndpoint<'spreadsheetsDelete'>;
	sheetsAppendRow: GoogleSheetsEndpoint<'sheetsAppendRow'>;
	sheetsAppendOrUpdateRow: GoogleSheetsEndpoint<'sheetsAppendOrUpdateRow'>;
	sheetsGetRows: GoogleSheetsEndpoint<'sheetsGetRows'>;
	sheetsUpdateRow: GoogleSheetsEndpoint<'sheetsUpdateRow'>;
	sheetsClearSheet: GoogleSheetsEndpoint<'sheetsClearSheet'>;
	sheetsCreateSheet: GoogleSheetsEndpoint<'sheetsCreateSheet'>;
	sheetsDeleteSheet: GoogleSheetsEndpoint<'sheetsDeleteSheet'>;
	sheetsDeleteRowsOrColumns: GoogleSheetsEndpoint<'sheetsDeleteRowsOrColumns'>;
};

export type GoogleSheetsBoundEndpoints = BindEndpoints<
	typeof googleSheetsEndpointsNested
>;

type GoogleSheetsWebhook<
	K extends keyof GoogleSheetsWebhookOutputs,
	TEvent,
> = CorsairWebhook<
	GoogleSheetsContext,
	GoogleSheetsWebhookPayload<TEvent>,
	GoogleSheetsWebhookOutputs[K]
>;

export type GoogleSheetsWebhooks = {
	rangeUpdated: GoogleSheetsWebhook<'rangeUpdated', RangeUpdatedEvent>;
};

export type GoogleSheetsBoundWebhooks = BindWebhooks<
	typeof googleSheetsWebhooksNested
>;

const googleSheetsEndpointsNested = {
	spreadsheets: {
		create: SpreadsheetsEndpoints.create,
		delete: SpreadsheetsEndpoints.delete,
	},
	sheets: {
		appendRow: SheetsEndpoints.appendRow,
		appendOrUpdateRow: SheetsEndpoints.appendOrUpdateRow,
		getRows: SheetsEndpoints.getRows,
		updateRow: SheetsEndpoints.updateRow,
		clearSheet: SheetsEndpoints.clearSheet,
		createSheet: SheetsEndpoints.createSheet,
		deleteSheet: SheetsEndpoints.deleteSheet,
		deleteRowsOrColumns: SheetsEndpoints.deleteRowsOrColumns,
	},
} as const;

const googleSheetsWebhooksNested = {
	rangeUpdated: RowWebhooks.rangeUpdated,
} as const;

export type GoogleSheetsPluginOptions = {
	authType?: PickAuth<'oauth_2'>;
	key?: string;
	hooks?: InternalGoogleSheetsPlugin['hooks'];
	webhookHooks?: InternalGoogleSheetsPlugin['webhookHooks'];
};

export type GoogleSheetsKeyBuilderContext =
	KeyBuilderContext<GoogleSheetsPluginOptions>;

const defaultAuthType: AuthTypes = 'oauth_2';

export type BaseGoogleSheetsPlugin<T extends GoogleSheetsPluginOptions> =
	CorsairPlugin<
		'googlesheets',
		typeof GoogleSheetsSchema,
		typeof googleSheetsEndpointsNested,
		typeof googleSheetsWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalGoogleSheetsPlugin =
	BaseGoogleSheetsPlugin<GoogleSheetsPluginOptions>;

export type ExternalGoogleSheetsPlugin<T extends GoogleSheetsPluginOptions> =
	BaseGoogleSheetsPlugin<T>;

export function googlesheets<const T extends GoogleSheetsPluginOptions>(
	incomingOptions: GoogleSheetsPluginOptions &
		T = {} as GoogleSheetsPluginOptions & T,
): ExternalGoogleSheetsPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'googlesheets',
		schema: GoogleSheetsSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: googleSheetsEndpointsNested,
		webhooks: googleSheetsWebhooksNested,
		keyBuilder: async (ctx: GoogleSheetsKeyBuilderContext) => {
			if (options.key) {
				return options.key;
			}

			if (ctx.authType === 'oauth_2') {
				const accessToken = await ctx.keys.get_access_token();
				const refreshToken = await ctx.keys.get_refresh_token();

				if (!accessToken || !refreshToken) {
					throw new Error('No client id or client secret');
				}

				const res = await ctx.keys.get_integration_credentials();

				if (!res.client_id || !res.client_secret) {
					throw new Error('No client id or client secret');
				}

				const key = await getValidAccessToken({
					accessToken,
					refreshToken,
					clientId: res.client_id,
					clientSecret: res.client_secret,
				});

				return key;
			}

			return '';
		},
		pluginWebhookMatcher: (request: RawWebhookRequest) => {
			const body = request.body as RangeUpdatedEvent;
			if (!body) return false;
			const hasSpreadsheetId = typeof body?.spreadsheetId === 'string';
			const hasSheetsEventType = body?.eventType === 'rangeUpdated';
			return hasSpreadsheetId || hasSheetsEventType;
		},
	} satisfies InternalGoogleSheetsPlugin;
}

// ─────────────────────────────────────────────────────────────────────────────
// Webhook Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
	GoogleAppsScriptWebhookPayload,
	GoogleSheetsEventName,
	GoogleSheetsWebhookEvent,
	GoogleSheetsWebhookOutputs,
	GoogleSheetsWebhookPayload,
	RangeUpdatedEvent,
} from './webhooks/types';
export { createGoogleSheetsWebhookMatcher } from './webhooks/types';

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
	GoogleSheetsEndpointInputs,
	GoogleSheetsEndpointOutputs,
} from './endpoints/types';
