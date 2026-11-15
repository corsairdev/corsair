import {
	CompetitionSchema,
	HistoryEntrySchema,
	normalizeFlag,
	PlayerSchema,
	PointagramEndpointInputSchemas,
	RewardItemSchema,
	ScoreSeriesAddPointsInputSchema,
	ScoreSeriesHistoryInputSchema,
	TeamSchema,
	TeamsAddPlayerInputSchema,
} from './endpoints/types';
import { PointagramSchema } from './schema';

describe('Pointagram plugin schema', () => {
	it('declares a semver version', () => {
		expect(PointagramSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares no entities, because the plugin stores nothing', () => {
		expect(PointagramSchema.entities).toEqual({});
		// Object.keys is always an array, so the value itself is what proves it.
		expect(Array.isArray(PointagramSchema.entities)).toBe(false);
	});
});

describe('flag normalization', () => {
	it('turns every accepted spelling into the documented 1 or 0', () => {
		expect(normalizeFlag(true)).toBe('1');
		expect(normalizeFlag('1')).toBe('1');
		expect(normalizeFlag(1)).toBe('1');
		expect(normalizeFlag(false)).toBe('0');
		expect(normalizeFlag('0')).toBe('0');
		expect(normalizeFlag(0)).toBe('0');
		expect(normalizeFlag(undefined)).toBeUndefined();
	});

	it('rejects a flag value the API does not accept', () => {
		expect(
			PointagramEndpointInputSchemas.playersCreate.safeParse({
				player_name: 'Axl',
				offline: 'yes',
			}).success,
		).toBe(false);
	});
});

describe('player schemas', () => {
	it('parses the list shape and the single-player shape', () => {
		expect(
			PlayerSchema.safeParse({
				id: '527947',
				name: 'Axl Rose',
				emailaddress: 'axl@pointagram.com',
				external_id: '121212',
				is_org_admin: '1',
			}).success,
		).toBe(true);

		expect(
			PlayerSchema.safeParse({
				player_name: 'Axl Rose',
				player_email: 'axl@pointagram.com',
				player_external_id: '121212',
			}).success,
		).toBe(true);
	});

	it('requires a player name on create', () => {
		expect(
			PointagramEndpointInputSchemas.playersCreate.safeParse({
				player_name: '',
			}).success,
		).toBe(false);
		expect(
			PointagramEndpointInputSchemas.playersCreate.safeParse({}).success,
		).toBe(false);
	});
});

describe('team schemas', () => {
	it('parses a team', () => {
		expect(
			TeamSchema.safeParse({
				id: '3',
				name: 'The Bulls',
				icon: 'Bulls.png',
				icon_url: 'https://s3-eu-west-1.amazonaws.com/team/Bulls.png',
			}).success,
		).toBe(true);
	});

	it('requires one player identifier to add a player', () => {
		const schema = TeamsAddPlayerInputSchema;
		expect(schema.safeParse({ id: 64, player_id: 1 }).success).toBe(true);
		expect(schema.safeParse({ id: 64, player_email: 'a@b.com' }).success).toBe(
			true,
		);
		expect(schema.safeParse({ id: 64, player_external_id: 'x1' }).success).toBe(
			true,
		);
		expect(schema.safeParse({ id: 64 }).success).toBe(false);
		// An empty string is not an identifier.
		expect(schema.safeParse({ id: 64, player_email: '' }).success).toBe(false);
	});
});

describe('score series schemas', () => {
	it('parses a score series and a history row', () => {
		expect(
			PointagramEndpointInputSchemas.scoreSeriesList.safeParse({}).success,
		).toBe(true);

		expect(
			HistoryEntrySchema.safeParse({
				profile_id: '52278',
				name: 'Harry',
				emailaddress: 'harry@pointagram.com',
				score: '12',
				comment: 'Good Job!',
				timestamp: '2023-06-15 11:57:56',
				id: '863783',
			}).success,
		).toBe(true);
	});

	it('requires a player, a score series and an amount', () => {
		const valid = {
			player_id: 121212,
			scoreseries_id: 180,
			points: 120,
		};
		expect(ScoreSeriesAddPointsInputSchema.safeParse(valid).success).toBe(true);

		expect(
			ScoreSeriesAddPointsInputSchema.safeParse({
				...valid,
				player_id: undefined,
			}).success,
		).toBe(false);
		expect(
			ScoreSeriesAddPointsInputSchema.safeParse({
				...valid,
				scoreseries_id: undefined,
			}).success,
		).toBe(false);
		expect(
			ScoreSeriesAddPointsInputSchema.safeParse({
				...valid,
				points: undefined,
			}).success,
		).toBe(false);
	});

	it('rejects both a score series id and name, which the API treats as one field', () => {
		expect(
			ScoreSeriesAddPointsInputSchema.safeParse({
				player_id: 121212,
				scoreseries_id: 180,
				scoreseries_name: 'Points',
				points: 5,
			}).success,
		).toBe(false);
	});

	it('accepts a point type instead of a raw point count', () => {
		expect(
			ScoreSeriesAddPointsInputSchema.safeParse({
				player_id: 121212,
				scoreseries_id: 180,
				pointtype_name: 'Dollar',
			}).success,
		).toBe(true);
	});

	it('rejects both points and pointtype_name, which the API treats as one field', () => {
		expect(
			ScoreSeriesAddPointsInputSchema.safeParse({
				player_id: 121212,
				scoreseries_id: 180,
				points: 5,
				pointtype_name: 'Dollar',
			}).success,
		).toBe(false);
	});

	it('caps the history page size at the documented maximum', () => {
		expect(
			ScoreSeriesHistoryInputSchema.safeParse({ id: 180, limit: 1000 }).success,
		).toBe(true);
		expect(
			ScoreSeriesHistoryInputSchema.safeParse({ id: 180, limit: 1001 }).success,
		).toBe(false);
		expect(
			ScoreSeriesHistoryInputSchema.safeParse({ id: 180, limit: 0 }).success,
		).toBe(false);
	});

	it('round-trips a pagination cursor, which the provider returns as a number too', () => {
		const page = ScoreSeriesHistoryInputSchema.parse({
			id: 180,
			offset: 527947,
		});
		expect(page.offset).toBe(527947);
		expect(
			ScoreSeriesHistoryInputSchema.safeParse({ id: 180, offset: '527947' })
				.success,
		).toBe(true);
		expect(
			ScoreSeriesHistoryInputSchema.safeParse({ id: 180, offset: '' }).success,
		).toBe(false);
	});
});

describe('competition schemas', () => {
	it('parses a competition with the provider spelling of its fields', () => {
		const parsed = CompetitionSchema.safeParse({
			id: '3545',
			name: 'Q3',
			start_date: '2023-06-15 08:21:00',
			end_date: '2023-06-16 08:21:00',
			grand_target: '0',
			invindual_player_targets: '0',
			is_stopped: '0',
			access_key: '11128Mj',
			competition_type: '4',
			db_display_order: 'Id',
			use_target: '1',
			winner_rule: '2',
			groupingmode: '2',
		});

		expect(parsed.success).toBe(true);
	});
});

describe('reward store schemas', () => {
	it('parses an item whose fields mix spellings and numeric types', () => {
		expect(
			RewardItemSchema.safeParse({
				id: '23',
				name: 'car',
				image: 'car.png',
				currency: '1',
				price: '20',
				stock: 34,
				startDate: '2023-06-16 08:21:00',
				endDate: null,
				publishphase: '1',
				description: 'A car',
				scoreseriesid: '12',
				currencyname: 'coins',
				coins: '30',
				tags: [{ id: '11', name: 'my store', linkid: '21' }],
			}).success,
		).toBe(true);
	});

	it('accepts a null delivered_date, which an undelivered order carries', () => {
		expect(
			PointagramEndpointInputSchemas.rewardStorePurchases.safeParse({
				profileid: '1234',
			}).success,
		).toBe(true);
	});

	it('rejects an empty profileid, which every store route requires', () => {
		expect(
			PointagramEndpointInputSchemas.rewardStoreSettings.safeParse({
				profileid: '',
			}).success,
		).toBe(false);
		expect(
			PointagramEndpointInputSchemas.rewardStoreSettings.safeParse({}).success,
		).toBe(false);
	});

	it('accepts only the three documented delivery statuses', () => {
		const schema = PointagramEndpointInputSchemas.rewardStoreUpdatePurchase;
		for (const status of ['PURCHASED', 'PROCESSED', 'DELIVERED']) {
			expect(
				schema.safeParse({ id: 27, profileid: '1', deliverystatus: status })
					.success,
			).toBe(true);
		}
		expect(
			schema.safeParse({ id: 27, profileid: '1', deliverystatus: 'SHIPPED' })
				.success,
		).toBe(false);
	});

	it('requires a positive integer quantity on a purchase', () => {
		expect(
			PointagramEndpointInputSchemas.rewardStorePurchase.safeParse({
				profileid: '1234',
				quantity: 2,
				itemid: 23,
			}).success,
		).toBe(true);
		expect(
			PointagramEndpointInputSchemas.rewardStorePurchase.safeParse({
				profileid: '1234',
				quantity: 0,
				itemid: 23,
			}).success,
		).toBe(false);
		expect(
			PointagramEndpointInputSchemas.rewardStorePurchase.safeParse({
				profileid: '1234',
				quantity: 1.5,
				itemid: 23,
			}).success,
		).toBe(false);
	});
});
