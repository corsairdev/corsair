/**
 * `@corsair-dev/mastra` — a Mastra `ToolProvider` that exposes Corsair's 200+
 * integrations to Mastra agents, backed by managed OAuth and with credentials
 * that stay in your own database.
 *
 * @packageDocumentation
 */

export type {
	CorsairToolProviderConfig,
	TenantResolveInput,
} from './corsair-tool-provider.js';
export {
	CorsairToolProvider,
	decodeConnectionId,
	encodeConnectionId,
	mapAuthStatus,
	parseOperationPaths,
} from './corsair-tool-provider.js';
