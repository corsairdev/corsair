import { createCorsair } from 'corsair/core';
import { request } from 'corsair/http';
import { createCorsairOrm } from 'corsair/orm';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { supabase } from './index';

jest.mock('corsair/http', () => {
	const original = jest.requireActual('corsair/http');
	return {
		...original,
		request: jest.fn(),
	};
});

const mockRequest = request as jest.Mock;

describe('Supabase plugin integration', () => {
	beforeEach(() => {
		mockRequest.mockReset();
	});

	it('logs events and caches project entities', async () => {
		mockRequest.mockResolvedValue([
			{
				id: 'project-id',
				ref: 'abcdefghijklmnopqrst',
				name: 'Demo Project',
				region: 'us-east-1',
			},
		]);

		const testDb = createTestDatabase();
		await createIntegrationAndAccount(testDb.db, 'supabase');

		const corsair = createCorsair({
			plugins: [supabase({ key: 'test-token' })],
			database: testDb.db,
			kek: 'mock-kek-32-chars-long-mock-kek-3',
		});

		await corsair.supabase.api.projects.listAllProjects({});

		const project = await corsair.supabase.db.projects.findByEntityId(
			'abcdefghijklmnopqrst',
		);
		expect(project?.data.name).toBe('Demo Project');

		const orm = createCorsairOrm(testDb.database);
		const events = await orm.events.findMany({
			where: { event_type: 'supabase.projects.listAllProjects' },
		});
		expect(events.length).toBeGreaterThan(0);

		testDb.cleanup();
	});
});
