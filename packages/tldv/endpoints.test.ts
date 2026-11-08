jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn().mockResolvedValue('evt') };
});

import {
	basicErrorBody,
	foldersListResponse,
	importResponse,
	meetingDetail,
	meetingsListResponse,
	notesResponse,
	transcriptResponse,
	validationErrorBody,
} from './test-fixtures';
import {
	endpoints,
	installFetchMock,
	jsonResponse,
	makeCtx,
	mockFetch,
	restoreFetchMock,
} from './test-helpers';

beforeEach(installFetchMock);
afterEach(restoreFetchMock);

describe('tl;dv output parsing', () => {
	it('parses a meeting page with its pagination', async () => {
		mockFetch(jsonResponse(meetingsListResponse));

		const result = await endpoints.meetings.list(makeCtx(), {});

		expect(result.total).toBe(12);
		expect(result.page).toBe(1);
		expect(result.results).toHaveLength(1);
		expect(result.results[0]!.duration).toBe(1800);
	});

	it('keeps duration numeric and happenedAt a string', async () => {
		mockFetch(jsonResponse(meetingDetail));

		const result = await endpoints.meetings.get(makeCtx(), {
			meetingId: 'meeting-123',
		});

		// The docs put duration in seconds and happenedAt in ISO 8601.
		expect(typeof result.duration).toBe('number');
		expect(typeof result.happenedAt).toBe('string');
	});

	it('parses the detail-only fields', async () => {
		mockFetch(jsonResponse(meetingDetail));

		const result = await endpoints.meetings.get(makeCtx(), {
			meetingId: 'meeting-123',
		});

		expect(result.phoneNumber).toBe('+1 555 010 0100');
		expect(result.metadata).toEqual({
			crmRecordId: 'rec_123',
			callId: 'call_456',
		});
	});

	it('parses a transcript as sentences with second offsets', async () => {
		mockFetch(jsonResponse(transcriptResponse));

		const result = await endpoints.meetings.transcript(makeCtx(), {
			meetingId: 'meeting-123',
		});

		expect(result.data).toHaveLength(2);
		expect(result.data[1]!.speaker).toBe('Sam Example');
		expect(result.data[1]!.startTime).toBe(5);
	});

	it('parses notes with topics', async () => {
		mockFetch(jsonResponse(notesResponse));

		const result = await endpoints.meetings.notes(makeCtx(), {
			meetingId: 'meeting-123',
		});

		expect(result.structuredNotes[0]!.topicId).toBe('topic-1');
		expect(result.topics[0]!.title).toBe('Rollout timing');
		expect(result.markdownContent).toContain('## Summary');
	});

	it('parses an import job', async () => {
		mockFetch(jsonResponse(importResponse));

		const result = await endpoints.meetings.import(makeCtx(), {
			url: 'https://example.org/call.mp4',
		});

		expect(result.success).toBe(true);
		expect(result.jobId).toBe('job-789');
	});

	it('parses folders with their meeting ids', async () => {
		mockFetch(jsonResponse(foldersListResponse));

		const result = await endpoints.folders.list(makeCtx(), {});

		expect(result.results[0]!.meetingIds).toEqual(['meeting-123']);
	});

	it('accepts a meeting whose template is null', async () => {
		mockFetch(jsonResponse({ ...meetingDetail, template: null }));

		const result = await endpoints.meetings.get(makeCtx(), {
			meetingId: 'meeting-123',
		});

		expect(result.template).toBeNull();
	});
});

describe('tl;dv shape rejections', () => {
	it('rejects a page with no results array', async () => {
		mockFetch(jsonResponse({ page: 1, pages: 1, total: 0, pageSize: 10 }));

		await expect(endpoints.meetings.list(makeCtx(), {})).rejects.toThrow();
	});

	it('rejects a meeting with a non-numeric duration', async () => {
		mockFetch(jsonResponse({ ...meetingDetail, duration: '1800' }));

		await expect(
			endpoints.meetings.get(makeCtx(), { meetingId: 'm1' }),
		).rejects.toThrow();
	});

	it('rejects an organizer that is a string, not an object', async () => {
		mockFetch(jsonResponse({ ...meetingDetail, organizer: 'jordan@x.org' }));

		await expect(
			endpoints.meetings.get(makeCtx(), { meetingId: 'm1' }),
		).rejects.toThrow();
	});

	it('rejects a transcript sentence with a missing speaker', async () => {
		mockFetch(
			jsonResponse({
				id: 't1',
				meetingId: 'm1',
				data: [{ text: 'hi', startTime: 0, endTime: 1 }],
			}),
		);

		await expect(
			endpoints.meetings.transcript(makeCtx(), { meetingId: 'm1' }),
		).rejects.toThrow();
	});

	it('rejects notes with no structuredNotes array', async () => {
		mockFetch(jsonResponse({ markdownContent: 'x', topics: [] }));

		await expect(
			endpoints.meetings.notes(makeCtx(), { meetingId: 'm1' }),
		).rejects.toThrow();
	});

	it('surfaces a 400 validation error with the constraint', async () => {
		mockFetch(jsonResponse(validationErrorBody, { status: 400 }));

		await expect(
			endpoints.meetings.list(makeCtx(), { meetingType: 'external' }),
		).rejects.toThrow(/isEnum|meetingType must be one of/);
	});

	it('surfaces a 401 with the name and message', async () => {
		mockFetch(jsonResponse(basicErrorBody, { status: 401 }));

		await expect(endpoints.meetings.list(makeCtx(), {})).rejects.toThrow(
			/AuthorizationRequiredError/,
		);
	});
});
