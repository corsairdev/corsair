/**
 * Live smoke tests against the real Leiga API. CI skips this file
 * (`api.test.ts`), and so does the PR gate; run it with
 * `pnpm --filter @corsair-dev/leiga test:live`.
 *
 * Read-only: it never creates, updates or deletes anything.
 *
 * Leiga reports failures as HTTP 200 with a non-zero `code`, so a schema that
 * disagrees with the provider parses as a thrown `LeigaAPIError` rather than a
 * failed assertion. These tests are what prove each operation's schema against
 * real data.
 */
import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { leiga } from './index';

const CLIENT_ID = process.env.LEIGA_CLIENT_ID;
const CLIENT_SECRET = process.env.LEIGA_CLIENT_SECRET;
const PROJECT_ID = process.env.LEIGA_PROJECT_ID;
const describeIfKey =
	CLIENT_ID && CLIENT_SECRET && PROJECT_ID ? describe : describe.skip;

const KEK = process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef';

async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'leiga', 'default');
	const corsair = createCorsair({
		plugins: [leiga({ key: process.env.LEIGA_ACCESS_TOKEN })],
		database: testDb.db,
		kek: KEK,
	});
	// Without a ready token the plugin mints one, which needs the pair on the
	// account. The describe block only runs when both halves are set.
	if (!process.env.LEIGA_ACCESS_TOKEN && CLIENT_ID && CLIENT_SECRET) {
		await corsair.leiga.keys.issue_new_dek();
		await corsair.leiga.keys.set_client_id(CLIENT_ID);
		await corsair.leiga.keys.set_api_key(CLIENT_SECRET);
	}
	return { corsair, testDb };
}

const projectId = () => Number(PROJECT_ID);

describeIfKey('Leiga live smoke', () => {
	it('lists projects', async () => {
		const { corsair, testDb } = await createClient();
		try {
			const result = await corsair.leiga.api.projects.list({});

			expect(Array.isArray(result.projects)).toBe(true);
			expect(result.projects.length).toBeGreaterThan(0);
			const first = result.projects[0]!;
			expect(typeof first.id).toBe('number');
			expect(typeof first.pname).toBe('string');
			expect(typeof first.pkey).toBe('string');
		} finally {
			testDb.cleanup();
		}
	});

	it('reads one project by id and by key', async () => {
		const { corsair, testDb } = await createClient();
		try {
			const byId = await corsair.leiga.api.projects.get({
				projectId: projectId(),
			});
			expect(byId.id).toBe(projectId());
			expect(typeof byId.projectName).toBe('string');
			// Leiga sends epoch milliseconds, not an ISO string.
			expect(typeof byId.createTime).toBe('number');

			const byKey = await corsair.leiga.api.projects.getByKey({
				projectKey: byId.projectKey,
			});
			expect(byKey.id).toBe(byId.id);
		} finally {
			testDb.cleanup();
		}
	});

	it('lists project templates', async () => {
		const { corsair, testDb } = await createClient();
		try {
			const result = await corsair.leiga.api.projects.templates({});

			expect(result.templates.length).toBeGreaterThan(0);
			expect(typeof result.templates[0]!.code).toBe('string');
		} finally {
			testDb.cleanup();
		}
	});

	it('queries the issues in a project', async () => {
		const { corsair, testDb } = await createClient();
		try {
			const result = await corsair.leiga.api.issues.list({
				projectId: projectId(),
				pageSize: 5,
			});

			expect(typeof result.total).toBe('number');
			expect(Array.isArray(result.issues)).toBe(true);
			if (result.issues.length > 0) {
				const issue = result.issues[0]!;
				expect(typeof issue.id).toBe('number');
				expect(typeof issue.summary).toBe('string');
			}
		} finally {
			testDb.cleanup();
		}
	});

	it('reads one issue by id and by number, flattening the double wrap', async () => {
		const { corsair, testDb } = await createClient();
		try {
			const page = await corsair.leiga.api.issues.list({
				projectId: projectId(),
				pageSize: 1,
			});
			const listed = page.issues[0]!;

			const detail = await corsair.leiga.api.issues.get({
				issueId: listed.id,
			});
			// The flattened object carries the inner `id`, not the outer envelope.
			expect(detail.id).toBe(listed.id);
			expect(typeof detail.issueNumber).toBe('string');

			const byNumber = await corsair.leiga.api.issues.getByNumber({
				issueNumber: detail.issueNumber!,
			});
			expect(byNumber.id).toBe(listed.id);
		} finally {
			testDb.cleanup();
		}
	});

	it('lists issue types and their fields', async () => {
		const { corsair, testDb } = await createClient();
		try {
			const types = await corsair.leiga.api.issues.types({
				projectId: projectId(),
			});
			expect(types.issueTypes.length).toBeGreaterThan(0);
			const type = types.issueTypes[0]!;
			expect(typeof type.code).toBe('string');

			const fields = await corsair.leiga.api.issues.fields({
				projectId: projectId(),
				issueTypeId: type.id,
			});
			expect(fields.fields.length).toBeGreaterThan(0);
			expect(typeof fields.fields[0]!.fieldCode).toBe('string');
		} finally {
			testDb.cleanup();
		}
	});

	it('lists sprints and reads one back', async () => {
		const { corsair, testDb } = await createClient();
		try {
			const result = await corsair.leiga.api.sprints.list({
				projectId: projectId(),
			});
			expect(Array.isArray(result.sprints)).toBe(true);
			if (result.sprints.length === 0) return;

			const sprint = result.sprints[0]!;
			expect(typeof sprint.id).toBe('number');
			// `sprint/get` takes `id`, not `sprintId`.
			const detail = await corsair.leiga.api.sprints.get({
				sprintId: sprint.id,
			});
			expect(detail.id).toBe(sprint.id);
		} finally {
			testDb.cleanup();
		}
	});

	it('lists workflows and the transitions from a state', async () => {
		const { corsair, testDb } = await createClient();
		try {
			const result = await corsair.leiga.api.workflows.list({
				projectId: projectId(),
			});
			expect(result.workflows.length).toBeGreaterThan(0);
			const workflow = result.workflows[0]!;
			expect(typeof workflow.workflowName).toBe('string');
			const state = workflow.states?.[0];
			if (!state) return;

			// Needs projectId, stateId and defId; two of the three answer
			// `{"code":"100"}` on HTTP 200.
			const next = await corsair.leiga.api.workflows.nextStates({
				projectId: projectId(),
				stateId: state.stateId,
				defId: workflow.id,
			});
			expect(Array.isArray(next.states)).toBe(true);
			expect(next.states.length).toBeGreaterThan(0);
		} finally {
			testDb.cleanup();
		}
	});

	it('lists tags and project members', async () => {
		const { corsair, testDb } = await createClient();
		try {
			// A new project answers `[]` here, so only the shape is asserted.
			const tags = await corsair.leiga.api.tags.list({
				projectId: projectId(),
			});
			expect(Array.isArray(tags.tags)).toBe(true);

			const members = await corsair.leiga.api.members.list({
				projectId: projectId(),
			});
			expect(members.members.length).toBeGreaterThan(0);
			expect(typeof members.members[0]!.userId).toBe('number');
		} finally {
			testDb.cleanup();
		}
	});
});
