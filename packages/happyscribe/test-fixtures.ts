// Response bodies copied from the examples in https://dev.happyscribe.com,
// with made-up meetings and contacts. They were not captured from the live
// API.

// Field names as the live API sent them on 11-11 (snake_case; the
// reference examples show camelCase). Values are made up.
export const transcription = {
	id: '9josdjdfo09j309omsldknslkjndfjknsdfs',
	name: 'interview2.mov',
	folder: { id: 522, name: 'Customer calls' },
	created_at: '2024-10-29T14:31:29.799Z',
	updated_at: '2024-10-29T14:31:38.495Z',
	sharing_enabled: false,
	share_code: '20ab11da2b858e519656',
	public_url: null,
	state: 'automatic_done',
	audio_length_in_seconds: 42,
	language: 'en-GB',
	soundwave_url: 'https://hs-soundwaves-prod.s3-eu-west-1.amazonaws.com/x.dat',
	video_url: null,
	tags: ['To do', 'req_1234'],
	meeting: null,
	people: [],
	companies: [],
	_links: {
		self: {
			editor_url:
				'https://www.happyscribe.com/transcriptions/9josdjdfo09j309omsldknslkjndfjknsdfs/subtitles',
		},
	},
};

export const transcriptionList = {
	results: [
		{
			id: 'e458099e7f8da14f9625854ba7b6a026917ad306',
			name: 'Q4 sync - 2024-01-15',
			state: 'automatic_done',
			language: 'en-GB',
		},
		{ ...transcription },
	],
	_links: {
		next: {
			url: 'https://www.happyscribe.com/api/v1/transcriptions?organization_id=123&page=2',
		},
	},
};

export const meeting = {
	id: 'mtg_01k0h4r9s8x7c2dvq3m5n6p4ab',
	object: 'meeting',
	meeting_url: 'https://zoom.us/j/123456789',
	join_at: '2026-07-20T14:00:00Z',
	status: 'queued',
	language: 'en',
	participants: [{ email: 'carmen@example.com', name: 'Carmen' }],
	metadata: { partner_meeting_id: 'meeting-123' },
	settings: { bot_name: 'Acme Notetaker', recording_mode: 'audio_only' },
};

// Shape from the Meeting reference: the transcript uses the json export's
// paragraph-and-word schema.
export const meetingCompleted = {
	...meeting,
	status: 'completed',
	transcription_id: 'e458099e7f8da14f9625854ba7b6a026917ad306',
	transcript: [
		{
			data_start: 0.0,
			data_end: 1.2,
			speaker: 'Carmen',
			words: [
				{
					text: 'Hello',
					type: 'word',
					data_start: 0.0,
					data_end: 0.4,
					confidence: 0.99,
				},
			],
		},
	],
	summary: 'Carmen agreed to send the budget by Friday.',
};

export const summary = {
	summary:
		'Key decisions: Q4 targets approved. Action items: Alice to draft rollout plan.',
};

export const exportCreated = {
	id: '5d5b1a9b4c8c4c0001f3e4a2',
	state: 'pending',
	format: 'txt',
	show_timestamps: false,
	show_speakers: false,
	show_comments: false,
	show_highlights: false,
	transcription_ids: ['9josdjdfo09j309omsldknslkjndfjknsdfs'],
};

export const exportReady = {
	...exportCreated,
	state: 'ready',
	download_link: 'https://media.happyscribe.com/export/abc123.txt',
};

export const translationTask = {
	id: '054fe9f3aa0b446baea730fba688f96c',
	state: 'working',
	failureReason: null,
	progressPercent: null,
	targetLanguage: 'es',
	translatedTranscriptionId: null,
};

export const translationDone = {
	...translationTask,
	state: 'done',
	progressPercent: 100.0,
	translatedTranscriptionId: '372e9530d8f24ba68ccbcce11de43f9d',
};

// Captured from the live API (11-11): the key is snake_case, unlike the
// reference's `signedUrl` example.
export const signedUrl = {
	signed_url:
		'https://media2.happyscribe.com/uploads/ef3e7ce2-7022-441e-ab4a-d8ff09cb6727/my_media.mp3?X-Amz-Signature=xxxxx',
};

export const order = {
	id: '10b1edd9381d4a00a3d0db1ca1b3d0cf',
	folder_id: 1,
	state: 'incomplete',
	operations: [
		{
			name: 'transcription_translation',
			type: 'auto',
			language: 'en-US',
			target_language: 'es',
		},
	],
};

export const glossaries = {
	glossaries: [
		{
			id: 1,
			name: 'Medical Terms',
			source_language: 'en',
			target_languages: ['es', 'fr'],
			organization_default: false,
			imported: true,
			created_at: '2024-01-15T10:30:00.000Z',
			updated_at: '2024-02-01T14:20:00.000Z',
		},
	],
};

// The API answers under `style_guides`; the plugin exposes styleGuides.
export const styleGuides = {
	style_guides: [{ id: 5, name: 'House style', operation: 'transcription' }],
};

// Live shape (11-11): snake_case, and a string id.
export const organizations = {
	organizations: [
		{
			id: 'wks_01m755y521zx980pmgjght4mkk',
			name: 'Acme Corp',
			role: 'owner',
			created_at: '2024-01-15T10:30:00.000Z',
			updated_at: '2024-02-01T14:20:00.000Z',
			owner_email: 'owner@acme.com',
			members_count: 12,
			is_human_transcription_allowed: true,
			is_human_translation_allowed: true,
			email_domains: ['acme.com'],
			idp_company_names: ['Okta'],
			currency: 'usd',
			metadata: {},
		},
	],
};

// Live shape (11-11): snake_case, and organization_id is the string id.
export const memberships = {
	members: [
		{
			id: 9001,
			organization_id: 'wks_01m755y521zx980pmgjght4mkk',
			organization_name: 'Acme Corp',
			email: 'alice@acme.com',
			name: 'Alice Smith',
			role: 'admin',
			created_at: '2024-01-15T10:30:00.000Z',
			updated_at: '2024-01-15T10:30:00.000Z',
		},
	],
};

export const company = {
	id: 1,
	name: 'Acme Corp',
	primaryDomain: 'acme.com',
	domains: ['acme.com', 'acme.co'],
	industry: 'Technology',
	employeeCount: 500,
	foundedYear: 2010,
	shortDescription: 'Project management software.',
	keywords: ['saas'],
	city: 'San Francisco',
	country: 'United States',
	websiteUrl: 'https://acme.com',
	linkedinUrl: 'https://linkedin.com/company/acme-corp',
	logoUrl: 'https://example.com/logo.png',
	totalFunding: null,
	annualRevenue: null,
	latestFundingStage: null,
	createdAt: '2024-01-15T10:00:00Z',
	updatedAt: '2024-06-01T12:00:00Z',
};

export const companyList = {
	results: [company],
	_links: {
		next: {
			url: 'https://www.happyscribe.com/api/v1/companies?organization_id=123&page=2',
		},
	},
};

export const person = {
	id: 1,
	name: 'Jane S.',
	fullName: 'Jane Smith',
	emails: ['jane@acme.com'],
	primaryEmail: 'jane@acme.com',
	company: { id: 1, name: 'Acme Corp', primaryDomain: 'acme.com' },
	jobTitle: null,
	seniority: null,
	headline: null,
	linkedinUrl: null,
	city: null,
	country: null,
	photoUrl: 'https://example.com/photo.png',
	avatarUrl: 'https://example.com/avatar.png',
	enrichedAt: null,
	createdAt: '2024-01-15T10:00:00Z',
	updatedAt: '2024-06-01T12:00:00Z',
};

export const personList = {
	results: [person],
	_links: {},
};

export const rateLimited = { retry_in_seconds: 30, message: 'Slow down!' };
export const badKey = { message: 'Unauthorized' };
export const serverError = { message: 'Something went wrong.' };
export const notFound = { message: 'The requested resource does not exist.' };

export const webhookEvent = {
	id: 'evt_01k0h4x0n7r2c5m8q9v3b6d1ef',
	type: 'meeting.summary_ready',
	created_at: '2026-07-15T14:32:08Z',
	data: {
		object: {
			...meetingCompleted,
			summaryUrl: 'https://media.happyscribe.com/sum',
		},
	},
};
