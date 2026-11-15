// Shapes taken from GageList's developer reference
// (https://gagelist.com/developer-resources/) and its live error envelopes.

export const gage = {
	Id: 12,
	SerialNumber: 'SN-1001',
	ControlNumber: 'CN-1001',
	AssetNo: 'A-1',
	PurchasePrice: 250.5,
	Status: 'Active',
	LastCalibrationDate: '2026-04-24T19:35:47.563Z',
	CalibrationDueDate: '2027-04-24T19:35:47.563Z',
	MasterStandard: 'Gauge block set',
	Type: 'Caliper',
	Manufacturer: 'Mitutoyo',
	Website: 'https://mitutoyo.example',
	Model: '500-196-30',
	TypesMeasurement: 'Length',
	UnitOfMeasure: 'mm',
	RangeOrSize: '0-150',
	Tolerance: '0.02',
	DateAquired: '2025-01-10T00:00:00Z',
	SourceOrVendor: 'Acme Tools',
	ConditionAquired: 'New',
	Location: 'Bench 3',
	ResponsibleUser: 'priya@acme.example',
	NotificationList: 'qa@acme.example',
	Interval: 'Annual',
	Years: 1,
	Months: 0,
	Days: 0,
	CalibrationEnvironment: 'Lab',
	CalibrationInstructions: 'Per SOP-12',
	OtherInformation: null,
	CalibrationTestMode: 'Standard',
	CreatedBy: 'priya@acme.example',
	UpdatedBy: 'priya@acme.example',
	IsDeleted: false,
	Area: 'Metrology',
	NISTNumber: 'NIST-42',
	UpdatedDate: '2026-04-24T19:35:47.563Z',
	IntervalCategory: 'Yearly',
	LastCalibrationDateStr: '2026-04-24',
	CalibrationCount: 3,
	CreatedDate: '2025-01-10T00:00:00Z',
	ImageName: null,
};

export const gages = {
	total: 42,
	count: 2,
	data: [gage, { ...gage, Id: 13, SerialNumber: 'SN-1002' }],
	success: true,
	message: null,
};

export const gageDetail = { data: gage, success: true, message: null };

export const created = { data: 99, success: true, message: 'Gage created' };

// The reference's update and delete example answers a number in `data`.
export const updated = { data: 0, success: true, message: 'Gage updated' };

export const calibration = {
	Id: 500,
	RecordNumber: 'CAL-500',
	EquipmentRefId: 12,
	EquipmentAsFound: '0.01',
	EquipmentAsLeft: '0.00',
	LastCalibrationDate: '2026-04-24T19:35:47.528Z',
	CalibrationDueDate: '2027-04-24T19:35:47.528Z',
	MasterStandard: 'Gauge block set',
	Type: 'Caliper',
	Manufacturer: 'Mitutoyo',
	Model: '500-196-30',
	SerialNumber: 'SN-1001',
	UnitOfMeasure: 'mm',
	RangeOrSize: '0-150',
	Tolerance: '0.02',
	Location: 'Bench 3',
	ResponsibleUser: 'priya@acme.example',
	Interval: 'Annual',
	Years: 1,
	Months: 0,
	Days: 0,
	Uncertainty: '0.005',
	CalibrationTest: 'Passed',
	IsDeleted: false,
};

export const calibrations = {
	total: 3,
	count: 1,
	data: [calibration],
	success: true,
	message: null,
};

export const calibrationDetail = {
	data: calibration,
	success: true,
	message: null,
};

export const manufacturer = {
	Id: 7,
	Name: 'Mitutoyo',
	Address: '20 Itoh',
	Phone: '+81 44 813 7001',
	Fax: null,
	Website: 'https://mitutoyo.example',
};

export const manufacturers = {
	total: 1,
	count: 1,
	data: [manufacturer],
	success: true,
	message: null,
};

// The documented list shape: `ForType` is a string, and there is no `RefType`.
export const customFields = {
	total: 2,
	count: 2,
	data: [
		{
			Id: 3,
			FieldName: 'Cost centre',
			FieldType: 'Text',
			FieldOptions: '',
			Status: 'Active',
			ForType: 'Gage',
			GageRequired: 0,
			CalibrationRequired: 0,
			DisplayOrder: 1,
		},
		{
			Id: 4,
			FieldName: 'Witness',
			FieldType: 'Text',
			FieldOptions: '',
			Status: 'Active',
			ForType: 'Calibration',
			GageRequired: 0,
			CalibrationRequired: 0,
			DisplayOrder: 2,
		},
	],
	success: true,
	message: null,
};

export const customValuesUpdated = {
	data: [11, 12],
	success: true,
	message: 'Values updated',
};

export const accountStatus = {
	data: {
		Roles: ['Admin'],
		MaxUsers: 10,
		MaxGages: 5000,
		MaxRecords: 100000,
		AssignedUsers: 4,
		TotalGages: 42,
		ActiveGages: 40,
		InactiveGages: 2,
		GagesDueThisMonth: 3,
		GagesDue30Days: 5,
		GagesPastDue: 1,
		AllowAttachments: true,
		AllowCustomFields: true,
		CanAdd: true,
		CanEdit: true,
		CurrentSiteId: 1,
	},
	success: true,
	message: null,
};

/** The token endpoint's refusal, verified live. */
export const invalidClient = { error: 'invalid_client' };

/** A protected route with no usable token, verified live. */
export const unauthorized = {
	Message: 'Authorization has been denied for this request.',
};

/** A route-level failure. */
export const refused = { success: false, message: 'Serial number is required' };

/** An unknown record. */
export const notFound = { Message: 'Record not found' };
