import type { CorsairPluginContext } from 'corsair/core';
import type { Ip2proxySchema } from './schema';

// Options stay off this type. Wiring them here pulls the endpoint tree back
// into the schema and TypeScript collapses `db` to an empty map.
export type Ip2proxyContext = CorsairPluginContext<typeof Ip2proxySchema>;
