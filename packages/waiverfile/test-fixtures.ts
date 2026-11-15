// Response bodies as the live WaiverFile API sent them to a trial account on
// 2026-11-12, trimmed to the fields the plugin and its tests read, with made-up
// ids, names and addresses. Their three serialisations are deliberate (see
// endpoints/shape.ts):
//
// - events, forms, categories and the site: a .NET object, columns under `me`
// - waiver reads: XML converted to JSON, every value a string
// - Ping, counts and webhook routes: bare JSON values

export const waiverID = '4e5c5176-1238-45a3-8a87-35435baecaa2';
export const secondWaiverID = '7b0f2c11-5d4e-4f60-9a1b-2c3d4e5f6a7b';
export const siteID = '00000000-0000-0000-0000-000000000001';
export const eventID = 'c0a1b2c3-1111-2222-3333-444455556666';
export const categoryID = '9a3c5e3e-7c4f-4a83-88be-86a3c85fa0e4';
export const formID = '152a63cc-0a49-475a-a8e4-5f89bee94fe6';

const xmlDeclaration = { '@version': '1.0', '@encoding': 'utf-16' };
const xmlNamespaces = {
	'@xmlns:xsd': 'http://www.w3.org/2001/XMLSchema',
	'@xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
};

/** One participant, as a single XML element converts: an object, not an array. */
export const xmlParticipant = {
	WaiverParticipantID: '0e952cd6-9453-49e1-8c73-7ecb1c8b17e9',
	WaiverID: waiverID,
	ParticipantName: 'Ruiz',
	ParticipantNameFirst: 'Jordan',
	DOB: '2/20/1985',
	IsCheckedIn: 'false',
	ValuesXml: null,
	IsSignee: 'true',
	Age: '-1',
	WPObjectStatus: 'Current',
};

/** A waiver as the XML-converted routes send it. Every value is a string. */
export const xmlWaiver = {
	EmailRequested: 'false',
	WaiverID: waiverID,
	SiteID: siteID,
	WaiverEventID: '00000000-0000-0000-0000-000000000000',
	WaiverFormInstanceID: 'a02f3cc0-8b15-4883-b56f-cb4b0a2ac5f1',
	DateSigned: '2026-11-12T06:59:28.47',
	Address: '1 Example Way',
	Address2: null,
	City: 'Bayville',
	State: 'NY',
	Zip: '11709',
	Phone: null,
	DOB: '2/20/1985',
	Email: 'jordan@example.com',
	SignedName: 'Ruiz',
	SignedNameFirst: 'Jordan',
	ClientIP: '203.0.113.10',
	FieldsXml: null,
	ValuesXml: { data: null },
	Age: '0',
	DateAttending: '1753-01-01T00:00:00',
	WaiverFormID: formID,
	HasSignature: 'true',
	OptIn: 'false',
	ClientType: 'Web',
	deviceID: '-1',
	WaiverIsDeleted: 'false',
	Particpants: { WaiverParticipant: xmlParticipant },
	Images: null,
	WPObjectStatus: 'Current',
	Expired: 'false',
};

export const secondXmlWaiver = {
	...xmlWaiver,
	WaiverID: secondWaiverID,
	SignedName: 'Lee',
	SignedNameFirst: 'Sam',
	Particpants: {
		WaiverParticipant: [
			{ ...xmlParticipant, WaiverID: secondWaiverID, ParticipantName: 'Lee' },
			{
				...xmlParticipant,
				WaiverParticipantID: 'p-2',
				WaiverID: secondWaiverID,
				ParticipantName: 'Lee',
				ParticipantNameFirst: 'Alex',
				IsSignee: 'false',
			},
		],
	},
};

/** `GetWaiver` / `GetWaiverLite`: the waiver under `Waiver`, plus `CustomFields`. */
export const waiverResponse = {
	'?xml': xmlDeclaration,
	Waiver: { ...xmlNamespaces, ...xmlWaiver },
	CustomFields: { 'T-shirt size': 'M' },
};

/** A list with one match: `Waiver` is an object. */
export const oneWaiverList = {
	'?xml': xmlDeclaration,
	ArrayOfWaiver: { ...xmlNamespaces, Waiver: xmlWaiver },
};

/** A list with several matches: `Waiver` is an array. */
export const twoWaiverList = {
	'?xml': xmlDeclaration,
	ArrayOfWaiver: { ...xmlNamespaces, Waiver: [xmlWaiver, secondXmlWaiver] },
};

/** No matches: `ArrayOfWaiver` holds only its namespaces. */
export const emptyWaiverList = {
	'?xml': xmlDeclaration,
	ArrayOfWaiver: { ...xmlNamespaces },
};

export const dataRows = {
	Table: [
		{
			RowNum: 1,
			WaiverID: waiverID,
			SignedNameCombined: 'Jordan Ruiz',
			SignedNameFirst: 'Jordan',
			SignedName: 'Ruiz',
			ParticipantNameCombined: 'Jordan Ruiz',
			Email: 'jordan@example.com',
			DateSigned: '2026-11-12T06:59:28.47',
			signeeAge: 41,
			'wf.Name': 'Waiver Form',
			optin: false,
			IsCheckedIn: false,
			ReferenceID1: null,
		},
	],
};

/** `GetSiteDetails`, with the megabyte of labels cut down to one each. */
export const siteResponse = {
	'<IsSandboxMode>k__BackingField': false,
	'<Customer>k__BackingField': null,
	_WPObjectStatus: 1,
	_labels: [{ Code: 'WELCOME_H1', Name: 'Welcome screen, main heading' }],
	me: {
		iD: siteID,
		name: 'Twin Harbor Adventures',
		url: 'TwinHarbor',
		defaultTimezone: 'America/New_York',
		status: 1,
		dateAdded: '2026-11-12T06:51:10.623',
		replyToEmail: 'owner@example.com',
		labelData: '<labels>…</labels>',
	},
};

/** A form, as `GetActiveWaiverForms` sends each item. */
export const formResponse = {
	_WPObjectStatus: 1,
	_currentInstance: null,
	'<WorkflowStepFormRef>k__BackingField': null,
	me: {
		iD: formID,
		siteID,
		name: 'Waiver Form',
		questions: '',
		numParticipantsPerForm: 0,
		minAge: 18,
		fieldInclude_Email: true,
		fieldRequire_Email: true,
		fieldInclude_Phone: false,
		fieldRequire_Phone: false,
		includeSignature: true,
		status: 0,
		created: '2026-11-12T06:56:09.827',
	},
};

export const formsResponse = [formResponse];

/** An event, as `GetEventsByDateRange` and the event writes send it. */
export const eventResponse = {
	_WPObjectStatus: 1,
	_waivers: [],
	_waiverForms: [],
	_managerIDs: ['a596a7fa-3d6a-40a4-b22b-e52635d4f371'],
	_numSignedWaivers: 0,
	'<Category>k__BackingField': null,
	me: {
		waiverEventID: eventID,
		siteID,
		name: 'Saturday open jump',
		dateStart: '2026-12-01T14:00:00',
		dateEnd: '2026-12-01T17:00:00',
		isDeleted: false,
		isAllDay: false,
		categoryID,
		numWaiverForms: 1,
		maxParts: -1,
		headcount: -1,
		spotsRemaining: -1,
		managerEmailList: null,
	},
	_workflowIDs: [],
	_waiverEventFormIDs: [{ WaiverEventID: eventID, WaiverFormID: formID }],
	'<Settings>k__BackingField': {
		MaxParticipants: -1,
		Location: '',
		SigningCutoff: '9999-12-31T00:00:00',
		Description: '',
	},
	_timeLabel: '12/01/2026 9:00 AM-12:00 PM',
};

export const eventsResponse = [eventResponse];

/** `GetUpcomingEvents`: PascalCase, and the array serialised twice. */
export const upcomingResponse = JSON.stringify([
	{
		WPObjectStatus: 1,
		Waivers: [],
		ManagerIDs: [],
		NumSignedWaivers: 0,
		WaiverEventID: eventID,
		SiteID: siteID,
		Name: 'Saturday open jump',
		DateStart: '2026-12-01T14:00:00',
		DateEnd: '2026-12-01T17:00:00',
		IsDeleted: false,
		NumWaiverForms: 1,
		IsAllDay: false,
		CategoryID: categoryID,
		WaiverEventFormIDs: [],
	},
]);

/** `GetWaiversForEvent`: standard JSON, so the values keep their types. */
export const eventWaiversResponse = [
	{
		_WPObjectStatus: 1,
		_participants: [
			{
				WaiverParticipantID: '541dfc0a-973b-4f5c-b071-1bba841ec36c',
				WaiverID: waiverID,
				ParticipantName: 'Ruiz',
				ParticipantNameFirst: 'Jordan',
				DOB: '2/20/1985',
				IsCheckedIn: false,
				ValuesXml: '',
				IsSignee: true,
			},
		],
		'<Expired>k__BackingField': false,
		me: {
			waiverID,
			siteID,
			waiverEventID: eventID,
			dateSigned: '2026-11-12T07:03:10.15',
			dOB: '2/20/1985',
			email: 'jordan@example.com',
			signedName: 'Ruiz',
			signedNameFirst: 'Jordan',
			age: 41,
			waiverFormID: formID,
			hasSignature: true,
			optIn: false,
			clientType: 0,
			waiverIsDeleted: false,
			referenceID1: null,
		},
	},
];

export const categoryResponse = {
	_WPObjectStatus: 0,
	me: {
		iD: categoryID,
		siteID,
		status: 0,
		orderNum: 1,
		name: 'Open jump',
	},
};

export const categoriesResponse = [categoryResponse];

/** The error bodies the API sends: capital M, and no code. */
export const invalidKey = {
	Message: 'InvalidService is online though. ',
};

/** Every route but Ping answers a bad key or a wrong site with this. */
export const invalidKeyOnRoute = { Message: 'Invalid' };

export const missingCredential = {
	Message: 'apiKey is required',
};

/** A wrong path. WaiverFile echoes the full request URL, key included. */
export const routeNotFound = {
	Message:
		"No HTTP resource was found that matches the request URI 'https://api.waiverfile.com/api/v1/Nope?apiKey=wf-test-api-key&siteID=00000000-0000-0000-0000-000000000001'.",
};

export const badRequest = {
	Message: 'The request is invalid.',
};
