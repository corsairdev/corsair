import { ApiError } from 'corsair/http';
import { list as listMeetings, listTypes } from './endpoints/meetings';
import { getSummary } from './endpoints/recordings';
import { list as listTeams } from './endpoints/teams';
import {
	MeetingSchema,
	MeetingTypeSchema,
	TeamSchema,
} from './endpoints/types';
import { FathomAiSchema } from './schema';

jest.mock('corsair/core', () => ({
	logEventFromContext: jest.fn().mockResolvedValue(undefined),
}));

// Live suite against api.fathom.ai. CI skips api.test.ts by path; run it with:
//   FATHOM_API_KEY=… pnpm --filter @corsair-dev/fathomai test api.test.ts
const KEY = process.env.FATHOM_API_KEY;
const suite = KEY ? describe : describe.skip;
if (!KEY)
	console.warn('FATHOM_API_KEY not set, skipping the Fathom live suite');

type Ctx = Parameters<typeof listMeetings>[0];

const stored: Array<[string, string]> = [];

function ctxWithKey(key: string | undefined) {
	// Safe (`as unknown as Ctx`): the endpoints read only `key` and the `db` entities; the runtime builds the rest from a live database.
	return {
		key,
		db: Object.fromEntries(
			Object.keys(FathomAiSchema.entities).map((name) => [
				name,
				{
					upsertByEntityId: async (id: string) => {
						stored.push([name, id]);
						return null;
					},
				},
			]),
		),
	} as unknown as Ctx;
}

const ctx = ctxWithKey(KEY);

jest.setTimeout(60_000);

suite('Fathom AI live API', () => {
	beforeEach(() => {
		stored.length = 0;
	});

	it('lists teams in the documented shape', async () => {
		const page = await listTeams(ctx, {});

		for (const team of page.items) TeamSchema.parse(team);
		expect(stored).toEqual(page.items.map((t) => ['teams', t.name]));
	});

	it('lists meeting types in the documented shape', async () => {
		const page = await listTypes(ctx, {});

		for (const type of page.items) MeetingTypeSchema.parse(type);
	});

	it('lists meetings with action items and reads a summary', async () => {
		const page = await listMeetings(ctx, { include_action_items: true });

		for (const meeting of page.items) MeetingSchema.parse(meeting);
		expect(stored).toEqual(
			page.items.map((m) => ['meetings', String(m.recording_id)]),
		);

		const first = page.items[0];
		if (!first) return;
		const summary = await getSummary(ctx, { recording_id: first.recording_id });
		expect(summary).toHaveProperty('summary');
	});

	it('rejects a bad key with 401', async () => {
		const error = await listTeams(ctxWithKey('invalid-key'), {}).catch(
			// `unknown`: a rejection value is untyped until the assertion narrows it.
			(e: unknown) => e,
		);

		expect(error).toBeInstanceOf(ApiError);
		expect((error as ApiError).status).toBe(401);
	});
});
