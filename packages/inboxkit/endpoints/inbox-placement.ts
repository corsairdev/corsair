import type { InboxkitEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';

export const createTest: InboxkitEndpoints['inboxPlacementCreateTest'] = (
	ctx,
	input,
) =>
	call(ctx, 'inboxPlacementCreateTest', input, (body) => ({
		method: 'POST',
		path: '/v1/api/inbox-placement/tests',
		body,
	}));

export const listTests: InboxkitEndpoints['inboxPlacementListTests'] = (
	ctx,
	input,
) =>
	call(ctx, 'inboxPlacementListTests', input, (query) => ({
		method: 'GET',
		path: '/v1/api/inbox-placement/tests',
		query,
	}));

export const getTest: InboxkitEndpoints['inboxPlacementGetTest'] = (
	ctx,
	input,
) =>
	call(ctx, 'inboxPlacementGetTest', input, ({ testCode }) => ({
		method: 'GET',
		path: `/v1/api/inbox-placement/tests/${segment(testCode)}`,
	}));

export const listScheduled: InboxkitEndpoints['inboxPlacementListScheduled'] = (
	ctx,
	input,
) =>
	call(ctx, 'inboxPlacementListScheduled', input, () => ({
		method: 'GET',
		path: '/v1/api/inbox-placement/scheduled',
	}));

export const getScheduled: InboxkitEndpoints['inboxPlacementGetScheduled'] = (
	ctx,
	input,
) =>
	call(ctx, 'inboxPlacementGetScheduled', input, ({ id }) => ({
		method: 'GET',
		path: `/v1/api/inbox-placement/scheduled/${segment(id)}`,
	}));

export const pauseScheduled: InboxkitEndpoints['inboxPlacementPauseScheduled'] =
	(ctx, input) =>
		call(ctx, 'inboxPlacementPauseScheduled', input, ({ id }) => ({
			method: 'POST',
			path: `/v1/api/inbox-placement/scheduled/${segment(id)}/pause`,
		}));

export const resumeScheduled: InboxkitEndpoints['inboxPlacementResumeScheduled'] =
	(ctx, input) =>
		call(ctx, 'inboxPlacementResumeScheduled', input, ({ id }) => ({
			method: 'POST',
			path: `/v1/api/inbox-placement/scheduled/${segment(id)}/resume`,
		}));

export const deleteScheduled: InboxkitEndpoints['inboxPlacementDeleteScheduled'] =
	(ctx, input) =>
		call(ctx, 'inboxPlacementDeleteScheduled', input, ({ id }) => ({
			method: 'DELETE',
			path: `/v1/api/inbox-placement/scheduled/${segment(id)}`,
		}));
