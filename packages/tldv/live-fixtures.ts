/**
 * Responses captured from the live tl;dv API on 2026-11-10, trimmed.
 *
 * One meeting imported through `meetings.import` from a public speech sample
 * (the Open Speech Repository's Harvard sentences), then read back. The ids
 * are the real ones tl;dv issued; the organizer is replaced with an example
 * identity, and long text is cut short.
 */

const organizer = { name: 'Jordan Example', email: 'jordan@example.org' };

/** `GET /v1alpha1/meetings`: note the `happenedAt` format. */
export const liveMeetingsListResponse = {
	page: 1,
	pageSize: 10,
	pages: 1,
	total: 1,
	results: [
		{
			id: '6af36b44ad53e60013a6b837',
			name: 'corsair-plugin-test',
			happenedAt:
				'Tue Nov 10 2026 19:06:44 GMT+0000 (Coordinated Universal Time)',
			duration: 33.623125,
			invitees: [],
			organizer,
			url: 'https://tldv.io/app/meetings/6af36b44ad53e60013a6b837',
			extraProperties: {
				conferenceId: 'imjh-537a2494-a4db-413a-b092-8940cf84fecc',
			},
		},
	],
};

/** `GET /v1alpha1/meetings/{id}` for the same meeting. */
export const liveMeetingDetail = {
	id: '6af36b44ad53e60013a6b837',
	happenedAt: '2026-11-10T19:06:44.009Z',
	invitees: [],
	name: 'corsair-plugin-test',
	duration: 33.623125,
	organizer,
	url: 'https://tldv.io/app/meetings/6af36b44ad53e60013a6b837',
	template: { id: 'ai-topics', label: 'Smart topics' },
	extraProperties: {
		conferenceId: 'imjh-537a2494-a4db-413a-b092-8940cf84fecc',
	},
	phoneNumber: null,
	metadata: { source: 'corsair-plugin-test', run: 1 },
};

/** `GET /v1alpha1/meetings/{id}/transcript`. */
export const liveTranscriptResponse = {
	id: '6af36b454f203a001337128a',
	meetingId: '6af36b44ad53e60013a6b837',
	data: [
		{
			startTime: 1,
			endTime: 32,
			speaker: 'Speaker 00',
			text: 'The birch canoe slid on the smooth planks. Glue the sheet to the dark blue background.',
		},
	],
};

/** `GET /v1alpha1/meetings/{id}/notes`: topic summaries came back empty. */
export const liveNotesResponse = {
	structuredNotes: [
		{
			segmentId: '6af36b607103600013272c1a',
			timestamp: 1,
			text: 'A birch canoe slid on the smooth planks',
			topicId: '6af36b607103600013272c14',
		},
		{
			segmentId: '6af36b607103600013272c1b',
			timestamp: 4,
			text: 'The sheet should be glued to the dark blue background',
			topicId: '6af36b607103600013272c14',
		},
	],
	markdownContent:
		'## 1. Food and dining\n\n- Chicken legs are described as a rare dish these days. [00:10](/app/meetings/6af36b44ad53e60013a6b837?t=10)',
	topics: [
		{
			id: '6af36b607103600013272c13',
			order: 1,
			title: 'Food and dining',
			summary: '',
		},
		{
			id: '6af36b607103600013272c14',
			order: 2,
			title: 'Objects and physical tasks',
			summary: '',
		},
	],
};

/** `POST /v1alpha1/meetings/import`. */
export const liveImportResponse = {
	success: true,
	jobId: 'imjh-537a2494-a4db-413a-b092-8940cf84fecc',
	message: 'Your recording has been queued to be processed',
};

/** A 400 from `GET /v1alpha1/meetings?meetingType=bogus`: it has a `name` too. */
export const liveValidationErrorBody = {
	name: 'BadRequestError',
	message: "Invalid queries, check 'errors' property for more info.",
	errors: [
		{
			target: { page: 1, limit: 50, meetingType: 'bogus' },
			value: 'bogus',
			property: 'meetingType',
			children: [],
			constraints: {
				isEnum: 'meetingType must be one of the following values: ',
			},
		},
	],
	paramName: '',
};
