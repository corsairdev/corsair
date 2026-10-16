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
});
