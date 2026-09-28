import {
	ExistAttribute,
	ExistAttributeValue,
	ExistAverage,
	ExistCorrelation,
	ExistInsight,
	ExistProfile,
	ExistSchema,
} from './schema';

describe('Exist schema', () => {
	it('declares a semver version', () => {
		expect(ExistSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entity per stored Exist object type', () => {
		expect(Object.keys(ExistSchema.entities).sort()).toEqual([
			'attributeValues',
			'attributes',
			'averages',
			'correlations',
			'insights',
			'profile',
		]);
		for (const entity of Object.values(ExistSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});

	it('keys the profile by username', () => {
		const parsed = ExistProfile.parse({ id: 'josh', username: 'josh' });
		expect(parsed.id).toBe('josh');
	});

	it('accepts a custom attribute with no template and no owning service', () => {
		const parsed = ExistAttribute.parse({
			id: 'coffees',
			name: 'coffees',
			label: 'Coffees',
			template: null,
			service_name: null,
			value_type: 0,
		});
		expect(parsed.template).toBeNull();
		expect(parsed.service_name).toBeNull();
	});

	it('stores attribute values of every Exist value type, including null', () => {
		const base = { id: 'x', attribute: 'x', date: '2022-05-16' };
		expect(ExistAttributeValue.parse({ ...base, value: 1533 }).value).toBe(
			1533,
		);
		expect(ExistAttributeValue.parse({ ...base, value: 'a note' }).value).toBe(
			'a note',
		);
		expect(ExistAttributeValue.parse({ ...base, value: true }).value).toBe(
			true,
		);
		expect(
			ExistAttributeValue.parse({ ...base, value: null }).value,
		).toBeNull();
	});

	it('allows day averages to be null', () => {
		const parsed = ExistAverage.parse({
			id: 'steps:2020-04-29',
			attribute: 'steps',
			date: '2020-04-29',
			overall: 4174,
			monday: null,
		});
		expect(parsed.monday).toBeNull();
	});

	it('keys a correlation by both attributes and its generation date', () => {
		const parsed = ExistCorrelation.parse({
			id: 'sleep:sleep_start:2022-05-16',
			attribute: 'sleep',
			attribute2: 'sleep_start',
			date: '2022-05-16',
			stars: 5,
		});
		expect(parsed.id).toBe('sleep:sleep_start:2022-05-16');
	});

	it('allows an insight with no target date or attribute', () => {
		const parsed = ExistInsight.parse({
			id: 'week_summary:2022-05-16',
			type_name: 'week_summary',
			target_date: null,
			attribute: null,
		});
		expect(parsed.target_date).toBeNull();
	});

	it('rejects an entity that is missing its id', () => {
		expect(ExistAttribute.safeParse({ name: 'steps' }).success).toBe(false);
	});
});
