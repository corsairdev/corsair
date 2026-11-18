// Fixtures built from the response examples in Templated's docs
// (https://templated.io/docs). Renders and templates carry camelCase fields
// (`templateId`, `externalId`), the create bodies use snake_case
// (`image_url`, `webhook_url`), and a hosted merge answers `{ url }` alone.

export const render = {
	id: 'ce424057-6b54-41bb-afec-adc35a2b9175',
	url: 'https://cdn.templated.media/render/ce424057-6b54-41bb-afec-adc35a2b9175.jpg',
	storage_url: null,
	width: 1920,
	height: 1080,
	status: 'COMPLETED',
	format: 'jpg',
	templateId: '1f1231-dasd123-fsdf12312-fds4123-asdas23',
	templateName: 'Sample Template',
	name: 'Hero image',
	createdAt: '2025-04-22 08:30:58',
	externalId: null,
};

export const rendersList = [render];

export const renderCreated = render;

export const pendingRender = {
	...render,
	status: 'PENDING',
	url: null,
};

export const mergedPdf = {
	url: 'https://assets.templated.io/renders/merged/merged-abc123.pdf',
};

export const template = {
	id: '306c724a-d138-486a-a601-0b2a9ced52be',
	name: 'Twitter Bubble Square Template',
	description: 'This is a sample template for demonstration.',
	width: 1024,
	height: 1024,
	thumbnail:
		'https://templated-assets.s3.us-east-1.amazonaws.com/public/thumbnail/306c724a.webp',
	layersCount: 3,
	folderId: null,
	createdAt: '2025-01-01T00:00:00Z',
	modifiedAt: '2025-01-02T00:00:00Z',
	tags: ['social-media'],
};

export const templatesList = [template];

export const templateLayer = {
	layer: 'text-1',
	type: 'text',
	text: 'Hello',
	x: 10,
	y: 20,
	width: 400,
	height: 80,
	rotation: 0,
	color: '#FF0000',
	background: '#0000FF',
	font_family: 'Roboto',
	font_size: '32px',
	font_weight: 'bold',
	text_align: 'center',
	locked: false,
};

export const templateLayers = [templateLayer];

export const upload = {
	id: 'upl_123abc',
	url: 'https://assets.templated.io/uploads/upl_123abc.png',
	name: 'logo.png',
	mimeType: 'image/png',
	size: 20480,
	width: 512,
	height: 512,
	tags: ['brand'],
	externalId: null,
	createdAt: '2025-01-01T00:00:00Z',
};

export const uploadsList = [upload];

export const folder = {
	id: 'fld_123abc',
	name: 'My New Folder',
	templateCount: 4,
	createdAt: '2024-03-20T10:30:00Z',
	updatedAt: '2024-03-20T10:30:00Z',
};

export const foldersList = [folder];

export const googleFont = {
	name: 'Roboto',
	isGoogleFont: true,
	isUploadedFont: false,
};

export const fontsList = [googleFont];

export const account = {
	email: 'user@example.com',
	name: 'John Doe',
	apiUsage: 5400,
	apiQuota: 10000,
	usagePercentage: 54,
	plan: 'Scale',
};

// The auth layer answers `{ error }`; the framework answers with a status and
// a path alongside the same `error` field.
export const authErrorResponse = {
	error: 'API key not valid. Please check your Authorization header.',
};

export const notFoundResponse = {
	timestamp: '2026-11-15T15:34:30.911+00:00',
	status: 404,
	error: 'Not Found',
	path: '/v1/nope',
};

export const tagsResponse = {
	id: '306c724a-d138-486a-a601-0b2a9ced52be',
	tags: ['social-media', 'instagram'],
};
