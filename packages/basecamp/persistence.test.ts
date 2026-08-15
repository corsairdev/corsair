import { evictBasecampResult, mirrorBasecampResult } from './endpoints/persist';

describe('Basecamp reference persistence', () => {
	it('mirrors stable reference collections by id', async () => {
		const upsertByEntityId = jest.fn().mockResolvedValue(undefined);
		await mirrorBasecampResult(
			{ projects: { upsertByEntityId } },
			'ListProjects',
			[{ id: 42, name: 'Test project' }],
		);
		expect(upsertByEntityId).toHaveBeenCalledWith('42', {
			id: 42,
			name: 'Test project',
		});
	});

	it('mirrors individual people but ignores transactional content', async () => {
		const upsertByEntityId = jest.fn().mockResolvedValue(undefined);
		await mirrorBasecampResult({ people: { upsertByEntityId } }, 'GetPerson', {
			id: 7,
			name: 'Example Person',
		});
		await mirrorBasecampResult({ people: { upsertByEntityId } }, 'GetMessage', {
			id: 99,
			subject: 'Private',
		});
		expect(upsertByEntityId).toHaveBeenCalledTimes(1);
	});

	it('evicts references after destructive operations', async () => {
		const deleteByEntityId = jest.fn().mockResolvedValue(undefined);
		await evictBasecampResult(
			{ projects: { upsertByEntityId: jest.fn(), deleteByEntityId } },
			'TrashProject',
			{ projectId: 42 },
		);
		expect(deleteByEntityId).toHaveBeenCalledWith('42');
	});
});
