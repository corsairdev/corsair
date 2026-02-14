import type {
	BindEndpoints,
	BindWebhooks,
	CorsairEndpoint,
	CorsairPlugin,
	CorsairPluginContext,
	CorsairWebhook,
	KeyBuilderContext,
} from '../../core';
import type { AuthTypes, PickAuth } from '../../core/constants';
import { getValidAccessToken } from './client';
import type { GoogleSheetsEndpointOutputs } from './endpoints';
import { SheetsEndpoints, SpreadsheetsEndpoints } from './endpoints';
import { GoogleSheetsSchema } from './schema';
import type {
	GoogleSheetsWebhookOutputs,
	GoogleSheetsWebhookPayload,
	RowAddedEvent,
	RowAddedOrUpdatedEvent,
	RowUpdatedEvent,
} from './webhooks';
import { RowWebhooks } from './webhooks';

export type GoogleSheetsContext = CorsairPluginContext<
	typeof GoogleSheetsSchema,
	GoogleSheetsPluginOptions
>;

type GoogleSheetsEndpoint<
	K extends keyof GoogleSheetsEndpointOutputs,
	Input,
> = CorsairEndpoint<GoogleSheetsContext, Input, GoogleSheetsEndpointOutputs[K]>;

export type GoogleSheetsEndpoints = {
	spreadsheetsCreate: GoogleSheetsEndpoint<
		'spreadsheetsCreate',
		{
			properties?: {
				title?: string;
				locale?: string;
				timeZone?: string;
			};
		}
	>;
	spreadsheetsDelete: GoogleSheetsEndpoint<
		'spreadsheetsDelete',
		{
			spreadsheetId: string;
		}
	>;
	sheetsAppendRow: GoogleSheetsEndpoint<
		'sheetsAppendRow',
		{
			spreadsheetId: string;
			sheetName?: string;
			range?: string;
			values?: (string | number | boolean | null)[];
			valueInputOption?: 'RAW' | 'USER_ENTERED';
			insertDataOption?: 'OVERWRITE' | 'INSERT_ROWS';
		}
	>;
	sheetsAppendOrUpdateRow: GoogleSheetsEndpoint<
		'sheetsAppendOrUpdateRow',
		{
			spreadsheetId: string;
			sheetName?: string;
			keyColumn?: string;
			keyValue?: string | number;
			values?: (string | number | boolean | null)[];
			valueInputOption?: 'RAW' | 'USER_ENTERED';
			insertDataOption?: 'OVERWRITE' | 'INSERT_ROWS';
		}
	>;
	sheetsGetRows: GoogleSheetsEndpoint<
		'sheetsGetRows',
		{
			spreadsheetId: string;
			sheetName?: string;
			range?: string;
			valueRenderOption?: 'FORMATTED_VALUE' | 'UNFORMATTED_VALUE' | 'FORMULA';
			dateTimeRenderOption?: 'SERIAL_NUMBER' | 'FORMATTED_STRING';
		}
	>;
	sheetsUpdateRow: GoogleSheetsEndpoint<
		'sheetsUpdateRow',
		{
			spreadsheetId: string;
			sheetName?: string;
			range?: string;
			rowIndex?: number;
			values?: (string | number | boolean | null)[];
			valueInputOption?: 'RAW' | 'USER_ENTERED';
		}
	>;
	sheetsClearSheet: GoogleSheetsEndpoint<
		'sheetsClearSheet',
		{
			spreadsheetId: string;
			sheetName?: string;
			range?: string;
		}
	>;
	sheetsCreateSheet: GoogleSheetsEndpoint<
		'sheetsCreateSheet',
		{
			spreadsheetId: string;
			title?: string;
		}
	>;
	sheetsDeleteSheet: GoogleSheetsEndpoint<
		'sheetsDeleteSheet',
		{
			spreadsheetId: string;
			sheetId: number;
		}
	>;
	sheetsDeleteRowsOrColumns: GoogleSheetsEndpoint<
		'sheetsDeleteRowsOrColumns',
		{
			spreadsheetId: string;
			sheetId: number;
			dimension?: 'ROWS' | 'COLUMNS';
			startIndex?: number;
			endIndex?: number;
		}
	>;
};

export type GoogleSheetsBoundEndpoints = BindEndpoints<
	typeof googleSheetsEndpointsNested
>;

type GoogleSheetsWebhook<
	K extends keyof GoogleSheetsWebhookOutputs,
	TEvent,
> = CorsairWebhook<
	GoogleSheetsContext,
	GoogleSheetsWebhookPayload,
	GoogleSheetsWebhookOutputs[K]
>;

export type GoogleSheetsWebhooks = {
	rowAdded: GoogleSheetsWebhook<'rowAdded', RowAddedEvent>;
	rowUpdated: GoogleSheetsWebhook<'rowUpdated', RowUpdatedEvent>;
	rowAddedOrUpdated: GoogleSheetsWebhook<
		'rowAddedOrUpdated',
		RowAddedOrUpdatedEvent
	>;
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
	rowAdded: RowWebhooks.rowAdded,
	rowUpdated: RowWebhooks.rowUpdated,
	rowAddedOrUpdated: RowWebhooks.rowAddedOrUpdated,
} as unknown as {
	rowAdded: GoogleSheetsWebhooks['rowAdded'];
	rowUpdated: GoogleSheetsWebhooks['rowUpdated'];
	rowAddedOrUpdated: GoogleSheetsWebhooks['rowAddedOrUpdated'];
};

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
				const accessToken = await ctx.keys.getAccessToken();
				const refreshToken = await ctx.keys.getRefreshToken();

				if (!accessToken || !refreshToken) {
					return '';
				}

				const res = await ctx.keys.getIntegrationCredentials();

				if (!res.clientId || !res.clientSecret) {
					return '';
				}

				const key = await getValidAccessToken({
					accessToken,
					refreshToken,
					clientId: res.clientId,
					clientSecret: res.clientSecret,
				});

				return key;
			}

			return '';
		},
		pluginWebhookMatcher: (
			request: import('../../core/webhooks').RawWebhookRequest,
		) => {
			const body = request.body as Record<string, unknown>;
			return (
				body?.spreadsheetId !== undefined ||
				body?.eventType !== undefined ||
				(body?.values !== undefined && Array.isArray(body.values))
			);
		},
	} satisfies InternalGoogleSheetsPlugin;
}
