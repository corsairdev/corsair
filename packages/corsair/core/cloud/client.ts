import type { CorsairClient } from '../client';
import type { CorsairPlugin } from '../plugins';
import type { CloudTransport } from './http';
import { cloudRequest } from './http';
import { CLOUD_ROUTES } from './routes';

const DEFERRED = new Set(['db', 'keys', 'webhooks']);
const TOP_LEVEL_DEFERRED = new Set(['chats', 'workflows']);
const THENABLE_KEYS = new Set(['then', 'catch', 'finally']);

function buildInvokeProxy(
	transport: CloudTransport,
	tenantId: string,
	pluginId: string,
	path: string[],
): unknown {
	const invoke = (...args: unknown[]) =>
		cloudRequest(
			transport,
			'POST',
			CLOUD_ROUTES.invoke
				.replace(':tenant', encodeURIComponent(tenantId))
				.replace(':plugin', encodeURIComponent(pluginId))
				.replace(':op', path.map(encodeURIComponent).join('.')),
			{ args: args[0] },
		).then((res: any) => res.data);

	return new Proxy(invoke, {
		get(_target, prop) {
			if (typeof prop !== 'string' || THENABLE_KEYS.has(prop)) {
				return undefined;
			}
			return buildInvokeProxy(transport, tenantId, pluginId, [...path, prop]);
		},
	});
}

// `plugins` typed the client and guarded unknown ids. In cloud mode both are
// optional: pass them (createCorsair auto-detect) to keep the typed client, or
// omit them (createCorsairCloud) for a dynamic client whose plugin set lives on
// the VM — the runtime returns 404 unknown_plugin for a bad id.
export function buildCloudClient<Plugins extends readonly CorsairPlugin[]>(
	plugins: Plugins | undefined,
	opts: { transport: CloudTransport; tenantId: string },
): CorsairClient<Plugins> {
	const pluginIds = plugins ? new Set(plugins.map((p) => p.id)) : null;

	return new Proxy(
		{},
		{
			get(_target, pluginId) {
				if (typeof pluginId !== 'string' || THENABLE_KEYS.has(pluginId)) {
					return undefined;
				}
				if (TOP_LEVEL_DEFERRED.has(pluginId)) {
					throw new Error(
						`"${pluginId}" is not available in cloud mode (deferred)`,
					);
				}
				if (pluginIds && !pluginIds.has(pluginId)) {
					throw new Error(`Unknown plugin "${pluginId}"`);
				}
				return new Proxy(
					{},
					{
						get(_pluginTarget, key) {
							if (key === 'api') {
								return buildInvokeProxy(
									opts.transport,
									opts.tenantId,
									pluginId,
									[],
								);
							}
							if (typeof key === 'string' && DEFERRED.has(key)) {
								throw new Error(
									`"${key}" is not available in cloud mode (deferred)`,
								);
							}
							return undefined;
						},
					},
				);
			},
		},
	) as CorsairClient<Plugins>;
}
