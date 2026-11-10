// Bodies taken from Nanonets's documented field lists:
// https://docs.nanonets.com/reference/overview

export const modelId = '9f8c2d4b-6a7e-4f3b-9c1d-2e5b8a7f4c6d';

export const requestFileId = 'e2f6a9c1-8b4d-4c73-9a5e-1d0f7b3c8a42';

export const predictionEnvelope = {
	message: 'Success',
	result: [
		{
			id: 'b1d5c0a2-3e47-4e89-9f21-7c8f5a3d6e10',
			request_file_id: requestFileId,
			file_url: 'https://files.nanonets.com/invoice.png',
			processing_type: 'async',
			prediction: [
				{
					id: 'c3a7e1f5-2b49-4d58-8e6a-0f9c4b2d7a33',
					label: 'total_amount',
					xmin: 412,
					ymin: 88,
					xmax: 528,
					ymax: 104,
					score: '0.97',
					ocr_text: '120.00',
					type: 'field',
					status: 'correctly_predicted',
					page_no: 1,
				},
			],
		},
	],
	signed_urls: {
		'invoice.png': {
			original: 'https://files.nanonets.com/signed/invoice.png?exp=4h',
			original_with_long_expiry:
				'https://files.nanonets.com/signed/invoice.png?exp=180d',
		},
	},
};

// The async upload answer: the file is queued, so the boxes and the signed
// URLs arrive later, once the poll target reports Success.
export const asyncPendingEnvelope = {
	message: 'pending',
	result: [
		{
			id: 'b1d5c0a2-3e47-4e89-9f21-7c8f5a3d6e10',
			request_file_id: requestFileId,
			file_url: '',
			processing_type: 'async',
			prediction: [],
		},
	],
	signed_urls: {},
};

export const filesListResponse = {
	moderated_images_count: 1,
	unmoderated_images_count: 0,
	moderated_images: [
		{
			model_id: modelId,
			day_since_epoch: 20357,
			is_moderated: true,
			id: 'b1d5c0a2-3e47-4e89-9f21-7c8f5a3d6e10',
			request_file_id: requestFileId,
			approval_status: 'approved',
			export_status: 'success',
			no_of_fields: 6,
		},
	],
	unmoderated_images: [],
	signed_urls: {},
};

// Model Object state 5: hosted and usable.
export const modelObject = {
	model_id: modelId,
	model_type: 'ocr',
	state: 5,
	message: 'Model trained successfully',
};

// The documented answer of Upload training images by Url:
// https://docs.nanonets.com/reference/ocrmodeluploadurlsbymodelidpost-1
export const uploadTrainingUrlsResponse = {
	Meta: {
		ModelID: modelId,
		ModelType: 'ocr',
		State: 0,
		Categories: [
			{ name: 'total_amount', count: 1 },
			{ name: 'tax_amount', count: 0 },
		],
		Accuracy: 0,
		Status: 'Current Status',
	},
	Data: [
		{
			filename: 'train-1.png',
			size: { width: 1024, height: 1024 },
			object: [
				{
					name: 'total_amount',
					ocr_text: '120.00',
					bndbox: { xmin: 1, ymin: 1, xmax: 100, ymax: 100 },
				},
			],
			id: '7d2e9b14-5c3a-4f86-a1d7-9e0b6c4f2a58',
		},
	],
};

// Model Object state 4: still training.
export const modelTrainingObject = {
	model_id: modelId,
	model_type: 'ocr',
	state: 4,
	message: 'Model is training',
};

export const integrationsArray = [
	{
		id: '5c1f8b2e-9a4d-4e67-8b3c-2f6d0a9e7b41',
		email: 'ops@example.com',
		name: ' passports db',
		type: 'postgresql',
		info: {
			db_name: 'passports',
			host: 'db.internal.example.com',
			password: '****',
			username: '****',
		},
		status: 'active',
		is_internal: false,
	},
];

// Rows from the documented `select * from passports` style of query; the
// shape depends entirely on the query.
export const queryRows = [
	{
		id: 1,
		name: 'AVELINO ARDUINI',
		passport_number: 'N8734459',
		nationality: 'ITA',
		expiry_date: '2029-04-18',
	},
	{
		id: 2,
		name: 'MARIA JOSE SANTOS',
		passport_number: 'C1592287',
		nationality: 'BRA',
		expiry_date: '2031-01-07',
	},
];

// The generic error body: { message, code, errors: [{ reason, message }] }.
export const error400 = {
	message: 'No file attached',
	code: 400,
	errors: [
		{
			reason: 'missing file',
			message:
				'No file attached. Send the image via file or base64_data. See https://docs.nanonets.com/reference/ocr',
		},
	],
};

export const error401 = {
	message: 'Invalid API key',
	code: 401,
	errors: [],
};

export const error402 = {
	message: 'Free API calls exhausted',
	code: 402,
};

export const error404 = {
	message: 'Model does not exist',
	code: 404,
};

export const error429 = {
	message: 'Too many requests',
	code: 429,
};

export const error500 = {
	message: 'Internal server error',
	code: 500,
};

// Per-endpoint OpenAPI blocks document plain-text error bodies instead of
// the JSON shape above.
export const plainTextError = 'Model not found.';
