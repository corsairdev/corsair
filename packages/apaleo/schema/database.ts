import { z } from 'zod';
import { B, Id, LocalizedOrString, N, S } from './primitives';

/**
 * Field names match official Inventory V1 JSON keys.
 * https://api.apaleo.com/swagger/inventory-v1/swagger.json
 * https://apaleo.dev/guides/api/overview.html
 */

export const APALEO_PROPERTY_STATUS = ['Test', 'Live'] as const;
export const APALEO_UNIT_CONDITION = [
	'Clean',
	'CleanToBeInspected',
	'Dirty',
] as const;
export const APALEO_MAINTENANCE_TYPE = [
	'OutOfService',
	'OutOfOrder',
	'OutOfInventory',
] as const;
export const APALEO_UNIT_GROUP_TYPE = [
	'BedRoom',
	'MeetingRoom',
	'EventSpace',
	'ParkingLot',
	'Other',
] as const;
export const APALEO_UNIT_STATUS_FILTER = ['Active', 'Archived', 'All'] as const;

export const ApaleoAddress = z
	.object({
		addressLine1: S,
		addressLine2: S,
		postalCode: S,
		city: S,
		regionCode: S,
		countryCode: S,
	})
	.loose();
export type ApaleoAddress = z.infer<typeof ApaleoAddress>;

export const ApaleoBankAccount = z
	.object({
		iban: S,
		bic: S,
		bank: S,
	})
	.loose();
export type ApaleoBankAccount = z.infer<typeof ApaleoBankAccount>;

export const ApaleoEmbeddedProperty = z
	.object({
		id: S,
		code: S,
		name: S,
		description: S,
	})
	.loose();
export type ApaleoEmbeddedProperty = z.infer<typeof ApaleoEmbeddedProperty>;

export const ApaleoEmbeddedUnitGroup = z
	.object({
		id: S,
		code: S,
		name: S,
		description: S,
		type: S,
	})
	.loose();
export type ApaleoEmbeddedUnitGroup = z.infer<typeof ApaleoEmbeddedUnitGroup>;

export const ApaleoEmbeddedUnit = z
	.object({
		id: S,
		name: S,
		description: S,
		unitGroupId: S,
	})
	.loose();
export type ApaleoEmbeddedUnit = z.infer<typeof ApaleoEmbeddedUnit>;

export const ApaleoUnitAttributeRef = z
	.object({
		id: S,
		name: S,
		description: S,
	})
	.loose();
export type ApaleoUnitAttributeRef = z.infer<typeof ApaleoUnitAttributeRef>;

export const ApaleoConnectedUnit = z
	.object({
		id: S,
		name: S,
		description: S,
		unitGroupId: S,
		condition: S,
		maxPersons: N,
	})
	.loose();
export type ApaleoConnectedUnit = z.infer<typeof ApaleoConnectedUnit>;

export const ApaleoConnectedUnitGroup = z
	.object({
		id: Id,
		name: z.string(),
		description: z.string(),
		memberCount: z.number(),
		maxPersons: N,
	})
	.loose();
export type ApaleoConnectedUnitGroup = z.infer<typeof ApaleoConnectedUnitGroup>;

export const ApaleoUnitMaintenance = z
	.object({
		id: S,
		from: S,
		to: S,
		type: S,
		description: S,
	})
	.loose();
export type ApaleoUnitMaintenance = z.infer<typeof ApaleoUnitMaintenance>;

export const ApaleoUnitStatus = z
	.object({
		isOccupied: B,
		condition: S,
		maintenance: ApaleoUnitMaintenance.nullable().optional(),
	})
	.loose();
export type ApaleoUnitStatus = z.infer<typeof ApaleoUnitStatus>;

/** expand=actions — ActionModel from Inventory swagger. */
export const ApaleoAction = z
	.object({
		action: S,
		isAllowed: B,
		reasons: z
			.array(z.object({ code: S, message: S }).loose())
			.nullable()
			.optional(),
	})
	.loose();
export type ApaleoAction = z.infer<typeof ApaleoAction>;

/** GET /inventory/v1/properties/{id} — PropertyModel */
export const ApaleoPropertyEntity = z
	.object({
		id: Id,
		code: z.string(),
		propertyTemplateId: S,
		isTemplate: z.boolean(),
		name: LocalizedOrString,
		description: LocalizedOrString.nullable().optional(),
		companyName: z.string(),
		managingDirectors: S,
		commercialRegisterEntry: z.string(),
		taxId: z.string(),
		location: ApaleoAddress,
		bankAccount: ApaleoBankAccount.nullable().optional(),
		paymentTerms: z.record(z.string(), z.string().nullable()),
		timeZone: z.string(),
		currencyCode: z.string(),
		created: z.string(),
		status: z.string(),
		isArchived: z.boolean(),
		actions: z.array(ApaleoAction).nullable().optional(),
	})
	.loose();
export type ApaleoPropertyEntity = z.infer<typeof ApaleoPropertyEntity>;

/** GET /inventory/v1/units/{id} — UnitModel */
export const ApaleoUnitEntity = z
	.object({
		id: Id,
		name: z.string(),
		description: LocalizedOrString,
		property: ApaleoEmbeddedProperty,
		unitGroup: ApaleoEmbeddedUnitGroup.nullable().optional(),
		connectingUnit: ApaleoEmbeddedUnit.nullable().optional(),
		status: ApaleoUnitStatus,
		maxPersons: z.number(),
		created: z.string(),
		archived: S,
		isArchived: B,
		attributes: z.array(ApaleoUnitAttributeRef).nullable().optional(),
		connectedUnits: z.array(ApaleoConnectedUnit).nullable().optional(),
		actions: z.array(ApaleoAction).nullable().optional(),
	})
	.loose();
export type ApaleoUnitEntity = z.infer<typeof ApaleoUnitEntity>;

/** GET /inventory/v1/unit-groups/{id} — UnitGroupModel */
export const ApaleoUnitGroupEntity = z
	.object({
		id: Id,
		code: z.string(),
		property: ApaleoEmbeddedProperty,
		name: LocalizedOrString,
		memberCount: z.number(),
		description: LocalizedOrString,
		maxPersons: z.number(),
		rank: N,
		type: z.string(),
		connectedUnitGroups: z
			.array(ApaleoConnectedUnitGroup)
			.nullable()
			.optional(),
	})
	.loose();
export type ApaleoUnitGroupEntity = z.infer<typeof ApaleoUnitGroupEntity>;

/** GET /inventory/v1/unit-attributes/{id} — UnitAttributeDefinitionModel */
export const ApaleoUnitAttributeEntity = z
	.object({
		id: Id,
		name: z.string(),
		description: S,
	})
	.loose();
export type ApaleoUnitAttributeEntity = z.infer<
	typeof ApaleoUnitAttributeEntity
>;
