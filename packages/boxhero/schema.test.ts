/**
 * Validates that every official BoxHero key we persist is declared.
 * https://rest.boxhero-app.com/docs/spec
 */

import { BoxheroSchema } from './schema';
import {
	BoxheroAttrEntity,
	BoxheroItemEntity,
	BoxheroLocationEntity,
	BoxheroMemberEntity,
	BoxheroPartnerEntity,
	BoxheroTeamEntity,
} from './schema/database';

const TEAM_KEYS = [
	'id',
	'name',
	'mode',
	'currency_symbol',
	'currency_code',
	'price_decimal_places',
	'memo',
];
const MEMBER_KEYS = ['id', 'name', 'role'];
const LOCATION_KEYS = ['id', 'name', 'quantity', 'memo'];
const PARTNER_KEYS = [
	'id',
	'type',
	'name',
	'phone',
	'email',
	'address',
	'memo',
];
const ITEM_KEYS = [
	'id',
	'name',
	'sku',
	'barcode',
	'photo_url',
	'attrs',
	'cost',
	'price',
	'quantity',
	'quantities',
];
const ATTR_KEYS = ['id', 'attr_type', 'attr_name', 'rank'];

describe('BoxHero schema', () => {
	it('declares a semver version', () => {
		expect(BoxheroSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('mirrors the entities the plugin persists', () => {
		expect(Object.keys(BoxheroSchema.entities).sort()).toEqual([
			'attr',
			'item',
			'location',
			'member',
			'partner',
			'team',
			'transaction',
		]);
	});

	describe('every documented key is declared', () => {
		const cases: [string, { shape: Record<string, unknown> }, string[]][] = [
			['team', BoxheroTeamEntity, TEAM_KEYS],
			['member', BoxheroMemberEntity, MEMBER_KEYS],
			['location', BoxheroLocationEntity, LOCATION_KEYS],
			['partner', BoxheroPartnerEntity, PARTNER_KEYS],
			['item', BoxheroItemEntity, ITEM_KEYS],
			['attr', BoxheroAttrEntity, ATTR_KEYS],
		];

		for (const [label, entity, capturedKeys] of cases) {
			it(`declares every ${label} key`, () => {
				const declared = Object.keys(entity.shape);
				const undeclared = capturedKeys.filter((k) => !declared.includes(k));
				expect(undeclared).toEqual([]);
			});
		}
	});

	it('rejects empty objects', () => {
		expect(BoxheroTeamEntity.safeParse({}).success).toBe(false);
		expect(BoxheroItemEntity.safeParse({}).success).toBe(false);
		expect(BoxheroLocationEntity.safeParse({}).success).toBe(false);
	});

	it('accepts a documented team and item', () => {
		expect(
			BoxheroTeamEntity.safeParse({
				id: 352332,
				name: 'g',
				mode: 2,
				currency_symbol: '$',
				currency_code: 'USD',
				price_decimal_places: 2,
				memo: null,
			}).success,
		).toBe(true);
		expect(
			BoxheroItemEntity.safeParse({
				id: 1,
				name: 'Powder',
				sku: 'SKU-1',
				barcode: '1',
				photo_url: null,
				attrs: [],
				cost: '1.00',
				price: '2.00',
				quantity: 0,
				quantities: [],
			}).success,
		).toBe(true);
	});
});
