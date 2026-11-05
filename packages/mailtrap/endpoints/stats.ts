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

/**
 * Confirmed live 2026-08-17: the shared query serializer emits repeated
 * bare keys for an array (`sending_domain_ids=1&sending_domain_ids=2`), but
 * Mailtrap only parses the bracket-suffixed Rails form. A bogus domain id
 * sent bracketed 400s with "Sending domain does not exist" — proof the
 * server validated it as an array member — while the same bogus id sent
 * bare returned 200 with an empty result, silently ignored rather than
 * applied. Suffixing the key here (rather than changing the shared
 * serializer, which every other plugin also relies on) makes the existing
 * repeated-key logic emit `sending_domain_ids[]=1&sending_domain_ids[]=2`.
 */
function buildQuery(input: StatsFilterInput) {
	return compactQuery({
		start_date: input.start_date,
		end_date: input.end_date,
		'sending_domain_ids[]': input.sending_domain_ids,
		'sending_streams[]': input.sending_streams,
		'categories[]': input.categories,
		'email_service_providers[]': input.email_service_providers,
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
