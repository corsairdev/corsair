import { z } from 'zod';

// ClickHouse doesn't expose a stable "entity" surface — every query result
// is a dynamic record set. The schema only declares a single catch-all
// entity so the plugin participates in the standard entity-typing flow.
export const ClickhouseQueryResult = z
	.object({})
	.loose()
	.describe('Generic ClickHouse query result row');
export type ClickhouseQueryResult = z.infer<typeof ClickhouseQueryResult>;
