import { MiroAPIError } from './client';
import { boardsGet, boardsList, itemsList, tagsList } from './endpoints';
import type { MiroContext } from './index';

/**
 * Live smoke tests against the real API. Gated on `MIRO_API_KEY`.
 *
 * These call the endpoint functions, so the response mapping and every output
 * schema run against a real payload. Every call is read-only: board and tag
 * lists, and a board read when `MIRO_TEST_BOARD_ID` is set. Nothing is created,
 * changed or deleted, because that would alter someone's boards.
 *
 * CI ignores this file by name (`api.test.ts`), so it only runs through
 * `pnpm --filter @corsair-dev/miro test:live`.
 */
const API_KEY = process.env.MIRO_API_KEY;
const BOARD_ID = process.env.MIRO_TEST_BOARD_ID;

const describeIfKey = API_KEY ? describe : describe.skip;

if (!API_KEY) {
	// Say so out loud: a skipped run must not read as a green one.
	console.warn(
		'MIRO_API_KEY is not set, so the Miro live smoke tests are skipped. Create a token at miro.com/app/settings, Your apps, and export it to run them.',
	);
}

// Safe: the endpoints read only ctx.key and log through ctx.
const ctx = { key: API_KEY, database: undefined } as unknown as MiroContext; // unknown: only ctx.key is read.

describeIfKey('Miro live API', () => {
	it('lists boards through the endpoint and its output schema', async () => {
		const result = await boardsList(ctx, { limit: 5 });

		expect(Array.isArray(result.boards)).toBe(true);
		expect(result.boards.length).toBeLessThanOrEqual(5);
	});

	it('answers 401 with its own envelope for a bad token', async () => {
		const badCtx = { key: 'definitely-not-a-token' } as unknown as MiroContext; // unknown: as above.

		const failure = await boardsList(badCtx, { limit: 1 }).catch(
			// unknown: a rejection can be any value until the assertion narrows it.
			(caught: unknown) => caught,
		);

		expect(failure).toBeInstanceOf(MiroAPIError);
		expect((failure as MiroAPIError).status).toBe(401);
		expect((failure as MiroAPIError).code).toBeTruthy();
	});

	// The board-scoped reads need a board the token can see.
	const describeIfBoard = BOARD_ID ? describe : describe.skip;

	if (!BOARD_ID) {
		console.warn(
			'MIRO_TEST_BOARD_ID is not set, so the board-scoped Miro live tests are skipped. Set it to a board id from the board URL to run them.',
		);
	}

	describeIfBoard('with a board', () => {
		it('reads the board', async () => {
			const result = await boardsGet(ctx, { boardId: BOARD_ID as string });

			expect(result.id).toBe(BOARD_ID);
		});

		it('lists items through the endpoint and its output schema', async () => {
			const result = await itemsList(ctx, {
				boardId: BOARD_ID as string,
				limit: 5,
			});

			expect(Array.isArray(result.items)).toBe(true);
		});

		it('lists tags through the endpoint and its output schema', async () => {
			const result = await tagsList(ctx, {
				boardId: BOARD_ID as string,
				limit: 5,
			});

			expect(Array.isArray(result.tags)).toBe(true);
		});
	});
});
