import { issueUpdate } from './issues';

jest.mock('./types', () => ({
	...jest.requireActual('./types'),
	verifyLinearWebhookSignature: () => ({ valid: true }),
}));

const prevAssignee = { id: 'u1', name: 'Ada', email: 'ada@x.dev' };
const upsert = jest.fn().mockResolvedValue({ id: 'e1' });
const find = jest.fn();
const ctx = {
	key: 'k',
	db: { issues: { upsertByEntityId: upsert, findByEntityId: find } },
} as never;

const event = (data: object) => ({
	payload: {
		type: 'Issue',
		action: 'update',
		url: 'u',
		data: {
			id: 'i1',
			identifier: 'ENG-1',
			title: 'T',
			createdAt: '2026-01-01T00:00:00.000Z',
			updatedAt: '2026-01-02T00:00:00.000Z',
			stateId: 's1',
			state: { id: 's1', name: 'Done', type: 'completed', color: 'x' },
			...data,
		},
	},
});

const run = (data: object) => issueUpdate.handler(ctx, event(data) as never);
const written = () => upsert.mock.calls[0]?.[1];

beforeEach(() => {
	upsert.mockClear();
	find.mockReset();
	find.mockResolvedValue({ data: { assignee: prevAssignee } });
});

describe('linear issue webhook keeps stored assignee', () => {
	it('keeps the stored assignee while the assignee is unchanged', async () => {
		await run({ assigneeId: 'u1' });
		expect(written().assignee).toEqual(prevAssignee);
		expect(written().state).toEqual(
			expect.objectContaining({ type: 'completed' }),
		);
	});

	it('drops it when the issue is reassigned or unassigned', async () => {
		await run({ assigneeId: 'u9' });
		expect(written().assignee).toBeNull();
		upsert.mockClear();
		await run({ assigneeId: null });
		expect(written().assignee).toBeNull();
	});

	it('prefers an assignee carried by the payload', async () => {
		const assignee = { id: 'u9', name: 'Bo', email: 'bo@x.dev' };
		await run({ assigneeId: 'u9', assignee });
		expect(written().assignee).toEqual(assignee);
	});
});
