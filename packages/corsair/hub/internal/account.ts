import type { CorsairInternalConfig } from '../../core';
import { upsertAccount } from '../../core/account-lookup';

export async function ensureIntegrationAccountRow(
	database: NonNullable<CorsairInternalConfig['database']>,
	pluginId: string,
	tenantId: string,
	kek: string,
	allowMany: boolean,
): Promise<void> {
	await upsertAccount({
		database,
		kek,
		integrationName: pluginId,
		tenantId,
		allowMany,
	});
}
