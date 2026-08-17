import { logEventFromContext } from 'corsair/core';
import type { MailtrapEndpoints } from '../index';
import { auditPayload } from './logging';
import { accountPath, compactQuery, mailtrapCall } from './shared';
import type {
	MailtrapSendingStats,
	MailtrapStatsByCategoryItem,
	MailtrapStatsByDateItem,
	MailtrapStatsByDomainItem,
	MailtrapStatsByEspItem,
	StatsFilterInput,
} from './types';

const IDENTIFIER_KEYS = [
	'start_date',
	'end_date',
	'sending_domain_ids',
	'sending_streams',
	'categories',
	'email_service_providers',
] as const;

function buildQuery(input: StatsFilterInput) {
	return compactQuery({
		start_date: input.start_date,
		end_date: input.end_date,
		sending_domain_ids: input.sending_domain_ids,
		sending_streams: input.sending_streams,
		categories: input.categories,
		email_service_providers: input.email_service_providers,
	});
}

/** Gets aggregated sending stats for a date range. Not persisted — a live view. */
export const get: MailtrapEndpoints['statsGet'] = async (ctx, input) => {
	const path = await accountPath(ctx, '/stats');
	const result = await mailtrapCall<MailtrapSendingStats>(ctx, path, {
		query: buildQuery(input),
	});

	await logEventFromContext(
		ctx,
		'mailtrap.stats.get',
		auditPayload(input, IDENTIFIER_KEYS),
		'completed',
	);
	return result;
};

/** Gets sending stats broken down by day. */
export const byDate: MailtrapEndpoints['statsByDate'] = async (ctx, input) => {
	const path = await accountPath(ctx, '/stats/date');
	const result = await mailtrapCall<MailtrapStatsByDateItem[]>(ctx, path, {
		query: buildQuery(input),
	});

	await logEventFromContext(
		ctx,
		'mailtrap.stats.byDate',
		auditPayload(input, IDENTIFIER_KEYS),
		'completed',
	);
	return result ?? [];
};

/** Gets sending stats broken down by sending domain. */
export const byDomains: MailtrapEndpoints['statsByDomains'] = async (
	ctx,
	input,
) => {
	const path = await accountPath(ctx, '/stats/domains');
	const result = await mailtrapCall<MailtrapStatsByDomainItem[]>(ctx, path, {
		query: buildQuery(input),
	});

	await logEventFromContext(
		ctx,
		'mailtrap.stats.byDomains',
		auditPayload(input, IDENTIFIER_KEYS),
		'completed',
	);
	return result ?? [];
};

/** Gets sending stats broken down by category. */
export const byCategories: MailtrapEndpoints['statsByCategories'] = async (
	ctx,
	input,
) => {
	const path = await accountPath(ctx, '/stats/categories');
	const result = await mailtrapCall<MailtrapStatsByCategoryItem[]>(ctx, path, {
		query: buildQuery(input),
	});

	await logEventFromContext(
		ctx,
		'mailtrap.stats.byCategories',
		auditPayload(input, IDENTIFIER_KEYS),
		'completed',
	);
	return result ?? [];
};

/** Gets sending stats broken down by recipient email service provider. */
export const byEsp: MailtrapEndpoints['statsByEsp'] = async (ctx, input) => {
	const path = await accountPath(ctx, '/stats/email_service_providers');
	const result = await mailtrapCall<MailtrapStatsByEspItem[]>(ctx, path, {
		query: buildQuery(input),
	});

	await logEventFromContext(
		ctx,
		'mailtrap.stats.byEsp',
		auditPayload(input, IDENTIFIER_KEYS),
		'completed',
	);
	return result ?? [];
};
