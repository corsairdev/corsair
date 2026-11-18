import type { CorsairPluginContext } from 'corsair/core';
import type { Ip2whoisSchema } from './schema';

// Options stay off this type. Wiring them here pulls the endpoint tree back
// into the schema and TypeScript collapses `db` to an empty map.
export type Ip2whoisContext = CorsairPluginContext<typeof Ip2whoisSchema>;
