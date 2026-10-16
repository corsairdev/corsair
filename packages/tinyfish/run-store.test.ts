import { persistRun } from './run-store';

// The real entity client replaces the whole data blob on upsert, so the
// fake does too; a merging fake would hide lost-field regressions.
function createStore() {
	const rows = new Map<string, Record<string, unknown>>();
	return {
		rows,
		client: {
			findByEntityId: jest.fn(async (entityId: string) =>
				rows.has(entityId) ? { data: rows.get(entityId) } : null,
			),
			upsertByEntityId: jest.fn(
				async (entityId: string, data: Record<string, unknown>) => {
					rows.set(entityId, { ...data });
					return { data };
				},
			),
		},
	};
}

function createContext(client: unknown, database: unknown): never {
	return { database, db: { agentRuns: client } } as never;
}

describe('tinyfish run store', () => {
	it('skips persistence when no database is configured', async () => {
		const { client } = createStore();
		client.upsertByEntityId.mockRejectedValue(
			new Error('Database not configured'),
		);

		await expect(
			persistRun(createContext(client, undefined), {
				run_id: 'run-1',
				status: 'COMPLETED',
			}),
		).resolves.toBeUndefined();
		expect(client.upsertByEntityId).not.toHaveBeenCalled();
	});

	it('keeps polled fields that a webhook snapshot omits', async () => {
		const { rows, client } = createStore();
		const ctx = createContext(client, {});

		await persistRun(ctx, {
			run_id: 'run-1',
			status: 'RUNNING',
			goal: 'Get the title',
			profile_id: 'p-1',
		});
		await persistRun(ctx, {
			run_id: 'run-1',
			status: 'COMPLETED',
			finished_at: '2026-01-02T00:00:09.000Z',
		});

		expect(rows.get('run-1')).toMatchObject({
			status: 'COMPLETED',
			goal: 'Get the title',
			profileId: 'p-1',
			finishedAt: new Date('2026-01-02T00:00:09.000Z'),
		});
	});

	it('never rewinds a terminal run to a non-terminal status', async () => {
		const { rows, client } = createStore();
		const ctx = createContext(client, {});

		await persistRun(ctx, {
			run_id: 'run-1',
			status: 'COMPLETED',
			result: { title: 'Example' },
		});

		for (const staleStatus of ['RUNNING', 'PENDING']) {
			await persistRun(ctx, { run_id: 'run-1', status: staleStatus });
			expect(rows.get('run-1')).toMatchObject({
				status: 'COMPLETED',
				result: { title: 'Example' },
			});
		}
		expect(client.upsertByEntityId).toHaveBeenCalledTimes(1);
	});
});
