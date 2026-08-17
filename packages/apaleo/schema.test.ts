import { ApaleoEndpointInputSchemas } from './endpoints/types';
import { ApaleoSchema } from './schema';
import {
	ApaleoPropertyEntity,
	ApaleoUnitAttributeEntity,
	ApaleoUnitEntity,
	ApaleoUnitGroupEntity,
} from './schema/database';

/**
 * Official Inventory V1 property/unit/unit-group/unit-attribute keys.
 * https://api.apaleo.com/swagger/inventory-v1/swagger.json
 */
const PROPERTY_KEYS = [
	'id',
	'code',
	'propertyTemplateId',
	'isTemplate',
	'name',
	'description',
	'companyName',
	'managingDirectors',
	'commercialRegisterEntry',
	'taxId',
	'location',
	'bankAccount',
	'paymentTerms',
	'timeZone',
	'currencyCode',
	'created',
	'status',
	'isArchived',
	'actions',
] as const;

const UNIT_KEYS = [
	'id',
	'name',
	'description',
	'property',
	'unitGroup',
	'connectingUnit',
	'status',
	'maxPersons',
	'created',
	'archived',
	'isArchived',
	'attributes',
	'connectedUnits',
	'actions',
] as const;

const UNIT_GROUP_KEYS = [
	'id',
	'code',
	'property',
	'name',
	'memberCount',
	'description',
	'maxPersons',
	'rank',
	'type',
	'connectedUnitGroups',
] as const;

const UNIT_ATTRIBUTE_KEYS = ['id', 'name', 'description'] as const;

function shapeKeys(schema: { shape: Record<string, unknown> }): string[] {
	return Object.keys(schema.shape);
}

describe('Apaleo schema', () => {
	it('registers the four Inventory entities', () => {
		expect(Object.keys(ApaleoSchema.entities).sort()).toEqual([
			'properties',
			'unitAttributes',
			'unitGroups',
			'units',
		]);
	});

	it('declares every official PropertyModel field', () => {
		expect(shapeKeys(ApaleoPropertyEntity)).toEqual([...PROPERTY_KEYS]);
	});

	it('declares every official UnitModel field', () => {
		expect(shapeKeys(ApaleoUnitEntity)).toEqual([...UNIT_KEYS]);
	});

	it('declares every official UnitGroupModel field', () => {
		expect(shapeKeys(ApaleoUnitGroupEntity)).toEqual([...UNIT_GROUP_KEYS]);
	});

	it('declares every official UnitAttributeDefinitionModel field', () => {
		expect(shapeKeys(ApaleoUnitAttributeEntity)).toEqual([
			...UNIT_ATTRIBUTE_KEYS,
		]);
	});

	it('accepts the swagger PropertyModel example', () => {
		const parsed = ApaleoPropertyEntity.safeParse({
			id: 'MUC',
			code: 'MUC',
			propertyTemplateId: 'BER',
			isTemplate: false,
			name: { en: 'Demo Hotel Munich', de: 'Demo Hotel München' },
			description: { en: 'This is the demo hotel Munich' },
			companyName: 'Hotel Münchner GmbH',
			managingDirectors: 'Franz-Josef Gruber',
			commercialRegisterEntry: 'Amtsgericht München, HRB 279336',
			taxId: 'DE311053702',
			location: {
				addressLine1: 'Marienplatz 1',
				postalCode: '80331',
				city: 'München',
				countryCode: 'DE',
			},
			bankAccount: {
				iban: 'DE44 5001 0517 5407 3249 31',
				bic: 'SSKMDEMMXXX',
				bank: 'Stadtsparkasse München',
			},
			paymentTerms: { en: 'Pay on checkout' },
			timeZone: 'Europe/Berlin',
			currencyCode: 'EUR',
			created: '2020-04-08T21:53:26+02:00',
			status: 'Test',
			isArchived: false,
		});
		expect(parsed.success).toBe(true);
	});

	it('accepts list-item string name on the same property entity', () => {
		expect(
			ApaleoPropertyEntity.safeParse({
				id: 'MUC',
				code: 'MUC',
				name: 'Demo Hotel Munich',
				description: 'This is the demo hotel Munich',
				status: 'Test',
				isArchived: false,
			}).success,
		).toBe(true);
	});

	it('rejects a property without id', () => {
		expect(ApaleoPropertyEntity.safeParse({ code: 'MUC' }).success).toBe(false);
	});
});

describe('Apaleo inputs', () => {
	it('requires official create-property fields', () => {
		expect(
			ApaleoEndpointInputSchemas.propertiesCreate.safeParse({
				code: 'CRS',
				name: { en: 'Probe' },
				companyName: 'Probe GmbH',
				commercialRegisterEntry: 'HRB 1',
				taxId: 'DE1',
				location: {
					addressLine1: 'Street 1',
					postalCode: '10115',
					city: 'Berlin',
					countryCode: 'DE',
				},
				paymentTerms: { en: 'Pay on checkout' },
				timeZone: 'Europe/Berlin',
				defaultCheckInTime: '17:00:00',
				defaultCheckOutTime: '11:00:00',
				currencyCode: 'EUR',
			}).success,
		).toBe(true);
		expect(
			ApaleoEndpointInputSchemas.propertiesCreate.safeParse({ code: 'X' })
				.success,
		).toBe(false);
	});

	it('rejects pageSize above the official 500 cap', () => {
		expect(
			ApaleoEndpointInputSchemas.unitsList.safeParse({ pageSize: 501 }).success,
		).toBe(false);
		expect(
			ApaleoEndpointInputSchemas.unitsList.safeParse({ pageSize: 500 }).success,
		).toBe(true);
	});
});
