import type { CorsairPluginContext } from 'corsair/core';
import type { BugherdSchema } from './schema';

// Options stay off this type. Wiring them here pulls the endpoint tree back
// into the schema and TypeScript collapses `db` to an empty map.
export type BugherdContext = CorsairPluginContext<typeof BugherdSchema>;
