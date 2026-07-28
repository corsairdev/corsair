import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { canva } from './index';

const hasLiveCredentials = Boolean(
	process.env.CANVA_ACCESS_TOKEN && process.env.CORSAIR_KEK,
);

async function createCanvaClient() {
	const accessToken = process.env.CANVA_ACCESS_TOKEN;
	const kek = process.env.CORSAIR_KEK;
	if (!accessToken || !kek) {
		throw new Error('CANVA_ACCESS_TOKEN and CORSAIR_KEK are required');
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
	const liveIt = hasLiveCredentials ? it : it.skip;

	liveIt('hits live API when credentials exist', async () => {
		const { corsair, testDb } = await createCanvaClient();
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
