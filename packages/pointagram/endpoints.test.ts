import * as client from './client';
import { PointagramAPIError } from './client';
import {
	Competitions,
	Players,
	RewardStore,
	ScoreSeries,
	Teams,
	Test,
} from './endpoints';
import { buildContext } from './test-helpers';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn() };
});

jest.mock('./client', () => {
	const actual = jest.requireActual('./client');
	return { ...actual, makePointagramRequest: jest.fn() };
});

const mockedRequest = jest.mocked(client.makePointagramRequest);

const ctx = buildContext();

beforeEach(() => {
	mockedRequest.mockReset();
});

describe('envelope handling', () => {
	it('unwraps data and keeps a field Pointagram adds later', async () => {
		mockedRequest.mockResolvedValue({
			status: 'Ok',
			message: 'Teams retrieved successfully',
			data: { teams: [{ id: '3', name: 'The Bulls', new_field: 'x' }] },
			request_id: 'abc',
		});

		const result = await Teams.list(ctx, {});

		expect(result.teams).toEqual([
			{ id: '3', name: 'The Bulls', new_field: 'x' },
		]);
	});

	it('rejects a 2xx body whose status is Error instead of parsing it as data', async () => {
		mockedRequest.mockResolvedValue({
			status: 'Error',
			message: 'Player already exists.',
			data: {},
		});

		await expect(
			Players.create(ctx, {
				player_name: 'Axl Rose',
				player_external_id: '121212',
			}),
		).rejects.toBeInstanceOf(PointagramAPIError);
		await expect(
			Players.create(ctx, {
				player_name: 'Axl Rose',
				player_external_id: '121212',
			}),
		).rejects.toThrow('Player already exists.');
	});

	it('rejects a body carrying neither Ok nor Error rather than inventing a success', async () => {
		mockedRequest.mockResolvedValue({ teams: [{ id: '3' }] });

		await expect(Teams.list(ctx, {})).rejects.toThrow(/unrecognised envelope/);
	});

	it('rejects a success envelope whose data is the wrong shape', async () => {
		mockedRequest.mockResolvedValue({
			status: 'Ok',
			data: { teams: 'The Bulls' },
		});

		await expect(Teams.list(ctx, {})).rejects.toThrow();
	});

	it('rejects a malformed known field rather than coercing it', async () => {
		mockedRequest.mockResolvedValue({
			status: 'Ok',
			data: { players: [{ id: true, name: 'Axl' }] },
		});

		await expect(Players.list(ctx, {})).rejects.toThrow();
	});

	it('accepts an empty list page', async () => {
		mockedRequest.mockResolvedValue({
			status: 'Ok',
			data: { competitions: [] },
		});

		const result = await Competitions.list(ctx, {});

		expect(result.competitions).toEqual([]);
	});

	it('does not turn a missing wrapped array into an empty page', async () => {
		mockedRequest.mockResolvedValue({ status: 'Ok', data: {} });

		await expect(Teams.list(ctx, {})).rejects.toThrow();
	});

	it('reads settings whose currencies arrive as a JSON string', async () => {
		mockedRequest.mockResolvedValue({
			status: 'Ok',
			data: {
				id: '1',
				name: 'Store',
				currencies:
					'{"id":"234","icon":"coin.png","name":"coin","currencyid":"4","coins":"50.00"}',
			},
		});

		const result = await RewardStore.settings(ctx, { profileid: '1234' });

		expect(typeof result.currencies).toBe('string');
	});

	it('reads settings whose currencies arrive as the documented array', async () => {
		mockedRequest.mockResolvedValue({
			status: 'Ok',
			data: {
				id: '1',
				currencies: [{ id: '234', name: 'coin', coins: '50.00' }],
			},
		});

		const result = await RewardStore.settings(ctx, { profileid: '1234' });

		expect(result.currencies).toEqual([
			{ id: '234', name: 'coin', coins: '50.00' },
		]);
	});

	it('accepts numeric scalars, which the spec calls strings', async () => {
		mockedRequest.mockResolvedValue({
			status: 'Ok',
			data: {
				history: [
					{
						id: 863783,
						profile_id: 52278,
						score: 12,
						timestamp: '2023-06-15 11:57:56',
					},
				],
			},
		});

		const result = await ScoreSeries.history(ctx, { id: 180 });

		expect(result.history[0]?.id).toBe(863783);
		expect(result.history[0]?.score).toBe(12);
	});

	it('keeps the transaction id nullable when Pointagram omits it', async () => {
		mockedRequest.mockResolvedValue({ status: 'Ok', data: {} });

		const result = await ScoreSeries.addPoints(ctx, {
			player_email: 'harry@pointagram.com',
			scoreseries_id: 180,
			points: 5,
		});

		expect(result.insid).toBeUndefined();
	});

	it('accepts the player shape the single-player route documents', async () => {
		mockedRequest.mockResolvedValue({
			status: 'Ok',
			data: {
				player_name: 'Axl Rose',
				player_email: 'axl@pointagram.com',
				is_org_admin: '0',
			},
		});

		const result = await Players.get(ctx, { id: 989 });

		expect(result.player_name).toBe('Axl Rose');
		expect(result.is_org_admin).toBe('0');
	});

	it('parses a reward item that mixes camelCase and snake_case fields', async () => {
		mockedRequest.mockResolvedValue({
			status: 'Ok',
			data: {
				id: '23',
				name: 'car',
				startDate: '2023-06-16 08:21:00',
				endDate: '2023-06-17 08:21:00',
				publishphase: '1',
				coins: '30',
				tags: [{ id: '11', name: 'my store', linkid: '21' }],
				image_url: 'https://s3-eu-west-1.amazonaws.com/car.png',
			},
		});

		const result = await RewardStore.item(ctx, {
			id: 23,
			profileid: '1234',
		});

		expect(result.startDate).toBe('2023-06-16 08:21:00');
		expect(result.tags?.[0]?.id).toBe('11');
	});

	it('rejects a 2xx envelope that reports bad credentials as a success', async () => {
		mockedRequest.mockResolvedValue({
			status: 'Ok',
			message: 'Invalid Credentials for ops@example.com',
			data: {},
		});

		// The success branch must not resolve an empty organization for a key
		// Pointagram says does not work, and the error must not repeat the login.
		const error = await Test.credentials(ctx, {}).then(
			() => undefined,
			(caught: Error) => caught,
		);
		expect(error?.message).toBe(
			'Pointagram rejected the Api-Key and Api-User pair',
		);
	});

	it("masks the caller's values in an error envelope's message", async () => {
		mockedRequest.mockResolvedValue({
			status: 'Error',
			message: 'Player corsair-tests@inkboxmail.com already exists.',
			data: {},
		});

		const error = await Players.create(ctx, {
			player_name: 'corsair-plugin-test',
			player_email: 'corsair-tests@inkboxmail.com',
			offline: 1,
		}).then(
			() => undefined,
			(caught: Error) => caught,
		);
		expect(error?.message).toBe('Player [redacted] already exists.');
	});

	it('masks a two-letter player name as a whole word', async () => {
		mockedRequest.mockResolvedValue({
			status: 'Error',
			message: 'Player Li already exists (Limit reached).',
			data: {},
		});

		const error = await Players.create(ctx, {
			player_name: 'Li',
			player_external_id: 'ext-77',
			offline: 1,
		}).then(
			() => undefined,
			(caught: Error) => caught,
		);
		expect(error?.message).toBe(
			'Player [redacted] already exists (Limit reached).',
		);
	});
});

describe('live API response shapes (trimmed from a real account, 11-15)', () => {
	it('reads the score series list from `data.scoreseries`', async () => {
		mockedRequest.mockResolvedValue({
			status: 'Ok',
			message: 'Scoreseries retrieved successfully',
			data: {
				scoreseries: [
					{
						id: '20099',
						name: 'corsair-plugin-test',
						icon: 'defscoreseries.png',
						point_name_singular: 'point',
						point_name_plural: 'points',
					},
				],
			},
		});

		const result = await ScoreSeries.list(ctx, {});
		expect(result.series).toHaveLength(1);
		expect(result.series[0]?.id).toBe('20099');
	});

	it('accepts the empty external_id and capitalised Name a player row carries', async () => {
		mockedRequest.mockResolvedValue({
			status: 'Ok',
			message: 'Players retrieved successfully',
			data: {
				players: [
					{
						id: '922456',
						Name: 'corsair-plugin-test',
						emailaddress: '',
						external_id: '',
						icon: 'Avatar37.png',
						is_org_admin: '1',
					},
				],
			},
		});

		const result = await Players.list(ctx, {});
		expect(result.players[0]?.Name).toBe('corsair-plugin-test');
		expect(result.players[0]?.external_id).toBe('');
	});

	it('turns an `Ok` envelope with `data: false` into a not-found error', async () => {
		mockedRequest.mockResolvedValue({
			status: 'Ok',
			message: 'Player not found',
			data: false,
		});

		const error = await Players.get(ctx, { id: 1 }).then(
			() => undefined,
			(caught: Error) => caught,
		);
		expect(error).toBeInstanceOf(PointagramAPIError);
		expect(error?.message).toBe('Player not found');
	});

	it('parses a history row with its capitalised Score, Name and Comment', async () => {
		mockedRequest.mockResolvedValue({
			status: 'Ok',
			message: 'Score serie history retrieved successfully',
			data: {
				history: [
					{
						profile_id: '922458',
						Name: 'corsair-plugin-test',
						emailaddress: '',
						player_external_id: 'corsair-plugin-test-1',
						giver_id: null,
						Score: '5',
						point_type: null,
						point_type_name: null,
						Comment: 'corsair-plugin-test',
						timestamp: '2026-11-15 02:49:58',
						id: '16532392',
						is_revoked: null,
						external_id: 'corsair-plugin-test-1',
						created: '2026-11-15 02:49:58',
						tags: [],
					},
				],
				pagination: { limit: '5' },
			},
		});

		const result = await ScoreSeries.history(ctx, { id: 20099, limit: 5 });
		expect(result.history[0]?.Score).toBe('5');
		expect(result.history[0]?.Comment).toBe('corsair-plugin-test');
	});

	it('reads competitions.get from the one-element array the API sends', async () => {
		mockedRequest.mockResolvedValue({
			status: 'Ok',
			message: 'Competition retrieved successfully',
			data: [
				{
					id: '25334',
					name: 'New Leaderboard competition',
					start_date: '2026-11-15 02:51:00',
					competition_type: '2',
					groupingmode: '2',
				},
			],
		});

		const result = await Competitions.get(ctx, { id: 25334 });
		expect(result.id).toBe('25334');
	});

	it('turns a `data: null` competition lookup into a not-found error', async () => {
		mockedRequest.mockResolvedValue({
			status: 'Ok',
			message: 'Competition not found',
			data: null,
		});

		await expect(Competitions.get(ctx, { id: 1 })).rejects.toThrow(
			'Competition not found',
		);
	});

	it('rejects a name-only players.create before sending, as Pointagram does', async () => {
		await expect(
			Players.create(ctx, { player_name: 'corsair-plugin-test' }),
		).rejects.toThrow(/player_email or player_external_id/);
		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('input validation before the request', () => {
	it('rejects teams.addPlayer with no player identifier', async () => {
		await expect(Teams.addPlayer(ctx, { id: 64 })).rejects.toThrow(
			/at least one of player_id/,
		);
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('rejects addPoints with neither a score series id nor a name', async () => {
		await expect(
			ScoreSeries.addPoints(ctx, {
				player_email: 'harry@pointagram.com',
				points: 5,
			}),
		).rejects.toThrow(/scoreseries_id or scoreseries_name/);
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('rejects addPoints naming both a score series id and a name', async () => {
		await expect(
			ScoreSeries.addPoints(ctx, {
				player_email: 'harry@pointagram.com',
				scoreseries_id: 180,
				scoreseries_name: 'Points',
				points: 5,
			}),
		).rejects.toThrow(/not both/);
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('rejects addPoints with neither points nor a point type', async () => {
		await expect(
			ScoreSeries.addPoints(ctx, {
				player_email: 'harry@pointagram.com',
				scoreseries_id: 180,
			}),
		).rejects.toThrow(/points or pointtype_name/);
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('rejects addPoints with no player identifier', async () => {
		await expect(
			ScoreSeries.addPoints(ctx, { scoreseries_id: 180, points: 5 }),
		).rejects.toThrow(/at least one of player_id/);
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('caps the page size at the documented maximum', async () => {
		await expect(Players.list(ctx, { limit: 1001 })).rejects.toThrow();
		await expect(
			ScoreSeries.history(ctx, { id: 180, limit: 1001 }),
		).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('rejects a delivery status the store does not define', async () => {
		await expect(
			RewardStore.updatePurchase(ctx, {
				id: 27,
				profileid: '1234',
				// The documented set is PURCHASED, PROCESSED, DELIVERED.
				deliverystatus: 'SHIPPED' as 'PROCESSED',
			}),
		).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('rejects a history filter whose type is not 1 or 2', async () => {
		await expect(
			ScoreSeries.history(ctx, {
				id: 180,
				tags_filter: [{ id: '13', type: 3 as 1 }],
			}),
		).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});
});
