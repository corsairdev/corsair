import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { canva } from './index';

async function createCanvaClient() {
	const accessToken = process.env.CANVA_ACCESS_TOKEN;
	const kek = process.env.CORSAIR_KEK;
	if (!accessToken || !kek) {
		return null;
	}

	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'canva', 'default');

	const corsair = createCorsair({
		plugins: [canva({})],
		database: testDb.db,
		kek,
	});

	await corsair.canva.keys.issue_new_dek();
	await corsair.canva.keys.set_access_token(accessToken);

	return { corsair, testDb };
}

describe('Canva plugin integration', () => {
	it('hits live API when credentials exist', async () => {
		const setup = await createCanvaClient();
		if (!setup) {
			return;
		}

		const { corsair, testDb } = setup;
		try {
			const me = await corsair.canva.api.users.getMe({});
			expect(me.team_user.user_id).toBeTruthy();
			expect(me.team_user.team_id).toBeTruthy();

			const designs = await corsair.canva.api.designs.list({ limit: 1 });
			expect(Array.isArray(designs.items)).toBe(true);

			const designId = process.env.CANVA_TEST_DESIGN_ID ?? designs.items[0]?.id;
			if (designId) {
				const design = await corsair.canva.api.designs.get({ designId });
				expect(design.design.id).toBe(designId);

				const cached = await corsair.canva.db.designs.findByEntityId(designId);
				expect(cached).not.toBeNull();
				expect(cached?.data.id).toBe(designId);

				const formats = await corsair.canva.api.designs.getExportFormats({
					designId,
				});
				expect(formats.formats).toBeDefined();
			}
		} finally {
			await testDb.cleanup?.();
		}
	});
});
