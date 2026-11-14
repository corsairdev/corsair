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
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import { Account, Calibrations, Gages } from './endpoints';
import type {
	GagelistEndpointInputs,
	GagelistEndpointOutputs,
} from './endpoints/types';
import {
	GagelistEndpointInputSchemas,
	GagelistEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { GagelistSchema } from './schema';

export type GagelistPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/**
	 * The client id, the `client_id` the token endpoint takes. The key builder
	 * pairs it with the secret and passes both to the endpoints as `ctx.key`.
	 */
	key?: string;
	/** The client secret, which the token endpoint needs beside the id. */
	clientSecret?: string;
	/** The client id, when it is set as an option rather than stored. */
	clientId?: string;
	hooks?: InternalGagelistPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof gagelistEndpointsNested>;
};

/**
 * GageList authenticates with a **client pair**, not one key: the two are
 * exchanged for a bearer token at `/api/token`. The secret is an account-level
 * field beside the key, because `get_integration_credentials` is only installed
 * for `oauth_2`.
 */
export const gagelistAuthConfig = {
	api_key: {
		account: ['api_secret'] as const,
	},
} as const satisfies PluginAuthConfig;

export type GagelistContext = CorsairPluginContext<
	typeof GagelistSchema,
	GagelistPluginOptions,
	undefined,
	typeof gagelistAuthConfig
>;

export type GagelistKeyBuilderContext = KeyBuilderContext<
	GagelistPluginOptions,
	typeof gagelistAuthConfig
>;

export type GagelistBoundEndpoints = BindEndpoints<
	typeof gagelistEndpointsNested
>;

type GagelistEndpoint<K extends keyof GagelistEndpointOutputs> =
	CorsairEndpoint<
		GagelistContext,
		GagelistEndpointInputs[K],
		GagelistEndpointOutputs[K]
	>;

export type GagelistEndpoints = {
	gagesList: GagelistEndpoint<'gagesList'>;
	gagesGet: GagelistEndpoint<'gagesGet'>;
	gagesCreate: GagelistEndpoint<'gagesCreate'>;
	gagesUpdate: GagelistEndpoint<'gagesUpdate'>;
	gagesRemove: GagelistEndpoint<'gagesRemove'>;
	calibrationsList: GagelistEndpoint<'calibrationsList'>;
	calibrationsGet: GagelistEndpoint<'calibrationsGet'>;
	calibrationsCreate: GagelistEndpoint<'calibrationsCreate'>;
	calibrationsUpdate: GagelistEndpoint<'calibrationsUpdate'>;
	calibrationsRemove: GagelistEndpoint<'calibrationsRemove'>;
	calibrationCertificate: GagelistEndpoint<'calibrationCertificate'>;
	manufacturersList: GagelistEndpoint<'manufacturersList'>;
	manufacturersCreate: GagelistEndpoint<'manufacturersCreate'>;
	manufacturersUpdate: GagelistEndpoint<'manufacturersUpdate'>;
	manufacturersRemove: GagelistEndpoint<'manufacturersRemove'>;
	customFieldsList: GagelistEndpoint<'customFieldsList'>;
	customFieldValuesUpdate: GagelistEndpoint<'customFieldValuesUpdate'>;
	accountStatus: GagelistEndpoint<'accountStatus'>;
};

const gagelistEndpointsNested = {
	gages: {
		list: Gages.list,
		get: Gages.get,
		create: Gages.create,
		update: Gages.update,
		delete: Gages.remove,
	},
	calibrations: {
		list: Calibrations.list,
		get: Calibrations.get,
		create: Calibrations.create,
		update: Calibrations.update,
		delete: Calibrations.remove,
		certificate: Calibrations.certificate,
	},
	manufacturers: {
		list: Account.manufacturers,
		create: Account.manufacturersCreate,
		update: Account.manufacturersUpdate,
		delete: Account.manufacturersRemove,
	},
	customFields: {
		list: Account.customFields,
		updateValues: Account.customFieldValues,
	},
	account: {
		status: Account.accountStatus,
	},
} as const;

export const gagelistEndpointSchemas = {
	'gages.list': {
		input: GagelistEndpointInputSchemas.gagesList,
		output: GagelistEndpointOutputSchemas.gagesList,
	},
	'gages.get': {
		input: GagelistEndpointInputSchemas.gagesGet,
		output: GagelistEndpointOutputSchemas.gagesGet,
	},
	'gages.create': {
		input: GagelistEndpointInputSchemas.gagesCreate,
		output: GagelistEndpointOutputSchemas.gagesCreate,
	},
	'gages.update': {
		input: GagelistEndpointInputSchemas.gagesUpdate,
		output: GagelistEndpointOutputSchemas.gagesUpdate,
	},
	'gages.delete': {
		input: GagelistEndpointInputSchemas.gagesRemove,
		output: GagelistEndpointOutputSchemas.gagesRemove,
	},
	'calibrations.list': {
		input: GagelistEndpointInputSchemas.calibrationsList,
		output: GagelistEndpointOutputSchemas.calibrationsList,
	},
	'calibrations.get': {
		input: GagelistEndpointInputSchemas.calibrationsGet,
		output: GagelistEndpointOutputSchemas.calibrationsGet,
	},
	'calibrations.create': {
		input: GagelistEndpointInputSchemas.calibrationsCreate,
		output: GagelistEndpointOutputSchemas.calibrationsCreate,
	},
	'calibrations.update': {
		input: GagelistEndpointInputSchemas.calibrationsUpdate,
		output: GagelistEndpointOutputSchemas.calibrationsUpdate,
	},
	'calibrations.delete': {
		input: GagelistEndpointInputSchemas.calibrationsRemove,
		output: GagelistEndpointOutputSchemas.calibrationsRemove,
	},
	'calibrations.certificate': {
		input: GagelistEndpointInputSchemas.calibrationCertificate,
		output: GagelistEndpointOutputSchemas.calibrationCertificate,
	},
	'manufacturers.list': {
		input: GagelistEndpointInputSchemas.manufacturersList,
		output: GagelistEndpointOutputSchemas.manufacturersList,
	},
	'manufacturers.create': {
		input: GagelistEndpointInputSchemas.manufacturersCreate,
		output: GagelistEndpointOutputSchemas.manufacturersCreate,
	},
	'manufacturers.update': {
		input: GagelistEndpointInputSchemas.manufacturersUpdate,
		output: GagelistEndpointOutputSchemas.manufacturersUpdate,
	},
	'manufacturers.delete': {
		input: GagelistEndpointInputSchemas.manufacturersRemove,
		output: GagelistEndpointOutputSchemas.manufacturersRemove,
	},
	'customFields.list': {
		input: GagelistEndpointInputSchemas.customFieldsList,
		output: GagelistEndpointOutputSchemas.customFieldsList,
	},
	'customFields.updateValues': {
		input: GagelistEndpointInputSchemas.customFieldValuesUpdate,
		output: GagelistEndpointOutputSchemas.customFieldValuesUpdate,
	},
	'account.status': {
		input: GagelistEndpointInputSchemas.accountStatus,
		output: GagelistEndpointOutputSchemas.accountStatus,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof gagelistEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const gagelistEndpointMeta = {
	'gages.list': {
		riskLevel: 'read',
		description:
			'Gages on the site, paged by `start` and `record_number` in the request body; `next_start` gives the next page',
	},
	'gages.get': {
		riskLevel: 'read',
		description:
			'One gage with its calibration dates, interval and assigned user',
	},
	'gages.create': {
		riskLevel: 'write',
		description:
			'Add a gage, with its serial and control numbers, calibration interval and responsible user',
	},
	'gages.update': {
		riskLevel: 'write',
		description:
			'Update a gage. The body is the whole record with its `Id`, not a partial patch',
	},
	'gages.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a gage. GageList marks it deleted rather than erasing it, but it stops appearing in the active list',
	},
	'calibrations.list': {
		riskLevel: 'read',
		description:
			'Calibration records, paged; each names the gage it was run on through `EquipmentRefId`',
	},
	'calibrations.get': {
		riskLevel: 'read',
		description:
			'One calibration record with its as-found and as-left readings',
	},
	'calibrations.create': {
		riskLevel: 'write',
		description:
			'Record a calibration against a gage, with the readings, standard used and next due date',
	},
	'calibrations.update': {
		riskLevel: 'write',
		description: 'Update a calibration record',
	},
	'calibrations.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a calibration record',
	},
	'calibrations.certificate': {
		riskLevel: 'read',
		description:
			'Render a calibration certificate PDF for a record, returned base64-encoded with its content type',
	},
	'manufacturers.list': {
		riskLevel: 'read',
		description: 'Instrument manufacturers, paged',
	},
	'manufacturers.create': {
		riskLevel: 'write',
		description: 'Add a manufacturer with its address and contact details',
	},
	'manufacturers.update': {
		riskLevel: 'write',
		description: 'Update a manufacturer',
	},
	'manufacturers.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a manufacturer',
	},
	'customFields.list': {
		riskLevel: 'read',
		description:
			'The account’s custom fields: each `Id` is the `FieldId` a value write takes, and `ForType` says whether it belongs on gages or calibrations',
	},
	'customFields.updateValues': {
		riskLevel: 'write',
		description:
			'Create or update custom field values on a gage or a calibration. `RefType` is `1` for a gage and `2` for a calibration',
	},
	'account.status': {
		riskLevel: 'read',
		description:
			'The site’s plan limits and usage: gage and user counts, gages due and past due, and what the client may change',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof gagelistEndpointsNested>;

export type BaseGagelistPlugin<T extends GagelistPluginOptions> = CorsairPlugin<
	'gagelist',
	typeof GagelistSchema,
	typeof gagelistEndpointsNested,
	{},
	T,
	typeof defaultAuthType,
	typeof gagelistAuthConfig
>;

export type InternalGagelistPlugin = BaseGagelistPlugin<GagelistPluginOptions>;

export type ExternalGagelistPlugin<T extends GagelistPluginOptions> =
	BaseGagelistPlugin<T>;

export function gagelist<const T extends GagelistPluginOptions>(
	incomingOptions: GagelistPluginOptions & T = {} as GagelistPluginOptions & T,
): ExternalGagelistPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'gagelist',
		schema: GagelistSchema,
		options,
		hooks: options.hooks,
		endpoints: gagelistEndpointsNested,
		webhooks: {},
		authConfig: gagelistAuthConfig,
		endpointMeta: gagelistEndpointMeta,
		endpointSchemas: gagelistEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		// GageList needs both halves of the client pair, so the key builder
		// resolves each one (option first, then the stored field) and hands the
		// pair to the endpoints as `ctx.key`. A missing half raises
		// AuthMissingError here, so Corsair can offer a connect link instead of
		// a token request going out with an empty value.
		keyBuilder: async (ctx: GagelistKeyBuilderContext, source) => {
			if (source !== 'endpoint' || ctx.authType !== 'api_key') {
				throw new AuthMissingError('gagelist', ctx.authType ?? 'api_key');
			}

			const clientId =
				options.clientId || options.key || (await ctx.keys.get_api_key());
			const clientSecret =
				options.clientSecret || (await ctx.keys.get_api_secret());
			if (!clientId || !clientSecret) {
				throw new AuthMissingError('gagelist', 'api_key');
			}
			return JSON.stringify({ clientId, clientSecret });
		},
	} satisfies InternalGagelistPlugin;
}

export { clearGagelistToken, GagelistAPIError } from './client';

export type {
	AccountStatusInput,
	AccountStatusResponse,
	BooleanResponse,
	CalibrationCertificateInput,
	CalibrationGetInput,
	CalibrationRemoveInput,
	CalibrationResponse,
	CalibrationsCreateInput,
	CalibrationsListInput,
	CalibrationsListResponse,
	CalibrationsUpdateInput,
	CertificateResponse,
	CustomFieldsListInput,
	CustomFieldsListResponse,
	CustomFieldValuesUpdateInput,
	CustomFieldValuesUpdateResponse,
	GageCreateResponse,
	GageGetInput,
	GagelistAccountStatus,
	GagelistCalibration,
	GagelistCustomField,
	GagelistEndpointInputs,
	GagelistEndpointOutputs,
	GagelistGage,
	GagelistManufacturer,
	GageRemoveInput,
	GageResponse,
	GagesCreateInput,
	GagesListInput,
	GagesListResponse,
	GagesUpdateInput,
	GageUpdateResponse,
	GageWriteInput,
	ManufacturerRemoveInput,
	ManufacturersCreateInput,
	ManufacturersListInput,
	ManufacturersListResponse,
	ManufacturersUpdateInput,
} from './endpoints/types';
