import type { CorsairDatabase } from '../db/kysely/database';

export type AccountLookupInput = {
	database: CorsairDatabase;
	integrationName: string;
	tenantId: string;
	ensureProvisioned?: () => Promise<void>;
};

export type IntegrationAccountRow = {
	id: string;
	config: unknown;
	dek: string | null;
};

export type IntegrationAccountLookupResult = {
	integrationId: string;
	accountId: string;
	integration: IntegrationAccountRow;
	account: IntegrationAccountRow;
};

export async function resolveIntegrationAndAccount(
	input: AccountLookupInput,
): Promise<IntegrationAccountLookupResult> {
	let provisionAttempted = false;

	while (true) {
		const integration = await input.database.db
			.selectFrom('corsair_integrations')
			.selectAll()
			.where('name', '=', input.integrationName)
			.executeTakeFirst();

		if (!integration) {
			if (!provisionAttempted && input.ensureProvisioned) {
				provisionAttempted = true;
				await input.ensureProvisioned();
				continue;
			}

			throw new Error(
				`Integration "${input.integrationName}" not found. Make sure to create the integration first.`,
			);
		}

		const account = await input.database.db
			.selectFrom('corsair_accounts')
			.selectAll()
			.where('tenant_id', '=', input.tenantId)
			.where('integration_id', '=', integration.id)
			.executeTakeFirst();

		if (!account) {
			if (!provisionAttempted && input.ensureProvisioned) {
				provisionAttempted = true;
				await input.ensureProvisioned();
				continue;
			}

			throw new Error(
				`Account not found for tenant "${input.tenantId}" and integration "${input.integrationName}". Make sure to create the account first.`,
			);
		}

		return {
			integrationId: integration.id,
			accountId: account.id,
			integration: {
				id: integration.id,
				config: integration.config,
				dek: integration.dek ?? null,
			},
			account: {
				id: account.id,
				config: account.config,
				dek: account.dek ?? null,
			},
		};
	}
}

export async function resolveIntegrationAccountIds(
	input: AccountLookupInput,
): Promise<{ integrationId: string; accountId: string }> {
	const { integrationId, accountId } =
		await resolveIntegrationAndAccount(input);

	return { integrationId, accountId };
}
