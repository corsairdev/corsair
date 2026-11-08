jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn().mockResolvedValue('evt') };
});

import {
	foldersListResponse,
	importResponse,
	meetingDetail,
	meetingsListResponse,
	notesResponse,
	transcriptResponse,
} from './test-fixtures';
import {
	BASE,
	endpoints,
	installFetchMock,
	jsonResponse,
	lastCall,
	makeCtx,
	mockFetch,
	restoreFetchMock,
	sentBody,
	sentHeader,
} from './test-helpers';

beforeEach(installFetchMock);
afterEach(restoreFetchMock);

describe('tl;dv request shapes', () => {
	it('sends the key in x-api-key and a User-Agent', async () => {
		mockFetch(jsonResponse(meetingsListResponse));

		await endpoints.meetings.list(makeCtx(), {});

		expect(sentHeader('x-api-key')).toBe('test-key');
		// A default library agent is blocked with a Cloudflare 403 before the key
		// is read, so this header is load-bearing.
		expect(sentHeader('User-Agent')).toBe('Corsair-tldv-integration/1.0');
	});

	it('hits pasta.tldv.io, not api.tldv.io', async () => {
		mockFetch(jsonResponse(meetingsListResponse));

		await endpoints.meetings.list(makeCtx(), {});

		expect(lastCall().url).toBe(`${BASE}/v1alpha1/meetings`);
		expect(lastCall().url).not.toContain('api.tldv.io');
	});

	it('lists meetings with no query when no filter is set', async () => {
		mockFetch(jsonResponse(meetingsListResponse));

		await endpoints.meetings.list(makeCtx(), {});

		expect(lastCall().url).toBe(`${BASE}/v1alpha1/meetings`);
		expect(lastCall().init.method).toBe('GET');
	});

	it('passes every list filter through', async () => {
		mockFetch(jsonResponse(meetingsListResponse));

		await endpoints.meetings.list(makeCtx(), {
			query: 'renewal',
			page: 2,
			limit: 10,
			from: '2024-01-01',
			to: '2024-02-01',
			onlyParticipated: true,
			meetingType: 'external',
			folderIds: ['f1', 'f2'],
			folderIdsOp: 'and',
		});

		const url = new URL(lastCall().url);
		expect(url.searchParams.get('query')).toBe('renewal');
		expect(url.searchParams.get('page')).toBe('2');
		expect(url.searchParams.get('limit')).toBe('10');
		expect(url.searchParams.get('from')).toBe('2024-01-01');
		expect(url.searchParams.get('to')).toBe('2024-02-01');
		expect(url.searchParams.get('onlyParticipated')).toBe('true');
		expect(url.searchParams.get('meetingType')).toBe('external');
		// Repeated or comma-separated are both documented; commas are one param.
		expect(url.searchParams.get('folderIds')).toBe('f1,f2');
		expect(url.searchParams.get('folderIdsOp')).toBe('and');
	});

	it('omits filters left undefined rather than sending empty values', async () => {
		mockFetch(jsonResponse(meetingsListResponse));

		await endpoints.meetings.list(makeCtx(), { limit: 5 });

		const url = new URL(lastCall().url);
		expect(url.searchParams.get('limit')).toBe('5');
		// An empty meetingType is a 400 listing every allowed value.
		expect(url.searchParams.has('meetingType')).toBe(false);
		expect(url.searchParams.has('query')).toBe(false);
	});

	it('reads one meeting by id', async () => {
		mockFetch(jsonResponse(meetingDetail));

		await endpoints.meetings.get(makeCtx(), { meetingId: 'meeting-123' });

		expect(lastCall().url).toBe(`${BASE}/v1alpha1/meetings/meeting-123`);
	});

	it('encodes a meeting id used in the path', async () => {
		mockFetch(jsonResponse(meetingDetail));

		await endpoints.meetings.get(makeCtx(), { meetingId: 'a/b c' });

		expect(lastCall().url).toBe(`${BASE}/v1alpha1/meetings/a%2Fb%20c`);
	});

	it('reads a transcript', async () => {
		mockFetch(jsonResponse(transcriptResponse));

		await endpoints.meetings.transcript(makeCtx(), {
			meetingId: 'meeting-123',
		});

		expect(lastCall().url).toBe(
			`${BASE}/v1alpha1/meetings/meeting-123/transcript`,
		);
	});

	it('reads notes', async () => {
		mockFetch(jsonResponse(notesResponse));

		await endpoints.meetings.notes(makeCtx(), { meetingId: 'meeting-123' });

		expect(lastCall().url).toBe(`${BASE}/v1alpha1/meetings/meeting-123/notes`);
	});

	it('imports a meeting with only the required url', async () => {
		mockFetch(jsonResponse(importResponse));

		await endpoints.meetings.import(makeCtx(), {
			url: 'https://example.org/call.mp4',
		});

		expect(lastCall().url).toBe(`${BASE}/v1alpha1/meetings/import`);
		expect(lastCall().init.method).toBe('POST');
		expect(sentBody()).toEqual({ url: 'https://example.org/call.mp4' });
	});

	it('imports a meeting with every optional field', async () => {
		mockFetch(jsonResponse(importResponse));

		await endpoints.meetings.import(makeCtx(), {
			url: 'https://example.org/call.mp4',
			name: 'Discovery call',
			happenedAt: '2024-01-15T10:00:00.000Z',
			participants: ['jordan@example.org'],
			phoneNumber: '+1 555 010 0100',
			metadata: { crmRecordId: 'rec_123' },
		});

		expect(sentBody()).toEqual({
			url: 'https://example.org/call.mp4',
			name: 'Discovery call',
			happenedAt: '2024-01-15T10:00:00.000Z',
			participants: ['jordan@example.org'],
			phoneNumber: '+1 555 010 0100',
			metadata: { crmRecordId: 'rec_123' },
		});
	});

	it('lists folders with a meetingIds filter', async () => {
		mockFetch(jsonResponse(foldersListResponse));

		await endpoints.folders.list(makeCtx(), {
			query: 'renewals',
			meetingIds: ['m1'],
			space: 'team',
		});

		const url = new URL(lastCall().url);
		expect(url.pathname).toBe('/v1alpha1/folders');
		expect(url.searchParams.get('query')).toBe('renewals');
		expect(url.searchParams.get('meetingIds')).toBe('m1');
		expect(url.searchParams.get('space')).toBe('team');
	});
});
