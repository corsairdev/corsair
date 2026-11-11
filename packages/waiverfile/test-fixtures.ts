// Response bodies built from the live OpenAPI document at
// https://api.waiverfile.com/swagger/v1/swagger.json, with made-up ids and
// people. They were not captured from the live API.
//
// WaiverFile returns PascalCase field names, so the fixtures keep them.

export const waiverID = '4e5c5176-1238-45a3-8a87-35435baecaa2';
export const siteID = '00000000-0000-0000-0000-000000000001';
export const eventID = 'c0a1b2c3-1111-2222-3333-444455556666';
export const categoryID = '9a3c5e3e-7c4f-4a83-88be-86a3c85fa0e4';
export const formID = '152a63cc-0a49-475a-a8e4-5f89bee94fe6';

export const participant = {
	WaiverParticipantID: 'p-1',
	WaiverID: waiverID,
	ParticipantName: 'Delaney Jones',
	ParticipantNameFirst: 'Delaney',
	DOB: '2012-04-11',
	IsCheckedIn: true,
	ValuesXml: '<values />',
	IsSignee: true,
};

export const waiver = {
	WaiverID: waiverID,
	SiteID: siteID,
	WaiverEventID: eventID,
	WaiverFormID: formID,
	DateSigned: '2024-06-01T13:02:00Z',
	DateAttending: '2024-06-02T09:00:00Z',
	SignedName: 'Jordan Ruiz',
	SignedNameFirst: 'Jordan',
	Email: 'jordan@example.com',
	Phone: '555-0100',
	DOB: '1985-02-20',
	Age: 39,
	Address: '1 Example Way',
	City: 'Bayville',
	State: 'NY',
	Zip: '11709',
	OptIn: true,
	HasSignature: true,
	Expired: false,
	WaiverIsDeleted: false,
	ClientIP: '203.0.113.10',
	ClientType: 'Web',
	deviceID: 0,
	FieldsXml: '<fields />',
	ValuesXml: '<values />',
	// WaiverFile's own spelling.
	Particpants: [participant],
	WaiverEvent: null,
	WaiverForm: null,
	Signatures: null,
	Images: null,
};

export const waiverLite = {
	WaiverID: waiverID,
	SiteID: siteID,
	WaiverEventID: eventID,
	WaiverFormID: formID,
	DateSigned: '2024-06-01T13:02:00Z',
	SignedName: 'Jordan Ruiz',
	SignedNameFirst: 'Jordan',
	Email: 'jordan@example.com',
	Phone: '555-0100',
	OptIn: true,
	FieldsXml: '<fields />',
	ValuesXml: '<values />',
	Particpants: [participant],
};

export const waiversPage = { Waivers: [waiver] };
export const waiversLitePage = { Waivers: [waiverLite] };
export const searchResults = { Waivers: [waiverLite] };
export const pageCountResponse = { Count: 128, PageCount: 13 };

export const dataRows = {
	Data: [
		{
			WaiverID: waiverID,
			SignedName: 'Jordan Ruiz',
			Email: 'jordan@example.com',
			ParticipantName: 'Delaney Jones',
			DateSigned: '2024-06-01T13:02:00Z',
			CustomField: 'yes',
		},
	],
	TotalCount: 1,
};

export const siteDetails = {
	SiteID: siteID,
	Name: 'Twin Harbor Adventures',
	TimeZone: 'America/New_York',
	Address: '1 Example Way',
	City: 'Bayville',
	State: 'NY',
	Zip: '11709',
	Phone: '555-0100',
	Email: 'info@example.com',
};

export const pingOk = { Message: 'Service is online.' };

export const form = {
	ID: formID,
	SiteID: siteID,
	Name: 'General waiver',
	Questions: '[]',
	NumParticipantsPerForm: 4,
	MinAge: 0,
	MaxAgeParticipant: 17,
	AgreementLabelText: 'I agree to the terms',
	FieldInclude_Email: true,
	FieldRequire_Email: true,
	FieldInclude_Phone: true,
	FieldRequire_Phone: false,
	FieldInclude_DOB: true,
	FieldRequire_DOB: false,
	FieldInclude_Address: false,
	FieldRequire_Address: false,
	IncludeSignature: true,
	AllowSigningForSomeoneElse: true,
	Status: 'Active',
	Language: 'en',
	Created: '2024-01-01T00:00:00Z',
	LastModified: '2024-02-01T00:00:00Z',
};

export const formsPage = { WaiverForms: [form] };

export const event = {
	WaiverEventID: eventID,
	SiteID: siteID,
	Name: 'Saturday open jump',
	DateStart: '2024-06-02T09:00:00Z',
	DateEnd: '2024-06-02T17:00:00Z',
	IsAllDay: false,
	IsDeleted: false,
	CategoryID: categoryID,
	TimeLabel: '9:00 AM - 5:00 PM',
	NumWaiverForms: 1,
	NumSignedWaivers: 12,
	SpotsRemaining: 8,
	MaxParts: 20,
	Headcount: 12,
	ManagerEmailList: 'manager@example.com',
	ManagerIDs: ['u-1'],
	Created: '2024-01-01T00:00:00Z',
	LastModified: '2024-02-01T00:00:00Z',
	WaiverEventFormIDs: [formID],
	WaiverForms: [form],
	Waivers: [waiverLite],
	Category: null,
};

export const eventsPage = { Events: [event] };

export const eventCategory = {
	WaiverEventCategoryID: categoryID,
	SiteID: siteID,
	Name: 'Open jump',
	Status: 'Active',
};

export const categoriesPage = { EventCategories: [eventCategory] };

export const categoryMutation = {
	Success: true,
	WaiverEventCategoryID: categoryID,
};

export const subscribersPage = {
	Subscribers: [
		{
			WPSMSMobileNumID: 'sms-1',
			Phone: '+15550100',
			MobileNum: '+15550100',
			Added: '2024-06-01T00:00:00Z',
			OptOutDate: null,
		},
	],
};

export const successResponse = { Success: true, Message: 'Done.' };

/** The error bodies the API sends: capital M, and no code. */
export const invalidKey = {
	Message: 'InvalidService is online though. ',
};

export const missingCredential = {
	Message: 'apiKey is required',
};

export const routeNotFound = {
	Message:
		"No HTTP resource was found that matches the request URI 'https://api.waiverfile.com/api/v1/Nope'.",
};

export const badRequest = {
	Message: 'startDate must be before endDate',
};
