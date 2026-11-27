// Success bodies are built from the three OpenAPI specs' examples; error
// bodies are the ones the unauthenticated probes actually returned
// (/tmp/corsair-work/shotstack/probes/). No success body was seen live, so
// every field the specs mark optional is present here exactly as documented.

export const RENDER_ID = '2abd5c11-0f3d-4c6d-ba20-235fc9b8e8b7';
export const TEMPLATE_ID = 'f5493c17-d01f-445c-bb49-535fae65f219';
export const SOURCE_ID = 'zzytey4v-32km-kq1z-aftr-3kcuqi0brad2';
export const ASSET_ID = 'a4482cbf-e321-42a2-ac8b-947d26886840';
export const OWNER_ID = '5ca6hu7s9k';

// ── edit: renders ──────────────────────────────────────────────────────────

export const renderQueued = {
	success: true,
	message: 'Created',
	response: {
		message: 'Render Successfully Queued',
		id: RENDER_ID,
	},
};

export const renderDone = {
	success: true,
	message: 'OK',
	response: {
		id: RENDER_ID,
		owner: OWNER_ID,
		plan: 'basic',
		status: 'done',
		duration: 8.5,
		renderTime: 9433.44,
		url: `https://shotstack-api-v1-output.s3-ap-southeast-2.amazonaws.com/${OWNER_ID}/${RENDER_ID}.mp4`,
		poster: `https://shotstack-api-v1-output.s3-ap-southeast-2.amazonaws.com/${OWNER_ID}/${RENDER_ID}.jpg`,
		created: '2026-11-27T10:00:00.000Z',
		updated: '2026-11-27T10:00:10.000Z',
	},
};

export const renderFailed = {
	success: true,
	message: 'OK',
	response: {
		id: RENDER_ID,
		owner: OWNER_ID,
		status: 'failed',
		error: 'The source file could not be downloaded.',
	},
};

// ── edit: templates ────────────────────────────────────────────────────────

export const templateCreated = {
	success: true,
	message: 'Created',
	response: {
		message: 'Template Successfully Created',
		id: TEMPLATE_ID,
	},
};

export const templateList = {
	success: true,
	message: 'OK',
	response: {
		owner: OWNER_ID,
		templates: [
			{
				id: TEMPLATE_ID,
				name: 'My template',
				created: '2022-06-10T12:50:21.455Z',
				updated: '2022-06-22T08:24:30.168Z',
			},
		],
	},
};

export const templateData = {
	success: true,
	message: 'OK',
	response: {
		id: TEMPLATE_ID,
		name: 'My template',
		owner: OWNER_ID,
		template: {
			timeline: {
				tracks: [
					{
						clips: [
							{
								asset: { type: 'title', text: 'Hello World', size: 64 },
								start: 0,
								length: 4,
							},
						],
					},
				],
			},
			output: { format: 'mp4', resolution: 'sd' },
		},
	},
};

// ── edit: generations ──────────────────────────────────────────────────────

export const generationQueued = {
	id: '8a1f2c3d-4e5b-5a6c-9d7e-1f2a3b4c5d6e',
	status: 'queued',
};

export const generationDone = {
	id: '8a1f2c3d-4e5b-5a6c-9d7e-1f2a3b4c5d6e',
	status: 'done',
	url: `https://shotstack-api-v1-output.s3-ap-southeast-2.amazonaws.com/${OWNER_ID}/8a1f2c3d.png`,
};

export const generationQuote = {
	credits: 0.6038,
	ceiling: false,
};

export const generationModel = {
	model: 'seedance-2.0-text-to-video',
	type: 'video',
	name: 'Seedance 2.0 · Text to video',
	description: 'Generate cinematic video with realistic motion.',
	available: true,
};

export const generationModels = { models: [generationModel] };

// ── edit: probe ────────────────────────────────────────────────────────────

export const probeResponse = {
	success: true,
	message: 'Created',
	response: {
		width: 1920,
		height: 1080,
		duration: 30,
		fps: 25,
		type: 'video',
	},
};

// ── ingest: sources ────────────────────────────────────────────────────────

export const sourceQueued = {
	data: { type: 'source', id: SOURCE_ID },
};

export const sourceReady = {
	data: {
		type: 'source',
		id: SOURCE_ID,
		attributes: {
			id: SOURCE_ID,
			owner: OWNER_ID,
			input:
				'https://github.com/shotstack/test-media/raw/main/captioning/scott-ko.mp4',
			source: `https://shotstack-ingest-api-v1-sources.s3.ap-southeast-2.amazonaws.com/${OWNER_ID}/${SOURCE_ID}/source.mp4`,
			status: 'ready',
			width: 1920,
			height: 1080,
			duration: 30.5,
			created: '2026-11-27T10:00:00.000Z',
			updated: '2026-11-27T10:00:12.000Z',
		},
	},
};

export const sourceList = {
	data: [sourceReady.data],
};

// ── ingest: uploads ────────────────────────────────────────────────────────

export const uploadCreated = {
	data: {
		type: 'upload',
		id: SOURCE_ID,
		attributes: {
			id: SOURCE_ID,
			url: `https://shotstack-ingest-api-v1-sources.s3.ap-southeast-2.amazonaws.com/${OWNER_ID}/${SOURCE_ID}/source?AWSAccessKeyId=ASIAEXAMPLE&Signature=EXAMPLE`,
			expires: '2026-11-27T11:00:00.000Z',
		},
	},
};

// ── serve: assets ──────────────────────────────────────────────────────────

export const assetReady = {
	data: {
		type: 'asset',
		attributes: {
			id: ASSET_ID,
			owner: OWNER_ID,
			region: 'au',
			renderId: RENDER_ID,
			providerId: ASSET_ID,
			filename: `${RENDER_ID}.mp4`,
			url: `https://cdn.shotstack.io/au/v1/${OWNER_ID}/${RENDER_ID}.mp4`,
			status: 'ready',
			created: '2021-06-30T09:42:29.446Z',
			updated: '2021-06-30T09:42:30.168Z',
		},
	},
};

export const assetsByRender = {
	data: [assetReady.data],
};

export const transferQueued = {
	data: {
		type: 'asset',
		attributes: {
			id: '018e8937-5015-75ee-aab6-03f214981133',
			owner: OWNER_ID,
			status: 'queued',
			created: '2023-09-28T11:17:32.226Z',
		},
	},
};

// ── errors ─────────────────────────────────────────────────────────────────

// Probes 02-24: every service answers a wrong or missing key with this body.
export const errorsForbidden = {
	errors: [
		{
			status: '403',
			title: 'Forbidden',
			detail:
				"Invalid or disabled API key. Please check your API key is entered correctly for the 'v1' stage and your account is active.",
		},
	],
};

// Probe 1-render-unauth: the Edit API's 404 class, as an envelope.
export const editNotFound = {
	success: false,
	message: 'Not found',
	response:
		'The resource GET /stage/v1/render does not exist, check the method type (POST, GET) and URL. API Reference Docs: https://shotstack.io/docs/api/',
};

// Generate API errors are bare.
export const generationQuotaError = {
	error: 'The account has reached its generation quota.',
	available: 0.5,
};

export const generationPlanError = {
	error: 'Your plan does not include this kind of generation.',
	code: 'AiCapabilityNotIncluded',
};

export const rateLimitedBody = {
	errors: [
		{
			status: '429',
			title: 'Too Many Requests',
			detail: 'Rate limit exceeded. Wait for the 60 second window to reset.',
			code: 'rate_limit_error',
		},
	],
};
