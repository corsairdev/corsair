import type { RequiredPluginEndpointMeta } from 'corsair/core';
import { AssetsEndpoints } from './assets';
import { CollectionFieldsEndpoints } from './collection-fields';
import { CollectionItemsEndpoints } from './collection-items';
import { CollectionsEndpoints } from './collections';
import { CommentsEndpoints } from './comments';
import { ComponentsEndpoints } from './components';
import { EcommerceEndpoints } from './ecommerce';
import { FormsEndpoints } from './forms';
import type { WebflowOperation } from './operations';
import { webflowOperations } from './operations';
import { PagesEndpoints } from './pages';
import { SitesEndpoints } from './sites';
import { TokenEndpoints } from './token';
import {
	WebflowEndpointInputSchemas,
	WebflowEndpointOutputSchemas,
} from './types';
import { WebhooksEndpoints } from './webhooks';

export const webflowEndpointsNested = {
	assets: AssetsEndpoints,
	collectionFields: CollectionFieldsEndpoints,
	collectionItems: CollectionItemsEndpoints,
	collections: CollectionsEndpoints,
	comments: CommentsEndpoints,
	components: ComponentsEndpoints,
	ecommerce: EcommerceEndpoints,
	forms: FormsEndpoints,
	pages: PagesEndpoints,
	sites: SitesEndpoints,
	token: TokenEndpoints,
	webhooks: WebhooksEndpoints,
} as const;

// Object.fromEntries widens keys to string; assert to the meta map keyed
// by nested endpoint paths, which the entries mirror 1:1 (every operation
// in webflowOperations has a matching handler, verified by api.test.ts)
export const webflowEndpointMeta = Object.fromEntries(
	webflowOperations.map((operation: WebflowOperation) => [
		`${operation.group}.${operation.name}`,
		{
			riskLevel: operation.riskLevel,
			irreversible: operation.irreversible,
			description: operation.description,
		},
	]),
) as RequiredPluginEndpointMeta<typeof webflowEndpointsNested>;

export const webflowEndpointSchemas = Object.fromEntries(
	webflowOperations.map((operation: WebflowOperation) => [
		`${operation.group}.${operation.name}`,
		{
			input: WebflowEndpointInputSchemas[operation.key],
			output: WebflowEndpointOutputSchemas[operation.key],
		},
	]),
);

export { WebflowEndpointInputSchemas, WebflowEndpointOutputSchemas };

export * from './operations';
export * from './types';
