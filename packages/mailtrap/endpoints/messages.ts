import { logEventFromContext } from 'corsair/core';
import type { MailtrapEndpoints } from '../index';
import { auditPayload } from './logging';
import { accountPath, compactQuery, mailtrapCall } from './shared';
import type { MailtrapMessage } from './types';

/**
 * Lists messages in a sandbox inbox. Not persisted — a live, continuously
 * appended stream, same rationale as Botpress's conversations/messages.
 */
export const list: MailtrapEndpoints['messagesList'] = async (ctx, input) => {
	const path = await accountPath(ctx, `/inboxes/${input.inbox_id}/messages`);
	const result = await mailtrapCall<MailtrapMessage[]>(ctx, path, {
		query: compactQuery({
			last_id: input.last_id,
			page: input.page,
			search: input.search,
		}),
	});

	await logEventFromContext(
		ctx,
		'mailtrap.messages.list',
		auditPayload(input, ['inbox_id', 'page']),
		'completed',
	);
	return result ?? [];
};

/**
 * Gets the formatted HTML body of a message.
 *
 * `GET .../body.html` answers with `Content-Type: text/html`, not JSON —
 * the shared `request()` helper returns that as a raw string rather than
 * parsing it (see `corsair/async-core/request.ts`'s `getResponseBody`), so
 * it is wrapped in `{ html }` here for a consistent object-shaped output,
 * the same treatment Botpress gives `hub.getPluginCode`'s raw source string.
 */
export const getHtml: MailtrapEndpoints['messagesGetHtml'] = async (
	ctx,
	input,
) => {
	const path = await accountPath(
		ctx,
		`/inboxes/${input.inbox_id}/messages/${input.message_id}/body.html`,
	);
	const html = await mailtrapCall<string>(ctx, path);

	await logEventFromContext(
		ctx,
		'mailtrap.messages.getHtml',
		auditPayload(input, ['inbox_id', 'message_id']),
		'completed',
	);
	return { html: html ?? '' };
};
