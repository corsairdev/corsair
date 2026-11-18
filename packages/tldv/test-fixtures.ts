/**
 * Fixtures whose SHAPES match the tl;dv OpenAPI spec at https://doc.tldv.io.
 *
 * Every identifier is synthetic. Unlike a probed build, these come from the
 * published spec rather than live responses, because API access requires a
 * paid tl;dv plan and no live smoke run was made. Fields the spec marks
 * required are present; optional ones appear where the spec's own examples
 * show them.
 */

export const user = { name: 'Jordan Example', email: 'jordan@example.org' };

export const meeting = {
	id: 'meeting-123',
	name: 'Discovery call',
	happenedAt: '2024-01-15T10:00:00Z',
	url: 'https://tldv.io/app/meetings/meeting-123',
	duration: 1800,
	organizer: user,
	invitees: [user, { name: 'Sam Example', email: 'sam@example.org' }],
	template: { id: 'template-1', label: 'Discovery' },
	extraProperties: { conferenceId: 'conf-123' },
};

/** A single-meeting read adds these two; the list endpoint omits them. */
export const meetingDetail = {
	...meeting,
	phoneNumber: '+1 555 010 0100',
	metadata: { crmRecordId: 'rec_123', callId: 'call_456' },
};

export const meetingsListResponse = {
	page: 1,
	pages: 2,
	total: 12,
	pageSize: 10,
	results: [meeting],
};

export const transcriptResponse = {
	id: 'transcript-1',
	meetingId: 'meeting-123',
	data: [
		{
			speaker: 'Jordan Example',
			text: 'Hello everyone, welcome to the call.',
			startTime: 0,
			endTime: 5,
		},
		{
			speaker: 'Sam Example',
			text: 'Thanks for having me.',
			startTime: 5,
			endTime: 8,
		},
	],
};

export const notesResponse = {
	structuredNotes: [
		{
			segmentId: 'segment-1',
			timestamp: 42,
			text: 'The customer wants a Q3 rollout.',
			topicId: 'topic-1',
		},
	],
	markdownContent: '## Summary\n- Discussed the Q3 rollout.',
	topics: [
		{
			id: 'topic-1',
			order: 0,
			title: 'Rollout timing',
			summary: 'The customer prefers Q3.',
		},
	],
};

export const foldersListResponse = {
	page: 1,
	pages: 1,
	total: 1,
	pageSize: 50,
	results: [
		{ id: 'folder-1', name: 'Q3 renewals', meetingIds: ['meeting-123'] },
	],
};

export const importResponse = {
	success: true,
	jobId: 'job-789',
	message: 'Import job created',
};

/** A MeetingReady delivery, taken from the spec's own example. */
export const meetingReadyEvent = {
	id: 'webhook-123',
	event: 'MeetingReady',
	data: {
		...meeting,
		notes: {
			markdownContent: '## Summary\n- Discussed progress and blockers',
			structuredNotes: [
				{
					segmentId: 'segment-1',
					timestamp: 30,
					text: 'Blocked on the API keys.',
					topicId: 'topic-1',
				},
			],
			topics: [
				{
					id: 'topic-1',
					order: 0,
					title: 'Blockers',
					summary: 'One blocker was raised.',
				},
			],
		},
		transcript: transcriptResponse,
	},
	executedAt: '2024-01-15T11:00:00Z',
};

/** The same delivery with `include.transcript` off: the key is absent. */
export const meetingReadyWithoutTranscript = (() => {
	const { transcript: _t, ...data } = meetingReadyEvent.data;
	return { ...meetingReadyEvent, data };
})();

/** `null` when the subscription asked for a transcript but none exists yet. */
export const meetingReadyNullTranscript = {
	...meetingReadyEvent,
	data: { ...meetingReadyEvent.data, transcript: null },
};

export const transcriptReadyEvent = {
	id: 'webhook-456',
	event: 'TranscriptReady',
	data: transcriptResponse,
	executedAt: '2024-01-15T11:05:00Z',
};

/** A 400 validation body, which has its own shape. */
export const validationErrorBody = {
	message: "Invalid queries, check 'errors' property for more info.",
	errors: [
		{
			property: 'meetingType',
			constraints: {
				isEnum:
					'meetingType must be one of the following values: internal, external',
			},
		},
	],
};

/** Every other status uses `{ name, message }`. */
export const basicErrorBody = {
	name: 'AuthorizationRequiredError',
	message: 'Authorization is required for request on GET /v1alpha1/meetings',
};
