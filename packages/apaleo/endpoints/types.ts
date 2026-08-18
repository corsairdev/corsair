import { z } from 'zod';
import {
	APALEO_MAINTENANCE_TYPE,
	APALEO_PROPERTY_STATUS,
	APALEO_UNIT_CONDITION,
	APALEO_UNIT_GROUP_TYPE,
	APALEO_UNIT_STATUS_FILTER,
	ApaleoPropertyEntity,
	ApaleoUnitAttributeEntity,
	ApaleoUnitEntity,
	ApaleoUnitGroupEntity,
} from '../schema/database';
import { Localized } from '../schema/primitives';

const PageQuery = {
	pageNumber: z.number().int().min(1).optional(),
	pageSize: z.number().int().min(1).max(500).optional(),
};

const InventoryCode = z
	.string()
	.min(3)
	.max(10)
	.regex(/^[a-zA-Z0-9_]+$/);

const AddressInput = z.object({
	addressLine1: z.string().min(1),
	addressLine2: z.string().nullable().optional(),
	postalCode: z.string().min(1),
	city: z.string().min(1),
	regionCode: z.string().nullable().optional(),
	countryCode: z.string().min(2).max(2),
});

const BankAccountInput = z
	.object({
		iban: z.string().optional(),
		bic: z.string().optional(),
		bank: z.string().optional(),
	})
	.optional();

const CreatePropertyFields = {
	code: InventoryCode,
	name: z.record(z.string(), z.string().nullable()),
	companyName: z.string().min(1),
	managingDirectors: z.string().min(1).nullable().optional(),
	commercialRegisterEntry: z.string().min(1),
	taxId: z.string().min(1),
	description: Localized,
	location: AddressInput,
	bankAccount: BankAccountInput,
	paymentTerms: z.record(z.string(), z.string().nullable()),
	timeZone: z.string().min(1),
	defaultCheckInTime: z.string().min(1),
	defaultCheckOutTime: z.string().min(1),
	currencyCode: z.string().min(1),
};

const CreateUnitAttributeRef = z.object({ id: z.string().min(1) });
const CreateConnectedUnit = z.object({ unitId: z.string().min(1) });
const CreateConnectedUnitGroup = z.object({
	unitGroupId: z.string().min(1),
	memberCount: z.number().int().min(1),
});

const CreateUnitFields = {
	propertyId: z.string().min(1),
	name: z.string().min(1),
	description: z.record(z.string(), z.string().nullable()),
	unitGroupId: z.string().min(1).nullable().optional(),
	maxPersons: z.number().int().min(1),
	condition: z.enum(APALEO_UNIT_CONDITION).nullable().optional(),
	attributes: z.array(CreateUnitAttributeRef).nullable().optional(),
	connectedUnits: z.array(CreateConnectedUnit).nullable().optional(),
};

export const EmptyOkSchema = z.object({ ok: z.literal(true) });
export const ExistsSchema = z.object({ exists: z.boolean() });
export const IdCreatedSchema = z.object({ id: z.string() });
export const CountSchema = z.object({ count: z.number() });
export const IdsCreatedSchema = z.object({ ids: z.array(z.string()) });

export const PropertiesListInputSchema = z
	.object({
		status: z.array(z.enum(APALEO_PROPERTY_STATUS)).optional(),
		includeArchived: z.boolean().optional(),
		countryCode: z.array(z.string()).optional(),
		expand: z.array(z.string()).optional(),
		...PageQuery,
	})
	.optional();

export const PropertiesListOutputSchema = z.object({
	properties: z.array(ApaleoPropertyEntity),
	count: z.number(),
});

export const PropertiesCreateInputSchema = z.object(CreatePropertyFields);
export const PropertiesCreateOutputSchema = IdCreatedSchema;

export const PropertiesCountInputSchema = z
	.object({
		status: z.array(z.enum(APALEO_PROPERTY_STATUS)).optional(),
		includeArchived: z.boolean().optional(),
		countryCode: z.array(z.string()).optional(),
	})
	.optional();
export const PropertiesCountOutputSchema = CountSchema;

export const PropertiesIdInputSchema = z.object({ id: z.string().min(1) });
export const PropertiesGetOutputSchema = ApaleoPropertyEntity;
export const PropertiesExistsOutputSchema = ExistsSchema;
export const PropertiesEmptyOutputSchema = EmptyOkSchema;

export const PropertiesCloneInputSchema = z.object({
	id: z.string().min(1),
	...CreatePropertyFields,
});
export const PropertiesCloneOutputSchema = IdCreatedSchema;

export const PropertiesCountriesInputSchema = z.object({}).optional();
export const PropertiesCountriesOutputSchema = z.object({
	countryCodes: z.array(z.string()),
});

export const UnitsGetInputSchema = z.object({ id: z.string().min(1) });
export const UnitsGetOutputSchema = ApaleoUnitEntity;
export const UnitsExistsOutputSchema = ExistsSchema;
export const UnitsDeleteOutputSchema = EmptyOkSchema;

export const UnitsListInputSchema = z
	.object({
		propertyId: z.string().optional(),
		unitGroupId: z.string().optional(),
		unitGroupIds: z.array(z.string()).optional(),
		unitAttributeIds: z.array(z.string()).optional(),
		isOccupied: z.boolean().optional(),
		maintenanceType: z.enum(APALEO_MAINTENANCE_TYPE).optional(),
		condition: z.enum(APALEO_UNIT_CONDITION).optional(),
		textSearch: z.string().optional(),
		status: z.enum(APALEO_UNIT_STATUS_FILTER).optional(),
		expand: z.array(z.string()).optional(),
		...PageQuery,
	})
	.optional();
export const UnitsListOutputSchema = z.object({
	units: z.array(ApaleoUnitEntity),
	count: z.number(),
});

export const UnitsCreateInputSchema = z.object(CreateUnitFields);
export const UnitsCreateOutputSchema = IdCreatedSchema;

export const UnitsCountInputSchema = z
	.object({
		propertyId: z.string().optional(),
		unitGroupId: z.string().optional(),
		unitGroupIds: z.array(z.string()).optional(),
		unitAttributeIds: z.array(z.string()).optional(),
		isOccupied: z.boolean().optional(),
		maintenanceType: z.enum(APALEO_MAINTENANCE_TYPE).optional(),
		condition: z.enum(APALEO_UNIT_CONDITION).optional(),
		textSearch: z.string().optional(),
		status: z.enum(APALEO_UNIT_STATUS_FILTER).optional(),
	})
	.optional();
export const UnitsCountOutputSchema = CountSchema;

export const UnitsCreateBulkInputSchema = z.object({
	units: z.array(z.object(CreateUnitFields)).min(1),
});
export const UnitsCreateBulkOutputSchema = IdsCreatedSchema;

export const UnitAttributesGetInputSchema = z.object({ id: z.string().min(1) });
export const UnitAttributesGetOutputSchema = ApaleoUnitAttributeEntity;
export const UnitAttributesDeleteOutputSchema = EmptyOkSchema;
export const UnitAttributesExistsOutputSchema = ExistsSchema;

export const UnitAttributesListInputSchema = z
	.object({
		...PageQuery,
	})
	.optional();
export const UnitAttributesListOutputSchema = z.object({
	unitAttributes: z.array(ApaleoUnitAttributeEntity),
	count: z.number(),
});

export const UnitAttributesCreateInputSchema = z.object({
	name: z.string().min(1),
	description: z.string().optional(),
});
export const UnitAttributesCreateOutputSchema = IdCreatedSchema;

const CreateUnitGroupFields = {
	code: InventoryCode,
	propertyId: z.string().min(1),
	name: z.record(z.string(), z.string().nullable()),
	description: z.record(z.string(), z.string().nullable()),
	maxPersons: z.number().int().min(1),
	rank: z.number().int().min(1).nullable().optional(),
	type: z
		.enum(['BedRoom', 'MeetingRoom', 'EventSpace', 'ParkingLot'])
		.nullable()
		.optional(),
	connectedUnitGroups: z.array(CreateConnectedUnitGroup).nullable().optional(),
};

export const UnitGroupsCreateInputSchema = z.object(CreateUnitGroupFields);
export const UnitGroupsCreateOutputSchema = IdCreatedSchema;

export const UnitGroupsListInputSchema = z
	.object({
		propertyId: z.string().optional(),
		unitGroupTypes: z.array(z.enum(APALEO_UNIT_GROUP_TYPE)).optional(),
		expand: z.array(z.string()).optional(),
		...PageQuery,
	})
	.optional();
export const UnitGroupsListOutputSchema = z.object({
	unitGroups: z.array(ApaleoUnitGroupEntity),
	count: z.number(),
});

export const UnitGroupsCountInputSchema = z
	.object({
		propertyId: z.string().optional(),
		unitGroupTypes: z.array(z.enum(APALEO_UNIT_GROUP_TYPE)).optional(),
	})
	.optional();
export const UnitGroupsCountOutputSchema = CountSchema;

export const UnitGroupsIdInputSchema = z.object({ id: z.string().min(1) });
export const UnitGroupsGetOutputSchema = ApaleoUnitGroupEntity;
export const UnitGroupsExistsOutputSchema = ExistsSchema;
export const UnitGroupsDeleteOutputSchema = EmptyOkSchema;

export const UnitGroupsReplaceInputSchema = z.object({
	id: z.string().min(1),
	name: z.record(z.string(), z.string().nullable()),
	description: z.record(z.string(), z.string().nullable()),
	maxPersons: z.number().int().min(1).optional(),
	rank: z.number().int().min(1).nullable().optional(),
	connectedUnitGroups: z.array(CreateConnectedUnitGroup).nullable().optional(),
});
export const UnitGroupsReplaceOutputSchema = EmptyOkSchema;

export type ApaleoEndpointInputs = {
	propertiesList: z.infer<typeof PropertiesListInputSchema>;
	propertiesCreate: z.infer<typeof PropertiesCreateInputSchema>;
	propertiesCount: z.infer<typeof PropertiesCountInputSchema>;
	propertiesExists: z.infer<typeof PropertiesIdInputSchema>;
	propertiesGet: z.infer<typeof PropertiesIdInputSchema>;
	propertiesClone: z.infer<typeof PropertiesCloneInputSchema>;
	propertiesArchive: z.infer<typeof PropertiesIdInputSchema>;
	propertiesSetLive: z.infer<typeof PropertiesIdInputSchema>;
	propertiesReset: z.infer<typeof PropertiesIdInputSchema>;
	propertiesCountries: z.infer<typeof PropertiesCountriesInputSchema>;
	unitsGet: z.infer<typeof UnitsGetInputSchema>;
	unitsExists: z.infer<typeof UnitsGetInputSchema>;
	unitsDelete: z.infer<typeof UnitsGetInputSchema>;
	unitsList: z.infer<typeof UnitsListInputSchema>;
	unitsCreate: z.infer<typeof UnitsCreateInputSchema>;
	unitsCount: z.infer<typeof UnitsCountInputSchema>;
	unitsCreateBulk: z.infer<typeof UnitsCreateBulkInputSchema>;
	unitAttributesGet: z.infer<typeof UnitAttributesGetInputSchema>;
	unitAttributesDelete: z.infer<typeof UnitAttributesGetInputSchema>;
	unitAttributesExists: z.infer<typeof UnitAttributesGetInputSchema>;
	unitAttributesList: z.infer<typeof UnitAttributesListInputSchema>;
	unitAttributesCreate: z.infer<typeof UnitAttributesCreateInputSchema>;
	unitGroupsCreate: z.infer<typeof UnitGroupsCreateInputSchema>;
	unitGroupsList: z.infer<typeof UnitGroupsListInputSchema>;
	unitGroupsCount: z.infer<typeof UnitGroupsCountInputSchema>;
	unitGroupsExists: z.infer<typeof UnitGroupsIdInputSchema>;
	unitGroupsGet: z.infer<typeof UnitGroupsIdInputSchema>;
	unitGroupsReplace: z.infer<typeof UnitGroupsReplaceInputSchema>;
	unitGroupsDelete: z.infer<typeof UnitGroupsIdInputSchema>;
};

export type ApaleoEndpointOutputs = {
	propertiesList: z.infer<typeof PropertiesListOutputSchema>;
	propertiesCreate: z.infer<typeof PropertiesCreateOutputSchema>;
	propertiesCount: z.infer<typeof PropertiesCountOutputSchema>;
	propertiesExists: z.infer<typeof PropertiesExistsOutputSchema>;
	propertiesGet: z.infer<typeof PropertiesGetOutputSchema>;
	propertiesClone: z.infer<typeof PropertiesCloneOutputSchema>;
	propertiesArchive: z.infer<typeof PropertiesEmptyOutputSchema>;
	propertiesSetLive: z.infer<typeof PropertiesEmptyOutputSchema>;
	propertiesReset: z.infer<typeof PropertiesEmptyOutputSchema>;
	propertiesCountries: z.infer<typeof PropertiesCountriesOutputSchema>;
	unitsGet: z.infer<typeof UnitsGetOutputSchema>;
	unitsExists: z.infer<typeof UnitsExistsOutputSchema>;
	unitsDelete: z.infer<typeof UnitsDeleteOutputSchema>;
	unitsList: z.infer<typeof UnitsListOutputSchema>;
	unitsCreate: z.infer<typeof UnitsCreateOutputSchema>;
	unitsCount: z.infer<typeof UnitsCountOutputSchema>;
	unitsCreateBulk: z.infer<typeof UnitsCreateBulkOutputSchema>;
	unitAttributesGet: z.infer<typeof UnitAttributesGetOutputSchema>;
	unitAttributesDelete: z.infer<typeof UnitAttributesDeleteOutputSchema>;
	unitAttributesExists: z.infer<typeof UnitAttributesExistsOutputSchema>;
	unitAttributesList: z.infer<typeof UnitAttributesListOutputSchema>;
	unitAttributesCreate: z.infer<typeof UnitAttributesCreateOutputSchema>;
	unitGroupsCreate: z.infer<typeof UnitGroupsCreateOutputSchema>;
	unitGroupsList: z.infer<typeof UnitGroupsListOutputSchema>;
	unitGroupsCount: z.infer<typeof UnitGroupsCountOutputSchema>;
	unitGroupsExists: z.infer<typeof UnitGroupsExistsOutputSchema>;
	unitGroupsGet: z.infer<typeof UnitGroupsGetOutputSchema>;
	unitGroupsReplace: z.infer<typeof UnitGroupsReplaceOutputSchema>;
	unitGroupsDelete: z.infer<typeof UnitGroupsDeleteOutputSchema>;
};

export const ApaleoEndpointInputSchemas = {
	propertiesList: PropertiesListInputSchema,
	propertiesCreate: PropertiesCreateInputSchema,
	propertiesCount: PropertiesCountInputSchema,
	propertiesExists: PropertiesIdInputSchema,
	propertiesGet: PropertiesIdInputSchema,
	propertiesClone: PropertiesCloneInputSchema,
	propertiesArchive: PropertiesIdInputSchema,
	propertiesSetLive: PropertiesIdInputSchema,
	propertiesReset: PropertiesIdInputSchema,
	propertiesCountries: PropertiesCountriesInputSchema,
	unitsGet: UnitsGetInputSchema,
	unitsExists: UnitsGetInputSchema,
	unitsDelete: UnitsGetInputSchema,
	unitsList: UnitsListInputSchema,
	unitsCreate: UnitsCreateInputSchema,
	unitsCount: UnitsCountInputSchema,
	unitsCreateBulk: UnitsCreateBulkInputSchema,
	unitAttributesGet: UnitAttributesGetInputSchema,
	unitAttributesDelete: UnitAttributesGetInputSchema,
	unitAttributesExists: UnitAttributesGetInputSchema,
	unitAttributesList: UnitAttributesListInputSchema,
	unitAttributesCreate: UnitAttributesCreateInputSchema,
	unitGroupsCreate: UnitGroupsCreateInputSchema,
	unitGroupsList: UnitGroupsListInputSchema,
	unitGroupsCount: UnitGroupsCountInputSchema,
	unitGroupsExists: UnitGroupsIdInputSchema,
	unitGroupsGet: UnitGroupsIdInputSchema,
	unitGroupsReplace: UnitGroupsReplaceInputSchema,
	unitGroupsDelete: UnitGroupsIdInputSchema,
} as const;

export const ApaleoEndpointOutputSchemas = {
	propertiesList: PropertiesListOutputSchema,
	propertiesCreate: PropertiesCreateOutputSchema,
	propertiesCount: PropertiesCountOutputSchema,
	propertiesExists: PropertiesExistsOutputSchema,
	propertiesGet: PropertiesGetOutputSchema,
	propertiesClone: PropertiesCloneOutputSchema,
	propertiesArchive: PropertiesEmptyOutputSchema,
	propertiesSetLive: PropertiesEmptyOutputSchema,
	propertiesReset: PropertiesEmptyOutputSchema,
	propertiesCountries: PropertiesCountriesOutputSchema,
	unitsGet: UnitsGetOutputSchema,
	unitsExists: UnitsExistsOutputSchema,
	unitsDelete: UnitsDeleteOutputSchema,
	unitsList: UnitsListOutputSchema,
	unitsCreate: UnitsCreateOutputSchema,
	unitsCount: UnitsCountOutputSchema,
	unitsCreateBulk: UnitsCreateBulkOutputSchema,
	unitAttributesGet: UnitAttributesGetOutputSchema,
	unitAttributesDelete: UnitAttributesDeleteOutputSchema,
	unitAttributesExists: UnitAttributesExistsOutputSchema,
	unitAttributesList: UnitAttributesListOutputSchema,
	unitAttributesCreate: UnitAttributesCreateOutputSchema,
	unitGroupsCreate: UnitGroupsCreateOutputSchema,
	unitGroupsList: UnitGroupsListOutputSchema,
	unitGroupsCount: UnitGroupsCountOutputSchema,
	unitGroupsExists: UnitGroupsExistsOutputSchema,
	unitGroupsGet: UnitGroupsGetOutputSchema,
	unitGroupsReplace: UnitGroupsReplaceOutputSchema,
	unitGroupsDelete: UnitGroupsDeleteOutputSchema,
} as const;
