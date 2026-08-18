import { logEventFromContext } from 'corsair/core';
import type { MailtrapEndpoints } from '../index';
import { auditPayload } from './logging';
import { cacheSendingDomain, evictEntity } from './persist';
import { accountPath, mailtrapCall } from './shared';
import type { MailtrapSendingDomain } from './types';

/**
 * Lists sending domains.
 *
 * Confirmed live to be wrapped under `data` — unlike the contact list/field
 * resources, and unlike this same resource's own create/get/delete
 * responses, which are raw objects. Mailtrap's envelope conventions are
 * genuinely inconsistent per resource and per verb; each was verified live
 * rather than assumed from a pattern.
 */
export const list: MailtrapEndpoints['sendingDomainsList'] = async (ctx) => {
	const path = await accountPath(ctx, '/sending_domains');
	const result = await mailtrapCall<{ data: MailtrapSendingDomain[] }>(
		ctx,
		path,
	);

	await Promise.all(
		(result.data ?? []).map((domain) =>
			cacheSendingDomain(ctx.db?.sendingDomains, domain),
		),
	);

	await logEventFromContext(
		ctx,
		'mailtrap.sendingDomains.list',
		{},
		'completed',
	);
	return result.data ?? [];
};

/**
 * Registers a sending domain for DNS verification.
 *
 * Wrapped under a top-level `sending_domain` key — confirmed live. The
 * response is the raw domain object, not wrapped under `data` (unlike the
 * list response above).
 */
export const create: MailtrapEndpoints['sendingDomainsCreate'] = async (
	ctx,
	input,
) => {
	const path = await accountPath(ctx, '/sending_domains');
	const result = await mailtrapCall<MailtrapSendingDomain>(ctx, path, {
		method: 'POST',
		body: { sending_domain: { domain_name: input.domain_name } },
	});

	await cacheSendingDomain(ctx.db?.sendingDomains, result);

	await logEventFromContext(
		ctx,
		'mailtrap.sendingDomains.create',
		auditPayload(input, ['domain_name']),
		'completed',
	);
	return result;
};

/** Gets a sending domain by id, including its DNS verification records. */
export const get: MailtrapEndpoints['sendingDomainsGet'] = async (
	ctx,
	input,
) => {
	const path = await accountPath(ctx, `/sending_domains/${input.domain_id}`);
	const result = await mailtrapCall<MailtrapSendingDomain>(ctx, path);

	await cacheSendingDomain(ctx.db?.sendingDomains, result);

	await logEventFromContext(
		ctx,
		'mailtrap.sendingDomains.get',
		auditPayload(input, ['domain_id']),
		'completed',
	);
	return result;
};

/** Permanently removes a sending domain. [DESTRUCTIVE] */
export const remove: MailtrapEndpoints['sendingDomainsDelete'] = async (
	ctx,
	input,
) => {
	const path = await accountPath(ctx, `/sending_domains/${input.domain_id}`);
	await mailtrapCall(ctx, path, { method: 'DELETE' });

	await logEventFromContext(
		ctx,
		'mailtrap.sendingDomains.delete',
		auditPayload(input, ['domain_id']),
		'completed',
	);

	await evictEntity(
		ctx.db?.sendingDomains,
		String(input.domain_id),
		'sending domain',
	);

	return {};
};
