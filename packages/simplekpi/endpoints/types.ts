import { z } from 'zod';

/**
 * SimpleKPI's own names are used throughout. Fields are snake_case in the API;
 * the handful of camelCase entry flags (`setActual`, `setTarget`, `setNotes`,
 * `addToActual`) are deliberate and kept exactly as they are.
 *
 * Outputs are `.loose()` and their optional fields `.nullish()` so a field the
 * API adds or omits cannot fail a read that already succeeded.
 *
 * Contract: https://support.simplekpi.com/ai-core/api
 */

// ── Shared pieces ─────────────────────────────────────────────────────────

const Id = z
	.number()
	.int()
	.describe('A positive integer assigned by SimpleKPI.');

const Timestamp = z.string().describe('ISO 8601.');

/** `page` and `rows` are the only paging controls; lists are plain arrays. */
const paging = {
	page: z
		.number()
		.int()
		.min(1)
		.optional()
		.describe('Which page to return, counting from 1.'),
	rows: z
		.number()
		.int()
		.min(1)
		.optional()
		.describe(
			'How many rows per page, 500 by default. Page until one comes back short, because there is no total.',
		),
};

/** What the API documents for a KPI's `value_direction`. */
const ValueDirectionSchema = z.enum(['U', 'D', 'N']);

/** What the API documents for `aggregate_function`, case sensitive. */
const AggregateFunctionSchema = z.enum(['SUM', 'AVG']);

const FrequencyIdSchema = z
	.string()
	.describe(
		'A frequency id from kpiFrequencies: D daily, W weekly, M monthly, Q quarterly, Y yearly. Case sensitive.',
	);

// ── Output objects ────────────────────────────────────────────────────────

/**
 * A KPI as every KPI route returns it. `icon_id` and `unit_id` are checked
 * against the account even though the contract does not mark them mandatory,
 * so a create without real ids fails with a 400.
 */
const KpiSchema = z
	.object({
		id: z.number().int(),
		category_id: z.number().int().nullish(),
		icon_id: z.number().int().nullish(),
		unit_id: z.number().int().nullish(),
		frequency_id: FrequencyIdSchema.nullish(),
		name: z.string().nullish(),
		description: z.string().nullish(),
		target_default: z.number().nullish(),
		value_direction: ValueDirectionSchema.nullish(),
		aggregate_function: AggregateFunctionSchema.nullish(),
		is_calculated: z
			.boolean()
			.nullish()
			.describe('Calculated KPIs take no entries through the API.'),
		sort_order: z.number().int().nullish(),
		is_active: z.boolean().nullish(),
		created_at: Timestamp.nullish(),
		updated_at: Timestamp.nullish(),
	})
	.loose();

export type SimplekpiKpi = z.infer<typeof KpiSchema>;

const KpiCategorySchema = z
	.object({
		id: z.number().int(),
		name: z.string().nullish(),
		sort_order: z.number().int().nullish(),
		created_at: Timestamp.nullish(),
		updated_at: Timestamp.nullish(),
	})
	.loose();

export type SimplekpiKpiCategory = z.infer<typeof KpiCategorySchema>;

const BreakdownItemSchema = z
	.object({
		id: z.number().int(),
		name: z.string().nullish(),
		breakdown_id: z
			.number()
			.int()
			.nullish()
			.describe('Null when the item combines more than one breakdown.'),
		user_id: z
			.number()
			.int()
			.nullish()
			.describe('Set for a People breakdown item, null for every other kind.'),
		is_system: z.boolean().nullish(),
		is_archived: z.boolean().nullish(),
		sort_order: z.number().int().nullish(),
		created_at: Timestamp.nullish(),
		updated_at: Timestamp.nullish(),
	})
	.loose();

export type SimplekpiBreakdownItem = z.infer<typeof BreakdownItemSchema>;

const KpiEntrySchema = z
	.object({
		id: z.number().int(),
		user_id: z.number().int().nullish(),
		source_id: z.number().int().nullish(),
		kpi_id: z.number().int().nullish(),
		entry_date: Timestamp.nullish(),
		actual: z.number().nullish(),
		target: z.number().nullish(),
		notes: z.string().nullish(),
		created_at: Timestamp.nullish(),
		updated_at: Timestamp.nullish(),
	})
	.loose();

export type SimplekpiKpiEntry = z.infer<typeof KpiEntrySchema>;

/**
 * A valid single-entry write can store nothing: every value was empty, so the
 * API answers 200 with this object instead of an entry. Branching on the status
 * alone would read it as a stored entry, so both shapes are modelled.
 */
const NothingStoredSchema = z
	.object({
		stored: z.literal(false),
		source_id: z.number().int().nullish(),
		kpi_id: z.number().int().nullish(),
		entry_date: z.string().nullish(),
		detail: z.string().nullish(),
	})
	.loose();

export type SimplekpiNothingStored = z.infer<typeof NothingStoredSchema>;

/** A single entry write answers an entry, or the nothing-stored object. */
const KpiEntryWriteResponseSchema = z.union([
	KpiEntrySchema,
	NothingStoredSchema,
]);

export type SimplekpiKpiEntryWriteResponse = z.infer<
	typeof KpiEntryWriteResponseSchema
>;
export type KpiEntryWriteResponse = SimplekpiKpiEntryWriteResponse;

/**
 * A batch write answers 200 even when every row was rejected, so `rows_added`
 * and `rows_rejected` are the only trustworthy signal.
 */
const KpiEntryBatchResponseSchema = z
	.object({
		rows_added: z.number().int(),
		rows_rejected: z.number().int(),
	})
	.loose();

export type SimplekpiKpiEntryBatchResponse = z.infer<
	typeof KpiEntryBatchResponseSchema
>;
export type KpiEntryBatchResponse = SimplekpiKpiEntryBatchResponse;

const KpiFrequencySchema = z
	.object({
		id: z.string(),
		name: z.string().nullish(),
	})
	.loose();

export type SimplekpiKpiFrequency = z.infer<typeof KpiFrequencySchema>;

const KpiIconSchema = z
	.object({
		id: z.number().int(),
		name: z.string().nullish(),
	})
	.loose();

export type SimplekpiKpiIcon = z.infer<typeof KpiIconSchema>;

const KpiUnitSchema = z
	.object({
		id: z.number().int(),
		name: z.string().nullish(),
		entry_format: z.string().nullish(),
		display_format: z.string().nullish(),
		is_percentage: z.boolean().nullish(),
		created_at: Timestamp.nullish(),
		updated_at: Timestamp.nullish(),
	})
	.loose();

export type SimplekpiKpiUnit = z.infer<typeof KpiUnitSchema>;

const ReportRowSchema = z
	.object({
		kpi_id: z.number().int(),
		kpi_name: z.string().nullish(),
		kpi_description: z.string().nullish(),
		item_id: z.number().int().nullish(),
		item_name: z.string().nullish(),
		period_id: z.string().nullish(),
		period: z.string().nullish(),
		label_format: z.string().nullish(),
		is_percentage: z.boolean().nullish(),
		has_target: z.boolean().nullish(),
		direction: z.string().nullish(),
		direction_name: z.string().nullish(),
		entry_date: z.string().nullish(),
		actual: z.number().nullish(),
		target: z.number().nullish(),
		notes: z.string().nullish(),
	})
	.loose();

export type SimplekpiReportRow = z.infer<typeof ReportRowSchema>;

const UserSchema = z
	.object({
		id: z.number().int(),
		user_type: z.string().nullish(),
		user_status_id: z.string().nullish(),
		first_name: z.string().nullish(),
		last_name: z.string().nullish(),
		email: z.string().nullish(),
		created_at: Timestamp.nullish(),
		updated_at: Timestamp.nullish(),
	})
	.loose();

export type SimplekpiUser = z.infer<typeof UserSchema>;

/** Deleting answers 204 with no body, so the result is built from the input. */
const DeletedSchema = z.object({
	id: z.number().int(),
	deleted: z.literal(true),
});

export type SimplekpiDeleted = z.infer<typeof DeletedSchema>;

// ── kpis ──────────────────────────────────────────────────────────────────

const KpisListInputSchema = z.object({ ...paging });

export type KpisListInput = z.infer<typeof KpisListInputSchema>;

const KpisListResponseSchema = z.array(KpiSchema);

export type KpisListResponse = z.infer<typeof KpisListResponseSchema>;

/**
 * The create body. `name`, `frequency_id`, `value_direction` and
 * `aggregate_function` are the contract's required fields; `icon_id` and
 * `unit_id` are required in practice because the API validates whatever is sent
 * and a missing one becomes 0, which is not a real id.
 */
const kpiBody = {
	category_id: Id.optional().describe('The category the KPI belongs to.'),
	icon_id: Id.describe(
		'A real icon id from kpiIcons. Omit it and the request fails.',
	),
	unit_id: Id.describe(
		'A real unit id from kpiUnits. Omit it and the request fails.',
	),
	frequency_id: FrequencyIdSchema,
	name: z.string().min(1).max(100),
	description: z.string().max(150).nullish(),
	target_default: z
		.number()
		.nullish()
		.describe('Applied to new entries with no target.'),
	value_direction: ValueDirectionSchema.describe(
		'U up is good, D down is good, N neither.',
	),
	aggregate_function: AggregateFunctionSchema.describe(
		'How values roll up across a period.',
	),
	sort_order: z.number().int().optional(),
	is_active: z.boolean().optional(),
};

const KpisCreateInputSchema = z.object(kpiBody);

export type KpisCreateInput = z.infer<typeof KpisCreateInputSchema>;

const KpisCreateResponseSchema = KpiSchema;

export type KpisCreateResponse = z.infer<typeof KpisCreateResponseSchema>;

const KpiIdInputSchema = z.object({ id: Id });

export type KpiIdInput = z.infer<typeof KpiIdInputSchema>;

const KpisGetResponseSchema = KpiSchema;

export type KpisGetResponse = z.infer<typeof KpisGetResponseSchema>;

/**
 * `PUT` replaces the whole object: a field left out is reset to its default,
 * not kept. A rename therefore has to send the rest of the KPI back too.
 */
const KpisUpdateInputSchema = z.object({ id: Id, ...kpiBody });

export type KpisUpdateInput = z.infer<typeof KpisUpdateInputSchema>;

const KpisUpdateResponseSchema = KpiSchema;

export type KpisUpdateResponse = z.infer<typeof KpisUpdateResponseSchema>;

// ── kpicategories ─────────────────────────────────────────────────────────

const KpiCategoriesListInputSchema = z.object({ ...paging });

export type KpiCategoriesListInput = z.infer<
	typeof KpiCategoriesListInputSchema
>;

const KpiCategoriesListResponseSchema = z.array(KpiCategorySchema);

export type KpiCategoriesListResponse = z.infer<
	typeof KpiCategoriesListResponseSchema
>;

const KpiCategoriesCreateInputSchema = z.object({
	name: z.string().min(1).max(50),
	sort_order: z.number().int().optional(),
});

export type KpiCategoriesCreateInput = z.infer<
	typeof KpiCategoriesCreateInputSchema
>;

const KpiCategoriesCreateResponseSchema = KpiCategorySchema;

export type KpiCategoriesCreateResponse = z.infer<
	typeof KpiCategoriesCreateResponseSchema
>;

const KpiCategoryIdInputSchema = z.object({ id: Id });

export type KpiCategoryIdInput = z.infer<typeof KpiCategoryIdInputSchema>;

const KpiCategoriesGetResponseSchema = KpiCategorySchema;

export type KpiCategoriesGetResponse = z.infer<
	typeof KpiCategoriesGetResponseSchema
>;

const KpiCategoriesUpdateInputSchema = z.object({
	id: Id,
	name: z.string().min(1).max(50),
	sort_order: z.number().int().optional(),
});

export type KpiCategoriesUpdateInput = z.infer<
	typeof KpiCategoriesUpdateInputSchema
>;

const KpiCategoriesUpdateResponseSchema = KpiCategorySchema;

export type KpiCategoriesUpdateResponse = z.infer<
	typeof KpiCategoriesUpdateResponseSchema
>;

// ── kpicategoriesKpis (the same KPI nested under a category) ──────────────

const CategoryKpisListInputSchema = z.object({
	category_id: Id,
	...paging,
});

export type CategoryKpisListInput = z.infer<typeof CategoryKpisListInputSchema>;

const CategoryKpisListResponseSchema = z.array(KpiSchema);

export type CategoryKpisListResponse = z.infer<
	typeof CategoryKpisListResponseSchema
>;

// The path names the category, so spreading the body first keeps a body-level
// category_id from silently overriding it.
const CategoryKpisCreateInputSchema = z.object({
	...kpiBody,
	category_id: Id,
});

export type CategoryKpisCreateInput = z.infer<
	typeof CategoryKpisCreateInputSchema
>;

const CategoryKpisCreateResponseSchema = KpiSchema;

export type CategoryKpisCreateResponse = z.infer<
	typeof CategoryKpisCreateResponseSchema
>;

const CategoryKpiTargetSchema = z.object({
	category_id: Id,
	id: Id,
});

export type CategoryKpiTargetInput = z.infer<typeof CategoryKpiTargetSchema>;

const CategoryKpisGetResponseSchema = KpiSchema;

export type CategoryKpisGetResponse = z.infer<
	typeof CategoryKpisGetResponseSchema
>;

const CategoryKpisUpdateInputSchema = z.object({
	...kpiBody,
	category_id: Id,
	id: Id,
});

export type CategoryKpisUpdateInput = z.infer<
	typeof CategoryKpisUpdateInputSchema
>;

const CategoryKpisUpdateResponseSchema = KpiSchema;

export type CategoryKpisUpdateResponse = z.infer<
	typeof CategoryKpisUpdateResponseSchema
>;

// ── breakdownitems ────────────────────────────────────────────────────────

const BreakdownItemsListInputSchema = z.object({
	breakdown_id: z
		.number()
		.int()
		.optional()
		.describe(
			'Only items under this breakdown. Applied to the returned page, since the API has no such filter.',
		),
	...paging,
});

export type BreakdownItemsListInput = z.infer<
	typeof BreakdownItemsListInputSchema
>;

const BreakdownItemsListResponseSchema = z.array(BreakdownItemSchema);

export type BreakdownItemsListResponse = z.infer<
	typeof BreakdownItemsListResponseSchema
>;

const breakdownItemWritable = {
	is_archived: z
		.boolean()
		.optional()
		.describe(
			'Archive the item. An update replaces the item, so send it again.',
		),
	sort_order: z
		.number()
		.int()
		.optional()
		.describe(
			'Display position. An update replaces the item, so send it again.',
		),
};

const BreakdownItemsCreateInputSchema = z.object({
	name: z.string().min(1).max(100),
	breakdown_id: Id.optional().describe(
		'Omit it for an item that combines several breakdowns.',
	),
	...breakdownItemWritable,
});

export type BreakdownItemsCreateInput = z.infer<
	typeof BreakdownItemsCreateInputSchema
>;

const BreakdownItemsCreateResponseSchema = BreakdownItemSchema;

export type BreakdownItemsCreateResponse = z.infer<
	typeof BreakdownItemsCreateResponseSchema
>;

const BreakdownItemIdInputSchema = z.object({ id: Id });

export type BreakdownItemIdInput = z.infer<typeof BreakdownItemIdInputSchema>;

const BreakdownItemsGetResponseSchema = BreakdownItemSchema;

export type BreakdownItemsGetResponse = z.infer<
	typeof BreakdownItemsGetResponseSchema
>;

const BreakdownItemsUpdateInputSchema = z.object({
	id: Id,
	name: z.string().min(1).max(100),
	breakdown_id: Id.nullish(),
	...breakdownItemWritable,
});

export type BreakdownItemsUpdateInput = z.infer<
	typeof BreakdownItemsUpdateInputSchema
>;

const BreakdownItemsUpdateResponseSchema = BreakdownItemSchema;

export type BreakdownItemsUpdateResponse = z.infer<
	typeof BreakdownItemsUpdateResponseSchema
>;

// ── kpientries ────────────────────────────────────────────────────────────

const KpiEntriesListInputSchema = z.object({
	userId: z.number().int().optional().describe('Only entries for this user.'),
	kpiId: z.number().int().optional().describe('Only entries for this KPI.'),
	sourceId: z
		.number()
		.int()
		.optional()
		.describe('Only entries for this breakdown source.'),
	dateFrom: z.string().optional().describe('Earliest entry date, inclusive.'),
	dateTo: z.string().optional().describe('Latest entry date, inclusive.'),
	...paging,
});

export type KpiEntriesListInput = z.infer<typeof KpiEntriesListInputSchema>;

const KpiEntriesListResponseSchema = z.array(KpiEntrySchema);

export type KpiEntriesListResponse = z.infer<
	typeof KpiEntriesListResponseSchema
>;

/**
 * The entry body. `kpi_id`, `source_id` and `entry_date` identify the entry, so
 * sending the same trio again updates it rather than adding a duplicate.
 *
 * The four flags are the API's camelCase exceptions and are kept verbatim:
 * `setActual: false` leaves a stored actual untouched while a target is
 * written, which is the only way to change a target without clearing the value.
 */
const entryBody = {
	user_id: z
		.number()
		.int()
		.nullish()
		.describe('The user the entry is against.'),
	email: z
		.string()
		.nullish()
		.describe(
			'Identifies the user by email instead of user_id. Send one, not both.',
		),
	kpi_id: z.number().int(),
	source_id: z
		.number()
		.int()
		.nullish()
		.describe("The breakdown source. Omit it for the KPI's default source."),
	entry_date: z
		.string()
		.describe(
			"A date the KPI's frequency allows. A weekly KPI rejects a mid-week date.",
		),
	actual: z.number().nullish(),
	target: z.number().nullish(),
	notes: z.string().max(500).nullish(),
	setActual: z
		.boolean()
		.optional()
		.describe('True writes actual, false leaves the stored value untouched.'),
	setTarget: z
		.boolean()
		.optional()
		.describe('True writes target, false leaves the stored value untouched.'),
	setNotes: z
		.boolean()
		.optional()
		.describe('True writes notes, false leaves the stored text untouched.'),
	addToActual: z
		.boolean()
		.optional()
		.describe('True adds actual to the stored value instead of replacing it.'),
};

const KpiEntriesCreateInputSchema = z
	.object(entryBody)
	.superRefine((value, ctx) => {
		// The API documents "one or the other, not both" for the user selector,
		// and a request carrying both cannot be resolved.
		if (value.user_id !== undefined && value.user_id !== null && value.email) {
			ctx.addIssue({
				code: 'custom',
				path: ['email'],
				message: 'Send user_id or email, not both.',
			});
		}
	});

export type KpiEntriesCreateInput = z.infer<typeof KpiEntriesCreateInputSchema>;

const KpiEntriesGetInputSchema = z.object({ id: Id });

export type KpiEntriesGetInput = z.infer<typeof KpiEntriesGetInputSchema>;

const KpiEntriesGetResponseSchema = KpiEntrySchema;

export type KpiEntriesGetResponse = z.infer<typeof KpiEntriesGetResponseSchema>;

/**
 * `PUT` names the entry in the path, but the body still has to carry the
 * `set…` flags to choose which values are written.
 */
const KpiEntriesUpdateInputSchema = z.object({ id: Id, ...entryBody });

export type KpiEntriesUpdateInput = z.infer<typeof KpiEntriesUpdateInputSchema>;

const KpiEntriesUpdateResponseSchema = KpiEntryWriteResponseSchema;

export type KpiEntriesUpdateResponse = z.infer<
	typeof KpiEntriesUpdateResponseSchema
>;

const KpiEntriesDeleteInputSchema = z.object({ id: Id });

export type KpiEntriesDeleteInput = z.infer<typeof KpiEntriesDeleteInputSchema>;

/**
 * The batch body. The `has*` flags tell the API which columns the batch
 * carries, and the API answers 200 even when every row is rejected.
 */
const KpiEntriesBatchInputSchema = z.object({
	entries: z
		.array(z.object(entryBody))
		.min(1)
		.describe('The entries to write; each takes the single-entry shape.'),
	hasActuals: z.boolean().optional(),
	hasTargets: z.boolean().optional(),
	hasNotes: z.boolean().optional(),
});

export type KpiEntriesBatchInput = z.infer<typeof KpiEntriesBatchInputSchema>;

// ── kpifrequencies ────────────────────────────────────────────────────────

const KpiFrequenciesListInputSchema = z.object({});

export type KpiFrequenciesListInput = z.infer<
	typeof KpiFrequenciesListInputSchema
>;

const KpiFrequenciesListResponseSchema = z.array(KpiFrequencySchema);

export type KpiFrequenciesListResponse = z.infer<
	typeof KpiFrequenciesListResponseSchema
>;

const KpiFrequencyIdInputSchema = z.object({
	id: z.string().describe('A frequency id such as W. Case sensitive.'),
});

export type KpiFrequencyIdInput = z.infer<typeof KpiFrequencyIdInputSchema>;

const KpiFrequenciesGetResponseSchema = KpiFrequencySchema;

export type KpiFrequenciesGetResponse = z.infer<
	typeof KpiFrequenciesGetResponseSchema
>;

// ── kpiicons ──────────────────────────────────────────────────────────────

const KpiIconsListInputSchema = z.object({});

export type KpiIconsListInput = z.infer<typeof KpiIconsListInputSchema>;

const KpiIconsListResponseSchema = z.array(KpiIconSchema);

export type KpiIconsListResponse = z.infer<typeof KpiIconsListResponseSchema>;

const KpiIconIdInputSchema = z.object({ id: Id });

export type KpiIconIdInput = z.infer<typeof KpiIconIdInputSchema>;

const KpiIconsGetResponseSchema = KpiIconSchema;

export type KpiIconsGetResponse = z.infer<typeof KpiIconsGetResponseSchema>;

// ── kpiunits ──────────────────────────────────────────────────────────────

const KpiUnitsListInputSchema = z.object({ ...paging });

export type KpiUnitsListInput = z.infer<typeof KpiUnitsListInputSchema>;

const KpiUnitsListResponseSchema = z.array(KpiUnitSchema);

export type KpiUnitsListResponse = z.infer<typeof KpiUnitsListResponseSchema>;

/** Both formats use digits and # as placeholders, with one decimal group. */
const unitBody = {
	name: z.string().min(1).max(25),
	entry_format: z.string().min(1).max(25).describe('Such as #,##0.00 or 0.##.'),
	display_format: z
		.string()
		.min(1)
		.max(25)
		.describe('Same notation as entry_format.'),
	is_percentage: z.boolean().optional(),
};

const KpiUnitsCreateInputSchema = z.object(unitBody);

export type KpiUnitsCreateInput = z.infer<typeof KpiUnitsCreateInputSchema>;

const KpiUnitsCreateResponseSchema = KpiUnitSchema;

export type KpiUnitsCreateResponse = z.infer<
	typeof KpiUnitsCreateResponseSchema
>;

const KpiUnitIdInputSchema = z.object({ id: Id });

export type KpiUnitIdInput = z.infer<typeof KpiUnitIdInputSchema>;

const KpiUnitsGetResponseSchema = KpiUnitSchema;

export type KpiUnitsGetResponse = z.infer<typeof KpiUnitsGetResponseSchema>;

const KpiUnitsUpdateInputSchema = z.object({ id: Id, ...unitBody });

export type KpiUnitsUpdateInput = z.infer<typeof KpiUnitsUpdateInputSchema>;

const KpiUnitsUpdateResponseSchema = KpiUnitSchema;

export type KpiUnitsUpdateResponse = z.infer<
	typeof KpiUnitsUpdateResponseSchema
>;

// ── reports ───────────────────────────────────────────────────────────────

const ReportsAllDataEntriesInputSchema = z.object({
	kpiIDs: z
		.array(z.number().int())
		.optional()
		.describe('The KPIs to report on. Sent as a comma separated list.'),
	dateFrom: z.string().optional(),
	dateTo: z.string().optional(),
	userIDs: z
		.array(z.number().int())
		.optional()
		.describe('Only these users. Sent as a comma separated list.'),
	groupItemIDs: z
		.array(z.number().int())
		.optional()
		.describe('Only these breakdown items. Sent as a comma separated list.'),
});

export type ReportsAllDataEntriesInput = z.infer<
	typeof ReportsAllDataEntriesInputSchema
>;

const ReportsAllDataEntriesResponseSchema = z.array(ReportRowSchema);

export type ReportsAllDataEntriesResponse = z.infer<
	typeof ReportsAllDataEntriesResponseSchema
>;

// ── users ─────────────────────────────────────────────────────────────────

const UsersListInputSchema = z.object({ ...paging });

export type UsersListInput = z.infer<typeof UsersListInputSchema>;

const UsersListResponseSchema = z.array(UserSchema);

export type UsersListResponse = z.infer<typeof UsersListResponseSchema>;

const UserIdInputSchema = z.object({ id: Id });

export type UserIdInput = z.infer<typeof UserIdInputSchema>;

const UsersGetResponseSchema = UserSchema;

export type UsersGetResponse = z.infer<typeof UsersGetResponseSchema>;

// ── Registry ──────────────────────────────────────────────────────────────

export type SimplekpiEndpointInputs = {
	kpisList: KpisListInput;
	kpisCreate: KpisCreateInput;
	kpisGet: KpiIdInput;
	kpisUpdate: KpisUpdateInput;
	kpisDelete: KpiIdInput;
	kpiCategoriesList: KpiCategoriesListInput;
	kpiCategoriesCreate: KpiCategoriesCreateInput;
	kpiCategoriesGet: KpiCategoryIdInput;
	kpiCategoriesUpdate: KpiCategoriesUpdateInput;
	kpiCategoriesDelete: KpiCategoryIdInput;
	categoryKpisList: CategoryKpisListInput;
	categoryKpisCreate: CategoryKpisCreateInput;
	categoryKpisGet: CategoryKpiTargetInput;
	categoryKpisUpdate: CategoryKpisUpdateInput;
	categoryKpisDelete: CategoryKpiTargetInput;
	breakdownItemsList: BreakdownItemsListInput;
	breakdownItemsCreate: BreakdownItemsCreateInput;
	breakdownItemsGet: BreakdownItemIdInput;
	breakdownItemsUpdate: BreakdownItemsUpdateInput;
	breakdownItemsDelete: BreakdownItemIdInput;
	kpiEntriesList: KpiEntriesListInput;
	kpiEntriesCreate: KpiEntriesCreateInput;
	kpiEntriesGet: KpiEntriesGetInput;
	kpiEntriesUpdate: KpiEntriesUpdateInput;
	kpiEntriesDelete: KpiEntriesDeleteInput;
	kpiEntriesCreateBatch: KpiEntriesBatchInput;
	kpiFrequenciesList: KpiFrequenciesListInput;
	kpiFrequenciesGet: KpiFrequencyIdInput;
	kpiIconsList: KpiIconsListInput;
	kpiIconsGet: KpiIconIdInput;
	kpiUnitsList: KpiUnitsListInput;
	kpiUnitsCreate: KpiUnitsCreateInput;
	kpiUnitsGet: KpiUnitIdInput;
	kpiUnitsUpdate: KpiUnitsUpdateInput;
	kpiUnitsDelete: KpiUnitIdInput;
	reportsAllDataEntries: ReportsAllDataEntriesInput;
	usersList: UsersListInput;
	usersGet: UserIdInput;
};

export type SimplekpiEndpointOutputs = {
	kpisList: KpisListResponse;
	kpisCreate: KpisCreateResponse;
	kpisGet: KpisGetResponse;
	kpisUpdate: KpisUpdateResponse;
	kpisDelete: SimplekpiDeleted;
	kpiCategoriesList: KpiCategoriesListResponse;
	kpiCategoriesCreate: KpiCategoriesCreateResponse;
	kpiCategoriesGet: KpiCategoriesGetResponse;
	kpiCategoriesUpdate: KpiCategoriesUpdateResponse;
	kpiCategoriesDelete: SimplekpiDeleted;
	categoryKpisList: CategoryKpisListResponse;
	categoryKpisCreate: CategoryKpisCreateResponse;
	categoryKpisGet: CategoryKpisGetResponse;
	categoryKpisUpdate: CategoryKpisUpdateResponse;
	categoryKpisDelete: SimplekpiDeleted;
	breakdownItemsList: BreakdownItemsListResponse;
	breakdownItemsCreate: BreakdownItemsCreateResponse;
	breakdownItemsGet: BreakdownItemsGetResponse;
	breakdownItemsUpdate: BreakdownItemsUpdateResponse;
	breakdownItemsDelete: SimplekpiDeleted;
	kpiEntriesList: KpiEntriesListResponse;
	kpiEntriesCreate: KpiEntryWriteResponse;
	kpiEntriesGet: KpiEntriesGetResponse;
	kpiEntriesUpdate: KpiEntriesUpdateResponse;
	kpiEntriesDelete: SimplekpiDeleted;
	kpiEntriesCreateBatch: KpiEntryBatchResponse;
	kpiFrequenciesList: KpiFrequenciesListResponse;
	kpiFrequenciesGet: KpiFrequenciesGetResponse;
	kpiIconsList: KpiIconsListResponse;
	kpiIconsGet: KpiIconsGetResponse;
	kpiUnitsList: KpiUnitsListResponse;
	kpiUnitsCreate: KpiUnitsCreateResponse;
	kpiUnitsGet: KpiUnitsGetResponse;
	kpiUnitsUpdate: KpiUnitsUpdateResponse;
	kpiUnitsDelete: SimplekpiDeleted;
	reportsAllDataEntries: ReportsAllDataEntriesResponse;
	usersList: UsersListResponse;
	usersGet: UsersGetResponse;
};

export const SimplekpiEndpointInputSchemas = {
	kpisList: KpisListInputSchema,
	kpisCreate: KpisCreateInputSchema,
	kpisGet: KpiIdInputSchema,
	kpisUpdate: KpisUpdateInputSchema,
	kpisDelete: KpiIdInputSchema,
	kpiCategoriesList: KpiCategoriesListInputSchema,
	kpiCategoriesCreate: KpiCategoriesCreateInputSchema,
	kpiCategoriesGet: KpiCategoryIdInputSchema,
	kpiCategoriesUpdate: KpiCategoriesUpdateInputSchema,
	kpiCategoriesDelete: KpiCategoryIdInputSchema,
	categoryKpisList: CategoryKpisListInputSchema,
	categoryKpisCreate: CategoryKpisCreateInputSchema,
	categoryKpisGet: CategoryKpiTargetSchema,
	categoryKpisUpdate: CategoryKpisUpdateInputSchema,
	categoryKpisDelete: CategoryKpiTargetSchema,
	breakdownItemsList: BreakdownItemsListInputSchema,
	breakdownItemsCreate: BreakdownItemsCreateInputSchema,
	breakdownItemsGet: BreakdownItemIdInputSchema,
	breakdownItemsUpdate: BreakdownItemsUpdateInputSchema,
	breakdownItemsDelete: BreakdownItemIdInputSchema,
	kpiEntriesList: KpiEntriesListInputSchema,
	kpiEntriesCreate: KpiEntriesCreateInputSchema,
	kpiEntriesGet: KpiEntriesGetInputSchema,
	kpiEntriesUpdate: KpiEntriesUpdateInputSchema,
	kpiEntriesDelete: KpiEntriesDeleteInputSchema,
	kpiEntriesCreateBatch: KpiEntriesBatchInputSchema,
	kpiFrequenciesList: KpiFrequenciesListInputSchema,
	kpiFrequenciesGet: KpiFrequencyIdInputSchema,
	kpiIconsList: KpiIconsListInputSchema,
	kpiIconsGet: KpiIconIdInputSchema,
	kpiUnitsList: KpiUnitsListInputSchema,
	kpiUnitsCreate: KpiUnitsCreateInputSchema,
	kpiUnitsGet: KpiUnitIdInputSchema,
	kpiUnitsUpdate: KpiUnitsUpdateInputSchema,
	kpiUnitsDelete: KpiUnitIdInputSchema,
	reportsAllDataEntries: ReportsAllDataEntriesInputSchema,
	usersList: UsersListInputSchema,
	usersGet: UserIdInputSchema,
} as const;

export const SimplekpiEndpointOutputSchemas = {
	kpisList: KpisListResponseSchema,
	kpisCreate: KpisCreateResponseSchema,
	kpisGet: KpisGetResponseSchema,
	kpisUpdate: KpisUpdateResponseSchema,
	kpisDelete: DeletedSchema,
	kpiCategoriesList: KpiCategoriesListResponseSchema,
	kpiCategoriesCreate: KpiCategoriesCreateResponseSchema,
	kpiCategoriesGet: KpiCategoriesGetResponseSchema,
	kpiCategoriesUpdate: KpiCategoriesUpdateResponseSchema,
	kpiCategoriesDelete: DeletedSchema,
	categoryKpisList: CategoryKpisListResponseSchema,
	categoryKpisCreate: CategoryKpisCreateResponseSchema,
	categoryKpisGet: CategoryKpisGetResponseSchema,
	categoryKpisUpdate: CategoryKpisUpdateResponseSchema,
	categoryKpisDelete: DeletedSchema,
	breakdownItemsList: BreakdownItemsListResponseSchema,
	breakdownItemsCreate: BreakdownItemsCreateResponseSchema,
	breakdownItemsGet: BreakdownItemsGetResponseSchema,
	breakdownItemsUpdate: BreakdownItemsUpdateResponseSchema,
	breakdownItemsDelete: DeletedSchema,
	kpiEntriesList: KpiEntriesListResponseSchema,
	kpiEntriesCreate: KpiEntryWriteResponseSchema,
	kpiEntriesGet: KpiEntriesGetResponseSchema,
	kpiEntriesUpdate: KpiEntriesUpdateResponseSchema,
	kpiEntriesDelete: DeletedSchema,
	kpiEntriesCreateBatch: KpiEntryBatchResponseSchema,
	kpiFrequenciesList: KpiFrequenciesListResponseSchema,
	kpiFrequenciesGet: KpiFrequenciesGetResponseSchema,
	kpiIconsList: KpiIconsListResponseSchema,
	kpiIconsGet: KpiIconsGetResponseSchema,
	kpiUnitsList: KpiUnitsListResponseSchema,
	kpiUnitsCreate: KpiUnitsCreateResponseSchema,
	kpiUnitsGet: KpiUnitsGetResponseSchema,
	kpiUnitsUpdate: KpiUnitsUpdateResponseSchema,
	kpiUnitsDelete: DeletedSchema,
	reportsAllDataEntries: ReportsAllDataEntriesResponseSchema,
	usersList: UsersListResponseSchema,
	usersGet: UsersGetResponseSchema,
} as const;
