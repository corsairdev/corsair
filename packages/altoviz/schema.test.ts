import { z } from 'zod';
import {
	AltovizEndpointInputSchemas,
	AltovizEndpointOutputSchemas,
} from './endpoints/types';
import { altovizEndpointSchemas } from './index';
import { AltovizSchema } from './schema';
import {
	AltovizClassificationEntity,
	AltovizContactEntity,
	AltovizCustomerEntity,
	AltovizCustomerFamilyEntity,
	AltovizProductEntity,
	AltovizProductFamilyEntity,
	AltovizUnitEntity,
	AltovizVatEntity,
} from './schema/database';

/**
 * Official schema property names, id-first then OpenAPI order.
 * https://developer.altoviz.com/openapi.json
 */
const UNIT_KEYS = [
	'id',
	'code',
	'conversion',
	'decimals',
	'name',
	'type',
] as const;
const VAT_KEYS = ['id', 'default', 'label', 'rate', 'region'] as const;
const CLASSIFICATION_KEYS = [
	'id',
	'accountNumber',
	'defaultVat',
	'description',
	'isProduct',
	'isService',
	'label',
	'microBusinessDeclarationType',
	'type',
] as const;
const CUSTOMER_FAMILY_KEYS = ['id', 'internalId', 'label', 'number'] as const;
const PRODUCT_FAMILY_KEYS = ['id', 'label', 'number'] as const;
const PRODUCT_KEYS = [
	'id',
	'active',
	'defaultQuantity',
	'description',
	'family',
	'imageUrl',
	'internalId',
	'internalNotes',
	'isUnitPriceTaxIncluded',
	'name',
	'number',
	'purchasePrice',
	'type',
	'unit',
	'unitPrice',
	'vat',
] as const;
const CUSTOMER_KEYS = [
	'id',
	'active',
	'billingAddress',
	'billingOptions',
	'cellPhone',
	'companyInformations',
	'companyName',
	'email',
	'family',
	'firstName',
	'internalId',
	'internalNotes',
	'lastName',
	'name',
	'number',
	'phone',
	'shippingAddress',
	'title',
	'type',
] as const;
const CONTACT_KEYS = [
	'id',
	'cellPhone',
	'companyName',
	'displayName',
	'email',
	'firstName',
	'function',
	'internalId',
	'invertedDisplayName',
	'lastName',
	'phone',
	'service',
	'title',
] as const;

function shapeKeys(schema: { shape: object }): string[] {
	return Object.keys(schema.shape);
}

const REFERENCE_ENTITIES = [
	'units',
	'vats',
	'classifications',
	'customerFamilies',
	'productFamilies',
	'products',
	'customers',
	'contacts',
] as const;

const NON_MIRRORED_ENTITIES = [
	'suppliers',
	'colleagues',
	'webhooks',
	'saleInvoices',
	'saleCredits',
	'saleQuotes',
	'receipts',
	'purchaseInvoices',
] as const;

const SALE_DOCUMENT_FIELDS = [
	'id',
	'number',
	'internalId',
	'date',
	'subject',
	'customerId',
	'customerName',
	'customerNumber',
	'customerType',
	'customerElectronicAddress',
	'customerOrderReference',
	'customerSiret',
	'customerVatNumber',
	'billingAddress',
	'shippingAddress',
	'billingContact',
	'shippingContact',
	'headerNotes',
	'footerNotes',
	'internalNotes',
	'lines',
	'globalDiscount',
	'shippingAmount',
	'shippingVat',
	'balance',
	'grossTaxExcludedAmount',
	'taxAmount',
	'taxExcludedAmount',
	'taxIncludedAmount',
	'useTaxIncludedPrices',
	'liableToVat',
	'vatMode',
	'vatNote',
	'vatReverseCharge',
	'region',
	'vats',
	'metadata',
	'pdfUrl',
	'publicLink',
	'sentAt',
	'commitments',
	'overdue',
	'vendorReference',
] as const;

const CAPTURED_TOP_LEVEL_FIELDS = [
	{
		name: 'customer',
		schema: AltovizEndpointOutputSchemas.customersGet,
		fields: [
			'id',
			'type',
			'companyName',
			'firstName',
			'lastName',
			'name',
			'email',
			'phone',
			'cellPhone',
			'title',
			'number',
			'internalId',
			'internalNotes',
			'active',
			'billingAddress',
			'shippingAddress',
			'billingOptions',
			'companyInformations',
			'family',
		],
	},
	{
		name: 'customer family',
		schema: AltovizEndpointOutputSchemas.customerFamiliesGet,
		fields: ['id', 'label', 'number', 'internalId'],
	},
	{
		name: 'contact',
		schema: AltovizEndpointOutputSchemas.contactsGet,
		fields: [
			'id',
			'displayName',
			'invertedDisplayName',
			'firstName',
			'lastName',
			'companyName',
			'email',
			'phone',
			'cellPhone',
			'function',
			'service',
			'title',
			'internalId',
		],
	},
	{
		name: 'supplier',
		schema: AltovizEndpointOutputSchemas.suppliersGet,
		fields: [
			'id',
			'name',
			'firstName',
			'lastName',
			'email',
			'phone',
			'cellPhone',
			'title',
			'number',
			'internalId',
			'internalNotes',
			'active',
			'address',
			'defaultPaymentMethod',
			'companyInformations',
			'createdAt',
			'createdById',
			'updatedAt',
			'updatedById',
		],
	},
	{
		name: 'colleague',
		schema: AltovizEndpointOutputSchemas.colleaguesGet,
		fields: [
			'id',
			'firstName',
			'lastName',
			'name',
			'email',
			'phone',
			'cellPhone',
			'title',
			'number',
			'internalId',
			'isPartner',
			'initialPartnerBalance',
			'homecareServiceNumber',
			'userId',
			'metadatas',
		],
	},
	{
		name: 'product',
		schema: AltovizEndpointOutputSchemas.productsGet,
		fields: [
			'id',
			'name',
			'number',
			'description',
			'type',
			'unitPrice',
			'purchasePrice',
			'isUnitPriceTaxIncluded',
			'defaultQuantity',
			'unit',
			'vat',
			'family',
			'imageUrl',
			'internalId',
			'internalNotes',
			'active',
		],
	},
	{
		name: 'product family',
		schema: AltovizEndpointOutputSchemas.productFamiliesGet,
		fields: ['id', 'label', 'number'],
	},
	{
		name: 'sale invoice',
		schema: AltovizEndpointOutputSchemas.saleInvoicesGet,
		fields: [
			...SALE_DOCUMENT_FIELDS,
			'isDraft',
			'isPaid',
			'isCancelled',
			'isProforma',
			'cancellationCreditId',
			'cancellationCreditNumber',
			'cancelledCreditId',
			'cancelledCreditNumber',
			'eInvoicingInvoiceId',
			'eInvoicingProviderId',
			'eInvoicingStatus',
			'replacedBy',
		],
	},
	{
		name: 'sale credit',
		schema: AltovizEndpointOutputSchemas.saleCreditsGet,
		fields: [
			...SALE_DOCUMENT_FIELDS,
			'isDraft',
			'isPaid',
			'isCancelled',
			'cancelledInvoicetId',
			'cancelledInvoicetNumber',
			'cancellationInvoiceId',
			'cancellationInvoiceNumber',
			'replacedBy',
		],
	},
	{
		name: 'sale quote',
		schema: AltovizEndpointOutputSchemas.saleQuotesFind,
		fields: [
			...SALE_DOCUMENT_FIELDS,
			'status',
			'validityDate',
			'deposit',
			'acceptedAt',
			'refusedAt',
		],
	},
	{
		name: 'receipt',
		schema: AltovizEndpointOutputSchemas.receiptsGet,
		fields: [
			'id',
			'amount',
			'date',
			'paymentMethod',
			'status',
			'reference',
			'notes',
			'customerId',
			'customerName',
			'customerNumber',
			'customerInternalId',
			'internalId',
			'links',
			'metadata',
		],
	},
	{
		name: 'unit',
		schema: AltovizEndpointOutputSchemas.accountGetUnits,
		fields: ['id', 'code', 'name', 'type', 'conversion', 'decimals'],
	},
	{
		name: 'vat',
		schema: AltovizEndpointOutputSchemas.accountGetVats,
		fields: ['id', 'rate', 'region', 'label', 'default'],
	},
	{
		name: 'classification',
		schema: AltovizEndpointOutputSchemas.accountGetClassifications,
		fields: [
			'id',
			'label',
			'description',
			'type',
			'accountNumber',
			'isProduct',
			'isService',
			'defaultVat',
			'microBusinessDeclarationType',
		],
	},
	{
		name: 'current user',
		schema: AltovizEndpointOutputSchemas.accountGetCurrentUser,
		fields: [
			'userId',
			'displayName',
			'firstName',
			'lastName',
			'email',
			'phone',
			'profile',
			'status',
		],
	},
	{
		name: 'hello',
		schema: AltovizEndpointOutputSchemas.accountTestApiKey,
		fields: ['apiKeyName', 'companyName', 'message', 'serverTimestamp', 'url'],
	},
	{
		name: 'webhook',
		schema: AltovizEndpointOutputSchemas.webhookSubscriptionsList,
		fields: ['id', 'name', 'url', 'types', 'secretKey'],
	},
	{
		name: 'purchase invoice',
		schema: AltovizEndpointOutputSchemas.purchaseInvoicesUpload,
		fields: [
			'id',
			'date',
			'reference',
			'subject',
			'notes',
			'region',
			'status',
			'supplier',
			'taxIncludedAmount',
			'vatReverseCharge',
			'pdfUrl',
		],
	},
] as const;

function objectShape(schema: z.ZodType): Record<string, z.ZodType> {
	const unwrapped = schema instanceof z.ZodArray ? schema.element : schema;
	expect(unwrapped).toBeInstanceOf(z.ZodObject);
	return (unwrapped as z.ZodObject).shape as Record<string, z.ZodType>;
}

describe('Altoviz persisted schema', () => {
	test('declares a semver version and exactly the eight reference stores', () => {
		expect(AltovizSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
		expect(Object.keys(AltovizSchema.entities)).toEqual(REFERENCE_ENTITIES);
	});

	test.each(REFERENCE_ENTITIES)(
		'%s accepts key-only, nullable and future-field rows',
		(name) => {
			const schema = AltovizSchema.entities[name];
			const fields = Object.keys(schema.shape);
			expect(fields.length).toBeGreaterThan(1);
			expect(schema.safeParse({}).success).toBe(false);
			expect(schema.safeParse({ id: 1234567 }).success).toBe(true);

			const nullableRow = Object.fromEntries(
				fields.map((field) => [field, field === 'id' ? 1234567 : null]),
			);
			expect(schema.safeParse(nullableRow).success).toBe(true);
			expect(schema.parse({ id: 1234567, futureField: 'kept' })).toHaveProperty(
				'futureField',
				'kept',
			);
		},
	);

	test('does not expand the mirror beyond the selected reference stores', () => {
		for (const name of NON_MIRRORED_ENTITIES) {
			expect(AltovizSchema.entities).not.toHaveProperty(name);
		}
	});

	test('declares every official Unit field', () => {
		expect(shapeKeys(AltovizUnitEntity)).toEqual([...UNIT_KEYS]);
	});

	test('declares every official Vat field', () => {
		expect(shapeKeys(AltovizVatEntity)).toEqual([...VAT_KEYS]);
	});

	test('declares every official Classification field', () => {
		expect(shapeKeys(AltovizClassificationEntity)).toEqual([
			...CLASSIFICATION_KEYS,
		]);
	});

	test('declares every official CustomerFamily field', () => {
		expect(shapeKeys(AltovizCustomerFamilyEntity)).toEqual([
			...CUSTOMER_FAMILY_KEYS,
		]);
	});

	test('declares every official ProductFamily field', () => {
		expect(shapeKeys(AltovizProductFamilyEntity)).toEqual([
			...PRODUCT_FAMILY_KEYS,
		]);
	});

	test('declares every official Product field', () => {
		expect(shapeKeys(AltovizProductEntity)).toEqual([...PRODUCT_KEYS]);
		expect(shapeKeys(AltovizProductEntity)).not.toContain('unit_code');
		expect(shapeKeys(AltovizProductEntity)).not.toContain('vat_rate');
		expect(shapeKeys(AltovizProductEntity)).not.toContain('family_id');
	});

	test('declares every official Customer field', () => {
		expect(shapeKeys(AltovizCustomerEntity)).toEqual([...CUSTOMER_KEYS]);
	});

	test('declares every official Contact field', () => {
		expect(shapeKeys(AltovizContactEntity)).toEqual([...CONTACT_KEYS]);
	});

	test('accepts the OpenAPI Product example with nested unit/vat/family', () => {
		const parsed = AltovizProductEntity.safeParse({
			id: 42,
			name: 'Hour of consulting',
			number: 'CONSULT-H',
			description: 'Advisory',
			type: 'Service',
			unitPrice: 120,
			purchasePrice: 0,
			isUnitPriceTaxIncluded: false,
			defaultQuantity: 1,
			active: true,
			unit: { id: 1, code: 'H', name: 'Hour', type: 'Time' },
			vat: { id: 10, rate: 20, region: 'FR', label: 'TVA 20%', default: true },
			family: { id: 3, label: 'Services', number: 'SRV' },
		});
		expect(parsed.success).toBe(true);
		if (parsed.success) {
			expect(parsed.data.unit?.code).toBe('H');
			expect(parsed.data.vat?.rate).toBe(20);
			expect(parsed.data.family?.label).toBe('Services');
		}
	});
});

describe('Altoviz endpoint schemas', () => {
	test('coverage sweep: all 67 registered operations have input and output schemas', () => {
		expect(Object.keys(altovizEndpointSchemas)).toHaveLength(67);
		expect(Object.keys(AltovizEndpointInputSchemas)).toHaveLength(67);
		expect(Object.keys(AltovizEndpointOutputSchemas)).toHaveLength(67);
		for (const schemas of Object.values(altovizEndpointSchemas)) {
			expect(typeof schemas.input.safeParse).toBe('function');
			expect(typeof schemas.output.safeParse).toBe('function');
		}
	});

	test.each(CAPTURED_TOP_LEVEL_FIELDS)(
		'$name declares every top-level field observed in the live capture',
		({ schema, fields }) => {
			const declared = Object.keys(objectShape(schema));
			const missing = fields.filter((field) => !declared.includes(field));
			expect(missing).toEqual([]);
		},
	);

	test('settings remains forward-compatible with its large provider-owned shape', () => {
		const capturedShape = {
			accounting: { salesJournalCode: 'VE' },
			company: { name: 'Fictional Company' },
			eInvoicing: { profile: 'None' },
			emailing: {},
			general: { timezone: 'Europe/Paris' },
			sales: { useTaxIncluded: false },
			socials: {},
			vat: { liableToVat: true },
		};
		expect(
			AltovizEndpointOutputSchemas.accountGetSettings.parse(capturedShape),
		).toEqual(capturedShape);
	});
});
