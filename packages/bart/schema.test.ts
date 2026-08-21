import {
	BartAdvisory,
	BartRoute,
	BartSchema,
	BartStation,
	safeDateSchema,
} from './schema';

describe('Bart schema & entities', () => {
	it('declares a semver version', () => {
		expect(BartSchema.version).toBeDefined();
		expect(BartSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map with stations, routes, and advisories', () => {
		expect(typeof BartSchema.entities).toBe('object');
		expect(BartSchema.entities).not.toBeNull();
		expect(BartSchema.entities.stations).toBeDefined();
		expect(BartSchema.entities.routes).toBeDefined();
		expect(BartSchema.entities.advisories).toBeDefined();
	});

	it('validates safeDateSchema with valid and invalid dates', () => {
		const validDateStr = '2026-08-21T12:00:00Z';
		const parsedValid = safeDateSchema.parse(validDateStr);
		expect(parsedValid).toBeInstanceOf(Date);
		expect(parsedValid && !Number.isNaN(parsedValid.getTime())).toBe(true);

		const invalidDateStr = 'not-a-real-date';
		const parsedInvalid = safeDateSchema.parse(invalidDateStr);
		expect(parsedInvalid).toBeUndefined();

		expect(safeDateSchema.parse(null)).toBeNull();
		expect(safeDateSchema.parse(undefined)).toBeUndefined();
	});

	it('validates BartStation entity parsing', () => {
		const stationData = {
			id: '12TH',
			name: '12th St. Oakland City Center',
			abbr: '12TH',
			gtfs_latitude: '37.803768',
			gtfs_longitude: '-122.271450',
			address: '1245 Broadway',
			city: 'Oakland',
			county: 'alameda',
			state: 'CA',
			zipcode: '94612',
			createdAt: '2026-08-21T12:00:00Z',
		};

		const parsed = BartStation.parse(stationData);
		expect(parsed.id).toBe('12TH');
		expect(parsed.name).toBe('12th St. Oakland City Center');
		expect(parsed.createdAt).toBeInstanceOf(Date);
	});

	it('validates BartRoute entity parsing', () => {
		const routeData = {
			id: 'ROUTE 1',
			routeID: 'ROUTE 1',
			number: '1',
			name: 'Antioch to SFIA/Millbrae',
			abbr: 'ANTC-SFIA',
			origin: 'ANTC',
			destination: 'SFIA',
			color: '#ffff33',
			hexcolor: '#ffff33',
		};

		const parsed = BartRoute.parse(routeData);
		expect(parsed.id).toBe('ROUTE 1');
		expect(parsed.name).toBe('Antioch to SFIA/Millbrae');
	});

	it('validates BartAdvisory entity parsing', () => {
		const advisoryData = {
			id: 'SYSTEM-1',
			station: 'SYSTEM',
			type: 'DELAY',
			description: '10 minute delay on Antioch line',
			posted: '2026-08-21T12:00:00Z',
		};

		const parsed = BartAdvisory.parse(advisoryData);
		expect(parsed.id).toBe('SYSTEM-1');
		expect(parsed.type).toBe('DELAY');
		expect(parsed.posted).toBeInstanceOf(Date);
	});
});
