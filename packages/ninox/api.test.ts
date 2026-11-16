import { createCorsair } from 'corsair/core';
import { NinoxEndpointOutputSchemas as Outputs } from './endpoints/types';
import { ninox } from './index';

/**
 * Live smoke test. Read-only: nothing here creates, updates, deletes or upserts
 * a record.
 *
 * Every answer goes through its output schema before an assertion touches it.
 * Skipped unless NINOX_API_KEY and NINOX_WORKSPACE_ID are both set, and each
 * missing variable is logged so a skip cannot read as a pass.
 */
const apiKey = process.env.NINOX_API_KEY;
const workspaceId = process.env.NINOX_WORKSPACE_ID;
const describeIfKey = apiKey && workspaceId ? describe : describe.skip;

if (!apiKey) console.warn('NINOX_API_KEY is not set: live tests skipped');
if (!workspaceId) {
	console.warn('NINOX_WORKSPACE_ID is not set: live tests skipped');
}

describeIfKey('Ninox live API', () => {
	// The gate above guarantees both are set.
	const workspace = workspaceId as string;
	const corsair = createCorsair({ plugins: [ninox({ key: apiKey })] });

	it('reads the workspace through the output schema', async () => {
		const parsed = Outputs.workspaceGet.parse(
			await corsair.ninox.api.workspace.get({ workspaceId: workspace }),
		);

		expect(Array.isArray(parsed.modules)).toBe(true);
		for (const module of parsed.modules) {
			expect(typeof module.name).toBe('string');
		}
	}, 30_000);

	it('lists modules through the output schema', async () => {
		const parsed = Outputs.modulesList.parse(
			await corsair.ninox.api.modules.list({
				workspaceId: workspace,
				limit: 10,
			}),
		);

		expect(Array.isArray(parsed.modules)).toBe(true);
	}, 30_000);

	it('lists tables and fields for the first module when one exists', async () => {
		const { modules } = Outputs.modulesList.parse(
			await corsair.ninox.api.modules.list({
				workspaceId: workspace,
				limit: 1,
			}),
		);
		const moduleName = modules[0]?.name;
		// A workspace with no modules has nothing further to read.
		if (!moduleName) return;

		const tablesPage = Outputs.tablesList.parse(
			await corsair.ninox.api.tables.list({
				workspaceId: workspace,
				moduleName,
			}),
		);
		expect(Array.isArray(tablesPage.tables)).toBe(true);

		const tableName = tablesPage.tables[0]?.name;
		if (!tableName) return;

		const fieldsPage = Outputs.fieldsList.parse(
			await corsair.ninox.api.fields.list({
				workspaceId: workspace,
				moduleName,
				tableName,
			}),
		);
		expect(Array.isArray(fieldsPage.fields)).toBe(true);
		for (const field of fieldsPage.fields) {
			// Every field has a name and a type, which a write depends on.
			expect(typeof field.name).toBe('string');
			expect(typeof field.type).toBe('string');
		}
	}, 30_000);

	it('reads records from the first table when one exists', async () => {
		const { modules } = Outputs.modulesList.parse(
			await corsair.ninox.api.modules.list({
				workspaceId: workspace,
				limit: 1,
			}),
		);
		const moduleName = modules[0]?.name;
		if (!moduleName) return;

		const tablesPage = Outputs.tablesList.parse(
			await corsair.ninox.api.tables.list({
				workspaceId: workspace,
				moduleName,
			}),
		);
		const tableName = tablesPage.tables[0]?.name;
		if (!tableName) return;

		const parsed = Outputs.recordsList.parse(
			await corsair.ninox.api.records.list({
				workspaceId: workspace,
				moduleName,
				tableName,
				limit: 1,
			}),
		);
		expect(Array.isArray(parsed.rows)).toBe(true);
		for (const row of parsed.rows) {
			// A row is an id plus values keyed by field name.
			expect(typeof row.id).toBe('string');
		}
	}, 30_000);
});
