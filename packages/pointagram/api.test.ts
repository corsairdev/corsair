// Live Pointagram API smoke tests. Excluded from the default run by CI's
// `--testPathIgnorePatterns='api\.test\.ts$'`; run explicitly with:
//
//   POINTAGRAM_API_KEY=... POINTAGRAM_API_USER=... pnpm test:live
//
// Every test is a read. They confirm the Custom Api 2.0 envelope, the two
// credential headers, and that each output schema matches a real response.
import { ApiError } from 'corsair/http';
import {
	isCredentialRejection,
	makePointagramRequest,
	POINTAGRAM_API_BASE,
	reportsInvalidCredentials,
} from './client';
import {
	CompetitionSchema,
	PlayerSchema,
	PointagramEndpointInputSchemas,
	PointagramEndpointOutputSchemas,
	TeamSchema,
} from './endpoints/types';

const LIVE_KEY = process.env.POINTAGRAM_API_KEY ?? '';
const LIVE_USER = process.env.POINTAGRAM_API_USER ?? '';

const missing = [
	LIVE_KEY ? undefined : 'POINTAGRAM_API_KEY',
	LIVE_USER ? undefined : 'POINTAGRAM_API_USER',
].filter((name): name is string => name !== undefined);

if (missing.length > 0) {
	// Same check the gate prints, so a skipped run cannot read as a green one.
	console.warn(
		`Skipping Pointagram live API tests: ${missing.join(' and ')} not set.`,
	);
}
const describeLive = missing.length === 0 ? describe : describe.skip;

const credentials = { apiKey: LIVE_KEY, apiUser: LIVE_USER };

/**
 * The `data` member of a Pointagram envelope. It is untyped here because the
 * caller's output schema is what gives it a shape.
 */
function dataOf(
	envelope: unknown, // unknown: the raw response before an output schema parses it.
): unknown {
	// unknown: see above; the caller's output schema types it.
	if (envelope === null || typeof envelope !== 'object') {
		throw new Error('Pointagram returned a body that is not an envelope');
	}
	const record = envelope as Record<string, unknown>; // unknown: untyped envelope.
	// The endpoints refuse these envelopes before parsing; so does this helper,
	// or a 200 `Error` envelope with `data: {}` would pass the credential test.
	if (
		typeof record.status !== 'string' ||
		!/^ok$/i.test(record.status) ||
		reportsInvalidCredentials(envelope)
	) {
		throw new Error(
			`Pointagram returned a failed envelope (status ${String(record.status)})`,
		);
	}
	return record.data;
}

describeLive('Pointagram live API', () => {
	it('confirms the credentials and reports the organization', async () => {
		const raw = await makePointagramRequest(credentials, {
			method: 'POST',
			path: '/test',
		});
		const output = PointagramEndpointOutputSchemas.testCredentials.parse(
			dataOf(raw),
		);

		expect(output).toBeDefined();
	});

	it('lists players through the output schema', async () => {
		const raw = await makePointagramRequest(credentials, {
			method: 'GET',
			path: '/players',
			query: { limit: 5 },
		});
		const output = PointagramEndpointOutputSchemas.playersList.parse(
			dataOf(raw),
		);

		expect(Array.isArray(output.players)).toBe(true);
		// A row the docs print as `{ id: 527947, ... }` must parse, which is what
		// proves the numeric-or-string id union matches the wire format.
		for (const player of output.players) {
			expect(PlayerSchema.safeParse(player).success).toBe(true);
		}
	});

	it('lists teams and parses a single team', async () => {
		const raw = await makePointagramRequest(credentials, {
			method: 'GET',
			path: '/teams',
		});
		const output = PointagramEndpointOutputSchemas.teamsList.parse(dataOf(raw));

		expect(Array.isArray(output.teams)).toBe(true);
		for (const team of output.teams) {
			expect(TeamSchema.safeParse(team).success).toBe(true);
		}
	});

	it('lists score series and their point types', async () => {
		const raw = await makePointagramRequest(credentials, {
			method: 'GET',
			path: '/scoreseries',
		});
		// The live API names the list `scoreseries`; the endpoint renames it to
		// `series` before the output schema sees it, and so does this test.
		const data = dataOf(raw) as Record<string, unknown>; // unknown: untyped envelope data.
		expect(Array.isArray(data.scoreseries)).toBe(true);
		const output = PointagramEndpointOutputSchemas.scoreSeriesList.parse({
			series: data.scoreseries,
		});
		expect(Array.isArray(output.series)).toBe(true);

		const first = output.series[0];
		if (first?.id === undefined || first.id === null) return;
		const typesRaw = await makePointagramRequest(credentials, {
			method: 'GET',
			path: `/scoreseries/${encodeURIComponent(String(first.id))}/pointtypes`,
		});
		const types = PointagramEndpointOutputSchemas.scoreSeriesPointTypes.parse(
			dataOf(typesRaw),
		);
		expect(Array.isArray(types.pointtypes)).toBe(true);
	});

	it('lists competitions and parses one', async () => {
		const raw = await makePointagramRequest(credentials, {
			method: 'GET',
			path: '/competitions',
		});
		const output = PointagramEndpointOutputSchemas.competitionsList.parse(
			dataOf(raw),
		);
		expect(Array.isArray(output.competitions)).toBe(true);

		for (const competition of output.competitions) {
			expect(CompetitionSchema.safeParse(competition).success).toBe(true);
		}
	});

	it('rejects a wrong key with the documented 404 envelope', async () => {
		const error = await makePointagramRequest(
			{ apiKey: 'definitely-not-a-key', apiUser: 'nobody@example.com' },
			{ method: 'POST', path: '/test' },
		).then(
			() => undefined,
			(caught) => caught,
		);

		// The HTTP failure is core's ApiError, passed through unchanged.
		expect(error).toBeInstanceOf(ApiError);
		if (!(error instanceof ApiError)) return;
		expect(error.status).toBe(404);
		expect(isCredentialRejection(error.status, error.body)).toBe(true);
		// The wrong key must not appear anywhere on the error.
		expect(JSON.stringify(error)).not.toContain('definitely-not-a-key');
	});

	it('exposes the Custom Api 2.0 base, not the unresolvable api host', () => {
		expect(POINTAGRAM_API_BASE).toBe('https://app.pointagram.com/api/20');
		// A sample no-input operation, so the registry and the live suite agree.
		expect(
			PointagramEndpointInputSchemas.testCredentials.safeParse({}).success,
		).toBe(true);
	});
});
