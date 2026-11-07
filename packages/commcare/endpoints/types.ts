import { z } from 'zod';

// Inputs use CommCare's own parameter names; output keys mirror the wire
// exactly, mixed snake/camel included. Outputs are `.loose()` and their
// documented fields nullish, so a field CommCare adds or omits cannot fail
// a call that has already happened. Field reference:
// https://commcare-hq.readthedocs.io/api/

const DomainSchema = z
	.string()
	.min(1)
	.describe('CommCare project domain (HQ domain), e.g. `my-project`.');

const FormIdSchema = z
	.string()
	.min(1)
	.describe('Form ID (UUID) of the submitted form.');

const CaseIdSchema = z.string().min(1).describe('Case ID (UUID).');

const UserIdSchema = z.string().min(1).describe('Mobile worker ID (UUID).');

const TagsSchema = z
	.array(z.string().min(1))
	.optional()
	.describe('Tags to attach.');

// ── shared output shapes ──────────────────────────────────────────────────

// Tastypie list envelope used by every v0.5/v1 listing endpoint.
const TastypieMetaSchema = z
	.object({
		limit: z.number().nullish(),
		next: z.string().nullish(),
		offset: z.number().nullish(),
		previous: z.string().nullish(),
		total_count: z.number().nullish(),
	})
	.loose();

const CommCareListSchema = (item: z.ZodType) =>
	z
		.object({
			objects: z.array(item),
			meta: TastypieMetaSchema.nullish(),
			// Flattened from `meta.next` by the endpoint shape helper.
			nextPageUrl: z.string().nullish(),
		})
		.loose();

export const CommCareFormSchema = z
	.object({
		id: z.string().nullish(),
		// unknown: unknown: XForm content varies per application form design.
		form: z.record(z.string(), z.unknown()).nullish(),
		// unknown: submission metadata (app_id, form_type, received_on…).
		metadata: z.record(z.string(), z.unknown()).nullish(),
	})
	.loose();

export type CommCareForm = z.infer<typeof CommCareFormSchema>;

export const CommCareCaseSchema = z
	.object({
		case_id: z.string().nullish(),
		domain: z.string().nullish(),
		case_type: z.string().nullish(),
		case_name: z.string().nullish(),
		external_id: z.string().nullish(),
		owner_id: z.string().nullish(),
		date_opened: z.string().nullish(),
		last_modified: z.string().nullish(),
		server_last_modified: z.string().nullish(),
		closed: z.boolean().nullish(),
		date_closed: z.string().nullish(),
		// unknown: case properties vary per application form design.
		properties: z.record(z.string(), z.unknown()).nullish(),
		// unknown: case indices vary per application.
		indices: z.record(z.string(), z.unknown()).nullish(),
	})
	.loose();

export type CommCareCase = z.infer<typeof CommCareCaseSchema>;

export const CommCareCaseListSchema = z
	.object({
		matching_records: z.number().nullish(),
		cases: z.array(CommCareCaseSchema),
		// Follow-next cursor link for the next page of results.
		next: z.string().nullish(),
	})
	.loose();

export type CommCareCaseList = z.infer<typeof CommCareCaseListSchema>;

export const CommCareUserSchema = z
	.object({
		type: z.string().nullish(),
		id: z.string().nullish(),
		username: z.string().nullish(),
		first_name: z.string().nullish(),
		last_name: z.string().nullish(),
		email: z.string().nullish(),
		default_phone_number: z.string().nullish(),
		phone_numbers: z.array(z.string()).nullish(),
		// unknown: unknown: free-form per-project user data.
		user_data: z.record(z.string(), z.unknown()).nullish(),
	})
	.loose();

export type CommCareUser = z.infer<typeof CommCareUserSchema>;

export const CommCareGroupSchema = z
	.object({
		id: z.string().nullish(),
		name: z.string().nullish(),
		path: z.array(z.string()).nullish(),
		reporting: z.boolean().nullish(),
		users: z.array(z.string()).nullish(),
	})
	.loose();

export type CommCareGroup = z.infer<typeof CommCareGroupSchema>;

export const CommCareWebUserSchema = z
	.object({
		id: z.string().nullish(),
		email: z.string().nullish(),
		first_name: z.string().nullish(),
		last_name: z.string().nullish(),
		default_phone_number: z.string().nullish(),
		role: z.string().nullish(),
		is_admin: z.boolean().nullish(),
		// unknown: unknown: permission keys vary by plan and role.
		permissions: z.record(z.string(), z.unknown()).nullish(),
	})
	.loose();

export type CommCareWebUser = z.infer<typeof CommCareWebUserSchema>;

export const CommCareLocationSchema = z
	.object({
		location_id: z.string().nullish(),
		name: z.string().nullish(),
		site_code: z.string().nullish(),
		location_type_code: z.string().nullish(),
		location_type_name: z.string().nullish(),
		parent_location_id: z.string().nullish(),
		longitude: z.string().nullish(),
		latitude: z.string().nullish(),
	})
	.loose();

export type CommCareLocation = z.infer<typeof CommCareLocationSchema>;

export const CommCareLocationTypeSchema = z
	.object({
		id: z.number().nullish(),
		code: z.string().nullish(),
		name: z.string().nullish(),
		administrative: z.boolean().nullish(),
		domain: z.string().nullish(),
		parent: z.unknown().nullish(),
	})
	.loose();

export type CommCareLocationType = z.infer<typeof CommCareLocationTypeSchema>;

export const CommCareGlossarySchema = z
	.object({
		id: z.string().nullish(),
		name: z.string().nullish(),
		// unknown: fixture tables are free-form lookup structures.
		fields: z.record(z.string(), z.unknown()).nullish(),
	})
	.loose();

export type CommCareGlossary = z.infer<typeof CommCareGlossarySchema>;

export const CommCareLookupTableSchema = z
	.object({
		id: z.string().nullish(),
		name: z.string().nullish(),
		// unknown: table columns are user-defined.
		fields: z
			.array(
				z
					.object({
						field_name: z.string(),
						properties: z.array(z.string()).nullish(),
					})
					.loose(),
			)
			.nullish(),
		created_at: z.string().nullish(),
		updated_at: z.string().nullish(),
	})
	.loose();

export type CommCareLookupTable = z.infer<typeof CommCareLookupTableSchema>;

export const CommCareReportSchema = z
	.object({
		id: z.string().nullish(),
		title: z.string().nullish(),
		// unknown: report column definitions vary per report.
		columns: z.array(z.record(z.string(), z.unknown())).nullish(),
	})
	.loose();

export type CommCareReport = z.infer<typeof CommCareReportSchema>;

export const CommCareReportDataSchema = z
	.object({
		// unknown: column slugs vary per report configuration.
		columns: z.array(z.record(z.string(), z.unknown())).nullish(),
		// unknown: data rows match the report's columns.
		data: z.array(z.record(z.string(), z.unknown())).nullish(),
		next_page: z.string().nullish(),
		total_records: z.number().nullish(),
	})
	.loose();

export type CommCareReportData = z.infer<typeof CommCareReportDataSchema>;

export const CommCareDetExportSchema = z
	.object({
		id: z.string().nullish(),
		name: z.string().nullish(),
		type: z.string().nullish(),
		export_format: z.string().nullish(),
	})
	.loose();

export type CommCareDetExport = z.infer<typeof CommCareDetExportSchema>;

// Bodyless answers: password reset answers 202 with an empty body, user
// delete answers 204, and several actions answer an empty object.
const EmptyObjectSchema = z.object({}).loose();

// ── forms.list ────────────────────────────────────────────────────────────

const FormsListInputSchema = z.object({
	domain: DomainSchema,
	limit: z
		.number()
		.int()
		.min(1)
		.max(1000)
		.optional()
		.describe('Page size, 1-1000; the default is 20.'),
	offset: z
		.number()
		.int()
		.min(0)
		.optional()
		.describe('Records to skip before this page.'),
	indexedOnStart: z
		.string()
		.optional()
		.describe(
			'Only forms with data modified at or after this ISO date, e.g. `2021-01-01T06:05:42`.',
		),
	indexedOnEnd: z
		.string()
		.optional()
		.describe('Only forms with data modified at or before this ISO date.'),
	xmlns: z
		.string()
		.optional()
		.describe('Only forms submitted against this XML namespace.'),
});

export type FormsListInput = z.input<typeof FormsListInputSchema>;

const FormsListResponseSchema = CommCareListSchema(CommCareFormSchema);

// ── forms.get ─────────────────────────────────────────────────────────────

const FormsGetInputSchema = z.object({
	domain: DomainSchema,
	formId: FormIdSchema,
});

export type FormsGetInput = z.input<typeof FormsGetInputSchema>;

const FormsGetResponseSchema = CommCareFormSchema;

// ── forms.bulkAction / forms.bulkActionStatus ─────────────────────────────

const FormsBulkActionInputSchema = z.object({
	domain: DomainSchema,
	action: z
		.enum(['archive', 'unarchive', 'delete'])
		.describe('What to do to the listed forms; delete is permanent.'),
	formIds: z
		.array(FormIdSchema)
		.min(1)
		.max(5000)
		.describe('Up to 5000 form IDs per request; duplicate ids are collapsed.'),
});

export type FormsBulkActionInput = z.input<typeof FormsBulkActionInputSchema>;

export const CommCareBulkActionSchema = z
	.object({
		id: z.string().nullish(),
		action: z.string().nullish(),
		// pending on creation; complete or failed when finished.
		status: z.string().nullish(),
		requested_by: z.string().nullish(),
		requested: z.number().nullish(),
		processed: z.number().nullish(),
		succeeded: z.number().nullish(),
		skipped: z.record(z.string(), z.unknown()).nullish(),
		created_at: z.string().nullish(),
		started_at: z.string().nullish(),
		completed_at: z.string().nullish(),
		status_url: z.string().nullish(),
		message: z.string().nullish(),
	})
	.loose();

export type CommCareBulkAction = z.infer<typeof CommCareBulkActionSchema>;

const FormsBulkActionResponseSchema = CommCareBulkActionSchema;

const FormsBulkActionStatusInputSchema = z.object({
	domain: DomainSchema,
	actionId: z
		.string()
		.min(1)
		.describe('Bulk action ID from a bulk action creation.'),
});

export type FormsBulkActionStatusInput = z.input<
	typeof FormsBulkActionStatusInputSchema
>;

const FormsBulkActionStatusResponseSchema = CommCareBulkActionSchema;

// ── cases.list / cases.get / cases.bulkFetch / cases.getByExternalId ──────

const CasesListInputSchema = z.object({
	domain: DomainSchema,
	cursor: z
		.string()
		.optional()
		.describe(
			"Cursor from the previous page's `next` link; omit for the oldest page.",
		),
	limit: z
		.number()
		.int()
		.min(1)
		.max(5000)
		.optional()
		.describe('Page size, up to 5000; the default is 20.'),
	caseType: z.string().optional().describe('Only cases of this case type.'),
	ownerId: z
		.string()
		.optional()
		.describe('Only cases owned by this user or group id.'),
	caseName: z.string().optional().describe('Only cases with this name.'),
	closed: z
		.boolean()
		.optional()
		.describe('true lists closed cases, false open ones.'),
	externalId: z
		.string()
		.optional()
		.describe('Only the case with this external id.'),
	indicesParent: z
		.string()
		.optional()
		.describe('Only child cases whose parent index points to this case id.'),
	indicesHost: z
		.string()
		.optional()
		.describe('Only cases whose host index points to this case id.'),
});

export type CasesListInput = z.input<typeof CasesListInputSchema>;

const CasesListResponseSchema = CommCareCaseListSchema;

const CasesGetInputSchema = z.object({
	domain: DomainSchema,
	caseId: CaseIdSchema,
});

export type CasesGetInput = z.input<typeof CasesGetInputSchema>;

const CasesGetResponseSchema = CommCareCaseSchema;

const CasesBulkFetchInputSchema = z.object({
	domain: DomainSchema,
	caseIds: z
		.array(CaseIdSchema)
		.min(1)
		.describe('Case IDs to fetch in one call.'),
	fields: z
		.array(z.string())
		.optional()
		.describe('Top-level case fields to include, e.g. `case_id`.'),
	fieldsProperties: z
		.array(z.string())
		.optional()
		.describe('Case properties to include, e.g. `dob`.'),
});

export type CasesBulkFetchInput = z.input<typeof CasesBulkFetchInputSchema>;

const CasesBulkFetchResponseSchema = CommCareCaseListSchema;

const CasesGetByExternalIdInputSchema = z.object({
	domain: DomainSchema,
	externalId: z
		.string()
		.min(1)
		.describe('External id the application assigned to the case.'),
	caseType: z
		.string()
		.optional()
		.describe('Case type to disambiguate the lookup.'),
});

export type CasesGetByExternalIdInput = z.input<
	typeof CasesGetByExternalIdInputSchema
>;

const CasesGetByExternalIdResponseSchema = CommCareCaseSchema;

// ── users.list / get / create / update / delete / sendPasswordReset ───────

const UsersListInputSchema = z.object({
	domain: DomainSchema,
	limit: PerPageLimitSchema(),
	offset: z
		.number()
		.int()
		.min(0)
		.optional()
		.describe('Records to skip before this page.'),
});

// v0.5 list endpoints default to a page size of 20.
function PerPageLimitSchema() {
	return z
		.number()
		.int()
		.min(1)
		.optional()
		.describe('Page size; the default is 20.');
}

export type UsersListInput = z.input<typeof UsersListInputSchema>;

const UsersListResponseSchema = CommCareListSchema(CommCareUserSchema);

const UsersGetInputSchema = z.object({
	domain: DomainSchema,
	userId: UserIdSchema,
});

export type UsersGetInput = z.input<typeof UsersGetInputSchema>;

const UsersGetResponseSchema = CommCareUserSchema;

const UsersCreateInputSchema = z.object({
	domain: DomainSchema,
	username: z
		.string()
		.min(1)
		.describe(
			'Login name including the domain suffix, e.g. `jdoe@my-project.commcarehq.org`.',
		),
	password: z.string().min(1).describe('Initial password for the worker.'),
	firstName: z.string().min(1).describe('First name of the worker.'),
	lastName: z.string().min(1).describe('Last name of the worker.'),
	email: z.string().optional().describe('Email address of the worker.'),
	phoneNumber: z
		.string()
		.optional()
		.describe('Primary phone number of the worker.'),
	// unknown: unknown: free-form per-project user data.
	userData: z
		.record(z.string(), z.unknown())
		.optional()
		.describe('Custom user data fields the application defines.'),
});

export type UsersCreateInput = z.input<typeof UsersCreateInputSchema>;

const UsersCreateResponseSchema = CommCareUserSchema;

const UsersUpdateInputSchema = z.object({
	domain: DomainSchema,
	userId: UserIdSchema,
	firstName: z.string().optional().describe('First name of the worker.'),
	lastName: z.string().optional().describe('Last name of the worker.'),
	email: z.string().optional().describe('Email address of the worker.'),
	phoneNumber: z
		.string()
		.optional()
		.describe('Primary phone number of the worker.'),
	// unknown: unknown: free-form per-project user data.
	userData: z
		.record(z.string(), z.unknown())
		.optional()
		.describe('Custom user data fields the application defines.'),
});

export type UsersUpdateInput = z.input<typeof UsersUpdateInputSchema>;

const UsersUpdateResponseSchema = CommCareUserSchema;

const UsersDeleteInputSchema = z.object({
	domain: DomainSchema,
	userId: UserIdSchema,
});

export type UsersDeleteInput = z.input<typeof UsersDeleteInputSchema>;

const UsersDeleteResponseSchema = EmptyObjectSchema;

const UsersSendPasswordResetInputSchema = z.object({
	domain: DomainSchema,
	userId: UserIdSchema,
});

export type UsersSendPasswordResetInput = z.input<
	typeof UsersSendPasswordResetInputSchema
>;

// The reset answers 202 Accepted with an empty body.
const UsersSendPasswordResetResponseSchema = EmptyObjectSchema;

// ── groups.list / get / create / update ───────────────────────────────────

const GroupsListInputSchema = z.object({ domain: DomainSchema });

export type GroupsListInput = z.input<typeof GroupsListInputSchema>;

const GroupsListResponseSchema = CommCareListSchema(CommCareGroupSchema);

const GroupsGetInputSchema = z.object({
	domain: DomainSchema,
	groupId: z.string().min(1).describe('Group ID (UUID).'),
});

export type GroupsGetInput = z.input<typeof GroupsGetInputSchema>;

const GroupsGetResponseSchema = CommCareGroupSchema;

const GroupsCreateInputSchema = z.object({
	domain: DomainSchema,
	name: z.string().min(1).describe('Name of the new group.'),
	reporting: z.boolean().optional().describe('Include the group in reporting.'),
	users: z
		.array(UserIdSchema)
		.optional()
		.describe('Mobile worker IDs to put in the group.'),
});

export type GroupsCreateInput = z.input<typeof GroupsCreateInputSchema>;

const GroupsCreateResponseSchema = CommCareGroupSchema;

const GroupsUpdateInputSchema = z.object({
	domain: DomainSchema,
	groupId: z.string().min(1).describe('Group ID to update.'),
	name: z.string().optional().describe('New name for the group.'),
	reporting: z.boolean().optional().describe('Include the group in reporting.'),
	users: z
		.array(UserIdSchema)
		.optional()
		.describe('Full replacement list of member user IDs.'),
});

export type GroupsUpdateInput = z.input<typeof GroupsUpdateInputSchema>;

const GroupsUpdateResponseSchema = CommCareGroupSchema;

// ── webUsers.list ─────────────────────────────────────────────────────────

const WebUsersListInputSchema = z.object({ domain: DomainSchema });

export type WebUsersListInput = z.input<typeof WebUsersListInputSchema>;

const WebUsersListResponseSchema = CommCareListSchema(CommCareWebUserSchema);

// ── locations.list / get ──────────────────────────────────────────────────

const LocationsListInputSchema = z.object({
	domain: DomainSchema,
	siteCode: z
		.string()
		.optional()
		.describe('Only the location with this site code.'),
	name: z.string().optional().describe('Only locations with this name.'),
	locationTypeCode: z
		.string()
		.optional()
		.describe('Only locations of this location type.'),
});

export type LocationsListInput = z.input<typeof LocationsListInputSchema>;

const LocationsListResponseSchema = CommCareListSchema(CommCareLocationSchema);

const LocationsGetInputSchema = z.object({
	domain: DomainSchema,
	locationId: z.string().min(1).describe('Location ID to retrieve.'),
});

export type LocationsGetInput = z.input<typeof LocationsGetInputSchema>;

const LocationsGetResponseSchema = CommCareLocationSchema;

// ── locationTypes.list / get ──────────────────────────────────────────────

const LocationTypesListInputSchema = z.object({ domain: DomainSchema });

export type LocationTypesListInput = z.input<
	typeof LocationTypesListInputSchema
>;

const LocationTypesListResponseSchema = CommCareListSchema(
	CommCareLocationTypeSchema,
);

const LocationTypesGetInputSchema = z.object({
	domain: DomainSchema,
	typeId: z.number().int().describe('Location type ID to retrieve.'),
});

export type LocationTypesGetInput = z.input<typeof LocationTypesGetInputSchema>;

const LocationTypesGetResponseSchema = CommCareLocationTypeSchema;

// ── fixtures.list / getItem; lookupTables.list / get ──────────────────────

const FixturesListInputSchema = z.object({
	domain: DomainSchema,
	fixtureType: z
		.string()
		.optional()
		.describe('Only fixture items whose data type matches this name.'),
});

export type FixturesListInput = z.input<typeof FixturesListInputSchema>;

const FixturesListResponseSchema = CommCareListSchema(CommCareGlossarySchema);

const FixturesGetItemInputSchema = z.object({
	domain: DomainSchema,
	itemId: z.string().min(1).describe('Fixture item ID to retrieve.'),
});

export type FixturesGetItemInput = z.input<typeof FixturesGetItemInputSchema>;

const FixturesGetItemResponseSchema = CommCareGlossarySchema;

const LookupTablesListInputSchema = z.object({ domain: DomainSchema });

export type LookupTablesListInput = z.input<typeof LookupTablesListInputSchema>;

const LookupTablesListResponseSchema = CommCareListSchema(
	CommCareLookupTableSchema,
);

const LookupTablesGetInputSchema = z.object({
	domain: DomainSchema,
	tableId: z.string().min(1).describe('Lookup table ID to retrieve.'),
});

export type LookupTablesGetInput = z.input<typeof LookupTablesGetInputSchema>;

const LookupTablesGetResponseSchema = CommCareLookupTableSchema;

// ── reports.list / reports.getData ────────────────────────────────────────

const ReportsListInputSchema = z.object({ domain: DomainSchema });

export type ReportsListInput = z.input<typeof ReportsListInputSchema>;

const ReportsListResponseSchema = z
	.object({
		reports: z.array(
			z
				.object({
					id: z.string(),
					title: z.string().nullish(),
				})
				.loose(),
		),
	})
	.loose();

const ReportsGetDataInputSchema = z.object({
	domain: DomainSchema,
	reportId: z
		.string()
		.min(1)
		.describe(
			'Report ID from `reports.list` (the configurable report configuration id).',
		),
	offset: z
		.number()
		.int()
		.min(0)
		.optional()
		.describe('Records to skip before this page.'),
	limit: z
		.number()
		.int()
		.min(1)
		.max(50)
		.optional()
		.describe('Page size, maximum 50.'),
	// unknown: unknown: report filter keys vary per report configuration.
	filters: z
		.record(z.string(), z.string())
		.optional()
		.describe(
			'Report filter parameters the report defines, e.g. `state` or `gender`.',
		),
});

export type ReportsGetDataInput = z.input<typeof ReportsGetDataInputSchema>;

const ReportsGetDataResponseSchema = CommCareReportDataSchema;

// ── ota.restore ───────────────────────────────────────────────────────────

const OtaRestoreInputSchema = z.object({ domain: DomainSchema });

export type OtaRestoreInput = z.input<typeof OtaRestoreInputSchema>;

// The restore answers a full OpenRosa XML payload.
const OtaRestoreResponseSchema = z.object({ raw: z.string() }).loose();

// ── submissions.submit ────────────────────────────────────────────────────

const SubmissionsSubmitInputSchema = z.object({
	domain: DomainSchema,
	appId: z.string().min(1).describe('Application ID the form belongs to.'),
	xml: z
		.string()
		.min(1)
		.describe(
			'The complete XForm XML document to submit, as `xml_submission_file`.',
		),
});

export type SubmissionsSubmitInput = z.input<
	typeof SubmissionsSubmitInputSchema
>;

// The receiver answers 201 with an OpenRosa XML payload; 201 with a
// submit_error nature means the form arrived but could not be processed.
const SubmissionsSubmitResponseSchema = z
	.object({
		raw: z.string(),
		message: z.string().nullish(),
	})
	.loose();

// ── detExports.list ───────────────────────────────────────────────────────

const DetExportsListInputSchema = z.object({ domain: DomainSchema });

export type DetExportsListInput = z.input<typeof DetExportsListInputSchema>;

const DetExportsListResponseSchema = z
	.object({ detExports: z.array(CommCareDetExportSchema) })
	.loose();

// ── registry ──────────────────────────────────────────────────────────────

export type CommCareEndpointInputs = {
	formsList: FormsListInput;
	formsGet: FormsGetInput;
	formsBulkAction: FormsBulkActionInput;
	formsBulkActionStatus: FormsBulkActionStatusInput;
	casesList: CasesListInput;
	casesGet: CasesGetInput;
	casesBulkFetch: CasesBulkFetchInput;
	casesGetByExternalId: CasesGetByExternalIdInput;
	usersList: UsersListInput;
	usersGet: UsersGetInput;
	usersCreate: UsersCreateInput;
	usersUpdate: UsersUpdateInput;
	usersDelete: UsersDeleteInput;
	usersSendPasswordReset: UsersSendPasswordResetInput;
	groupsList: GroupsListInput;
	groupsGet: GroupsGetInput;
	groupsCreate: GroupsCreateInput;
	groupsUpdate: GroupsUpdateInput;
	webUsersList: WebUsersListInput;
	locationsList: LocationsListInput;
	locationsGet: LocationsGetInput;
	locationTypesList: LocationTypesListInput;
	locationTypesGet: LocationTypesGetInput;
	fixturesList: FixturesListInput;
	fixturesGetItem: FixturesGetItemInput;
	lookupTablesList: LookupTablesListInput;
	lookupTablesGet: LookupTablesGetInput;
	reportsList: ReportsListInput;
	reportsGetData: ReportsGetDataInput;
	otaRestore: OtaRestoreInput;
	submissionsSubmit: SubmissionsSubmitInput;
	detExportsList: DetExportsListInput;
};

export type CommCareEndpointOutputs = {
	formsList: z.infer<typeof FormsListResponseSchema>;
	formsGet: z.infer<typeof FormsGetResponseSchema>;
	formsBulkAction: z.infer<typeof FormsBulkActionResponseSchema>;
	formsBulkActionStatus: z.infer<typeof FormsBulkActionStatusResponseSchema>;
	casesList: z.infer<typeof CasesListResponseSchema>;
	casesGet: z.infer<typeof CasesGetResponseSchema>;
	casesBulkFetch: z.infer<typeof CasesBulkFetchResponseSchema>;
	casesGetByExternalId: z.infer<typeof CasesGetByExternalIdResponseSchema>;
	usersList: z.infer<typeof UsersListResponseSchema>;
	usersGet: z.infer<typeof UsersGetResponseSchema>;
	usersCreate: z.infer<typeof UsersCreateResponseSchema>;
	usersUpdate: z.infer<typeof UsersUpdateResponseSchema>;
	usersDelete: z.infer<typeof UsersDeleteResponseSchema>;
	usersSendPasswordReset: z.infer<typeof UsersSendPasswordResetResponseSchema>;
	groupsList: z.infer<typeof GroupsListResponseSchema>;
	groupsGet: z.infer<typeof GroupsGetResponseSchema>;
	groupsCreate: z.infer<typeof GroupsCreateResponseSchema>;
	groupsUpdate: z.infer<typeof GroupsUpdateResponseSchema>;
	webUsersList: z.infer<typeof WebUsersListResponseSchema>;
	locationsList: z.infer<typeof LocationsListResponseSchema>;
	locationsGet: z.infer<typeof LocationsGetResponseSchema>;
	locationTypesList: z.infer<typeof LocationTypesListResponseSchema>;
	locationTypesGet: z.infer<typeof LocationTypesGetResponseSchema>;
	fixturesList: z.infer<typeof FixturesListResponseSchema>;
	fixturesGetItem: z.infer<typeof FixturesGetItemResponseSchema>;
	lookupTablesList: z.infer<typeof LookupTablesListResponseSchema>;
	lookupTablesGet: z.infer<typeof LookupTablesGetResponseSchema>;
	reportsList: z.infer<typeof ReportsListResponseSchema>;
	reportsGetData: z.infer<typeof ReportsGetDataResponseSchema>;
	otaRestore: z.infer<typeof OtaRestoreResponseSchema>;
	submissionsSubmit: z.infer<typeof SubmissionsSubmitResponseSchema>;
	detExportsList: z.infer<typeof DetExportsListResponseSchema>;
};

export const CommCareEndpointInputSchemas = {
	formsList: FormsListInputSchema,
	formsGet: FormsGetInputSchema,
	formsBulkAction: FormsBulkActionInputSchema,
	formsBulkActionStatus: FormsBulkActionStatusInputSchema,
	casesList: CasesListInputSchema,
	casesGet: CasesGetInputSchema,
	casesBulkFetch: CasesBulkFetchInputSchema,
	casesGetByExternalId: CasesGetByExternalIdInputSchema,
	usersList: UsersListInputSchema,
	usersGet: UsersGetInputSchema,
	usersCreate: UsersCreateInputSchema,
	usersUpdate: UsersUpdateInputSchema,
	usersDelete: UsersDeleteInputSchema,
	usersSendPasswordReset: UsersSendPasswordResetInputSchema,
	groupsList: GroupsListInputSchema,
	groupsGet: GroupsGetInputSchema,
	groupsCreate: GroupsCreateInputSchema,
	groupsUpdate: GroupsUpdateInputSchema,
	webUsersList: WebUsersListInputSchema,
	locationsList: LocationsListInputSchema,
	locationsGet: LocationsGetInputSchema,
	locationTypesList: LocationTypesListInputSchema,
	locationTypesGet: LocationTypesGetInputSchema,
	fixturesList: FixturesListInputSchema,
	fixturesGetItem: FixturesGetItemInputSchema,
	lookupTablesList: LookupTablesListInputSchema,
	lookupTablesGet: LookupTablesGetInputSchema,
	reportsList: ReportsListInputSchema,
	reportsGetData: ReportsGetDataInputSchema,
	otaRestore: OtaRestoreInputSchema,
	submissionsSubmit: SubmissionsSubmitInputSchema,
	detExportsList: DetExportsListInputSchema,
};

export const CommCareEndpointOutputSchemas = {
	formsList: FormsListResponseSchema,
	formsGet: FormsGetResponseSchema,
	formsBulkAction: FormsBulkActionResponseSchema,
	formsBulkActionStatus: FormsBulkActionStatusResponseSchema,
	casesList: CasesListResponseSchema,
	casesGet: CasesGetResponseSchema,
	casesBulkFetch: CasesBulkFetchResponseSchema,
	casesGetByExternalId: CasesGetByExternalIdResponseSchema,
	usersList: UsersListResponseSchema,
	usersGet: UsersGetResponseSchema,
	usersCreate: UsersCreateResponseSchema,
	usersUpdate: UsersUpdateResponseSchema,
	usersDelete: UsersDeleteResponseSchema,
	usersSendPasswordReset: UsersSendPasswordResetResponseSchema,
	groupsList: GroupsListResponseSchema,
	groupsGet: GroupsGetResponseSchema,
	groupsCreate: GroupsCreateResponseSchema,
	groupsUpdate: GroupsUpdateResponseSchema,
	webUsersList: WebUsersListResponseSchema,
	locationsList: LocationsListResponseSchema,
	locationsGet: LocationsGetResponseSchema,
	locationTypesList: LocationTypesListResponseSchema,
	locationTypesGet: LocationTypesGetResponseSchema,
	fixturesList: FixturesListResponseSchema,
	fixturesGetItem: FixturesGetItemResponseSchema,
	lookupTablesList: LookupTablesListResponseSchema,
	lookupTablesGet: LookupTablesGetResponseSchema,
	reportsList: ReportsListResponseSchema,
	reportsGetData: ReportsGetDataResponseSchema,
	otaRestore: OtaRestoreResponseSchema,
	submissionsSubmit: SubmissionsSubmitResponseSchema,
	detExportsList: DetExportsListResponseSchema,
};
