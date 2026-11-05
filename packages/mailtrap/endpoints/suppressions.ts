import { logEventFromContext } from 'corsair/core';
import type { MailtrapEndpoints } from '../index';
import { auditPayload } from './logging';
import { accountPath, compactQuery, mailtrapCall } from './shared';
import type { MailtrapSuppression } from './types';

/**
 * Lists (and optionally searches by email) the addresses Mailtrap has
 * suppressed from sending — hard bounces, spam complaints, unsubscribes and
 * manual imports. Not persisted: a live view over a list that changes with
 * every bounce/complaint, not a slow-changing reference record.
 */
export const list: MailtrapEndpoints['suppressionsList'] = async (
	ctx,
	input,
) => {
	const path = await accountPath(ctx, '/suppressions');
	const result = await mailtrapCall<MailtrapSuppression[]>(ctx, path, {
		query: compactQuery({ email: input.email }),
	});

	await logEventFromContext(
		ctx,
		'mailtrap.suppressions.list',
		// The searched email is personal data; only the field name goes to
		// the event log, same treatment as `contacts.create`.
		auditPayload(input, []),
		'completed',
	);
	return result ?? [];
};
