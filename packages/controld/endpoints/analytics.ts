import { makeControlDRequest } from '../client';
import type { ControlDContext } from '../index';

export async function listAnalytics(
	ctx: ControlDContext,
	input: { profile_id: string },
): Promise<unknown> {
	return makeControlDRequest(`/analytics`, ctx.key, {
		method: 'GET',
		query: { profile_id: input.profile_id },
	});
}
export async function exportAnalytics(
	ctx: ControlDContext,
	input: { profile_id: string },
): Promise<unknown> {
	return makeControlDRequest(`/analytics/export`, ctx.key, {
		method: 'GET',
		query: { profile_id: input.profile_id },
	});
}
export async function getAnalyticsSummary(
	ctx: ControlDContext,
	input: { profile_id: string },
): Promise<unknown> {
	return makeControlDRequest(`/analytics/summary`, ctx.key, {
		method: 'GET',
		query: { profile_id: input.profile_id },
	});
}
export async function getAnalyticsTopDomains(
	ctx: ControlDContext,
	input: { profile_id: string },
): Promise<unknown> {
	return makeControlDRequest(`/analytics/top-domains`, ctx.key, {
		method: 'GET',
		query: { profile_id: input.profile_id },
	});
}
export async function getAnalyticsStatus(
	ctx: ControlDContext,
	input: { profile_id: string },
): Promise<unknown> {
	return makeControlDRequest(`/analytics/status`, ctx.key, {
		method: 'GET',
		query: { profile_id: input.profile_id },
	});
}
