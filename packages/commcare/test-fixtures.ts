// Response bodies copied from the examples in
// https://commcare-hq.readthedocs.io/api/, with made-up projects and people.
// They were not captured from the live API.

export const formList = {
	meta: {
		limit: 20,
		next: 'https://www.commcarehq.org/a/my-project/api/form/v1/?limit=20&offset=20',
		offset: 0,
		previous: null,
		total_count: 29,
	},
	objects: [
		{
			id: '66d7a362-18a2-4f45-bd84-06f19b408d64',
			form: { '#type': 'data', '@name': 'Case Update' },
			metadata: {
				app_id: '952a0b480c7c10dde777b2485375d2237',
				form_type: 'module_form',
			},
		},
	],
};

export const form = {
	id: '66d7a362-18a2-4f45-bd84-06f19b408d64',
	form: {
		'#type': 'data',
		'@name': 'Case Update',
		case: { '@case_id': '8f8fd909' },
	},
	metadata: { received_on: '2024-10-29T14:31:29.799+00:00' },
};

export const caseList = {
	matching_records: 1,
	cases: [
		{
			domain: 'my-project',
			case_id: '8f8fd909-684f-402d-a892-f50e607fffef',
			case_type: 'patient',
			case_name: 'Elizabeth Harmon',
			external_id: '1',
			owner_id: '20cc9dda-b90a-4af3-aa3d-fc67184e73ef',
			date_opened: '2020-03-19T14:31:34.133000Z',
			last_modified: '2020-03-19T14:31:34.133000Z',
			server_last_modified: '2020-03-19T14:31:35.000000Z',
			closed: false,
			properties: { gender: 'female' },
		},
	],
	next: 'https://www.commcarehq.org/a/my-project/api/case/v2/?cursor=abc',
};

export const user = {
	type: 'user',
	id: '3c5a623af057e23a32ae4000cf291339',
	username: 'jdoe@my-project.commcarehq.org',
	first_name: 'John',
	last_name: 'Doe',
	default_phone_number: '+50253311399',
	email: 'john.doe@example.org',
	user_data: { role: 'chw' },
};

export const userList = {
	meta: {
		limit: 20,
		next: null,
		offset: 0,
		previous: null,
		total_count: 29,
	},
	objects: [user],
};

export const group = {
	id: '91da6b1c78699adfb8679b741caf9f00',
	name: 'Field team A',
	path: ['Field team A'],
	reporting: true,
	users: ['3c5a623af057e23a32ae4000cf291339'],
};

export const groupList = { objects: [group] };

export const webUser = {
	id: '8f9756be9b1c7f28057d707b405d18f6',
	email: 'admin@example.com',
	first_name: 'Joe',
	is_admin: true,
	role: 'Admin',
	permissions: { edit_data: true },
};

export const location = {
	location_id: '68e65fbc2dc840ff8bf03849e57aca88',
	name: 'Fairfax County',
	site_code: 'fairfax_county',
	location_type_code: 'county',
	location_type_name: 'County',
	parent_location_id: '41b0bdfbae20428e9435ae8c3dcd22e7',
	longitude: null,
	latitude: null,
};

export const locationType = {
	id: 1,
	code: 'country',
	name: 'Country',
	administrative: true,
	domain: 'my-project',
	parent: null,
};

// Shapes from the Fixture Data API and Lookup Table Individual API pages.
export const fixtureItem = {
	id: '1J9NF7B4FTH73435PYJJSL5SJ',
	fixture_type: 'city',
	fields: { name: 'Boston', population: 617594, state: 'Massachusetts' },
	resource_uri: '',
};

export const lookupTable = {
	id: 'bcf49791f7f04f09bd46262097e107f2',
	tag: 'vaccines',
	is_global: true,
	fields: [
		{ field_name: 'name', properties: ['lang'] },
		{ field_name: 'price', properties: [] },
	],
	resource_uri: '',
};

export const reportList = [
	{ id: '9aab0eeb88555a7b4568676883e7379a', title: 'Visits by district' },
];

export const reportData = {
	columns: [{ header: 'District', slug: 'district' }],
	data: [{ district: 'Middlesex' }],
	next_page:
		'/a/my-project/api/configurablereportdata/v1/9aab0eeb88555a7b4568676883e7379a/?offset=10&limit=10',
	total_records: 30,
};

export const bulkActionAccepted = {
	id: '0f3a9c',
	action: 'archive',
	status: 'pending',
	requested_by: 'user@example.com',
	requested: 500,
	processed: 0,
	succeeded: 0,
	skipped: {},
	created_at: '2026-08-25T14:02:11.930000Z',
	started_at: null,
	completed_at: null,
	status_url:
		'https://www.commcarehq.org/a/my-project/api/form/v1/bulk-action/0f3a9c',
	message: 'The job has been queued for processing.',
};

export const bulkActionComplete = {
	...bulkActionAccepted,
	status: 'complete',
	processed: 500,
	succeeded: 498,
	completed_at: '2026-08-25T14:20:00.000Z',
};

export const otaRestoreXml =
	"<?xml version='1.0' encoding='UTF-8'?><OpenRosaResponse xmlns=\"http://openrosa.org/http/response\"><message>Successfully restored account danny!</message></OpenRosaResponse>";

export const submissionResponseXml =
	'<OpenRosaResponse xmlns="http://openrosa.org/http/response"><message nature="submit_success">Form successfully submitted.</message></OpenRosaResponse>';

export const rateLimited = { message: 'Slow down!' };
export const badKey = { message: 'Unauthorized' };
export const serverError = { message: 'Something went wrong.' };

// Trimmed from the live case API (11-11) on a project whose plan has no API
// access: HQ answers 200 with this page instead of JSON.
export const upgradeRequiredPage = `<!DOCTYPE html>
<html lang="en">
<head>
  <title>
      : Upgrade Required
      -
      CommCare HQ
  </title>
</head>
<body><h1>Sorry, you do not have access to API Access</h1></body>
</html>`;
