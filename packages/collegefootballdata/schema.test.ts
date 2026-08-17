/**
 * Guards the persisted entity schemas against the two ways they go wrong:
 * dropping a field the provider actually returns, and requiring a field it
 * sometimes omits.
 *
 * Every key list below was captured from live responses against a real
 * College Football Data account on 2026-08-17 (see `CFBD-PLAN.md` and
 * `endpoints/types.ts` for the exact requests).
 */

import { CollegeFootballDataSchema } from './schema';
import {
	CollegeFootballDataCoachEntity,
	CollegeFootballDataConferenceEntity,
	CollegeFootballDataTeamEntity,
	CollegeFootballDataVenueEntity,
} from './schema/database';

describe('College Football Data schema', () => {
	it('declares a semver version', () => {
		expect(CollegeFootballDataSchema.version).toBeDefined();
		expect(CollegeFootballDataSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof CollegeFootballDataSchema.entities).toBe('object');
		expect(CollegeFootballDataSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(CollegeFootballDataSchema.entities))).toBe(
			true,
		);
		for (const entity of Object.values(CollegeFootballDataSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});

	it('registers exactly the four reference-data entities', () => {
		expect(Object.keys(CollegeFootballDataSchema.entities).sort()).toEqual([
			'coaches',
			'conferences',
			'teams',
			'venues',
		]);
	});
});

const LIVE_KEYS = {
	teams: [
		'id',
		'school',
		'mascot',
		'abbreviation',
		'alternateNames',
		'conference',
		'division',
		'classification',
		'color',
		'alternateColor',
		'logos',
		'twitter',
		'location',
	],
	conferences: [
		'id',
		'name',
		'shortName',
		'abbreviation',
		'classification',
		'memberCount',
	],
	venues: [
		'id',
		'name',
		'capacity',
		'grass',
		'dome',
		'city',
		'state',
		'zip',
		'countryCode',
		'timezone',
		'latitude',
		'longitude',
		'elevation',
		'constructionYear',
	],
	coaches: ['id', 'firstName', 'lastName', 'hireDate'],
} as const;

const ENTITIES = {
	teams: CollegeFootballDataTeamEntity,
	conferences: CollegeFootballDataConferenceEntity,
	venues: CollegeFootballDataVenueEntity,
	coaches: CollegeFootballDataCoachEntity,
} as const;

describe('entity schemas declare every observed field', () => {
	for (const [name, schema] of Object.entries(ENTITIES)) {
		it(`${name} declares all ${LIVE_KEYS[name as keyof typeof LIVE_KEYS].length} keys`, () => {
			const declared = schema.shape;
			for (const key of LIVE_KEYS[name as keyof typeof LIVE_KEYS]) {
				expect(declared).toHaveProperty(key);
			}
		});
	}
});

describe('entity schemas require only what the live API always sends', () => {
	/**
	 * Every field beyond the ones below is optional: the provider omits or
	 * nulls fields depending on the resource's own completeness (a venue
	 * with no roof data, a team with no logos). A schema that required more
	 * than these would reject those valid rows outright, which is the
	 * failure mode that matters: a rejected row is a lost row.
	 */
	const minimal = {
		teams: { id: 1, school: 'Example' },
		conferences: { id: 1, name: 'Example Conference' },
		venues: { id: 1, name: 'Example Stadium' },
		coaches: { id: 1 },
	} as const;

	for (const [name, schema] of Object.entries(ENTITIES)) {
		it(`${name} parses a record carrying only its required fields`, () => {
			const result = schema.safeParse(minimal[name as keyof typeof minimal]);
			expect(result.success).toBe(true);
		});
	}
});

describe('entity schemas keep unknown fields', () => {
	it('preserves a field the provider adds later rather than dropping it', () => {
		const parsed = CollegeFootballDataTeamEntity.parse({
			id: 1,
			school: 'Example',
			some_future_field: 'kept',
		});

		expect(parsed).toHaveProperty('some_future_field', 'kept');
	});
});

describe('entity schemas reject a record with no key', () => {
	it('rejects a team with no id', () => {
		expect(
			CollegeFootballDataTeamEntity.safeParse({ school: 'Nameless' }).success,
		).toBe(false);
	});

	it('rejects a conference with no id', () => {
		expect(
			CollegeFootballDataConferenceEntity.safeParse({ name: 'Nameless' })
				.success,
		).toBe(false);
	});

	it('rejects a venue with no id', () => {
		expect(
			CollegeFootballDataVenueEntity.safeParse({ name: 'Nameless' }).success,
		).toBe(false);
	});

	it('rejects a coach with no id', () => {
		expect(
			CollegeFootballDataCoachEntity.safeParse({ firstName: 'Nameless' })
				.success,
		).toBe(false);
	});
});
