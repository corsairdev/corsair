import { z } from 'zod';

// Inputs use GageList's own PascalCase field names, because the API binds them
// case-sensitively. Outputs are `.loose()` and their fields nullish, so a field
// GageList adds or omits cannot fail a read that has already happened.
// Reference: https://gagelist.com/developer-resources/

const IdSchema = z.number().int().min(1).describe('The GageList record ID.');

/** Every answer from the API is wrapped in `{ data, success, message }`. */
const envelope = <T extends z.ZodType>(data: T) =>
	z
		.object({
			data,
			success: z.boolean().nullish(),
			message: z.string().nullish(),
		})
		.loose();

// ── gages ─────────────────────────────────────────────────────────────────

// One gage. The field names are the API's own, including its `DateAquired`
// spelling, which is how the request body binds.
export const GagelistGageSchema = z
	.object({
		Id: z.number(),
		SerialNumber: z.string().nullish(),
		ControlNumber: z.string().nullish(),
		AssetNo: z.string().nullish(),
		PurchasePrice: z.number().nullish(),
		Status: z.string().nullish(),
		LastCalibrationDate: z.string().nullish(),
		CalibrationDueDate: z.string().nullish(),
		MasterStandard: z.string().nullish(),
		Type: z.string().nullish(),
		Manufacturer: z.string().nullish(),
		Website: z.string().nullish(),
		Model: z.string().nullish(),
		TypesMeasurement: z.string().nullish(),
		UnitOfMeasure: z.string().nullish(),
		RangeOrSize: z.string().nullish(),
		Tolerance: z.string().nullish(),
		DateAquired: z.string().nullish(),
		SourceOrVendor: z.string().nullish(),
		ConditionAquired: z.string().nullish(),
		Location: z.string().nullish(),
		ResponsibleUser: z.string().nullish(),
		NotificationList: z.string().nullish(),
		Interval: z.string().nullish(),
		Years: z.number().nullish(),
		Months: z.number().nullish(),
		Days: z.number().nullish(),
		CalibrationEnvironment: z.string().nullish(),
		CalibrationInstructions: z.string().nullish(),
		OtherInformation: z.string().nullish(),
		CalibrationTestMode: z.string().nullish(),
		CreatedBy: z.string().nullish(),
		UpdatedBy: z.string().nullish(),
		IsDeleted: z.boolean().nullish(),
		Area: z.string().nullish(),
		NISTNumber: z.string().nullish(),
		UpdatedDate: z.string().nullish(),
		IntervalCategory: z.string().nullish(),
		LastCalibrationDateStr: z.string().nullish(),
		CalibrationCount: z.number().nullish(),
		CreatedDate: z.string().nullish(),
		ImageName: z.string().nullish(),
	})
	.loose();

export type GagelistGage = z.infer<typeof GagelistGageSchema>;

// The list route is a POST whose body carries the paging, which is unusual
// enough to be worth stating.
const GagesListInputSchema = z.object({
	start: z
		.number()
		.int()
		.min(0)
		.optional()
		.describe('Records to skip. Defaults to 0.'),
	record_number: z
		.number()
		.int()
		.min(1)
		.optional()
		.describe('Records to return in this page.'),
});

export type GagesListInput = z.input<typeof GagesListInputSchema>;

const GagesListResponseSchema = z
	.object({
		total: z.number().nullish().describe('Every gage on the site.'),
		count: z.number().nullish().describe('Gages in this page.'),
		data: z.array(GagelistGageSchema),
		success: z.boolean().nullish(),
		message: z.string().nullish(),
		next_start: z
			.number()
			.nullable()
			.describe('The `start` for the next page; null on the last one.'),
	})
	.loose();

export type GagesListResponse = z.infer<typeof GagesListResponseSchema>;

const GageGetInputSchema = z.object({ id: IdSchema });

export type GageGetInput = z.input<typeof GageGetInputSchema>;

const GageResponseSchema = envelope(GagelistGageSchema);

export type GageResponse = z.infer<typeof GageResponseSchema>;

// The create body is the record itself. `Id` is documented as 0 on a create,
// and the response carries the assigned one.
const GageWriteSchema = z.object({
	Id: z.number().int().optional().describe('`0` on a create.'),
	SerialNumber: z.string().optional(),
	ControlNumber: z.string().optional(),
	AssetNo: z.string().optional(),
	PurchasePrice: z.number().optional(),
	Status: z.string().optional(),
	LastCalibrationDate: z.string().optional().describe('ISO 8601.'),
	CalibrationDueDate: z.string().optional().describe('ISO 8601.'),
	MasterStandard: z.string().optional(),
	Type: z.string().optional(),
	Manufacturer: z.string().optional(),
	Website: z.string().optional(),
	Model: z.string().optional(),
	TypesMeasurement: z.string().optional(),
	UnitOfMeasure: z.string().optional(),
	RangeOrSize: z.string().optional(),
	Tolerance: z.string().optional(),
	// GageList's own spelling, not `DateAcquired`.
	DateAquired: z.string().optional().describe('ISO 8601.'),
	SourceOrVendor: z.string().optional(),
	ConditionAquired: z.string().optional(),
	Location: z.string().optional(),
	ResponsibleUser: z.string().optional(),
	NotificationList: z.string().optional(),
	Interval: z.string().optional(),
	Years: z.number().int().min(0).optional(),
	Months: z.number().int().min(0).optional(),
	Days: z.number().int().min(0).optional(),
	CalibrationEnvironment: z.string().optional(),
	CalibrationInstructions: z.string().optional(),
	OtherInformation: z.string().optional(),
	CalibrationTestMode: z.string().optional(),
	Area: z.string().optional(),
	NISTNumber: z.string().optional(),
});

export type GageWriteInput = z.input<typeof GageWriteSchema>;

const GagesCreateInputSchema = GageWriteSchema;

export type GagesCreateInput = z.input<typeof GagesCreateInputSchema>;

// A create answers the new record's ID.
const GageCreateResponseSchema = envelope(z.number());

export type GageCreateResponse = z.infer<typeof GageCreateResponseSchema>;

const GagesUpdateInputSchema = GageWriteSchema.required({ Id: true });

export type GagesUpdateInput = z.input<typeof GagesUpdateInputSchema>;

// The reference shows `"data": 0` for every update and delete; a boolean is
// accepted too, so either form parses once the write has happened.
const GageUpdateResponseSchema = z
	.object({
		data: z.union([z.number(), z.boolean()]).nullish(),
		success: z.boolean().nullish(),
		message: z.string().nullish(),
	})
	.loose();

export type GageUpdateResponse = z.infer<typeof GageUpdateResponseSchema>;

const GageRemoveInputSchema = z.object({ id: IdSchema });

export type GageRemoveInput = z.input<typeof GageRemoveInputSchema>;

export type BooleanResponse = z.infer<typeof GageUpdateResponseSchema>;

// ── calibrations ──────────────────────────────────────────────────────────

export const GagelistCalibrationSchema = z
	.object({
		Id: z.number(),
		RecordNumber: z.string().nullish(),
		EquipmentRefId: z
			.number()
			.nullish()
			.describe('The gage this calibration was run on.'),
		SerialNumber: z.string().nullish(),
		ControlNumber: z.string().nullish(),
		AssetNo: z.string().nullish(),
		EquipmentAsFound: z.string().nullish(),
		EquipmentAsLeft: z.string().nullish(),
		LastCalibrationDate: z.string().nullish(),
		CalibrationDueDate: z.string().nullish(),
		MasterStandard: z.string().nullish(),
		Type: z.string().nullish(),
		Manufacturer: z.string().nullish(),
		Website: z.string().nullish(),
		Model: z.string().nullish(),
		TypesMeasurement: z.string().nullish(),
		UnitOfMeasure: z.string().nullish(),
		RangeOrSize: z.string().nullish(),
		Tolerance: z.string().nullish(),
		Location: z.string().nullish(),
		ResponsibleUser: z.string().nullish(),
		Interval: z.string().nullish(),
		Years: z.number().nullish(),
		Months: z.number().nullish(),
		Days: z.number().nullish(),
		Uncertainty: z.string().nullish(),
		CalibrationTest: z.string().nullish(),
		OtherInformation: z.string().nullish(),
		CreatedBy: z.string().nullish(),
		UpdatedBy: z.string().nullish(),
		IsDeleted: z.boolean().nullish(),
		UpdatedDate: z.string().nullish(),
	})
	.loose();

export type GagelistCalibration = z.infer<typeof GagelistCalibrationSchema>;

const CalibrationsListInputSchema = z.object({
	start: z.number().int().min(0).optional(),
	record_number: z.number().int().min(1).optional(),
});

export type CalibrationsListInput = z.input<typeof CalibrationsListInputSchema>;

const CalibrationsListResponseSchema = z
	.object({
		total: z.number().nullish(),
		count: z.number().nullish(),
		data: z.array(GagelistCalibrationSchema),
		success: z.boolean().nullish(),
		message: z.string().nullish(),
		next_start: z.number().nullable(),
	})
	.loose();

export type CalibrationsListResponse = z.infer<
	typeof CalibrationsListResponseSchema
>;

const CalibrationGetInputSchema = z.object({ id: IdSchema });

export type CalibrationGetInput = z.input<typeof CalibrationGetInputSchema>;

const CalibrationResponseSchema = envelope(GagelistCalibrationSchema);

export type CalibrationResponse = z.infer<typeof CalibrationResponseSchema>;

const CalibrationWriteSchema = z.object({
	Id: z.number().int().optional(),
	RecordNumber: z.string().optional(),
	EquipmentRefId: z
		.number()
		.int()
		.optional()
		.describe('The gage this calibration records.'),
	EquipmentAsFound: z.string().optional(),
	EquipmentAsLeft: z.string().optional(),
	LastCalibrationDate: z.string().optional(),
	CalibrationDueDate: z.string().optional(),
	MasterStandard: z.string().optional(),
	Type: z.string().optional(),
	Manufacturer: z.string().optional(),
	Website: z.string().optional(),
	Model: z.string().optional(),
	SerialNumber: z.string().optional(),
	TypesMeasurement: z.string().optional(),
	UnitOfMeasure: z.string().optional(),
	RangeOrSize: z.string().optional(),
	Tolerance: z.string().optional(),
	Location: z.string().optional(),
	ResponsibleUser: z.string().optional(),
	Interval: z.string().optional(),
	Years: z.number().int().min(0).optional(),
	Months: z.number().int().min(0).optional(),
	Days: z.number().int().min(0).optional(),
	Uncertainty: z.string().optional(),
	CalibrationTest: z.string().optional(),
	OtherInformation: z.string().optional(),
});

const CalibrationsCreateInputSchema = CalibrationWriteSchema;

export type CalibrationsCreateInput = z.input<
	typeof CalibrationsCreateInputSchema
>;

const CalibrationsUpdateInputSchema = CalibrationWriteSchema.required({
	Id: true,
});

export type CalibrationsUpdateInput = z.input<
	typeof CalibrationsUpdateInputSchema
>;

const CalibrationRemoveInputSchema = z.object({ id: IdSchema });

export type CalibrationRemoveInput = z.input<
	typeof CalibrationRemoveInputSchema
>;

const CalibrationCertificateInputSchema = z.object({ id: IdSchema });

export type CalibrationCertificateInput = z.input<
	typeof CalibrationCertificateInputSchema
>;

// The certificate route renders a PDF and answers it as a string, so the result
// carries that string rather than pretending to be JSON.
const CertificateResponseSchema = z.object({
	certificate: z.string(),
});

export type CertificateResponse = z.infer<typeof CertificateResponseSchema>;

// ── manufacturers ─────────────────────────────────────────────────────────

export const GagelistManufacturerSchema = z
	.object({
		Id: z.number(),
		Name: z.string().nullish(),
		Address: z.string().nullish(),
		Phone: z.string().nullish(),
		Fax: z.string().nullish(),
		Website: z.string().nullish(),
	})
	.loose();

export type GagelistManufacturer = z.infer<typeof GagelistManufacturerSchema>;

const ManufacturersListInputSchema = z.object({
	start: z.number().int().min(0).optional(),
	record_number: z.number().int().min(1).optional(),
});

export type ManufacturersListInput = z.input<
	typeof ManufacturersListInputSchema
>;

const ManufacturersListResponseSchema = z
	.object({
		total: z.number().nullish(),
		count: z.number().nullish(),
		data: z.array(GagelistManufacturerSchema),
		success: z.boolean().nullish(),
		message: z.string().nullish(),
		next_start: z.number().nullable(),
	})
	.loose();

export type ManufacturersListResponse = z.infer<
	typeof ManufacturersListResponseSchema
>;

const ManufacturerWriteSchema = z.object({
	Id: z.number().int().optional(),
	Name: z.string().min(1),
	Address: z.string().optional(),
	Phone: z.string().optional(),
	Fax: z.string().optional(),
	Website: z.string().optional(),
});

const ManufacturersCreateInputSchema = ManufacturerWriteSchema;

export type ManufacturersCreateInput = z.input<
	typeof ManufacturersCreateInputSchema
>;

const ManufacturersUpdateInputSchema = ManufacturerWriteSchema.required({
	Id: true,
});

export type ManufacturersUpdateInput = z.input<
	typeof ManufacturersUpdateInputSchema
>;

const ManufacturerRemoveInputSchema = z.object({ id: IdSchema });

export type ManufacturerRemoveInput = z.input<
	typeof ManufacturerRemoveInputSchema
>;

// ── custom fields ─────────────────────────────────────────────────────────

export const GagelistCustomFieldSchema = z
	.object({
		Id: z.number().nullish(),
		Name: z.string().nullish(),
		FieldName: z.string().nullish(),
		FieldType: z.string().nullish(),
		RefType: z
			.number()
			.nullish()
			.describe('`1` for a gage, `2` for a calibration.'),
	})
	.loose();

export type GagelistCustomField = z.infer<typeof GagelistCustomFieldSchema>;

const CustomFieldsListInputSchema = z.object({});

export type CustomFieldsListInput = z.input<typeof CustomFieldsListInputSchema>;

const CustomFieldsListResponseSchema = z
	.object({
		data: z.array(GagelistCustomFieldSchema),
		success: z.boolean().nullish(),
		message: z.string().nullish(),
	})
	.loose();

export type CustomFieldsListResponse = z.infer<
	typeof CustomFieldsListResponseSchema
>;

// `RefType` is a number, not a string, and decides which record the value
// belongs to; a wrong one writes to the other table. The enum is what the docs
// state, so a value outside it is refused here rather than at GageList.
export const GAGELIST_CUSTOM_FIELD_REF_TYPES = {
	gage: 1,
	calibration: 2,
} as const;

const CustomFieldValueSchema = z.object({
	Id: z
		.number()
		.int()
		.min(0)
		.describe('`0` creates a value; anything else updates that value record.'),
	FieldId: z.number().int().min(1).describe('The custom field.'),
	RefID: z.number().int().min(1).describe('The gage or calibration record.'),
	RefType: z
		.union([z.literal(1), z.literal(2)])
		.describe('`1` for a gage, `2` for a calibration.'),
	FieldValue: z.string(),
});

const CustomFieldValuesUpdateInputSchema = z.object({
	values: z
		.array(CustomFieldValueSchema)
		.min(1)
		.describe(
			'Sent as a bare JSON array, which is what this route takes rather than the usual object.',
		),
});

export type CustomFieldValuesUpdateInput = z.input<
	typeof CustomFieldValuesUpdateInputSchema
>;

const CustomFieldValuesUpdateResponseSchema = z
	.object({
		data: z.array(z.number()).nullish(),
		success: z.boolean().nullish(),
		message: z.string().nullish(),
	})
	.loose();

export type CustomFieldValuesUpdateResponse = z.infer<
	typeof CustomFieldValuesUpdateResponseSchema
>;

// ── account ───────────────────────────────────────────────────────────────

const AccountStatusInputSchema = z.object({});

export type AccountStatusInput = z.input<typeof AccountStatusInputSchema>;

// The account payload is large and its shape varies by plan, so only the parts a
// caller acts on are named and the rest passes through.
const AccountStatusSchema = z
	.object({
		MaxUsers: z.number().nullish(),
		MaxGages: z.number().nullish(),
		MaxRecords: z.number().nullish(),
		AssignedUsers: z.number().nullish(),
		TotalGages: z.number().nullish(),
		ActiveGages: z.number().nullish(),
		InactiveGages: z.number().nullish(),
		GagesDueThisMonth: z.number().nullish(),
		GagesDue30Days: z.number().nullish(),
		GagesPastDue: z.number().nullish(),
		AllowAttachments: z.boolean().nullish(),
		AllowCustomFields: z.boolean().nullish(),
		CanAdd: z.boolean().nullish(),
		CanEdit: z.boolean().nullish(),
		CurrentSiteId: z.number().nullish(),
	})
	.loose();

export type GagelistAccountStatus = z.infer<typeof AccountStatusSchema>;

const AccountStatusResponseSchema = envelope(AccountStatusSchema);

export type AccountStatusResponse = z.infer<typeof AccountStatusResponseSchema>;

// ── Registry ──────────────────────────────────────────────────────────────

export type GagelistEndpointInputs = {
	gagesList: GagesListInput;
	gagesGet: GageGetInput;
	gagesCreate: GagesCreateInput;
	gagesUpdate: GagesUpdateInput;
	gagesRemove: GageRemoveInput;
	calibrationsList: CalibrationsListInput;
	calibrationsGet: CalibrationGetInput;
	calibrationsCreate: CalibrationsCreateInput;
	calibrationsUpdate: CalibrationsUpdateInput;
	calibrationsRemove: CalibrationRemoveInput;
	calibrationCertificate: CalibrationCertificateInput;
	manufacturersList: ManufacturersListInput;
	manufacturersCreate: ManufacturersCreateInput;
	manufacturersUpdate: ManufacturersUpdateInput;
	manufacturersRemove: ManufacturerRemoveInput;
	customFieldsList: CustomFieldsListInput;
	customFieldValuesUpdate: CustomFieldValuesUpdateInput;
	accountStatus: AccountStatusInput;
};

export type GagelistEndpointOutputs = {
	gagesList: GagesListResponse;
	gagesGet: GageResponse;
	gagesCreate: GageCreateResponse;
	gagesUpdate: GageUpdateResponse;
	gagesRemove: GageUpdateResponse;
	calibrationsList: CalibrationsListResponse;
	calibrationsGet: CalibrationResponse;
	calibrationsCreate: GageCreateResponse;
	calibrationsUpdate: GageUpdateResponse;
	calibrationsRemove: GageUpdateResponse;
	calibrationCertificate: CertificateResponse;
	manufacturersList: ManufacturersListResponse;
	manufacturersCreate: GageCreateResponse;
	manufacturersUpdate: GageUpdateResponse;
	manufacturersRemove: GageUpdateResponse;
	customFieldsList: CustomFieldsListResponse;
	customFieldValuesUpdate: CustomFieldValuesUpdateResponse;
	accountStatus: AccountStatusResponse;
};

export const GagelistEndpointInputSchemas = {
	gagesList: GagesListInputSchema,
	gagesGet: GageGetInputSchema,
	gagesCreate: GagesCreateInputSchema,
	gagesUpdate: GagesUpdateInputSchema,
	gagesRemove: GageRemoveInputSchema,
	calibrationsList: CalibrationsListInputSchema,
	calibrationsGet: CalibrationGetInputSchema,
	calibrationsCreate: CalibrationsCreateInputSchema,
	calibrationsUpdate: CalibrationsUpdateInputSchema,
	calibrationsRemove: CalibrationRemoveInputSchema,
	calibrationCertificate: CalibrationCertificateInputSchema,
	manufacturersList: ManufacturersListInputSchema,
	manufacturersCreate: ManufacturersCreateInputSchema,
	manufacturersUpdate: ManufacturersUpdateInputSchema,
	manufacturersRemove: ManufacturerRemoveInputSchema,
	customFieldsList: CustomFieldsListInputSchema,
	customFieldValuesUpdate: CustomFieldValuesUpdateInputSchema,
	accountStatus: AccountStatusInputSchema,
} as const;

export const GagelistEndpointOutputSchemas = {
	gagesList: GagesListResponseSchema,
	gagesGet: GageResponseSchema,
	gagesCreate: GageCreateResponseSchema,
	gagesUpdate: GageUpdateResponseSchema,
	gagesRemove: GageUpdateResponseSchema,
	calibrationsList: CalibrationsListResponseSchema,
	calibrationsGet: CalibrationResponseSchema,
	calibrationsCreate: GageCreateResponseSchema,
	calibrationsUpdate: GageUpdateResponseSchema,
	calibrationsRemove: GageUpdateResponseSchema,
	calibrationCertificate: CertificateResponseSchema,
	manufacturersList: ManufacturersListResponseSchema,
	manufacturersCreate: GageCreateResponseSchema,
	manufacturersUpdate: GageUpdateResponseSchema,
	manufacturersRemove: GageUpdateResponseSchema,
	customFieldsList: CustomFieldsListResponseSchema,
	customFieldValuesUpdate: CustomFieldValuesUpdateResponseSchema,
	accountStatus: AccountStatusResponseSchema,
} as const;
