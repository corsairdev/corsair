/**
 * Live checks against a real Ayrshare account.
 *
 * Skipped unless `AYRSHARE_API_KEY` is set. History on an unused account is
 * an HTTP 400 (code 221) rather than an empty array; an account with posts
 * returns a history payload instead. Both shapes are asserted. The write
 * covered here is an auto-schedule titled `CorsairVerify`, which is deleted
 * in `afterAll`.
 */
import { ApiError } from 'corsair/http';
import { makeAyrshareRequest } from './client';
import { deletePost, history, list, set } from './endpoints/handlers';
import { AyrshareEndpointOutputSchemas as Outputs } from './endpoints/types';
import { ayrshareErrorCode } from './error-handlers';

const apiKey = process.env.AYRSHARE_API_KEY;
const describeLive = apiKey ? describe : describe.skip;

const SCHEDULE_TITLE = 'CorsairVerify';

type Ctx = Parameters<typeof list>[0];

const upserts: { id: string; data: unknown }[] = [];
const evictions: string[] = [];

function makeStore() {
	return {
		upsertByEntityId: async (id: string, data: unknown) => {
			upserts.push({ id, data });
		},
		deleteByEntityId: async (id: string) => {
			evictions.push(id);
			return true;
		},
	};
}

function makeCtx(): Ctx {
	return {
		key: apiKey ?? '',
		options: {},
		db: {
			autoSchedules: makeStore(),
			posts: makeStore(),
		},
		database: undefined,
		$getAccountId: async () => 'integration-test',
	} as unknown as Ctx;
}

describeLive('Ayrshare live API', () => {
	beforeEach(() => {
		upserts.length = 0;
		evictions.length = 0;
	});

	afterAll(async () => {
		if (!apiKey) return;
		try {
			await makeAyrshareRequest('auto-schedule/delete', apiKey, {
				method: 'DELETE',
				body: { title: SCHEDULE_TITLE },
			});
		} catch {
			// Already gone, or never created.
		}
	});

	it('returns HTTP 400 code 221 when empty, or a schema-valid history', async () => {
		const outcome = await history(makeCtx(), {
			limit: 5,
			lastDays: 0,
		}).then(
			(value) => ({ ok: true as const, value }),
			(error: unknown) => ({ ok: false as const, error }),
		);

		if (outcome.ok) {
			expect(() => Outputs.getPostHistory.parse(outcome.value)).not.toThrow();
			return;
		}

		expect(outcome.error).toBeInstanceOf(ApiError);
		expect((outcome.error as ApiError).status).toBe(400);
		expect(ayrshareErrorCode(outcome.error as Error)).toBe(221);
	});

	it('sets, lists and caches an auto-schedule matching the declared schema', async () => {
		const ctx = makeCtx();
		const created = await set(ctx, {
			schedule: ['13:05Z', '20:14Z'],
			title: SCHEDULE_TITLE,
			daysOfWeek: [1, 3],
			excludeDates: ['2026-12-25'],
		});

		expect(() => Outputs.setAutoSchedule.parse(created)).not.toThrow();
		expect(created.status).toBe('success');
		expect(created.title).toBe(SCHEDULE_TITLE);
		expect(created.schedule).toEqual(['13:05Z', '20:14Z']);
		expect(upserts[0]?.id).toBe(SCHEDULE_TITLE);

		upserts.length = 0;
		const listed = await list(ctx, {});
		expect(() => Outputs.listAutoSchedules.parse(listed)).not.toThrow();
		expect(listed.status).toBe('success');
		expect(listed.schedules[SCHEDULE_TITLE]).toMatchObject({
			schedule: ['13:05Z', '20:14Z'],
			daysOfWeek: [1, 3],
			excludeDates: ['2026-12-25'],
		});
		expect(upserts[0]?.id).toBe(SCHEDULE_TITLE);
	});

	it('returns HTTP 404 code 114 for an unknown post id', async () => {
		const error = await deletePost(makeCtx(), {
			id: 'doesNotExistId000',
		}).catch((e) => e);

		expect(error).toBeInstanceOf(ApiError);
		expect((error as ApiError).status).toBe(404);
		expect(ayrshareErrorCode(error)).toBe(114);
		expect(evictions).toHaveLength(0);
	});
});
