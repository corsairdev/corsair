import { z } from 'zod';

// Field reference: help.storeganise.com articles 297 (API best practices),
// 287 (access control integration), 475 (add-on technical reference), 19
// (webhooks) and 33 (developer settings). Those are the only official pages
// that name admin endpoints: the complete Admin API reference is
// access-gated by the vendor ("If you'd like to gain access to the Admin API
// documentation, please contact us."), so output schemas declare only fields
// those pages evidence (ids, owner/unit/customFields, result.siteId) or that
// were verified against the live public storefront API, and every other
// field rides through .loose() rather than being guessed.

const str = z.string().nullish();
const num = z.number().nullish();

// The exact UTC format the best-practices page prescribes for incremental
// sync: "?updatedAfter=YYYY-MM-DDTHH:MM:SS.000Z" (examples included).
const updatedAfter = z
	.string()
	.regex(
		/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
		'Expected the UTC format YYYY-MM-DDTHH:MM:SS.000Z',
	)
	.describe(
		'Only records updated at or after this UTC time, formatted as YYYY-MM-DDTHH:MM:SS.000Z.',
	);

// "Fetch multiple items (up to 50) simultaneously" via "?ids=id1,id2,id3",
// sent comma-separated in one query parameter.
const ids = z
	.array(z.string().min(1))
	.min(1)
	.max(50)
	.describe('Up to 50 record ids, sent comma-separated in one call.');

// Documented include values: "unit,owner,customFields" on unit rentals,
// "customFields" on records that store custom fields. The full vocabulary
// lives in the access-gated reference, so values beyond the documented ones
// are passed through rather than rejected.
const include = z
	.string()
	.min(1)
	.describe(
		'Comma-separated related records to embed, e.g. "unit,owner,customFields".',
	);

// Every record id in the official examples and in the live public API is a
// 24-character Mongo id string.

// unknown: custom field values are operator-defined JSON (booleans, access
// codes, nested objects), so the record stays open.
const CustomFieldsSchema = z.record(z.string(), z.unknown());

// Every record id in the official examples and in the live public API is a
// 24-character Mongo id string.
const recordId = z.string().min(1);

// ── Record shapes ─────────────────────────────────────────────────────────

// Storage unit dimensions and prices verified against the live public
// storefront API (GET /api/v1/sites/{code}/units); the admin list carries at
// least the same fields.
export const UnitSchema = z
	.object({
		id: recordId,
		siteId: str,
		typeId: str,
		name: str,
		length: num,
		width: num,
		height: num,
		measure: str,
		floor: str,
		defaultDeposit: num,
		defaultPrice: num,
	})
	.loose();

export type StoreganiseUnit = z.infer<typeof UnitSchema>;

// The access-control guide reads site.customFields to find per-site
// integration credentials.
export const SiteSchema = z
	.object({
		id: recordId,
		customFields: CustomFieldsSchema.nullish(),
	})
	.loose();

export type StoreganiseSite = z.infer<typeof SiteSchema>;

// The access-control guide reads rental.owner.email, so a user record has at
// least an email.
export const UserSchema = z
	.object({
		id: recordId,
		email: str,
	})
	.loose();

export type StoreganiseUser = z.infer<typeof UserSchema>;

export const InvoiceSchema = z
	.object({
		id: recordId,
	})
	.loose();

export type StoreganiseInvoice = z.infer<typeof InvoiceSchema>;

// Unit rental reads document the includes "unit,owner,customFields": the
// rental embeds its unit, its owner (the user renting) and its custom
// fields, where access-control integrations store access codes and
// overlock flags ({prefix}_accessCode, {prefix}_overlocked).
export const UnitRentalSchema = z
	.object({
		id: recordId,
		unit: UnitSchema.nullish(),
		owner: UserSchema.nullish(),
		customFields: CustomFieldsSchema.nullish(),
	})
	.loose();

export type StoreganiseUnitRental = z.infer<typeof UnitRentalSchema>;

// Webhook handlers fetch the job and then the site via
// sg.get('sites', job.result.siteId), so a job result names its site.
export const JobSchema = z
	.object({
		id: recordId,
		result: z
			.object({
				siteId: str,
			})
			.loose()
			.nullish(),
	})
	.loose();

export type StoreganiseJob = z.infer<typeof JobSchema>;

// The add-on reference reads addon.customFields straight off the fetched
// record, so the response embeds custom fields without an include.
export const AddonSchema = z
	.object({
		id: recordId,
		customFields: CustomFieldsSchema.nullish(),
	})
	.loose();

export type StoreganiseAddon = z.infer<typeof AddonSchema>;

// No admin settings shape is documented publicly; the one documented field
// is the webhook secret ("Secret is visible from the /api/v1/admin/settings
// request response"), whose exact key name the public pages do not spell
// out, so the whole body stays open rather than guessed.
export const SettingsSchema = z.object({}).loose();

export type StoreganiseSettings = z.infer<typeof SettingsSchema>;

// ── Inputs / outputs ──────────────────────────────────────────────────────

const SettingsGetInputSchema = z.object({});

const SitesListInputSchema = z.object({
	search: z
		.string()
		.min(1)
		.optional()
		.describe(
			'Search filter, including custom fields, e.g. "customField:foo".',
		),
});

const SitesGetInputSchema = z.object({
	siteIdOrCode: recordId.describe('Site id or site code, e.g. "central".'),
});

const UnitsListInputSchema = z.object({});

const UsersListInputSchema = z.object({
	updatedAfter: updatedAfter.optional(),
	ids: ids.optional(),
});

const UsersGetInputSchema = z.object({
	userIdOrEmail: recordId.describe('User id or email address.'),
});

const InvoicesListInputSchema = z.object({
	updatedAfter: updatedAfter.optional(),
	ids: ids.optional(),
});

const UnitRentalsListInputSchema = z.object({
	ids: ids.optional(),
	include: include.optional(),
});

const UnitRentalsGetInputSchema = z.object({
	unitRentalId: recordId,
	include: include.optional(),
});

const UnitRentalsUpdateInputSchema = z.object({
	unitRentalId: recordId,
	// The documented write body: sg.put('unit-rentals', rental.id,
	// { customFields: { myAC_accessCode: value } }). Access-control
	// conventions store booleans and six-digit codes under prefixed keys
	// ({prefix}_overlocked, {prefix}_accessCode).
	customFields: CustomFieldsSchema,
});

const JobsGetInputSchema = z.object({
	jobId: recordId,
});

const AddonsListInputSchema = z.object({});

const AddonsGetInputSchema = z.object({
	addonId: recordId,
});

export const StoreganiseEndpointInputSchemas = {
	settingsGet: SettingsGetInputSchema,
	sitesList: SitesListInputSchema,
	sitesGet: SitesGetInputSchema,
	unitsList: UnitsListInputSchema,
	usersList: UsersListInputSchema,
	usersGet: UsersGetInputSchema,
	invoicesList: InvoicesListInputSchema,
	unitRentalsList: UnitRentalsListInputSchema,
	unitRentalsGet: UnitRentalsGetInputSchema,
	unitRentalsUpdate: UnitRentalsUpdateInputSchema,
	jobsGet: JobsGetInputSchema,
	addonsList: AddonsListInputSchema,
	addonsGet: AddonsGetInputSchema,
};

export const StoreganiseEndpointOutputSchemas = {
	settingsGet: SettingsSchema,
	sitesList: z.array(SiteSchema),
	sitesGet: SiteSchema,
	unitsList: z.array(UnitSchema),
	usersList: z.array(UserSchema),
	usersGet: UserSchema,
	invoicesList: z.array(InvoiceSchema),
	unitRentalsList: z.array(UnitRentalSchema),
	unitRentalsGet: UnitRentalSchema,
	unitRentalsUpdate: UnitRentalSchema,
	jobsGet: JobSchema,
	addonsList: z.array(AddonSchema),
	addonsGet: AddonSchema,
};

export type StoreganiseEndpointInputs = {
	[K in keyof typeof StoreganiseEndpointInputSchemas]: z.input<
		(typeof StoreganiseEndpointInputSchemas)[K]
	>;
};

export type StoreganiseEndpointOutputs = {
	[K in keyof typeof StoreganiseEndpointOutputSchemas]: z.infer<
		(typeof StoreganiseEndpointOutputSchemas)[K]
	>;
};
