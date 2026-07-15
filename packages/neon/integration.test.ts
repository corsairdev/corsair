import { createCorsair } from 'corsair/core';
import { request } from 'corsair/http';
import { createCorsairOrm } from 'corsair/orm';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { neon } from './index';

jest.mock('corsair/http', () => {
	const original = jest.requireActual('corsair/http');
	return {
		...original,
		request: jest.fn(),
	};
});

const mockRequest = request as jest.Mock;

describe('Neon plugin integration', () => {
	beforeEach(() => {
		mockRequest.mockReset();
	});

	it('logs events and caches project entities', async () => {
		mockRequest.mockResolvedValue({
			projects: [
				{
					id: 'summer-sound-12345678',
					name: 'Demo Project',
					region_id: 'aws-us-east-2',
					pg_version: 17,
				},
			],
		});

		const testDb = createTestDatabase();
		await createIntegrationAndAccount(testDb.db, 'neon');

		const corsair = createCorsair({
			plugins: [neon({ key: 'test-token' })],
			database: testDb.db,
			kek: 'mock-kek-32-chars-long-mock-kek-3',
		});

		await corsair.neon.api.projects.listProjects({});

		const project = await corsair.neon.db.projects.findByEntityId(
			'summer-sound-12345678',
		);
		expect(project?.data.name).toBe('Demo Project');

		const orm = createCorsairOrm(testDb.database);
		const events = await orm.events.findMany({
			where: { event_type: 'neon.projects.listProjects' },
		});
		expect(events.length).toBeGreaterThan(0);

		testDb.cleanup();
	});
});
