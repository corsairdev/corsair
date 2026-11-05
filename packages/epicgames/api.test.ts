import 'dotenv/config';
import { makeEpicGamesRequest } from './client';
import type { EpicGamesEndpointInputs } from './endpoints/types';
import {
	EpicGamesEndpointInputSchemas,
	EpicGamesEndpointOutputSchemas,
} from './endpoints/types';
import { EpicGamesIsland } from './schema';

const TEST_TOKEN =
	process.env.EPIC_GAMES_ACCESS_TOKEN ||
	process.env.EPICGAMES_ACCESS_TOKEN ||
	process.env.EPIC_ACCESS_TOKEN;

const describeIfToken = TEST_TOKEN ? describe : describe.skip;

const looseOut = { ok: true, data: {} };
const looseList = {
	data: [{ code: '3475-0071-5270', title: 'My Island', tags: [] }],
	links: { next: null, prev: null },
	meta: { count: 1, page: { nextCursor: null, prevCursor: null } },
};

const FIXTURES: {
	[K in keyof EpicGamesEndpointInputs]: {
		input: EpicGamesEndpointInputs[K];
		// output shape varies; asserted dynamically against each operation schema
		output: unknown;
	};
} = {
	islandsList: {
		input: { size: 10 },
		output: looseList,
	},
	islandsGet: {
		input: { code: '3475-0071-5270' },
		output: { code: '3475-0071-5270', title: 'My Island', tags: [] },
	},
	islandsGetMetricsByInterval: {
		input: { code: '3475-0071-5270', interval: 'day' },
		output: { plays: [], uniquePlayers: [] },
	},
	islandsGetPlays: {
		input: { code: '3475-0071-5270', interval: 'day' },
		output: {
			intervals: [{ value: 100, timestamp: '2026-07-17T00:00:00.000Z' }],
		},
	},
	islandsGetUniquePlayers: {
		input: { code: '3475-0071-5270', interval: 'day' },
		output: {
			intervals: [{ value: 50, timestamp: '2026-07-17T00:00:00.000Z' }],
		},
	},
	islandsGetMinutesPlayed: {
		input: { code: '3475-0071-5270', interval: 'day' },
		output: {
			intervals: [{ value: 1000, timestamp: '2026-07-17T00:00:00.000Z' }],
		},
	},
	islandsGetAvgMinutesPerPlayer: {
		input: { code: '3475-0071-5270', interval: 'day' },
		output: {
			intervals: [{ value: 20, timestamp: '2026-07-17T00:00:00.000Z' }],
		},
	},
	islandsGetPeakCcu: {
		input: { code: '3475-0071-5270', interval: 'day' },
		output: {
			intervals: [{ value: 12, timestamp: '2026-07-17T00:00:00.000Z' }],
		},
	},
	islandsGetFavorites: {
		input: { code: '3475-0071-5270', interval: 'day' },
		output: {
			intervals: [{ value: 5, timestamp: '2026-07-17T00:00:00.000Z' }],
		},
	},
	islandsGetRecommendations: {
		input: { code: '3475-0071-5270', interval: 'day' },
		output: {
			intervals: [{ value: 3, timestamp: '2026-07-17T00:00:00.000Z' }],
		},
	},
	islandsGetRetention: {
		input: { code: '3475-0071-5270', interval: 'day' },
		output: {
			intervals: [{ d1: 0.4, d7: 0.1, timestamp: '2026-07-17T00:00:00.000Z' }],
		},
	},

	remoteInitiateSession: {
		input: {},
		output: looseOut,
	},
	remoteBatch: {
		input: { requests: [{ RequestId: 1, URL: '/remote/info', Verb: 'GET' }] },
		output: looseOut,
	},
	remoteCorsPreflight: {
		input: {},
		output: { status: 204 },
	},
	remoteGetPreset: {
		input: { presetName: 'MyPreset' },
		output: { Name: 'MyPreset' },
	},
	remoteGetPresetMetadata: {
		input: { presetName: 'MyPreset' },
		output: { Meta: {} },
	},
	remoteGetPresetMetadataKey: {
		input: { presetName: 'MyPreset', key: 'author' },
		output: { Value: 'dev' },
	},
	remotePutPresetMetadataKey: {
		input: { presetName: 'MyPreset', key: 'author', value: 'dev' },
		output: looseOut,
	},
	remoteDeletePresetMetadataKey: {
		input: { presetName: 'MyPreset', key: 'author' },
		output: looseOut,
	},
	remoteGetPresetProperty: {
		input: { presetName: 'MyPreset', propertyName: 'Location' },
		output: { PropertyValue: {} },
	},
	remoteUpdatePresetProperty: {
		input: {
			presetName: 'MyPreset',
			propertyName: 'Location',
			value: { X: 0, Y: 0, Z: 0 },
		},
		output: looseOut,
	},
	remoteInvokePresetFunction: {
		input: {
			presetName: 'MyPreset',
			functionName: 'DoSomething',
			parameters: {},
		},
		output: looseOut,
	},
	remoteDescribeObject: {
		input: { objectPath: '/Game/Map.Map:PersistentLevel.Actor' },
		output: { Name: 'Actor' },
	},
	remoteCallObjectFunction: {
		input: {
			objectPath: '/Game/Map.Map:PersistentLevel.Actor',
			functionName: 'SetActorLocation',
			parameters: {},
		},
		output: looseOut,
	},
	remotePutObjectProperty: {
		input: {
			objectPath: '/Game/Map.Map:PersistentLevel.Actor',
			access: 'READ_ACCESS',
			propertyName: 'bHidden',
			propertyValue: { bHidden: false },
		},
		output: looseOut,
	},
	remoteGetObjectThumbnail: {
		input: { objectPath: '/Game/Asset.Asset' },
		output: { Thumbnail: 'base64' },
	},
	remoteListBlueprintCallableFunctions: {
		input: { objectPath: '/Game/Map.Map:PersistentLevel.Actor' },
		output: {
			objectPath: '/Game/Map.Map:PersistentLevel.Actor',
			functions: [],
			count: 0,
		},
	},
	remoteWaitForObjectEvent: {
		input: {
			objectPath: '/Game/Map.Map:PersistentLevel.Actor',
			eventType: 'ObjectPropertyChanged',
			propertyName: 'StaticMesh',
		},
		output: looseOut,
	},
};

describe('Epic Games endpoint schemas', () => {
	it('defines fixtures for every endpoint', () => {
		expect(Object.keys(FIXTURES).length).toBe(28);
		expect(Object.keys(FIXTURES).length).toBe(
			Object.keys(EpicGamesEndpointInputSchemas).length,
		);
	});

	for (const [name, fixture] of Object.entries(FIXTURES) as [
		keyof EpicGamesEndpointInputs,
		(typeof FIXTURES)[keyof EpicGamesEndpointInputs],
	][]) {
		it(`parses ${name} input and output`, () => {
			const inputParsed = EpicGamesEndpointInputSchemas[name].safeParse(
				fixture.input,
			);
			expect(inputParsed.success).toBe(true);

			const outputParsed = EpicGamesEndpointOutputSchemas[name].safeParse(
				fixture.output,
			);
			expect(outputParsed.success).toBe(true);
		});
	}

	it('rejects invalid islandsGet when code is missing', () => {
		const parsed = EpicGamesEndpointInputSchemas.islandsGet.safeParse({});
		expect(parsed.success).toBe(false);
	});

	it('rejects invalid interval on island metrics', () => {
		const parsed = EpicGamesEndpointInputSchemas.islandsGetPlays.safeParse({
			code: 'x',
			interval: 'week',
		});
		expect(parsed.success).toBe(false);
	});

	it('rejects hour interval on retention (day-only)', () => {
		const parsed = EpicGamesEndpointInputSchemas.islandsGetRetention.safeParse({
			code: 'x',
			interval: 'hour',
		});
		expect(parsed.success).toBe(false);
	});

	it('documents Fortnite OpenAPI metric path segments', () => {
		// /islands/{code}/metrics/{interval}/{metric}
		const code = '3475-0071-5270';
		const interval = 'day';
		const metrics = [
			'plays',
			'unique-players',
			'minutes-played',
			'average-minutes-per-player',
			'peak-ccu',
			'favorites',
			'recommendations',
			'retention',
		];
		for (const metric of metrics) {
			const path = `/islands/${encodeURIComponent(code)}/metrics/${interval}/${metric}`;
			expect(path).toContain('/metrics/day/');
			expect(path.endsWith(`/${metric}`)).toBe(true);
		}
	});

	it('parses IslandMetadataSummary-shaped DB entity', () => {
		// Live Fortnite GET /islands/{code} shape (type often omitted despite OpenAPI)
		const parsed = EpicGamesIsland.safeParse({
			code: '3475-0071-5270',
			creatorCode: 'fortnite',
			title: 'My Island',
			createdIn: 'UEFN',
			tags: ['1v1'],
			meta: { page: { cursor: 'abc' } },
		});
		expect(parsed.success).toBe(true);
		expect(EpicGamesIsland.safeParse({ title: 'no-code' }).success).toBe(false);
	});
});

// Live smokes: list-only (no fake entity IDs). Fortnite Data API is public;
// OAuth token still sent when present (client-credentials scheme in OpenAPI).
describeIfToken('Epic Games live smoke tests', () => {
	it('lists islands (GET /islands)', async () => {
		const response = await makeEpicGamesRequest('/islands', TEST_TOKEN!, {
			method: 'GET',
			query: { size: 5 },
			bearer: true,
		});
		const parsed =
			EpicGamesEndpointOutputSchemas.islandsList.safeParse(response);
		expect(parsed.success).toBe(true);
	}, 20000);
});

// Public Fortnite Data API (no OAuth required for GET). Opt-in so CI without
// outbound network stays green: EPIC_GAMES_LIVE=1 or any access token env.
const runPublicLive =
	process.env.EPIC_GAMES_LIVE === '1' || Boolean(TEST_TOKEN);
const describePublicLive = runPublicLive ? describe : describe.skip;

describePublicLive('Epic Games public Fortnite Data API', () => {
	it('lists islands without a token', async () => {
		const response = await makeEpicGamesRequest('/islands', undefined, {
			method: 'GET',
			query: { size: 2 },
			bearer: false,
		});
		const parsed =
			EpicGamesEndpointOutputSchemas.islandsList.safeParse(response);
		expect(parsed.success).toBe(true);
		expect(response && typeof response === 'object').toBe(true);
		expect(Array.isArray((response as { data?: unknown }).data)).toBe(true);
	}, 20000);

	it('gets island + all day metric path segments', async () => {
		const list = (await makeEpicGamesRequest('/islands', undefined, {
			method: 'GET',
			query: { size: 1 },
			bearer: false,
		})) as { data?: Array<{ code?: string }> };
		const code = list?.data?.[0]?.code;
		expect(code).toBeTruthy();

		const meta = await makeEpicGamesRequest(
			`/islands/${encodeURIComponent(code!)}`,
			undefined,
			{ method: 'GET', bearer: false },
		);
		expect(
			EpicGamesEndpointOutputSchemas.islandsGet.safeParse(meta).success,
		).toBe(true);

		const metrics = [
			'plays',
			'unique-players',
			'minutes-played',
			'average-minutes-per-player',
			'peak-ccu',
			'favorites',
			'recommendations',
			'retention',
		];
		for (const metric of metrics) {
			const body = await makeEpicGamesRequest(
				`/islands/${encodeURIComponent(code!)}/metrics/day/${metric}`,
				undefined,
				{ method: 'GET', bearer: false },
			);
			expect(
				EpicGamesEndpointOutputSchemas.islandsGetPlays.safeParse(body).success,
			).toBe(true);
		}
	}, 60000);

	it('rejects hour retention at the live API (OpenAPI day-only)', async () => {
		const list = (await makeEpicGamesRequest('/islands', undefined, {
			method: 'GET',
			query: { size: 1 },
			bearer: false,
		})) as { data?: Array<{ code?: string }> };
		const code = list?.data?.[0]?.code;
		expect(code).toBeTruthy();
		await expect(
			makeEpicGamesRequest(
				`/islands/${encodeURIComponent(code!)}/metrics/hour/retention`,
				undefined,
				{ method: 'GET', bearer: false },
			),
		).rejects.toBeTruthy();
	}, 20000);
});

it('requires RequestId, URL, and Verb for remote batch requests', () => {
	const schema = EpicGamesEndpointInputSchemas.remoteBatch;
	expect(
		schema.safeParse({
			requests: [{ RequestId: 1, URL: '/remote/info', Verb: 'GET', Body: {} }],
		}).success,
	).toBe(true);
	expect(
		schema.safeParse({ requests: [{ URL: '/remote/info', Verb: 'GET' }] })
			.success,
	).toBe(false);
	expect(
		schema.safeParse({ requests: [{ RequestId: 1, Verb: 'GET' }] }).success,
	).toBe(false);
	expect(
		schema.safeParse({ requests: [{ RequestId: 1, URL: '/remote/info' }] })
			.success,
	).toBe(false);
});
