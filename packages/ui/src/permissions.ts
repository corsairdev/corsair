import { renderBase } from './plugins/base.js';
import { renderCalBookingsCreate } from './plugins/cal/bookings-create.js';
import { renderGmailMessagesSend } from './plugins/gmail/messages-send.js';
import { renderGoogleCalendarEventsCreate } from './plugins/googlecalendar/events-create.js';
import { renderLinearIssuesCreate } from './plugins/linear/issues-create.js';
import { renderSlackMessagesPost } from './plugins/slack/messages-post.js';
import type { PermissionActionCallback, PermissionLike } from './types.js';

type Renderer = (
	permission: PermissionLike,
	onApproval: PermissionActionCallback,
	onDenial: PermissionActionCallback,
) => string;

const renderers: Record<string, Renderer> = {
	'slack:messages.post': renderSlackMessagesPost,
	'gmail:messages.send': renderGmailMessagesSend,
	'gmail:drafts.send': renderGmailMessagesSend,
	'linear:issues.create': renderLinearIssuesCreate,
	'googlecalendar:events.create': renderGoogleCalendarEventsCreate,
	'cal:bookings.create': renderCalBookingsCreate,
};

export function corsairPermissions(
	permission: PermissionLike,
	onApproval: PermissionActionCallback,
	onDenial: PermissionActionCallback,
): string {
	const key = `${permission.plugin}:${permission.endpoint}`;
	const renderer = renderers[key] ?? renderBase;
	return renderer(permission, onApproval, onDenial);
}
