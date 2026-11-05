import { z } from 'zod';
import {
	AltovizDateSchema,
	AltovizIdSchema,
	AltovizLineInputSchema,
	PagingInputSchema,
} from './shared';

/**
 * Response shapes captured live on 2026-08-15 against a seeded tenant
 * (`tools/altoviz-shapes.json`, 19 entities). Every output schema below is
 * `.loose()` with only `id` required: a single capture cannot prove a field
 * is always present, and the provider adds fields the OpenAPI document does
 * not declare (the invoice response carries `eInvoicing*` and
 * `cancelledCredit*` fields, for one).
 */

// ─────────────────────────────────────────────────────────────────────────────
// Shared sub-shapes
// ─────────────────────────────────────────────────────────────────────────────

const AddressOutputSchema = z
	.object({
		city: z.string().nullable().optional(),
		countryIso: z.string().nullable().optional(),
		countryName: z.string().nullable().optional(),
		formattedAddress: z.string().nullable().optional(),
		inlineAddress: z.string().nullable().optional(),
		street: z.string().nullable().optional(),
		zipcode: z.string().nullable().optional(),
	})
	.loose();

const AddressInputSchema = z
	.object({
		line1: z.string().optional(),
		line2: z.string().optional(),
		zipCode: z.string().optional(),
		city: z.string().optional(),
		countryCode: z.string().optional(),
	})
	.loose();

const ContactRefOutputSchema = z
	.object({
		cellPhone: z.string().nullable().optional(),
		companyName: z.string().nullable().optional(),
		displayName: z.string().nullable().optional(),
		email: z.string().nullable().optional(),
		firstName: z.string().nullable().optional(),
		function: z.string().nullable().optional(),
		invertedDisplayName: z.string().nullable().optional(),
		lastName: z.string().nullable().optional(),
		phone: z.string().nullable().optional(),
		service: z.string().nullable().optional(),
		title: z.string().nullable().optional(),
	})
	.loose();

const VatRefOutputSchema = z
	.object({
		default: z.boolean().nullable().optional(),
		id: z.number().nullable().optional(),
		label: z.string().nullable().optional(),
		rate: z.number().nullable().optional(),
		region: z.string().nullable().optional(),
	})
	.loose();

const UnitRefOutputSchema = z
	.object({
		code: z.string().nullable().optional(),
		conversion: z.number().nullable().optional(),
		decimals: z.number().nullable().optional(),
		id: z.number().nullable().optional(),
		name: z.string().nullable().optional(),
		type: z.string().nullable().optional(),
	})
	.loose();

const FamilyRefOutputSchema = z
	.object({
		id: z.number().nullable().optional(),
		label: z.string().nullable().optional(),
		number: z.string().nullable().optional(),
	})
	.loose();

const DiscountOutputSchema = z
	.object({
		type: z.string().nullable().optional(),
		value: z.number().nullable().optional(),
	})
	.loose();

const CommitmentOutputSchema = z
	.object({
		amount: z.number().nullable().optional(),
		date: z.string().nullable().optional(),
		dueAmount: z.number().nullable().optional(),
		id: z.number().nullable().optional(),
		thirdId: z.number().nullable().optional(),
	})
	.loose();

const DocumentVatSummaryOutputSchema = z
	.object({
		taxExcludedAmount: z.number().nullable().optional(),
		vat: VatRefOutputSchema.nullable().optional(),
		vatAmount: z.number().nullable().optional(),
	})
	.loose();

/** The product embedded inside a sale document line - a snapshot at the time the line was priced, not a live reference. */
const LineProductOutputSchema = z
	.object({
		active: z.boolean().nullable().optional(),
		defaultQuantity: z.number().nullable().optional(),
		description: z.string().nullable().optional(),
		family: FamilyRefOutputSchema.nullable().optional(),
		id: z.number().nullable().optional(),
		imageUrl: z.string().nullable().optional(),
		internalId: z.string().nullable().optional(),
		internalNotes: z.string().nullable().optional(),
		isUnitPriceTaxIncluded: z.boolean().nullable().optional(),
		name: z.string().nullable().optional(),
		number: z.string().nullable().optional(),
		purchasePrice: z.number().nullable().optional(),
		type: z.string().nullable().optional(),
		unit: UnitRefOutputSchema.nullable().optional(),
		unitPrice: z.number().nullable().optional(),
		vat: VatRefOutputSchema.nullable().optional(),
	})
	.loose();

const LineOutputSchema = z
	.object({
		classificationId: z.number().nullable().optional(),
		date: z.string().nullable().optional(),
		description: z.string().nullable().optional(),
		discount: DiscountOutputSchema.nullable().optional(),
		id: z.number().nullable().optional(),
		marginAmount: z.number().nullable().optional(),
		marginRate: z.number().nullable().optional(),
		product: LineProductOutputSchema.nullable().optional(),
		productId: z.number().nullable().optional(),
		productInternalId: z.string().nullable().optional(),
		productNumber: z.string().nullable().optional(),
		purchasePrice: z.number().nullable().optional(),
		quantity: z.number().nullable().optional(),
		taxExcludedAmount: z.number().nullable().optional(),
		taxExcludedPrice: z.number().nullable().optional(),
		taxIncludedAmount: z.number().nullable().optional(),
		taxIncludedPrice: z.number().nullable().optional(),
		type: z.string().nullable().optional(),
		unit: UnitRefOutputSchema.nullable().optional(),
		vat: VatRefOutputSchema.nullable().optional(),
	})
	.loose();

/** Shared by invoices, credits and quotes - the "sale document" shape Altoviz returns for all three. */
const SaleDocumentOutputSchema = z
	.object({
		id: z.number(),
		number: z.string().nullable().optional(),
		internalId: z.string().nullable().optional(),
		date: z.string().nullable().optional(),
		subject: z.string().nullable().optional(),
		customerId: z.number().nullable().optional(),
		customerName: z.string().nullable().optional(),
		customerNumber: z.string().nullable().optional(),
		customerType: z.string().nullable().optional(),
		customerElectronicAddress: z.string().nullable().optional(),
		customerOrderReference: z.string().nullable().optional(),
		customerSiret: z.string().nullable().optional(),
		customerVatNumber: z.string().nullable().optional(),
		billingAddress: AddressOutputSchema.nullable().optional(),
		shippingAddress: AddressOutputSchema.nullable().optional(),
		billingContact: ContactRefOutputSchema.nullable().optional(),
		shippingContact: ContactRefOutputSchema.nullable().optional(),
		headerNotes: z.string().nullable().optional(),
		footerNotes: z.string().nullable().optional(),
		internalNotes: z.string().nullable().optional(),
		lines: z.array(LineOutputSchema).nullable().optional(),
		globalDiscount: DiscountOutputSchema.nullable().optional(),
		shippingAmount: z.number().nullable().optional(),
		shippingVat: z.unknown().nullable().optional(),
		balance: z.number().nullable().optional(),
		grossTaxExcludedAmount: z.number().nullable().optional(),
		taxAmount: z.number().nullable().optional(),
		taxExcludedAmount: z.number().nullable().optional(),
		taxIncludedAmount: z.number().nullable().optional(),
		useTaxIncludedPrices: z.boolean().nullable().optional(),
		liableToVat: z.boolean().nullable().optional(),
		vatMode: z.string().nullable().optional(),
		vatNote: z.string().nullable().optional(),
		vatReverseCharge: z.boolean().nullable().optional(),
		region: z.string().nullable().optional(),
		vats: z.array(DocumentVatSummaryOutputSchema).nullable().optional(),
		metadata: z.record(z.string(), z.unknown()).nullable().optional(),
		pdfUrl: z.string().nullable().optional(),
		publicLink: z.string().nullable().optional(),
		sentAt: z.string().nullable().optional(),
		commitments: z.array(CommitmentOutputSchema).nullable().optional(),
		overdue: z.number().nullable().optional(),
		vendorReference: z.string().nullable().optional(),
	})
	.loose();

// ─────────────────────────────────────────────────────────────────────────────
// account
// ─────────────────────────────────────────────────────────────────────────────

const EmptyInputSchema = z.object({}).strict();
export type EmptyInput = z.infer<typeof EmptyInputSchema>;

const HelloOutputSchema = z
	.object({
		apiKeyName: z.string().nullable().optional(),
		companyName: z.string().nullable().optional(),
		message: z.string().nullable().optional(),
		serverTimestamp: z.string().nullable().optional(),
		url: z.string().nullable().optional(),
	})
	.loose();
export type HelloOutput = z.infer<typeof HelloOutputSchema>;

const CurrentUserOutputSchema = z
	.object({
		userId: z.string(),
		displayName: z.string().nullable().optional(),
		firstName: z.string().nullable().optional(),
		lastName: z.string().nullable().optional(),
		email: z.string().nullable().optional(),
		phone: z.string().nullable().optional(),
		profile: z.string().nullable().optional(),
		status: z.string().nullable().optional(),
	})
	.loose();
export type CurrentUserOutput = z.infer<typeof CurrentUserOutputSchema>;

/** Settings is a large, mostly-read-only configuration object - deliberately typed loose rather than field-by-field. */
const SettingsOutputSchema = z.record(z.string(), z.unknown());
export type SettingsOutput = z.infer<typeof SettingsOutputSchema>;

const UnitOutputSchema = z
	.object({
		id: z.number(),
		code: z.string().nullable().optional(),
		name: z.string().nullable().optional(),
		type: z.string().nullable().optional(),
		conversion: z.number().nullable().optional(),
		decimals: z.number().nullable().optional(),
	})
	.loose();
export type UnitOutput = z.infer<typeof UnitOutputSchema>;

const VatOutputSchema = VatRefOutputSchema.extend({ id: z.number() });
export type VatOutput = z.infer<typeof VatOutputSchema>;

const GetClassificationsInputSchema = z.object({
	/** Sale | Expense | Other - validated server-side, an unknown value is a 400. */
	type: z.enum(['Sale', 'Expense', 'Other']).optional(),
});
export type GetClassificationsInput = z.infer<
	typeof GetClassificationsInputSchema
>;

const ClassificationOutputSchema = z
	.object({
		id: z.number(),
		label: z.string().nullable().optional(),
		description: z.string().nullable().optional(),
		type: z.string().nullable().optional(),
		accountNumber: z.string().nullable().optional(),
		isProduct: z.boolean().nullable().optional(),
		isService: z.boolean().nullable().optional(),
		defaultVat: VatRefOutputSchema.nullable().optional(),
		microBusinessDeclarationType: z.string().nullable().optional(),
	})
	.loose();
export type ClassificationOutput = z.infer<typeof ClassificationOutputSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// customers
// ─────────────────────────────────────────────────────────────────────────────

/** The enum the API actually accepts - NOT the Company/Individual the catalog description documents. Sending either documented value is a 400. */
const CustomerTypeSchema = z.enum(['Business', 'Consumer', 'Government']);

const CustomerOutputSchema = z
	.object({
		id: z.number(),
		type: z.string().nullable().optional(),
		companyName: z.string().nullable().optional(),
		firstName: z.string().nullable().optional(),
		lastName: z.string().nullable().optional(),
		name: z.string().nullable().optional(),
		email: z.string().nullable().optional(),
		phone: z.string().nullable().optional(),
		cellPhone: z.string().nullable().optional(),
		title: z.string().nullable().optional(),
		number: z.string().nullable().optional(),
		internalId: z.string().nullable().optional(),
		internalNotes: z.string().nullable().optional(),
		active: z.boolean().nullable().optional(),
		billingAddress: AddressOutputSchema.nullable().optional(),
		shippingAddress: AddressOutputSchema.nullable().optional(),
		billingOptions: z.record(z.string(), z.unknown()).nullable().optional(),
		companyInformations: z
			.record(z.string(), z.unknown())
			.nullable()
			.optional(),
		family: FamilyRefOutputSchema.nullable().optional(),
	})
	.loose();
export type CustomerOutput = z.infer<typeof CustomerOutputSchema>;

const CreateCustomerInputSchema = z.object({
	type: CustomerTypeSchema,
	companyName: z.string().optional(),
	firstName: z.string().optional(),
	lastName: z.string().optional(),
	email: z.string().optional(),
	phone: z.string().optional(),
	cellPhone: z.string().optional(),
	title: z.string().optional(),
	/** Optional unless the customer numbering sequence has never been used on this tenant - then required, or the create is a 400 "La numerotation des Clients n'a pas ete initialisee.". */
	number: z.string().optional(),
	internalId: z.string().optional(),
	active: z.boolean().optional(),
	billingAddress: AddressInputSchema.optional(),
	shippingAddress: AddressInputSchema.optional(),
	billingOptions: z.record(z.string(), z.unknown()).optional(),
	companyInformations: z.record(z.string(), z.unknown()).optional(),
	/** Resolved to {label, number} via the customer-family mirror - id: {id} is silently dropped by the API. */
	familyId: AltovizIdSchema.optional(),
	internalNotes: z.string().optional(),
});
export type CreateCustomerInput = z.infer<typeof CreateCustomerInputSchema>;

/**
 * PUT clears every field the body omits - confirmed live: a partial update
 * cleared eleven fields to change one. Every field here is therefore optional
 * on the wire but the handler always reads the current record first and
 * merges the caller's fields over it, so a caller supplying one field never
 * loses the rest.
 */
const UpdateCustomerInputSchema = z.object({
	customerId: AltovizIdSchema,
	type: CustomerTypeSchema.optional(),
	companyName: z.string().optional(),
	firstName: z.string().optional(),
	lastName: z.string().optional(),
	email: z.string().optional(),
	phone: z.string().optional(),
	cellPhone: z.string().optional(),
	title: z.string().optional(),
	number: z.string().optional(),
	internalId: z.string().optional(),
	active: z.boolean().optional(),
	billingAddress: AddressInputSchema.optional(),
	shippingAddress: AddressInputSchema.optional(),
	billingOptions: z.record(z.string(), z.unknown()).optional(),
	companyInformations: z.record(z.string(), z.unknown()).optional(),
	familyId: AltovizIdSchema.optional(),
	internalNotes: z.string().optional(),
});
export type UpdateCustomerInput = z.infer<typeof UpdateCustomerInputSchema>;

const DeleteCustomerInputSchema = z.object({ customerId: AltovizIdSchema });
export type DeleteCustomerInput = z.infer<typeof DeleteCustomerInputSchema>;

const DeletedResultSchema = z.object({
	deleted: z.literal(true),
	id: z.number(),
});
export type DeletedResult = z.infer<typeof DeletedResultSchema>;

const GetCustomerInputSchema = z.object({ customerId: AltovizIdSchema });
export type GetCustomerInput = z.infer<typeof GetCustomerInputSchema>;

const GetCustomerByInternalIdInputSchema = z.object({ internalId: z.string() });
export type GetCustomerByInternalIdInput = z.infer<
	typeof GetCustomerByInternalIdInputSchema
>;

const FindCustomerInputSchema = z.object({
	email: z.string().optional(),
	internalId: z.string().optional(),
	number: z.string().optional(),
});
export type FindCustomerInput = z.infer<typeof FindCustomerInputSchema>;

const ListCustomersInputSchema = z.object(PagingInputSchema);
export type ListCustomersInput = z.infer<typeof ListCustomersInputSchema>;

const GetCustomerContactsInputSchema = z.object({
	customerId: AltovizIdSchema,
});
export type GetCustomerContactsInput = z.infer<
	typeof GetCustomerContactsInputSchema
>;

const ContactOutputSchema = z
	.object({
		id: z.number(),
		displayName: z.string().nullable().optional(),
		invertedDisplayName: z.string().nullable().optional(),
		firstName: z.string().nullable().optional(),
		lastName: z.string().nullable().optional(),
		companyName: z.string().nullable().optional(),
		email: z.string().nullable().optional(),
		phone: z.string().nullable().optional(),
		cellPhone: z.string().nullable().optional(),
		function: z.string().nullable().optional(),
		service: z.string().nullable().optional(),
		title: z.string().nullable().optional(),
		internalId: z.string().nullable().optional(),
		isMain: z.boolean().nullable().optional(),
	})
	.loose();
export type ContactOutput = z.infer<typeof ContactOutputSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// customerFamilies
// ─────────────────────────────────────────────────────────────────────────────

const CustomerFamilyOutputSchema = z
	.object({
		id: z.number(),
		label: z.string().nullable().optional(),
		number: z.string().nullable().optional(),
		internalId: z.string().nullable().optional(),
	})
	.loose();
export type CustomerFamilyOutput = z.infer<typeof CustomerFamilyOutputSchema>;

const CreateCustomerFamilyInputSchema = z.object({
	label: z.string().min(1),
	number: z.string().optional(),
	internalId: z.string().optional(),
});
export type CreateCustomerFamilyInput = z.infer<
	typeof CreateCustomerFamilyInputSchema
>;

const GetCustomerFamilyInputSchema = z.object({ familyId: AltovizIdSchema });
export type GetCustomerFamilyInput = z.infer<
	typeof GetCustomerFamilyInputSchema
>;

/** No cascade: deleting a family that still holds a member is a 409, not a delete - confirmed live. */
const DeleteCustomerFamilyInputSchema = z.object({ familyId: AltovizIdSchema });
export type DeleteCustomerFamilyInput = z.infer<
	typeof DeleteCustomerFamilyInputSchema
>;

const ListCustomerFamiliesInputSchema = z.object(PagingInputSchema);
export type ListCustomerFamiliesInput = z.infer<
	typeof ListCustomerFamiliesInputSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// suppliers
// ─────────────────────────────────────────────────────────────────────────────

const SupplierOutputSchema = z
	.object({
		id: z.number(),
		name: z.string().nullable().optional(),
		firstName: z.string().nullable().optional(),
		lastName: z.string().nullable().optional(),
		email: z.string().nullable().optional(),
		phone: z.string().nullable().optional(),
		cellPhone: z.string().nullable().optional(),
		title: z.string().nullable().optional(),
		number: z.string().nullable().optional(),
		internalId: z.string().nullable().optional(),
		internalNotes: z.string().nullable().optional(),
		active: z.boolean().nullable().optional(),
		address: AddressOutputSchema.nullable().optional(),
		defaultPaymentMethod: z.string().nullable().optional(),
		companyInformations: z
			.record(z.string(), z.unknown())
			.nullable()
			.optional(),
		createdAt: z.string().nullable().optional(),
		createdById: z.string().nullable().optional(),
		updatedAt: z.string().nullable().optional(),
		updatedById: z.string().nullable().optional(),
	})
	.loose();
export type SupplierOutput = z.infer<typeof SupplierOutputSchema>;

const GetSupplierInputSchema = z.object({ supplierId: AltovizIdSchema });
export type GetSupplierInput = z.infer<typeof GetSupplierInputSchema>;

const ListSuppliersInputSchema = z.object(PagingInputSchema);
export type ListSuppliersInput = z.infer<typeof ListSuppliersInputSchema>;

/** Same clearing PUT semantics as customers - the handler reads the current record and merges. */
const UpdateSupplierInputSchema = z.object({
	supplierId: AltovizIdSchema,
	name: z.string().optional(),
	firstName: z.string().optional(),
	lastName: z.string().optional(),
	email: z.string().optional(),
	phone: z.string().optional(),
	cellPhone: z.string().optional(),
	title: z.string().optional(),
	number: z.string().optional(),
	internalId: z.string().optional(),
	address: AddressInputSchema.optional(),
	defaultPaymentMethod: z.string().optional(),
	internalNotes: z.string().optional(),
});
export type UpdateSupplierInput = z.infer<typeof UpdateSupplierInputSchema>;

const DeleteSupplierInputSchema = z.object({ supplierId: AltovizIdSchema });
export type DeleteSupplierInput = z.infer<typeof DeleteSupplierInputSchema>;

const GetSupplierContactsInputSchema = z.object({
	supplierId: AltovizIdSchema,
});
export type GetSupplierContactsInput = z.infer<
	typeof GetSupplierContactsInputSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// contacts
// ─────────────────────────────────────────────────────────────────────────────

/** No customerId field exists on this route - confirmed live. There is no way to attach a standalone contact to a customer through this operation. */
const CreateContactInputSchema = z.object({
	firstName: z.string().optional(),
	lastName: z.string().optional(),
	email: z.string().optional(),
	phone: z.string().optional(),
	cellPhone: z.string().optional(),
	companyName: z.string().optional(),
	function: z.string().optional(),
	service: z.string().optional(),
	title: z.string().optional(),
	displayName: z.string().optional(),
	invertedDisplayName: z.string().optional(),
	internalId: z.string().optional(),
});
export type CreateContactInput = z.infer<typeof CreateContactInputSchema>;

const GetContactInputSchema = z.object({ contactId: AltovizIdSchema });
export type GetContactInput = z.infer<typeof GetContactInputSchema>;

const FindContactInputSchema = z.object({
	email: z.string().optional(),
	internalId: z.string().optional(),
});
export type FindContactInput = z.infer<typeof FindContactInputSchema>;

const ListContactsInputSchema = z.object(PagingInputSchema);
export type ListContactsInput = z.infer<typeof ListContactsInputSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// colleagues
// ─────────────────────────────────────────────────────────────────────────────

const ColleagueOutputSchema = z
	.object({
		id: z.number(),
		firstName: z.string().nullable().optional(),
		lastName: z.string().nullable().optional(),
		name: z.string().nullable().optional(),
		email: z.string().nullable().optional(),
		phone: z.string().nullable().optional(),
		cellPhone: z.string().nullable().optional(),
		title: z.string().nullable().optional(),
		number: z.string().nullable().optional(),
		internalId: z.string().nullable().optional(),
		isPartner: z.boolean().nullable().optional(),
		initialPartnerBalance: z.number().nullable().optional(),
		homecareServiceNumber: z.string().nullable().optional(),
		userId: z.string().nullable().optional(),
		metadatas: z.record(z.string(), z.unknown()).nullable().optional(),
	})
	.loose();
export type ColleagueOutput = z.infer<typeof ColleagueOutputSchema>;

const GetColleagueInputSchema = z.object({ colleagueId: AltovizIdSchema });
export type GetColleagueInput = z.infer<typeof GetColleagueInputSchema>;

const ListColleaguesInputSchema = z.object(PagingInputSchema);
export type ListColleaguesInput = z.infer<typeof ListColleaguesInputSchema>;

/**
 * A PARTIAL body here is a 500, not a 400 - confirmed live. read-modify-write
 * happens to be the fix for both the clearing-PUT problem elsewhere and this
 * 500, since the handler always sends the full merged record back.
 */
const UpdateColleagueInputSchema = z.object({
	colleagueId: AltovizIdSchema,
	firstName: z.string().optional(),
	lastName: z.string().optional(),
	name: z.string().optional(),
	email: z.string().optional(),
	phone: z.string().optional(),
	cellPhone: z.string().optional(),
	title: z.string().optional(),
	number: z.string().optional(),
	internalId: z.string().optional(),
	isPartner: z.boolean().optional(),
	initialPartnerBalance: z.number().optional(),
	homecareServiceNumber: z.string().optional(),
	userId: z.string().optional(),
	metadatas: z.record(z.string(), z.unknown()).optional(),
});
export type UpdateColleagueInput = z.infer<typeof UpdateColleagueInputSchema>;

const DeleteColleagueInputSchema = z.object({ colleagueId: AltovizIdSchema });
export type DeleteColleagueInput = z.infer<typeof DeleteColleagueInputSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// webhookSubscriptions
// ─────────────────────────────────────────────────────────────────────────────

const ListWebhooksInputSchema = EmptyInputSchema;
export type ListWebhooksInput = z.infer<typeof ListWebhooksInputSchema>;

const WebhookOutputSchema = z
	.object({
		id: z.number(),
		name: z.string().nullable().optional(),
		url: z.string().nullable().optional(),
		types: z.array(z.string()).nullable().optional(),
		secretKey: z.string().nullable().optional(),
	})
	.loose();
export type WebhookOutput = z.infer<typeof WebhookOutputSchema>;

const AltovizWebhookEventType = z.enum([
	'CustomerCreated',
	'CustomerUpdated',
	'CustomerDeleted',
	'ContactCreated',
	'ContactUpdated',
	'ContactDeleted',
	'ProductCreated',
	'ProductUpdated',
	'ProductDeleted',
	'InvoiceCreated',
	'InvoiceUpdated',
	'InvoiceDeleted',
	'QuoteCreated',
	'QuoteUpdated',
	'QuoteDeleted',
]);

const RegisterWebhookInputSchema = z.object({
	name: z.string().min(1),
	url: z.string().min(1),
	types: z.array(AltovizWebhookEventType).min(1),
	secretKey: z.string().optional(),
});
export type RegisterWebhookInput = z.infer<typeof RegisterWebhookInputSchema>;

/**
 * REGISTER_WEBHOOK answers 201 with id: 0 - the real id only appears in
 * LIST_WEBHOOKS, and that list is eventually consistent (a deleted webhook
 * reappeared for one call about two seconds after its delete). The output
 * schema follows what the provider actually sends rather than inventing a
 * meaningful id.
 */
const RegisterWebhookOutputSchema = WebhookOutputSchema;
export type RegisterWebhookOutput = z.infer<typeof RegisterWebhookOutputSchema>;

/**
 * Both `id` and `url` are optional in the provider's own spec, so a call
 * supplying neither could delete broadly - this was deliberately never
 * probed live. Exactly one is required here, enforced before the request is
 * built.
 */
const UnregisterWebhookInputSchema = z
	.object({
		webhookId: AltovizIdSchema.optional(),
		url: z.string().optional(),
	})
	.refine((v) => (v.webhookId !== undefined) !== (v.url !== undefined), {
		message: 'Provide exactly one of webhookId or url to unregister a webhook.',
	});
export type UnregisterWebhookInput = z.infer<
	typeof UnregisterWebhookInputSchema
>;

/**
 * Unregister echoes back whichever key the caller deleted by. Deleting by url
 * carries no id, so `id` stays absent rather than being faked as 0 (which
 * collides with the register placeholder) - the shared DeletedResult cannot
 * express that, hence a dedicated shape.
 */
const UnregisterWebhookOutputSchema = z.object({
	deleted: z.literal(true),
	id: z.number().optional(),
	url: z.string().optional(),
});
export type UnregisterWebhookOutput = z.infer<
	typeof UnregisterWebhookOutputSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// products
// ─────────────────────────────────────────────────────────────────────────────

const ProductOutputSchema = z
	.object({
		id: z.number(),
		name: z.string().nullable().optional(),
		number: z.string().nullable().optional(),
		description: z.string().nullable().optional(),
		type: z.string().nullable().optional(),
		unitPrice: z.number().nullable().optional(),
		purchasePrice: z.number().nullable().optional(),
		isUnitPriceTaxIncluded: z.boolean().nullable().optional(),
		defaultQuantity: z.number().nullable().optional(),
		unit: UnitRefOutputSchema.nullable().optional(),
		vat: VatRefOutputSchema.nullable().optional(),
		family: FamilyRefOutputSchema.nullable().optional(),
		imageUrl: z.string().nullable().optional(),
		internalId: z.string().nullable().optional(),
		internalNotes: z.string().nullable().optional(),
		active: z.boolean().nullable().optional(),
	})
	.loose();
export type ProductOutput = z.infer<typeof ProductOutputSchema>;

const CreateProductInputSchema = z.object({
	name: z.string().min(1),
	number: z.string().optional(),
	description: z.string().optional(),
	type: z.enum(['Product', 'Service', 'Text']),
	unitPrice: z.number().optional(),
	purchasePrice: z.number().optional(),
	isUnitPriceTaxIncluded: z.boolean().optional(),
	defaultQuantity: z.number().optional(),
	/** Resolved to {code} via the units mirror - id: {id} is a documented-but-wrong shape here. */
	unitId: AltovizIdSchema.optional(),
	/** Resolved to {rate, region} via the VAT mirror - vat: {id} is a 400 "La TVA n'existe pas.". */
	vatId: AltovizIdSchema.optional(),
	/** Resolved to {label, number} via the product-family mirror. */
	familyId: AltovizIdSchema.optional(),
	internalId: z.string().optional(),
	internalNotes: z.string().optional(),
	active: z.boolean().optional(),
});
export type CreateProductInput = z.infer<typeof CreateProductInputSchema>;

const DeleteProductInputSchema = z.object({ productId: AltovizIdSchema });
export type DeleteProductInput = z.infer<typeof DeleteProductInputSchema>;

const GetProductInputSchema = z.object({ productId: AltovizIdSchema });
export type GetProductInput = z.infer<typeof GetProductInputSchema>;

/** Same route as FindProductByNumberOrId - an empty call 400s "Number or internal ID have to be defined", so require `number` client-side. */
const FindProductInputSchema = z
	.object({ number: z.string().optional() })
	.refine((v) => v.number !== undefined, { message: 'Provide number.' });
export type FindProductInput = z.infer<typeof FindProductInputSchema>;

/** Superset of FindProduct - same route (`GET /v1/products/find`), and requires at least one parameter or the API 400s "Number or internal ID have to be defined". */
const FindProductByNumberOrIdInputSchema = z
	.object({
		number: z.string().optional(),
		internalId: z.string().optional(),
	})
	.refine((v) => v.number !== undefined || v.internalId !== undefined, {
		message: 'Provide number or internalId.',
	});
export type FindProductByNumberOrIdInput = z.infer<
	typeof FindProductByNumberOrIdInputSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// productFamilies
// ─────────────────────────────────────────────────────────────────────────────

const ProductFamilyOutputSchema = z
	.object({
		id: z.number(),
		label: z.string().nullable().optional(),
		number: z.string().nullable().optional(),
	})
	.loose();
export type ProductFamilyOutput = z.infer<typeof ProductFamilyOutputSchema>;

const CreateProductFamilyInputSchema = z.object({
	label: z.string().min(1),
	number: z.string().optional(),
});
export type CreateProductFamilyInput = z.infer<
	typeof CreateProductFamilyInputSchema
>;

const GetProductFamilyInputSchema = z.object({ familyId: AltovizIdSchema });
export type GetProductFamilyInput = z.infer<typeof GetProductFamilyInputSchema>;

const DeleteProductFamilyInputSchema = z.object({ familyId: AltovizIdSchema });
export type DeleteProductFamilyInput = z.infer<
	typeof DeleteProductFamilyInputSchema
>;

const ListProductFamiliesInputSchema = z.object(PagingInputSchema);
export type ListProductFamiliesInput = z.infer<
	typeof ListProductFamiliesInputSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// saleInvoices
// ─────────────────────────────────────────────────────────────────────────────

const SaleInvoiceOutputSchema = SaleDocumentOutputSchema.extend({
	isDraft: z.boolean().nullable().optional(),
	isPaid: z.boolean().nullable().optional(),
	isCancelled: z.boolean().nullable().optional(),
	isProforma: z.boolean().nullable().optional(),
	cancellationCreditId: z.number().nullable().optional(),
	cancellationCreditNumber: z.string().nullable().optional(),
	// Observed live but absent from the published schema; all captures were null,
	// so retain the fields without pretending their non-null types are known.
	cancelledCreditId: z.unknown().nullable().optional(),
	cancelledCreditNumber: z.unknown().nullable().optional(),
	eInvoicingInvoiceId: z.unknown().nullable().optional(),
	eInvoicingProviderId: z.unknown().nullable().optional(),
	eInvoicingStatus: z.unknown().nullable().optional(),
	replacedBy: z.number().nullable().optional(),
});
export type SaleInvoiceOutput = z.infer<typeof SaleInvoiceOutputSchema>;

const CreateSaleInvoiceInputSchema = z.object({
	customerId: AltovizIdSchema,
	date: AltovizDateSchema,
	subject: z.string().optional(),
	headerNotes: z.string().optional(),
	footerNotes: z.string().optional(),
	/** Required in practice: an invoice without lines is a 400 "The specified condition was not met for 'Lines'.". */
	lines: z.array(AltovizLineInputSchema).min(1),
	globalDiscount: z
		.object({ type: z.enum(['Percent', 'Fixed']), value: z.number() })
		.optional(),
	shippingAmount: z.number().optional(),
	vatMode: z.enum(['Auto', 'Debit', 'Collection']).optional(),
	region: z.enum(['FR', 'EU', 'IE', 'DOM', 'Corse', 'Monaco']).optional(),
	liableToVat: z.boolean().optional(),
	vatReverseCharge: z.boolean().optional(),
	useTaxIncludedPrices: z.boolean().optional(),
	isDraft: z.boolean().optional(),
	internalId: z.string().optional(),
	metadata: z.record(z.string(), z.unknown()).optional(),
});
export type CreateSaleInvoiceInput = z.infer<
	typeof CreateSaleInvoiceInputSchema
>;

const GetSaleInvoiceInputSchema = z.object({ invoiceId: AltovizIdSchema });
export type GetSaleInvoiceInput = z.infer<typeof GetSaleInvoiceInputSchema>;

const FindSaleInvoiceInputSchema = z.object({
	internalId: z.string().optional(),
});
export type FindSaleInvoiceInput = z.infer<typeof FindSaleInvoiceInputSchema>;

const ListSaleInvoicesInputSchema = z.object({
	...PagingInputSchema,
	from: AltovizDateSchema.optional(),
	to: AltovizDateSchema.optional(),
	customerId: AltovizIdSchema.optional(),
	status: z.enum(['Draft', 'Incoming', 'Expired', 'Paid', 'ToSend']).optional(),
	includeCancelled: z.boolean().optional(),
});
export type ListSaleInvoicesInput = z.infer<typeof ListSaleInvoicesInputSchema>;

/** Drafts only - a finalized invoice is expected to refuse the delete, though nothing here was finalized to confirm the exact status. */
const DeleteSaleInvoiceInputSchema = z.object({ invoiceId: AltovizIdSchema });
export type DeleteSaleInvoiceInput = z.infer<
	typeof DeleteSaleInvoiceInputSchema
>;

const DownloadSaleInvoiceInputSchema = z.object({ invoiceId: AltovizIdSchema });
export type DownloadSaleInvoiceInput = z.infer<
	typeof DownloadSaleInvoiceInputSchema
>;

/** The provider answers a real application/pdf; the shared transport decodes it with response.text(), which is lossy for binary - see client.ts. */
const DownloadOutputSchema = z.object({
	contentType: z.string().nullable(),
	body: z
		.string()
		.describe(
			'PDF bytes decoded through response.text() by the shared transport - may not be byte-exact. See the core-limitation note in client.ts.',
		),
});
export type DownloadOutput = z.infer<typeof DownloadOutputSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// saleCredits
// ─────────────────────────────────────────────────────────────────────────────

const SaleCreditOutputSchema = SaleDocumentOutputSchema.extend({
	isDraft: z.boolean().nullable().optional(),
	isPaid: z.boolean().nullable().optional(),
	isCancelled: z.boolean().nullable().optional(),
	/** The provider's own spelling, typo included - matched exactly on the wire and in the response. */
	cancelledInvoicetId: z.number().nullable().optional(),
	cancelledInvoicetNumber: z.string().nullable().optional(),
	cancellationInvoiceId: z.number().nullable().optional(),
	cancellationInvoiceNumber: z.string().nullable().optional(),
	// Returned by the live API but omitted from the published credit schema.
	replacedBy: z.unknown().nullable().optional(),
});
export type SaleCreditOutput = z.infer<typeof SaleCreditOutputSchema>;

const CreateSaleCreditInputSchema = z.object({
	customerId: AltovizIdSchema,
	/** Provider spelling, typo included - do not "fix" it to cancelledInvoiceId. */
	cancelledInvoicetId: AltovizIdSchema.optional(),
	cancelledInvoicetNumber: z.string().optional(),
	date: AltovizDateSchema,
	subject: z.string().optional(),
	headerNotes: z.string().optional(),
	footerNotes: z.string().optional(),
	lines: z.array(AltovizLineInputSchema).min(1),
	globalDiscount: z
		.object({ type: z.enum(['Percent', 'Fixed']), value: z.number() })
		.optional(),
	vatMode: z.enum(['Auto', 'Debit', 'Collection']).optional(),
	region: z.enum(['FR', 'EU', 'IE', 'DOM', 'Corse', 'Monaco']).optional(),
	isDraft: z.boolean().optional(),
	internalId: z.string().optional(),
	metadata: z.record(z.string(), z.unknown()).optional(),
});
export type CreateSaleCreditInput = z.infer<typeof CreateSaleCreditInputSchema>;

const UpdateSaleCreditInputSchema = z.object({
	creditId: AltovizIdSchema,
	customerId: AltovizIdSchema.optional(),
	date: AltovizDateSchema.optional(),
	subject: z.string().optional(),
	headerNotes: z.string().optional(),
	footerNotes: z.string().optional(),
	/** Drafts only. Lines must be resent in full or the credit is emptied - this is the same clearing-write behaviour as PUT elsewhere. */
	lines: z.array(AltovizLineInputSchema).min(1),
	isDraft: z.boolean().optional(),
});
export type UpdateSaleCreditInput = z.infer<typeof UpdateSaleCreditInputSchema>;

const GetSaleCreditInputSchema = z.object({ creditId: AltovizIdSchema });
export type GetSaleCreditInput = z.infer<typeof GetSaleCreditInputSchema>;

const FindSaleCreditInputSchema = z.object({
	internalId: z.string().optional(),
});
export type FindSaleCreditInput = z.infer<typeof FindSaleCreditInputSchema>;

const ListSaleCreditsInputSchema = z.object({
	...PagingInputSchema,
	from: AltovizDateSchema.optional(),
	to: AltovizDateSchema.optional(),
	customerId: AltovizIdSchema.optional(),
});
export type ListSaleCreditsInput = z.infer<typeof ListSaleCreditsInputSchema>;

const DeleteSaleCreditInputSchema = z.object({ creditId: AltovizIdSchema });
export type DeleteSaleCreditInput = z.infer<typeof DeleteSaleCreditInputSchema>;

const DownloadSaleCreditInputSchema = z.object({ creditId: AltovizIdSchema });
export type DownloadSaleCreditInput = z.infer<
	typeof DownloadSaleCreditInputSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// saleQuotes
// ─────────────────────────────────────────────────────────────────────────────

const SaleQuoteOutputSchema = SaleDocumentOutputSchema.extend({
	status: z.string().nullable().optional(),
	validityDate: z.string().nullable().optional(),
	deposit: DiscountOutputSchema.nullable().optional(),
	acceptedAt: z.string().nullable().optional(),
	refusedAt: z.string().nullable().optional(),
});
export type SaleQuoteOutput = z.infer<typeof SaleQuoteOutputSchema>;

const FindSaleQuoteInputSchema = z.object({
	internalId: z.string().optional(),
});
export type FindSaleQuoteInput = z.infer<typeof FindSaleQuoteInputSchema>;

/**
 * The spec emits Status.From / Status.Status.From / Status.Status.Status - a
 * generator artefact. Live, Status is silently ignored and Status.Status is a
 * 500, so no status filter is exposed here; it would not do anything.
 */
const ListSaleQuotesInputSchema = z.object({
	...PagingInputSchema,
	from: AltovizDateSchema.optional(),
	to: AltovizDateSchema.optional(),
	customerId: AltovizIdSchema.optional(),
});
export type ListSaleQuotesInput = z.infer<typeof ListSaleQuotesInputSchema>;

/** Deleting a quote that does not exist ALSO returns 200 - confirmed live - so this operation cannot report a miss. */
const DeleteSaleQuoteInputSchema = z.object({ quoteId: AltovizIdSchema });
export type DeleteSaleQuoteInput = z.infer<typeof DeleteSaleQuoteInputSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// receipts
// ─────────────────────────────────────────────────────────────────────────────

const ReceiptLinkSchema = z.object({
	type: z.enum(['Commitment', 'Invoice', 'Credit']),
	id: AltovizIdSchema,
});

const ReceiptOutputSchema = z
	.object({
		id: z.number(),
		amount: z.number().nullable().optional(),
		date: z.string().nullable().optional(),
		paymentMethod: z.string().nullable().optional(),
		status: z.string().nullable().optional(),
		reference: z.string().nullable().optional(),
		notes: z.string().nullable().optional(),
		customerId: z.number().nullable().optional(),
		customerName: z.string().nullable().optional(),
		customerNumber: z.string().nullable().optional(),
		customerInternalId: z.string().nullable().optional(),
		internalId: z.string().nullable().optional(),
		links: z.array(z.record(z.string(), z.unknown())).nullable().optional(),
		metadata: z.record(z.string(), z.unknown()).nullable().optional(),
	})
	.loose();
export type ReceiptOutput = z.infer<typeof ReceiptOutputSchema>;

/**
 * `links` attaches the receipt to a Commitment | Invoice | Credit - but
 * confirmed live, linking to a DRAFT document is refused ("Impossible
 * d'encaisser un document en brouillon ... vous devez le finaliser au
 * prealable"). Finalize is outside this plugin's scope, so `links` mostly
 * cannot be used through catalog operations alone; the receipt still creates
 * fine standalone.
 */
const CreateReceiptInputSchema = z.object({
	amount: z.number(),
	date: AltovizDateSchema,
	paymentMethod: z.enum([
		'Transfer',
		'Order',
		'Check',
		'Cash',
		'Card',
		'Bill',
		'Usec',
		'Other',
	]),
	status: z.enum(['Success', 'Pending', 'Failed']).optional(),
	reference: z.string().optional(),
	notes: z.string().optional(),
	customerId: AltovizIdSchema.optional(),
	customerName: z.string().optional(),
	customerNumber: z.string().optional(),
	customerInternalId: z.string().optional(),
	links: z.array(ReceiptLinkSchema).optional(),
	internalId: z.string().optional(),
	metadata: z.record(z.string(), z.unknown()).optional(),
});
export type CreateReceiptInput = z.infer<typeof CreateReceiptInputSchema>;

/** customerId (or number / internalId) is required even on update - confirmed live: "Customer ID, number or internal ID must be defined" without it. Read-modify-write, same as every other update in this plugin. */
const UpdateReceiptInputSchema = z.object({
	receiptId: AltovizIdSchema,
	amount: z.number().optional(),
	date: AltovizDateSchema.optional(),
	paymentMethod: z
		.enum([
			'Transfer',
			'Order',
			'Check',
			'Cash',
			'Card',
			'Bill',
			'Usec',
			'Other',
		])
		.optional(),
	status: z.enum(['Success', 'Pending', 'Failed']).optional(),
	reference: z.string().optional(),
	notes: z.string().optional(),
	customerId: AltovizIdSchema.optional(),
	links: z.array(ReceiptLinkSchema).optional(),
});
export type UpdateReceiptInput = z.infer<typeof UpdateReceiptInputSchema>;

const GetReceiptInputSchema = z.object({ receiptId: AltovizIdSchema });
export type GetReceiptInput = z.infer<typeof GetReceiptInputSchema>;

const FindReceiptInputSchema = z.object({ internalId: z.string().optional() });
export type FindReceiptInput = z.infer<typeof FindReceiptInputSchema>;

const ListReceiptsInputSchema = z.object(PagingInputSchema);
export type ListReceiptsInput = z.infer<typeof ListReceiptsInputSchema>;

const DeleteReceiptInputSchema = z.object({ receiptId: AltovizIdSchema });
export type DeleteReceiptInput = z.infer<typeof DeleteReceiptInputSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// purchaseInvoices
// ─────────────────────────────────────────────────────────────────────────────

/** The only multipart operation in the surface, and the only create with no delete anywhere in the API - an uploaded document can only be removed in the Altoviz UI. */
const UploadPurchaseInvoiceInputSchema = z.object({
	fileBase64: z.string().min(1),
	fileName: z.string().min(1),
	mimeType: z.string().default('application/pdf'),
});
export type UploadPurchaseInvoiceInput = z.infer<
	typeof UploadPurchaseInvoiceInputSchema
>;

const PurchaseInvoiceOutputSchema = z
	.object({
		id: z.number(),
		date: z.string().nullable().optional(),
		reference: z.string().nullable().optional(),
		subject: z.string().nullable().optional(),
		notes: z.string().nullable().optional(),
		region: z.string().nullable().optional(),
		status: z.string().nullable().optional(),
		supplier: z.unknown().nullable().optional(),
		taxIncludedAmount: z.number().nullable().optional(),
		vatReverseCharge: z.boolean().nullable().optional(),
		pdfUrl: z.string().nullable().optional(),
	})
	.loose();
export type PurchaseInvoiceOutput = z.infer<typeof PurchaseInvoiceOutputSchema>;

const DownloadPurchaseInvoiceInputSchema = z.object({
	purchaseInvoiceId: AltovizIdSchema,
});
export type DownloadPurchaseInvoiceInput = z.infer<
	typeof DownloadPurchaseInvoiceInputSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint input/output type maps
// ─────────────────────────────────────────────────────────────────────────────

export type AltovizEndpointInputs = {
	customersCreate: CreateCustomerInput;
	customersUpdate: UpdateCustomerInput;
	customersDelete: DeleteCustomerInput;
	customersGet: GetCustomerInput;
	customersGetByInternalId: GetCustomerByInternalIdInput;
	customersFind: FindCustomerInput;
	customersList: ListCustomersInput;
	customersGetContacts: GetCustomerContactsInput;

	customerFamiliesCreate: CreateCustomerFamilyInput;
	customerFamiliesGet: GetCustomerFamilyInput;
	customerFamiliesDelete: DeleteCustomerFamilyInput;
	customerFamiliesList: ListCustomerFamiliesInput;

	suppliersGet: GetSupplierInput;
	suppliersList: ListSuppliersInput;
	suppliersUpdate: UpdateSupplierInput;
	suppliersDelete: DeleteSupplierInput;
	suppliersGetContacts: GetSupplierContactsInput;

	contactsCreate: CreateContactInput;
	contactsGet: GetContactInput;
	contactsFind: FindContactInput;
	contactsList: ListContactsInput;

	colleaguesGet: GetColleagueInput;
	colleaguesList: ListColleaguesInput;
	colleaguesUpdate: UpdateColleagueInput;
	colleaguesDelete: DeleteColleagueInput;

	accountGetCurrentUser: EmptyInput;
	accountTestApiKey: EmptyInput;
	accountGetSettings: EmptyInput;
	accountGetUnits: EmptyInput;
	accountGetVats: EmptyInput;
	accountGetClassifications: GetClassificationsInput;

	webhookSubscriptionsList: ListWebhooksInput;
	webhookSubscriptionsRegister: RegisterWebhookInput;
	webhookSubscriptionsUnregister: UnregisterWebhookInput;

	productsCreate: CreateProductInput;
	productsDelete: DeleteProductInput;
	productsGet: GetProductInput;
	productsFind: FindProductInput;
	productsFindByNumberOrId: FindProductByNumberOrIdInput;

	productFamiliesCreate: CreateProductFamilyInput;
	productFamiliesGet: GetProductFamilyInput;
	productFamiliesDelete: DeleteProductFamilyInput;
	productFamiliesList: ListProductFamiliesInput;

	saleInvoicesCreate: CreateSaleInvoiceInput;
	saleInvoicesGet: GetSaleInvoiceInput;
	saleInvoicesFind: FindSaleInvoiceInput;
	saleInvoicesList: ListSaleInvoicesInput;
	saleInvoicesDelete: DeleteSaleInvoiceInput;
	saleInvoicesDownload: DownloadSaleInvoiceInput;

	saleCreditsCreate: CreateSaleCreditInput;
	saleCreditsUpdate: UpdateSaleCreditInput;
	saleCreditsGet: GetSaleCreditInput;
	saleCreditsFind: FindSaleCreditInput;
	saleCreditsList: ListSaleCreditsInput;
	saleCreditsDelete: DeleteSaleCreditInput;
	saleCreditsDownload: DownloadSaleCreditInput;

	saleQuotesFind: FindSaleQuoteInput;
	saleQuotesList: ListSaleQuotesInput;
	saleQuotesDelete: DeleteSaleQuoteInput;

	receiptsCreate: CreateReceiptInput;
	receiptsUpdate: UpdateReceiptInput;
	receiptsGet: GetReceiptInput;
	receiptsFind: FindReceiptInput;
	receiptsList: ListReceiptsInput;
	receiptsDelete: DeleteReceiptInput;

	purchaseInvoicesUpload: UploadPurchaseInvoiceInput;
	purchaseInvoicesDownload: DownloadPurchaseInvoiceInput;
};

export type AltovizEndpointOutputs = {
	customersCreate: CustomerOutput;
	customersUpdate: CustomerOutput;
	customersDelete: DeletedResult;
	customersGet: CustomerOutput;
	customersGetByInternalId: CustomerOutput;
	customersFind: CustomerOutput[];
	customersList: CustomerOutput[];
	customersGetContacts: ContactOutput[];

	customerFamiliesCreate: CustomerFamilyOutput;
	customerFamiliesGet: CustomerFamilyOutput;
	customerFamiliesDelete: DeletedResult;
	customerFamiliesList: CustomerFamilyOutput[];

	suppliersGet: SupplierOutput;
	suppliersList: SupplierOutput[];
	suppliersUpdate: SupplierOutput;
	suppliersDelete: DeletedResult;
	suppliersGetContacts: ContactOutput[];

	contactsCreate: ContactOutput;
	contactsGet: ContactOutput;
	contactsFind: ContactOutput[];
	contactsList: ContactOutput[];

	colleaguesGet: ColleagueOutput;
	colleaguesList: ColleagueOutput[];
	colleaguesUpdate: ColleagueOutput;
	colleaguesDelete: DeletedResult;

	accountGetCurrentUser: CurrentUserOutput;
	accountTestApiKey: HelloOutput;
	accountGetSettings: SettingsOutput;
	accountGetUnits: UnitOutput[];
	accountGetVats: VatOutput[];
	accountGetClassifications: ClassificationOutput[];

	webhookSubscriptionsList: WebhookOutput[];
	webhookSubscriptionsRegister: RegisterWebhookOutput;
	webhookSubscriptionsUnregister: UnregisterWebhookOutput;

	productsCreate: ProductOutput;
	productsDelete: DeletedResult;
	productsGet: ProductOutput;
	productsFind: ProductOutput[];
	productsFindByNumberOrId: ProductOutput[];

	productFamiliesCreate: ProductFamilyOutput;
	productFamiliesGet: ProductFamilyOutput;
	productFamiliesDelete: DeletedResult;
	productFamiliesList: ProductFamilyOutput[];

	saleInvoicesCreate: SaleInvoiceOutput;
	saleInvoicesGet: SaleInvoiceOutput;
	saleInvoicesFind: SaleInvoiceOutput[];
	saleInvoicesList: SaleInvoiceOutput[];
	saleInvoicesDelete: DeletedResult;
	saleInvoicesDownload: DownloadOutput;

	saleCreditsCreate: SaleCreditOutput;
	saleCreditsUpdate: SaleCreditOutput;
	saleCreditsGet: SaleCreditOutput;
	saleCreditsFind: SaleCreditOutput[];
	saleCreditsList: SaleCreditOutput[];
	saleCreditsDelete: DeletedResult;
	saleCreditsDownload: DownloadOutput;

	saleQuotesFind: SaleQuoteOutput[];
	saleQuotesList: SaleQuoteOutput[];
	saleQuotesDelete: DeletedResult;

	receiptsCreate: ReceiptOutput;
	receiptsUpdate: ReceiptOutput;
	receiptsGet: ReceiptOutput;
	receiptsFind: ReceiptOutput[];
	receiptsList: ReceiptOutput[];
	receiptsDelete: DeletedResult;

	purchaseInvoicesUpload: PurchaseInvoiceOutput;
	purchaseInvoicesDownload: DownloadOutput;
};

export const AltovizEndpointInputSchemas = {
	customersCreate: CreateCustomerInputSchema,
	customersUpdate: UpdateCustomerInputSchema,
	customersDelete: DeleteCustomerInputSchema,
	customersGet: GetCustomerInputSchema,
	customersGetByInternalId: GetCustomerByInternalIdInputSchema,
	customersFind: FindCustomerInputSchema,
	customersList: ListCustomersInputSchema,
	customersGetContacts: GetCustomerContactsInputSchema,

	customerFamiliesCreate: CreateCustomerFamilyInputSchema,
	customerFamiliesGet: GetCustomerFamilyInputSchema,
	customerFamiliesDelete: DeleteCustomerFamilyInputSchema,
	customerFamiliesList: ListCustomerFamiliesInputSchema,

	suppliersGet: GetSupplierInputSchema,
	suppliersList: ListSuppliersInputSchema,
	suppliersUpdate: UpdateSupplierInputSchema,
	suppliersDelete: DeleteSupplierInputSchema,
	suppliersGetContacts: GetSupplierContactsInputSchema,

	contactsCreate: CreateContactInputSchema,
	contactsGet: GetContactInputSchema,
	contactsFind: FindContactInputSchema,
	contactsList: ListContactsInputSchema,

	colleaguesGet: GetColleagueInputSchema,
	colleaguesList: ListColleaguesInputSchema,
	colleaguesUpdate: UpdateColleagueInputSchema,
	colleaguesDelete: DeleteColleagueInputSchema,

	accountGetCurrentUser: EmptyInputSchema,
	accountTestApiKey: EmptyInputSchema,
	accountGetSettings: EmptyInputSchema,
	accountGetUnits: EmptyInputSchema,
	accountGetVats: EmptyInputSchema,
	accountGetClassifications: GetClassificationsInputSchema,

	webhookSubscriptionsList: ListWebhooksInputSchema,
	webhookSubscriptionsRegister: RegisterWebhookInputSchema,
	webhookSubscriptionsUnregister: UnregisterWebhookInputSchema,

	productsCreate: CreateProductInputSchema,
	productsDelete: DeleteProductInputSchema,
	productsGet: GetProductInputSchema,
	productsFind: FindProductInputSchema,
	productsFindByNumberOrId: FindProductByNumberOrIdInputSchema,

	productFamiliesCreate: CreateProductFamilyInputSchema,
	productFamiliesGet: GetProductFamilyInputSchema,
	productFamiliesDelete: DeleteProductFamilyInputSchema,
	productFamiliesList: ListProductFamiliesInputSchema,

	saleInvoicesCreate: CreateSaleInvoiceInputSchema,
	saleInvoicesGet: GetSaleInvoiceInputSchema,
	saleInvoicesFind: FindSaleInvoiceInputSchema,
	saleInvoicesList: ListSaleInvoicesInputSchema,
	saleInvoicesDelete: DeleteSaleInvoiceInputSchema,
	saleInvoicesDownload: DownloadSaleInvoiceInputSchema,

	saleCreditsCreate: CreateSaleCreditInputSchema,
	saleCreditsUpdate: UpdateSaleCreditInputSchema,
	saleCreditsGet: GetSaleCreditInputSchema,
	saleCreditsFind: FindSaleCreditInputSchema,
	saleCreditsList: ListSaleCreditsInputSchema,
	saleCreditsDelete: DeleteSaleCreditInputSchema,
	saleCreditsDownload: DownloadSaleCreditInputSchema,

	saleQuotesFind: FindSaleQuoteInputSchema,
	saleQuotesList: ListSaleQuotesInputSchema,
	saleQuotesDelete: DeleteSaleQuoteInputSchema,

	receiptsCreate: CreateReceiptInputSchema,
	receiptsUpdate: UpdateReceiptInputSchema,
	receiptsGet: GetReceiptInputSchema,
	receiptsFind: FindReceiptInputSchema,
	receiptsList: ListReceiptsInputSchema,
	receiptsDelete: DeleteReceiptInputSchema,

	purchaseInvoicesUpload: UploadPurchaseInvoiceInputSchema,
	purchaseInvoicesDownload: DownloadPurchaseInvoiceInputSchema,
} as const;

export const AltovizEndpointOutputSchemas = {
	customersCreate: CustomerOutputSchema,
	customersUpdate: CustomerOutputSchema,
	customersDelete: DeletedResultSchema,
	customersGet: CustomerOutputSchema,
	customersGetByInternalId: CustomerOutputSchema,
	customersFind: z.array(CustomerOutputSchema),
	customersList: z.array(CustomerOutputSchema),
	customersGetContacts: z.array(ContactOutputSchema),

	customerFamiliesCreate: CustomerFamilyOutputSchema,
	customerFamiliesGet: CustomerFamilyOutputSchema,
	customerFamiliesDelete: DeletedResultSchema,
	customerFamiliesList: z.array(CustomerFamilyOutputSchema),

	suppliersGet: SupplierOutputSchema,
	suppliersList: z.array(SupplierOutputSchema),
	suppliersUpdate: SupplierOutputSchema,
	suppliersDelete: DeletedResultSchema,
	suppliersGetContacts: z.array(ContactOutputSchema),

	contactsCreate: ContactOutputSchema,
	contactsGet: ContactOutputSchema,
	contactsFind: z.array(ContactOutputSchema),
	contactsList: z.array(ContactOutputSchema),

	colleaguesGet: ColleagueOutputSchema,
	colleaguesList: z.array(ColleagueOutputSchema),
	colleaguesUpdate: ColleagueOutputSchema,
	colleaguesDelete: DeletedResultSchema,

	accountGetCurrentUser: CurrentUserOutputSchema,
	accountTestApiKey: HelloOutputSchema,
	accountGetSettings: SettingsOutputSchema,
	accountGetUnits: z.array(UnitOutputSchema),
	accountGetVats: z.array(VatOutputSchema),
	accountGetClassifications: z.array(ClassificationOutputSchema),

	webhookSubscriptionsList: z.array(WebhookOutputSchema),
	webhookSubscriptionsRegister: RegisterWebhookOutputSchema,
	webhookSubscriptionsUnregister: UnregisterWebhookOutputSchema,

	productsCreate: ProductOutputSchema,
	productsDelete: DeletedResultSchema,
	productsGet: ProductOutputSchema,
	productsFind: z.array(ProductOutputSchema),
	productsFindByNumberOrId: z.array(ProductOutputSchema),

	productFamiliesCreate: ProductFamilyOutputSchema,
	productFamiliesGet: ProductFamilyOutputSchema,
	productFamiliesDelete: DeletedResultSchema,
	productFamiliesList: z.array(ProductFamilyOutputSchema),

	saleInvoicesCreate: SaleInvoiceOutputSchema,
	saleInvoicesGet: SaleInvoiceOutputSchema,
	saleInvoicesFind: z.array(SaleInvoiceOutputSchema),
	saleInvoicesList: z.array(SaleInvoiceOutputSchema),
	saleInvoicesDelete: DeletedResultSchema,
	saleInvoicesDownload: DownloadOutputSchema,

	saleCreditsCreate: SaleCreditOutputSchema,
	saleCreditsUpdate: SaleCreditOutputSchema,
	saleCreditsGet: SaleCreditOutputSchema,
	saleCreditsFind: z.array(SaleCreditOutputSchema),
	saleCreditsList: z.array(SaleCreditOutputSchema),
	saleCreditsDelete: DeletedResultSchema,
	saleCreditsDownload: DownloadOutputSchema,

	saleQuotesFind: z.array(SaleQuoteOutputSchema),
	saleQuotesList: z.array(SaleQuoteOutputSchema),
	saleQuotesDelete: DeletedResultSchema,

	receiptsCreate: ReceiptOutputSchema,
	receiptsUpdate: ReceiptOutputSchema,
	receiptsGet: ReceiptOutputSchema,
	receiptsFind: z.array(ReceiptOutputSchema),
	receiptsList: z.array(ReceiptOutputSchema),
	receiptsDelete: DeletedResultSchema,

	purchaseInvoicesUpload: PurchaseInvoiceOutputSchema,
	purchaseInvoicesDownload: DownloadOutputSchema,
} as const;
