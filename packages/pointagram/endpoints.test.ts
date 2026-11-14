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
			Players.create(ctx, { player_name: 'Axl Rose' }),
		).rejects.toBeInstanceOf(PointagramAPIError);
		await expect(
			Players.create(ctx, { player_name: 'Axl Rose' }),
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
			message: 'Invalid Credentials',
			data: {},
		});

		// The success branch must not resolve an empty organization for a key
		// Pointagram says does not work.
		await expect(Test.credentials(ctx, {})).rejects.toThrow(
			/rejected the key/i,
		);
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
