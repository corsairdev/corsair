import type { CorsairInternalConfig } from '../../core';
import { encryptDEK, generateDEK } from '../../core';
import { generateUUID } from '../../core/utils';

export async function ensureIntegrationAccountRow(
	database: NonNullable<CorsairInternalConfig['database']>,
	pluginId: string,
	tenantId: string,
	kek: string,
): Promise<void> {
	await database.db.transaction().execute(async (trx) => {
		// Lock the integration row before the check-then-insert so this
		// cannot interleave with a concurrent disconnect (or another connect).
		let integrationQuery = trx
			.selectFrom('corsair_integrations')
			.select(['id'])
			.where('name', '=', pluginId);
		if (database.isPg === true) integrationQuery = integrationQuery.forUpdate();
		const integrationRow = await integrationQuery.executeTakeFirst();

		if (!integrationRow) {
			throw new Error(
				`Integration '${pluginId}' not found. Run setupCorsair first.`,
			);
		}

		const existing = await trx
			.selectFrom('corsair_accounts')
			.select('id')
			.where('tenant_id', '=', tenantId)
			.where('integration_id', '=', integrationRow.id)
			.executeTakeFirst();
		if (existing) return;

		const dek = generateDEK();
		const encryptedDek = await encryptDEK(dek, kek);
		const now = new Date();
		await trx
			.insertInto('corsair_accounts')
			.values({
				id: generateUUID(),
				created_at: now,
				updated_at: now,
				tenant_id: tenantId,
				integration_id: integrationRow.id,
				config: {},
				dek: encryptedDek,
			})
			.execute();
	});
}
