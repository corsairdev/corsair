/**
 * Responses copied from the shape the OpenAPI spec documents
 * (https://craftmypdf.com/docs). The spec's own examples are used where they
 * are internally consistent; where they are not, the note says so.
 */

export const generatedFile = {
	status: 'success',
	file: 'https://craftmypdf.s3.ap-southeast-1.amazonaws.com/abc/output.pdf',
	transaction_ref: 'a0430897-2c94-40e1-a09b-57403d811ceb',
};

export const generatedFileWithAnchors = {
	...generatedFile,
	anchors: [
		{ page: 1, text: '', level: '0', description: 'Welcome to CraftMyPDF!' },
		{ page: 2, text: 'page 2', level: '0', description: '' },
	],
};

/** pdf.get-info answers camelCase fields; the rest of the API is snake_case. */
export const pdfInfo = {
	status: 'success',
	totalPages: 19,
	url: 'https://example.com/sample.pdf',
	title: '',
	author: 'CraftMyPDF',
	subject: '',
	creator: 'Microsoft Excel 365',
	keywords: '',
	producer: 'pdf-lib',
	creationDate: '2024-03-30T16:13:55.000Z',
	modificationDate: '2024-04-09T09:00:56.000Z',
};

export const templatesPage = {
	status: 'success',
	templates: [
		{
			template_id: '5ef77b2b187c968c',
			name: 'Invoice Template',
			status: 'ACTIVE',
			created_at: '2021-07-31T16:00:00.000Z',
			updated_at: '2021-08-27T13:07:45.968Z',
			group_name: '',
		},
		{
			template_id: '19d77b2b187554e0',
			name: 'PDF Template',
			status: 'ACTIVE',
			created_at: '2020-06-01T16:00:00.000Z',
			updated_at: '2021-08-27T13:07:45.968Z',
			group_name: 'Customer_009',
		},
	],
};

export const templateDetail = {
	status: 'success',
	name: 'Test Template',
	body: '{"pages":[]}',
	json: '{"first_name":"Jack"}',
};

export const templateVersions = {
	status: 'success',
	template_id: '5ef77b2b187c968c',
	versions: [
		{ version: 0, description: 'Latest', updated_at: '' },
		{
			version: 42,
			keep: false,
			description: '',
			updated_at: '2022-12-22T13:04:48.355Z',
		},
	],
};

export const retainedVersions = {
	status: 'success',
	template_id: 'c2d77b234151b7c4',
	versions: [
		{
			version: 1,
			keep: true,
			description: '',
			updated_at: '2024-10-26T06:06:44.399Z',
		},
	],
};

export const newTemplate = {
	status: 'success',
	template_id: '05f77b2b18ad809a',
	from_template_id: '23f4218dc352',
	from_template_version: '8',
};

export const accountInfo = {
	status: 'success',
	username: 'hello@craftmypdf.com',
	// The spec types quota_counter as float and template_counter as string.
	quota_counter: 35,
	quota_max: 100,
	template_counter: '1',
	template_max: 3,
	created_at: '2024-08-06T12:14:39.137Z',
};

export const transactionsPage = {
	status: 'success',
	transactions: [
		{
			transaction_ref: 'f1d3a8dc-c7ce-4ea4-b3f4-db9e71ea620b',
			transaction_type: 'PDFGEN',
			exec_tm: 1200,
			credit: '1.0000',
			created_at: '2024-08-06T12:14:39.137Z',
			resp_file_size: 45_231,
			resp_status: 'success',
		},
	],
};

export const editorSession = {
	status: 'success',
	url: 'https://craftmypdf.com/designer/?template_id=a2777b23223444&session_token=tok',
	expire_after_unix_timestamp: 1_674_097_492,
	expire_after: '2023-01-19T03:04:51.811Z',
	token_uuid: '66b0e71d-5a72-4fee-b4a5-7f1713fd2fb5',
};

export const updatedFields = {
	status: 'success',
	message: 'PDF fields updated successfully',
	file: 'https://craftmypdf.s3.ap-southeast-1.amazonaws.com/abc/updated.pdf',
	field_statuses: [{ id: 'last_name', status: 'success', message: '' }],
};

export const parallelResult = {
	status: 'success',
	results: [
		{
			file: 'https://craftmypdf-gen.s3.eu-central-1.amazonaws.com/abc/output.pdf',
			transaction_ref: 'dvbewe-2a8b-4182-b92c-33dfw3fcds',
			status: 'success',
			total_pages: 1,
			template_id: 'be277b31334bfa0',
			index: 0,
			meta: 'yourrefernce0001',
		},
	],
	merge_result: {
		file: 'https://craftmypdf-gen.s3.ap-southeast-1.amazonaws.com/abc/merged.pdf',
		transaction_ref: 'be05575f-42f5-43f7-af8f-67ecde8af78a',
		status: 'success',
	},
};

export const usageReport = {
	status: 'success',
	template_ids: ['bba77b234e84443e', '02077b2b1aa8b938'],
	start_date: '2025-01-30T00:00:00Z',
	end_date: '2025-01-30T11:59:59Z',
	results: [
		{
			template_id: '02077b2b1aa8b938',
			total_credit: '8.0000',
			total_count: '8',
		},
		{
			template_id: 'bba77b234e84443e',
			total_credit: '2.0000',
			total_count: '2',
		},
	],
};

export const asyncAccepted = {
	status: 'success',
	transaction_ref: 'b692183d-46d7-3213-891a-460a5814ad3f',
	is_async: true,
};

export const successOnly = { status: 'success' };
