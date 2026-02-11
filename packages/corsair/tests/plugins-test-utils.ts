import type { Kysely } from 'kysely';
import type { CorsairKyselyDatabase } from '../db/kysely/database';

export function createIntegrationAndAccount(
	db: Kysely<CorsairKyselyDatabase>,
	pluginId: string,
	tenantId = 'default',
) {
	const now = new Date();
	const integrationId = `${pluginId}-integration`;
	const accountId = `${pluginId}-account`;

	return db
		.insertInto('corsair_integrations')
		.values({
			id: integrationId,
			created_at: now,
			updated_at: now,
			name: pluginId,
			config: {} as any,
			dek: undefined,
		} as any)
		.execute()
		.then(() =>
			db.insertInto('corsair_accounts').values({
				id: accountId,
				created_at: now,
				updated_at: now,
				tenant_id: tenantId,
				integration_id: integrationId,
				config: {} as any,
				dek: undefined,
			} as any).execute(),
		);
}
