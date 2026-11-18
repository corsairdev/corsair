import type { InstantlyEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import { toInstantlyTimezone } from './timezones';
import type { InstantlyParsedInputs } from './types';

type TestSchedule =
	InstantlyParsedInputs['inboxPlacementTestsCreate']['schedule'];

// Aliases such as America/New_York are sent as Instantly's listed zone.
function withListedTimezone(schedule: TestSchedule): TestSchedule {
	return schedule?.timezone
		? { ...schedule, timezone: toInstantlyTimezone(schedule.timezone) }
		: schedule;
}

export const createTest: InstantlyEndpoints['inboxPlacementTestsCreate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'inboxPlacementTestsCreate',
		'inboxPlacementTests.create',
		input,
		({ schedule, ...body }) => ({
			method: 'POST',
			path: '/inbox-placement-tests',
			body: { ...body, schedule: withListedTimezone(schedule) },
		}),
		{},
	);

export const listTests: InstantlyEndpoints['inboxPlacementTestsList'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'inboxPlacementTestsList',
		'inboxPlacementTests.list',
		input,
		(query) => ({ method: 'GET', path: '/inbox-placement-tests', query }),
		{ log: (_, result) => ({ count: result.items.length }) },
	);

export const getTest: InstantlyEndpoints['inboxPlacementTestsGet'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'inboxPlacementTestsGet',
		'inboxPlacementTests.get',
		input,
		({ id, ...query }) => ({
			method: 'GET',
			path: `/inbox-placement-tests/${segment(id)}`,
			query,
		}),
		{ log: ({ id }) => ({ id }) },
	);

export const updateTest: InstantlyEndpoints['inboxPlacementTestsUpdate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'inboxPlacementTestsUpdate',
		'inboxPlacementTests.update',
		input,
		({ id, schedule, ...body }) => ({
			method: 'PATCH',
			path: `/inbox-placement-tests/${segment(id)}`,
			body: { ...body, schedule: withListedTimezone(schedule) },
		}),
		{ log: ({ id }) => ({ id }) },
	);

export const deleteTest: InstantlyEndpoints['inboxPlacementTestsDelete'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'inboxPlacementTestsDelete',
		'inboxPlacementTests.delete',
		input,
		({ id }) => ({
			method: 'DELETE',
			path: `/inbox-placement-tests/${segment(id)}`,
		}),
		{ log: ({ id }) => ({ id }) },
	);

export const listEspOptions: InstantlyEndpoints['inboxPlacementTestsListEspOptions'] =
	(ctx, input) =>
		call(
			ctx,
			'inboxPlacementTestsListEspOptions',
			'inboxPlacementTests.listEspOptions',
			input,
			() => ({
				method: 'GET',
				path: '/inbox-placement-tests/email-service-provider-options',
			}),
			{ log: (_, result) => ({ count: result.length }) },
		);

export const listAnalytics: InstantlyEndpoints['inboxPlacementAnalyticsList'] =
	(ctx, input) =>
		call(
			ctx,
			'inboxPlacementAnalyticsList',
			'inboxPlacementAnalytics.list',
			input,
			(query) => ({ method: 'GET', path: '/inbox-placement-analytics', query }),
			{ log: (_, result) => ({ count: result.items.length }) },
		);

export const getAnalytics: InstantlyEndpoints['inboxPlacementAnalyticsGet'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'inboxPlacementAnalyticsGet',
		'inboxPlacementAnalytics.get',
		input,
		({ id }) => ({
			method: 'GET',
			path: `/inbox-placement-analytics/${segment(id)}`,
		}),
		{ log: ({ id }) => ({ id }) },
	);

export const getStatsByTest: InstantlyEndpoints['inboxPlacementAnalyticsGetStatsByTest'] =
	(ctx, input) =>
		call(
			ctx,
			'inboxPlacementAnalyticsGetStatsByTest',
			'inboxPlacementAnalytics.getStatsByTest',
			input,
			(body) => ({
				method: 'POST',
				path: '/inbox-placement-analytics/stats-by-test-id',
				body,
			}),
			{ log: (_, result) => ({ count: result.length }) },
		);

export const getDeliverabilityInsights: InstantlyEndpoints['inboxPlacementAnalyticsGetDeliverabilityInsights'] =
	(ctx, input) =>
		call(
			ctx,
			'inboxPlacementAnalyticsGetDeliverabilityInsights',
			'inboxPlacementAnalytics.getDeliverabilityInsights',
			input,
			(body) => ({
				method: 'POST',
				path: '/inbox-placement-analytics/deliverability-insights',
				body,
			}),
			{ log: (_, result) => ({ count: result.length }) },
		);

export const getStatsByDate: InstantlyEndpoints['inboxPlacementAnalyticsGetStatsByDate'] =
	(ctx, input) =>
		call(
			ctx,
			'inboxPlacementAnalyticsGetStatsByDate',
			'inboxPlacementAnalytics.getStatsByDate',
			input,
			(body) => ({
				method: 'POST',
				path: '/inbox-placement-analytics/stats-by-date',
				body,
			}),
			{ log: (_, result) => ({ count: result.length }) },
		);

export const listReports: InstantlyEndpoints['inboxPlacementReportsList'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'inboxPlacementReportsList',
		'inboxPlacementReports.list',
		input,
		(query) => ({ method: 'GET', path: '/inbox-placement-reports', query }),
		{ log: (_, result) => ({ count: result.items.length }) },
	);

export const getReport: InstantlyEndpoints['inboxPlacementReportsGet'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'inboxPlacementReportsGet',
		'inboxPlacementReports.get',
		input,
		({ id }) => ({
			method: 'GET',
			path: `/inbox-placement-reports/${segment(id)}`,
		}),
		{ log: ({ id }) => ({ id }) },
	);
