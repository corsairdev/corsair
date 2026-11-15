import { logEventFromContext } from 'corsair/core';
import * as client from './client';
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
const mockedLog = jest.mocked(logEventFromContext);

const CREDENTIALS = { apiKey: 'key-abc', apiUser: 'ops@example.com' };

const ctx = buildContext();

/** The request the endpoint handed the client. */
function sentRequest() {
	const call = mockedRequest.mock.calls.at(-1);
	if (!call) throw new Error('no request was sent');
	return call[1];
}

function sentCredentials() {
	const call = mockedRequest.mock.calls.at(-1);
	if (!call) throw new Error('no request was sent');
	return call[0];
}

beforeEach(() => {
	mockedRequest.mockReset();
	mockedLog.mockReset();
});

describe('test.credentials', () => {
	it('posts to /test and returns the organization', async () => {
		mockedRequest.mockResolvedValue({
			status: 'Ok',
			message: 'Credentials are valid',
			data: { organization: 'TestBolaget' },
		});

		const result = await Test.credentials(ctx, {});

		expect(sentRequest()).toEqual({ method: 'POST', path: '/test' });
		expect(sentCredentials()).toEqual(CREDENTIALS);
		expect(result).toEqual({ organization: 'TestBolaget' });
		// The organization is the account's own name, so the event omits it.
		expect(mockedLog).toHaveBeenCalledWith(
			ctx,
			'pointagram.test.credentials',
			{},
			'completed',
		);
	});
});

describe('players endpoints', () => {
	it('players.list sends the documented query parameters', async () => {
		mockedRequest.mockResolvedValue({
			status: 'Ok',
			data: {
				players: [{ id: '527947', name: 'Axl Rose' }],
				pagination: { limit: '1', offset: '527946', next_offset: '527947' },
			},
		});

		const result = await Players.list(ctx, {
			search_by: 'Email',
			filter: 'axl@pointagram.com',
			limit: 5,
			offset: '527946',
		});

		expect(sentRequest()).toEqual({
			method: 'GET',
			path: '/players',
			query: {
				search_by: 'Email',
				filter: 'axl@pointagram.com',
				limit: 5,
				offset: '527946',
			},
		});
		expect(result.players).toHaveLength(1);
		expect(result.pagination?.next_offset).toBe('527947');
		expect(mockedLog).toHaveBeenCalledWith(
			ctx,
			'pointagram.players.list',
			{ count: 1 },
			'completed',
		);
	});

	it('players.get encodes the id into the path', async () => {
		mockedRequest.mockResolvedValue({
			status: 'Ok',
			data: { player_name: 'Axl Rose', player_email: 'axl@pointagram.com' },
		});

		const result = await Players.get(ctx, { id: 989 });

		expect(sentRequest()).toEqual({ method: 'GET', path: '/players/989' });
		expect(result.player_name).toBe('Axl Rose');
	});

	it('players.create sends the documented body and normalizes the offline flag', async () => {
		mockedRequest.mockResolvedValue({
			status: 'Ok',
			message: 'Player created',
			data: { profile_id: '989' },
		});

		const result = await Players.create(ctx, {
			player_name: 'Axl Rose',
			player_email: 'axl@pointagram.com',
			player_external_id: '121212',
			offline: true,
		});

		expect(sentRequest()).toEqual({
			method: 'POST',
			path: '/players',
			body: {
				player_name: 'Axl Rose',
				player_email: 'axl@pointagram.com',
				player_external_id: '121212',
				offline: '1',
			},
		});
		expect(result.profile_id).toBe('989');
	});

	it('players.update posts to the player path with the full body', async () => {
		mockedRequest.mockResolvedValue({
			status: 'Ok',
			data: { profile_id: '989' },
		});

		await Players.update(ctx, {
			id: 989,
			player_name: 'Axl Rose',
			offline: 0,
		});

		expect(sentRequest()).toEqual({
			method: 'POST',
			path: '/players/989',
			body: {
				player_name: 'Axl Rose',
				player_email: undefined,
				player_external_id: undefined,
				offline: '0',
			},
		});
	});

	it('players.delete returns the confirmation text rather than a bare flag', async () => {
		mockedRequest.mockResolvedValue({
			status: 'Ok',
			message: 'Player removed',
			data: {},
		});

		const result = await Players.remove(ctx, { id: 989 });

		expect(sentRequest()).toEqual({ method: 'DELETE', path: '/players/989' });
		expect(result).toEqual({ success: true, message: 'Player removed' });
	});

	it('fails a delete whose envelope carries no confirmation message', async () => {
		mockedRequest.mockResolvedValue({ status: 'Ok', data: {} });

		await expect(Players.remove(ctx, { id: 989 })).rejects.toThrow(
			/did not send a confirmation/,
		);
	});
});

describe('teams endpoints', () => {
	it('teams.list reads every team', async () => {
		mockedRequest.mockResolvedValue({
			status: 'Ok',
			data: { teams: [{ id: '3', name: 'The Bulls' }] },
		});

		const result = await Teams.list(ctx, {});

		expect(sentRequest()).toEqual({ method: 'GET', path: '/teams' });
		expect(result.teams[0]?.name).toBe('The Bulls');
	});

	it('teams.get reads one team', async () => {
		mockedRequest.mockResolvedValue({
			status: 'Ok',
			data: { id: '3', name: 'The Bulls' },
		});

		await Teams.get(ctx, { id: 3 });

		expect(sentRequest()).toEqual({ method: 'GET', path: '/teams/3' });
	});

	it('teams.create sends the icon and the filter flag', async () => {
		mockedRequest.mockResolvedValue({
			status: 'Ok',
			data: { team_id: '64' },
		});

		const result = await Teams.create(ctx, {
			team_name: 'The Bulls',
			icon: 'Bulls.png',
			filter_ignore: '1',
		});

		expect(sentRequest()).toEqual({
			method: 'POST',
			path: '/teams',
			body: { team_name: 'The Bulls', icon: 'Bulls.png', filter_ignore: '1' },
		});
		expect(result.team_id).toBe('64');
	});

	it('teams.update posts to the team path', async () => {
		mockedRequest.mockResolvedValue({
			status: 'Ok',
			data: { team_id: '989' },
		});

		await Teams.update(ctx, {
			id: 989,
			team_name: 'The Sharks',
			icon: 'Sharks.png',
		});

		expect(sentRequest()).toEqual({
			method: 'POST',
			path: '/teams/989',
			body: {
				team_name: 'The Sharks',
				icon: 'Sharks.png',
				filter_ignore: undefined,
			},
		});
	});

	it('teams.addPlayer posts the player identifier to the team path', async () => {
		mockedRequest.mockResolvedValue({
			status: 'Ok',
			message: 'Player added to team',
			data: {},
		});

		const result = await Teams.addPlayer(ctx, { id: 64, player_id: 121212 });

		expect(sentRequest()).toEqual({
			method: 'POST',
			path: '/teams/64/players',
			body: {
				player_id: 121212,
				player_external_id: undefined,
				player_email: undefined,
			},
		});
		expect(result).toEqual({ success: true, message: 'Player added to team' });
	});

	it('teams.listPlayers reads the team roster', async () => {
		mockedRequest.mockResolvedValue({
			status: 'Ok',
			data: { players: [{ profile_id: '23455', name: 'Bob' }] },
		});

		const result = await Teams.listPlayers(ctx, { id: 64 });

		expect(sentRequest()).toEqual({ method: 'GET', path: '/teams/64/players' });
		expect(result.players).toHaveLength(1);
	});

	it('teams.removePlayer deletes the membership path', async () => {
		mockedRequest.mockResolvedValue({
			status: 'Ok',
			message: 'Player removed from team',
			data: {},
		});

		const result = await Teams.removePlayer(ctx, { id: 64, player_id: 23455 });

		expect(sentRequest()).toEqual({
			method: 'DELETE',
			path: '/teams/64/23455',
		});
		expect(result.message).toBe('Player removed from team');
	});
});

describe('scoreSeries endpoints', () => {
	it('scoreSeries.list reads every series', async () => {
		mockedRequest.mockResolvedValue({
			status: 'Ok',
			data: { series: [{ id: '180', name: 'points' }] },
		});

		const result = await ScoreSeries.list(ctx, {});

		expect(sentRequest()).toEqual({ method: 'GET', path: '/scoreseries' });
		expect(result.series[0]?.name).toBe('points');
	});

	it('scoreSeries.get reads one series', async () => {
		mockedRequest.mockResolvedValue({
			status: 'Ok',
			data: { id: '180', name: 'points' },
		});

		await ScoreSeries.get(ctx, { id: 180 });

		expect(sentRequest()).toEqual({ method: 'GET', path: '/scoreseries/180' });
	});

	it('scoreSeries.addPoints sends tags as a JSON string and the score', async () => {
		mockedRequest.mockResolvedValue({
			status: 'Ok',
			message: 'Points added',
			data: { insid: '4011' },
		});

		const result = await ScoreSeries.addPoints(ctx, {
			player_email: 'harry@pointagram.com',
			scoreseries_name: 'Points',
			points: 120,
			comment: 'Good job!',
			source_score_id: 'order-991',
			tags: [{ name: 'North' }, { name: 'Services' }],
			create_player: true,
		});

		expect(sentRequest()).toEqual({
			method: 'POST',
			path: '/scoreseries/points',
			body: {
				player_id: undefined,
				player_name: undefined,
				player_email: 'harry@pointagram.com',
				player_external_id: undefined,
				scoreseries_id: undefined,
				scoreseries_name: 'Points',
				points: 120,
				pointtype_name: undefined,
				source_score_id: 'order-991',
				comment: 'Good job!',
				score_time: undefined,
				tags: '[{"name":"North"},{"name":"Services"}]',
				create_player: '1',
				create_tags: undefined,
			},
		});
		expect(result.insid).toBe('4011');
		// A series named in the input is customer data, so only the numeric id is
		// logged, and this call named the series instead.
		expect(mockedLog).toHaveBeenCalledWith(
			ctx,
			'pointagram.scoreSeries.addPoints',
			{ scoreSeriesId: undefined, transactionId: '4011' },
			'completed',
		);
	});

	it('scoreSeries.pointTypes reads the point types', async () => {
		mockedRequest.mockResolvedValue({
			status: 'Ok',
			data: { pointtypes: [{ id: '1', name: 'Dollar' }] },
		});

		const result = await ScoreSeries.pointTypes(ctx, { id: 180 });

		expect(sentRequest()).toEqual({
			method: 'GET',
			path: '/scoreseries/180/pointtypes',
		});
		expect(result.pointtypes[0]?.name).toBe('Dollar');
	});

	it('scoreSeries.history JSON-encodes each filter and sends show_revoked as 0/1', async () => {
		mockedRequest.mockResolvedValue({
			status: 'Ok',
			data: {
				history: [{ id: '863783', profile_id: '52278', score: '12' }],
				pagination: { limit: '10', offset: '5', next_offset: '15' },
			},
		});

		const result = await ScoreSeries.history(ctx, {
			id: 180,
			tags_filter: [{ id: '13', type: 1 }],
			teams_filter: ['20'],
			player_filter: ['19145'],
			time_from: '2022-12-05 23:00:00',
			time_to: '2022-12-06 23:00:00',
			show_revoked: true,
			limit: 10,
			offset: '5',
		});

		expect(sentRequest()).toEqual({
			method: 'GET',
			path: '/scoreseries/180/history',
			query: {
				tags_filter: '[{"id":"13","type":1}]',
				tags_or_filter: undefined,
				teams_filter: '["20"]',
				player_filter: '["19145"]',
				time_from: '2022-12-05 23:00:00',
				time_to: '2022-12-06 23:00:00',
				show_revoked: '1',
				limit: 10,
				offset: '5',
			},
		});
		expect(result.history[0]?.score).toBe('12');
		expect(result.pagination?.next_offset).toBe('15');
	});

	it('scoreSeries.history omits an empty filter rather than sending []', async () => {
		mockedRequest.mockResolvedValue({
			status: 'Ok',
			data: { history: [] },
		});

		await ScoreSeries.history(ctx, { id: 180, tags_filter: [] });

		expect(sentRequest().query?.tags_filter).toBeUndefined();
	});
});

describe('competitions endpoints', () => {
	it('competitions.list passes the documented filters', async () => {
		mockedRequest.mockResolvedValue({
			status: 'Ok',
			data: { competitions: [{ id: '3545', name: 'Q3' }] },
		});

		const result = await Competitions.list(ctx, {
			competition_id: '3545',
			accesskey: '11128Mj',
		});

		expect(sentRequest()).toEqual({
			method: 'GET',
			path: '/competitions',
			query: {
				search_by: undefined,
				filter: undefined,
				competition_id: '3545',
				accesskey: '11128Mj',
			},
		});
		expect(result.competitions[0]?.name).toBe('Q3');
	});

	it('competitions.get reads one competition', async () => {
		mockedRequest.mockResolvedValue({
			status: 'Ok',
			data: { id: '3545', competition_type: '4' },
		});

		const result = await Competitions.get(ctx, { id: 3545 });

		expect(sentRequest()).toEqual({
			method: 'GET',
			path: '/competitions/3545',
		});
		expect(result.competition_type).toBe('4');
	});

	it('competitions.players reads the standings', async () => {
		mockedRequest.mockResolvedValue({
			status: 'Ok',
			data: {
				players: [{ profile_id: '1246', rank: '1', current_score: '0.00' }],
			},
		});

		const result = await Competitions.players(ctx, { id: 3545 });

		expect(sentRequest()).toEqual({
			method: 'GET',
			path: '/competitions/3545/players',
		});
		expect(result.players[0]?.rank).toBe('1');
	});
});

describe('rewardStore endpoints', () => {
	it('rewardStore.settings sends the required profileid', async () => {
		mockedRequest.mockResolvedValue({
			status: 'Ok',
			data: { id: '1', name: 'Store', active: '1' },
		});

		const result = await RewardStore.settings(ctx, { profileid: '1234' });

		expect(sentRequest()).toEqual({
			method: 'GET',
			path: '/rewardstore/settings',
			query: { profileid: '1234' },
		});
		expect(result.name).toBe('Store');
	});

	it('rewardStore.items sends profileid and the optional storeid', async () => {
		mockedRequest.mockResolvedValue({
			status: 'Ok',
			data: { reward_items: [{ id: '23', name: 'car', price: '20' }] },
		});

		const result = await RewardStore.items(ctx, {
			profileid: '1234',
			storeid: '7',
		});

		expect(sentRequest()).toEqual({
			method: 'GET',
			path: '/rewardstore/items',
			query: { profileid: '1234', storeid: '7' },
		});
		expect(result.reward_items[0]?.name).toBe('car');
	});

	it('rewardStore.item reads one item under its path', async () => {
		mockedRequest.mockResolvedValue({
			status: 'Ok',
			data: { id: '23', name: 'car', startDate: '2023-06-16 08:21:00' },
		});

		const result = await RewardStore.item(ctx, {
			id: 23,
			profileid: '1234',
		});

		expect(sentRequest()).toEqual({
			method: 'GET',
			path: '/rewardstore/items/23',
			query: { profileid: '1234', storeid: undefined },
		});
		expect(result.startDate).toBe('2023-06-16 08:21:00');
	});

	it('rewardStore.purchases sends viewmember when asked for another member', async () => {
		mockedRequest.mockResolvedValue({
			status: 'Ok',
			data: { purchases: [{ id: '23', deliverystatus: 'PURCHASED' }] },
		});

		const result = await RewardStore.purchases(ctx, {
			profileid: '1234',
			viewmember: 'all',
		});

		expect(sentRequest()).toEqual({
			method: 'GET',
			path: '/rewardstore/purchases',
			query: { profileid: '1234', viewmember: 'all', storeid: undefined },
		});
		expect(result.purchases[0]?.deliverystatus).toBe('PURCHASED');
	});

	it('rewardStore.purchase sends the documented string body', async () => {
		mockedRequest.mockResolvedValue({
			status: 'Ok',
			message: 'Purchase successful',
			data: { purchase_id: '27' },
		});

		const result = await RewardStore.purchase(ctx, {
			profileid: '1234',
			quantity: 2,
			itemid: 23,
		});

		expect(sentRequest()).toEqual({
			method: 'POST',
			path: '/rewardstore/purchase',
			body: { profileid: '1234', quantity: '2', itemid: '23' },
		});
		expect(result.purchase_id).toBe('27');
	});

	it('rewardStore.updatePurchase posts the new delivery status', async () => {
		mockedRequest.mockResolvedValue({
			status: 'Ok',
			message: 'Delivery status updated',
			data: {},
		});

		const result = await RewardStore.updatePurchase(ctx, {
			id: 27,
			profileid: '1234',
			deliverystatus: 'PROCESSED',
		});

		expect(sentRequest()).toEqual({
			method: 'POST',
			path: '/rewardstore/purchase/27',
			body: { profileid: '1234', deliverystatus: 'PROCESSED' },
		});
		expect(result).toEqual({
			success: true,
			message: 'Delivery status updated',
		});
	});

	it('rewardStore.revokePurchase deletes the order with profileid in the query', async () => {
		mockedRequest.mockResolvedValue({
			status: 'Ok',
			message: 'Purchase revoked',
			data: {},
		});

		const result = await RewardStore.revokePurchase(ctx, {
			id: 27,
			profileid: '1234',
		});

		expect(sentRequest()).toEqual({
			method: 'DELETE',
			path: '/rewardstore/purchase/27',
			query: { profileid: '1234' },
		});
		expect(result.message).toBe('Purchase revoked');
	});
});

describe('credential resolution', () => {
	it('reads Api-User only from the account, never from plugin options', async () => {
		mockedRequest.mockResolvedValue({
			status: 'Ok',
			data: { teams: [] },
		});
		// A credential left in options must not be picked up: the account field is
		// the only source R8 allows.
		const ctxWithOption = {
			...ctx,
			options: { apiUser: 'option@example.com' },
		} as typeof ctx;

		await Teams.list(ctxWithOption, {});

		expect(sentCredentials()).toEqual({
			apiKey: 'key-abc',
			apiUser: 'ops@example.com',
		});
	});
});
