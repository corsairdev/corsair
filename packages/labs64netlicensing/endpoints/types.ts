import { z } from 'zod';

export const ListInputSchema = z.object({
	filter: z.string().min(1).optional(),
});

export const LicenseSchema = z.object({
	number: z.string().min(1),
	active: z.boolean().optional(),
});

export const ProductSchema = z.object({
	number: z.string().min(1),
	active: z.boolean().optional(),
	name: z.string().optional(),
	version: z.string().optional(),
});

const ListPageSchema = z
	.object({
		pageNumber: z.number().optional(),
		totalPages: z.number().optional(),
		totalItems: z.number().optional(),
		hasNext: z.boolean().optional(),
	})
	.describe('Paging from NetLicensing; ask for the next page with filter');

export const ListLicensesResponseSchema = z.object({
	licenses: z.array(LicenseSchema),
	page: ListPageSchema,
});

export const ListProductsResponseSchema = z.object({
	products: z.array(ProductSchema),
	page: ListPageSchema,
});

export type ListInput = z.infer<typeof ListInputSchema>;
export type ListLicensesResponse = z.infer<typeof ListLicensesResponseSchema>;
export type ListProductsResponse = z.infer<typeof ListProductsResponseSchema>;

export const NetLicensingEndpointInputSchemas = {
	'licenses.list': ListInputSchema,
	'products.list': ListInputSchema,
};

export const NetLicensingEndpointOutputSchemas = {
	'licenses.list': ListLicensesResponseSchema,
	'products.list': ListProductsResponseSchema,
};

// ── Entities as returned by get/create/update/list (all values strings) ──

export type ListShape = {
	name?: string;
	properties: Record<string, string>;
	lists?: ListShape[];
};

const ListNodeSchema: z.ZodType<ListShape> = z.lazy(() =>
	z.object({
		name: z.string().optional(),
		properties: z.record(z.string(), z.string()),
		lists: z.array(ListNodeSchema).optional(),
	}),
);

export const ItemSchema = z.object({
	type: z.string().optional(),
	number: z.string().optional(),
	active: z.boolean().optional(),
	name: z.string().optional(),
	properties: z
		.record(z.string(), z.string())
		.describe('Every property NetLicensing returned, custom ones included'),
	lists: z.array(ListNodeSchema).optional(),
});

const PageSchema = z.object({
	pageNumber: z.number().optional(),
	totalPages: z.number().optional(),
	totalItems: z.number().optional(),
	hasNext: z.boolean().optional(),
});

const ItemsResponseSchema = z.object({
	items: z.array(ItemSchema),
	page: PageSchema,
});

const ItemResponseSchema = z.object({ item: ItemSchema });

const DeletedResponseSchema = z.object({
	deleted: z.literal(true),
	number: z.string(),
});

// ── Inputs ──

const CustomProperties = z
	.record(z.string(), z.string())
	.optional()
	.describe('Extra fields NetLicensing stores as custom properties');

const ForceCascade = z
	.boolean()
	.optional()
	.describe('Also delete everything that depends on the entity');

const NumberRename = z
	.string()
	.min(1)
	.optional()
	.describe('New number for the entity (renames it)');

const Bool = z.boolean().optional();
const Str = z.string().min(1).optional();

const ProductFields = {
	active: Bool,
	name: Str,
	version: Str,
	licenseeAutoCreate: Bool.describe(
		'Create an unknown licensee on its first validation',
	),
	description: Str,
	licensingInfo: Str,
	discount: z
		.array(z.string())
		.optional()
		.describe(
			'Volume discounts as totalPrice;currency;amount (amount% for a percentage)',
		),
	licenseeSecretMode: z.enum(['PREDEFINED', 'CLIENT']).optional(),
	vatMode: z.enum(['GROSS', 'NET']).optional(),
	customProperties: CustomProperties,
};

export const ProductCreateInputSchema = z.object({
	number: Str.describe('Product number; generated when left out'),
	...ProductFields,
	name: z.string().min(1).describe('Product name'),
});
export const ProductUpdateInputSchema = z.object({
	productNumber: z.string().min(1),
	number: NumberRename,
	...ProductFields,
});
export const ProductGetInputSchema = z.object({
	productNumber: z.string().min(1),
});
export const ProductDeleteInputSchema = z.object({
	productNumber: z.string().min(1),
	forceCascade: ForceCascade,
});

const LicensingModel = z
	.string()
	.min(1)
	.describe(
		'TryAndBuy, Rental, Subscription, Floating, MultiFeature, PayPerUse, PricingTable, Quota, NodeLocked or Discount',
	);

const ProductModuleFields = {
	active: Bool,
	maxCheckoutValidity: Str.describe('Floating: max session time in seconds'),
	yellowThreshold: Str,
	redThreshold: Str,
	nodeSecretMode: z.enum(['PREDEFINED', 'CLIENT']).optional(),
	customProperties: CustomProperties,
};

export const ProductModuleListInputSchema = ListInputSchema;
export const ProductModuleCreateInputSchema = z.object({
	number: Str.describe('Module number; generated when left out'),
	productNumber: z.string().min(1),
	name: z.string().min(1),
	licensingModel: LicensingModel,
	...ProductModuleFields,
});
export const ProductModuleUpdateInputSchema = z.object({
	productModuleNumber: z.string().min(1),
	number: NumberRename,
	productNumber: Str,
	name: Str,
	licensingModel: LicensingModel.optional(),
	...ProductModuleFields,
});
export const ProductModuleGetInputSchema = z.object({
	productModuleNumber: z.string().min(1),
});
export const ProductModuleDeleteInputSchema = z.object({
	productModuleNumber: z.string().min(1),
	forceCascade: ForceCascade,
});

const LicenseTemplateFields = {
	active: Bool,
	price: Str.describe('Decimal price; above 0 needs currency'),
	currency: z.enum(['EUR', 'USD']).optional(),
	automatic: Bool.describe('Give every new licensee one license'),
	hidden: Bool,
	hideLicenses: Bool,
	timeVolume: Str,
	timeVolumePeriod: z.enum(['DAY', 'WEEK', 'MONTH', 'YEAR']).optional(),
	maxSessions: Str,
	quantity: Str,
	gracePeriod: Bool,
	promoCode: Str,
	discountType: z.enum(['PERCENT', 'FIX']).optional(),
	discountAmount: Str,
	discountCurrency: Str,
	minCartTotal: Str,
	startDate: Str,
	endDate: Str,
	customProperties: CustomProperties,
};

const LicenseType = z
	.enum(['FEATURE', 'TIMEVOLUME', 'FLOATING', 'QUANTITY'])
	.describe('Must fit the module licensing model');

export const LicenseTemplateCreateInputSchema = z.object({
	number: Str.describe('Template number; generated when left out'),
	productModuleNumber: z.string().min(1),
	name: z.string().min(1),
	licenseType: LicenseType,
	...LicenseTemplateFields,
});
export const LicenseTemplateUpdateInputSchema = z.object({
	licenseTemplateNumber: z.string().min(1),
	number: NumberRename,
	productModuleNumber: Str,
	name: Str,
	licenseType: LicenseType.optional(),
	...LicenseTemplateFields,
});
export const LicenseTemplateGetInputSchema = z.object({
	licenseTemplateNumber: z.string().min(1),
});
export const LicenseTemplateDeleteInputSchema = z.object({
	licenseTemplateNumber: z.string().min(1),
	forceCascade: ForceCascade,
});

const LicenseeFields = {
	active: Bool,
	name: Str,
	aliases: Str,
	markedForTransfer: Bool.describe(
		'Allow moving this licensee’s licenses away',
	),
	customProperties: CustomProperties,
};

export const LicenseeCreateInputSchema = z.object({
	productNumber: z.string().min(1),
	number: Str.describe('Licensee number; generated when left out'),
	...LicenseeFields,
});
export const LicenseeUpdateInputSchema = z.object({
	licenseeNumber: z.string().min(1),
	number: NumberRename,
	...LicenseeFields,
});
export const LicenseeGetInputSchema = z.object({
	licenseeNumber: z.string().min(1),
});
export const LicenseeDeleteInputSchema = z.object({
	licenseeNumber: z.string().min(1),
	forceCascade: ForceCascade,
});
export const LicenseeValidateInputSchema = z.object({
	licenseeNumber: z
		.string()
		.min(1)
		.max(1000)
		.describe('Licensee number or alias'),
	productNumber: Str.describe(
		'Needed when the licensee does not exist yet and the product auto-creates licensees',
	),
	licenseeName: Str,
	dryRun: Bool.describe('Validate without saving any change'),
	forOfflineUse: Bool,
	parameters: z
		.record(z.string(), z.string())
		.optional()
		.describe(
			'Per-module parameters as NetLicensing names them, e.g. { productModuleNumber: "M001", sessionId: "abc", action: "checkOut" }',
		),
});
export const LicenseeTransferInputSchema = z.object({
	licenseeNumber: z
		.string()
		.min(1)
		.describe('Licensee that receives the licenses'),
	sourceLicenseeNumber: z
		.string()
		.min(1)
		.describe('Licensee whose licenses move; must be markedForTransfer'),
});

const LicenseFields = {
	active: Bool,
	transactionNumber: Str,
	name: Str,
	hidden: Bool,
	startDate: Str,
	parentFeature: Str,
	timeVolume: Str,
	timeVolumePeriod: z.enum(['DAY', 'WEEK', 'MONTH', 'YEAR']).optional(),
	maxSessions: Str,
	quantity: Str,
	usedQuantity: Str,
	gracePeriod: Bool,
	customProperties: CustomProperties,
};

export const LicenseCreateInputSchema = z.object({
	number: Str.describe('License number; generated when left out'),
	licenseeNumber: z.string().min(1),
	licenseTemplateNumber: z.string().min(1),
	...LicenseFields,
});
export const LicenseUpdateInputSchema = z.object({
	licenseNumber: z.string().min(1),
	number: NumberRename,
	licenseeNumber: Str,
	licenseTemplateNumber: Str,
	...LicenseFields,
});
export const LicenseGetInputSchema = z.object({
	licenseNumber: z.string().min(1),
});
export const LicenseDeleteInputSchema = z.object({
	licenseNumber: z.string().min(1),
	forceCascade: ForceCascade,
});

export const TransactionGetInputSchema = z.object({
	transactionNumber: z.string().min(1),
});

// ── Outputs ──

export const ItemsOutputSchema = ItemsResponseSchema;
export const ItemOutputSchema = ItemResponseSchema;
export const DeletedOutputSchema = DeletedResponseSchema;
export const ValidateOutputSchema = z.object({
	ttl: z
		.string()
		.optional()
		.describe('Reuse this result until this time, then validate again'),
	validations: z.array(ItemSchema),
});
export const TransferOutputSchema = z.object({
	transferred: z.literal(true),
	licenseeNumber: z.string(),
	sourceLicenseeNumber: z.string(),
});

export type ItemsOutput = z.infer<typeof ItemsOutputSchema>;
export type ItemOutput = z.infer<typeof ItemOutputSchema>;
export type DeletedOutput = z.infer<typeof DeletedOutputSchema>;
