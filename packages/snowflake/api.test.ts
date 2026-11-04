import { SnowflakeAPIError } from './client';
import { cancel, get } from './endpoints';

const KEY = process.env.SNOWFLAKE_API_KEY ?? '';
const ACCOUNT = process.env.SNOWFLAKE_ACCOUNT ?? '';
const TOKEN_TYPE = process.env.SNOWFLAKE_TOKEN_TYPE ?? '';

// A missing statement is the documented not-found case (422, code 000709).
// It does not resume a warehouse. HTTP 404 is only a bad path.
const MISSING_HANDLE = '00000000-0000-0000-0000-000000000000';

const describeIfKey = KEY && ACCOUNT ? describe : describe.skip;

function liveContext() {
	return {
		key: KEY,
		options: {
			account: ACCOUNT,
			tokenType: TOKEN_TYPE || undefined,
		},
		keys: {
			get_account: async () => ACCOUNT,
			get_tokenType: async () => TOKEN_TYPE || null,
		},
		$getAccountId: async () => 'live',
	};
}

// unknown: the rejection stays untyped until the instanceof check narrows it.
async function failure(promise: Promise<unknown>): Promise<SnowflakeAPIError> {
	const error = await promise.catch((caught: unknown) => caught);
	expect(error).toBeInstanceOf(SnowflakeAPIError);
	if (!(error instanceof SnowflakeAPIError)) {
		throw new Error('expected SnowflakeAPIError');
	}
	return error;
}

describeIfKey('Snowflake SQL API live', () => {
	jest.setTimeout(180_000);

	it('returns 422 code 000709 for a missing statement handle', async () => {
		// The fake context carries the live credential. These reads do not use
		// the database, so the full plugin context is not constructed.
		const error = await failure(
			get(liveContext() as never, { statementHandle: MISSING_HANDLE }),
		);
		expect(error.status).toBe(422);
		expect(error.code).toBe('000709');
	});

	it('returns 422 when cancelling that same missing handle', async () => {
		// Same partial context as the status read above.
		const error = await failure(
			cancel(liveContext() as never, { statementHandle: MISSING_HANDLE }),
		);
		expect(error.status).toBe(422);
		expect(error.code).toBe('000709');
	});
});
