import { ApiError } from 'corsair/http';
import { makeScaleAiRequest } from './client';
import { ScaleAiProject, ScaleAiTask, ScaleAiTeammate } from './schema';

const LIVE_ENABLED = process.env.SCALE_AI_LIVE === '1';
const LIVE_KEY = process.env.SCALE_API_KEY;
const describeIfLive = LIVE_ENABLED ? describe : describe.skip;
const describeIfKey = LIVE_ENABLED && LIVE_KEY ? describe : describe.skip;

describeIfLive('Scale AI live REST v1', () => {
	it('rejects an invalid API key on GET /v1/projects', async () => {
		const err = await makeScaleAiRequest('projects', 'invalid_scale_key').catch(
			(error: unknown) => error,
		);
		expect(err).toBeInstanceOf(ApiError);
		expect((err as ApiError).status).toBe(401);
	});
});

describeIfKey('Scale AI live REST v1 (authenticated)', () => {
	it('lists projects', async () => {
		const raw = await makeScaleAiRequest('projects', LIVE_KEY as string);
		const projects = ScaleAiProject.array().parse(raw);
		expect(Array.isArray(projects)).toBe(true);
	});

	it('lists teammates', async () => {
		const raw = await makeScaleAiRequest('teams', LIVE_KEY as string);
		const teammates = ScaleAiTeammate.array().parse(raw);
		expect(teammates.length).toBeGreaterThan(0);
		expect(teammates[0]?.email).toBeDefined();
	});

	it('lists tasks with official pagination', async () => {
		const raw = await makeScaleAiRequest<{ docs: unknown[] }>(
			'tasks',
			LIVE_KEY as string,
			{ query: { limit: 1 } },
		);
		expect(Array.isArray(raw.docs)).toBe(true);
		if (raw.docs[0] !== undefined) {
			expect(ScaleAiTask.parse(raw.docs[0]).task_id.length).toBeGreaterThan(0);
		}
	});
});
