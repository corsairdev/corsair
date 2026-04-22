import type {
	CorsairErrorHandler,
	CorsairPluginContext,
	EndpointTree,
	PickAuth,
	PluginPermissionsConfig,
} from 'corsair/core';
import type { PluginEntityClients } from 'corsair/orm';
import type { FirecrawlSchema } from './schema';
import type {
	FirecrawlJob,
	FirecrawlScrape,
	FirecrawlSearchRecord,
	FirecrawlSiteMap,
} from './schema/database';

/**
 * Options shape for `CorsairPluginContext` only. `hooks` / `webhookHooks` use `unknown` so this
 * module does not depend on `index.ts` (avoids circular imports that break `InferPluginEntities`).
 * Runtime options still use `FirecrawlPluginOptions` from `index.ts`.
 */
type FirecrawlPluginOptionsForContext = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	webhookSecret?: string;
	hooks?: unknown;
	webhookHooks?: unknown;
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<EndpointTree>;
};

type FirecrawlEntityDb = PluginEntityClients<{
	scrapes: typeof FirecrawlScrape;
	jobs: typeof FirecrawlJob;
	siteMaps: typeof FirecrawlSiteMap;
	searches: typeof FirecrawlSearchRecord;
}>;

export type FirecrawlContext = Omit<
	CorsairPluginContext<
		typeof FirecrawlSchema,
		FirecrawlPluginOptionsForContext
	>,
	'db'
> & { db: FirecrawlEntityDb };
