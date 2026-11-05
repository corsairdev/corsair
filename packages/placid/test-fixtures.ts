/**
 * Response bodies taken from the examples in Placid's REST docs, plus the error
 * shapes its error page lists. Kept in one place so the tests assert against
 * what the API documents rather than against each other.
 */

// https://placid.app/docs/2.0/rest/images#the-image-object
export const imageQueued = {
	id: 1,
	status: 'queued',
	image_url: null,
	polling_url: null,
};

export const imageFinished = {
	id: 1,
	status: 'finished',
	image_url: 'https://placid.app/u/rbqai8oh6?title=Meet+Singh',
	polling_url: 'https://api.placid.app/api/rest/images/1',
	error_code: null,
	error_message: null,
	error_details: [],
};

export const imageFailed = {
	id: 7,
	status: 'error',
	image_url: null,
	polling_url: 'https://api.placid.app/api/rest/images/7',
	error_code: 'MEDIA_DOWNLOAD_FAILED',
	error_message: 'A media file could not be downloaded.',
	error_details: [
		{
			layer: 'img',
			message: 'https://example.com/missing.jpg returned 404',
		},
	],
	errors: [],
};

// https://placid.app/docs/2.0/rest/pdfs#the-pdf-object
export const pdfQueued = {
	id: 2,
	status: 'queued',
	pdf_url: null,
	polling_url: null,
};

// https://placid.app/docs/2.0/rest/videos#the-video-object
export const videoQueued = {
	id: 3,
	status: 'queued',
	video_url: null,
	polling_url: null,
};

// https://placid.app/docs/2.0/rest/templates#the-template-object
export const template = {
	uuid: 'ospo24ysn',
	title: 'Employee of the month',
	thumbnail: 'https://urltoplacidthumbnail.com',
	tags: ['social', 'social/instagram'],
	layers: [
		{ name: 'title', type: 'text' },
		{ name: 'img', type: 'picture' },
		{ name: 'box', type: 'rectangle' },
		{ name: 'site', type: 'browserframe' },
	],
	width: 1080,
	height: 1080,
	created_at: '2026-01-02T03:04:05+00:00',
	updated_at: '2026-01-02T03:04:05+00:00',
};

export const templateList = {
	data: [template],
	links: { first: null, last: null, prev: null, next: null },
	meta: { path: 'https://api.placid.app/api/rest/templates', per_page: 20 },
};

// https://placid.app/docs/2.0/rest/collections#the-collection-object
export const collection = {
	id: 'col_1234',
	title: 'Acme onboarding',
	custom_data: { plan: 'pro' },
	template_uuids: ['ospo24ysn', 'jxac36kja'],
};

export const collectionList = {
	data: [collection],
	links: { first: null, last: null, prev: null, next: null },
	meta: { path: 'https://api.placid.app/api/rest/collections', per_page: 20 },
};

// https://placid.app/docs/2.0/rest/media#response
export const mediaUploaded = {
	media: [
		{
			file_key: 'file',
			file_id: 'https://storage.placid.app/2020-01-01/file.jpg',
		},
	],
};

// https://placid.app/docs/2.0/rest/fonts#the-font-object
export const font = {
	uuid: 'f1abc123def456',
	title: 'Helvetica Neue',
	filename: 'HelveticaNeue-Regular.ttf',
	created_at: '2026-05-06T11:24:00+00:00',
};

export const fontList = {
	data: [font],
	links: { first: null, last: null, prev: null, next: null },
	meta: { path: 'https://api.placid.app/api/rest/fonts', per_page: 20 },
};

// https://placid.app/docs/2.0/rest/errors#http
export const unauthenticated = { message: 'Unauthenticated.' };

export const notFound = { message: 'Not Found' };

// Laravel's validation shape, which Placid returns with a 422.
export const validationFailed = {
	message: 'The given data was invalid.',
	errors: {
		template_uuid: ['The template uuid field is required.'],
		'layers.title.text': ['The layers.title.text must be a string.'],
	},
};
