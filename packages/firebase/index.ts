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
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import { tryGetStoredKey } from './client';
import {
	firebaseEndpointSchemas,
	firebaseEndpointsNested,
	firebaseEndpointMeta as generatedEndpointMeta,
} from './endpoints/catalog';
import type {
	FirebaseEndpointInputs,
	FirebaseEndpointOutputs,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { FirebaseSchema } from './schema';

export type FirebasePluginOptions = {
	authType?: PickAuth<'api_key'>;
	/**
	 * A service account's JSON key (Firebase console > Project settings >
	 * Service accounts > Generate new private key), as the whole JSON text.
	 * The plugin signs a JWT with it and trades it for a Google access token.
	 * An OAuth access token (`ya29...`) works too, until it expires.
	 */
	key?: string;
	/**
	 * Base URLs per group for the Firebase Local Emulator Suite, e.g.
	 * `{ firestore: 'http://127.0.0.1:8080/', auth:
	 * 'http://127.0.0.1:9099/identitytoolkit.googleapis.com/', database:
	 * 'http://127.0.0.1:9000', storage: 'http://127.0.0.1:9199/storage/v1/' }`.
	 * Calls to a group listed here send the emulators' `Bearer owner`.
	 */
	emulatorUrls?: Partial<Record<string, string>>;
	hooks?: InternalFirebasePlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof firebaseEndpointsNested>;
};

// Project, database, site and app names are per-call inputs (full resource
// names); one service account can reach several projects it is granted.
export const firebaseAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type FirebaseContext = CorsairPluginContext<
	typeof FirebaseSchema,
	FirebasePluginOptions,
	undefined,
	typeof firebaseAuthConfig
>;

export type FirebaseKeyBuilderContext = KeyBuilderContext<
	FirebasePluginOptions,
	typeof firebaseAuthConfig
>;

export type FirebaseBoundEndpoints = BindEndpoints<
	typeof firebaseEndpointsNested
>;

export type FirebaseEndpoints = {
	[Id in keyof FirebaseEndpointOutputs]: CorsairEndpoint<
		FirebaseContext,
		FirebaseEndpointInputs[Id],
		FirebaseEndpointOutputs[Id]
	>;
};

export { firebaseEndpointSchemas };

// One entry per operation, generated with the catalog (endpoints/catalog.ts).
const firebaseEndpointMeta =
	generatedEndpointMeta satisfies RequiredPluginEndpointMeta<
		typeof firebaseEndpointsNested
	>;

const defaultAuthType = 'api_key' as const;

export type BaseFirebasePlugin<T extends FirebasePluginOptions> = CorsairPlugin<
	'firebase',
	typeof FirebaseSchema,
	typeof firebaseEndpointsNested,
	{},
	T,
	typeof defaultAuthType,
	typeof firebaseAuthConfig
>;

export type InternalFirebasePlugin = BaseFirebasePlugin<FirebasePluginOptions>;

export type ExternalFirebasePlugin<T extends FirebasePluginOptions> =
	BaseFirebasePlugin<T>;

export function firebase<const T extends FirebasePluginOptions>(
	// Safe: every FirebasePluginOptions field is optional, so an empty object satisfies it.
	incomingOptions: FirebasePluginOptions & T = {} as FirebasePluginOptions & T,
): ExternalFirebasePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'firebase',
		authConfig: firebaseAuthConfig,
		schema: FirebaseSchema,
		options: options,
		hooks: options.hooks,
		endpoints: firebaseEndpointsNested,
		webhooks: {},
		endpointMeta: firebaseEndpointMeta,
		endpointSchemas: firebaseEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: (() => {
			// Core uses the first handler whose matcher accepts the error, and
			// DEFAULT matches everything, so DEFAULT always goes last; otherwise
			// it would shadow a handler a caller adds through options.
			const { DEFAULT: builtInDefault, ...specificDefaults } = errorHandlers;
			const { DEFAULT: callerDefault, ...callerHandlers } =
				options.errorHandlers || {};
			return {
				...specificDefaults,
				...callerHandlers,
				DEFAULT: callerDefault || builtInDefault,
			};
		})(),
		keyBuilder: async (ctx: FirebaseKeyBuilderContext, source) => {
			if (source !== 'endpoint') return '';
			if (options.key) return options.key;
			// Every group pointed at an emulator: no Google credential needed.
			if (
				options.emulatorUrls &&
				Object.keys(options.emulatorUrls).length > 0
			) {
				const stored = await tryGetStoredKey(() => ctx.keys?.get_api_key());
				return stored ?? 'emulator';
			}
			const key = await tryGetStoredKey(() => ctx.keys?.get_api_key());
			// No key configured: AuthMissingError makes core ask the tenant to connect.
			if (!key) throw new AuthMissingError('firebase', 'api_key');
			return key;
		},
	} satisfies InternalFirebasePlugin;
}

export type { FirebaseRequest, FirebaseServiceAccount } from './client';
export {
	clearFirebaseTokenCache,
	parseFirebaseKey,
	serviceAccountAssertion,
} from './client';
export {
	createFirebaseOperation,
	FIREBASE_OPERATION_IDS,
	getFirebaseInputSchema,
	getFirebaseOutputSchema,
} from './endpoints';
export type {
	FirebaseEndpointInputs,
	FirebaseEndpointOutputs,
	FirebaseJsonValue,
	FirebaseOperationId,
} from './endpoints/types';
export {
	FirebaseEndpointInputSchemas,
	FirebaseEndpointOutputSchemas,
} from './endpoints/types';
