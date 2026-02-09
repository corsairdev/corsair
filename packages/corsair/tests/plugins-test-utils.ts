export function createIntegrationAndAccount(
	db: { insertInto: (...args: any[]) => any },
	pluginId: string,
	tenantId = 'default',
) {
	const now = Date.now();
	const integrationId = `${pluginId}-integration`;
	const accountId = `${pluginId}-account`;

	return db
		.insertInto('corsair_integrations')
		.values({
			id: integrationId,
			created_at: now,
			updated_at: now,
			name: pluginId,
			config: JSON.stringify({}),
		})
		.execute()
		.then(() =>
			db
				.insertInto('corsair_accounts')
				.values({
					id: accountId,
					created_at: now,
					updated_at: now,
					tenant_id: tenantId,
					integration_id: integrationId,
					config: JSON.stringify({}),
				})
				.execute(),
		);
}
