import type {
	BindEndpoints,
	CorsairPlugin,
	CorsairPluginContext,
	RequiredPluginEndpointMeta,
} from 'corsair/core';
import { QuickBooksSchema } from './schema';

export type QuickBooksPluginOptions = Record<string, never>;

const quickBooksEndpointsNested = {} as const;

export type QuickBooksContext = CorsairPluginContext<
	typeof QuickBooksSchema,
	QuickBooksPluginOptions,
	typeof quickBooksEndpointsNested
>;

export type QuickBooksBoundEndpoints = BindEndpoints<
	typeof quickBooksEndpointsNested
>;

export type QuickBooksEndpoints = QuickBooksBoundEndpoints;

const quickBooksEndpointMeta = {} satisfies RequiredPluginEndpointMeta<
	typeof quickBooksEndpointsNested
>;

export type BaseQuickBooksPlugin = CorsairPlugin<
	'quickbooks',
	typeof QuickBooksSchema,
	typeof quickBooksEndpointsNested,
	Record<string, never>,
	QuickBooksPluginOptions
>;

export type InternalQuickBooksPlugin = BaseQuickBooksPlugin;

export function quickbooks(): InternalQuickBooksPlugin {
	return {
		id: 'quickbooks',
		schema: QuickBooksSchema,
		options: {},
		endpoints: {},
		webhooks: {},
		endpointMeta: quickBooksEndpointMeta,
	} satisfies InternalQuickBooksPlugin;
}
