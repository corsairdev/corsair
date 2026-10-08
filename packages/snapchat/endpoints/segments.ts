import { createEndpoint } from './factory';

// ─── Audience Segments ────────────────────────────────────────────────────────
export const listSegmentsEndpoint = createEndpoint('listSegments', {
	path: (input) => `/adaccounts/${String(input.ad_account_id)}/segments`,
});

export const getSegmentEndpoint = createEndpoint('getSegment', {
	path: (input) => `/segments/${String(input.segment_id)}`,
});

export const createSegmentEndpoint = createEndpoint('createSegment', {
	method: 'POST',
	path: (input) => `/adaccounts/${String(input.ad_account_id)}/segments`,
	body: (input) => ({ segments: input.segments }),
});

export const updateSegmentEndpoint = createEndpoint('updateSegment', {
	method: 'PUT',
	path: (input) => `/adaccounts/${String(input.ad_account_id)}/segments`,
	body: (input) => ({ segments: input.segments }),
});

export const deleteSegmentEndpoint = createEndpoint('deleteSegment', {
	method: 'DELETE',
	path: (input) => `/segments/${String(input.segment_id)}`,
	body: () => undefined,
});

// ─── Segment Users ────────────────────────────────────────────────────────────
export const addSegmentUsersEndpoint = createEndpoint('addSegmentUsers', {
	method: 'POST',
	path: (input) => `/segments/${String(input.segment_id)}/users`,
	body: (input) => ({ users: input.users }),
});

export const deleteSegmentUsersEndpoint = createEndpoint('deleteSegmentUsers', {
	method: 'DELETE',
	path: (input) => `/segments/${String(input.segment_id)}/users`,
	body: (input) => ({ users: input.users }),
});

export const deleteAllSegmentUsersEndpoint = createEndpoint(
	'deleteAllSegmentUsers',
	{
		method: 'DELETE',
		path: (input) => `/segments/${String(input.segment_id)}/all_users`,
		body: () => undefined,
	},
);
