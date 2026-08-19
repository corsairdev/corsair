import { z } from 'zod';
import { B, Id, N, S } from './primitives';

/**
 * Field names match official JSON keys.
 * https://developer.altoviz.com/openapi.json
 * https://developer.altoviz.com/api
 *
 * Eight reference stores: units, VAT rates, classifications, the two family
 * groupings, products, customers, and contacts. Nested writes resolve
 * unit/VAT/family by value (`{code}`, `{rate,region}`, `{label,number}`),
 * and the mirror is what turns a caller id into that shape.
 *
 * Contacts are mirrored because creating a customer, supplier or colleague
 * auto-creates one, and deleting the parent leaves that contact behind.
 *
 * Sale invoices, credits, quotes and receipts are not stored. Their status
 * changes server-side without this plugin being told.
 */

/** https://developer.altoviz.com/openapi.json#/components/schemas/UnitType */
export const ALTOVIZ_UNIT_TYPE = [
	'Time',
	'Weight',
	'Area',
	'Volume',
	'Dimension',
	'Other',
] as const;

/** https://developer.altoviz.com/openapi.json#/components/schemas/VatRegion */
export const ALTOVIZ_VAT_REGION = [
	'FR',
	'EU',
	'IE',
	'DOM',
	'Corse',
	'Monaco',
] as const;

/** https://developer.altoviz.com/openapi.json#/components/schemas/ClassificationType */
export const ALTOVIZ_CLASSIFICATION_TYPE = [
	'Sale',
	'Expense',
	'Other',
] as const;

/** https://developer.altoviz.com/openapi.json#/components/schemas/ProductType */
export const ALTOVIZ_PRODUCT_TYPE = ['Product', 'Service', 'Text'] as const;

/** https://developer.altoviz.com/openapi.json#/components/schemas/CustomerType */
export const ALTOVIZ_CUSTOMER_TYPE = [
	'Business',
	'Consumer',
	'Government',
] as const;

/** https://developer.altoviz.com/openapi.json#/components/schemas/PaymentMethod */
export const ALTOVIZ_PAYMENT_METHOD = [
	'Transfer',
	'Order',
	'Check',
	'Cash',
	'Card',
	'Bill',
	'Usec',
	'Other',
] as const;

/** https://developer.altoviz.com/openapi.json#/components/schemas/MicroBusinessDeclarationTypes */
export const ALTOVIZ_MICRO_BUSINESS_DECLARATION_TYPE = [
	'Products',
	'Services',
	'OtherServices',
	'Renting',
	'Cipav',
] as const;

/** https://developer.altoviz.com/openapi.json#/components/schemas/AddressFields */
export const AltovizAddress = z
	.object({
		city: S,
		countryIso: S,
		countryName: S,
		formattedAddress: S,
		inlineAddress: S,
		street: S,
		zipcode: S,
	})
	.loose();
export type AltovizAddress = z.infer<typeof AltovizAddress>;

/** https://developer.altoviz.com/openapi.json#/components/schemas/CompanyInfo */
export const AltovizCompanyInfo = z
	.object({
		effectiveElectronicAddress: S,
		electronicAddress: S,
		siret: S,
		vatNumber: S,
	})
	.loose();
export type AltovizCompanyInfo = z.infer<typeof AltovizCompanyInfo>;

/** https://developer.altoviz.com/openapi.json#/components/schemas/Discount */
export const AltovizDiscount = z
	.object({
		type: S,
		value: N,
	})
	.loose();
export type AltovizDiscount = z.infer<typeof AltovizDiscount>;

/** https://developer.altoviz.com/openapi.json#/components/schemas/BillingOptions */
export const AltovizBillingOptions = z
	.object({
		allowed: B,
		bankAccountId: N,
		buyerReference: S,
		colleagueId: N,
		discount: AltovizDiscount.nullable().optional(),
		initialCommitmentAmount: N,
		initialCommitmentDate: S,
		initialCommitmentStatus: S,
		liableToVat: B,
		paymentMethod: S,
		sendDocumentAsAttachment: B,
		settlementTermId: N,
		useTaxIncludedPrices: B,
		vatReverseCharge: B,
		vendorReference: S,
	})
	.loose();
export type AltovizBillingOptions = z.infer<typeof AltovizBillingOptions>;

/** https://developer.altoviz.com/openapi.json#/components/schemas/Unit */
export const AltovizUnitEntity = z
	.object({
		id: Id,
		code: S,
		conversion: N,
		decimals: N,
		name: S,
		type: S,
	})
	.loose();
export type AltovizUnitEntity = z.infer<typeof AltovizUnitEntity>;

/** Embedded Unit on Product; id is nullable in the official schema. */
export const AltovizUnitRef = AltovizUnitEntity.partial().nullable().optional();

/** https://developer.altoviz.com/openapi.json#/components/schemas/Vat */
export const AltovizVatEntity = z
	.object({
		id: Id,
		default: B,
		label: S,
		rate: N,
		region: S,
	})
	.loose();
export type AltovizVatEntity = z.infer<typeof AltovizVatEntity>;

export const AltovizVatRef = AltovizVatEntity.partial().nullable().optional();

/** https://developer.altoviz.com/openapi.json#/components/schemas/Classification */
export const AltovizClassificationEntity = z
	.object({
		id: Id,
		accountNumber: S,
		defaultVat: AltovizVatRef,
		description: S,
		isProduct: B,
		isService: B,
		label: S,
		microBusinessDeclarationType: S,
		type: S,
	})
	.loose();
export type AltovizClassificationEntity = z.infer<
	typeof AltovizClassificationEntity
>;

/** https://developer.altoviz.com/openapi.json#/components/schemas/CustomerFamily */
export const AltovizCustomerFamilyEntity = z
	.object({
		id: Id,
		internalId: S,
		label: S,
		number: S,
	})
	.loose();
export type AltovizCustomerFamilyEntity = z.infer<
	typeof AltovizCustomerFamilyEntity
>;

export const AltovizCustomerFamilyRef = AltovizCustomerFamilyEntity.partial()
	.nullable()
	.optional();

/** https://developer.altoviz.com/openapi.json#/components/schemas/ProductFamily */
export const AltovizProductFamilyEntity = z
	.object({
		id: Id,
		label: S,
		number: S,
	})
	.loose();
export type AltovizProductFamilyEntity = z.infer<
	typeof AltovizProductFamilyEntity
>;

export const AltovizProductFamilyRef = AltovizProductFamilyEntity.partial()
	.nullable()
	.optional();

/** https://developer.altoviz.com/openapi.json#/components/schemas/Product */
export const AltovizProductEntity = z
	.object({
		id: Id,
		active: B,
		defaultQuantity: N,
		description: S,
		family: AltovizProductFamilyRef,
		imageUrl: S,
		internalId: S,
		internalNotes: S,
		isUnitPriceTaxIncluded: B,
		name: S,
		number: S,
		purchasePrice: N,
		type: S,
		unit: AltovizUnitRef,
		unitPrice: N,
		vat: AltovizVatRef,
	})
	.loose();
export type AltovizProductEntity = z.infer<typeof AltovizProductEntity>;

/** https://developer.altoviz.com/openapi.json#/components/schemas/Customer */
export const AltovizCustomerEntity = z
	.object({
		id: Id,
		active: B,
		billingAddress: AltovizAddress.nullable().optional(),
		billingOptions: AltovizBillingOptions.nullable().optional(),
		cellPhone: S,
		companyInformations: AltovizCompanyInfo.nullable().optional(),
		companyName: S,
		email: S,
		family: AltovizCustomerFamilyRef,
		firstName: S,
		internalId: S,
		internalNotes: S,
		lastName: S,
		name: S,
		number: S,
		phone: S,
		shippingAddress: AltovizAddress.nullable().optional(),
		title: S,
		type: S,
	})
	.loose();
export type AltovizCustomerEntity = z.infer<typeof AltovizCustomerEntity>;

/** https://developer.altoviz.com/openapi.json#/components/schemas/Contact */
export const AltovizContactEntity = z
	.object({
		id: Id,
		cellPhone: S,
		companyName: S,
		displayName: S,
		email: S,
		firstName: S,
		function: S,
		internalId: S,
		invertedDisplayName: S,
		lastName: S,
		phone: S,
		service: S,
		title: S,
	})
	.loose();
export type AltovizContactEntity = z.infer<typeof AltovizContactEntity>;
