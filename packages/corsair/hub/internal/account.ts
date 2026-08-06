import type { CorsairInternalConfig } from '../../core';
import { encryptDEK, generateDEK } from '../../core';
import { createCorsairOrm } from '../../db/orm';

export async function ensureIntegrationAccountRow(
	database: NonNullable<CorsairInternalConfig['database']>,
	pluginId: string,
	tenantId: string,
	kek: string,
): Promise<void> {
	const orm = createCorsairOrm(database);

	const integration = await orm.integrations.findByName(pluginId);
	if (!integration) {
		throw new Error(
			`Integration '${pluginId}' not found. Run setupCorsair first.`,
		);
	}

	const existing = await orm.accounts.findOne({
		tenant_id: tenantId,
		integration_id: integration.id,
	});
	if (existing) return;

	const dek = generateDEK();
	const encryptedDek = await encryptDEK(dek, kek);
	await orm.accounts.create({
		tenant_id: tenantId,
		integration_id: integration.id,
		config: {},
		dek: encryptedDek,
	});
}
