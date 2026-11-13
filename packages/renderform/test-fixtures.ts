/**
 * Response bodies for the tests, from the OpenAPI document at
 * https://api.renderform.io/openapi/docs and the live refusals captured from it.
 */

export const RENDERED = {
	requestId: 'req-dc95beb3-8c56-40e9-b428-e6b4c68354a3',
	href: 'https://cdn.renderform.io/my-image.jpg',
};

// A cached render carries `cached` and costs no credits.
export const RENDERED_CACHED = {
	...RENDERED,
	cached: true,
};

// A video render is asynchronous: 202 with pending, and href is not usable yet.
export const RENDER_PENDING = {
	requestId: 'req-dc95beb3-8c56-40e9-b428-e6b4c68354a3',
	href: 'https://cdn.renderform.io/my-video.mp4',
	status: 'pending',
};

export const TEMPLATE = {
	identifier: 'template_1234',
	name: 'Instagram post',
	preview: 'https://cdn.renderform.io/preview.png',
	scaleFactor: 1,
	outputFormat: 'png',
	outputExtension: '.png',
	quality: 90,
	width: 1080,
	height: 1080,
	tags: ['marketing', 'instagram'],
	editor: 'canvas-editor',
	createdAt: '2026-01-01T00:00:00Z',
	updatedAt: '2026-01-02T00:00:00Z',
};

export const TEMPLATES = [
	TEMPLATE,
	{
		...TEMPLATE,
		identifier: 'template_5678',
		name: 'Story',
		width: 1080,
		height: 1920,
	},
];

export const TEMPLATE_CONTENT = {
	html: '<div class="card">{{my-text.text}}</div>',
	css: '.card { color: red; }',
	sampleData: { 'my-text.text': 'John' },
};

export const RESULT_ITEM = {
	identifier: 'req-dc95beb3-8c56-40e9-b428-e6b4c68354a3',
	href: 'https://cdn.renderform.io/my-image.jpg',
	width: 1080,
	height: 1080,
	templateName: 'Instagram post',
	templateIdentifier: 'template_1234',
	createdAt: '2026-01-01T00:00:00Z',
};

// A Spring-style page: the rows are in `content`.
export const RESULTS = {
	content: [RESULT_ITEM],
	totalElements: 1,
	totalPages: 1,
	size: 20,
	number: 0,
	numberOfElements: 1,
	first: true,
	last: true,
	empty: false,
};

export const RESULT_DONE = {
	identifier: 'req-dc95beb3-8c56-40e9-b428-e6b4c68354a3',
	href: 'https://cdn.renderform.io/my-image.jpg',
	status: 'done',
	type: 'image',
};

export const RESULT_VIDEO_DONE = {
	...RESULT_DONE,
	href: 'https://cdn.renderform.io/my-video.mp4',
	type: 'video',
	thumbnailHref: 'https://cdn.renderform.io/my-video.jpg',
};

export const RESULT_PENDING = {
	...RESULT_DONE,
	href: null,
	status: 'pending',
	type: 'video',
};

export const SCREENSHOT = {
	requestId: 'req-screenshot',
	href: 'https://cdn.renderform.io/screenshot.png',
	request: {
		url: 'https://renderform.io',
		width: 1920,
		height: 1080,
		waitTime: 1000,
	},
};

export const PDF = {
	requestId: 'req-pdf',
	href: 'https://cdn.renderform.io/page.pdf',
	request: { url: 'https://renderform.io', format: 'A4', expires: 3600 },
};

export const USAGE = {
	identifier: 'org_123',
	credits: {
		used: 120,
		total: 1000,
		nextRenewalAt: '2026-05-01T00:00:00Z',
		renewalAmount: 1000,
	},
	uploads: { used: 3, total: 100 },
	plan: {
		name: 'Pro',
		status: 'active',
		nextBillingAt: '2026-05-01T00:00:00Z',
	},
};

export const FONTS = [
	{
		originalName: 'Inter',
		family: 'Inter',
		variants: ['regular', '700'],
		defaultVariant: 'regular',
		subsets: ['latin'],
		category: 'sans-serif',
		source: 'GOOGLE',
		size: 120000,
		createdAt: '2026-01-01T00:00:00Z',
	},
];

// Live: a bad key and no key both answer this, at HTTP 400 rather than 401.
export const INCORRECT_KEY = { msg: 'Incorrect API Key', status: 400 };

// Live: an unknown route.
export const RESOURCE_NOT_FOUND = { msg: 'Resource not found', status: 404 };

export const NO_CREDITS = { msg: 'Insufficient credits', status: 402 };

// A refusal that names individual problems.
export const VALIDATION_ERROR = {
	msg: 'Validation failed',
	status: 400,
	errors: ['template must not be blank', 'data must be an object'],
};

export const SERVER_ERROR = { msg: 'Internal server error', status: 500 };
